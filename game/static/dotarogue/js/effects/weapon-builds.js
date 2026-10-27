const TAU = Math.PI * 2;

// Consumes resolved combat events only. Coordinates and widths remain gameplay-owned.
export function drawWeaponStrike(ctx, fx, progress, { pixel, reducedMotion }) {
  if (fx.kind !== 'line' || !['monkeyKingBar', 'divineRapier', 'meteorHammer'].includes(fx.weapon)) return false;
  const level = Math.max(1, Math.min(3, fx.level || 1));
  const t = reducedMotion ? .3 : progress;
  ctx.save();
  ctx.lineJoin = pixel ? 'miter' : 'round';
  ctx.lineCap = pixel ? 'butt' : 'round';
  if (fx.weapon === 'meteorHammer') {
    // Impact and damage coincide; the raised hammer is a recoil, never a delayed hit.
    ctx.translate(fx.x2, fx.y2);
    const radius = fx.r, spread = radius * (.25 + t * .65);
    ctx.strokeStyle = '#6c3928'; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.ellipse(0, 0, spread, spread * .55, 0, 0, TAU); ctx.stroke();
    ctx.strokeStyle = '#ffc87e'; ctx.lineWidth = 2; ctx.stroke();
    for (let i = 0; i < 4 + level * 2; i++) {
      const angle = i * TAU / (4 + level * 2), distance = radius * (.22 + t * .65);
      ctx.save(); ctx.translate(Math.cos(angle) * distance, Math.sin(angle) * distance * .6);
      ctx.rotate(angle); ctx.fillStyle = i % 2 ? '#f0ae66' : '#705044';
      ctx.beginPath(); ctx.moveTo(-3, -4); ctx.lineTo(5, -2); ctx.lineTo(3, 5); ctx.lineTo(-4, 2); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    const lift = 10 + t * 34;
    ctx.translate(0, -lift); ctx.rotate(-.35);
    ctx.strokeStyle = '#5d352c'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(0, -50); ctx.stroke();
    ctx.strokeStyle = '#ffd493'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = '#755043'; ctx.strokeStyle = '#ffdc9d'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-18 - level * 3, -15); ctx.lineTo(18 + level * 3, -15);
    ctx.lineTo(22 + level * 3, 3); ctx.lineTo(13 + level * 3, 13); ctx.lineTo(-19 - level * 3, 10); ctx.closePath(); ctx.fill(); ctx.stroke();
    for (let i = 0; i < level; i++) {
      const x = (i - (level - 1) / 2) * 11;
      ctx.beginPath(); ctx.moveTo(x - 3, -10); ctx.lineTo(x + 2, -3); ctx.lineTo(x - 2, 7); ctx.stroke();
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
