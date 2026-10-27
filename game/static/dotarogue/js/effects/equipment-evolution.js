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

// Shapes follow the silhouettes of the classic icons; no icon image is drawn here.
function crystal(ctx, x, y, size, color, edge = '#e6f7ff') {
  polygon(ctx, [[x, y - size], [x + size * .65, y - size * .2], [x + size * .45, y + size * .7],
    [x - size * .45, y + size * .7], [x - size * .65, y - size * .2]], color);
  polygon(ctx, [[x, y - size + 2], [x + size * .28, y - size * .15], [x, y + size * .5],
    [x - size * .22, y - size * .1]], edge, null);
}
function shaft(ctx, color = '#9b784e') {
  polygon(ctx, [[-2, -23], [3, -23], [3, 22], [-2, 24]], color);
  polygon(ctx, [[-4, 12], [5, 12], [5, 17], [-4, 17]], '#d8bb7d');
}
function sword(ctx, level, color, edge, broad = false) {
  const tip = level === 3 ? -34 : -29;
  polygon(ctx, [[0, tip], [broad ? 7 : 5, -21], [4, 5], [0, 10], [-4, 5], [-5, -21]], color);
  polygon(ctx, [[0, tip + 3], [2, -20], [0, 6], [-2, -18]], edge, null);
  polygon(ctx, [[-3, 12], [3, 12], [3, 24], [-3, 24]], '#846046');
  polygon(ctx, [[-12, 8], [-6, 5], [6, 5], [12, 8], [8, 12], [-8, 12]], '#ccac64');
  if (level >= 2) for (const side of [-1, 1])
    polygon(ctx, [[side * 5, 6], [side * 14, -2], [side * 13, 9], [side * 7, 13]], '#e4c47f');
  if (level === 3) for (const side of [-1, 1])
    polygon(ctx, [[side * 4, -23], [side * 9, -17], [side * 6, -4], [side * 3, 4]], color);
}
function carriedIdentity(ctx, id, level, time, attack, reducedMotion) {
  if (id === 'battlefury') { ctx.translate(28, 30); battlefury(ctx, level, attack); return; }
  if (id === 'dagon') { ctx.translate(-46, 42); dagon(ctx, level, attack); return; }
  if (id === 'mjollnir' || id === 'meteorHammer') {
    shaft(ctx, id === 'mjollnir' ? '#8b7152' : '#726a59');
    const steel = id === 'mjollnir' ? '#769bc3' : '#85897b';
    polygon(ctx, [[-15, -27], [14, -27], [18, -18], [13, -10], [-15, -10], [-18, -18]], steel);
    polygon(ctx, [[-12, -25], [11, -25], [14, -20], [-13, -20]], '#d7e1e0', null);
    crystal(ctx, 0, -18, 6, id === 'mjollnir' ? '#4ca4f2' : '#82b742');
    if (level >= 2) for (const side of [-1, 1])
      polygon(ctx, [[side * 12, -26], [side * 23, -31], [side * 20, -17], [side * 14, -12]], '#a8c0d3');
    if (level === 3) for (const side of [-1, 1])
      polygon(ctx, [[side * 15, -12], [side * 22, -8], [side * 16, -4], [side * 9, -9]], '#d9c17f');
    if (id === 'meteorHammer') {
      ctx.strokeStyle = '#d4c295'; ctx.lineWidth = 2;
      for (let i = 0; i < 4 + level; i++) { ctx.beginPath(); ctx.ellipse(0, -8 + i * 5, 3, 3, i % 2 * .7, 0, TAU); ctx.stroke(); }
    }
  } else if (id === 'monkeyKingBar') {
    shaft(ctx, '#86613d');
    for (const y of [-26, 16]) {
      polygon(ctx, [[-5, y], [5, y], [6, y + 8], [-6, y + 8]], '#d9af5d');
      polygon(ctx, [[-3, y + 1], [1, y + 1], [1, y + 7], [-3, y + 7]], '#fff0b3', null);
    }
    if (level >= 2) for (const y of [-16, 6]) polygon(ctx, [[-4, y], [4, y], [4, y + 4], [-4, y + 4]], '#e9cc7a');
    if (level === 3) for (const side of [-1, 1]) polygon(ctx, [[side * 3, -24], [side * 12, -30], [side * 10, -18], [side * 3, -14]], '#e4c47e');
  } else if (id === 'radiance' || id === 'divineRapier') {
    sword(ctx, level, id === 'radiance' ? '#e3b44e' : '#d5c38b', '#fff5ca', id === 'divineRapier');
    if (id === 'radiance') for (let i = 0; i < level; i++) {
      ctx.save(); ctx.translate((i % 2 ? -1 : 1) * 6, -19 + i * 8);
      polygon(ctx, [[0, -8], [5, -2], [2, 7], [-2, 1]], '#f5ce70', null); ctx.restore();
    }
  } else if (id === 'buriza') {
    polygon(ctx, [[-3, -24], [4, -24], [5, 24], [-3, 24]], '#836a43');
    polygon(ctx, [[-22, -17], [-9, -9], [0, -5], [9, -9], [22, -17], [19, -6], [0, 3], [-19, -6]], '#c6ac67');
    ctx.strokeStyle = '#e9efdf'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-21, -16); ctx.lineTo(0, 8); ctx.lineTo(21, -16); ctx.stroke();
    polygon(ctx, [[-2, -31], [3, -31], [2, 8], [-1, 8]], '#aabfc8');
    if (level >= 2) polygon(ctx, [[-24, -2], [-10, 4], [0, 5], [10, 4], [24, -2], [19, 8], [0, 13], [-19, 8]], '#937a45');
    if (level === 3) crystal(ctx, 0, -7, 5, '#ebc65f', '#fff3b6');
  } else if (id === 'butterfly') {
    polygon(ctx, [[-1, 24], [4, 20], [5, 7], [15, -1], [18, -20], [6, -30], [9, -14], [3, -7], [-2, -1]], '#4b9164');
    polygon(ctx, [[8, -26], [14, -19], [11, -3], [5, 1], [6, -12]], '#b7e69a', null);
    polygon(ctx, [[-7, 5], [8, 2], [11, 8], [-5, 12]], '#aeac66');
    if (level >= 2) polygon(ctx, [[-1, 4], [-14, -3], [-16, -19], [-6, -27], [-8, -12], [-2, -6]], '#78b58b');
    if (level === 3) crystal(ctx, 0, 6, 5, '#d7c66c', '#f5f0c3');
  } else if (id === 'desolator') {
    polygon(ctx, [[-3, 24], [3, 24], [4, 8], [11, -7], [16, -29], [4, -23], [0, -4], [-4, 9]], '#ae3645');
    polygon(ctx, [[13, -25], [8, -4], [3, 5], [4, -13]], '#f2a4a0', null);
    for (let i = 0; i < level + 1; i++) polygon(ctx, [[3 + i * 2, -7 - i * 7], [-3, -10 - i * 7], [5 + i * 2, -14 - i * 7]], '#d95155');
    if (level === 3) polygon(ctx, [[-4, 10], [-12, -5], [-12, -25], [-5, -18], [-2, 0]], '#d05c62');
    polygon(ctx, [[-8, 9], [7, 6], [10, 11], [-7, 15]], '#ab986e');
  } else if (id === 'aghanim' || id === 'orchid' || id === 'cyclone') {
    shaft(ctx, id === 'orchid' ? '#b89758' : id === 'cyclone' ? '#d5d1b7' : '#667e9b');
    if (id === 'cyclone') {
      ctx.strokeStyle = '#e8e8cf'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -9);
      ctx.bezierCurveTo(-19, -13, -13, -33, 1, -28); ctx.bezierCurveTo(17, -24, 13, -10, 1, -17); ctx.stroke();
      if (level >= 2) { ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, -20, 17, 9, -.3, -.5, 4.8); ctx.stroke(); }
    } else {
      crystal(ctx, 0, -22, 12, id === 'aghanim' ? '#4b8ce0' : '#b15ab8');
      polygon(ctx, [[-9, -8], [-12, -16], [-9, -27], [-6, -14], [6, -14], [9, -27], [12, -16], [9, -8]], '#c9b67a');
      if (level >= 2) for (const side of [-1, 1]) polygon(ctx, [[side * 7, -11], [side * 20, -20], [side * 17, -32], [side * 12, -21]], '#c2a363');
    }
    if (level === 3) for (const side of [-1, 1]) crystal(ctx, side * 12, -25, 5, id === 'orchid' ? '#df8cce' : '#84c8ec');
  } else if (id === 'bloodstone' || id === 'skadi') {
    const ice = id === 'skadi';
    crystal(ctx, 0, -5, 18, ice ? '#4d94ce' : '#c43558', ice ? '#e1f4ff' : '#ffd5d4');
    polygon(ctx, [[-15, 4], [-10, 13], [10, 13], [15, 4], [11, 17], [-11, 17]], ice ? '#aabed1' : '#baa068');
    if (level >= 2) for (const side of [-1, 1]) crystal(ctx, side * 15, 1, 9, ice ? '#86c8e8' : '#d24b70');
    if (level === 3) for (const side of [-1, 1]) polygon(ctx, [[side * 8, -12], [side * 15, -27], [side * 21, -8], [side * 14, -5]], ice ? '#bfe9fa' : '#d7b479');
  } else if (id === 'necronomicon') {
    polygon(ctx, [[-16, -19], [12, -23], [18, 16], [-10, 22]], '#4b4946');
    polygon(ctx, [[-13, -16], [9, -19], [13, 13], [-8, 18]], '#8e7649');
    polygon(ctx, [[-9, -12], [7, -15], [10, 10], [-5, 13]], '#293c36');
    crystal(ctx, 0, -2, 7, '#6aa977', '#dbd9a8');
    if (level >= 2) { polygon(ctx, [[12, -19], [24, -11], [24, 16], [17, 14]], '#d4caa5'); ctx.strokeStyle = '#736b58'; ctx.beginPath(); ctx.moveTo(19, -8); ctx.lineTo(21, 10); ctx.stroke(); }
    if (level === 3) for (const side of [-1, 1]) polygon(ctx, [[side * 9, -17], [side * 19, -29], [side * 18, -12], [side * 11, -8]], '#d3b578');
  } else if (id === 'vanguard') {
    polygon(ctx, [[-18, -17], [0, -24], [18, -17], [14, 9], [0, 25], [-14, 9]], '#9b8cb0');
    polygon(ctx, [[-12, -13], [0, -18], [12, -13], [8, 7], [0, 16], [-8, 7]], '#46596b');
    crystal(ctx, 0, -2, 8, '#bbc0b2', '#fff0c8');
    if (level >= 2) for (const side of [-1, 1]) polygon(ctx, [[side * 12, -15], [side * 20, -11], [side * 15, 10], [side * 10, 5]], '#c7bdc9');
    if (level === 3) polygon(ctx, [[-10, -20], [-15, -31], [0, -25], [15, -31], [10, -20]], '#e4c886');
  } else if (id === 'bladeMail') {
    polygon(ctx, [[-18, -20], [-7, -24], [-2, -17], [5, -17], [10, -24], [20, -18], [13, 8], [0, 18], [-13, 8]], '#777e86');
    polygon(ctx, [[-12, -15], [0, -10], [12, -15], [8, 7], [0, 12], [-8, 7]], '#b4bac0');
    for (const side of [-1, 1]) for (let i = 0; i < level; i++) polygon(ctx, [[side * (12 - i * 2), -13 + i * 10], [side * (25 - i * 2), -22 + i * 11], [side * (15 - i * 2), -4 + i * 10]], '#d1d5ce');
  } else if (id === 'satanic') {
    polygon(ctx, [[-14, -17], [0, -22], [14, -17], [12, 5], [0, 18], [-12, 5]], '#66597a');
    polygon(ctx, [[-9, -8], [-2, -3], [-8, 3]], '#e8dbbf', null); polygon(ctx, [[9, -8], [2, -3], [8, 3]], '#e8dbbf', null);
    polygon(ctx, [[-8, 5], [-3, 14], [0, 9], [3, 14], [8, 5]], '#e4d5be');
    if (level >= 2) for (const side of [-1, 1]) polygon(ctx, [[side * 10, -13], [side * 21, -24], [side * 20, -7], [side * 11, 3]], '#c1a8c4');
    if (level === 3) for (const side of [-1, 1]) polygon(ctx, [[side * 7, 9], [side * 18, 15], [side * 10, 20], [side * 3, 13]], '#9d759e');
  } else if (id === 'heart') {
    ctx.beginPath(); ctx.moveTo(0, 18); ctx.bezierCurveTo(-28, 0, -19, -23, -5, -14);
    ctx.quadraticCurveTo(0, -9, 5, -14); ctx.bezierCurveTo(19, -23, 28, 0, 0, 18); ctx.fillStyle = '#ad3858'; ctx.fill(); ctx.strokeStyle = '#d5b77b'; ctx.lineWidth = 3; ctx.stroke();
    polygon(ctx, [[-10, -11], [-5, -9], [-3, -1], [-7, 2]], '#f38c96', null);
    if (level >= 2) for (const side of [-1, 1]) polygon(ctx, [[side * 11, -10], [side * 23, -18], [side * 20, -1], [side * 12, 6]], '#cbae73');
    if (level === 3) polygon(ctx, [[-8, -15], [-7, -26], [0, -20], [7, -26], [8, -15]], '#f0d18b');
  }
}
function wornBoot(ctx, id, level) {
  polygon(ctx, [[-7, -12], [4, -12], [4, 0], [12, 3], [13, 9], [-8, 9]], id === 'phaseBoots' ? '#776c9e' : '#865b4f');
  polygon(ctx, [[-9, -14], [6, -14], [6, -8], [-9, -8]], '#a9aab0');
  polygon(ctx, [[-8, 6], [12, 6], [13, 10], [-8, 10]], '#c4c6bc');
  if (level >= 2) polygon(ctx, [[-8, -8], [-12, 0], [-7, 5], [-3, -4]], id === 'phaseBoots' ? '#d0c2ec' : '#d5b570');
  if (level === 3) polygon(ctx, [[-4, -13], [-6, -22], [3, -18], [6, -11], [4, 1], [-2, -1]], '#d8d5c7');
}

