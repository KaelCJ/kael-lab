/*
 * DotaRogue classic battlefield module.
 *
 * Positions are a scaled interpretation of the classic DotA 6.66b structure,
 * not an exact extraction of the original map files. The scene is intentionally
 * original Canvas art so the static GitHub Pages build has no external assets.
 */

export const DOTA_SIZE = Object.freeze({ w: 3600, h: 3600 });
export const DOTA_SPAWN = Object.freeze({ x: 828, y: 2844 });

const TAU = Math.PI * 2;
const W = DOTA_SIZE.w;
const H = DOTA_SIZE.h;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const scalePoint = ([u, v]) => ({ x: u * W, y: v * H });

const sentinel = '#6e9f68';
const scourge = '#677267';
const neutral = '#b19465';

const LANES = Object.freeze({
  top: [[.12, .84], [.08, .68], [.08, .22], [.13, .12], [.34, .09], [.72, .09], [.86, .13]].map(scalePoint),
  mid: [[.18, .79], [.32, .68], [.46, .55], [.55, .46], [.68, .33], [.81, .20]].map(scalePoint),
  bottom: [[.16, .89], [.45, .91], [.79, .91], [.90, .84], [.92, .64], [.92, .25], [.87, .16]].map(scalePoint),
});

const RIVER = Object.freeze([
  [.02, .28], [.12, .30], [.20, .32], [.30, .37], [.39, .43], [.48, .51],
  [.58, .57], [.65, .61], [.75, .65], [.84, .68], [.98, .72],
].map(([u, v], index, points) => {
  const p = scalePoint([u, v]);
  const t = index / Math.max(1, points.length - 1);
  return { x: p.x, y: p.y, r: 122 + Math.sin(t * Math.PI) * 18 };
}));

const TOWER_POSITIONS = Object.freeze({
  sentinel: {
    top: [[.14, .744], [.14, .573], [.145, .407]],
    mid: [[.275, .797], [.31, .69], [.437, .617]],
    bottom: [[.32, .902], [.505, .915], [.82, .902]],
  },
  scourge: {
    top: [[.675, .11], [.48, .135], [.165, .135]],
    mid: [[.758, .266], [.667, .363], [.575, .49]],
    bottom: [[.912, .334], [.887, .483], [.88, .641]],
  },
});

function towerObjects(faction) {
  const towers = [];
  for (const [lane, points] of Object.entries(TOWER_POSITIONS[faction])) {
    points.forEach(([u, v], i) => {
      const p = scalePoint([u, v]);
      towers.push({
        x: p.x,
        y: p.y,
        kind: 'tower',
        faction,
        lane,
        tier: 3 - i,
      });
    });
  }
  return towers;
}

function objectAt(u, v, kind, faction, extra = {}) {
  const p = scalePoint([u, v]);
  return { x: p.x, y: p.y, kind, faction, ...extra };
}

const SENTINEL_TOWERS = towerObjects('sentinel');
const SCOURGE_TOWERS = towerObjects('scourge');

/**
 * Display-only buildings and static neutral camps. Building objects are not
 * added to the collision terrain; they are scenery for the first map pass.
 */
