const TAU = Math.PI * 2;

// Consumes resolved combat events only. Coordinates and widths remain gameplay-owned.
export function drawWeaponStrike(ctx, fx, progress, { pixel, reducedMotion }) {
  if (fx.kind === 'pulse' && fx.weapon === 'godsealBlade') {
    const level = Math.max(1, Math.min(3, fx.level || 1));
    const edges = Math.max(1, Math.min(4, Math.round((fx.growthCoefficient || .25) * 4)));
    const radius = Math.max(10, Math.min(20, (fx.r || 22) * .7));
    const slash = radius * (reducedMotion ? .85 : Math.min(.85, .55 + progress * 2));
    ctx.save(); ctx.translate(fx.x, fx.y);
    ctx.lineJoin = pixel ? 'miter' : 'round'; ctx.lineCap = pixel ? 'butt' : 'round';
    // Growth closes the same seal; upgrades add strokes without enlarging it.
    for (const [color, width] of [['#49291c', 5], ['#ffcf78', 2]]) {
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath();
      for (let i = 0; i < edges; i++) {
        const angle = -Math.PI / 2 + i * TAU / 4;
        ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        ctx.lineTo(Math.cos(angle + TAU / 4) * radius, Math.sin(angle + TAU / 4) * radius);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let i = 0; i < level; i++) {
        const offset = (i - (level - 1) / 2) * 5;
        ctx.moveTo(-slash + offset, slash * .55);
        ctx.lineTo(slash + offset, -slash * .55);
      }
      ctx.stroke();
    }
    ctx.restore(); return true;
  }
  if (fx.kind !== 'line' || !['monkeyKingBar', 'divineRapier', 'meteorHammer', 'meteorGrimoire'].includes(fx.weapon)) return false;
  const level = Math.max(1, Math.min(3, fx.level || 1));
  const t = reducedMotion ? .3 : progress;
  ctx.save();
  ctx.lineJoin = pixel ? 'miter' : 'round';
  ctx.lineCap = pixel ? 'butt' : 'round';
  if (fx.weapon === 'meteorHammer' || fx.weapon === 'meteorGrimoire') {
    // Impact and damage coincide; the raised hammer is a recoil, never a delayed hit.
    const ix = Number.isFinite(fx.impactX) ? fx.impactX : fx.x2;
    const iy = Number.isFinite(fx.impactY) ? fx.impactY : fx.y2;
    ctx.translate(ix, iy);
    const impactDuration = fx.impactDuration || .42;
    const elapsed = Math.max(0, progress) * (fx.maxLife || impactDuration);
    const radius = fx.r || 64;
    if (elapsed >= impactDuration) {
      // Only a fading scorch and bounded embers remain; damage resolved on creation.
      const fade = Math.max(0, 1 - (elapsed - impactDuration) / Math.max(.001, fx.afterglow || 0));
      ctx.globalAlpha *= fade;
      ctx.fillStyle = fx.weapon === 'meteorGrimoire' ? '#342347' : '#5a3029'; ctx.beginPath(); ctx.ellipse(0, 0, radius * .62, radius * .33, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = fx.weapon === 'meteorGrimoire' ? '#b693eb' : '#b76738'; ctx.lineWidth = pixel ? 3 : 2;
      for (let i = 0; i < 5 + level * 2; i++) {
        const angle = i * TAU / (5 + level * 2), reach = radius * (.3 + i % 3 * .1);
        ctx.beginPath(); ctx.moveTo(Math.cos(angle) * 9, Math.sin(angle) * 5);
        ctx.lineTo(Math.cos(angle + .12) * reach, Math.sin(angle + .12) * reach * .55); ctx.stroke();
        const rise = reducedMotion ? 0 : (elapsed - impactDuration) * (7 + i % 3 * 3);
        ctx.fillStyle = fx.weapon === 'meteorGrimoire' ? (i % 2 ? '#9f7dd2' : '#d8c2ff') : (i % 2 ? '#d98442' : '#e8ac61');
        ctx.fillRect(Math.cos(angle) * reach * .8 - 1.5, Math.sin(angle) * reach * .44 - rise - 1.5, 3, 3);
      }
      ctx.restore();
      return true;
    }
    const impactT = reducedMotion ? .3 : Math.min(1, elapsed / impactDuration);
    const spread = radius * (.2 + impactT * .8), alpha = 1 - impactT * .35;
    ctx.globalAlpha *= alpha;
    ctx.fillStyle = fx.weapon === 'meteorGrimoire' ? '#b693eb' : '#ffb35e'; ctx.beginPath(); ctx.ellipse(0, 0, spread * .62, spread * .34, 0, 0, TAU); ctx.fill();
    for (let ring = 0; ring < (reducedMotion ? 1 : 2); ring++) {
      ctx.strokeStyle = ring ? (fx.weapon === 'meteorGrimoire' ? '#f0e6ff' : '#ffdca0') : (fx.weapon === 'meteorGrimoire' ? '#4c326f' : '#8e452c'); ctx.lineWidth = ring ? 2 : 7;
      ctx.beginPath(); ctx.ellipse(0, 0, spread * (1 - ring * .16), spread * (.54 - ring * .07), 0, 0, TAU); ctx.stroke();
    }
    for (let i = 0; i < 4 + level * 2; i++) {
      const angle = i * TAU / (4 + level * 2), distance = radius * (.2 + impactT * .72);
      ctx.save(); ctx.translate(Math.cos(angle) * distance, Math.sin(angle) * distance * .6);
      ctx.rotate(angle); ctx.fillStyle = fx.weapon === 'meteorGrimoire' ? (i % 2 ? '#d8c2ff' : '#624c86') : (i % 2 ? '#f0ae66' : '#705044');
      ctx.beginPath(); ctx.moveTo(-3, -4); ctx.lineTo(5, -2); ctx.lineTo(3, 5); ctx.lineTo(-4, 2); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    // Falling head and shaft keep the hit location legible even on a busy wave.
    const lift = 12 + impactT * 38;
    ctx.save(); ctx.translate(0, -lift); ctx.rotate(-.35);
    ctx.strokeStyle = fx.weapon === 'meteorGrimoire' ? '#3c2b54' : '#5d352c'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(0, -50); ctx.stroke();
    ctx.strokeStyle = fx.weapon === 'meteorGrimoire' ? '#d8c2ff' : '#ffd493'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = fx.weapon === 'meteorGrimoire' ? '#5c3d7b' : '#755043'; ctx.strokeStyle = fx.weapon === 'meteorGrimoire' ? '#f0e6ff' : '#ffdc9d'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-18 - level * 3, -15); ctx.lineTo(18 + level * 3, -15);
    ctx.lineTo(22 + level * 3, 3); ctx.lineTo(13 + level * 3, 13); ctx.lineTo(-19 - level * 3, 10); ctx.closePath(); ctx.fill(); ctx.stroke();
    for (let i = 0; i < level; i++) {
      const x = (i - (level - 1) / 2) * 11;
      ctx.beginPath(); ctx.moveTo(x - 3, -10); ctx.lineTo(x + 2, -3); ctx.lineTo(x - 2, 7); ctx.stroke();
    }
    ctx.restore();
    if (level >= 2 && !reducedMotion) {
      ctx.strokeStyle = '#fff1b2'; ctx.lineWidth = 2;
      for (let i = 0; i < level; i++) {
        const a = i * TAU / level + impactT * 2, rr = spread * (.45 + i * .08);
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr * .55);
        ctx.lineTo(Math.cos(a + .35) * (rr + 10), Math.sin(a + .35) * (rr + 10) * .55); ctx.stroke();
      }
    }
  } else {
    const dx = fx.x2 - fx.x1, dy = fx.y2 - fx.y1, length = Math.hypot(dx, dy);
    ctx.translate(fx.x1, fx.y1); ctx.rotate(Math.atan2(dy, dx));
    const half = (fx.width || 8) / 2;
    if (fx.weapon === 'monkeyKingBar') {
      ctx.strokeStyle = '#6c4528'; ctx.lineWidth = Math.max(6, half * .65);
      ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(length, 0); ctx.stroke();
      ctx.strokeStyle = '#ffd276'; ctx.lineWidth = 3; ctx.stroke();
      for (let i = 0; i < level + 1; i++) {
        const x = length * ((i + 1) / (level + 2));
        ctx.strokeStyle = '#fff0b0'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x - 9, -half * .6); ctx.lineTo(x + 5, 0); ctx.lineTo(x - 9, half * .6); ctx.stroke();
      }
      ctx.fillStyle = '#ffe9a2'; ctx.beginPath(); ctx.moveTo(length, 0);
      ctx.lineTo(length - 22, -half * .7); ctx.lineTo(length - 15, 0); ctx.lineTo(length - 22, half * .7); ctx.closePath(); ctx.fill();
    } else {
      ctx.fillStyle = '#b58b42'; ctx.globalAlpha *= .65;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(length * .48, -half); ctx.lineTo(length, 0);
      ctx.lineTo(length * .48, half); ctx.closePath(); ctx.fill();
      ctx.globalAlpha /= .65; ctx.strokeStyle = '#fff2c6'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(length, 0); ctx.stroke();
      for (let i = 0; i < level; i++) {
        const x = length * (.25 + i * .22), width = half * (.45 + i * .12);
        ctx.strokeStyle = i % 2 ? '#ffffff' : '#ffd66f'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x - 13, -width); ctx.lineTo(x + 10, 0); ctx.lineTo(x - 13, width); ctx.stroke();
      }
      if (level > 1) {
        ctx.strokeStyle = '#e3bd6a'; ctx.lineWidth = 2;
        for (const side of [-1, 1]) {
          ctx.beginPath(); ctx.moveTo(length * .12, side * half * .25);
          ctx.lineTo(length * .5, side * half * .8); ctx.lineTo(length * .88, 0); ctx.stroke();
        }
      }
    }
  }
  ctx.restore();
  return true;
}

