import { createMeteorRenderer } from './effects/meteor.js';
import { createFireRenderer } from './effects/fire.js';
import { createWindRenderer } from './effects/wind.js';

const canvas = document.querySelector('#effect-canvas');
const ctx = canvas.getContext('2d');
const stage = document.querySelector('#effect-stage');
const controls = document.querySelector('#effect-controls');
const playButton = document.querySelector('#play-toggle');
const restartButton = document.querySelector('#restart');
const status = document.querySelector('#preview-state');
const intensityInput = document.querySelector('#intensity');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const scenes = {
  moss: { name: '苔地', top: '#24362e', bottom: '#3f5740', ground: '#5d7250', stone: '#84907b', grass: '#98a57a' },
  sand: { name: '沙地', top: '#766851', bottom: '#aa9570', ground: '#c2ad83', stone: '#dbca9f', grass: '#685d42' },
  night: { name: '夜色', top: '#111e26', bottom: '#243740', ground: '#365150', stone: '#607b78', grass: '#819c91' }
};
const effects = {
  meteor: {
    create: createMeteorRenderer, name: '陨石', running: '陨石燃烧中', restart: '重新落下',
    title: '岩石，携火而来。', lead: '炽热裂缝穿过岩壳，火焰沿运动方向向后舒展。',
    badge: '已接入 · 卡尔混沌陨石', label: '火 / 混沌陨石', intensity: '火势',
    heading: '岩壳、裂缝与火尾。', eyebrow: '观察陨石',
    shapeTitle: '燃烧的岩石', shape: '暗色岩壳保留体积，火焰包住外缘，裂缝透出热光。',
    motionTitle: '滚动与火尾', motion: '固定位置观察滚动与火尾；重新落下可看入场。',
    description: '燃烧陨石：带有炽热裂缝的岩石滚动，后方拖出火焰、火星与淡烟。',
    sizeNote: '小尺寸与战斗一致，岩石主体直径约 50px。'
  },
  fire: {
    create: createFireRenderer, name: '火', running: '火焰燃烧中', restart: '重新点燃',
    title: '火起，升腾。', lead: '焰舌舒卷，火星向上，余烟缓缓散开。',
    badge: '火 · 独立样张', label: '火 / 燃烧', intensity: '火势',
    heading: '焰形、火星与烟气。', eyebrow: '观察火焰',
    shapeTitle: '火焰的层次', shape: '橙红外焰包住金黄内焰，尖端伸展、回卷。',
    motionTitle: '向上的热流', motion: '火星逐渐淡出，淡烟膨胀后散去。',
    description: '火焰样张：橙红焰舌摇曳上升，明亮内焰、火星与淡烟交错。',
    sizeNote: '小尺寸以约 90px 高的主焰为基准。', coreHeight: 240, width: 220
  },
  wind: {
    create: createWindRenderer, name: '风', running: '风场运行中', restart: '重新起风',
    title: '风起，成旋。', lead: '气流盘旋，尘叶卷起，一道有层次的风。',
    badge: '已接入 · 卡尔混沌之风', label: '风 / 龙卷', intensity: '风力',
    heading: '气流、尘叶与旋转。', eyebrow: '观察风场',
    shapeTitle: '旋转的层次', shape: '前后气流交错，宽阔风冠收向地面。',
    motionTitle: '被卷起的尘叶', motion: '尘粒与叶片沿气流盘旋，描出风的方向。',
    description: '风场样张：青白气流盘旋上升，尘粒与叶片围绕龙卷运动。',
    sizeNote: '缩到约 90px 高，检查实战大小的辨识度。', coreHeight: 280, width: 290
  }
};
const renderers = new Map();
let effect = 'meteor', direction = 1, meteorTravel = 0, loadVersion = 0, wantsPlayback = true;
const background = document.createElement('canvas');
let renderer, width = 0, height = 0, pixelRatio = 1, frame = 0;
let time = reducedMotion.matches ? 1.4 : 0;
let playing = false, previousTime = 0;
let intensity = 1, spin = 1, scene = 'moss', size = 'large';

