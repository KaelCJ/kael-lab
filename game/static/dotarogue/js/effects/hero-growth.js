// Original Canvas detail for existing hero events. The caller owns combat and time.
const TAU = Math.PI * 2;
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
export const heroGrowthTier = level => level >= 10 ? 3 : level >= 5 ? 2 : 1;

function shape(ctx, points, fill, stroke = '#152735') {
  ctx.beginPath();
  points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
}

function crescent(ctx, x, y, radius, color) {
  ctx.beginPath(); ctx.moveTo(x + radius * .42, y - radius);
  ctx.bezierCurveTo(x - radius * 1.25, y - radius * .6, x - radius * 1.25, y + radius * .6, x + radius * .42, y + radius);
  ctx.bezierCurveTo(x - radius * .15, y + radius * .25, x - radius * .15, y - radius * .25, x + radius * .42, y - radius);
  ctx.fillStyle = color; ctx.fill(); ctx.stroke();
}

// Returns true only when the existing effect has been drawn in full.
export function drawHeroGrowthEffect(ctx, fx, progress, {
  hero, level = 1, pixel = false, reducedMotion = false
} = {}) {
  const tier = fx.heroGrowthTier || heroGrowthTier(level);
  const supported = fx.kind === 'quills' || fx.kind === 'thunder' || fx.kind === 'lunar-impact'
    || (hero === 'rover' && fx.kind === 'muzzle')
    || fx.kind === 'kael-emp-bolt' || fx.kind === 'kael-emp-explosion';
  if (tier < 2 || !supported) return false;
  const p = clamp(progress, 0, 1);
  ctx.save(); ctx.globalCompositeOperation = 'source-over';
  ctx.lineCap = pixel ? 'butt' : 'round'; ctx.lineJoin = pixel ? 'miter' : 'round';
  if (fx.kind === 'quills') {
    ctx.translate(fx.x, fx.y);
    const reach = 24 + (reducedMotion ? .72 : p) * (fx.r - 24);
    const length = tier === 3 ? 37 : 30;
    for (let i = 0; i < 16; i++) {
      ctx.save(); ctx.rotate(i * TAU / 16); ctx.lineWidth = pixel ? 2 : 1.6;
      shape(ctx, [[reach, 0], [reach - length, -4], [reach - length + 6, 0], [reach - length, 4]], '#efdda8', '#654d35');
      ctx.strokeStyle = '#fff2c9'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(reach - length + 7, 0); ctx.lineTo(reach - 3, 0); ctx.stroke();
      if (tier === 3) {
        ctx.strokeStyle = '#e4ba78'; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(reach - 13, 0); ctx.lineTo(reach - 22, -8);
        ctx.moveTo(reach - 13, 0); ctx.lineTo(reach - 22, 8); ctx.stroke();
      }
      ctx.restore();
    }
  } else if (fx.kind === 'thunder') {
    ctx.translate(fx.x, fx.y);
    const bolt = [[-9, -190], [11, -135], [-15, -98], [9, -55], [0, 0]];
    for (const [color, width] of [['#245374', 10], ['#8fd8ff', 7], ['#f4ffff', 2]]) {
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath();
      bolt.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
    }
    ctx.strokeStyle = '#c8f6ff'; ctx.lineWidth = 2;
    for (const side of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(side * 24, -108); ctx.lineTo(side * 12, -73); ctx.lineTo(side * 21, -45); ctx.lineTo(0, 0); ctx.stroke();
    }
    ctx.strokeStyle = '#a4e3ff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(0, 0, fx.r * .9, fx.r * .46, 0, 0, TAU); ctx.stroke();
    if (tier === 3) {
      for (const side of [-1, 1]) shape(ctx, [[side * 8, -159], [side * 25, -145], [side * 15, -125]], '#e5fbff', '#387391');
      ctx.beginPath(); ctx.ellipse(0, -5, fx.r * .6, fx.r * .28, 0, 0, TAU); ctx.stroke();
    }
  } else if (fx.kind === 'lunar-impact') {
    ctx.translate(fx.x, fx.y); ctx.lineWidth = 2;
    const radius = fx.r * (.45 + (reducedMotion ? .65 : p) * .55);
    ctx.strokeStyle = '#e9edff'; ctx.beginPath(); ctx.arc(0, 0, radius, 0, TAU); ctx.stroke();
    ctx.strokeStyle = '#83a9e7'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -94); ctx.lineTo(0, -6); ctx.stroke();
    ctx.strokeStyle = '#f8f3ff'; ctx.lineWidth = 2; ctx.stroke();
    crescent(ctx, 0, -86, tier === 3 ? 15 : 11, '#e5ddff');
    if (tier === 3) {
      for (let i = 0; i < 4; i++) {
        ctx.save(); ctx.rotate(i * TAU / 4); ctx.translate(radius * .76, 0);
        shape(ctx, [[7, 0], [0, -4], [-7, 0], [0, 4]], '#ddedff', '#5073a1'); ctx.restore();
      }
    }
  } else if (fx.kind === 'muzzle') {
    ctx.translate(fx.x, fx.y); ctx.rotate(fx.angle); ctx.lineWidth = 1.5;
    shape(ctx, [[16, -4], [24, -3], [22 + fx.r, 0], [24, 3], [16, 5], [25, 0]], '#ffe8a1', '#b6723c');
    for (const side of [-1, 1]) shape(ctx, [[20, side * 2], [28, side * (tier === 3 ? 12 : 8)], [31, side * 3]], '#ffbc61', '#7d4b2e');
    if (tier === 3) { ctx.strokeStyle = '#fff7d5'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(26, 0); ctx.lineTo(22 + fx.r - 3, 0); ctx.stroke(); }
  } else if (fx.kind === 'kael-emp-bolt') {
    const dx = fx.x2 - fx.x1, dy = fx.y2 - fx.y1, length = Math.hypot(dx, dy) || 1;
    const end = reducedMotion ? 1 : clamp(p / .3, 0, 1);
    for (const [color, width] of [['#234c76', 16], ['#69cfff', 10], ['#f4ffff', 3.6]]) {
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(fx.x1, fx.y1);
      const segments = 10;
      for (let i = 1; i <= segments; i++) {
        const t = Math.min(i / segments, end), bend = i === segments || t === end ? 0 : Math.sin(fx.seed + i * 4.7) * 7;
        ctx.lineTo(fx.x1 + dx * t - dy / length * bend, fx.y1 + dy * t + dx / length * bend);
        if (t === end) break;
      }
      ctx.stroke();
    }
    if (tier === 3) {
      ctx.translate(fx.x2, fx.y2); ctx.lineWidth = 2;
      shape(ctx, [[0, -12], [7, 0], [0, 12], [-7, 0]], '#d9f9ff', '#3b94bf');
    }
  } else {
    const age = fx.maxLife - fx.life - fx.delay;
    if (age >= 0) {
      const blast = clamp(age / .24, 0, 1), radius = fx.r * (.3 + (reducedMotion ? 1 : blast) * .7);
      ctx.globalAlpha *= 1 - clamp(age / .9, 0, 1) * .6;
      ctx.translate(fx.x, fx.y); ctx.lineWidth = 2;
      ctx.strokeStyle = '#78cfff'; ctx.beginPath(); ctx.arc(0, 0, radius, 0, TAU); ctx.stroke();
      ctx.strokeStyle = '#efffff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, radius * .65, 0, TAU); ctx.stroke();
      for (let i = 0; i < (tier === 3 ? 8 : 6); i++) {
        ctx.save(); ctx.rotate(i * TAU / (tier === 3 ? 8 : 6));
        shape(ctx, [[radius, 0], [radius * .63, -5], [radius * .42, 0], [radius * .63, 5]], '#c9f5ff', '#3a7e9f'); ctx.restore();
      }
      ctx.strokeStyle = '#c4f4ff'; ctx.lineWidth = 2.5; ctx.beginPath();
      for (let i = 0; i <= 16; i++) {
        const angle = i * TAU / 16 + fx.seed, r = radius * (i % 2 ? .67 : .83);
        if (i) ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r); else ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.stroke();
    }
  }
  ctx.restore();
  return true;
}

