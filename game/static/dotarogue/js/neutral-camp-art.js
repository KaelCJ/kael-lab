const TAU = Math.PI * 2;
const WORLD_SIZE = 3600;
const UI_FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
const CAMP_TEXT = {
  'zh-CN': { roshan: '肉山 · 极危', idle: '营地守卫', combat: '交战中', returning: '正在回巢', respawn: '重生' },
  'zh-TW': { roshan: '肉山 · 極危', idle: '營地守衛', combat: '交戰中', returning: '正在回巢', respawn: '重生' },
  en: { roshan: 'Roshan · Extreme danger', idle: 'Camp guardian', combat: 'In combat', returning: 'Returning home', respawn: 'Respawn' }
};

function polygon(ctx, points, fill, stroke = '#222d2b', width = 2.5) {
  ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}

function campSymbol(ctx, key, x, y, size, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(size, size);
  if (key === 'red') {
    polygon(ctx, [[0, -1], [.22, -.3], [.65, -.55], [.52, .3], [0, .85], [-.6, .3], [-.38, -.65], [-.16, -.2]], color, null);
    polygon(ctx, [[.02, -.2], [.25, .32], [0, .64], [-.22, .3]], '#ffe6a5', null);
  } else if (key === 'blue') {
    polygon(ctx, [[0, -1], [.68, 0], [0, 1], [-.68, 0]], color, null);
    ctx.strokeStyle = '#e8fbff'; ctx.lineWidth = .14;
    ctx.beginPath(); ctx.moveTo(0, -.57); ctx.lineTo(.28, 0); ctx.lineTo(0, .55); ctx.lineTo(-.28, 0); ctx.closePath(); ctx.stroke();
  } else {
    polygon(ctx, [[-1, -.55], [-.4, -.32], [0, -.72], [.4, -.32], [1, -.55], [.65, .5], [0, 1], [-.65, .5]], color, null);
    ctx.fillStyle = '#2a2421'; ctx.fillRect(-.44, .02, .28, .18); ctx.fillRect(.16, .02, .28, .18);
  }
  ctx.restore();
}

