import { resolveBuilds } from './equipment-builds.js?v=20261030-equipment18';
import { attackPower, skillPower } from './combat-damage.js?v=20261030-skill-power1';

export function createEquipmentCombat({ getRun, passive, damageEnemy, blocked, pulse, isElite, heal, label, basicRange, cooldown = value => value }) {
  function state(run) {
    return run.skills.weaponSystem ||= {
      attackIds: new Set(), godsealAttackIds: new Set(), windfuryHits: 0, windfuryQueue: [], elementalHits: 0, elementalNext: 0,
      monkeyHits: 0, rapierHits: 0, madmoonHits: 0, crescentHits: 0, jasperHits: 0, havocCharges: 0, inspireReadyAt: 0, meteorHold: 0,
      lifestealHeals: [], lifestealSpent: 0, shieldTier: 0, shieldElapsed: 0, shieldReady: false,
      holyCharges: 0, carnageCharges: 0, soulHeartClock: 0, earthCoreClock: 0,
      feedbackReadyAt: {}, growth: {
        godsealBlade: { points: 0, readyAt: 0 }, calamityRing: { points: 0, readyAt: 0 }
      }
    };
  }

  function growthStage(points) {
    return points >= 360 ? 3 : points >= 180 ? 2 : points >= 60 ? 1 : 0;
  }

  function growthEntry(run, id) {
    return state(run).growth[id] ||= { points: 0, readyAt: 0 };
  }

  function activeGrowth(run, id) {
    return run.equipment.some(item => item?.id === id) ? growthEntry(run, id) : null;
  }

  function addGrowth(run, points) {
    if (!(points > 0)) return;
    const ids = ['godsealBlade', 'calamityRing'];
    for (const id of ids) {
      const entry = activeGrowth(run, id);
      if (!entry) continue;
      const before = entry.points;
      entry.points = Math.min(360, before + points);
      if (entry.points !== before) {
        const tier = growthStage(entry.points);
        if (growthStage(before) !== tier) {
          const name = label(id) || (id === 'godsealBlade' ? '封神之刃' : '灾星之戒');
          run.effects.push({ kind: 'text', x: run.player.x, y: run.player.y - 38,
            text: `${name} · ${entry.points}/360`, color: id === 'godsealBlade' ? '#ffcf78' : '#d0a8ff', life: .6, maxLife: .6 });
        }
      }
    }
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
    for (const enemy of targets) damageEnemy(enemy, damage, { source: 'equipment' });
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
    for (const enemy of targets) damageEnemy(enemy, damage, { source: 'equipment' });
    run.effects.push({ kind: 'line', weapon: config.weapon || (config.id === 'piercingStrike' ? 'monkeyKingBar' : 'divineRapier'),
      level: config.level, x1: p.x, y1: p.y, x2: p.x + dx * config.range, y2: p.y + dy * config.range,
      width: config.width * 2, color, life: .28, maxLife: .28, upgradeLevel: config.level });
  }

  function triggerElement(run, target, elemental) {
    const s = state(run), ids = new Set(run.equipment.map(item => typeof item === 'string' ? item : item.id));
    const available = [ids.has('mjollnir'), ids.has('radiance') || ids.has('meteorHammer'), ids.has('skadi')];
    const element = [0, 1, 2].map(offset => (s.elementalNext + offset) % 3).find(index => available[index]);
    if (element == null) return;
    s.elementalNext = (element + 1) % 3;
    const damage = (elemental === 2 ? 20 : 12) + attackPower(run) * .3;
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
        damageEnemy(current, damage, { source: 'equipment' });
        from = current;
        current = nextTarget(from);
      }
    } else if (element === 1) {
      impact(run, target, 90, 6, damage, '#ffc079');
    } else {
      const targets = nearby(run, target, 120, 6);
      for (const enemy of targets) {
        damageEnemy(enemy, damage * .5, { source: 'equipment' });
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
    const firstReaction = !s.attackIds.has(hit.attackId);
    if (firstReaction) {
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
      const maul = passive('demagickingMaul');
      if (maul && hit.type === 'melee') {
        const targets = impact(run, target, maul.radius, Infinity, hit.damage * maul.damageRatio, '#e6c88e', target);
        if (targets.length) feedback(run, 'demagickingMaul', '#e6c88e', target);
      }
      const disaster = passive('shadowDisaster');
      const procRoll = hit.attackId == null ? 0 : (((hit.attackId * 1103515245 + 12345) >>> 0) / 4294967296);
      if (disaster && procRoll < disaster.chance) {
        const struck = new Set([target]);
        let from = target;
        let current = target;
        for (let jump = 0; jump <= disaster.jumps; jump++) {
          if (!current || current.dead) break;
          damageEnemy(current, disaster.damage + attackPower(run) * .35, { source: 'equipment' });
          run.effects.push({ kind: 'line', weapon: 'shadowDisaster', level: disaster.level,
            x1: from.x, y1: from.y, x2: current.x, y2: current.y,
            width: 3 + disaster.level, color: '#b58cff', life: .22, maxLife: .22 });
          const next = nearby(run, current, disaster.radius, 1, current).find(enemy => !struck.has(enemy));
          if (!next) break;
          struck.add(next); from = current; current = next;
        }
        feedback(run, 'shadowDisaster', '#b58cff', target);
      }
      const havoc = passive('havocHammer');
      if (havoc && procRoll < havoc.chance) {
        const struck = new Set([target]);
        let from = target, current = target;
        for (let jump = 0; jump <= havoc.jumps; jump++) {
          if (!current || current.dead) break;
          damageEnemy(current, havoc.damage + attackPower(run) * .3, { source: 'equipment' });
          run.effects.push({ kind: 'line', weapon: 'havocHammer', level: havoc.level,
            x1: from.x, y1: from.y, x2: current.x, y2: current.y,
            width: 4 + havoc.level, color: '#ff9e68', life: .22, maxLife: .22 });
          const next = nearby(run, current, havoc.radius, 1, current).find(enemy => !struck.has(enemy));
          if (!next) break;
          struck.add(next); from = current; current = next;
        }
        feedback(run, 'havocHammer', '#ff9e68', target);
      }
      const pin = passive('pinOfTheSea');
      if (pin && procRoll < pin.chance) {
        const totalAttributes = (run.stats.strength || 0) + (run.stats.agility || 0) + (run.stats.intelligence || 0);
        const bonus = totalAttributes * pin.factor;
        if (bonus > 0) {
          damageEnemy(target, bonus, { source: 'equipment' });
          pulse(target.x, target.y, target.r + 10, '#f7e3a4', .24);
          feedback(run, 'pinOfTheSea', '#f7e3a4', target);
        }
      }
      const oath = passive('yashaKayaSange');
      if (oath && procRoll < oath.chance) {
        const totalAttributes = (run.stats.strength || 0) + (run.stats.agility || 0) + (run.stats.intelligence || 0);
        const bonus = totalAttributes * oath.factor;
        if (bonus > 0) {
          damageEnemy(target, bonus, { source: 'equipment' });
          pulse(target.x, target.y, target.r + 8, '#d6b7ff', .2);
          feedback(run, 'yashaKayaSange', '#d6b7ff', target);
        }
      }
      const eliminator = passive('eliminator');
      if (eliminator && !target.dead && target.maxHp > 0 && hit.damage >= target.maxHp * eliminator.threshold) {
        damageEnemy(target, hit.damage * eliminator.ratio, { source: 'equipment' });
        pulse(target.x, target.y, target.r + 12, '#fff0b3', .28);
        feedback(run, 'eliminatorOfInfinite', '#fff0b3', target);
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
  }

  function onBasicHitComplete(target, hit) {
    const run = getRun();
    if (!run || !target || hit?.attackId == null || !(hit.damage > 0)) return;
    const s = state(run);
    // The caller has completed every existing hero and equipment reaction.
    // Consume the first direct hit even if those reactions killed its target.
    const godseal = hit.godsealSnapshot;
    if (godseal && !s.godsealAttackIds.has(hit.attackId)) {
      s.godsealAttackIds.add(hit.attackId);
      if (s.godsealAttackIds.size > 256) s.godsealAttackIds.delete(s.godsealAttackIds.values().next().value);
      if (activeGrowth(run, 'godsealBlade') && !target.dead) {
        const bonus = hit.damage * godseal.ratio * godseal.q;
        if (bonus > 0) {
          damageEnemy(target, bonus, { source: 'equipment' });
          if (run.effects.filter(effect => effect.weapon === 'godsealBlade' && effect.life > 0).length < 8) {
            run.effects.push({ kind: 'pulse', x: target.x, y: target.y, r: target.r + 8,
              level: godseal.level, growthCoefficient: godseal.q,
              color: '#ffcf78', life: .18, maxLife: .18, weapon: 'godsealBlade' });
          }
        }
      }
    }

    const moon = passive('madmoon');
    if (moon && hit.type === 'ranged' && ++s.madmoonHits >= moon.hits) {
      s.madmoonHits = 0;
      const targets = run.enemies.filter(enemy => !enemy.dead && enemy !== target
        && Math.hypot(enemy.x - target.x, enemy.y - target.y) <= moon.range + enemy.r
        && !blocked(run.player.x, run.player.y, enemy.x, enemy.y, 4, false))
        .sort((a, b) => Math.hypot(a.x - target.x, a.y - target.y) - Math.hypot(b.x - target.x, b.y - target.y))
        .slice(0, moon.targets);
      for (const enemy of targets) {
        damageEnemy(enemy, hit.damage * moon.damageRatio, { source: 'equipment' });
        run.effects.push({ kind: 'line', weapon: 'shineMadmoon', level: moon.level,
          x1: target.x, y1: target.y, x2: enemy.x, y2: enemy.y,
          width: 3 + moon.level, color: '#e8c7ff', life: .22, maxLife: .22 });
      }
      if (targets.length) feedback(run, 'madmoon', '#e8c7ff', target);
    }
    const crescent = passive('crescentVolley');
    if (crescent && hit.type === 'ranged' && ++s.crescentHits >= crescent.hits) {
      s.crescentHits = 0;
      const targets = run.enemies.filter(enemy => !enemy.dead && enemy !== target
        && Math.hypot(enemy.x - target.x, enemy.y - target.y) <= crescent.range + enemy.r
        && !blocked(run.player.x, run.player.y, enemy.x, enemy.y, 4, false))
        .sort((a, b) => Math.hypot(a.x - target.x, a.y - target.y) - Math.hypot(b.x - target.x, b.y - target.y))
        .slice(0, crescent.targets);
      for (const enemy of targets) {
        damageEnemy(enemy, hit.damage * crescent.damageRatio, { source: 'equipment' });
        run.effects.push({ kind: 'line', weapon: 'crescentBow', level: crescent.level,
          x1: target.x, y1: target.y, x2: enemy.x, y2: enemy.y,
          width: 3 + crescent.level, color: '#ffd878', life: .22, maxLife: .22 });
      }
      if (targets.length) feedback(run, 'crescentBow', '#ffd878', target);
    }
    const jasper = passive('jasperDaggers');
    if (jasper && ++s.jasperHits >= jasper.hits) {
      s.jasperHits = 0;
      strike(run, target, { ...jasper, id: 'jasperDaggers', weapon: 'jasperDaggers' }, hit.damage * jasper.damageRatio, '#72e4d3');
      feedback(run, 'jasperDaggers', '#72e4d3', target);
    }
  }

  function activeSnapshot() {
    const run = getRun();
    if (!run) return null;
    const chase = passive('calamityChase'), growth = activeGrowth(run, 'calamityRing');
    if (!chase || !growth) return null;
    return {
      level: chase.level, q: [.25, .5, .75, 1][growthStage(growth.points)],
      skillPower: skillPower(run), baseDamage: chase.baseDamage, attackRatio: chase.attackRatio,
      targets: chase.targets, range: chase.range, cooldown: chase.cooldown
    };
  }

  function onActive(activeSnapshotValue = null) {
    const run = getRun();
    if (!run) return;
    const s = state(run), inspire = tier(run, 'inspire'), time = run.totalTime;
    const aether = passive('aetherRing');
    if (aether && run.player.hp > 0) {
      run.player.mana = Math.min(run.player.maxMana, run.player.mana + aether.mana);
      feedback(run, 'aetherRing', '#b9dcff');
    }
    if (inspire && time >= s.inspireReadyAt && run.player.hp > 0) {
      run.player.mana = Math.min(run.player.maxMana, run.player.mana + inspire * 2);
      for (const [id, key] of [['arcaneBurst', 'dagonReadyAt'], ['cyclone', 'cycloneReadyAt'],
        ['necromancy', 'necroReadyAt'], ['meteorStrike', 'meteorReadyAt']]) {
        if (!passive(id) || !Number.isFinite(run.skills[key]) || run.skills[key] <= time) continue;
        run.skills[key] = Math.max(time, run.skills[key] - inspire);
      }
      s.inspireReadyAt = time + 1;
      feedback(run, 'inspire', '#c9b5ff');
    }

    const holy = passive('holyPulse');
    if (holy) {
      s.holyCharges += 1;
      if (s.holyCharges >= holy.threshold) {
        s.holyCharges = 0;
        const targets = nearby(run, run.player, holy.radius, Infinity);
        const damage = holy.damage + skillPower(run) * holy.attackRatio;
        for (const target of targets) damageEnemy(target, damage, { source: 'equipment', resolved: true });
        pulse(run.player.x, run.player.y, holy.radius, '#fff0b3', .42);
        feedback(run, 'holyPulse', '#fff0b3');
      }
    }
    const carnage = passive('cloakOfCarnage');
    if (carnage) {
      s.carnageCharges += 1;
      if (s.carnageCharges >= carnage.threshold) {
        s.carnageCharges = 0;
        const primary = nearby(run, run.player, carnage.range, 1)[0];
        if (primary) {
          const targets = nearby(run, primary, carnage.radius, Infinity);
          for (const target of targets) {
            damageEnemy(target, carnage.damage + skillPower(run) * carnage.attackRatio, { source: 'equipment' });
            if (!target.dead) damageEnemy(target, target.hp * carnage.currentHpRatio, { source: 'equipment' });
          }
          pulse(primary.x, primary.y, carnage.radius, '#ef8ca8', .5);
          feedback(run, 'cloakOfCarnage', '#ef8ca8', primary);
        }
      }
    }
    const havoc = passive('havocHammer');
    if (havoc) {
      s.havocCharges += 1;
      if (s.havocCharges >= havoc.threshold) {
        s.havocCharges = 0;
        const targets = nearby(run, run.player, havoc.impactRadius, Infinity);
        for (const target of targets) damageEnemy(target, havoc.impactDamage + skillPower(run) * havoc.attackRatio, { source: 'equipment' });
        if (targets.length) {
          pulse(run.player.x, run.player.y, havoc.impactRadius, '#ff9e68', .42);
          feedback(run, 'havocHammer', '#ff9e68');
        }
      }
    }
    for (const [id, color] of [['nullifier', '#d6d6e8'], ['paladinSword', '#b7e6ff'], ['netherInfiltrator', '#9ee7b3']]) {
      const config = passive(id);
      if (!config) continue;
      const target = nearby(run, run.player, config.range, 1)[0];
      if (!target) continue;
      damageEnemy(target, config.damage + skillPower(run) * config.attackRatio, { source: 'equipment' });
      target.nullifiedUntil = run.totalTime + config.duration;
      target.nullifiedRatio = id === 'nullifier' ? .12 : .08;
      pulse(target.x, target.y, target.r + 14, color, .3);
      feedback(run, id, color, target);
    }
    const ice = passive('iceDragon');
    if (ice) {
      const target = nearby(run, run.player, ice.range, 1)[0];
      if (target) {
        damageEnemy(target, ice.damage + skillPower(run) * ice.attackRatio, { source: 'equipment' });
        target.skadiSlowUntil = Math.max(target.skadiSlowUntil || 0, run.totalTime + ice.duration);
        target.skadiSlowRatio = Math.min(target.skadiSlowRatio || 1, 1 - ice.slow);
        run.effects.push({ kind: 'pulse', x: target.x, y: target.y, r: target.r + 16, color: '#bcecff', life: .35, maxLife: .35 });
        feedback(run, 'iceDragon', '#bcecff', target);
      }
    }
    const grimoire = passive('meteorGrimoire');
    if (grimoire) {
      const targets = nearby(run, run.player, grimoire.pulseRadius, Infinity);
      for (const target of targets) {
        const duration = target.id === 'boss' ? grimoire.pulseDuration * .2 : isElite(target) ? grimoire.pulseDuration * .5 : grimoire.pulseDuration;
        target.cycloneUntil = Math.max(target.cycloneUntil || 0, time + duration);
      }
      if (targets.length) {
        pulse(run.player.x, run.player.y, grimoire.pulseRadius, '#d8c2ff', .42);
        feedback(run, 'meteorGrimoire', '#d8c2ff');
      }
    }
    const chase = activeSnapshotValue || activeSnapshot(), growth = activeGrowth(run, 'calamityRing');
    if (!chase || !growth || run.player.hp <= 0 || time < growth.readyAt) return;
    const legal = run.enemies.filter(enemy => !enemy.dead
      && Math.hypot(enemy.x - run.player.x, enemy.y - run.player.y) <= chase.range + enemy.r
      && !blocked(run.player.x, run.player.y, enemy.x, enemy.y, 4, false));
    const rank = enemy => enemy.id === 'boss' ? 2 : isElite(enemy) ? 1 : 0;
    legal.sort((a, b) => rank(b) - rank(a)
      || Math.hypot(a.x - run.player.x, a.y - run.player.y) - Math.hypot(b.x - run.player.x, b.y - run.player.y));
    const primary = legal[0];
    if (!primary) return;
    const targets = [primary, ...legal.filter(enemy => enemy !== primary)
      .sort((a, b) => Math.hypot(a.x - run.player.x, a.y - run.player.y) - Math.hypot(b.x - run.player.x, b.y - run.player.y))]
      .slice(0, chase.targets);
    if (!targets.length) return;
    const budget = (chase.baseDamage + chase.skillPower * chase.attackRatio) * chase.q;
    growth.readyAt = time + chase.cooldown;
    for (let i = 0; i < targets.length; i++) {
      const share = targets.length === 1 ? 1 : (i === 0 ? 2 : 1) / (targets.length + 1);
      damageEnemy(targets[i], budget * share, { source: 'equipment' });
      run.effects.push({ kind: 'line', build: 'calamityRing', level: chase.level,
        growthCoefficient: chase.q,
        x1: run.player.x, y1: run.player.y, x2: targets[i].x, y2: targets[i].y,
        width: 3 + chase.level, color: '#d0a8ff', life: .24, maxLife: .24 });
    }
    feedback(run, 'calamityRing', '#d0a8ff', targets[0]);
  }

  function onKill(enemy, rewards = true) {
    const run = getRun();
    if (!run || !enemy || !rewards || enemy.summoned) return;
    const points = enemy.id === 'boss' ? 6 : isElite(enemy) ? 3 : 1;
    addGrowth(run, points);
    const heart = passive('soulHeart');
    if (heart) {
      run.player.maxHp += heart.killHp;
      run.player.hp = Math.min(run.player.maxHp, run.player.hp + heart.killHp);
      feedback(run, 'soulHeart', '#b9e78c');
    }
    const earth = passive('earthCore');
    if (earth) {
      run.player.maxHp += earth.killHp;
      run.player.hp = Math.min(run.player.maxHp, run.player.hp + earth.killHp);
      feedback(run, 'earthCore', '#ff9e68');
    }
  }

  // Basic attacks capture this at the moment their anticipation starts. The
  // hit handler may resolve later, after a shop swap or a growth threshold;
  // only the presence check at hit time is allowed to change the outcome.
  function basicAttackSnapshot() {
    const run = getRun();
    if (!run) return null;
    const godseal = passive('godsealMark'), growth = activeGrowth(run, 'godsealBlade');
    if (!godseal || !growth) return null;
    return { ratio: godseal.ratio, q: [.25, .5, .75, 1][growthStage(growth.points)], level: godseal.level };
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
      damageEnemy(target, attack.damage, { source: 'equipment' });
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
    const heart = passive('soulHeart');
    if (heart) {
      s.soulHeartClock -= dt;
      while (s.soulHeartClock <= 0) {
        s.soulHeartClock += heart.interval;
        const targets = nearby(run, p, heart.radius, Infinity);
        for (const enemy of targets) damageEnemy(enemy, heart.damage + p.hp * heart.healthRatio, { source: 'equipment' });
        if (targets.length) pulse(p.x, p.y, heart.radius, '#ffb66d', .28);
      }
    } else s.soulHeartClock = 0;
    const earth = passive('earthCore');
    if (earth) {
      s.earthCoreClock -= dt;
      while (s.earthCoreClock <= 0) {
        s.earthCoreClock += earth.interval;
        const targets = nearby(run, p, earth.radius, Infinity);
        for (const enemy of targets) damageEnemy(enemy, earth.damage + p.hp * earth.healthRatio, { source: 'equipment' });
        if (targets.length) pulse(p.x, p.y, earth.radius, '#ff9e68', .26);
      }
    } else s.earthCoreClock = 0;
    const meteor = passive('meteorStrike'), grimoire = passive('meteorGrimoire'), interrupted = run.movedThisFrame || p.dashTime > 0 || run.skills.jump;
    if (interrupted) { s.meteorHold = 0; s.grimoireHold = 0; return; }
    const castMeteor = (config, holdKey, readyKey, weapon, color, afterglow = .6) => {
      if (!config) return;
      s[holdKey] = Math.min(config.hold, (s[holdKey] || 0) + dt);
      run.skills[readyKey] ??= 0;
      if (s[holdKey] + 1e-9 < config.hold || run.totalTime < run.skills[readyKey]) return;
      const target = nearby(run, p, config.range, 1)[0];
      if (!target) return;
      const center = { x: target.x, y: target.y }, targets = nearby(run, center, config.radius, Infinity);
      if (!targets.length) return;
      run.skills[readyKey] = run.totalTime + cooldown(config.cooldown, run);
      s[holdKey] = 0;
      for (const enemy of targets) damageEnemy(enemy, config.damage + skillPower(run) * config.attackRatio, { source: 'equipment' });
      const impactDuration = .42, glow = Math.max(0, Number(config.afterglow ?? afterglow) || 0), effectLife = impactDuration + glow;
      run.effects.push({ kind: 'line', weapon, level: config.level, r: config.radius,
        x1: center.x, y1: center.y - 150, x2: center.x, y2: center.y,
        width: 10 + config.level * 4, color, life: effectLife, maxLife: effectLife, upgradeLevel: config.level,
        impactX: center.x, impactY: center.y, impactDuration, afterglow: glow,
        targets: targets.map(enemy => ({ x: enemy.x, y: enemy.y, r: enemy.r })) });
      pulse(center.x, center.y, config.radius, color, .4);
    };
    castMeteor(meteor, 'meteorHold', 'meteorReadyAt', 'meteorHammer', '#ef9e67');
    castMeteor(grimoire, 'grimoireHold', 'grimoireReadyAt', 'meteorGrimoire', '#b693eb', 1);
  }

  return { onHit, onBasicHitComplete, onActive, onKill, onDamage, blockDamage, syncLoadout, update, basicAttackSnapshot, activeSnapshot };
}
