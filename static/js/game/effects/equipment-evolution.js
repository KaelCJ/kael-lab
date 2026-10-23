// Original equipment silhouettes. Callers own transforms, time and combat results.
const TAU = Math.PI * 2;
const OUTLINE = '#14202b';
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const rank = value => clamp(Math.floor(Number(value) || 0), 0, 3);

function polygon(ctx, points, fill, stroke = OUTLINE) {
  ctx.beginPath();
  points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
}

function battlefury(ctx, level, attack) {
  ctx.save(); ctx.translate(-28, -30); ctx.rotate(-.24 - attack * .13);
  polygon(ctx, [[-3, -19], [3, -19], [3, 24], [-3, 26]], '#936d43');
  polygon(ctx, [[-5, 16], [4, 15], [5, 21], [-5, 23]], '#c9b68b');
  const blade = [[-2, -18], [-14, -24], [-23, -19], [-26, -7], [-19, 3], [-9, 0], [-2, -7]];
  polygon(ctx, blade, '#9eacb9');
  polygon(ctx, [[-23, -18], [-25, -7], [-19, 1], [-15, -2], [-20, -9]], '#e4edf0', null);
  if (level >= 2) {
    ctx.save(); ctx.scale(-1, 1);
    polygon(ctx, blade, '#6d879e');
    polygon(ctx, [[-23, -18], [-25, -7], [-19, 1], [-15, -2], [-20, -9]], '#d5ebef', null);
    ctx.restore();
  }
  if (level === 3) {
    for (const side of [-1, 1]) {
      ctx.save(); ctx.scale(side, 1);
      polygon(ctx, [[4, -21], [13, -29], [23, -25], [19, -20], [11, -16]], '#d4af67');
      polygon(ctx, [[22, -16], [30, -15], [29, -4], [23, 7], [19, 2], [24, -6]], '#e2c681');
      ctx.restore();
    }
  }
  polygon(ctx, [[-6, -15], [0, -20], [6, -15], [5, -6], [-5, -6]], '#d6b570');
  polygon(ctx, [[-2, -15], [2, -15], [2, -9], [-2, -9]], '#e8f7f1', null);
  ctx.restore();
}

function dagon(ctx, level, attack) {
  ctx.save(); ctx.translate(46, -42); ctx.rotate(.22 + attack * .08);
  polygon(ctx, [[-3, -2], [3, -2], [3, 29], [-3, 31]], '#70527a');
  polygon(ctx, [[-5, 17], [4, 15], [5, 21], [-4, 23]], '#ccb27e');
  if (level !== 2) {
    const tip = level === 3 ? -32 : -23;
    polygon(ctx, [[-7, -5], [-6, -17], [0, tip], [6, -17], [7, -5], [0, 2]], '#b43148');
    polygon(ctx, [[0, tip + 2], [4, -15], [1, -6], [-2, -10]], '#ffe6ca', null);
  }
  if (level >= 2) {
    for (const side of [-1, 1]) {
      polygon(ctx, [[side * 4, -3], [side * 14, -8], [side * 17, -20], [side * 12, -24],
        [side * 9, -17], [side * 9, -10]], '#c8a16e');
      polygon(ctx, [[side * 12, -26], [side * 17, -17], [side * 12, -9], [side * 8, -17]], '#ef6370');
      polygon(ctx, [[side * 12, -23], [side * 14, -17], [side * 12, -12]], '#ffe6ca', null);
    }
  }
  if (level === 3) {
    polygon(ctx, [[-9, 1], [-5, -3], [5, -3], [9, 1], [5, 5], [-5, 5]], '#d5ad77');
  }
  ctx.restore();
}