export const DOTA_SCENERY = Object.freeze([
  ...SENTINEL_TOWERS,
  ...SCOURGE_TOWERS,
  objectAt(.15, .80, 'tower', 'sentinel', { lane: 'base', tier: 4 }),
  objectAt(.20, .85, 'tower', 'sentinel', { lane: 'base', tier: 4 }),
  objectAt(.80, .15, 'tower', 'scourge', { lane: 'base', tier: 4 }),
  objectAt(.85, .20, 'tower', 'scourge', { lane: 'base', tier: 4 }),
  objectAt(.16, .86, 'ancient', 'sentinel', { variant: 'world-tree' }),
  objectAt(.84, .14, 'ancient', 'scourge', { variant: 'frozen-throne' }),
  objectAt(.07, .93, 'fountain', 'sentinel'),
  objectAt(.93, .07, 'fountain', 'scourge'),
  objectAt(.07, .84, 'shop', 'sentinel', { shop: 'home' }),
  objectAt(.93, .16, 'shop', 'scourge', { shop: 'home' }),
  objectAt(.49, .35, 'shop', 'neutral', { shop: 'secret' }),
  objectAt(.51, .65, 'shop', 'neutral', { shop: 'secret' }),
  objectAt(.20, .59, 'shop', 'sentinel', { shop: 'goblin' }),
  objectAt(.80, .41, 'shop', 'scourge', { shop: 'goblin' }),
  objectAt(.11, .79, 'barracks', 'sentinel', { lane: 'top', role: 'melee' }),
  objectAt(.17, .80, 'barracks', 'sentinel', { lane: 'top', role: 'ranged' }),
  objectAt(.23, .83, 'barracks', 'sentinel', { lane: 'mid', role: 'melee' }),
  objectAt(.27, .85, 'barracks', 'sentinel', { lane: 'mid', role: 'ranged' }),
  objectAt(.28, .87, 'barracks', 'sentinel', { lane: 'bottom', role: 'melee' }),
  objectAt(.33, .87, 'barracks', 'sentinel', { lane: 'bottom', role: 'ranged' }),
  objectAt(.77, .21, 'barracks', 'scourge', { lane: 'top', role: 'melee' }),
  objectAt(.82, .21, 'barracks', 'scourge', { lane: 'top', role: 'ranged' }),
  objectAt(.73, .23, 'barracks', 'scourge', { lane: 'mid', role: 'melee' }),
  objectAt(.77, .25, 'barracks', 'scourge', { lane: 'mid', role: 'ranged' }),
  objectAt(.84, .25, 'barracks', 'scourge', { lane: 'bottom', role: 'melee' }),
  objectAt(.86, .29, 'barracks', 'scourge', { lane: 'bottom', role: 'ranged' }),
  objectAt(.65, .54, 'roshan', 'neutral', { campType: 'roshan' }),
  objectAt(.75, .81, 'camp', 'neutral', { tier: 'easy', campType: 'ogre' }),
  objectAt(.60, .73, 'camp', 'neutral', { tier: 'medium', campType: 'centaur' }),
  objectAt(.48, .64, 'camp', 'neutral', { tier: 'medium', campType: 'satyr' }),
  objectAt(.37, .72, 'camp', 'neutral', { tier: 'hard', campType: 'troll' }),
  objectAt(.49, .82, 'camp', 'neutral', { tier: 'hard', campType: 'hellbear' }),
  objectAt(.24, .55, 'camp', 'neutral', { tier: 'ancient', campType: 'ancient' }),
  objectAt(.25, .24, 'camp', 'neutral', { tier: 'easy', campType: 'ogre' }),
  objectAt(.38, .23, 'camp', 'neutral', { tier: 'medium', campType: 'centaur' }),
  objectAt(.46, .35, 'camp', 'neutral', { tier: 'medium', campType: 'satyr' }),
  objectAt(.57, .25, 'camp', 'neutral', { tier: 'hard', campType: 'troll' }),
  objectAt(.65, .38, 'camp', 'neutral', { tier: 'hard', campType: 'hellbear' }),
  objectAt(.78, .48, 'camp', 'neutral', { tier: 'ancient', campType: 'ancient' }),
]);

const SCENERY_CLEARANCE = new Map([
  ['tower', 82], ['ancient', 210], ['fountain', 100], ['shop', 82],
  ['barracks', 105], ['camp', 110], ['roshan', 150],
]);

function hash2(x, y, seed = 0) {
  let n = (Math.imul(Math.floor(x), 374761393) ^ Math.imul(Math.floor(y), 668265263) ^ Math.imul(seed, 1442695041)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  n ^= n >>> 16;
  return (n >>> 0) / 4294967296;
}

function distancePointSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const length2 = dx * dx + dy * dy;
  const t = length2 ? clamp(((px - ax) * dx + (py - ay) * dy) / length2, 0, 1) : 0;
  const x = ax + dx * t, y = ay + dy * t;
  return Math.hypot(px - x, py - y);
}

function polylineDistance(x, y, points) {
  let best = Infinity;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    best = Math.min(best, distancePointSegment(x, y, a.x, a.y, b.x, b.y));
  }
  return best;
}

function riverSide(x, y) {
  // Positive values point toward the Sentinel southwest bank.
  return y - (1000 + x * .442);
}

