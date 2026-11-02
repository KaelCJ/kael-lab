// Moonlight reads the existing beam clock; combat owns targeting and damage.
const TAU = Math.PI * 2;
const clamp = value => Math.max(0, Math.min(1, value));

export function createEclipseRenderer() {
  const column = document.createElement('canvas');
  column.width = 128; column.height = 640;
  const c = column.getContext('2d');
  const light = c.createLinearGradient(0, 0, 128, 0);
  for (const [at, color] of [[0, '#63bfeb00'], [.14, '#71c9ed12'], [.34, '#aaeaff58'],
    [.46, '#e2ffffc0'], [.5, '#f3ffffe8'], [.54, '#e2ffffc0'], [.66, '#aaeaff58'],
    [.86, '#71c9ed12'], [1, '#63bfeb00']]) light.addColorStop(at, color);
  c.fillStyle = light; c.beginPath(); c.moveTo(0, 0); c.lineTo(128, 0);
  c.lineTo(101, 640); c.lineTo(27, 640); c.closePath(); c.fill();
  // Fixed filaments add the translucent curtain of the classic moonbeam.
  for (let i = 0; i < 19; i++) {
    const x = 15 + i * 5.4, width = i % 3 === 0 ? 2.2 : .8;
    const strand = c.createLinearGradient(0, 0, 0, 640);
    strand.addColorStop(0, '#d4faff00');
    strand.addColorStop(.15 + (i % 4) * .06, '#c8f5ff28');
    strand.addColorStop(.73, i % 3 ? '#d2ffff7a' : '#efffffd0');
    strand.addColorStop(1, '#d8ffff28');
    c.strokeStyle = strand; c.lineWidth = width; c.beginPath();
    c.moveTo(x, i % 3 * 13); c.lineTo(64 + (x - 64) * .6, 640); c.stroke();
  }
  c.globalCompositeOperation = 'destination-in';
  const ends = c.createLinearGradient(0, 0, 0, 640);
  ends.addColorStop(0, '#fff0'); ends.addColorStop(.16, '#ffff');
  ends.addColorStop(.94, '#ffff'); ends.addColorStop(1, '#fff0');
  c.fillStyle = ends; c.fillRect(0, 0, 128, 640);

  const glow = document.createElement('canvas');
  glow.width = glow.height = 128;
  const g = glow.getContext('2d'), pool = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  pool.addColorStop(0, '#f0ffffe0'); pool.addColorStop(.2, '#bff7ff90');
  pool.addColorStop(.55, '#70cce33a'); pool.addColorStop(1, '#51a9df00');
  g.fillStyle = pool; g.fillRect(0, 0, 128, 128);

  return { draw(ctx, { cast, level = 1, reducedMotion = false, layer = 'front' }) {
    if (!cast) return;
    const tier = level >= 10 ? 3 : level >= 5 ? 2 : 1;
    ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.imageSmoothingEnabled = true;
    if (layer === 'ground') {
      // The faint boundary describes this game's fixed cast area, not a blast.
      ctx.globalAlpha = .09; ctx.strokeStyle = '#a5d9ea'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cast.x, cast.y, 430, 0, TAU); ctx.stroke();
      for (const beam of cast.beams) {
        ctx.save(); ctx.translate(beam.x, beam.y);
        if (beam.warning > 0) {
          const ready = clamp(1 - beam.warning / .22);
          ctx.globalAlpha = .12 + ready * .16; ctx.drawImage(glow, -52, -52, 104, 104);
          ctx.globalAlpha = .13 + ready * .15; ctx.strokeStyle = '#c0eaf5';
          ctx.beginPath(); ctx.arc(0, 0, 52, 0, TAU); ctx.stroke();
        } else {
          const fade = clamp(1 + beam.warning / .4);
          ctx.globalAlpha = fade * (reducedMotion ? .32 : .68);
          ctx.drawImage(glow, -52, -30, 104, 60);
        }
        ctx.restore();
      }
    } else {
      for (const beam of cast.beams) {
        const age = -beam.warning;
        if (age < -.09 || (age < 0 && reducedMotion)) continue;
        const fade = age < 0 ? .32 : Math.pow(clamp(1 - age / .4), .85);
        const height = 420, width = 54 + (tier - 1) * 4;
        ctx.save(); ctx.translate(beam.x, beam.y);
        // Only the final approach descends; contact stays on the damage tick.
        if (age < 0) {
          ctx.beginPath(); ctx.rect(-width, -height, width * 2, height * clamp(1 + age / .09)); ctx.clip();
        }
        ctx.globalAlpha = fade * (reducedMotion ? .52 : .92);
        ctx.drawImage(column, -width / 2, -height, width, height + 4);
        if (age >= 0) {
          const flare = Math.pow(clamp(1 - age / .3), .9);
          ctx.globalAlpha = flare * (reducedMotion ? .3 : .86);
          ctx.drawImage(glow, -35, -124, 70, 90);
          // The classic white crescent hangs in the lower part of the shaft.
          ctx.fillStyle = '#deffff'; ctx.beginPath(); ctx.moveTo(-5, -105);
          ctx.bezierCurveTo(34, -98, 34, -60, -5, -53);
          ctx.bezierCurveTo(11, -67, 11, -91, -5, -105); ctx.fill();
          if (!reducedMotion) {
            ctx.globalAlpha = fade * .55; ctx.fillStyle = '#aaa9ff';
            for (let i = 0; i < 5; i++) {
              const angle = i * 2.4 + beam.x * .03, radius = 12 + age * 38;
              ctx.beginPath(); ctx.ellipse(Math.cos(angle) * radius,
                Math.sin(angle) * radius * .4 - age * 36, 1.5, 3, -.3, 0, TAU); ctx.fill();
            }
          }
        }
        ctx.restore();
      }
    }
    ctx.restore();
  } };
}