// Red and blue have a standing, grounded silhouette rather than the tank's
// rotating enemy sprite. Attack lift and stride consume the real unit state.
export function drawNeutralGuardian(ctx, e, time, reducedMotion = false) {
  const blue = e.neutralCamp.key === 'blue';
  const palette = blue
    ? { dark: '#2e4e5a', body: '#577b88', light: '#91adb5', core: '#7fddff', shade: '#233d46' }
    : { dark: '#563c30', body: '#8a5840', light: '#b87a4f', core: '#ffb25a', shade: '#3c302a' };
  const stride = e.moving && !reducedMotion ? Math.sin(e.animTime * 7) * 4 : 0;
  const windup = Math.min(1, (e.windup || 0) / .65);
  const strike = (e.attackPose || 0) > 0;
  const lift = e.windup > 0 ? 10 + (1 - windup) * 17 : strike ? -5 : 0;
  const bob = reducedMotion ? 0 : Math.sin(time * 2.3) * 1.2;
  ctx.save(); ctx.translate(Math.round(e.x), Math.round(e.y)); ctx.scale(e.r / 34, e.r / 34);
  ctx.fillStyle = '#111d19a6'; ctx.beginPath(); ctx.ellipse(0, 15, 44, 16, 0, 0, TAU); ctx.fill();
  if (time < (e.cycloneUntil || 0)) {
    ctx.strokeStyle = '#c6f3ed'; ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.ellipse(0, 8 - i * 13, 47 - i * 4, 7, 0, 0, TAU); ctx.stroke();
    }
    ctx.translate(0, reducedMotion ? -9 : -13 + Math.sin(time * 12) * 3);
  }
  if (e.neutralState === 'combat') {
    ctx.strokeStyle = e.neutralCamp.color; ctx.lineWidth = 2; ctx.globalAlpha = .7;
    ctx.beginPath(); ctx.ellipse(0, 14, 48, 20, 0, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1;
  }
  ctx.translate(0, bob);
  if (e.hitFlash > 0) ctx.filter = 'brightness(1.7)';
  polygon(ctx, [[-28, -5], [-9, -7], [-7, 16 - stride], [-32, 17 - stride], [-35, 7 - stride]], palette.dark);
  polygon(ctx, [[8, -7], [27, -5], [34, 8 + stride], [31, 17 + stride], [7, 16 + stride]], palette.dark);
  polygon(ctx, [[-29, -51], [-39, -34], [-33, -7], [-17, 1], [19, 0], [33, -11], [37, -36], [24, -53]], palette.body);
  polygon(ctx, [[-25, -47], [1, -54], [25, -47], [17, -27], [-14, -25]], palette.light, null);
  polygon(ctx, [[-30, -28], [-10, -18], [-14, -3], [-31, -10]], palette.dark, null);
  polygon(ctx, [[12, -24], [32, -29], [29, -10], [14, -3]], palette.dark, null);
  for (const side of [-1, 1]) {
    ctx.save(); ctx.scale(side, 1); ctx.translate(0, -lift);
    polygon(ctx, [[28, -50], [47, -48], [56, -32], [49, -17], [32, -21], [23, -37]], palette.dark);
    polygon(ctx, [[36, -43], [48, -42], [50, -31], [38, -27], [30, -34]], palette.light, null);
    polygon(ctx, [[43, -23], [57, -25], [62, -8], [53, 2], [39, -3], [37, -15]], palette.body);
    ctx.strokeStyle = palette.shade; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(48, -9); ctx.lineTo(49, -1); ctx.moveTo(55, -11); ctx.lineTo(56, -3); ctx.stroke();
    if (!blue) polygon(ctx, [[36, -49], [33, -66], [44, -56], [50, -62], [48, -46]], '#6c4932');
    ctx.restore();
  }
  if (blue) {
    polygon(ctx, [[-23, -59], [-18, -79], [-7, -71], [0, -83], [10, -72], [23, -77], [27, -56], [15, -46], [-13, -46]], palette.body);
    polygon(ctx, [[-20, -71], [-35, -87], [-27, -60], [-18, -55]], palette.light);
    polygon(ctx, [[18, -69], [35, -84], [28, -58], [20, -54]], palette.light);
    ctx.strokeStyle = '#b8eeff'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-10, -71); ctx.lineTo(0, -77); ctx.lineTo(11, -69); ctx.stroke();
  } else {
    polygon(ctx, [[-24, -61], [-20, -77], [-6, -85], [14, -80], [25, -65], [18, -48], [-13, -47]], palette.body);
    polygon(ctx, [[-20, -75], [-28, -92], [-11, -81], [-2, -89], [2, -78]], '#695240');
    polygon(ctx, [[12, -77], [29, -88], [22, -67]], '#695240');
    ctx.strokeStyle = palette.shade; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-10, -78); ctx.lineTo(-3, -66); ctx.lineTo(-11, -57); ctx.stroke();
  }
  ctx.fillStyle = '#172c2d'; ctx.fillRect(-14, -64, 28, 10);
  ctx.fillStyle = blue ? '#d4f7ff' : '#ffda8a'; ctx.fillRect(-11, -62, 7, 3); ctx.fillRect(5, -62, 7, 3);
  polygon(ctx, [[-9, -52], [9, -52], [5, -47], [-5, -47]], palette.shade, null);
  ctx.fillStyle = palette.shade; ctx.beginPath(); ctx.ellipse(0, -25, 15, 18, 0, 0, TAU); ctx.fill();
  const pulse = reducedMotion ? 1 : .92 + Math.sin(time * 3) * .08;
  ctx.globalAlpha = .2 * pulse; ctx.fillStyle = palette.core;
  ctx.beginPath(); ctx.ellipse(0, -25, 22, 25, 0, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
  campSymbol(ctx, blue ? 'blue' : 'red', 0, -25, 12 * pulse, palette.core);
  ctx.restore();
}