export function drawBuildFeedback(ctx, fx, progress, { pixel, reducedMotion }) {
  if (!fx.build) return false;
  const t = reducedMotion ? .35 : progress;
  ctx.save(); ctx.lineCap = pixel ? 'butt' : 'round'; ctx.lineWidth = 2;
  if (fx.kind === 'line' && fx.build === 'calamityRing') {
    const level = Math.max(1, Math.min(3, fx.level || 1));
    const nodes = Math.max(1, Math.min(4, Math.round((fx.growthCoefficient || .25) * 4)));
    const dx = fx.x2 - fx.x1, dy = fx.y2 - fx.y1, length = Math.hypot(dx, dy);
    ctx.translate(fx.x1, fx.y1); ctx.rotate(Math.atan2(dy, dx));
    ctx.strokeStyle = '#39294c'; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(length, 0); ctx.stroke();
    ctx.strokeStyle = '#d0a8ff'; ctx.lineWidth = 1.6;
    for (let i = 0; i < level; i++) {
      const offset = (i - (level - 1) / 2) * 3;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(length * .2, offset);
      ctx.lineTo(length * .8, offset); ctx.lineTo(length, 0); ctx.stroke();
    }
    // Fixed star nodes preserve all four stages with reduced motion enabled.
    ctx.fillStyle = '#f4e7ff'; ctx.strokeStyle = '#61457d'; ctx.lineWidth = 1;
    for (let i = 0; i < nodes; i++) {
      const x = length * (i + 1) / 5;
      ctx.beginPath(); ctx.moveTo(x - 4, 0); ctx.lineTo(x, -3);
      ctx.lineTo(x + 4, 0); ctx.lineTo(x, 3); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.strokeStyle = '#f4e7ff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(length - 6, 0); ctx.lineTo(length + 6, 0);
    ctx.moveTo(length, -6); ctx.lineTo(length, 6); ctx.stroke();
    ctx.restore(); return true;
  }
  if (fx.kind === 'line' && fx.build === 'windfury') {
    const dx = fx.x2 - fx.x1, dy = fx.y2 - fx.y1, length = Math.hypot(dx, dy);
    ctx.translate(fx.x1, fx.y1); ctx.rotate(Math.atan2(dy, dx));
    ctx.strokeStyle = '#163e38'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(length * .45, -8, length, 0); ctx.stroke();
    ctx.strokeStyle = '#c0ffe5'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(length - 12, -9); ctx.lineTo(length, 0); ctx.lineTo(length - 12, 9); ctx.stroke();
    ctx.restore(); return true;
  }
  if (fx.kind === 'text') {
    ctx.translate(fx.x, fx.y + 32);
    const color = fx.color || '#fff2c6'; ctx.strokeStyle = color; ctx.fillStyle = color;
    if (fx.build === 'divineShield') {
      for (let i = 0; i < 6; i++) {
        const a = i * TAU / 6, r = 18 + t * 22;
        ctx.save(); ctx.translate(Math.cos(a) * r, Math.sin(a) * r); ctx.rotate(a);
        ctx.beginPath(); ctx.moveTo(-5, -5); ctx.lineTo(5, 0); ctx.lineTo(-5, 5); ctx.stroke(); ctx.restore();
      }
    } else if (fx.build === 'inspire') {
      for (const side of [-1, 1]) {
        ctx.beginPath(); ctx.moveTo(side * 14, 6); ctx.lineTo(side * 8, -4 - t * 9);
        ctx.lineTo(side * 14, -14 - t * 9); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(5, -12); ctx.lineTo(0, -4); ctx.lineTo(-5, -12); ctx.closePath(); ctx.stroke();
    } else if (fx.build === 'lifesteal') {
      const y = -8 - t * 18;
      ctx.beginPath(); ctx.moveTo(0, y - 9); ctx.bezierCurveTo(12, y + 3, 4, y + 10, 0, y + 10);
      ctx.bezierCurveTo(-7, y + 10, -9, y + 3, 0, y - 9); ctx.closePath(); ctx.stroke();
    } else if (fx.build === 'cleave') {
      for (const side of [-1, 1]) {
        ctx.beginPath(); ctx.moveTo(-16, side * 11); ctx.lineTo(0, 0); ctx.lineTo(16, side * 11); ctx.stroke();
      }
    }
  }
  ctx.restore();
  return false;
}
