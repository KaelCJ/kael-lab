// Original spectral sprites. Combat owns the cast, position, timing and damage.
const TAU = Math.PI * 2;
const clamp = (value, low = 0, high = 1) => Math.max(low, Math.min(high, value));

function soulSprite(phase) {
  const canvas = document.createElement('canvas');
  canvas.width = 160; canvas.height = 208;
  const c = canvas.getContext('2d');
  c.scale(2, 2);
  const sway = Math.sin(phase * TAU), curl = Math.cos(phase * TAU);
  // The taper is a broken, twisted torso, not a round head on a sheet.
  const body = new Path2D();
  body.moveTo(37, 36); body.bezierCurveTo(29, 40, 27, 46, 30, 56);
  body.bezierCurveTo(33, 65, 22 + sway * 3, 73, 15, 86);
  body.bezierCurveTo(26, 83, 34, 73, 31, 88);
  body.lineTo(24 + curl * 4, 99); body.bezierCurveTo(41, 88, 39, 78, 45, 74);
  body.bezierCurveTo(45, 83, 43, 87, 42, 92);
  body.bezierCurveTo(54, 82, 49, 70, 54, 65);
  body.bezierCurveTo(44, 65, 51, 54, 48, 46);
  body.bezierCurveTo(46, 40, 43, 38, 43, 35); body.closePath();
  const depth = c.createLinearGradient(0, 33, 0, 99);
  depth.addColorStop(0, '#29483cb3'); depth.addColorStop(.55, '#3b57499c');
  depth.addColorStop(1, '#4d6d5700');
  c.fillStyle = depth; c.fill(body);
  const mist = c.createLinearGradient(0, 29, 0, 100);
  mist.addColorStop(0, '#bdcbb48c'); mist.addColorStop(.4, '#849d858c');
  mist.addColorStop(.75, '#afbea14d'); mist.addColorStop(1, '#849f8e00');
  c.fillStyle = mist; c.fill(body);
  // Long reaching arms and thin fingers give the small sprite its silhouette.
  c.lineCap = 'round'; c.lineJoin = 'round';
  for (const side of [-1, 1]) {
    c.save(); c.translate(40, 0); c.scale(side, 1);
    c.strokeStyle = '#344f428c'; c.lineWidth = 7;
    c.beginPath(); c.moveTo(2, 40); c.quadraticCurveTo(14, 36 + sway, 20, 43);
    c.quadraticCurveTo(25, 49, 31, 47 + sway * 2); c.stroke();
    c.strokeStyle = '#9aaf9fac'; c.lineWidth = 4.5; c.stroke();
    c.strokeStyle = '#d3ddc1b8'; c.lineWidth = 1.35;
    c.beginPath(); c.moveTo(6, 39); c.quadraticCurveTo(15, 38, 20, 44);
    c.lineTo(28, 47 + sway * 2); c.stroke();
    c.strokeStyle = '#c6d0b7a6'; c.lineWidth = 1.15;
    for (let finger = 0; finger < 3; finger++) {
      c.beginPath(); c.moveTo(28, 46 + finger * 1.6 + sway * 2);
      c.quadraticCurveTo(34 + finger * 1.2, 44 + finger * 2, 33 - finger, 51 + finger * 2 + sway); c.stroke();
    }
    c.restore();
  }
  // Small angular skull, cheek and jaw planes; no bright cartoon eye discs.
  c.fillStyle = '#b8c8adc9'; c.strokeStyle = '#365344a6'; c.lineWidth = 1.7; c.beginPath();
  c.moveTo(34, 25); c.lineTo(39, 20); c.lineTo(46, 22); c.lineTo(49, 28);
  c.lineTo(46, 35); c.lineTo(43, 38); c.lineTo(37, 35); c.lineTo(33, 30); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#e6ecd599'; c.beginPath(); c.moveTo(35, 25); c.lineTo(40, 22);
  c.lineTo(40, 29); c.lineTo(36, 31); c.closePath(); c.fill();
  c.fillStyle = '#394d488c'; c.beginPath(); c.moveTo(35, 28); c.lineTo(40, 29);
  c.lineTo(38, 31); c.lineTo(35, 30); c.moveTo(43, 28); c.lineTo(47, 27);
  c.lineTo(46, 30); c.lineTo(43, 31); c.fill();
  c.strokeStyle = '#506558a6'; c.lineWidth = 1;
  c.beginPath(); c.moveTo(39, 34); c.lineTo(43, 34); c.stroke();
  // Fragmented ribs, shoulder highlights and hairlike smoke are deliberately sparse.
  c.strokeStyle = '#dce4cb80'; c.lineWidth = 1.25;
  c.beginPath(); c.moveTo(34, 42); c.quadraticCurveTo(39, 46, 45, 43);
  c.moveTo(34, 49); c.quadraticCurveTo(39, 54, 46, 49);
  c.moveTo(35, 55); c.quadraticCurveTo(39, 58, 43, 54); c.stroke();
  for (let i = 0; i < 7; i++) {
    const x = 26 + i * 4, y = 57 + (i % 3) * 5;
    c.strokeStyle = i % 2 ? '#afc0ab35' : '#d5dfc84a'; c.lineWidth = .8;
    c.beginPath(); c.moveTo(x, y); c.bezierCurveTo(x + 8, y + 8, x - 9 + sway * 4, y + 17, x - 12 + curl * 3, 94 - i % 3 * 3); c.stroke();
  }
  return canvas;
}