// The preview owns scenery and time. The effect only draws at a supplied foot point.
function paintBackground() {
  background.width = canvas.width;
  background.height = canvas.height;
  const ground = background.getContext('2d');
  ground.scale(pixelRatio, pixelRatio);
  const palette = scenes[scene];
  const fill = ground.createLinearGradient(0, 0, 0, height);
  fill.addColorStop(0, palette.top);
  fill.addColorStop(1, palette.bottom);
  ground.fillStyle = fill;
  ground.fillRect(0, 0, width, height);
  const glow = ground.createRadialGradient(width * .5, height * .72, 10, width * .5, height * .7, width * .55);
  glow.addColorStop(0, palette.ground + '85');
  glow.addColorStop(1, palette.ground + '00');
  ground.fillStyle = glow;
  ground.fillRect(0, 0, width, height);
  ground.strokeStyle = palette.grass + '24';
  ground.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    ground.beginPath();
    ground.ellipse(width * .5, height * .76, width * (.18 + i * .14), height * (.08 + i * .06), -.06, 0, Math.PI * 2);
    ground.stroke();
  }
  for (let i = 0; i < 62; i++) {
    const x = ((i * 127.7 + 23) % 997) / 997 * width;
    const y = height * (.35 + ((i * 79.3) % 101) / 101 * .62);
    const s = 1.4 + i % 3;
    ground.fillStyle = palette.stone + '38';
    ground.beginPath();
    ground.ellipse(x, y, s * 1.8, s * .5, -.3, 0, Math.PI * 2);
    ground.fill();
    if (i % 4 === 0) {
      ground.strokeStyle = palette.grass + '65';
      ground.beginPath();
      ground.moveTo(x, y); ground.quadraticCurveTo(x - 5, y - 5, x - 3, y - 10);
      ground.moveTo(x, y); ground.quadraticCurveTo(x + 3, y - 4, x + 7, y - 6);
      ground.stroke();
    }
  }
}

function draw() {
  if (!ctx || !width) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  if (!renderer) return;
  if (effect === 'meteor') {
    const scale = size === 'combat' ? 1 : Math.min((width - 70) / 175, (height * .68 - 58) / 150, 2.8);
    renderer.draw(ctx, { x: width * (direction > 0 ? .61 : .39), y: height * .68,
      time, angle: direction > 0 ? 0 : Math.PI, travel: meteorTravel,
      lift: 72 * scale * Math.max(0, 1 - time / .15) ** 2,
      scale, opacity: Math.min(1, time / .04), detail: reducedMotion.matches ? 0 : 1 });
    return;
  }
  const settings = effects[effect];
  const scale = size === 'combat' ? 90 / settings.coreHeight
    : Math.min((height * .78 - 58) / 280, (width - 90) / settings.width, 1.35);
  const entrance = Math.min(1, time / .7);
  const growth = entrance * entrance * (3 - 2 * entrance);
  renderer.draw(ctx, {
    x: width * .5, y: height * .78, time, scale: scale * (.7 + growth * .3),
    intensity, spin, opacity: growth, detail: reducedMotion.matches ? .6 : 1
  });
}

function tick(now) {
  frame = 0;
  if (!playing) return;
  const dt = previousTime ? Math.min((now - previousTime) / 1000, .05) : 0;
  time += dt;
  if (effect === 'meteor') meteorTravel += dt * 240 * direction;
  previousTime = now;
  draw();
  frame = requestAnimationFrame(tick);
}

function setPlaying(value, message) {
  playing = value;
  cancelAnimationFrame(frame);
  frame = 0;
  previousTime = 0;
  playButton.textContent = value ? '暂停' : '播放';
  status.textContent = message || (value ? effects[effect].running : '已暂停');
  if (playing) frame = requestAnimationFrame(tick);
  else draw();
}

function resize() {
  const bounds = stage.getBoundingClientRect();
  width = Math.round(bounds.width);
  height = Math.round(bounds.height);
  pixelRatio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  paintBackground();
  draw();
}