function mirrorBlades(ctx, level, time, attack, reducedMotion, offset) {
  for (const side of [-1, 1]) {
    for (let i = 0; i < level; i++) {
      const sway = reducedMotion ? 0 : Math.sin(time * 2.1 + i * 1.3) * 1.2;
      ctx.save();
      ctx.translate(side * (offset + i * 7 + attack * 2), -44 + i * 14 + sway);
      ctx.scale(side, 1); ctx.rotate(.28 + i * .14);
      polygon(ctx, [[0, -14], [7, -6], [6, 6], [1, 13], [-4, 7], [-5, -5]], '#679bc1');
      polygon(ctx, [[0, -12], [4, -5], [2, 6], [0, 9], [-2, 3]], '#ddf7ff', null);
      polygon(ctx, [[-7, 5], [5, 4], [6, 8], [-6, 9]], '#a8b6d3');
      if (level === 3) {
        polygon(ctx, [[4, -7], [10, -3], [10, 4], [6, 7]], '#b4d5ef');
      }
      ctx.restore();
    }
  }
}

// Local coordinates: feet near y=16, face above y=-48. Central front is kept clear.
export function drawEvolutionEquipment(ctx, levels, {
  time = 0, attack = 0, pixel = false, reducedMotion = false, front = false
} = {}) {
  const fury = rank(levels.battlefury), staff = rank(levels.dagon), mirrors = rank(levels.manta);
  if (!fury && !staff && !mirrors) return;
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.lineWidth = pixel ? 2 : 1.7;
  ctx.lineJoin = pixel ? 'miter' : 'round';
  if (front) {
    // Only exposed outer edges cross the hero layer: no face, orbs or mount cover.
    ctx.beginPath(); ctx.rect(-110, -96, 72, 116); ctx.rect(38, -96, 72, 116); ctx.clip();
  }
  const snap = reducedMotion ? 0 : clamp(attack, 0, 1);
  if (fury) battlefury(ctx, fury, snap);
  if (staff) dagon(ctx, staff, snap);
  if (mirrors) mirrorBlades(ctx, mirrors, time, snap, reducedMotion, fury || staff ? 74 : 48);
  ctx.restore();
}

// World-space geometry is clipped before any ornament; no damage is applied here.
export function drawEvolutionCleave(ctx, fx, progress, { pixel = false, reducedMotion = false } = {}) {
  const p = clamp(progress, 0, 1), r = Math.max(0, fx.r);
  if (!r || p >= 1) return;
  const ring = fx.mode === 'ring';
  const arc = ring ? TAU : clamp(fx.arcDegrees ?? 90, 0, 360) * Math.PI / 180;
  if (!arc) return;
  const start = -arc / 2, end = arc / 2;
  const level = Math.max(1, rank(fx.level));
  ctx.save(); ctx.translate(fx.x, fx.y); ctx.rotate(fx.angle || 0);
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha *= (1 - p) * .88;
  ctx.lineCap = 'butt'; ctx.lineJoin = pixel ? 'miter' : 'round';
  ctx.beginPath();
  if (arc < TAU) ctx.moveTo(0, 0);
  ctx.arc(0, 0, r, start, end);
  ctx.closePath(); ctx.clip();
  ctx.fillStyle = '#d6a147'; ctx.globalAlpha *= .2;
  ctx.fillRect(-r, -r, r * 2, r * 2);
  ctx.globalAlpha /= .2;
  const sweep = reducedMotion ? end : start + arc * clamp(p * 1.5, 0, 1);
  const tail = reducedMotion ? start : Math.max(start, sweep - arc * .48);
  for (let i = 0; i < level; i++) {
    const radius = r * (.86 - i * .15);
    ctx.strokeStyle = i ? '#fff0b5' : '#d9ad59';
    ctx.lineWidth = Math.max(pixel ? 3 : 2.5, r * (.07 - i * .012));
    ctx.beginPath(); ctx.arc(0, 0, radius, tail, sweep); ctx.stroke();
  }
  if (level >= 2) {
    for (let i = 0; i < 3 + level; i++) {
      const a = start + arc * (i + .5) / (3 + level), radius = r * .69;
      ctx.save(); ctx.rotate(a); ctx.translate(radius, 0);
      polygon(ctx, [[-5, -2], [3, -4], [8, 0], [-1, 3]], '#f4dd9f', null);
      ctx.restore();
    }
  }
  ctx.restore();
}