function drawSoul(ctx, sprite, x, y, size, alpha, mirror = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(mirror, 1);
  ctx.globalAlpha *= alpha;
  ctx.drawImage(sprite, -size * .5, -size * 1.04, size, size * 1.3);
  ctx.restore();
}

function smokeSprite() {
  const canvas = document.createElement('canvas');
  canvas.width = 96; canvas.height = 96;
  const c = canvas.getContext('2d');
  for (let i = 0; i < 13; i++) {
    const x = 48 + Math.sin(i * 2.71) * 24, y = 48 + Math.cos(i * 4.17) * 23;
    const radius = 13 + i % 4 * 3;
    const gradient = c.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, '#5e7a6661'); gradient.addColorStop(.45, '#7a927944');
    gradient.addColorStop(1, '#8aa48f00');
    c.fillStyle = gradient; c.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  return canvas;
}

function drawStream(ctx, smoke, x, y, angle, radius, age, index, tier, reduced) {
  const dx = Math.cos(angle), dy = Math.sin(angle), nx = -dy, ny = dx;
  const tailLength = reduced ? 82 : 112 + Math.sin(index * 2.31) * 32;
  const tail = Math.max(16, radius - tailLength);
  const length = radius - tail;
  if (length <= 3) return;
  const phase = reduced ? index * 1.7 : age * 10 + index * 1.7;
  // The pale torn ribbon follows the true circular damage frontier in world XY.
  for (let strand = 0; strand < (reduced ? 1 : 3); strand++) {
    const mist = ctx.createLinearGradient(x + dx * tail, y + dy * tail,
      x + dx * radius, y + dy * radius);
    mist.addColorStop(0, '#647d6500'); mist.addColorStop(.28, '#6f897011');
    mist.addColorStop(.7, strand === 0 ? '#607e6328' : '#b3c3a519'); mist.addColorStop(1, '#a4bba000');
    ctx.fillStyle = mist;
    ctx.beginPath();
    for (let edge = 0; edge < 2; edge++) for (let step = 0; step <= 10; step++) {
      const t = edge ? 1 - step / 10 : step / 10;
      const r = tail + length * t;
      const width = Math.sin(t * Math.PI) * (3.5 + strand * 1.5 + tier)
        * (.65 + Math.sin(t * 21 + phase + strand) * .35) + 1;
      const bend = Math.sin(t * 10 - phase + strand * 2) * (2 + t * 3);
      const offset = bend + (edge ? -width : width);
      const px = x + dx * r + nx * offset, py = y + dy * r + ny * offset - t * 11;
      if (!edge && !step) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.fill();
  }
  if (!reduced) for (let puff = 0; puff < 3; puff++) {
    const t = .28 + puff * .24, r = tail + length * t;
    ctx.save(); ctx.translate(x + dx * r, y + dy * r - t * 11);
    ctx.rotate(angle); ctx.globalAlpha *= .36;
    ctx.drawImage(smoke, -25, -15, 50, 30); ctx.restore();
  }
  // A fine muted red filament, subordinate to the pale spectral body.
  ctx.strokeStyle = '#a742463d'; ctx.lineWidth = .85;
  ctx.beginPath(); ctx.moveTo(x + dx * Math.max(24, tail), y + dy * Math.max(24, tail) - 5);
  ctx.quadraticCurveTo(x + dx * (tail + length * .55) + nx * 3,
    y + dy * (tail + length * .55) - 11, x + dx * radius, y + dy * radius - 9); ctx.stroke();
}

export function createRequiemRenderer() {
  // Eight 160x208 transparent sprites, made once per game page; no external assets.
  const sprites = Array.from({ length: 8 }, (_, frame) => soulSprite(frame / 8));
  const smoke = smokeSprite();
  return {
    draw(ctx, { cast, player, level = 1, reducedMotion = false, layer = 'back' } = {}) {
      if (!cast || (layer !== 'back' && layer !== 'front')) return;
      const tier = level >= 10 ? 3 : level >= 5 ? 2 : 1;
      const charging = cast.delay > 0;
      const age = Math.max(0, cast.age || 0);
      const range = cast.range ?? 280;
      const chargeTime = cast.chargeTime ?? 1;
      const travelTime = cast.travelTime ?? 1;
      const fadeTime = cast.fadeTime ?? 1;
      if (!charging && age >= travelTime + fadeTime) return;
      const x = charging ? player.x : cast.x, y = charging ? player.y : cast.y;
      ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.imageSmoothingEnabled = true;
      if (charging) {
        const progress = clamp(1 - cast.delay / chargeTime);
        const alpha = .22 + progress * .28;
        for (let i = 0; i < 6; i++) {
          const angle = i * TAU / 6 + .2;
          if ((Math.sin(angle) >= 0) !== (layer === 'front')) continue;
          const r = 52 - progress * 28;
          const frame = reducedMotion ? i : (i + Math.floor(progress * 7)) % 8;
          drawSoul(ctx, sprites[frame], x + Math.cos(angle) * r,
            y + Math.sin(angle) * r * .5 - progress * 10, 24, alpha, i % 2 ? -1 : 1);
        }
        if (layer === 'back') {
          ctx.strokeStyle = `rgba(119,47,56,${.2 + progress * .24})`; ctx.lineWidth = 1.4;
          for (const side of [-1, 1]) {
            ctx.beginPath(); ctx.moveTo(x + side * 28, y - 25);
            ctx.bezierCurveTo(x + side * 47, y - 4, x + side * 24, y + 19, x + side * 10, y + 8); ctx.stroke();
          }
        }
      } else {
        const radius = clamp(age / travelTime) * range;
        const fade = 1 - clamp((age - travelTime) / fadeTime);
        const emerge = clamp(radius / 58);
        ctx.globalAlpha *= fade * emerge;
        // Fixed count preserves the same full-circle reading for all levels and soul counts.
        for (let i = 0; i < 18; i++) {
          const angle = i * TAU / 18 + .085;
          if ((Math.sin(angle) >= 0) !== (layer === 'front')) continue;
          const dx = Math.cos(angle), dy = Math.sin(angle);
          drawStream(ctx, smoke, x, y, angle, radius, age, i, tier, reducedMotion);
          const frame = reducedMotion ? i % 8 : (i + Math.floor(age * 16)) % 8;
          const size = 31 + tier * 2 + Math.sin(i * 5.1) * 3;
          if (!reducedMotion && radius > 65) {
            const r = Math.max(20, radius - 43);
            drawSoul(ctx, sprites[(frame + 3) % 8], x + dx * r, y + dy * r - 5,
              size * .79, .17, i % 2 ? -1 : 1);
          }
          drawSoul(ctx, sprites[frame], x + dx * radius, y + dy * radius - 3,
            size, .72 + tier * .035, i % 2 ? -1 : 1);
        }
      }
      ctx.restore();
    }
  };
}
