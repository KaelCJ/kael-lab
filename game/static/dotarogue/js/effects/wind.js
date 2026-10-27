// Original Canvas study. The caller owns time, placement and the effect lifetime.
const TAU = Math.PI * 2;
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const fract = value => value - Math.floor(value);

async function loadSprite(path) {
  const url = new URL(`../../assets/art/effects/wind/${path}`, import.meta.url);
  const image = new Image();
  image.src = url.href;
  try { await image.decode(); }
  catch { throw new Error(`风特效素材加载失败：${url.pathname}`); }
  // Rasterize SVGs once; no SVG parsing or blur filters in the frame loop.
  const sprite = document.createElement('canvas');
  sprite.width = image.naturalWidth; sprite.height = image.naturalHeight;
  sprite.getContext('2d').drawImage(image, 0, 0);
  return sprite;
}

export async function createWindRenderer() {
  const [leaf, wisp, dust] = await Promise.all([
    loadSprite('svg/leaf.svg'), loadSprite('svg/wisp.svg'), loadSprite('png/dust.png')
  ]);
  // Stable offsets keep repeated draws, pause and seeking deterministic.
  const motes = Array.from({ length: 60 }, (_, i) => ({
    phase: fract(i * .61803398875), offset: i * 2.39996323,
    speed: .105 + fract(i * .317) * .095,
    size: .7 + fract(i * .733) * .6, kind: i % 5
  }));

  function draw(ctx, { x, y, time, scale = 1, intensity = 1, spin = 1, opacity = 1, detail = 1 }) {
    if (scale <= 0 || intensity <= 0 || opacity <= 0) return;
    const power = clamp(intensity, .15, 1.6), alpha = clamp(opacity, 0, 1);
    // Intensity changes the shape and visibility of the wind, not its time phase.
    // Keeping the clock independent prevents a live strength adjustment from jumping.
    const clock = time * .96, turn = spin < 0 ? -1 : 1;
    const count = Math.round(36 + 24 * clamp(detail, 0, 1));
    const width = .84 + power * .16;
    const radius = u => (6 + 77 * Math.pow(u, 1.38)) * width;
    const sway = 9 + power * 3;
    const axis = u => (Math.sin(u * 4.1 - clock * .62) * sway + 13 * u) * u;
    const point = (u, theta, orbit = 1) => {
      const r = radius(u) * orbit;
      return { x: axis(u) + Math.cos(theta) * r, y: -246 * u + Math.sin(theta) * r * .23 };
    };
    ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = true;
    const inheritedAlpha = ctx.globalAlpha * alpha;
    const fade = amount => { ctx.globalAlpha = inheritedAlpha * amount; };

    // A contact shadow and low dust connect the wind to the ground plane.
    const shadow = ctx.createRadialGradient(0, 3, 3, 0, 3, 68);
    shadow.addColorStop(0, '#182b2b66'); shadow.addColorStop(1, '#182b2b00');
    fade(.8); ctx.save(); ctx.scale(1, .3); ctx.fillStyle = shadow;
    ctx.fillRect(-70, -70, 140, 140); ctx.restore();

    function groundDust(front) {
      for (let i = 0; i < 12; i++) {
        const age = fract(clock * .31 + i / 12), theta = i * 2.4 - clock * 2.8 * turn;
        if ((Math.sin(theta) >= 0) !== front) continue;
        const r = 19 + age * 54, size = (29 + age * 39) * width;
        fade(Math.sin(age * Math.PI) * .43 * power);
        ctx.drawImage(dust, Math.cos(theta) * r - size / 2,
          Math.sin(theta) * r * .24 - size * .2, size, size * .42);
      }
    }

    function particles(front) {
      for (let i = 0; i < count; i++) {
        const mote = motes[i], age = fract(clock * mote.speed + mote.phase);
        const theta = (mote.offset - clock * 4.1 + age * 9) * turn;
        if ((Math.sin(theta) >= 0) !== front) continue;
        const orbit = mote.kind === 0 ? .8 : 1.12 + .2 * mote.size;
        const p = point(age, theta, orbit);
        const life = Math.min(1, age * 9, (1 - age) * 7);
        fade(life * (front ? .86 : .32) * Math.min(1, power));
        ctx.save(); ctx.translate(p.x, p.y);
        if (mote.kind === 0) {
          const size = (35 + age * 39) * mote.size;
          ctx.globalAlpha *= .48;
          ctx.rotate(theta * .3); ctx.drawImage(dust, -size / 2, -size / 3, size, size * .66);
        } else if (mote.kind === 1) {
          ctx.rotate(Math.sin(theta) * .24 - .15 * turn);
          const size = (21 + age * 27) * mote.size;
          ctx.drawImage(wisp, -size / 2, -size / 8, size, size / 4);
        } else if (mote.kind === 2 || mote.kind === 3) {
          const size = (8 + age * 4) * mote.size;
          ctx.rotate(theta + mote.offset);
          ctx.scale(1, .4 + .6 * Math.abs(Math.cos(theta * 1.4)));
          ctx.drawImage(leaf, -size / 2, -size / 4, size, size / 2);
        } else {
          ctx.rotate(theta); ctx.fillStyle = i % 2 ? '#a2bcb1' : '#d1c194';
          ctx.fillRect(-1.5, -1, 3 * mote.size, 2 * mote.size);
        }
        ctx.restore();
      }
    }

    function ribbon(front, phase, breadth, turns) {
      const steps = 112, samples = [];
      for (let i = 0; i <= steps; i++) {
        const u = i / steps, theta = (u * TAU * turns - clock * 4.5 + phase) * turn;
        const p = point(u, theta);
        samples.push({ ...p, front: Math.sin(theta) >= 0,
          w: (1.6 + u * breadth) * Math.min(1, u * 10, (1 - u) * 15) });
      }
      // Filled, tapered strips follow a rising helix, split at the depth plane.
      for (let start = 0; start < steps;) {
        let end = start + 1;
        while (end < steps && samples[end].front === samples[start].front) end++;
        if (samples[start].front === front) {
          ctx.beginPath();
          for (let i = start; i <= end; i++) {
            const p = samples[i];
            if (i === start) ctx.moveTo(p.x, p.y - p.w / 2); else ctx.lineTo(p.x, p.y - p.w / 2);
          }
          for (let i = end; i >= start; i--) {
            const p = samples[i]; ctx.lineTo(p.x, p.y + p.w / 2);
          }
          ctx.closePath();
          fade(front ? .79 : .32); ctx.fillStyle = front ? '#dbe9d7' : '#6b9291'; ctx.fill();
          if (front) {
            fade(.77); ctx.strokeStyle = '#f1f2d9'; ctx.lineWidth = breadth > 7 ? 1.6 : .8;
            ctx.beginPath();
            for (let i = start; i <= end; i++) {
              const p = samples[i];
              if (i === start) ctx.moveTo(p.x, p.y - p.w / 2); else ctx.lineTo(p.x, p.y - p.w / 2);
            }
            ctx.stroke();
          }
        }
        start = end;
      }
    }

    groundDust(false); particles(false);
    ribbon(false, 0, 12, 3.4); ribbon(false, 2.3, 4, 3.4);

    // The translucent funnel is a volume under the ribbons, not a stack of rings.
    const body = new Path2D();
    for (let i = 0; i <= 28; i++) {
      const u = i / 28, px = axis(u) - radius(u), py = -246 * u;
      if (!i) body.moveTo(px, py); else body.lineTo(px, py);
    }
    body.ellipse(axis(1), -246, radius(1), radius(1) * .23, 0, Math.PI, TAU);
    for (let i = 28; i >= 0; i--) {
      const u = i / 28; body.lineTo(axis(u) + radius(u), -246 * u);
    }
    body.closePath();
    const volume = ctx.createLinearGradient(-90, 0, 94, 0);
    volume.addColorStop(0, '#6e999820'); volume.addColorStop(.3, '#bbd1c477');
    volume.addColorStop(.55, '#8caaa491'); volume.addColorStop(.8, '#5d89856b');
    volume.addColorStop(1, '#537b7a10');
    fade(.94); ctx.fillStyle = volume; ctx.fill(body);
    ctx.save(); ctx.clip(body);
    // Broad diagonal shading makes the transparent core read at game scale.
    fade(.2); ctx.fillStyle = '#e3edd4'; ctx.beginPath();
    ctx.moveTo(-15, 4); ctx.bezierCurveTo(-28, -96, -79, -175, -48, -266);
    ctx.lineTo(8, -275); ctx.bezierCurveTo(-18, -164, 13, -75, 6, 4); ctx.fill();
    ctx.restore();

    fade(.38); ctx.fillStyle = '#496f7099'; ctx.beginPath();
    ctx.ellipse(axis(1), -246, radius(1) * .87, radius(1) * .17, -.025, 0, TAU); ctx.fill();
    fade(.76); ctx.strokeStyle = '#cadcca'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(axis(1), -246, radius(1), radius(1) * .23, 0, .05, Math.PI - .08); ctx.stroke();
    ribbon(true, 0, 12, 3.4); ribbon(true, 2.3, 4, 3.4);
    particles(true); groundDust(true);
    ctx.restore();
  }

  return { draw };
}