// Called in the projectile's translated/rotated coordinates, after its base art.
export function drawHeroGrowthProjectile(ctx, projectile, {
  level = 1, pixel = false, reducedMotion = false
} = {}) {
  const tier = projectile.heroGrowthTier || heroGrowthTier(level), hero = projectile.hero;
  if (tier < 2 || projectile.illusion || projectile.kaelSpell === 'tornado') return;
  ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.lineWidth = pixel ? 2 : 1.5;
  ctx.lineCap = pixel ? 'butt' : 'round';
  if (hero === 'rover') {
    for (const side of [-1, 1]) shape(ctx, [[-6, side * 2], [-17, side * 5], [-13, side * 1]], '#ecc98b', '#704829');
    if (tier === 3) { ctx.strokeStyle = '#fff5d0'; ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(3, 0); ctx.stroke(); }
  } else if (hero === 'sf' || hero === 'tb') {
    const color = hero === 'sf' ? '#ffb283' : '#d1ffa8';
    ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    for (const side of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(3, side * 2); ctx.quadraticCurveTo(-8, side * 8, -23, side * (tier === 3 ? 5 : 3)); ctx.stroke();
    }
    if (tier === 3) shape(ctx, [[2, 0], [-5, -3], [-10, 0], [-5, 3]], color, null);
  } else if (hero === 'kael' || hero === 'conductor') {
    ctx.strokeStyle = hero === 'kael' ? '#e0c1ff' : '#c3efff';
    ctx.beginPath(); ctx.moveTo(-16, -4); ctx.lineTo(-8, 0); ctx.lineTo(-16, 4); ctx.stroke();
    if (tier === 3) { ctx.beginPath(); ctx.moveTo(-24, -4); ctx.lineTo(-16, 0); ctx.lineTo(-24, 4); ctx.stroke(); }
  } else if (hero === 'luna') {
    // The caller undoes flight rotation to draw its spinning blade.
    ctx.rotate(Math.atan2(projectile.vy, projectile.vx));
    ctx.strokeStyle = '#e0eaff';
    ctx.beginPath(); ctx.moveTo(-23, -3); ctx.lineTo(-14, 0); ctx.lineTo(-23, 3); ctx.stroke();
    if (tier === 3) { ctx.beginPath(); ctx.moveTo(-30, -3); ctx.lineTo(-21, 0); ctx.lineTo(-30, 3); ctx.stroke(); }
  }
  ctx.restore();
}

