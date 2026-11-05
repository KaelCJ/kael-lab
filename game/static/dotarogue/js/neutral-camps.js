import { NEUTRAL_CAMP_DEFS } from './neutral-camp-defs.js?v=20261105-catalog1';
import { JUNGLE_BUFFS } from './jungle-buffs.js?v=20261105-catalog1';

// Fixed jungle objectives. Timers use combat time, so menus and pause freeze them.
export function createNeutralCamps() {
  return NEUTRAL_CAMP_DEFS.map(def => ({ def, unit: null, respawnAt: 0, kills: 0 }));
}

export function neutralInRange(run, unit) {
  const def = unit.neutralCamp;
  return !def || (unit.neutralState !== 'returning'
    && Math.hypot(run.player.x - def.x, run.player.y - def.y) <= def.leashRadius);
}

export function spawnNeutralCamp(run, camp, spawn) {
  const def = camp.def, boss = def.key === 'roshan';
  const unit = spawn(boss ? 'boss' : 'tank', def.x, def.y, false, false, boss ? 'roshan' : null);
  Object.assign(unit, { neutralCamp: def, neutralState: 'idle', camp, hp: Math.round(def.hp * run.difficulty.mult * (1 + camp.kills * .25)),
    r: def.radius, speed: def.speed, damage: def.damage, value: 0, patrolClock: 0, attackClock: 1,
    windup: 0, enraged: false, enrage: 0, finalObjective: false });
  unit.maxHp = unit.hp;
  camp.unit = unit;
  camp.respawnAt = 0;
  return unit;
}

export function clearNeutralEffects(unit) {
  for (const key of ['cycloneUntil', 'skadiSlowUntil', 'buffSlowUntil', 'buildSlowUntil', 'iceDragonUntil', 'kaelSlowUntil', 'orchidUntil', 'desolateUntil', 'quillUntil', 'nullifiedUntil', 'redBurnUntil', 'redSlowUntil']) unit[key] = 0;
  unit.quillStacks = 0;
  unit.enraged = false;
  unit.enrage = 0;
}