export function drawNeutralCampGround(ctx, camps, time, player) {
  for (const camp of camps) {
    const { def, unit, respawnAt } = camp;
    const empty = unit?.dead || respawnAt > time;
    const nearby = !player || Math.hypot(player.x - def.x, player.y - def.y) < def.leashRadius + 330;
    const color = empty || unit?.neutralState === 'returning' ? '#a4b0a4' : def.color;
    const roshan = def.key === 'roshan';
    ctx.save(); ctx.translate(def.x, def.y);
    ctx.fillStyle = roshan ? '#3b352b' : def.key === 'blue' ? '#354b48' : '#544532';
    ctx.globalAlpha = .5; ctx.beginPath(); ctx.ellipse(0, 9, roshan ? 121 : 75, roshan ? 60 : 38, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = .7; ctx.strokeStyle = color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(0, 9, roshan ? 99 : 58, roshan ? 45 : 27, 0, 0, TAU); ctx.stroke();
    if (roshan) {
      ctx.strokeStyle = '#9b8c73'; ctx.lineWidth = 4;
      for (const side of [-1, 1]) {
        ctx.beginPath(); ctx.moveTo(side * 90, 28); ctx.lineTo(side * 108, 2); ctx.lineTo(side * 89, -28); ctx.stroke();
      }
    } else {
      ctx.strokeStyle = color; ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const angle = i * TAU / 3 + .4;
        ctx.beginPath(); ctx.moveTo(Math.cos(angle) * 37, 9 + Math.sin(angle) * 17); ctx.lineTo(Math.cos(angle) * 63, 9 + Math.sin(angle) * 30); ctx.stroke();
      }
    }
    if (empty) { ctx.globalAlpha = .45; campSymbol(ctx, def.key, 0, 8, roshan ? 19 : 14, color); }
    if (nearby) {
      ctx.globalAlpha = unit?.neutralState === 'combat' ? .48 : .23;
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash([12, 11]);
      ctx.beginPath(); ctx.arc(0, 0, def.leashRadius, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
      ctx.globalAlpha = .7;
      for (let i = 0; i < 4; i++) {
        const angle = i * Math.PI / 2;
        const x = Math.cos(angle) * def.leashRadius, y = Math.sin(angle) * def.leashRadius;
        ctx.beginPath(); ctx.moveTo(x - Math.cos(angle) * 8, y - Math.sin(angle) * 8); ctx.lineTo(x + Math.cos(angle) * 8, y + Math.sin(angle) * 8); ctx.stroke();
      }
    }
    if (!empty && unit?.windup > 0) {
      ctx.save(); ctx.translate(unit.x - def.x, unit.y - def.y);
      const radius = roshan ? 210 : 100;
      const remaining = Math.min(1, unit.windup / (roshan ? unit.enraged ? .7 : .95 : .65));
      ctx.fillStyle = color; ctx.globalAlpha = .13 + (1 - remaining) * .08;
      ctx.beginPath(); ctx.arc(0, 0, radius, 0, TAU); ctx.fill();
      ctx.globalAlpha = .95; ctx.strokeStyle = '#17251e'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(0, 0, radius, 0, TAU); ctx.stroke();
      ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.stroke();
      ctx.globalAlpha = .65; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, radius * remaining, 0, TAU); ctx.stroke();
      if (roshan) {
        const angle = Math.atan2(unit.chargeY, unit.chargeX);
        ctx.globalAlpha = .08; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 480, angle - .25, angle + .25); ctx.closePath(); ctx.fill();
        ctx.globalAlpha = .58; ctx.lineWidth = 2; ctx.setLineDash([10, 8]);
        ctx.beginPath(); ctx.moveTo(Math.cos(angle - .25) * radius, Math.sin(angle - .25) * radius); ctx.lineTo(Math.cos(angle - .25) * 480, Math.sin(angle - .25) * 480);
        ctx.moveTo(Math.cos(angle + .25) * radius, Math.sin(angle + .25) * radius); ctx.lineTo(Math.cos(angle + .25) * 480, Math.sin(angle + .25) * 480); ctx.stroke(); ctx.setLineDash([]);
      }
      ctx.restore();
    }
    ctx.restore();
  }
}