// World-space overlays use only existing active state; no events or instances are added.
export function drawHeroGrowthAreas(ctx, {
  hero, level = 1, player: p, skills: s, time = 0, pixel = false, reducedMotion = false
}) {
  const tier = heroGrowthTier(level);
  if (tier < 2 || !p || !s) return;
  const clock = reducedMotion ? 0 : time;
  ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = .85;
  ctx.lineWidth = pixel ? 2 : 1.7; ctx.lineJoin = pixel ? 'miter' : 'round';
  if (hero === 'jugg' && (s.spin || s.jump)) {
    ctx.save(); ctx.translate(p.x, p.y);
    if (s.spin) {
      const count = tier === 3 ? 6 : 3, angle = reducedMotion ? 0 : (3 - s.spin.time) * 18;
      for (let i = 0; i < count; i++) {
        ctx.save(); ctx.rotate(angle + i * TAU / count);
        shape(ctx, [[92, -4], [126, -12], [132, -2], [105, 7]], '#fff1c8', '#94734f');
        if (tier === 3) { ctx.strokeStyle = '#f5cc75'; ctx.beginPath(); ctx.moveTo(75, 2); ctx.quadraticCurveTo(100, 17, 119, 9); ctx.stroke(); }
        ctx.restore();
      }
    }
    if (s.jump && tier >= 2) {
      const steps = tier === 3 ? 4 : 2, progress = 1 - s.jump.time / s.jump.maxTime;
      ctx.globalAlpha = .8;
      ctx.strokeStyle = tier === 3 ? '#c7f4ff' : '#fff1c8'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(0, -8, 28 + progress * 14, 0, TAU); ctx.stroke();
      for (let i = 0; i < steps; i++) {
        const angle = (reducedMotion ? 0 : progress * 2.5) + i * TAU / steps;
        ctx.save(); ctx.rotate(angle); ctx.strokeStyle = tier === 3 ? '#e9fbff' : '#f7d78d'; ctx.lineWidth = tier === 3 ? 3 : 2;
        ctx.beginPath(); ctx.moveTo(24, -2); ctx.lineTo(52 + progress * 14, 0); ctx.stroke(); ctx.restore();
      }
      if (tier === 3) {
        ctx.globalAlpha = .5; ctx.strokeStyle = '#89d4ed'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, -8, 37, 0, TAU); ctx.stroke();
      }
    }
    ctx.restore();
  } else if (hero === 'scavenger' && s.rageTime > 0) {
    ctx.save(); ctx.translate(p.x, p.y);
    for (const side of [-1, 1]) {
      ctx.save(); ctx.translate(side * 28, -23); ctx.rotate(side * .18);
      shape(ctx, [[-6, -11], [6, -11], [7, 7], [3, 13], [-4, 11], [-7, 5]], '#345832', '#c5ee8c');
      ctx.fillStyle = '#b7e976'; ctx.fillRect(-3, 1, 6, 6);
      if (tier === 3) {
        ctx.strokeStyle = '#dcffb0'; ctx.beginPath(); ctx.moveTo(side * 4, -8); ctx.lineTo(side * 12, -16); ctx.lineTo(side * 8, -24); ctx.stroke();
        const lift = (clock * 13 + (side + 1) * 9) % 21;
        ctx.beginPath(); ctx.arc(side * 10, -19 - lift, 3, 0, TAU); ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();
  } else if (hero === 'luna' && s.eclipse) {
    for (const beam of s.eclipse.beams.slice(0, 10)) {
      ctx.save(); ctx.translate(beam.x, beam.y);
      if (beam.warning > 0) {
        ctx.globalAlpha *= .65; ctx.strokeStyle = '#c4d6ff';
        for (let i = 0; i < (tier === 3 ? 8 : 4); i++) {
          const angle = i * TAU / (tier === 3 ? 8 : 4);
          ctx.beginPath(); ctx.moveTo(Math.cos(angle) * 38, Math.sin(angle) * 38); ctx.lineTo(Math.cos(angle) * 49, Math.sin(angle) * 49); ctx.stroke();
        }
      } else {
        ctx.globalAlpha *= clamp(1 + beam.warning / .4, 0, 1); ctx.strokeStyle = '#6a83b9';
        crescent(ctx, 0, -111, tier === 3 ? 17 : 12, '#e8e1ff');
        for (const side of [-1, 1]) {
          ctx.strokeStyle = '#d4eaff'; ctx.beginPath(); ctx.moveTo(side * 9, -91); ctx.lineTo(side * (tier === 3 ? 16 : 10), -47); ctx.lineTo(side * 6, -7); ctx.stroke();
        }
      }
      ctx.restore();
    }
  } else if (hero === 'tb' && s.tb?.time > 0) {
    ctx.save(); ctx.translate(p.x, p.y);
    for (const side of [-1, 1]) {
      ctx.save(); ctx.scale(side, 1);
      shape(ctx, [[32, -49], [44, -64], [52, -45], [41, -35]], '#315c41', '#c7f69d');
      if (tier === 3) {
        shape(ctx, [[42, -63], [54, -80], [62, -56], [53, -47]], '#294b38', '#a7da7c');
        ctx.strokeStyle = '#e2ffb9'; ctx.beginPath(); ctx.moveTo(40, -41); ctx.lineTo(45, -50); ctx.lineTo(42, -57); ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();
  } else if (hero === 'conductor' && s.thunder) {
    let remaining = 24;
    for (const target of s.thunder.targets) {
      if (target.dead) continue;
      if (remaining-- <= 0) break;
      ctx.save(); ctx.translate(target.x, target.y - 36); ctx.lineWidth = 2;
      shape(ctx, [[0, -17], [7, -5], [0, 8], [-7, -5]], '#b5e6ff', '#315e7d');
      if (tier === 3) for (const side of [-1, 1]) {
        ctx.strokeStyle = '#e5faff'; ctx.beginPath(); ctx.moveTo(side * 12, -14); ctx.lineTo(side * 20, -5); ctx.lineTo(side * 12, 3); ctx.stroke();
      }
      ctx.restore();
    }
  } else if (hero === 'kael') {
    // Wall detail follows the same length and width as its hit region.
    for (const wall of (s.kaelIceWalls || []).slice(-24)) {
      ctx.save(); ctx.translate(wall.x, wall.y); ctx.rotate(wall.angle);
      ctx.scale(wall.halfWidth / 26, wall.halfLength / 120);
      ctx.globalAlpha *= clamp(wall.life / .5, 0, 1);
      for (let i = 0; i < (tier === 3 ? 7 : 4); i++) {
        const y = -100 + i * 200 / (tier === 3 ? 6 : 3);
        shape(ctx, [[-8, y], [0, y - 16], [8, y], [0, y + 10]], '#dbfaff', '#4f9ebc');
      }
      ctx.restore();
    }
    for (const spirit of (s.kaelSpirits || []).slice(0, 2)) {
      const bob = reducedMotion ? 0 : Math.sin(time * 7 + spirit.side) * 1.5;
      ctx.save(); ctx.translate(spirit.x, spirit.y + bob); ctx.rotate(spirit.facing); ctx.scale(spirit.scale, spirit.scale);
      ctx.globalAlpha *= clamp(spirit.life / .35, 0, 1); ctx.translate(0, -13);
      shape(ctx, [[-9, -3], [-6, -14], [0, -7], [6, -14], [9, -3]], '#ffd3a1', '#9e5836');
      if (tier === 3) { ctx.strokeStyle = '#ffedbc'; ctx.beginPath(); ctx.moveTo(-10, 4); ctx.lineTo(0, 0); ctx.lineTo(10, 4); ctx.stroke(); }
      ctx.restore();
    }
    for (const blast of s.kaelBlasts || []) {
      ctx.save(); ctx.translate(blast.x, blast.y); ctx.rotate(blast.angle);
      for (const wave of blast.waves) {
        if (wave.alpha <= 0 || wave.radius < 12) continue;
        ctx.save(); ctx.globalAlpha *= wave.alpha;
        for (const angle of [-blast.halfAngle, 0, blast.halfAngle]) {
          ctx.save(); ctx.rotate(angle); ctx.translate(wave.radius, 0);
          shape(ctx, [[6, 0], [0, -6], [-6, 0], [0, 6]], '#dbfaff', '#488faa');
          if (tier === 3) { ctx.strokeStyle = '#f1ffff'; ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(8, 0); ctx.stroke(); }
          ctx.restore();
        }
        ctx.restore();
      }
      ctx.restore();
    }
  }
  ctx.restore();
}

// World-space body detail for existing wind/meteor objects, after the base body.
export function drawHeroGrowthKaelBody(ctx, spell, object, {
  level = 1, reducedMotion = false, pixel = false
} = {}) {
  const tier = object.heroGrowthTier || heroGrowthTier(level);
  if (tier < 2 || !['tornado', 'chaos-meteor'].includes(spell)) return;
  ctx.save(); ctx.translate(object.x, object.y); ctx.globalCompositeOperation = 'source-over';
  ctx.lineWidth = pixel ? 2 : 1.6; ctx.lineJoin = pixel ? 'miter' : 'round';
  if (spell === 'tornado') {
    ctx.scale(object.scale / .56, object.scale / .56);
    const age = object.age ?? 0;
    ctx.globalAlpha *= Math.min(1, age / .06, object.life / .1);
    for (let i = 0; i < (tier === 3 ? 3 : 2); i++) {
      ctx.save(); ctx.translate(0, -44 - i * 23);
      ctx.strokeStyle = i % 2 ? '#e8f8eb' : '#b4d5cb';
      ctx.beginPath(); ctx.moveTo(-15 - i * 2, 5); ctx.quadraticCurveTo(0, -7, 15 + i * 2, 0); ctx.stroke();
      if (tier === 3) shape(ctx, [[10 + i * 2, 0], [18 + i * 2, -4], [15 + i * 2, 4]], '#d1e9d8', '#456e66');
      ctx.restore();
    }
  } else {
    const age = object.age ?? clamp(object.maxLife - object.life, 0, object.maxLife);
    const lift = reducedMotion ? 0 : 72 * Math.max(0, 1 - age / .15) ** 2;
    ctx.translate(0, -24 * object.scale - lift); ctx.rotate(reducedMotion ? 0 : (object.travel || 0) / (24 * object.scale));
    ctx.scale(object.scale / 1.45, object.scale / 1.45);
    ctx.globalAlpha *= Math.min(1, age / .04, object.life / .12);
    ctx.beginPath(); ctx.arc(0, 0, 29, 0, TAU); ctx.clip();
    for (let i = 0; i < (tier === 3 ? 5 : 3); i++) {
      ctx.save(); ctx.rotate(i * TAU / (tier === 3 ? 5 : 3));
      ctx.strokeStyle = '#743727'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-3, -5); ctx.lineTo(7, -12); ctx.lineTo(4, -22); ctx.stroke();
      ctx.strokeStyle = '#ffd18b'; ctx.lineWidth = 1.6; ctx.stroke(); ctx.restore();
    }
  }
  ctx.restore();
}