export function updateNeutralUnit(run, unit, dt, host) {
  const def = unit.neutralCamp, p = run.player;
  const homeDistance = Math.hypot(unit.x - def.x, unit.y - def.y);
  const playerHome = Math.hypot(p.x - def.x, p.y - def.y);
  const dx = p.x - unit.x, dy = p.y - unit.y, distance = Math.hypot(dx, dy);
  unit.hitFlash = Math.max(0, unit.hitFlash - dt);
  unit.attackPose = Math.max(0, unit.attackPose - dt);
  unit.attackClock -= dt * (1 - host.auraSlow(distance));
  if (playerHome > def.leashRadius || homeDistance > def.leashRadius - unit.r) {
    if (unit.neutralState === 'combat' || homeDistance > def.leashRadius - unit.r) {
      unit.neutralState = 'returning'; unit.windup = 0;
      clearNeutralEffects(unit);
    }
  } else if (unit.neutralState === 'idle' && distance < def.aggroRadius) unit.neutralState = 'combat';

  let target = null, speed = unit.speed;
  if (unit.neutralState === 'returning') {
    unit.hp = Math.min(unit.maxHp, unit.hp + unit.maxHp * dt * .4);
    target = def; speed *= 1.6;
    if (homeDistance < 8) {
      unit.x = def.x; unit.y = def.y; unit.hp = unit.maxHp;
      unit.neutralState = 'idle'; unit.attackClock = 1; unit.patrolClock = 2;
      unit.patrolTarget = null;
    }
  } else if (unit.neutralState === 'idle') {
    unit.patrolClock -= dt;
    if (unit.patrolClock <= 0) {
      const angle = Math.random() * Math.PI * 2;
      unit.patrolTarget = { x: def.x + Math.cos(angle) * def.patrolRadius, y: def.y + Math.sin(angle) * def.patrolRadius };
      unit.patrolClock = 3 + Math.random() * 2;
    }
    target = unit.patrolTarget; speed *= .35;
  } else {
    if (run.totalTime < (unit.cycloneUntil || 0)) { unit.moving = false; return; }
    const boss = def.key === 'roshan';
    if (boss && !unit.enraged && unit.hp <= unit.maxHp * .5) {
      unit.enraged = true; unit.enrage = 999;
      host.pulse(unit.x, unit.y, 210, def.color, .65);
      host.enrage();
    }
    const slow = Math.min(1 - host.auraSlow(distance),
      run.totalTime < (unit.skadiSlowUntil || 0) ? unit.skadiSlowRatio || 1 : 1,
      run.totalTime < (unit.buffSlowUntil || 0) ? 1 - unit.buffSlow : 1,
      run.totalTime < (unit.buildSlowUntil || 0) ? unit.buildSlowRatio || 1 : 1,
      run.totalTime < (unit.iceDragonUntil || 0) ? unit.iceDragonSlow || 1 : 1,
      run.totalTime < (unit.kaelSlowUntil || 0) ? .65 : 1,
      run.totalTime < (unit.redSlowUntil || 0) ? .8 : 1);
    speed *= Math.max(boss ? .45 : .25, slow) * (unit.enraged ? 1.25 : 1);
    if (unit.windup > 0) {
      unit.windup = Math.max(0, unit.windup - dt);
      speed = 0;
      if (!unit.windup) {
        const radius = boss ? 210 : 100;
        if (distance <= radius + p.radius && !host.blocked(unit.x, unit.y, p.x, p.y, 4, false)) host.hurt(unit.damage * (unit.enraged ? 1.35 : 1), unit);
        if (boss) for (const offset of [-.25, 0, .25]) {
          const angle = Math.atan2(unit.chargeY, unit.chargeX) + offset;
          host.shoot(unit.x, unit.y, Math.cos(angle), Math.sin(angle), unit.damage * .75, 310, 13, def.color, 2, unit);
        }
        host.pulse(unit.x, unit.y, radius, def.color, .4);
        unit.attackClock = boss ? (unit.enraged ? 1.35 : 2.1) : 1.6;
        unit.attackPose = .38;
        host.attack();
      }
    } else if (unit.attackClock <= 0 && distance < (boss ? 480 : 105)
      && !host.blocked(unit.x, unit.y, p.x, p.y, 4, false)) {
      unit.windup = boss ? (unit.enraged ? .7 : .95) : .65;
      unit.chargeX = dx / Math.max(1, distance); unit.chargeY = dy / Math.max(1, distance);
      speed = 0;
    } else if (distance > unit.r + p.radius + 15) target = p;
  }
  const oldX = unit.x, oldY = unit.y;
  if (target && speed > 0) {
    const tx = target.x - unit.x, ty = target.y - unit.y, length = Math.hypot(tx, ty);
    if (length > 4) {
      const route = host.blocked(unit.x, unit.y, target.x, target.y, unit.r)
        ? host.detour(unit.x, unit.y, target.x, target.y, unit.r) : null;
      const step = Math.min(speed * dt, length);
      host.move(unit, (route?.x ?? tx / length) * step, (route?.y ?? ty / length) * step);
    }
  }
  const radius = Math.hypot(unit.x - def.x, unit.y - def.y), limit = def.leashRadius - unit.r;
  if (radius > limit && radius >= homeDistance) {
    unit.x = oldX; unit.y = oldY;
    unit.neutralState = 'returning'; unit.windup = 0; clearNeutralEffects(unit);
  }
  unit.moving = Math.hypot(unit.x - oldX, unit.y - oldY) > .1;
  if (unit.moving) unit.animTime += dt;
}

export function jungleBuffActive(run, key) {
  return (run.jungleBuffs?.[key] || 0) > run.totalTime;
}

export function jungleBuffEntries(run) {
  return Object.entries(JUNGLE_BUFFS).filter(([key]) => jungleBuffActive(run, key));
}
