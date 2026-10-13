// Original fire study: the caller owns placement, time and lifetime.
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const fract = value => value - Math.floor(value);

async function loadSmoke() {
  const url = new URL('../../../game/art/effects/fire/png/smoke.png', import.meta.url);
  const image = new Image();
  image.src = url.href;
  try { await image.decode(); }
  catch { throw new Error(`火特效素材加载失败：${url.pathname}`); }
  return image;
}

export async function createFireRenderer() {
  const smoke = await loadSmoke();
  const glow = document.createElement('canvas');
  glow.width = 256; glow.height = 256;
  const glowContext = glow.getContext('2d');
  const halo = glowContext.createRadialGradient(128, 128, 6, 128, 128, 128);
  halo.addColorStop(0, '#ffb43270'); halo.addColorStop(.35, '#ff792c30');
  halo.addColorStop(1, '#f75a2200');
  glowContext.fillStyle = halo; glowContext.fillRect(0, 0, 256, 256);

  const tongues = [
    { x: -43, height: 143, width: 29, phase: 2.4 },
    { x: -22, height: 191, width: 34, phase: .4 },
    { x: 0, height: 228, width: 37, phase: 3.6 },
    { x: 25, height: 182, width: 33, phase: 1.7 },
    { x: 44, height: 136, width: 28, phase: 4.8 }
  ];
  const sparks = Array.from({ length: 16 }, (_, i) => ({
    phase: fract(i * .61803398875), speed: .35 + fract(i * .381) * .19,
    offset: i * 2.39996323, size: 1.2 + fract(i * .731) * 1.6
  }));

  function draw(ctx, { x, y, time, scale = 1, intensity = 1, opacity = 1, detail = 1 }) {
    if (scale <= 0 || intensity <= 0 || opacity <= 0) return;
    const power = clamp(intensity, .6, 1.4), quality = clamp(detail, 0, 1);
    const widthScale = .88 + power * .12, heightScale = .88 + power * .12;
    // Intensity never multiplies time: live changes do not jump to another phase.
    const pulse = 1 + .035 * Math.sin(time * 5.1) + .025 * Math.sin(time * 8.3 + 1);
    ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = true;
    ctx.globalCompositeOperation = 'source-over';
    const inheritedAlpha = ctx.globalAlpha * clamp(opacity, 0, 1);
    const fade = amount => { ctx.globalAlpha = inheritedAlpha * amount; };

    // Smoke dissipates behind the hot silhouette; its texture is decoded once.
    const smokeCount = quality < .7 ? 4 : 8;
    for (let i = 0; i < smokeCount; i++) {
      const age = fract(time * (.19 + i * .008) + i / smokeCount);
      const drift = Math.sin(age * 3.4 + i * 2.4) * (14 + age * 31);
      const size = 34 + age * 65;
      fade(Math.sin(age * Math.PI) ** 2 * .36 * power);
      ctx.drawImage(smoke, drift - size / 2, -117 - age * 113 - size / 2, size, size);
    }

    fade(.68 * pulse); ctx.drawImage(glow, -117, -212, 234, 258);
    fade(.9); ctx.save(); ctx.scale(1, .22);
    ctx.drawImage(glow, -108, -105, 216, 210); ctx.restore();

    // Each tongue has an upward travelling bend and its own breathing rhythm.
    // The broad roots overlap into one fire body; narrowing preserves clear tips.
    function tongue(baseX, baseY, height, breadth, phase, clock, bend = 1) {
      const steps = 22;
      const rootRadius = breadth * (.86 + .16 * Math.sin(-clock * 4.3 + phase));
      ctx.moveTo(baseX - rootRadius, baseY);
      for (let side = -1; side <= 1; side += 2) {
        for (let step = 0; step <= steps; step++) {
          const u = side < 0 ? step / steps : 1 - step / steps;
          const sway = (Math.sin(u * 7.2 - clock * 5 + phase) * 13
            + Math.sin(u * 12.8 - clock * 3.8 + phase * 1.7) * 4) * u * bend;
          const center = baseX * (1 - u * .26) + sway;
          const radius = breadth * Math.pow(1 - u, .78)
            * (.86 + .16 * Math.sin(u * 9.5 - clock * 4.3 + phase));
          ctx.lineTo(center + side * radius, baseY - height * u);
        }
      }
      // The lower edge curls around the foot instead of clipping to a flat line.
      const rootDepth = Math.min(13, breadth * .42);
      ctx.bezierCurveTo(baseX + rootRadius * .85, baseY + rootDepth,
        baseX - rootRadius * .85, baseY + rootDepth, baseX - rootRadius, baseY);
      ctx.closePath();
    }

    const outer = ctx.createLinearGradient(0, 6, 0, -240);
    outer.addColorStop(0, '#c84224'); outer.addColorStop(.24, '#eb5124');
    outer.addColorStop(.68, '#fa7028'); outer.addColorStop(1, '#ffab40');
    fade(.95); ctx.fillStyle = outer; ctx.beginPath();
    for (const part of tongues) {
      const rise = (1 + .065 * Math.sin(time * 4.1 + part.phase)) * heightScale;
      tongue(part.x * widthScale, -10 - Math.abs(part.x) * .06, part.height * rise,
        part.width * widthScale, part.phase, time, power);
    }
    ctx.fill();

    const middle = ctx.createLinearGradient(0, 3, 0, -190);
    middle.addColorStop(0, '#ff912a'); middle.addColorStop(.45, '#ffba35');
    middle.addColorStop(1, '#ffda63');
    fade(1); ctx.fillStyle = middle; ctx.beginPath();
    for (let i = 0; i < tongues.length; i++) {
      const part = tongues[i], rise = 1 + .09 * Math.sin(time * 4.1 + part.phase + .3);
      tongue(part.x * .83 * widthScale, -13 - Math.abs(part.x) * .04, part.height * .77 * rise * heightScale,
        part.width * .71 * widthScale, part.phase + .2, time, power * .85);
    }
    ctx.fill();

    const core = ctx.createLinearGradient(0, 0, 0, -130);
    core.addColorStop(0, '#ffd866'); core.addColorStop(.55, '#ffe990');
    core.addColorStop(1, '#fff2b0');
    fade(.98); ctx.fillStyle = core; ctx.beginPath();
    tongue(-21, -16, 88 * pulse * heightScale, 20, 1.1, time, .8);
    tongue(0, -15, 140 * (1 + .09 * Math.sin(time * 4.4)) * heightScale, 26, 3, time, .7);
    tongue(23, -16, 100 * pulse * heightScale, 20, 5.2, time, .8);
    ctx.fill();

    // Detached flame tips disappear before the cycle wraps; no growing list.
    const wispCount = quality < .7 ? 2 : 4;
    for (let i = 0; i < wispCount; i++) {
      const age = fract(time * (.58 + i * .035) + i * .27);
      const life = Math.sin(age * Math.PI);
      const px = (i % 2 ? 1 : -1) * (23 + i * 4) + Math.sin(age * 4 + i * 2) * 14;
      const py = -124 - age * (92 + i * 6);
      fade(life * .77); ctx.fillStyle = i % 2 ? '#ffb73f' : '#f9792f'; ctx.beginPath();
      tongue(px, py, (18 + i * 4) * life, (5.5 + i) * life, i * 2, time, .32);
      ctx.fill();
    }

    // Sparse rising embers follow a bounded lifetime, taper and fade at both ends.
    const sparkCount = quality < .7 ? 8 : sparks.length;
    ctx.lineCap = 'round';
    for (let i = 0; i < sparkCount; i++) {
      const spark = sparks[i], age = fract(time * spark.speed + spark.phase);
      const life = Math.sin(age * Math.PI), drift = Math.sin(age * 5 + spark.offset);
      const px = Math.sin(spark.offset) * (32 + age * 29) + drift * 13;
      const py = -22 - age * (206 + 20 * Math.cos(spark.offset));
      fade(life * .9); ctx.strokeStyle = i % 3 ? '#ffca67' : '#fff0af';
      ctx.lineWidth = spark.size * (1 - age * .66);
      ctx.beginPath(); ctx.moveTo(px, py);
      ctx.lineTo(px - drift * 1.4, py + 2 + (1 - age) * 3.5); ctx.stroke();
    }
    ctx.restore();
  }

  return { draw };
}
