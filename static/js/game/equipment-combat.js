import { resolveBuilds } from './equipment-builds.js?v=20261026-restore1';

export function createEquipmentCombat({ getRun, passive, damageEnemy, blocked, pulse, isElite, heal, label, basicRange }) {
  function state(run) {
    return run.skills.weaponSystem ||= {
      attackIds: new Set(), windfuryHits: 0, windfuryQueue: [], elementalHits: 0, elementalNext: 0,
      monkeyHits: 0, rapierHits: 0, inspireReadyAt: 0, meteorHold: 0,
      lifestealHeals: [], lifestealSpent: 0, shieldTier: 0, shieldElapsed: 0, shieldReady: false,
      feedbackReadyAt: {}
    };
  }

  function tier(run, id) {
    return (run.builds?.length ? run.builds : resolveBuilds(run.equipment)).find(build => build.id === id)?.tier || 0;
  }

  function feedback(run, id, color, center = run.player) {
    const s = state(run), text = label(id);
    if (!text || run.totalTime < (s.feedbackReadyAt[id] || 0)) return;
    s.feedbackReadyAt[id] = run.totalTime + 1;
    run.effects.push({ kind: 'text', build: id, tier: tier(run, id), x: center.x, y: center.y - 32,
      text, color, life: .55, maxLife: .55 });
  }

  function syncLoadout() {
    const run = getRun();
    if (!run) return;
    const s = state(run), shieldTier = tier(run, 'divineShield');
    // Called for every committed loadout, including off/on changes inside one shop.
    if (!shieldTier) { s.shieldReady = false; s.shieldElapsed = 0; }
    s.shieldTier = shieldTier;
    const windfury = tier(run, 'windfury');
    s.windfuryQueue = s.windfuryQueue.filter(attack => attack.number <= windfury);
  }

  function nearby(run, center, radius, limit, excluded = null) {
    return run.enemies.filter(enemy => !enemy.dead && enemy !== excluded
      && Math.hypot(enemy.x - center.x, enemy.y - center.y) <= radius + enemy.r
      && !blocked(center.x, center.y, enemy.x, enemy.y, 4, false))
      .sort((a, b) => Math.hypot(a.x - center.x, a.y - center.y) - Math.hypot(b.x - center.x, b.y - center.y))
      .slice(0, limit);
  }

  function impact(run, center, radius, limit, damage, color, excluded = null) {
    const targets = nearby(run, center, radius, limit, excluded);
    for (const enemy of targets) damageEnemy(enemy, damage, false);
    pulse(center.x, center.y, radius, color, .3);
    return targets;
  }

  function strike(run, target, config, damage, color) {
    const p = run.player, angle = Math.atan2(target.y - p.y, target.x - p.x);
    const dx = Math.cos(angle), dy = Math.sin(angle);
    const targets = run.enemies.filter(enemy => {
      if (enemy.dead) return false;
      const x = enemy.x - p.x, y = enemy.y - p.y, along = x * dx + y * dy;
      return along >= -enemy.r && along <= config.range + enemy.r
        && Math.hypot(x, y) <= config.range + enemy.r
        && Math.abs(x * dy - y * dx) <= config.width + enemy.r
        && !blocked(p.x, p.y, enemy.x, enemy.y, config.width, false);
    }).sort((a, b) => (a.x - b.x) * dx + (a.y - b.y) * dy).slice(0, config.targets);
    for (const enemy of targets) damageEnemy(enemy, damage, false);
    run.effects.push({ kind: 'line', weapon: config.id === 'piercingStrike' ? 'monkeyKingBar' : 'divineRapier',
      level: config.level, x1: p.x, y1: p.y, x2: p.x + dx * config.range, y2: p.y + dy * config.range,
      width: config.width * 2, color, life: .28, maxLife: .28, upgradeLevel: config.level });
  }

  function triggerElement(run, target, elemental) {
    const s = state(run), ids = new Set(run.equipment.map(item => typeof item === 'string' ? item : item.id));
    const available = [ids.has('mjollnir'), ids.has('radiance') || ids.has('meteorHammer'), ids.has('skadi')];
    const element = [0, 1, 2].map(offset => (s.elementalNext + offset) % 3).find(index => available[index]);
    if (element == null) return;
    s.elementalNext = (element + 1) % 3;
    const damage = (elemental === 2 ? 20 : 12) + run.stats.elemental * .3;
    if (element === 0) {
      const struck = new Set();
      const nextTarget = center => run.enemies.filter(enemy => !enemy.dead && enemy.hp > 0 && !struck.has(enemy)
        && Math.hypot(enemy.x - center.x, enemy.y - center.y) <= 190
        && !blocked(center.x, center.y, enemy.x, enemy.y, 4, false))
        .sort((a, b) => Math.hypot(a.x - center.x, a.y - center.y) - Math.hypot(b.x - center.x, b.y - center.y))[0];
      let from = run.player;
      let current = !target.dead && target.hp > 0 && !blocked(from.x, from.y, target.x, target.y, 4, false) ? target : null;
      // A killing basic still leaves its impact as the chain origin. Do not
      // draw or resolve a new player-to-fallback segment through a wall.
      if (!current) { from = target; current = nextTarget(from); }
      for (let jump = 0; jump < 3 && current; jump++) {
        struck.add(current);
        run.effects.push({ kind: 'line', build: 'elemental', tier: elemental, element: 'lightning',
          x1: from.x, y1: from.y, x2: current.x, y2: current.y,
          width: 3, color: '#9bdfff', life: .2, maxLife: .2 });
        damageEnemy(current, damage, false);
        from = current;
        current = nextTarget(from);
      }
    } else if (element === 1) {
      impact(run, target, 90, 6, damage, '#ffc079');
    } else {
      const targets = nearby(run, target, 120, 6);
      for (const enemy of targets) {
        damageEnemy(enemy, damage * .5, false);
        const duration = enemy.id === 'boss' ? .2 : isElite(enemy) ? .5 : 1;
        enemy.buildSlowUntil = run.totalTime + duration;
        enemy.buildSlowRatio = 1 - (elemental === 2 ? .45 : .3);
      }
      pulse(target.x, target.y, 120, '#a9e8ff', .35, 'frost');
    }
    feedback(run, 'elemental', ['#9bdfff', '#ffc079', '#a9e8ff'][element], target);
  }

  function onHit(target, hit) {
    const run = getRun();
    if (!run || !target || hit?.attackId == null || !(hit.damage > 0)) return;
    const s = state(run);
    if (s.attackIds.has(hit.attackId)) return;
    s.attackIds.add(hit.attackId);
    if (s.attackIds.size > 256) s.attackIds.delete(s.attackIds.values().next().value);

    const monkey = passive('piercingStrike');
    if (monkey && ++s.monkeyHits >= monkey.hits) {
      s.monkeyHits = 0;
      strike(run, target, monkey, hit.damage * monkey.damageRatio, '#ffd678');
    }
    const rapier = passive('divineEdge');
    if (rapier && ++s.rapierHits >= rapier.hits) {
      s.rapierHits = 0;
      strike(run, target, rapier, rapier.damage + hit.damage * rapier.attackRatio, '#fff0b3');
    }
    const cleave = tier(run, 'cleave');
    if (cleave) {
      const targets = impact(run, target, cleave === 2 ? 110 : 80, 3,
        hit.damage * (cleave === 2 ? .3 : .15), '#f0b26f', target);
      if (targets.length) feedback(run, 'cleave', '#f0b26f', target);
    }
    const windfury = tier(run, 'windfury');
    if (windfury && ++s.windfuryHits >= 4) {
      s.windfuryHits = 0;
      // The queue is short even at the attack-speed cap; retain at most 16 follow-ups.
      for (let number = 1; number <= windfury && s.windfuryQueue.length < 16; number++)
        s.windfuryQueue.push({ target, damage: hit.damage * .6, at: run.totalTime + .12 * number, number });
    }
    const elemental = tier(run, 'elemental');
    if (elemental && ++s.elementalHits >= (elemental === 2 ? 5 : 8)) {
      s.elementalHits = 0;
      triggerElement(run, target, elemental);
    }
  }

  function onActive() {
    const run = getRun();
    if (!run) return;
    const s = state(run), inspire = tier(run, 'inspire'), time = run.totalTime;
    if (!inspire || time < s.inspireReadyAt || run.player.hp <= 0) return;
    run.player.mana = Math.min(run.player.maxMana, run.player.mana + inspire * 2);
    for (const [id, key] of [['arcaneBurst', 'dagonReadyAt'], ['cyclone', 'cycloneReadyAt'],
      ['necromancy', 'necroReadyAt'], ['meteorStrike', 'meteorReadyAt']]) {
      if (!passive(id) || !Number.isFinite(run.skills[key]) || run.skills[key] <= time) continue;
      run.skills[key] = Math.max(time, run.skills[key] - inspire);
    }
    s.inspireReadyAt = time + 1;
    feedback(run, 'inspire', '#c9b5ff');
  }

  function pruneHeals(run, s) {
    while (s.lifestealHeals.length && s.lifestealHeals[0].at + 1 <= run.totalTime + 1e-9)
      s.lifestealSpent = Math.max(0, s.lifestealSpent - s.lifestealHeals.shift().amount);
  }

  function onDamage(actualLostHP) {
    const run = getRun();
    if (!run || !Number.isFinite(actualLostHP) || !(actualLostHP > 0)) return;
    const s = state(run), p = run.player, lifesteal = tier(run, 'lifesteal');
    pruneHeals(run, s);
    if (!lifesteal || !(p.hp > 0) || p.hp >= p.maxHp) return;
    const amount = Math.min(actualLostHP * (lifesteal === 2 ? .06 : .04), p.maxHp - p.hp,
      Math.max(0, p.maxHp * (lifesteal === 2 ? .03 : .02) - s.lifestealSpent));
    if (!(amount > 0)) return;
    const before = p.hp;
    heal(amount);
    const recovered = Math.max(0, Math.min(amount, p.hp - before));
    if (!(recovered > 0)) return;
    s.lifestealHeals.push({ at: run.totalTime, amount: recovered });
    s.lifestealSpent += recovered;
    feedback(run, 'lifesteal', '#a5e8b0');
  }

  function blockDamage(damage) {
    const run = getRun();
    if (!run) return false;
    syncLoadout();
    const s = state(run), p = run.player;
    if (!Number.isFinite(damage) || !(damage > 0) || !(p.hp > 0) || !s.shieldTier || !s.shieldReady) return false;
    s.shieldReady = false;
    s.shieldElapsed = 0;
    pulse(p.x, p.y, 38, '#fff0b3', .4);
    feedback(run, 'divineShield', '#fff0b3');
    return true;
  }

  function updateWindfury(run) {
    const s = state(run), p = run.player, windfury = tier(run, 'windfury');
    const pending = s.windfuryQueue;
    s.windfuryQueue = [];
    for (const attack of pending) {
      if (attack.number > windfury) continue;
      if (attack.at > run.totalTime + 1e-9) { s.windfuryQueue.push(attack); continue; }
      const target = attack.target;
      if (!(p.hp > 0) || target.dead || !(target.hp > 0) || !run.enemies.includes(target)
        || Math.hypot(target.x - p.x, target.y - p.y) > basicRange() + target.r
        || blocked(p.x, p.y, target.x, target.y, 4, false)) continue;
      damageEnemy(target, attack.damage, false);
      run.effects.push({ kind: 'line', build: 'windfury', tier: windfury,
        x1: p.x, y1: p.y, x2: target.x, y2: target.y,
        width: 3, color: '#9be9d0', life: .16, maxLife: .16 });
      feedback(run, 'windfury', '#9be9d0', target);
    }
  }

  function update(dt) {
    const run = getRun();
    if (!run || !(dt > 0)) return;
    syncLoadout();
    const s = state(run), p = run.player;
    if (s.shieldTier && !s.shieldReady && p.hp > 0) {
      s.shieldElapsed += dt;
      if (s.shieldElapsed + 1e-9 >= (s.shieldTier === 2 ? 9 : 14)) {
        s.shieldReady = true;
        s.shieldElapsed = 0;
        pulse(p.x, p.y, 30, '#fff0b3', .35);
      }
    }
    pruneHeals(run, s);
    updateWindfury(run);
    const meteor = passive('meteorStrike');
    if (!meteor || run.movedThisFrame || p.dashTime > 0 || run.skills.jump) {
      s.meteorHold = 0;
      return;
    }
    s.meteorHold = Math.min(meteor.hold, s.meteorHold + dt);
    run.skills.meteorReadyAt ??= 0;
    if (s.meteorHold + 1e-9 < meteor.hold || run.totalTime < run.skills.meteorReadyAt) return;
    const target = nearby(run, p, meteor.range, 1)[0];
    if (!target) return;
    const center = { x: target.x, y: target.y };
    const targets = nearby(run, center, meteor.radius, Infinity);
    if (!targets.length) return;
    run.skills.meteorReadyAt = run.totalTime + meteor.cooldown;
    s.meteorHold = 0;
    for (const enemy of targets) damageEnemy(enemy, meteor.damage + run.stats.elemental * meteor.magicRatio, false);
    run.effects.push({ kind: 'line', weapon: 'meteorHammer', level: meteor.level, r: meteor.radius,
      x1: center.x, y1: center.y - 150, x2: center.x, y2: center.y,
      width: 10 + meteor.level * 4, color: '#ffc27b', life: .28, maxLife: .28, upgradeLevel: meteor.level });
    pulse(center.x, center.y, meteor.radius, '#ef9e67', .4);
  }

  return { onHit, onActive, onDamage, blockDamage, syncLoadout, update };
}