export function buildDotaTerrain() {
  const terrain = [];
  const step = 138;
  const laneClearance = 168;
  const riverClearance = 160;

  for (let gy = 0; gy < H; gy += step) {
    for (let gx = 0; gx < W; gx += step) {
      const jitterX = (hash2(gx, gy, 4) - .5) * step * .74;
      const jitterY = (hash2(gx, gy, 7) - .5) * step * .74;
      const x = gx + step * .5 + jitterX;
      const y = gy + step * .5 + jitterY;
      if (x < 58 || y < 58 || x > W - 58 || y > H - 58) continue;
      if (Math.min(...Object.values(LANES).map(points => polylineDistance(x, y, points))) < laneClearance) continue;
      if (polylineDistance(x, y, RIVER) < riverClearance) continue;
      const sceneryBlocked = DOTA_SCENERY.some(o => Math.hypot(x - o.x, y - o.y) < (SCENERY_CLEARANCE.get(o.kind) || 70) + 72);
      if (sceneryBlocked) continue;

      const side = riverSide(x, y);
      const faction = side > 170 ? 'sentinel' : side < -170 ? 'scourge' : (x < W * .5 ? 'sentinel' : 'scourge');
      const region = faction === 'sentinel' ? hash2(x * .7, y * .8, 17) : hash2(x * .8, y * .7, 31);
      const threshold = faction === 'sentinel' ? .47 : .50;
      if (region < threshold) continue;

      const kindRoll = hash2(x, y, 23);
      const kind = kindRoll > .90 ? 'rock' : 'tree';
      const r = kind === 'tree' ? 22 : 27;
      const nearby = terrain.some(o => Math.hypot(x - o.x, y - o.y) < r + o.r + 28);
      if (nearby) continue;
      terrain.push({ x: Math.round(x), y: Math.round(y), kind, r, faction });
    }
  }

  // Add a few deliberate clumps to keep the forest silhouette legible at a
  // distant camera scale while retaining open approaches to every tower.
  const clumps = [
    [270, 2330, 'sentinel'], [330, 2520, 'sentinel'], [450, 1700, 'sentinel'],
    [2660, 560, 'scourge'], [2860, 690, 'scourge'], [2440, 1240, 'scourge'],
    [3000, 2780, 'sentinel'], [650, 760, 'scourge'],
  ];
  for (const [cx, cy, faction] of clumps) {
    for (let i = 0; i < 4; i++) {
      const x = cx + (hash2(cx, i, 91) - .5) * 130;
      const y = cy + (hash2(cy, i, 97) - .5) * 130;
      if (polylineDistance(x, y, RIVER) < riverClearance || Math.min(...Object.values(LANES).map(points => polylineDistance(x, y, points))) < laneClearance) continue;
      if (DOTA_SCENERY.some(o => Math.hypot(x - o.x, y - o.y) < (SCENERY_CLEARANCE.get(o.kind) || 70) + 60)) continue;
      if (terrain.some(o => Math.hypot(x - o.x, y - o.y) < o.r + 45)) continue;
      terrain.push({ x: Math.round(x), y: Math.round(y), kind: i === 3 ? 'rock' : 'tree', r: i === 3 ? 27 : 22, faction });
    }
  }
  return terrain;
}

let groundCache = null;
let minimapCache = null;

function makeCanvas(width, height) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(width, height);
  if (typeof document !== 'undefined' && document.createElement) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  return null;
}

function smoothPath(ctx, points, close = false) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const previous = points[i - 1];
    const current = points[i];
    const midX = (previous.x + current.x) * .5;
    const midY = (previous.y + current.y) * .5;
    ctx.quadraticCurveTo(previous.x, previous.y, midX, midY);
  }
  const last = points[points.length - 1];
  ctx.quadraticCurveTo(last.x, last.y, last.x, last.y);
  if (close) ctx.closePath();
}

function fillSmoothPolygon(ctx, points, color) {
  ctx.save();
  smoothPath(ctx, points, true);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawNoise(ctx) {
  ctx.save();
  for (let x = 24; x < W; x += 96) {
    for (let y = 24; y < H; y += 96) {
      const n = hash2(x, y, 1337);
      if (n < .36) continue;
      const px = x + (hash2(x, y, 2) - .5) * 68;
      const py = y + (hash2(x, y, 3) - .5) * 68;
      const radius = 10 + n * 25;
      const sentinelLand = riverSide(px, py) > 140;
      ctx.globalAlpha = .05 + n * .055;
      ctx.fillStyle = sentinelLand ? '#d7db98' : '#2e3b35';
      ctx.beginPath();
      ctx.ellipse(px, py, radius * 1.55, radius * .7, hash2(x, y, 8) * TAU, 0, TAU);
      ctx.fill();
      if (n > .72) {
        ctx.globalAlpha *= .8;
        ctx.strokeStyle = sentinelLand ? '#466d48' : '#9b9b7b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(px - radius, py + 4);
        ctx.lineTo(px + radius * .7, py - 4);
        ctx.stroke();
      }
    }
  }
  ctx.restore();
}

function drawLane(ctx, points) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  smoothPath(ctx, points);
  ctx.strokeStyle = '#3a4635';
  ctx.globalAlpha = .35;
  ctx.lineWidth = 236;
  ctx.stroke();
  smoothPath(ctx, points);
  ctx.strokeStyle = '#927e58';
  ctx.globalAlpha = .72;
  ctx.lineWidth = 192;
  ctx.stroke();
  smoothPath(ctx, points);
  ctx.strokeStyle = '#b29b70';
  ctx.globalAlpha = .48;
  ctx.lineWidth = 148;
  ctx.stroke();
  ctx.globalAlpha = .33;
  ctx.strokeStyle = '#6c5b43';
  ctx.lineWidth = 6;
  ctx.setLineDash([22, 30]);
  ctx.stroke();
  ctx.restore();
}