function remainingTime(respawnAt, time) {
  const seconds = Math.max(0, Math.ceil(respawnAt - time));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

// Drawn after actors, with body/caption roles matching the game UI's 14/12px.
export function drawNeutralCampLabels(ctx, camps, time, player, locale = 'zh-CN') {
  const text = CAMP_TEXT[locale] || CAMP_TEXT['zh-CN'];
  for (const { def, unit, respawnAt } of camps) {
    const empty = unit?.dead || respawnAt > time;
    const title = def.key === 'roshan' ? text.roshan : (def.name[locale] || def.name['zh-CN']);
    const state = empty ? `${text.respawn} ${remainingTime(respawnAt, time)}` : text[unit?.neutralState || 'idle'];
    ctx.save(); ctx.font = `600 14px ${UI_FONT}`;
    const width = Math.ceil(Math.max(ctx.measureText(title).width, ctx.measureText(state).width)) + 42;
    let y = def.y + (def.key === 'roshan' ? 154 : 115);
    for (const actor of [unit, player]) {
      if (!actor || actor.dead) continue;
      const radius = actor.radius || actor.r || 20;
      if (Math.abs(actor.x - def.x) < width / 2 + radius && actor.y + radius > y - 24 && actor.y - radius - 80 < y + 24) y = actor.y + radius + 29;
    }
    const x = def.x - width / 2;
    ctx.fillStyle = '#14251ff0'; ctx.fillRect(x, y - 24, width, 49);
    ctx.strokeStyle = empty ? '#7f9286' : def.color; ctx.lineWidth = 1.5; ctx.strokeRect(x, y - 24, width, 49);
    campSymbol(ctx, def.key, x + 15, y - 7, 7, empty ? '#a4b0a4' : def.color);
    ctx.fillStyle = '#fff4d8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(title, def.x + 7, y - 9);
    ctx.font = `400 12px ${UI_FONT}`; ctx.fillStyle = empty ? '#c8d4ca' : def.key === 'roshan' ? '#ffd198' : '#dcebdc';
    ctx.fillText(state, def.x, y + 11); ctx.restore();
  }
}

export function drawNeutralMinimap(ctx, camps, { w = 160, h = 160, time = 0 } = {}) {
  ctx.save();
  for (const { def, unit, respawnAt } of camps) {
    const empty = unit?.dead || respawnAt > time;
    const x = def.x / WORLD_SIZE * w, y = def.y / WORLD_SIZE * h;
    const size = def.key === 'roshan' ? 5.5 : 4.5;
    const color = empty || unit?.neutralState === 'returning' ? '#bac5b9' : def.color;
    ctx.fillStyle = '#11241e'; ctx.beginPath(); ctx.arc(x, y, size + 2, 0, TAU); ctx.fill();
    if (empty) {
      ctx.strokeStyle = color; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x, y, size - 1, 0, TAU); ctx.moveTo(x - size * .6, y + size * .6); ctx.lineTo(x + size * .6, y - size * .6); ctx.stroke();
    } else {
      campSymbol(ctx, def.key, x, y, size, color);
      if (unit?.neutralState === 'combat') {
        ctx.strokeStyle = '#fff3c7'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(x, y, size + 2.5, 0, TAU); ctx.stroke();
      } else if (unit?.neutralState === 'returning') {
        ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.setLineDash([2, 2]);
        ctx.beginPath(); ctx.arc(x, y, size + 2.5, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
      }
    }
  }
  ctx.restore();
}
