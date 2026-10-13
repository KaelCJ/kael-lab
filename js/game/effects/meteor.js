import { createFireRenderer } from './fire.js';

const TAU = Math.PI * 2;
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

// Original rock geometry. Crust and cracks rotate; illumination stays screen-fixed.
const outline = [[-22, -10], [-18, -20], [-6, -25], [8, -24], [21, -15],
  [26, -2], [21, 13], [9, 23], [-7, 24], [-21, 14], [-25, 1]];
const fissures = [
  [[-19, -14], [-7, -10], [-3, 1], [9, 6], [18, 17]],
  [[7, -24], [5, -13], [-3, 1], [-14, 9], [-20, 15]],
  [[-3, 1], [-1, 13], [-6, 23]],
  [[9, 6], [15, -2], [25, -3]],
  [[-7, -10], [-12, -20]]
];

export async function createMeteorRenderer() {
  const fire = await createFireRenderer();
  const rock = new Path2D();
  outline.forEach(([x, y], i) => i ? rock.lineTo(x, y) : rock.moveTo(x, y));
  rock.closePath();
  const cracks = new Path2D();
  fissures.forEach(points => points.forEach(([x, y], i) => i ? cracks.lineTo(x, y) : cracks.moveTo(x, y)));

  const glow = document.createElement('canvas');
  glow.width = 96; glow.height = 96;
  const glowContext = glow.getContext('2d');
  const heat = glowContext.createRadialGradient(48, 48, 17, 48, 48, 48);
  heat.addColorStop(0, '#ffa23b85'); heat.addColorStop(.47, '#ff682c40');
  heat.addColorStop(1, '#ff4c2000');
  glowContext.fillStyle = heat; glowContext.fillRect(0, 0, 96, 96);

  function draw(ctx, { x, y, time, angle = 0, travel = 0, lift = 0,
    scale = 1, opacity = 1, detail = 1 }) {
    if (scale <= 0 || opacity <= 0) return;
    const quality = clamp(detail, 0, 1), height = Math.max(0, lift);
    // Signed distance is accumulated by the caller; direction changes keep phase.
    const roll = travel / 24;
    ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = true; ctx.globalCompositeOperation = 'source-over';
    const inheritedAlpha = ctx.globalAlpha * clamp(opacity, 0, 1);
    const fade = amount => { ctx.globalAlpha = inheritedAlpha * amount; };

    // The projected shadow stays on the ground when the caller raises the rock.
    ctx.save(); ctx.scale(1, .28);
    const radius = 31 + Math.min(height, 100) * .055;
    const shadow = ctx.createRadialGradient(0, 0, 5, 0, 0, radius);
    shadow.addColorStop(0, '#1e191bcc'); shadow.addColorStop(1, '#1e191b00');
    fade(.7 / (1 + height * .014)); ctx.fillStyle = shadow;
    ctx.fillRect(-radius, -radius, radius * 2, radius * 2); ctx.restore();

    // lift is in the caller's coordinate units, independently of appearance scale.
    ctx.translate(0, -24 - height / scale);
    fade(1); ctx.drawImage(glow, -48, -48, 96, 96);
    ctx.save();
    ctx.translate(-Math.cos(angle) * 8, -Math.sin(angle) * 8);
    // Native fire points upward. Rotate that axis opposite the travel direction.
    ctx.rotate(angle - Math.PI / 2); ctx.scale(.32, .34);
    fire.draw(ctx, { x: 0, y: 0, time, intensity: 1.12, opacity: .98, detail: quality });
    ctx.restore();

    // A hot perimeter is visible around the opaque rock, never over its whole face.
    ctx.save(); ctx.rotate(roll);
    fade(.86); ctx.strokeStyle = '#e9672d'; ctx.lineWidth = 5.3; ctx.lineJoin = 'round';
    ctx.stroke(rock);
    ctx.clip(rock); ctx.rotate(-roll);
    const stone = ctx.createLinearGradient(-19, -24, 20, 24);
    stone.addColorStop(0, '#8d7060'); stone.addColorStop(.3, '#645044');
    stone.addColorStop(.64, '#3c322e'); stone.addColorStop(1, '#242125');
    fade(1); ctx.fillStyle = stone; ctx.fillRect(-32, -32, 64, 64);

    // Restrained surface marks give the rock a legible rotating crust at 50px.
    ctx.save(); ctx.rotate(roll);
    fade(.24); ctx.fillStyle = '#1b171a';
    for (let i = 0; i < (quality < .7 ? 3 : 6); i++) {
      const theta = i * 2.39996323, radius = 9 + i * 1.65;
      ctx.beginPath(); ctx.ellipse(Math.cos(theta) * radius, Math.sin(theta) * radius,
        2.8 + (i % 3), 1.8 + (i % 2), theta, 0, TAU); ctx.fill();
    }
    const warmth = .91 + .06 * Math.sin(time * 4.2);
    fade(warmth); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.strokeStyle = '#b94020'; ctx.lineWidth = 4.2; ctx.stroke(cracks);
    ctx.strokeStyle = '#f88832'; ctx.lineWidth = 2.2; ctx.stroke(cracks);
    ctx.strokeStyle = '#ffd370'; ctx.lineWidth = .75; ctx.stroke(cracks);
    ctx.restore();

    // This fixed light layer is applied after rolling marks so it does not spin.
    const lighting = ctx.createRadialGradient(-12, -15, 2, 4, 7, 39);
    lighting.addColorStop(0, '#ffe5b52a'); lighting.addColorStop(.42, '#ffffff00');
    lighting.addColorStop(1, '#110d1455');
    fade(1); ctx.fillStyle = lighting; ctx.fillRect(-32, -32, 64, 64);
    ctx.restore();

    // A narrow upper crust edge separates the stone from the surrounding flame.
    ctx.save(); ctx.rotate(roll);
    fade(.45); ctx.strokeStyle = '#241b1d'; ctx.lineWidth = 1.15; ctx.stroke(rock);
    ctx.restore();
    ctx.restore();
  }

  return { draw };
}