export function drawDagonFork(ctx, fx, progress, { pixel = false, reducedMotion = false } = {}) {
  const p = clamp(progress, 0, 1), level = Math.max(1, rank(fx.level));
  const targets = fx.targets.slice(0, level);
  if (!targets.length || p >= 1) return;
  ctx.save(); ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha *= (1 - p) * .95;
  ctx.lineCap = pixel ? 'butt' : 'round'; ctx.lineJoin = pixel ? 'miter' : 'round';
  // Every beam terminates on a supplied, actually struck enemy.
  for (let i = 0; i < targets.length; i++) {
    const target = targets[i], dx = target.x - fx.x, dy = target.y - fx.y;
    const distance = Math.hypot(dx, dy);
    ctx.save(); ctx.translate(fx.x, fx.y); ctx.rotate(Math.atan2(dy, dx));
    const breadth = 3 + level;
    polygon(ctx, [[0, -breadth], [distance, -1.5], [distance, 1.5], [0, breadth]], '#ba2946', null);
    ctx.strokeStyle = '#ffada6'; ctx.lineWidth = pixel ? 3 : 2.5;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(distance, 0); ctx.stroke();
    ctx.strokeStyle = '#fff1d9'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(distance, 0); ctx.stroke();
    if (!reducedMotion && distance > 16) {
      const travel = clamp(p * 1.8 - i * .06, 0, 1) * distance;
      polygon(ctx, [[travel - 6, 0], [travel, -3], [travel + 6, 0], [travel, 3]], '#fff5e2', null);
    }
    ctx.restore();
    const radius = Math.min(10, Math.max(3, target.r || 6));
    ctx.save(); ctx.translate(target.x, target.y);
    polygon(ctx, [[0, -radius], [radius * .7, 0], [0, radius], [-radius * .7, 0]], '#f47b79', '#fff0d7');
    ctx.restore();
  }
  ctx.translate(fx.x, fx.y);
  const focus = 4 + level;
  polygon(ctx, [[-focus, 0], [0, -focus], [focus, 0], [0, focus]], '#d9445f', '#ffe0bd');
  ctx.restore();
}

// Local projectile coordinates, pointing right. The solid blade lasts for its full life.
export function drawMirrorStrike(ctx, level, {
  pixel = false, reducedMotion = false, time = 0
} = {}) {
  const tier = Math.max(1, rank(level));
  ctx.save(); ctx.globalCompositeOperation = 'source-over';
  ctx.lineWidth = pixel ? 1.7 : 1.4; ctx.lineJoin = pixel ? 'miter' : 'round';
  polygon(ctx, [[-10, -4], [3, -5], [16, 0], [3, 5], [-10, 4], [-5, 0]], '#88bce1');
  polygon(ctx, [[-4, -1.5], [14, 0], [-4, 1.5]], '#f0fbff', null);
  if (tier >= 2) {
    const spread = reducedMotion ? 0 : Math.sin(time * 5) * .7;
    for (const side of [-1, 1]) {
      polygon(ctx, [[-10, side * 3], [-5, side * (10 + spread)], [10, side * 4], [3, side * 2]], '#adc8ef');
    }
  }
  if (tier === 3) {
    for (const side of [-1, 1]) {
      polygon(ctx, [[-14, side * 7], [2, side * 9], [17, side * 5], [1, side * 2], [-14, side * 3]], '#d9f3ff');
    }
    polygon(ctx, [[-11, -3], [8, -3], [23, 0], [8, 3], [-11, 3], [-6, 0]], '#abc9ea');
    polygon(ctx, [[-9, -1.5], [21, 0], [-9, 1.5]], '#ffffff', null);
    ctx.strokeStyle = '#6189b1'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-11, -5); ctx.lineTo(7, 0); ctx.lineTo(-11, 5); ctx.stroke();
  }
  ctx.restore();
}