playButton.addEventListener('click', () => {
  wantsPlayback = !playing;
  setPlaying(wantsPlayback);
});
restartButton.addEventListener('click', () => {
  time = playing ? 0 : 1.4;
  meteorTravel = time * 240 * direction;
  previousTime = 0;
  draw();
  status.textContent = playing ? effects[effect].restart : '已重置 · 暂停观察';
});
intensityInput.addEventListener('input', () => {
  intensity = Number(intensityInput.value) / 100;
  document.querySelector('#intensity-value').value = `${intensityInput.value}%`;
  intensityInput.setAttribute('aria-valuetext', `${intensityInput.value}%`);
  draw();
});
controls.addEventListener('change', (event) => {
  const input = event.target;
  if (input.name === 'spin') spin = Number(input.value);
  if (input.name === 'direction') direction = Number(input.value);
  if (input.name === 'size') {
    size = input.value;
    updateSizeLabel();
  }
  if (input.name === 'scene') {
    scene = input.value;
    document.querySelector('#scene-name').textContent = scenes[scene].name;
    paintBackground();
  }
  draw();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    wantsPlayback = false;
    if (renderer) setPlaying(false, '已暂停 · 页面暂时离开');
  }
});
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    wantsPlayback = false;
    time = Math.max(time, 1.4);
    if (renderer) setPlaying(false, '已暂停 · 减少动态效果');
  }
});
function updateSizeLabel() {
  document.querySelector('#scale-label').textContent = size === 'large' ? '大图观察'
    : effect === 'meteor' ? '战斗尺寸 · 岩石约 50px' : '小尺寸 · 约 90px';
}
function updateLabels() {
  const settings = effects[effect];
  const labels = {
    'effect-title': settings.title, 'effect-lead': settings.lead,
    'effect-badge': settings.badge, 'effect-name': settings.label,
    'controls-eyebrow': settings.eyebrow, 'controls-title': settings.heading,
    'intensity-label': settings.intensity, 'size-note': settings.sizeNote,
    'note-shape-title': settings.shapeTitle, 'note-shape': settings.shape,
    'note-motion-title': settings.motionTitle, 'note-motion': settings.motion,
    restart: settings.restart
  };
  for (const [id, text] of Object.entries(labels)) document.getElementById(id).textContent = text;
  document.title = `${settings.name} · 特效预览 · DotaRogue`;
  canvas.setAttribute('aria-label', settings.description);
  const spinControls = document.querySelector('#spin-controls');
  spinControls.hidden = effect !== 'wind';
  spinControls.disabled = effect !== 'wind';
  document.querySelector('#intensity-controls').hidden = effect === 'meteor';
  intensityInput.disabled = effect === 'meteor';
  const directionControls = document.querySelector('#direction-controls');
  directionControls.hidden = effect !== 'meteor';
  directionControls.disabled = effect !== 'meteor';
  updateSizeLabel();
}

async function selectEffect(next) {
  effect = next;
  const version = ++loadVersion;
  setPlaying(false);
  renderer = null;
  controls.disabled = true;
  playButton.disabled = true;
  restartButton.disabled = true;
  document.querySelector('#retry').hidden = true;
  updateLabels();
  draw();
  status.textContent = '正在准备特效…';
  try {
    if (!ctx) throw new Error('Canvas 2D unavailable');
    if (!renderers.has(next)) renderers.set(next, effects[next].create());
    const loaded = await renderers.get(next);
    if (version !== loadVersion) return;
    renderer = loaded;
    controls.disabled = false;
    playButton.disabled = false;
    restartButton.disabled = false;
    const autoplay = wantsPlayback && !reducedMotion.matches && !document.hidden;
    time = autoplay ? 0 : 1.4;
    meteorTravel = time * 240 * direction;
    resize();
    setPlaying(autoplay, reducedMotion.matches ? '已暂停 · 减少动态效果' : undefined);
  } catch (error) {
    renderers.delete(next);
    if (version !== loadVersion) return;
    status.textContent = '特效暂未加载，请重试';
    document.querySelector('#retry').hidden = false;
    console.error('Effect preview could not load.', error);
  }
}

document.querySelector('.effect-picker').addEventListener('change', event => selectEffect(event.target.value));
document.querySelector('#retry').addEventListener('click', () => selectEffect(effect));
new ResizeObserver(resize).observe(stage);
selectEffect(effect);