// Local coordinates: feet near y=16, face above y=-48. The central face/orb lane stays clear.
export function drawEvolutionEquipment(ctx, levels, {
  time = 0, attack = 0, pixel = false, reducedMotion = false, front = false
} = {}) {
  const weapons = ['battlefury', 'mjollnir', 'buriza', 'butterfly', 'radiance', 'desolator', 'monkeyKingBar', 'meteorHammer', 'divineRapier'].filter(id => rank(levels[id]));
  const tools = ['dagon', 'aghanim', 'bloodstone', 'orchid', 'skadi', 'cyclone', 'necronomicon'].filter(id => rank(levels[id]));
  const armor = ['vanguard', 'satanic', 'bladeMail', 'heart'].filter(id => rank(levels[id]));
  const boots = ['powerTreads', 'phaseBoots'].filter(id => rank(levels[id]));
  const mirrors = rank(levels.manta);
  if (!weapons.length && !tools.length && !armor.length && !boots.length && !mirrors) return;
  ctx.save(); ctx.globalCompositeOperation = 'source-over';
  ctx.lineWidth = pixel ? 2 : 1.7; ctx.lineJoin = pixel ? 'miter' : 'round';
  if (front) {
    ctx.beginPath(); ctx.rect(-130, -100, 92, 124); ctx.rect(38, -100, 92, 124);
    ctx.rect(-30, 8, 60, 24); ctx.clip();
  }
  const snap = reducedMotion ? 0 : clamp(attack, 0, 1);
  const legacy = !armor.length && !boots.length && weapons.every(id => id === 'battlefury') && tools.every(id => id === 'dagon');
  if (legacy) {
    if (rank(levels.battlefury)) battlefury(ctx, rank(levels.battlefury), snap);
    if (rank(levels.dagon)) dagon(ctx, rank(levels.dagon), snap);
    if (mirrors) mirrorBlades(ctx, mirrors, time, snap, reducedMotion, weapons.length || tools.length ? 74 : 48);
  } else {
    const left = [...weapons], right = [...tools];
    for (const id of armor) (left.length <= right.length ? left : right).push(id);
    while (left.length > right.length + 2) right.push(left.pop());
    while (right.length > left.length + 2) left.push(right.pop());
    for (const [side, items] of [[-1, left], [1, right]]) {
      const scale = items.length > 3 ? .67 : .84;
      for (let i = items.length - 1; i >= 0; i--) {
        const id = items[i], column = Math.floor(i / 3), row = i % 3;
        const sway = reducedMotion || armor.includes(id) ? 0 : Math.sin(time * 1.8 + i) * .7;
        ctx.save(); ctx.translate(side * (43 + column * 23), -53 + row * 26 + sway);
        ctx.scale(side === -1 ? 1 : -1, 1); ctx.scale(scale, scale);
        if (!armor.includes(id)) ctx.rotate(side * (.12 + snap * .09));
        carriedIdentity(ctx, id, rank(levels[id]), time, snap, reducedMotion); ctx.restore();
      }
    }
    for (let i = 0; i < boots.length; i++) for (const side of [-1, 1]) {
      ctx.save(); ctx.translate(side * (14 + i * 17), 13 + i * 2); ctx.scale(side, 1); ctx.scale(.72, .72);
      wornBoot(ctx, boots[i], rank(levels[boots[i]])); ctx.restore();
    }
    if (mirrors) mirrorBlades(ctx, mirrors, time, snap, reducedMotion, Math.max(left.length, right.length) > 3 ? 96 : 74);
  }
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