function drawRiver(ctx) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  smoothPath(ctx, RIVER);
  ctx.strokeStyle = '#4b5e49';
  ctx.globalAlpha = .65;
  ctx.lineWidth = 328;
  ctx.stroke();
  smoothPath(ctx, RIVER);
  ctx.strokeStyle = '#847e61';
  ctx.globalAlpha = .92;
  ctx.lineWidth = 282;
  ctx.stroke();
  smoothPath(ctx, RIVER);
  ctx.strokeStyle = '#477b81';
  ctx.globalAlpha = .96;
  ctx.lineWidth = 222;
  ctx.stroke();
  smoothPath(ctx, RIVER);
  ctx.strokeStyle = '#79a9a0';
  ctx.globalAlpha = .34;
  ctx.lineWidth = 7;
  ctx.setLineDash([46, 48]);
  ctx.lineDashOffset = -12;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = .32;
  ctx.strokeStyle = '#c2d6bd';
  ctx.lineWidth = 4;
  for (let i = 0; i < RIVER.length - 1; i += 2) {
    const a = RIVER[i], b = RIVER[i + 1];
    const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy) || 1;
    const nx = -dy / length, ny = dx / length;
    ctx.beginPath();
    ctx.moveTo(a.x + nx * 44, a.y + ny * 44);
    ctx.lineTo(b.x + nx * 44, b.y + ny * 44);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBasePaving(ctx) {
  const bases = [
    { x: W * .16, y: H * .86, color: '#7ea88a', edge: '#314d41' },
    { x: W * .84, y: H * .14, color: '#8b7b86', edge: '#493e4a' },
  ];
  for (const base of bases) {
    ctx.save();
    ctx.fillStyle = base.edge;
    ctx.globalAlpha = .62;
    ctx.beginPath(); ctx.ellipse(base.x, base.y, 410, 330, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = base.color;
    ctx.globalAlpha = .48;
    ctx.beginPath(); ctx.ellipse(base.x, base.y, 365, 290, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#d4c793';
    ctx.globalAlpha = .26;
    ctx.lineWidth = 13;
    ctx.setLineDash([38, 24]);
    ctx.beginPath(); ctx.ellipse(base.x, base.y, 308, 235, 0, 0, TAU); ctx.stroke();
    ctx.restore();
  }
}

function paintGround(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#77875b';
  ctx.fillRect(0, 0, W, H);

  // The northeast bank is Scourge territory; the southwest bank is Sentinel.
  fillSmoothPolygon(ctx, [{ x: 0, y: 0 }, { x: W, y: 0 }, { x: W, y: 2610 }, ...RIVER.slice().reverse(), { x: 0, y: 1010 }], '#6d7468');
  fillSmoothPolygon(ctx, [{ x: 0, y: 1010 }, ...RIVER, { x: W, y: H }, { x: 0, y: H }], '#78945f');
  drawNoise(ctx);
  drawBasePaving(ctx);
  drawLane(ctx, LANES.top);
  drawLane(ctx, LANES.mid);
  drawLane(ctx, LANES.bottom);
  drawRiver(ctx);

  // Low cliff hints and shallow crossings keep the route readable without
  // turning the river into a collision wall.
  ctx.save();
  ctx.globalAlpha = .34;
  ctx.fillStyle = '#d8c99c';
  for (let i = 1; i < RIVER.length - 1; i += 2) {
    const p = RIVER[i];
    ctx.beginPath(); ctx.ellipse(p.x + 28, p.y - 20, 28, 13, .2, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

function ensureGroundCache() {
  if (!groundCache) {
    const canvas = makeCanvas(W, H);
    if (canvas) {
      paintGround(canvas);
      groundCache = canvas;
    }
  }
  return groundCache;
}

export function drawDotaGround(ctx) {
  const cache = ensureGroundCache();
  if (!cache) {
    ctx.fillStyle = '#78945f';
    ctx.fillRect(0, 0, W, H);
    return;
  }
  ctx.drawImage(cache, 0, 0);
}

function drawShadow(ctx, x, y, rx, ry, alpha = .3) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#17251e';
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawTower(ctx, o, time) {
  const enemy = o.faction === 'scourge';
  const body = enemy ? '#564b61' : '#3e6f56';
  const light = enemy ? '#d2a4d0' : '#bbecbb';
  const core = enemy ? '#b475c4' : '#6fdbc3';
  const height = o.tier === 4 ? 106 : 88;
  drawShadow(ctx, o.x, o.y + 4, 48 + (o.tier === 4 ? 14 : 0), 15, .38);
  ctx.save();
  ctx.translate(o.x, o.y);
  ctx.fillStyle = '#252d28';
  ctx.globalAlpha = .8;
  ctx.beginPath(); ctx.ellipse(0, -4, 39, 13, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = body;
  ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.moveTo(-25, -9); ctx.lineTo(-17, -height + 18); ctx.lineTo(17, -height + 18); ctx.lineTo(25, -9); ctx.closePath(); ctx.fill();
  ctx.fillStyle = light;
  ctx.globalAlpha = .46;
  ctx.beginPath(); ctx.moveTo(-16, -20); ctx.lineTo(-10, -height + 28); ctx.lineTo(2, -height + 25); ctx.lineTo(9, -24); ctx.closePath(); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = core;
  ctx.beginPath(); ctx.arc(0, -height + 28, o.tier === 4 ? 13 : 10, 0, TAU); ctx.fill();
  ctx.fillStyle = '#e6f4c3';
  ctx.globalAlpha = .55 + Math.sin((time || 0) * 2 + o.x * .01) * .12;
  ctx.beginPath(); ctx.arc(0, -height + 28, o.tier === 4 ? 5 : 4, 0, TAU); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = body;
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(-27, -10); ctx.lineTo(-36, -24); ctx.moveTo(27, -10); ctx.lineTo(36, -24); ctx.stroke();
  ctx.restore();
}

function drawFountain(ctx, o) {
  const enemy = o.faction === 'scourge';
  const basin = enemy ? '#5f526a' : '#4d856e';
  const water = enemy ? '#c18bca' : '#8fd8ca';
  drawShadow(ctx, o.x, o.y + 4, 62, 17, .34);
  ctx.save(); ctx.translate(o.x, o.y);
  ctx.fillStyle = '#2d382f'; ctx.beginPath(); ctx.ellipse(0, -5, 58, 18, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = basin; ctx.beginPath(); ctx.ellipse(0, -10, 52, 16, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = water; ctx.globalAlpha = .86; ctx.beginPath(); ctx.ellipse(0, -13, 37, 9, 0, 0, TAU); ctx.fill();
  ctx.globalAlpha = 1; ctx.fillStyle = basin; ctx.fillRect(-8, -74, 16, 61);
  ctx.beginPath(); ctx.arc(0, -78, 15, 0, TAU); ctx.fill();
  ctx.strokeStyle = water; ctx.globalAlpha = .7; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(-2, -72); ctx.quadraticCurveTo(-24, -54, -28, -22); ctx.moveTo(2, -72); ctx.quadraticCurveTo(24, -54, 28, -22); ctx.stroke();
  ctx.restore();
}

function drawShop(ctx, o) {
  const enemy = o.faction === 'scourge';
  const roof = enemy ? '#6a4e58' : '#805d3d';
  const wall = enemy ? '#8d7771' : '#9f855d';
  drawShadow(ctx, o.x, o.y + 4, 52, 15, .32);
  ctx.save(); ctx.translate(o.x, o.y);
  ctx.fillStyle = wall; ctx.fillRect(-34, -53, 68, 48);
  ctx.fillStyle = roof; ctx.beginPath(); ctx.moveTo(-44, -50); ctx.lineTo(0, -82); ctx.lineTo(44, -50); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2d3027'; ctx.fillRect(-11, -38, 22, 33);
  ctx.fillStyle = o.shop === 'secret' ? '#e0ba68' : '#d7ca90'; ctx.globalAlpha = .8; ctx.fillRect(-27, -31, 14, 12); ctx.fillRect(13, -31, 14, 12);
  ctx.globalAlpha = 1; ctx.strokeStyle = '#493b2e'; ctx.lineWidth = 4; ctx.strokeRect(-34, -53, 68, 48);
  ctx.restore();
}

function drawBarracks(ctx, o) {
  const enemy = o.faction === 'scourge';
  drawShadow(ctx, o.x, o.y + 4, 62, 16, .35);
  ctx.save(); ctx.translate(o.x, o.y);
  ctx.fillStyle = enemy ? '#534855' : '#4d6650'; ctx.fillRect(-45, -43, 90, 38);
  ctx.fillStyle = enemy ? '#9f6c7c' : '#9d7e4e'; ctx.beginPath(); ctx.moveTo(-57, -42); ctx.lineTo(0, -73); ctx.lineTo(57, -42); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#29322b'; ctx.fillRect(-13, -30, 26, 25);
  ctx.fillStyle = o.role === 'ranged' ? '#d2b16c' : '#9bb1a3'; ctx.fillRect(-32, -29, 14, 10); ctx.fillRect(18, -29, 14, 10);
  ctx.restore();
}

function drawAncient(ctx, o, time) {
  const enemy = o.faction === 'scourge';
  drawShadow(ctx, o.x, o.y + 6, 120, 28, .34);
  ctx.save(); ctx.translate(o.x, o.y);
  if (!enemy) {
    ctx.fillStyle = '#2b473a'; ctx.beginPath(); ctx.ellipse(0, -18, 110, 40, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#4f966c'; ctx.beginPath(); ctx.moveTo(-62, 0); ctx.quadraticCurveTo(-74, -110, -20, -140); ctx.quadraticCurveTo(-3, -175, 17, -143); ctx.quadraticCurveTo(78, -111, 59, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#a7d47e'; ctx.globalAlpha = .75; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(0, -134); ctx.lineTo(-17, -53); ctx.moveTo(0, -130); ctx.lineTo(38, -50); ctx.moveTo(0, -120); ctx.lineTo(-38, -45); ctx.stroke();
    ctx.fillStyle = '#d8f5aa'; ctx.globalAlpha = .75 + Math.sin((time || 0) * 1.7) * .1; ctx.beginPath(); ctx.arc(0, -113, 12, 0, TAU); ctx.fill();
  } else {
    ctx.fillStyle = '#3a3342'; ctx.beginPath(); ctx.ellipse(0, -18, 115, 42, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#62556d'; ctx.beginPath(); ctx.moveTo(-75, 0); ctx.lineTo(-54, -130); ctx.lineTo(-17, -96); ctx.lineTo(0, -156); ctx.lineTo(20, -96); ctx.lineTo(57, -132); ctx.lineTo(78, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#b38ac4'; ctx.globalAlpha = .8; ctx.beginPath(); ctx.arc(0, -112, 14, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#d4a9e0'; ctx.globalAlpha = .5; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-55, -91); ctx.lineTo(-19, -130); ctx.lineTo(0, -88); ctx.lineTo(27, -130); ctx.lineTo(57, -91); ctx.stroke();
  }
  ctx.restore();
}

function drawCamp(ctx, o) {
  const colors = {
    ogre: '#7e5b43', centaur: '#8b6745', satyr: '#705342', troll: '#5e714f', hellbear: '#694e43', ancient: '#6e6b57',
  };
  const monsterColor = colors[o.campType] || '#72604c';
  const size = o.tier === 'ancient' ? 1.28 : o.tier === 'hard' ? 1.1 : 1;
  drawShadow(ctx, o.x, o.y + 4, 62 * size, 18 * size, .3);
  ctx.save(); ctx.translate(o.x, o.y);
  ctx.strokeStyle = '#8d8367'; ctx.globalAlpha = .9; ctx.lineWidth = 7;
  for (let i = 0; i < 4; i++) {
    const angle = i * 1.57 + .3;
    ctx.fillStyle = i % 2 ? '#625c4d' : '#7f755e';
    ctx.beginPath(); ctx.ellipse(Math.cos(angle) * 42 * size, -7 + Math.sin(angle) * 18 * size, 18 * size, 11 * size, angle, 0, TAU); ctx.fill();
  }
  ctx.fillStyle = '#342e24'; ctx.beginPath(); ctx.ellipse(0, -12, 18 * size, 10 * size, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#e2a14c'; ctx.globalAlpha = .88; ctx.beginPath(); ctx.moveTo(-6, -14); ctx.lineTo(0, -43 * size); ctx.lineTo(7, -14); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f2cc6b'; ctx.beginPath(); ctx.arc(0, -24 * size, 5 * size, 0, TAU); ctx.fill();
  for (let i = 0; i < 3; i++) {
    const angle = -1.9 + i * 1.25;
    const mx = Math.cos(angle) * 32 * size;
    const my = -24 * size + Math.sin(angle) * 18 * size;
    ctx.fillStyle = monsterColor;
    ctx.beginPath(); ctx.ellipse(mx, my, 12 * size, 17 * size, angle, 0, TAU); ctx.fill();
    ctx.fillStyle = '#d9c37e'; ctx.beginPath(); ctx.arc(mx, my - 14 * size, 7 * size, 0, TAU); ctx.fill();
    if (o.campType === 'centaur') { ctx.fillStyle = '#49392e'; ctx.fillRect(mx - 9 * size, my - 2 * size, 18 * size, 9 * size); }
    if (o.campType === 'troll') { ctx.strokeStyle = '#b9d17a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(mx, my - 16 * size); ctx.lineTo(mx + 12 * size, my - 29 * size); ctx.stroke(); }
  }
  ctx.restore();
}

function drawRoshan(ctx, o) {
  drawShadow(ctx, o.x, o.y + 7, 106, 28, .4);
  ctx.save(); ctx.translate(o.x, o.y);
  ctx.fillStyle = '#453e3d'; ctx.beginPath(); ctx.ellipse(0, -37, 78, 56, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#6c6159'; ctx.beginPath(); ctx.ellipse(-4, -80, 54, 43, -.08, 0, TAU); ctx.fill();
  ctx.fillStyle = '#a79879'; ctx.beginPath(); ctx.moveTo(-52, -102); ctx.lineTo(-86, -147); ctx.lineTo(-49, -133); ctx.lineTo(-22, -164); ctx.lineTo(-10, -121); ctx.lineTo(26, -160); ctx.lineTo(32, -115); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#e8c872'; ctx.beginPath(); ctx.arc(-18, -92, 6, 0, TAU); ctx.arc(21, -92, 6, 0, TAU); ctx.fill();
  ctx.fillStyle = '#bc6e49'; ctx.beginPath(); ctx.moveTo(-18, -40); ctx.lineTo(0, -23); ctx.lineTo(18, -40); ctx.lineTo(0, -30); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#8e7a64'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-59, -48); ctx.lineTo(-98, -2); ctx.moveTo(59, -48); ctx.lineTo(96, -3); ctx.stroke();
  ctx.restore();
}

export function drawDotaScenery(ctx, o, time = 0) {
  if (!o || !o.kind) return;
  switch (o.kind) {
    case 'tower': drawTower(ctx, o, time); break;
    case 'fountain': drawFountain(ctx, o); break;
    case 'shop': drawShop(ctx, o); break;
    case 'barracks': drawBarracks(ctx, o); break;
    case 'ancient': drawAncient(ctx, o, time); break;
    case 'camp': drawCamp(ctx, o); break;
    case 'roshan': drawRoshan(ctx, o); break;
    default: break;
  }
}

export function drawDotaTree(ctx, o) {
  if (!o) return;
  if (o.kind === 'rock') {
    drawShadow(ctx, o.x, o.y + 5, 34, 12, .3);
    ctx.save(); ctx.translate(o.x, o.y);
    ctx.fillStyle = o.faction === 'scourge' ? '#4e5051' : '#777d68';
    ctx.beginPath(); ctx.moveTo(-28, -4); ctx.lineTo(-20, -30); ctx.lineTo(3, -42); ctx.lineTo(31, -21); ctx.lineTo(25, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = o.faction === 'scourge' ? '#7b706f' : '#a6a47e'; ctx.globalAlpha = .55;
    ctx.beginPath(); ctx.moveTo(-15, -24); ctx.lineTo(4, -35); ctx.lineTo(17, -20); ctx.lineTo(-4, -14); ctx.closePath(); ctx.fill();
    ctx.restore();
    return;
  }
  const dead = o.faction === 'scourge';
  drawShadow(ctx, o.x, o.y + 4, 30, 11, .28);
  ctx.save(); ctx.translate(o.x, o.y);
  ctx.fillStyle = dead ? '#4c4b43' : '#6f5737';
  ctx.beginPath(); ctx.moveTo(-7, 0); ctx.lineTo(-9, -50); ctx.lineTo(-3, -67); ctx.lineTo(4, -52); ctx.lineTo(9, 0); ctx.closePath(); ctx.fill();
  if (dead) {
    ctx.strokeStyle = '#5d5b51'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -48); ctx.lineTo(-30, -86); ctx.moveTo(-1, -42); ctx.lineTo(28, -78); ctx.moveTo(-4, -60); ctx.lineTo(-14, -100); ctx.moveTo(4, -57); ctx.lineTo(19, -103); ctx.stroke();
    ctx.fillStyle = '#67695b'; ctx.globalAlpha = .44; ctx.beginPath(); ctx.arc(-22, -84, 12, 0, TAU); ctx.arc(22, -76, 14, 0, TAU); ctx.fill();
  } else {
    ctx.fillStyle = '#47764d'; ctx.beginPath(); ctx.arc(-24, -76, 25, 0, TAU); ctx.arc(18, -82, 29, 0, TAU); ctx.arc(0, -103, 31, 0, TAU); ctx.fill();
    ctx.fillStyle = '#6d9f5b'; ctx.globalAlpha = .8; ctx.beginPath(); ctx.arc(-17, -91, 13, 0, TAU); ctx.arc(12, -103, 14, 0, TAU); ctx.fill();
    ctx.fillStyle = '#b5d777'; ctx.globalAlpha = .52; ctx.beginPath(); ctx.arc(-9, -112, 6, 0, TAU); ctx.arc(24, -87, 5, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

function drawMinimapGround(ctx, x, y, w, h) {
  ctx.fillStyle = '#677c58'; ctx.fillRect(x, y, w, h);
  const sx = w / W, sy = h / H;
  ctx.save(); ctx.translate(x, y); ctx.scale(sx, sy);
  fillSmoothPolygon(ctx, [{ x: 0, y: 0 }, { x: W, y: 0 }, { x: W, y: 2610 }, ...RIVER.slice().reverse(), { x: 0, y: 1010 }], '#5d665f');
  fillSmoothPolygon(ctx, [{ x: 0, y: 1010 }, ...RIVER, { x: W, y: H }, { x: 0, y: H }], '#6d895b');
  ctx.lineCap = 'round';
  for (const points of Object.values(LANES)) {
    smoothPath(ctx, points); ctx.strokeStyle = '#a5956d'; ctx.globalAlpha = .65; ctx.lineWidth = 118; ctx.stroke();
  }
  smoothPath(ctx, RIVER); ctx.strokeStyle = '#50818a'; ctx.globalAlpha = .95; ctx.lineWidth = 220; ctx.stroke();
  ctx.restore();
}

function ensureMinimapCache() {
  if (!minimapCache) {
    const canvas = makeCanvas(360, 360);
    if (canvas) {
      drawMinimapGround(canvas.getContext('2d'), 0, 0, 360, 360);
      const miniCtx = canvas.getContext('2d');
      const terrain = buildDotaTerrain();
      miniCtx.save(); miniCtx.scale(.1, .1);
      for (const o of terrain) {
        miniCtx.fillStyle = o.faction === 'scourge' ? '#3e4740' : '#356343';
        miniCtx.globalAlpha = o.kind === 'rock' ? .65 : .78;
        miniCtx.fillRect(o.x - (o.kind === 'rock' ? 22 : 12), o.y - (o.kind === 'rock' ? 22 : 20), o.kind === 'rock' ? 44 : 24, o.kind === 'rock' ? 44 : 40);
      }
      miniCtx.restore();
      minimapCache = canvas;
    }
  }
  return minimapCache;
}

function sceneryMarkerColor(o) {
  if (o.kind === 'tower' || o.kind === 'ancient' || o.kind === 'fountain' || o.kind === 'barracks') return o.faction === 'scourge' ? '#df9bca' : '#9be2ae';
  if (o.kind === 'camp' || o.kind === 'roshan') return '#e9b96b';
  return '#e8d58c';
}

export function drawDotaMinimap(ctx, { x = 0, y = 0, w = 160, h = 160, player, view } = {}) {
  if (!ctx || !w || !h) return;
  const cache = ensureMinimapCache();
  ctx.save();
  ctx.clearRect(x, y, w, h);
  if (cache) ctx.drawImage(cache, x, y, w, h);
  else drawMinimapGround(ctx, x, y, w, h);

  const sx = w / W, sy = h / H;
  ctx.save(); ctx.translate(x, y);
  for (const o of DOTA_SCENERY) {
    const px = o.x * sx, py = o.y * sy;
    ctx.fillStyle = sceneryMarkerColor(o);
    ctx.globalAlpha = o.kind === 'camp' ? .8 : .95;
    if (o.kind === 'tower') ctx.fillRect(px - 2.5, py - 2.5, 5, 5);
    else if (o.kind === 'roshan') { ctx.beginPath(); ctx.arc(px, py, 4.5, 0, TAU); ctx.fill(); }
    else if (o.kind === 'camp') { ctx.beginPath(); ctx.arc(px, py, 3, 0, TAU); ctx.fill(); }
    else { ctx.fillRect(px - 2, py - 2, 4, 4); }
  }
  if (view && Number.isFinite(view.x) && Number.isFinite(view.y)) {
    ctx.globalAlpha = .92;
    ctx.strokeStyle = '#fff7dc';
    ctx.lineWidth = Math.max(1.5, Math.min(w, h) / 90);
    ctx.strokeRect(view.x * sx, view.y * sy, view.w * sx, view.h * sy);
  }
  if (player && Number.isFinite(player.x) && Number.isFinite(player.y)) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffe85d';
    ctx.strokeStyle = '#6c4f2f';
    ctx.lineWidth = Math.max(1, Math.min(w, h) / 100);
    ctx.beginPath(); ctx.arc(player.x * sx, player.y * sy, Math.max(3, Math.min(w, h) / 38), 0, TAU); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
  ctx.restore();
}
