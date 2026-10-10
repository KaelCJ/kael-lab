(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const canvas = $('arena');
  const ctx = canvas.getContext('2d');
  const WORLD = { w: 2600, h: 1700 };
  const MAX_WAVES = 20;
  const SALVAGE_RATE = .8;
  const CHEST_HEAL_RATE = .2;
  const SAVE_KEY = 'kael-lab-starcore-survivor-v1';
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const ART_PATHS = {
    scavenger: './art/scavenger.svg', crawler: './art/crawler.svg',
    'scavenger-step': './art/scavenger-step.svg', 'scavenger-attack': './art/scavenger-attack.svg',
    'crawler-step': './art/crawler-step.svg', 'crawler-attack': './art/crawler-attack.svg',
    elite: './art/elite.svg', boss: './art/boss.svg',
    pulse: './art/pulse.svg', blade: './art/blade.svg'
  };
  const CHARACTERS = [
    { id: 'rover', name: '巡星者', icon: '✦', desc: '均衡机动 · 初始脉冲枪', weapon: 'pulse', weaponClass: 'ranged', hp: 30, stats: { speed: 8, ranged: 2 } },
    { id: 'bulwark', name: '装甲匠', icon: '⬡', desc: '高生命护甲 · 初始弧刃', weapon: 'blade', weaponClass: 'melee', hp: 40, stats: { armor: 3, speed: -8, melee: 3 } },
    { id: 'conductor', name: '导电师', icon: 'ϟ', desc: '元素连锁 · 初始电弧线圈', weapon: 'arc', weaponClass: 'ranged', hp: 26, stats: { elemental: 4, attackSpeed: 8 } },
    { id: 'scavenger', name: '拾荒鸦', icon: '◇', desc: '更易拾取 · 初始碎片霰枪', weapon: 'scatter', weaponClass: 'hybrid', hp: 27, stats: { luck: 15, pickup: 38, crit: 5 } }
  ];
  const BIOMES = [
    { id: 'docks', name: '赤沙废港', icon: '◈', desc: '灼热沙尘与失控机械', ground: '#263238', grid: '#40515a', accent: '#ffba72', hazard: '热流喷口' },
    { id: 'grove', name: '荧菌裂谷', icon: '✿', desc: '发光菌簇与腐蚀孢雾', ground: '#26303c', grid: '#3f4c61', accent: '#d6a0f1', hazard: '孢雾爆发' },
    { id: 'frost', name: '蓝霜残骸', icon: '❄', desc: '冻结碎片与寒流裂缝', ground: '#1e3440', grid: '#3b5967', accent: '#9fdcf5', hazard: '寒流爆裂' }
  ];
  const TERRAIN_LAYOUTS = {
    docks: {
      water: [[1600, 520, 448, 128], [610, 1130, 384, 64]],
      tree: [[930, 580], [1010, 1135], [1450, 550], [1690, 1050], [700, 800], [2100, 1080]],
      rock: [[1510, 1000], [1180, 560], [930, 1370], [1960, 840], [1780, 1300]]
    },
    grove: {
      water: [[530, 560, 448, 128], [1630, 980, 384, 128]],
      tree: [[1140, 580], [1550, 640], [940, 990], [1250, 1210], [2010, 660], [740, 1270]],
      rock: [[1050, 760], [1600, 830], [1460, 1220], [1840, 560], [550, 1050]]
    },
    frost: {
      water: [[1000, 450, 448, 128], [1600, 1070, 448, 128]],
      tree: [[900, 720], [1510, 660], [1120, 1190], [1960, 740], [740, 1180], [2080, 1300]],
      rock: [[1560, 940], [1000, 960], [1260, 1340], [1860, 540], [560, 730]]
    }
  };
  const DIFFICULTIES = [
    { id: 'normal', name: '标准', mult: 1, spawnRate: 1, enemyCap: 95, nearbyMin: 3 },
    { id: 'hard', name: '挑战', mult: 1.3, spawnRate: 1.16, enemyCap: 120, nearbyMin: 4 },
    { id: 'nightmare', name: '极限', mult: 1.65, spawnRate: 1.38, enemyCap: 150, nearbyMin: 6 }
  ];
  const PACES = [{ id: 'normal', name: '标准' }, { id: 'quick', name: '速战' }];

  const WEAPONS = {
    pulse: { name: '脉冲枪', icon: '✦', type: 'ranged', category: 'ranged', color: '#a9d9ff', damage: 7, cooldown: .42, range: 570, speed: 760, price: 12, desc: '精准的自动追踪射击。' },
    scatter: { name: '碎片霰枪', icon: '✧', type: 'ranged', category: 'ranged', color: '#ffc789', damage: 4, cooldown: .9, range: 390, speed: 590, count: 5, price: 16, desc: '近距离扇形散射。' },
    blade: { name: '回旋弧刃', icon: '◒', type: 'melee', category: 'melee', color: '#ffcd91', damage: 18, cooldown: .75, range: 122, price: 13, desc: '挥砍前方一片敌人。' },
    arc: { name: '电弧线圈', icon: 'ϟ', type: 'elemental', category: 'ranged', color: '#b5b4ff', damage: 11, cooldown: 1.12, range: 430, price: 18, desc: '闪电会跳向附近敌人。' },
    drone: { name: '护航浮球', icon: '◉', type: 'elemental', category: 'universal', color: '#8ef0d6', damage: 6, cooldown: .3, range: 90, price: 20, desc: '围绕你持续撞击敌人。' },
    ember: { name: '余烬喷射器', icon: '♨', type: 'elemental', category: 'universal', color: '#ff9d73', damage: 4, cooldown: .16, range: 230, price: 20, desc: '锥形火焰使敌人燃烧。' },
    rail: { name: '棱光轨炮', icon: '↗', type: 'ranged', category: 'ranged', color: '#f5e99c', damage: 28, cooldown: 1.7, range: 720, speed: 1100, pierce: 4, price: 25, desc: '高伤害穿透射线。' },
    spore: { name: '孢子发射器', icon: '●', type: 'elemental', category: 'ranged', color: '#c2e88c', damage: 13, cooldown: 1.15, range: 480, speed: 460, explosion: 92, price: 22, desc: '爆炸波及附近目标。' }
  };
  const WEAPON_IDS = Object.keys(WEAPONS);
  const ITEMS = [
    { id: 'plating', name: '折叠装甲', icon: '⬡', desc: '护甲 +2，最大生命 +3', bonus: { armor: 2, maxHp: 3 }, price: 17 },
    { id: 'capacitor', name: '超频电容', icon: 'ϟ', desc: '攻击速度 +12%', bonus: { attackSpeed: 12 }, price: 15 },
    { id: 'scope', name: '猎手镜片', icon: '◎', desc: '远程伤害 +4，暴击 +3%', bonus: { ranged: 4, crit: 3 }, price: 18 },
    { id: 'edge', name: '磁性刃片', icon: '◒', desc: '近战伤害 +5', bonus: { melee: 5 }, price: 14 },
    { id: 'battery', name: '星核电池', icon: '✶', desc: '元素伤害 +5', bonus: { elemental: 5 }, price: 17 },
    { id: 'boots', name: '喷气短靴', icon: '»', desc: '移动速度 +10%', bonus: { speed: 10 }, price: 15 },
    { id: 'magnet', name: '引力磁环', icon: '◇', desc: '拾取范围 +42', bonus: { pickup: 42 }, price: 13 },
    { id: 'lucky', name: '幸运星屑', icon: '✧', desc: '幸运 +12，暴击 +4%', bonus: { luck: 12, crit: 4 }, price: 19 },
    { id: 'repair', name: '自修复模块', icon: '✚', desc: '每 5 秒恢复 1 生命，最大生命 +2', bonus: { regen: 1, maxHp: 2 }, price: 19 },
    { id: 'siphon', name: '吸能导管', icon: '◉', desc: '生命窃取 +4%', bonus: { lifesteal: 4 }, price: 20 },
    { id: 'evade', name: '偏航芯片', icon: '↝', desc: '闪避 +6%', bonus: { dodge: 6 }, price: 18 },
    { id: 'core', name: '增幅核心', icon: '✦', desc: '所有伤害 +8%', bonus: { damage: 8 }, price: 21 },
    { id: 'medkit', name: '急救胶囊', icon: '✚', desc: '立即恢复 14 生命', bonus: { heal: 14 }, price: 10 }
  ];
  const CHEST_ITEMS = ITEMS.filter(item => item.id !== 'medkit');
  const SKILLS = {
    rover: [
      { name: '测距标定', desc: '标记射程内最远敌人 5 秒；远距离物理武器命中增伤 20%。', kind: 'active' },
      { name: '稳轨', desc: '连续移动 1 秒后，下次远程物理命中暴击率 +15%。' },
      { name: '掠线', desc: '每 6 次远程物理武器开火，追加一枚穿透弹。' },
      { name: '星点合围', desc: '每 12 次远程物理攻击命中，向最多 3 名敌人发射追踪弹。' }
    ],
    bulwark: [
      { name: '破围斩', desc: '向前突进并斩击路径上的敌人；与冲刺分别冷却。', kind: 'active' },
      { name: '踏稳', desc: '周围敌人达到 3 名时持续获得 22% 伤害减免。' },
      { name: '回锋', desc: '每 5 次近战物理武器攻击，追加一次侧向横扫。' },
      { name: '裂阵反击', desc: '周围敌人达到 4 名时，每 6 秒自动释放环形剑气并击退普通敌人。' }
    ],
    conductor: [
      { name: '极差场', desc: '放置持续 4 秒的法术伤害场域。', kind: 'active' },
      { name: '蓄电', desc: '法术攻击命中积累电荷；每次攻击最多积一层。' },
      { name: '绝缘回流', desc: '每积累 3 层电荷自动释放闪电，攻击附近目标并短暂冷却。' },
      { name: '过载边界', desc: '电荷满后释放向外扩散的法术脉冲。' }
    ],
    scavenger: [
      { name: '磁流召回', desc: '4 秒内拾取范围 +180。', kind: 'active' },
      { name: '拾荒分红', desc: '每手动拾取 8 个材料，额外获得 2 个材料。' },
      { name: '废件护层', desc: '每手动拾取 12 个材料，获得短时防护。' },
      { name: '满载运转', desc: '本波拾取 18 个材料后，短时提高伤害与攻速。' }
    ]
  };
  const SKILL_FX_COLORS = { rover: '#a6f5dc', bulwark: '#ffd28d', conductor: '#c5b2ff', scavenger: '#f6d17e' };
  const UPGRADES = [
    { name: '生命扩容', icon: '✚', bonus: { maxHp: 5 }, desc: '最大生命 +5，并恢复 5 生命' },
    { name: '装甲加固', icon: '⬡', bonus: { armor: 2 }, desc: '护甲 +2' },
    { name: '引擎增压', icon: '»', bonus: { speed: 8 }, desc: '移动速度 +8%' },
    { name: '精准弹道', icon: '◎', bonus: { ranged: 3 }, desc: '远程伤害 +3' },
    { name: '锋刃研磨', icon: '◒', bonus: { melee: 4 }, desc: '近战伤害 +4' },
    { name: '元素共鸣', icon: 'ϟ', bonus: { elemental: 4 }, desc: '元素伤害 +4' },
    { name: '快速装填', icon: '↻', bonus: { attackSpeed: 10 }, desc: '攻击速度 +10%' },
    { name: '弱点分析', icon: '✧', bonus: { crit: 6 }, desc: '暴击率 +6%' },
    { name: '磁场扩展', icon: '◇', bonus: { pickup: 30 }, desc: '拾取范围 +30' },
    { name: '再生细胞', icon: '✿', bonus: { regen: 1 }, desc: '每 5 秒恢复 1 生命' },
    { name: '偏航训练', icon: '↝', bonus: { dodge: 5 }, desc: '闪避率 +5%' },
    { name: '星尘增幅', icon: '✦', bonus: { damage: 7 }, desc: '所有伤害 +7%' },
    { name: '吸能回路', icon: '◉', bonus: { lifesteal: 3 }, desc: '生命窃取 +3%' },
    { name: '拾荒直觉', icon: '❖', bonus: { luck: 10 }, desc: '幸运 +10' }
  ];
  const ENEMIES = {
    crawler: { name: '爬行机', hp: 17, speed: 90, radius: 16, damage: 4, color: '#dd9b79', value: 1 },
    runner: { name: '追猎虫', hp: 13, speed: 155, radius: 13, damage: 3, color: '#e9cb7c', value: 1 },
    tank: { name: '铁甲兽', hp: 63, speed: 59, radius: 25, damage: 7, color: '#93aeb3', value: 3 },
    shooter: { name: '孢射体', hp: 26, speed: 78, radius: 18, damage: 4, color: '#ad9fdb', value: 2 },
    charger: { name: '冲锋残骸', hp: 40, speed: 94, radius: 21, damage: 6, color: '#f39779', value: 2 },
    splitter: { name: '分裂菌团', hp: 32, speed: 74, radius: 20, damage: 5, color: '#b2cf8c', value: 2 },
    elite: { name: '精英哨卫', hp: 270, speed: 96, radius: 31, damage: 10, color: '#ffbf79', value: 17 },
    boss: { name: '星核吞噬者', hp: 1150, speed: 74, radius: 53, damage: 14, color: '#f3a5c9', value: 40 }
  };
  const ENEMY_POSES = {
    crawler: ['step', 'attack'], runner: ['step'], tank: ['step'], shooter: ['attack'],
    charger: ['windup', 'charge'], splitter: ['step'], elite: ['windup', 'charge'], boss: ['windup', 'attack']
  };
  const PIXEL_ART_IDS = [
    ...CHARACTERS.flatMap(({ id }) => [id, `${id}-step`, `${id}-attack`, `skill-${id}`, ...[1, 2, 3].map(index => `skill-${id}-${index}`)]),
    ...Object.keys(WEAPONS),
    ...Object.keys(ENEMIES).flatMap(id => [id, ...ENEMY_POSES[id].map(pose => `${id}-${pose}`)]),
    ...ITEMS.map(item => `item-${item.id}`),
    ...UPGRADES.map((_, index) => `upgrade-${index}`),
    ...BIOMES.flatMap(({ id }) => ['ground', 'tree', 'rock', 'water', 'trap', 'preview'].map(kind => `map-${id}-${kind}`)),
    ...CHARACTERS.map(({ id }) => `effect-${id}`)
  ];
  const SKIN_ART = {
    draft: ART_PATHS,
    pixel: Object.fromEntries(PIXEL_ART_IDS.map(id => [id, `./art/pixel/${id}.svg`]))
  };
  const artImages = Object.fromEntries(Object.entries(SKIN_ART).flatMap(([skin, paths]) => Object.entries(paths).map(([id, path]) => {
    const image = new Image();
    image.src = path;
    return [`${skin}:${id}`, image];
  })));
  const artIcon = (id, fallback) => SKIN_ART[selectedSkin][id]
    ? `<img class="art-icon" src="${SKIN_ART[selectedSkin][id]}" alt="" decoding="async">`
    : fallback;
  const artImage = id => {
    const image = artImages[`${selectedSkin}:${id}`];
    return image?.complete && image.naturalWidth ? image : null;
  };

  let save = loadSave();
  let selectedCharacter = CHARACTERS[0].id;
  let selectedBiome = BIOMES[0].id;
  let selectedDifficulty = save.settings.difficulty || 'normal';
  let selectedPace = save.settings.pace || 'normal';
  let selectedSkin = save.settings.skin === 'draft' ? 'draft' : 'pixel';
  let soundEnabled = save.settings.sound !== false;
  let phase = 'title';
  let previousPhase = 'combat';
  let run = null;
  let viewW = 0, viewH = 0, dpr = 1, canvasScale = 1, lastFrame = 0, ambientTime = 0;
  let uid = 0, toastTimer = 0, audio = null, audioNoise = null, lastCombatSound = -Infinity;
  const lastSfxAt = Object.create(null);
  const keys = new Set();
  const stick = { x: 0, y: 0, pointerId: null };
  let moveTarget = null;
  let moveFlow = null;
  const decor = Array.from({ length: 125 }, () => ({ x: rand(30, WORLD.w - 30), y: rand(30, WORLD.h - 30), r: rand(2, 13), angle: rand(0, TAU) }));
  const NAV_STEP = 64, NAV_COLS = Math.floor(WORLD.w / NAV_STEP), NAV_ROWS = Math.floor(WORLD.h / NAV_STEP);

  function buildTerrain(id) {
    const layout = TERRAIN_LAYOUTS[id];
    return [
      ...layout.water.map(([x, y, w, h]) => ({ kind: 'water', x, y, w, h })),
      ...layout.tree.map(([x, y]) => ({ kind: 'tree', x, y, r: 22 })),
      ...layout.rock.map(([x, y]) => ({ kind: 'rock', x, y, r: 22 }))
    ];
  }
  function terrainCollision(x, y, radius, blockWater = true) {
    if (x < radius || y < radius || x > WORLD.w - radius || y > WORLD.h - radius) return true;
    for (const o of run.terrain) {
      if (o.kind === 'water') {
        if (blockWater && Math.hypot(x - clamp(x, o.x, o.x + o.w), y - clamp(y, o.y, o.y + o.h)) < radius) return true;
      } else if (Math.hypot(x - o.x, y - o.y) < radius + o.r) return true;
    }
    return false;
  }
  function terrainLineBlocked(x1, y1, x2, y2, radius, blockWater = true) {
    for (const o of run.terrain) {
      if (o.kind !== 'water') {
        if (segmentDistance(o, x1, y1, x2, y2) < radius + o.r) return true;
        continue;
      }
      if (!blockWater) continue;
      if (Math.hypot(x1 - clamp(x1, o.x, o.x + o.w), y1 - clamp(y1, o.y, o.y + o.h)) < radius
        || Math.hypot(x2 - clamp(x2, o.x, o.x + o.w), y2 - clamp(y2, o.y, o.y + o.h)) < radius) return true;
      for (const [cx, cy] of [[o.x, o.y], [o.x + o.w, o.y], [o.x, o.y + o.h], [o.x + o.w, o.y + o.h]]) {
        if (segmentDistance({ x: cx, y: cy }, x1, y1, x2, y2) < radius) return true;
      }
      const dx = x2 - x1, dy = y2 - y1;
      let enter = 0, exit = 1;
      for (const [start, delta, min, max] of [[x1, dx, o.x, o.x + o.w], [y1, dy, o.y, o.y + o.h]]) {
        if (!delta) { if (start < min || start > max) { enter = 2; break; } }
        else {
          const a = (min - start) / delta, b = (max - start) / delta;
          enter = Math.max(enter, Math.min(a, b));
          exit = Math.min(exit, Math.max(a, b));
        }
      }
      if (enter <= exit) return true;
    }
    return false;
  }
  function segmentCircleHitTime(x1, y1, x2, y2, cx, cy, radius) {
    const dx = x2 - x1, dy = y2 - y1, fx = x1 - cx, fy = y1 - cy;
    const c = fx * fx + fy * fy - radius * radius;
    if (c <= 0) return 0;
    const a = dx * dx + dy * dy;
    if (!a) return Infinity;
    const b = 2 * (fx * dx + fy * dy);
    const discriminant = b * b - 4 * a * c;
    // 与 terrainCollision / terrainLineBlocked 的严格相交规则一致：
    // 只擦边不算命中，避免目标看得见但弹丸在切线处被墙吃掉。
    if (discriminant <= 0) return Infinity;
    const t = (-b - Math.sqrt(discriminant)) / (2 * a);
    return t >= 0 && t <= 1 ? t : Infinity;
  }
  function terrainHitTime(x1, y1, x2, y2, radius) {
    let first = Infinity;
    for (const o of run.terrain) if (o.kind !== 'water') {
      first = Math.min(first, segmentCircleHitTime(x1, y1, x2, y2, o.x, o.y, radius + o.r));
    }
    return first;
  }
  function moveThroughTerrain(actor, dx, dy) {
    const radius = actor.radius ?? actor.r;
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 12));
    const sx = dx / steps, sy = dy / steps;
    for (let i = 0; i < steps; i++) {
      const nx = clamp(actor.x + sx, radius, WORLD.w - radius);
      const ny = clamp(actor.y + sy, radius, WORLD.h - radius);
      if (!terrainCollision(nx, ny, radius)) { actor.x = nx; actor.y = ny; }
      else {
        if (!terrainCollision(nx, actor.y, radius)) actor.x = nx;
        if (!terrainCollision(actor.x, ny, radius)) actor.y = ny;
      }
    }
  }
  function nearestWalkable(x, y, radius) {
    x = clamp(x, radius, WORLD.w - radius); y = clamp(y, radius, WORLD.h - radius);
    if (!terrainCollision(x, y, radius)) return { x, y };
    for (let reach = 24; reach <= 320; reach += 24) {
      for (let i = 0; i < 24; i++) {
        const angle = i * TAU / 24;
        const px = clamp(x + Math.cos(angle) * reach, radius, WORLD.w - radius);
        const py = clamp(y + Math.sin(angle) * reach, radius, WORLD.h - radius);
        if (!terrainCollision(px, py, radius)) return { x: px, y: py };
      }
    }
    return { x: WORLD.w / 2, y: WORLD.h / 2 };
  }
  function navIndex(x, y) {
    const col = clamp(Math.floor(x / NAV_STEP), 0, NAV_COLS - 1);
    const row = clamp(Math.floor(y / NAV_STEP), 0, NAV_ROWS - 1);
    return row * NAV_COLS + col;
  }
  function navPoint(index) {
    return { x: (index % NAV_COLS + .5) * NAV_STEP, y: (Math.floor(index / NAV_COLS) + .5) * NAV_STEP };
  }
  function closestNavIndex(x, y, free, radius, requireVisible = true) {
    const col = clamp(Math.floor(x / NAV_STEP), 0, NAV_COLS - 1);
    const row = clamp(Math.floor(y / NAV_STEP), 0, NAV_ROWS - 1);
    let best = -1, bestDistance = Infinity;
    for (let ring = 0; ring <= 4 && best < 0; ring++) {
      for (let yy = Math.max(0, row - ring); yy <= Math.min(NAV_ROWS - 1, row + ring); yy++) {
        for (let xx = Math.max(0, col - ring); xx <= Math.min(NAV_COLS - 1, col + ring); xx++) {
          const index = yy * NAV_COLS + xx;
          if (!free[index]) continue;
          const point = navPoint(index), d = Math.hypot(point.x - x, point.y - y);
          if (d < bestDistance && (!requireVisible || !terrainLineBlocked(x, y, point.x, point.y, radius))) {
            best = index; bestDistance = d;
          }
        }
      }
    }
    return best;
  }
  function makeFlow(x, y, radius) {
    const size = NAV_COLS * NAV_ROWS, free = new Uint8Array(size), distanceMap = new Int16Array(size);
    distanceMap.fill(-1);
    for (let i = 0; i < size; i++) {
      const point = navPoint(i);
      free[i] = terrainCollision(point.x, point.y, radius) ? 0 : 1;
    }
    const goal = closestNavIndex(x, y, free, radius, false);
    if (goal < 0) return { free, distanceMap };
    const queue = new Int16Array(size);
    let head = 0, tail = 0;
    queue[tail++] = goal; distanceMap[goal] = 0;
    while (head < tail) {
      const index = queue[head++], col = index % NAV_COLS, row = Math.floor(index / NAV_COLS);
      const neighbors = [col > 0 ? index - 1 : -1, col < NAV_COLS - 1 ? index + 1 : -1,
        row > 0 ? index - NAV_COLS : -1, row < NAV_ROWS - 1 ? index + NAV_COLS : -1];
      for (const next of neighbors) if (next >= 0 && free[next] && distanceMap[next] < 0) {
        const from = navPoint(index), to = navPoint(next);
        if (terrainLineBlocked(from.x, from.y, to.x, to.y, radius)) continue;
        distanceMap[next] = distanceMap[index] + 1;
        queue[tail++] = next;
      }
    }
    return { free, distanceMap };
  }
  function flowDirection(flow, x, y, radius) {
    const index = closestNavIndex(x, y, flow.free, radius);
    if (index < 0 || flow.distanceMap[index] < 0) return null;
    const current = navPoint(index);
    const col = index % NAV_COLS, row = Math.floor(index / NAV_COLS);
    const neighbors = [col > 0 ? index - 1 : -1, col < NAV_COLS - 1 ? index + 1 : -1,
      row > 0 ? index - NAV_COLS : -1, row < NAV_ROWS - 1 ? index + NAV_COLS : -1];
    let best = -1, bestDistance = flow.distanceMap[index];
    for (const next of neighbors) if (next >= 0 && flow.distanceMap[next] >= 0 && flow.distanceMap[next] < bestDistance) {
      const point = navPoint(next);
      if (!terrainLineBlocked(x, y, point.x, point.y, radius)) { best = next; bestDistance = flow.distanceMap[next]; }
    }
    const point = best < 0 ? current : navPoint(best), length = Math.hypot(point.x - x, point.y - y);
    if (best < 0 && (flow.distanceMap[index] === 0 || length <= 1)) return null;
    return { x: (point.x - x) / length, y: (point.y - y) / length };
  }
  function detourDirection(x, y, targetX, targetY, radius) {
    const goalAngle = Math.atan2(targetY - y, targetX - x);
    const step = Math.max(42, radius * 2.2);
    let best = null;
    for (let i = 0; i < 16; i++) {
      const offset = (i - 7.5) * (Math.PI / 8);
      const angle = goalAngle + offset;
      const probe = { x: clamp(x + Math.cos(angle) * step, radius, WORLD.w - radius), y: clamp(y + Math.sin(angle) * step, radius, WORLD.h - radius) };
      if (terrainCollision(probe.x, probe.y, radius)) continue;
      const blocked = terrainLineBlocked(probe.x, probe.y, targetX, targetY, radius);
      const score = Math.hypot(probe.x - targetX, probe.y - targetY) + (blocked ? 190 : 0) + Math.abs(offset) * 12;
      if (!best || score < best.score) best = { x: Math.cos(angle), y: Math.sin(angle), score };
    }
    return best ? { x: best.x, y: best.y } : null;
  }

  function loadSave() {
    try {
      const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
      return { settings: raw.settings || {}, records: raw.records || {}, wins: Number(raw.wins) || 0 };
    } catch (_) { return { settings: {}, records: {}, wins: 0 }; }
  }
  function persist() {
    save.settings = { sound: soundEnabled, pace: selectedPace, difficulty: selectedDifficulty, skin: selectedSkin };
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (_) { /* Storage may be unavailable. */ }
  }
  function updateSkinButtons() {
    const name = selectedSkin === 'pixel' ? '像素风' : '初版';
    const next = selectedSkin === 'pixel' ? '初版' : '像素风';
    $('game').dataset.skin = selectedSkin;
    for (const id of ['title-skin-button', 'skin-button', 'pause-skin-button']) {
      const button = $(id);
      button.textContent = id === 'pause-skin-button' ? `画面：${name}` : name;
      button.setAttribute('aria-label', `当前${name}，切换为${next}`);
      button.title = `切换为${next}`;
    }
  }
  function toggleSkin() {
    selectedSkin = selectedSkin === 'pixel' ? 'draft' : 'pixel';
    updateSkinButtons(); persist(); resize(); renderTitle();
    if (!run) return;
    renderWeaponStrip(); renderSkillStrip();
    if (phase === 'shop') renderShop();
    if (phase === 'pause') renderPauseDetails();
    if (phase === 'level') renderLevelChoices();
    if (phase === 'chest') renderChestReward();
    updateHUD();
  }
  function showToast(message) {
    const el = $('toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 1900);
  }
  function refocus(selector) { requestAnimationFrame(() => document.querySelector(selector)?.focus({ preventScroll: true })); }
  function playSfx(kind) {
    if (!soundEnabled) return;
    const now = performance.now();
    const combat = WEAPON_IDS.includes(kind) || kind === 'explosion' || kind === 'shooter-fire' || kind === 'boss-attack';
    if (combat && now - lastCombatSound < 90) return;
    if (now - (lastSfxAt[kind] ?? -Infinity) < 60) return;
    try {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return;
      audio ||= new AudioCtor();
      if (audio.state === 'suspended') audio.resume().catch(() => {});
      lastSfxAt[kind] = now;
      if (combat) lastCombatSound = now;
      const wave = (type, from, to, duration, volume, delay = 0) => {
        const start = audio.currentTime + delay;
        const osc = audio.createOscillator(), gain = audio.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(from, start);
        osc.frequency.exponentialRampToValueAtTime(to, start + duration);
        gain.gain.setValueAtTime(.0001, start);
        gain.gain.linearRampToValueAtTime(volume, start + .004);
        gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
        osc.connect(gain); gain.connect(audio.destination);
        osc.start(start); osc.stop(start + duration);
      };
      const noise = (duration, volume, frequency, filterType = 'bandpass') => {
        if (!audioNoise) {
          audioNoise = audio.createBuffer(1, Math.ceil(audio.sampleRate * .35), audio.sampleRate);
          const samples = audioNoise.getChannelData(0);
          for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
        }
        const source = audio.createBufferSource(), filter = audio.createBiquadFilter(), gain = audio.createGain();
        source.buffer = audioNoise;
        filter.type = filterType; filter.frequency.value = frequency;
        gain.gain.setValueAtTime(volume, audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + duration);
        source.connect(filter); filter.connect(gain); gain.connect(audio.destination);
        source.start(); source.stop(audio.currentTime + duration);
      };
      switch (kind) {
        case 'pulse': wave('triangle', 780, 340, .08, .027); noise(.035, .009, 2600, 'highpass'); break;
        case 'scatter': wave('sawtooth', 190, 75, .13, .029); noise(.1, .026, 950, 'lowpass'); break;
        case 'blade': wave('sine', 1000, 230, .13, .018); noise(.12, .016, 1350); break;
        case 'arc': wave('square', 1050, 270, .08, .014); noise(.075, .022, 2200, 'highpass'); break;
        case 'drone': wave('sine', 670, 290, .07, .016); break;
        case 'ember': wave('triangle', 210, 80, .11, .013); noise(.11, .016, 780); break;
        case 'rail': wave('sawtooth', 130, 48, .23, .034); wave('sine', 1080, 410, .17, .014); noise(.12, .021, 1500, 'highpass'); break;
        case 'spore': wave('sine', 360, 100, .15, .02); noise(.075, .011, 700, 'lowpass'); break;
        case 'explosion': wave('sawtooth', 155, 45, .19, .025); noise(.15, .02, 570, 'lowpass'); break;
        case 'shooter-fire': wave('triangle', 460, 190, .09, .012); break;
        case 'boss-attack': wave('sawtooth', 180, 55, .25, .032); noise(.16, .018, 680, 'lowpass'); break;
        case 'skill-rover': wave('sine', 530, 880, .13, .031); wave('triangle', 990, 1250, .1, .015, .055); break;
        case 'skill-bulwark': wave('sawtooth', 210, 90, .2, .028); noise(.16, .02, 1100); break;
        case 'skill-conductor': wave('square', 520, 135, .2, .02); noise(.13, .023, 2600, 'highpass'); break;
        case 'skill-scavenger': wave('sine', 310, 940, .2, .027); wave('triangle', 620, 1240, .15, .013, .06); break;
        case 'overload': wave('square', 760, 110, .23, .02); noise(.2, .027, 1900, 'highpass'); break;
        case 'dash': wave('triangle', 410, 140, .11, .024); noise(.08, .012, 1300); break;
        case 'hurt': wave('sawtooth', 165, 70, .15, .038); break;
        case 'chest-pickup': wave('sine', 580, 860, .11, .034); wave('sine', 800, 1100, .12, .017, .07); break;
        case 'chest-open': wave('triangle', 510, 830, .2, .025); wave('sine', 930, 1370, .25, .021, .1); break;
        case 'chest-take': wave('sine', 760, 1060, .16, .033); break;
        case 'chest-scrap': wave('triangle', 550, 250, .14, .025); noise(.075, .01, 1200); break;
        case 'warning-boss': wave('sawtooth', 170, 125, .31, .045); wave('sawtooth', 160, 95, .32, .036, .18); break;
        case 'warning-elite': wave('sawtooth', 260, 145, .25, .037); break;
        case 'victory': wave('triangle', 500, 670, .28, .035); wave('triangle', 750, 1030, .32, .034, .18); break;
        case 'defeat': wave('triangle', 310, 115, .4, .042); break;
        case 'merge': wave('triangle', 590, 980, .18, .033); wave('sine', 900, 1260, .2, .022, .09); break;
        case 'level': wave('sine', 690, 980, .13, .026); break;
        case 'wave-end': wave('triangle', 610, 820, .2, .029); break;
        case 'wave-start': wave('triangle', 480, 720, .16, .028); break;
        case 'buy': wave('triangle', 640, 860, .1, .028); break;
        case 'reroll': wave('square', 450, 310, .09, .016); break;
        case 'select': wave('sine', 610, 790, .12, .023); break;
      }
    } catch (_) { /* Sound is optional. */ }
  }
  function renderTitle() {
    updateSkinButtons();
    $('character-list').innerHTML = CHARACTERS.map(c => `<button class="selection-card" type="button" data-character="${c.id}" aria-pressed="${selectedCharacter === c.id}"><span class="selection-icon">${artIcon(c.id, c.icon)}</span><span><strong>${c.name}</strong><small>${c.desc}</small><small class="skill-preview">专属技能：${SKILLS[c.id].map(skill => skill.name).join(' · ')}</small></span></button>`).join('');
    $('biome-list').innerHTML = BIOMES.map(b => `<button class="selection-card" type="button" data-biome="${b.id}" aria-pressed="${selectedBiome === b.id}"><span class="selection-icon">${artIcon(`map-${b.id}-preview`, b.icon)}</span><span><strong>${b.name}</strong><small>${b.desc}</small></span></button>`).join('');
    $('difficulty-list').innerHTML = DIFFICULTIES.map(d => `<button type="button" data-difficulty="${d.id}" aria-pressed="${selectedDifficulty === d.id}">${d.name}</button>`).join('');
    $('pace-list').innerHTML = PACES.map(p => `<button type="button" data-pace="${p.id}" aria-pressed="${selectedPace === p.id}">${p.name}</button>`).join('');
    $('sound-button').textContent = soundEnabled ? '开启' : '关闭';
    const key = `${selectedCharacter}:${selectedBiome}:${selectedDifficulty}`;
    const best = save.records[key] || 0;
    $('record-label').textContent = `最佳记录：${best ? `第 ${best} 波` : '暂无'} · 通关 ${save.wins} 次`;
  }
  function hideScreens() {
    ['title-screen', 'level-screen', 'shop-screen', 'chest-screen', 'pause-screen', 'wave-result-screen', 'result-screen'].forEach(id => $(id).classList.add('hidden'));
  }
  function showPhase(next) {
    phase = next;
    if (next !== 'combat') { moveTarget = null; moveFlow = null; }
    hideScreens();
    $('hud').classList.toggle('hidden', next !== 'combat');
    $('touch-controls').classList.toggle('hidden', next !== 'combat');
    const screen = { title: 'title-screen', level: 'level-screen', shop: 'shop-screen', chest: 'chest-screen', pause: 'pause-screen', 'wave-result': 'wave-result-screen', result: 'result-screen' }[next];
    if (screen) $(screen).classList.remove('hidden');
  }
  function createWeapon(id, tier = 1) { return { id, tier, uid: ++uid, cool: 0 }; }
  function startRun() {
    resetStick(); keys.clear(); moveTarget = null; moveFlow = null;
    const character = CHARACTERS.find(c => c.id === selectedCharacter);
    const biome = BIOMES.find(b => b.id === selectedBiome);
    const difficulty = DIFFICULTIES.find(d => d.id === selectedDifficulty);
    const stats = { armor: 0, speed: 0, ranged: 0, melee: 0, elemental: 0, attackSpeed: 0, crit: 5, dodge: 0, regen: 0, pickup: 0, luck: 0, lifesteal: 0, damage: 0, ...character.stats };
    run = {
      character, biome, difficulty, stats, player: { x: WORLD.w / 2, y: WORLD.h / 2, radius: 17, hp: character.hp, maxHp: character.hp, facing: 0, attackFacing: 0, attackPose: 0, animTime: 0, invuln: 0, dashTime: 0, dashCooldown: 0, dashX: 1, dashY: 0 },
      wave: 0, elapsed: 0, totalTime: 0, timeLeft: 0, kills: 0, money: 0, earned: 0,
      level: 1, xp: 0, xpNeed: 8, pendingLevels: 0, levelChoices: [],
      weapons: [createWeapon(character.weapon)], shopOffers: [], rerolls: 0,
      pendingChests: 0, chestReward: null, attackSeq: 0,
      skills: { activeCooldown: 0, mark: null, moveTime: 0, steadyReady: false, rangedFires: 0, rangedHits: 0, meleeFires: 0,
        manualPickups: 0, shieldTime: 0, loadedTime: 0, loadedUsed: false, charge: 0, field: null, overload: null,
        guardTime: 0, guardReady: false, counterCooldown: 0, returnCooldown: 0, hitIds: new Set() },
      terrain: buildTerrain(biome.id), enemyFlow: null, enemyFlowClock: 0,
      enemies: [], bullets: [], enemyBullets: [], pickups: [], effects: [], hazards: [],
      spawnClock: 0, nearbySpawnClock: 0, hazardClock: 8, specialSpawned: false, normalChestDropped: false, regenClock: 0, lifeClock: 0,
      bossFight: false, pendingVictory: false, hudClock: 0, screenShake: 0,
      waveStartKills: 0, waveStartMoney: 0, waveStartPendingChests: 0, waveSummary: null,
      intermission: null
    };
    startWave();
  }
  function waveDuration() { return selectedPace === 'quick' ? 15 + Math.min(6, run.wave * .3) : run.wave === MAX_WAVES ? 90 : Math.min(60, 15 + run.wave * 5); }
  function startWave() {
    resetStick(); keys.clear(); moveTarget = null; moveFlow = null;
    run.wave += 1;
    run.elapsed = 0;
    run.timeLeft = waveDuration();
    run.spawnClock = .3;
    run.nearbySpawnClock = 0;
    run.hazardClock = 8;
    run.specialSpawned = false;
    run.normalChestDropped = false;
    run.bossFight = false;
    run.pendingVictory = false;
    run.skills.activeCooldown = 0;
    run.skills.moveTime = 0; run.skills.steadyReady = false; run.skills.rangedFires = 0; run.skills.rangedHits = 0; run.skills.meleeFires = 0;
    run.skills.manualPickups = 0; run.skills.loadedUsed = false; run.skills.loadedTime = 0;
    run.skills.magnetTime = 0; run.skills.shieldTime = 0; run.skills.guardTime = 0; run.skills.guardReady = false;
    run.skills.counterCooldown = 0; run.skills.returnCooldown = 0; run.skills.charge = 0;
    run.skills.hitIds.clear(); run.skills.mark = null; run.skills.field = null; run.skills.overload = null;
    run.enemies = []; run.bullets = []; run.enemyBullets = []; run.pickups = []; run.effects = []; run.hazards = [];
    run.player.invuln = 1;
    run.waveStartKills = run.kills;
    run.waveStartMoney = run.money;
    run.waveStartPendingChests = run.pendingChests;
    run.waveSummary = null;
    run.intermission = null;
    showPhase('combat');
    renderWeaponStrip();
    updateHUD();
    $('pause-button').focus({ preventScroll: true });
    showToast(run.wave === MAX_WAVES ? '最终波次：击败星核吞噬者！' : `第 ${run.wave} 波开始`);
    playSfx('wave-start');
  }
  function updateRecord() {
    const key = `${run.character.id}:${run.biome.id}:${run.difficulty.id}`;
    save.records[key] = Math.max(save.records[key] || 0, run.wave);
    persist();
  }
  function endRun(victory) {
    if (phase === 'result') return;
    if (victory) save.wins += 1;
    updateRecord();
    showPhase('result');
    $('result-kicker').textContent = victory ? '远征完成' : '远征终止';
    $('result-title').textContent = victory ? '星核已平息' : '这次抵达第 ' + run.wave + ' 波';
    $('result-message').textContent = victory ? '你撑过了全部 20 波敌潮。星港又多了一位幸存者。' : '已保存本次记录。调整装备组合，再向更深处出发。';
    $('result-stats').innerHTML = `<div><span>完成波次</span><strong>${run.wave} / ${MAX_WAVES}</strong></div><div><span>击败敌人</span><strong>${run.kills}</strong></div><div><span>获得材料</span><strong>${run.earned}</strong></div><div><span>角色等级</span><strong>${run.level}</strong></div>`;
    $('result-restart').focus({ preventScroll: true });
    playSfx(victory ? 'victory' : 'defeat');
    renderTitle();
  }

  function applyBonus(bonus) {
    for (const [key, value] of Object.entries(bonus)) {
      if (key === 'maxHp') { run.player.maxHp += value; run.player.hp = Math.min(run.player.maxHp, run.player.hp + value); }
      else if (key === 'heal') heal(value);
      else run.stats[key] = (run.stats[key] || 0) + value;
    }
    run.stats.dodge = Math.min(run.stats.dodge, 55);
    run.stats.lifesteal = Math.min(run.stats.lifesteal, 35);
  }
  function heal(amount) { run.player.hp = Math.min(run.player.maxHp, run.player.hp + amount); }
  function addXp(amount) {
    run.xp += amount;
    while (run.xp >= run.xpNeed) {
      run.xp -= run.xpNeed;
      run.level += 1;
      run.pendingLevels += 1;
      run.xpNeed = Math.round(8 + run.level * 4 + Math.pow(run.level, 1.32));
      playSfx('level');
    }
  }
  function levelOffers() {
    run.levelChoices = [...UPGRADES].sort(() => Math.random() - .5).slice(0, 3);
    renderLevelChoices();
    showPhase('level');
    $('level-options').querySelector('button')?.focus({ preventScroll: true });
  }
  function renderLevelChoices() {
    $('levels-left').textContent = `剩余 ${run.pendingLevels} 次`;
    $('level-options').innerHTML = run.levelChoices.map((u, i) => `<button class="choice-option" type="button" data-level="${i}"><span class="choice-icon">${artIcon(`upgrade-${UPGRADES.indexOf(u)}`, u.icon)}</span><strong>${u.name}</strong><span>${u.desc}</span></button>`).join('');
  }
  function finishWave() {
    if (phase !== 'combat') return;
    collectRemainingPickups();
    run.enemies = []; run.enemyBullets = []; run.bullets = [];
    run.waveSummary = {
      wave: run.wave,
      kills: run.kills - run.waveStartKills,
      money: run.money - run.waveStartMoney,
      chests: run.pendingChests - run.waveStartPendingChests,
      level: run.level,
      nextWave: run.wave < MAX_WAVES ? run.wave + 1 : null
    };
    beginWaveSummary();
    playSfx('wave-end');
  }
  function beginWaveSummary() {
    run.intermission = { kind: 'summary', time: 3.5 };
    renderWaveResult();
    showPhase('wave-result');
    $('wave-result-continue').focus({ preventScroll: true });
  }
  function beginNextWaveCountdown() {
    if (!run || run.wave >= MAX_WAVES || phase !== 'shop') return;
    run.intermission = { kind: 'next', time: 3 };
    renderWaveResult();
    showPhase('wave-result');
    $('wave-result-continue').focus({ preventScroll: true });
    playSfx('wave-start');
  }
  function resolveWaveIntermission() {
    if (phase !== 'wave-result' || !run?.intermission) return;
    const kind = run.intermission.kind;
    run.intermission = null;
    if (kind === 'next') { startWave(); return; }
    if (run.pendingChests > 0) openChest();
    else finishChestSequence();
  }
  function updateWaveIntermission(dt) {
    if (phase !== 'wave-result' || !run?.intermission) return;
    run.intermission.time = Math.max(0, run.intermission.time - dt);
    updateWaveResultCountdown();
    if (run.intermission.time <= 0) resolveWaveIntermission();
  }
  function renderWaveResult() {
    clearTimeout(toastTimer); $('toast').classList.remove('show');
    const summary = run.waveSummary || { wave: run.wave, kills: 0, money: 0, chests: 0, level: run.level, nextWave: run.wave + 1 };
    const isNext = run.intermission?.kind === 'next';
    $('wave-result-kicker').textContent = isNext ? '波次准备' : '本波结算';
    $('wave-result-title').textContent = isNext ? `下一波：第 ${summary.nextWave} 波` : `第 ${summary.wave} 波完成`;
    $('wave-result-message').textContent = isNext
      ? '战场即将重新开放，准备迎接新的敌潮。'
      : summary.nextWave ? '战利品已经记录，接下来处理宝箱、升级和补给。' : '最终敌潮已清理，正在整理远征结果。';
    $('wave-result-stats').innerHTML = isNext
      ? `<div><span>即将开始</span><strong>第 ${summary.nextWave} 波</strong></div><div><span>难度</span><strong>${run.difficulty.name}</strong></div>`
      : `<div><span>击败敌人</span><strong>${summary.kills}</strong></div><div><span>本波材料</span><strong>◇ ${summary.money}</strong></div><div><span>待开宝箱</span><strong>${summary.chests}</strong></div><div><span>当前等级</span><strong>${summary.level}</strong></div>`;
    $('wave-result-continue').textContent = isNext ? '立即开始' : '继续结算';
    updateWaveResultCountdown();
  }
  function updateWaveResultCountdown() {
    if (!run?.intermission) return;
    const time = Math.max(0, run.intermission.time);
    $('wave-result-countdown').textContent = `${time.toFixed(1)} 秒`;
    $('wave-result-countdown').setAttribute('aria-label', `剩余 ${time.toFixed(1)} 秒`);
  }
  function finishChestSequence() {
    if (run.wave >= MAX_WAVES) endRun(true);
    else if (run.pendingLevels > 0) levelOffers();
    else openShop();
  }
  function openChest() {
    run.chestReward = pick(CHEST_ITEMS);
    renderChestReward();
    showPhase('chest');
    playSfx('chest-open');
    $('chest-take-button').focus({ preventScroll: true });
  }
  function renderChestReward() {
    $('chests-left').textContent = run.pendingChests;
    $('chest-reward').innerHTML = `<span class="chest-reward-icon">${artIcon(`item-${run.chestReward.id}`, run.chestReward.icon)}</span><div><strong>${run.chestReward.name}</strong><p>${run.chestReward.desc}</p></div>`;
    $('chest-scrap-button').textContent = `拆解为 ◇ ${Math.round(run.chestReward.price * .5)}`;
  }
  function resolveChest(take) {
    if (phase !== 'chest' || !run.chestReward) return;
    const item = run.chestReward;
    if (take) { applyBonus(item.bonus); showToast(`获得${item.name}`); }
    else {
      const salvage = Math.round(item.price * .5);
      run.money += salvage; run.earned += salvage;
      showToast(`拆解${item.name}：材料 +${salvage}`);
    }
    run.pendingChests -= 1;
    run.chestReward = null;
    playSfx(take ? 'chest-take' : 'chest-scrap');
    if (run.pendingChests > 0) openChest(); else finishChestSequence();
  }
  function collectRemainingPickups() {
    const materials = run.pickups.filter(item => item.kind === 'material').length;
    const chests = run.pickups.length - materials;
    const payout = Math.floor(materials * SALVAGE_RATE);
    run.money += payout;
    run.earned += payout;
    if (materials) addXp(materials);
    if (chests) {
      const before = run.player.hp;
      heal(chests * Math.max(4, Math.round(run.player.maxHp * CHEST_HEAL_RATE)));
      run.pendingChests += chests;
      const recovered = Math.round(run.player.hp - before);
      showToast(`自动回收 ${chests} 个宝箱，待结算开启；${recovered ? `生命 +${recovered}` : '生命已满'}`);
    }
    run.pickups = [];
  }
  function openShop() {
    run.rerolls = 0;
    const held = run.shopOffers.filter(offer => offer?.locked && (offer.kind !== 'weapon' || canUseWeapon(offer.id))).slice(0, 4);
    run.shopOffers = [...held, ...Array.from({ length: 4 - held.length }, () => randomShopOffer())];
    heal(2 + Math.round(run.player.maxHp * .16));
    showPhase('shop');
    renderShop();
    $('reroll-button').focus({ preventScroll: true });
  }
  function randomShopOffer() {
    if (Math.random() < .58) {
      const tier = run.wave >= 14 && Math.random() < .15 ? 3 : run.wave >= 6 && Math.random() < .36 ? 2 : 1;
      const available = WEAPON_IDS.filter(canUseWeapon);
      const id = pick(available.length ? available : WEAPON_IDS);
      return { kind: 'weapon', id, tier, cost: Math.round(WEAPONS[id].price + run.wave * 1.7 + (tier - 1) * 22), locked: false };
    }
    const item = pick(ITEMS);
    return { kind: 'item', id: item.id, cost: Math.round(item.price + run.wave * 1.4), locked: false };
  }
  function canUseWeapon(id) {
    const category = WEAPONS[id]?.category;
    const role = run?.character?.weaponClass;
    return !!category && !!role && (category === 'universal' || role === 'hybrid' || category === role);
  }
  function canFitWeapon(offer) {
    return canUseWeapon(offer.id) && (run.weapons.length < 6 || run.weapons.some(w => w.id === offer.id && w.tier === offer.tier && w.tier < 4));
  }
  function renderShop() {
    $('shop-wave').textContent = `第 ${run.wave} 波完成`;
    $('shop-next-wave').textContent = run.wave < MAX_WAVES ? `下一波：第 ${run.wave + 1} 波 · 准备完成后进入倒计时` : '最终波次已完成 · 正在整理远征结果';
    $('next-wave-button').textContent = run.wave < MAX_WAVES ? `开始第 ${run.wave + 1} 波 ➜` : '查看远征结果';
    $('shop-money').textContent = run.money;
    $('shop-offers').innerHTML = run.shopOffers.map((offer, i) => {
      if (!offer) return `<div class="offer-card" aria-label="售罄"><span class="tier-label">售罄</span></div>`;
      const def = offer.kind === 'weapon' ? WEAPONS[offer.id] : ITEMS.find(item => item.id === offer.id);
      const disabled = run.money < offer.cost || (offer.kind === 'weapon' && !canFitWeapon(offer));
      const reason = run.money < offer.cost ? '材料不足' : offer.kind === 'weapon' && !canUseWeapon(offer.id) ? '当前驾驶员不能使用' : '武器槽已满';
      return `<div class="offer-card ${offer.locked ? 'locked' : ''}"><div class="offer-head"><span class="offer-icon">${artIcon(offer.kind === 'weapon' ? offer.id : `item-${offer.id}`, def.icon)}</span><span class="tier-label">${offer.kind === 'weapon' ? `武器 · ${'ⅠⅡⅢⅣ'[offer.tier - 1]}阶` : '改装'}</span></div><strong>${def.name}</strong><p>${def.desc}</p><div class="offer-actions"><button class="buy-button" type="button" data-buy="${i}" ${disabled ? `disabled title="${reason}"` : ''}>◇ ${offer.cost} 购买</button><button type="button" data-lock="${i}" aria-label="${offer.locked ? '解锁' : '锁定'} ${def.name}" aria-pressed="${offer.locked}">${offer.locked ? '🔒' : '锁'}</button></div></div>`;
    }).join('');
    const rerollCost = 3 + run.wave + run.rerolls * 3;
    $('reroll-button').textContent = `刷新商品 ◇ ${rerollCost}`;
    $('reroll-button').disabled = run.money < rerollCost;
    $('inventory').innerHTML = Array.from({ length: 6 }, (_, i) => {
      const w = run.weapons[i];
      if (!w) return '<div class="inventory-item empty">空槽</div>';
      const def = WEAPONS[w.id];
      const merge = w.tier < 4 && run.weapons.some(other => other !== w && other.id === w.id && other.tier === w.tier);
      return `<div class="inventory-item"><strong>${artIcon(w.id, def.icon)} ${def.name} ${'ⅠⅡⅢⅣ'[w.tier - 1]}</strong><div class="item-actions">${merge ? `<button type="button" data-merge="${i}">合成</button>` : ''}<button type="button" data-sell="${i}">卖 ◇${sellPrice(w)}</button></div></div>`;
    }).join('');
    $('shop-stats').textContent = statSummary();
  }
  function focusShopControl(preferred) {
    const preferredButton = document.querySelector(preferred);
    const nextButton = [preferredButton, ...document.querySelectorAll('#shop-offers [data-buy]'), $('reroll-button'), $('next-wave-button')]
      .find(button => button && !button.disabled);
    nextButton?.focus({ preventScroll: true });
  }
  function sellPrice(w) { return Math.round((WEAPONS[w.id].price + (w.tier - 1) * 22) * .5); }
  function statSummary() {
    const s = run.stats;
    return `生命 ${Math.ceil(run.player.hp)}/${run.player.maxHp} · 护甲 ${s.armor} · 移速 ${s.speed}% · 攻速 ${s.attackSpeed}% · 远程 ${s.ranged} · 近战 ${s.melee} · 元素 ${s.elemental} · 暴击 ${s.crit}% · 闪避 ${s.dodge}% · 再生 ${s.regen} · 幸运 ${s.luck}`;
  }
  function renderWeaponStrip() {
    $('weapon-strip').innerHTML = Array.from({ length: 6 }, (_, i) => {
      const w = run.weapons[i];
      return w ? `<span class="weapon-slot" role="img" aria-label="${WEAPONS[w.id].name} ${w.tier} 阶" title="${WEAPONS[w.id].name} ${w.tier} 阶">${artIcon(w.id, WEAPONS[w.id].icon)}<small>${'ⅠⅡⅢⅣ'[w.tier - 1]}</small></span>` : '<span class="weapon-slot empty">+</span>';
    }).join('');
  }
  function buyOffer(index) {
    const offer = run.shopOffers[index];
    if (!offer || run.money < offer.cost) return;
    if (offer.kind === 'weapon' && !canUseWeapon(offer.id)) { showToast('当前驾驶员不能使用这把武器'); return; }
    if (offer.kind === 'weapon' && !canFitWeapon(offer)) { showToast('武器槽已满，请先合成或卖出'); return; }
    run.money -= offer.cost;
    if (offer.kind === 'weapon') {
      const match = run.weapons.length >= 6 ? run.weapons.find(w => w.id === offer.id && w.tier === offer.tier && w.tier < 4) : null;
      if (match) { match.tier += 1; match.cool = 0; showToast(`${WEAPONS[match.id].name}合成为 ${match.tier} 阶`); }
      else { run.weapons.push(createWeapon(offer.id, offer.tier)); showToast(`装备了${WEAPONS[offer.id].name}`); }
    } else {
      const item = ITEMS.find(i => i.id === offer.id);
      applyBonus(item.bonus); showToast(`获得${item.name}`);
    }
    run.shopOffers[index] = null;
    renderShop(); renderWeaponStrip(); playSfx('buy');
    focusShopControl(`#shop-offers [data-buy="${(index + 1) % 4}"]`);
  }
  function mergeWeapon(index) {
    const first = run.weapons[index];
    if (!first || first.tier >= 4) return;
    const secondIndex = run.weapons.findIndex((w, i) => i !== index && w.id === first.id && w.tier === first.tier);
    if (secondIndex < 0) return;
    first.tier += 1; first.cool = 0;
    run.weapons.splice(secondIndex, 1);
    renderShop(); renderWeaponStrip(); showToast(`${WEAPONS[first.id].name}合成为 ${first.tier} 阶`); playSfx('merge');
    focusShopControl(`#inventory [data-sell="${Math.min(index, run.weapons.length - 1)}"]`);
  }
  function sellWeapon(index) {
    const w = run.weapons[index];
    if (!w || run.weapons.length <= 1) { showToast('至少保留一把武器'); return; }
    run.money += sellPrice(w); run.weapons.splice(index, 1);
    renderShop(); renderWeaponStrip(); showToast('武器已卖出');
    focusShopControl(`#inventory [data-sell="${Math.min(index, run.weapons.length - 1)}"]`);
  }
  function rerollShop() {
    const cost = 3 + run.wave + run.rerolls * 3;
    if (run.money < cost) return;
    run.money -= cost; run.rerolls += 1;
    run.shopOffers = run.shopOffers.map(offer => offer?.locked ? offer : randomShopOffer());
    renderShop(); playSfx('reroll');
    focusShopControl('#reroll-button');
  }

  function enemyPool() {
    const pool = ['crawler', 'crawler', 'crawler'];
    if (run.wave >= 2) pool.push('runner', 'runner');
    if (run.wave >= 4) pool.push('tank');
    if (run.wave >= 6) pool.push('shooter', 'shooter');
    if (run.wave >= 8) pool.push('charger');
    if (run.wave >= 11) pool.push('splitter', 'splitter');
    if (run.wave >= 16) pool.push('tank', 'charger', 'shooter');
    return pool;
  }
  function spawnEnemy(id, x, y, small = false, nearPlayer = false) {
    const def = ENEMIES[id];
    if (x === undefined) {
      const p = run.player;
      const angle = rand(0, TAU);
      const viewport = Math.max(viewW, viewH);
      const radius = nearPlayer
        ? rand(110, Math.max(180, Math.min(260, Math.min(viewW, viewH) * .5)))
        : viewport * .58 + rand(100, 210);
      x = clamp(p.x + Math.cos(angle) * radius, 45, WORLD.w - 45);
      y = clamp(p.y + Math.sin(angle) * radius, 45, WORLD.h - 45);
    }
    const spawn = nearestWalkable(x, y, def.radius * (small ? .7 : 1));
    x = spawn.x; y = spawn.y;
    const healthScale = (1 + (run.wave - 1) * .19) * run.difficulty.mult;
    const hp = Math.round(def.hp * healthScale * (small ? .45 : 1));
    run.enemies.push({ id, x, y, hp, maxHp: hp, r: def.radius * (small ? .7 : 1), speed: def.speed * (1 + run.wave * .008), damage: def.damage, value: small ? 0 : def.value,
      attackClock: rand(.6, 2.1), chargeClock: rand(1.5, 3.5), charging: 0, windup: 0, chargeX: 0, chargeY: 0, attackPose: 0, biteCooldown: 0, animTime: rand(0, 1), burn: 0, burnClock: 0, hitFlash: 0, stuckTime: 0, dead: false, hitBy: new Map() });
  }
  function spawnWaveEnemies(dt) {
    if (run.timeLeft <= 0) return;
    run.spawnClock -= dt;
    const interval = Math.max(.26, (1.35 - run.wave * .045) / run.difficulty.spawnRate);
    if (run.spawnClock <= 0) {
      run.spawnClock += interval;
      if (run.enemies.length < run.difficulty.enemyCap) {
        const count = Math.min(8, 1 + Math.floor(run.wave / 5) + Math.floor((run.difficulty.spawnRate - 1) * 3));
        const pool = enemyPool();
        for (let i = 0; i < count && run.enemies.length < run.difficulty.enemyCap; i++) spawnEnemy(pick(pool), undefined, undefined, false, i === 0 && run.enemies.length < run.difficulty.nearbyMin);
      }
    }
    const nearbyRadius = Math.max(260, Math.min(520, Math.max(viewW, viewH) * .7));
    const cam = camera();
    const nearby = run.enemies.filter(e => !e.dead && visible(e, cam, 0) && distance(e, run.player) <= nearbyRadius).length;
    run.nearbySpawnClock -= dt;
    if (nearby < run.difficulty.nearbyMin && run.nearbySpawnClock <= 0 && run.enemies.length < run.difficulty.enemyCap) {
      const pool = enemyPool();
      spawnEnemy(pick(pool), undefined, undefined, false, true);
      run.nearbySpawnClock = .55 / run.difficulty.spawnRate;
    }
    if (!run.specialSpawned && run.elapsed > Math.min(7, waveDuration() * .3)) {
      run.specialSpawned = true;
      if (run.wave === 10 || run.wave === 20) {
        spawnEnemy('boss'); run.bossFight = true;
        showToast('警告：星核吞噬者接近！'); playSfx('warning-boss');
      } else if (run.wave % 5 === 0) {
        spawnEnemy('elite'); showToast('精英哨卫出现！'); playSfx('warning-elite');
      }
    }
  }
  function movementVector() {
    let x = stick.x, y = stick.y;
    if (keys.has('a') || keys.has('ArrowLeft')) x -= 1;
    if (keys.has('d') || keys.has('ArrowRight')) x += 1;
    if (keys.has('w') || keys.has('ArrowUp')) y -= 1;
    if (keys.has('s') || keys.has('ArrowDown')) y += 1;
    const length = Math.hypot(x, y);
    if (length > .05) { moveTarget = null; moveFlow = null; }
    else if (moveTarget && run) {
      const dx = moveTarget.x - run.player.x, dy = moveTarget.y - run.player.y;
      const remaining = Math.hypot(dx, dy);
      if (remaining <= 3) { moveTarget = null; moveFlow = null; return { x: 0, y: 0 }; }
      if (terrainLineBlocked(run.player.x, run.player.y, moveTarget.x, moveTarget.y, run.player.radius)) {
        const direction = flowDirection(moveFlow, run.player.x, run.player.y, run.player.radius);
        if (direction) return direction;
        moveTarget = null; moveFlow = null;
        return { x: 0, y: 0 };
      }
      return { x: dx / remaining, y: dy / remaining, remaining };
    }
    return length > 1 ? { x: x / length, y: y / length } : { x, y };
  }
  function tryDash() {
    if (phase !== 'combat' || run.player.dashCooldown > 0) return;
    const v = movementVector(), angle = run.player.facing;
    const length = Math.hypot(v.x, v.y);
    run.player.dashX = length > .05 ? v.x / length : Math.cos(angle);
    run.player.dashY = length > .05 ? v.y / length : Math.sin(angle);
    moveTarget = null; moveFlow = null;
    run.player.dashTime = .18;
    run.player.dashCooldown = 4.2;
    run.player.invuln = Math.max(run.player.invuln, .25);
    run.effects.push({ kind: 'pulse', x: run.player.x, y: run.player.y, r: 32, color: '#b5f6eb', life: .3, maxLife: .3 });
    updateHUD();
    playSfx('dash');
  }
  function segmentDistance(e, x1, y1, x2, y2) {
    const dx = x2 - x1, dy = y2 - y1;
    const t = clamp(((e.x - x1) * dx + (e.y - y1) * dy) / (dx * dx + dy * dy || 1), 0, 1);
    return Math.hypot(e.x - x1 - dx * t, e.y - y1 - dy * t);
  }
  function dealSkillDamage(e, amount) { damageEnemy(e, amount * (1 + run.stats.damage / 100), false); }
  function skillBurst(index, x, y, radius = 54, life = .38, angle = 0) {
    run.effects.push({ kind: 'skill-burst', character: run.character.id, skill: index,
      x, y, r: radius, angle, life, maxLife: life });
  }
  function skillSignature(character, x, y, radius, life = .55, angle = 0) {
    run.effects.push({ kind: 'signature', character, x, y, r: radius, angle, life, maxLife: life });
  }
  function tryActiveSkill() {
    if (phase !== 'combat' || run.skills.activeCooldown > 0) return;
    const p = run.player, s = run.skills;
    if (run.character.id === 'rover') {
      const range = Math.max(0, ...run.weapons.filter(w => WEAPONS[w.id].type === 'ranged').map(w => WEAPONS[w.id].range));
      const target = run.enemies.filter(e => !e.dead && distance(e, p) <= range
        && !terrainLineBlocked(p.x, p.y, e.x, e.y, 4, false)).sort((a, b) => distance(b, p) - distance(a, p))[0];
      if (!target) { showToast('射程内没有可标定目标'); return; }
      s.mark = { target, time: 5 };
      s.activeCooldown = 12;
      run.effects.push({ kind: 'text', x: target.x, y: target.y - target.r - 15, text: '已标定', color: '#b5f6eb', life: .8, maxLife: .8 });
      run.effects.push({ kind: 'line', x1: p.x, y1: p.y, x2: target.x, y2: target.y, color: '#b5f6eb', life: .22, maxLife: .22, width: 5 });
      skillBurst(0, target.x, target.y, target.r + 30);
      skillSignature('rover', target.x, target.y, target.r + 44, .7);
      run.screenShake = 3;
    } else if (run.character.id === 'bulwark') {
      const v = movementVector(), nearest = run.enemies.filter(e => !e.dead).sort((a, b) => distance(a, p) - distance(b, p))[0];
      const angle = Math.hypot(v.x, v.y) > .05 ? Math.atan2(v.y, v.x) : nearest ? Math.atan2(nearest.y - p.y, nearest.x - p.x) : p.facing;
      const x = p.x, y = p.y;
      moveThroughTerrain(p, Math.cos(angle) * 100, Math.sin(angle) * 100);
      p.facing = angle; moveTarget = null; moveFlow = null;
      for (const e of run.enemies) if (!e.dead && segmentDistance(e, x, y, p.x, p.y) < e.r + 38) dealSkillDamage(e, 16 + run.stats.melee);
      run.effects.push({ kind: 'line', x1: x, y1: y, x2: p.x, y2: p.y, color: '#ffcd91', life: .23, maxLife: .23, width: 22 });
      skillBurst(0, (x + p.x) / 2, (y + p.y) / 2, 72, .42, angle);
      skillSignature('bulwark', p.x, p.y, 120, .55, angle);
      run.screenShake = 8;
      s.activeCooldown = 9;
    } else if (run.character.id === 'scavenger') {
      s.magnetTime = 4;
      s.activeCooldown = 12;
      run.effects.push({ kind: 'pulse', x: p.x, y: p.y, r: 255 + run.stats.pickup, color: '#ffe4a0', life: .4, maxLife: .4 });
      skillBurst(0, p.x, p.y, 112);
      skillSignature('scavenger', p.x, p.y, 180 + run.stats.pickup, .75);
    } else {
      s.field = { x: p.x, y: p.y, time: 4, tick: 0 };
      s.activeCooldown = 10;
      run.effects.push({ kind: 'pulse', x: p.x, y: p.y, r: 115, color: '#b5b4ff', life: .4, maxLife: .4 });
      skillBurst(0, p.x, p.y, 115);
      skillSignature('conductor', p.x, p.y, 150, .7);
    }
    updateHUD();
    playSfx(`skill-${run.character.id}`);
  }
  function triggerConductorReturn() {
    const s = run.skills, p = run.player;
    if (run.character.id !== 'conductor' || s.charge < 3 || s.returnCooldown > 0) return;
    const targets = run.enemies.filter(e => !e.dead && distance(e, p) <= 190).sort((a, b) => distance(a, p) - distance(b, p)).slice(0, 3);
    if (!targets.length) return;
    s.charge -= 3; s.returnCooldown = 5;
    for (const target of targets) {
      dealSkillDamage(target, 7 + run.stats.elemental * .55);
      run.effects.push({ kind: 'line', x1: p.x, y1: p.y, x2: target.x, y2: target.y, color: '#b5b4ff', life: .24, maxLife: .24, width: 4 });
      skillBurst(2, target.x, target.y, 38, .28);
    }
    run.effects.push({ kind: 'pulse', x: p.x, y: p.y, r: 190, color: '#b5b4ff', life: .32, maxLife: .32 });
    skillBurst(2, p.x, p.y, 72, .35);
    playSfx('skill-conductor');
  }
  function triggerBulwarkCounter() {
    const s = run.skills, p = run.player;
    if (run.character.id !== 'bulwark' || s.counterCooldown > 0) return;
    s.counterCooldown = 6;
    for (const e of run.enemies) if (!e.dead && distance(e, p) <= 155 + e.r) {
      dealSkillDamage(e, 12 + run.stats.melee);
      if (!e.dead && e.id !== 'boss' && e.id !== 'elite') {
        const angle = Math.atan2(e.y - p.y, e.x - p.x);
        moveThroughTerrain(e, Math.cos(angle) * 65, Math.sin(angle) * 65);
      }
    }
    run.effects.push({ kind: 'pulse', x: p.x, y: p.y, r: 155, color: '#ffcd91', life: .35, maxLife: .35 });
    run.effects.push({ kind: 'arc', x: p.x, y: p.y, r: 155, angle: 0, arc: Math.PI, color: '#ffcd91', life: .42, maxLife: .42 });
    skillBurst(3, p.x, p.y, 155, .48);
    playSfx('skill-bulwark');
  }
  function addCharge() {
    const s = run.skills;
    s.charge += 1;
    skillBurst(1, run.player.x, run.player.y, 28, .2);
    triggerConductorReturn();
    if (s.charge >= 10) {
      s.charge = 0;
      s.overload = { age: 0, hit: new Set(), first: false, second: false };
      showToast('过载边界！');
      playSfx('overload');
      skillBurst(3, run.player.x, run.player.y, 110, .48);
    }
  }
  function countScavengedMaterial() {
    const s = run.skills;
    s.manualPickups += 1;
    if (s.manualPickups % 8 === 0) { run.money += 2; run.earned += 2; showToast('拾荒分红：材料 +2'); skillBurst(1, run.player.x, run.player.y, 45); }
    if (s.manualPickups % 12 === 0) { s.shieldTime = 8; showToast('废件护层就绪'); skillBurst(2, run.player.x, run.player.y, 50); }
    if (s.manualPickups >= 18 && !s.loadedUsed) { s.loadedUsed = true; s.loadedTime = 6; showToast('满载运转！'); skillBurst(3, run.player.x, run.player.y, 64, .5); }
  }
  function updateSkills(dt) {
    const s = run.skills, p = run.player;
    s.activeCooldown = Math.max(0, s.activeCooldown - dt);
    s.counterCooldown = Math.max(0, s.counterCooldown - dt);
    s.returnCooldown = Math.max(0, s.returnCooldown - dt);
    s.shieldTime = Math.max(0, s.shieldTime - dt);
    s.loadedTime = Math.max(0, s.loadedTime - dt);
    s.magnetTime = Math.max(0, (s.magnetTime || 0) - dt);
    if (s.mark) { s.mark.time -= dt; if (s.mark.time <= 0 || s.mark.target.dead) s.mark = null; }
    if (run.character.id === 'rover') {
      s.moveTime = run.movedThisFrame ? Math.min(1, s.moveTime + dt) : 0;
      if (s.moveTime >= 1 && !s.steadyReady) { s.steadyReady = true; skillBurst(1, p.x, p.y, 36, .26); }
    } else if (run.character.id === 'bulwark') {
      const nearby = run.enemies.filter(e => !e.dead && distance(e, p) <= 160).length;
      const wasGuarded = s.guardReady;
      s.guardReady = nearby >= 3;
      s.guardTime = s.guardReady ? Math.min(1, s.guardTime + dt) : 0;
      if (s.guardReady && !wasGuarded) skillBurst(1, p.x, p.y, 50, .3);
      if (nearby >= 4) triggerBulwarkCounter();
    } else if (run.character.id === 'conductor') {
      triggerConductorReturn();
      if (s.field) {
        s.field.time -= dt; s.field.tick += dt;
        while (s.field.tick >= .5 && s.field.time > -.5) {
          s.field.tick -= .5;
          let hit = false;
          for (const e of run.enemies) if (!e.dead && distance(e, s.field) <= 115 + e.r) { dealSkillDamage(e, 3 + run.stats.elemental * .4); hit = true; }
          if (hit) addCharge();
          run.effects.push({ kind: 'pulse', x: s.field.x, y: s.field.y, r: 115, color: '#b5b4ff', life: .22, maxLife: .22 });
          skillBurst(0, s.field.x, s.field.y, 78, .25);
        }
        if (s.field.time <= 0) s.field = null;
      }
      if (s.overload) {
        const burst = s.overload;
        burst.age += dt;
        const radius = Math.min(220, burst.age / .24 * 220);
        for (const e of run.enemies) if (!e.dead && !burst.hit.has(e) && distance(e, p) <= radius + e.r) {
          burst.hit.add(e); dealSkillDamage(e, 8 + run.stats.elemental * .6);
        }
        if (burst.age >= .12 && !burst.first) { burst.first = true; run.effects.push({ kind: 'pulse', x: p.x, y: p.y, r: 110, color: '#c6b8ff', life: .38, maxLife: .38 }); }
        if (burst.age >= .24 && !burst.second) { burst.second = true; run.effects.push({ kind: 'pulse', x: p.x, y: p.y, r: 220, color: '#c6b8ff', life: .42, maxLife: .42 }); skillBurst(3, p.x, p.y, 220, .5); }
        if (burst.age >= .3) s.overload = null;
      }
    }
  }
  function movePlayer(dt) {
    const p = run.player, v = movementVector();
    let vx = v.x, vy = v.y;
    const dashing = p.dashTime > 0;
    if (dashing) { vx = p.dashX * 3.3; vy = p.dashY * 3.3; p.dashTime -= dt; }
    else if (Math.hypot(vx, vy) > .05) p.facing = Math.atan2(vy, vx);
    const speed = 215 * (1 + run.stats.speed / 100);
    const step = dashing ? speed * dt : Math.min(speed * dt, v.remaining ?? Infinity);
    const oldX = p.x, oldY = p.y;
    moveThroughTerrain(p, vx * step, vy * step);
    run.movedThisFrame = Math.hypot(p.x - oldX, p.y - oldY) > .1;
    p.animTime = run.movedThisFrame ? p.animTime + dt : 0;
    p.attackPose = Math.max(0, p.attackPose - dt);
    if (!dashing && v.remaining !== undefined && v.remaining <= step + 3) { moveTarget = null; moveFlow = null; }
    p.invuln = Math.max(0, p.invuln - dt);
    p.dashCooldown = Math.max(0, p.dashCooldown - dt);
    run.lifeClock = Math.max(0, run.lifeClock - dt);
    run.regenClock += dt;
    if (run.regenClock >= 5) { run.regenClock -= 5; if (run.stats.regen > 0) heal(run.stats.regen); }
    if (run.aimTarget) { run.aimTarget.life -= dt; if (run.aimTarget.life <= 0) run.aimTarget = null; }
  }
  function hurtPlayer(rawDamage) {
    const p = run.player;
    if (p.invuln > 0 || phase !== 'combat') return;
    if (Math.random() * 100 < run.stats.dodge) { p.invuln = .18; showToast('闪避！'); return; }
    const s = run.skills;
    let damage = Math.max(1, Math.round(rawDamage * run.difficulty.mult * (15 / (15 + Math.max(-5, run.stats.armor)))));
    if (run.character.id === 'bulwark' && s.guardReady) damage = Math.max(1, Math.round(damage * .78));
    if (run.character.id === 'scavenger' && s.shieldTime > 0) damage = Math.max(1, damage - 3);
    p.hp -= damage;
    p.invuln = .55;
    run.screenShake = 9;
    run.effects.push({ kind: 'text', x: p.x, y: p.y - 23, text: `-${damage}`, color: '#ff777a', life: .65, maxLife: .65 });
    playSfx('hurt');
    if (p.hp <= 0) { p.hp = 0; endRun(false); }
  }
  function updateEnemies(dt) {
    const p = run.player;
    run.enemyFlowClock -= dt;
    const playerCell = navIndex(p.x, p.y);
    if (run.enemyFlowClock <= 0 || run.enemyFlowCell !== playerCell) {
      run.enemyFlow = makeFlow(p.x, p.y, 54);
      run.enemyFlowCell = playerCell;
      run.enemyFlowClock = .35;
    }
    for (const e of run.enemies) {
      if (e.dead) continue;
      const dx = p.x - e.x, dy = p.y - e.y;
      const dist = Math.max(1, Math.hypot(dx, dy));
      const blocked = terrainLineBlocked(e.x, e.y, p.x, p.y, e.r);
      let route = blocked ? flowDirection(run.enemyFlow, e.x, e.y, e.r) : null;
      if (!route && blocked) route = detourDirection(e.x, e.y, p.x, p.y, e.r);
      if (e.stuckTime > .3) route = detourDirection(e.x, e.y, p.x, p.y, e.r) || route;
      let ux = route?.x ?? dx / dist, uy = route?.y ?? dy / dist;
      e.hitFlash = Math.max(0, e.hitFlash - dt);
      e.attackPose = Math.max(0, e.attackPose - dt);
      e.biteCooldown = Math.max(0, e.biteCooldown - dt);
      e.attackClock -= dt; e.chargeClock -= dt;
      if (e.burn > 0) {
        e.burn -= dt; e.burnClock -= dt;
        if (e.burnClock <= 0) { e.burnClock = .5; dealSkillDamage(e, 2 + run.stats.elemental * .2); }
      }
      if (run.pendingVictory) break;
      if (e.dead) continue;
      let speed = e.speed;
      if (e.id === 'shooter') {
        const canSee = !terrainLineBlocked(e.x, e.y, p.x, p.y, 6, false);
        if (canSee && dist < 270) { ux = -ux; uy = -uy; }
        else if (canSee && dist < 370) { ux = 0; uy = 0; }
        if (e.attackClock <= 0 && dist < 650 && canSee) {
          shootEnemyBullet(e.x, e.y, dx / dist, dy / dist, e.damage, 235);
          playSfx('shooter-fire');
          e.attackClock = 2.1 / (1 + run.wave * .015);
          e.attackPose = .28;
        }
      } else if (e.id === 'charger' || e.id === 'elite') {
        if (e.windup > 0) {
          e.windup -= dt; speed = 0;
          if (e.windup <= 0) { e.charging = .65; e.chargeClock = 3.5; e.attackPose = .3; }
        } else if (e.charging > 0) { e.charging -= dt; ux = e.chargeX; uy = e.chargeY; speed *= e.id === 'elite' ? 3.1 : 3.7; }
        else if (e.chargeClock <= 0 && dist < 480) {
          e.chargeX = ux; e.chargeY = uy;
          e.windup = e.id === 'elite' ? .4 : .35;
          speed = 0;
          run.effects.push({ kind: 'line', x1: e.x, y1: e.y, x2: e.x + ux * 160, y2: e.y + uy * 160, color: '#ff9c71', life: e.windup, maxLife: e.windup, width: 8 });
        }
      } else if (e.id === 'boss') {
        if (dist < 200) speed *= .5;
        if (e.windup > 0) {
          e.windup -= dt; speed = 0;
          if (e.windup <= 0) {
            const count = 12;
            for (let i = 0; i < count; i++) {
              const angle = i * TAU / count + run.elapsed * .25;
              shootEnemyBullet(e.x, e.y, Math.cos(angle), Math.sin(angle), e.damage * .55, 215);
            }
            e.attackClock = 2.7; e.attackPose = .32;
            run.effects.push({ kind: 'pulse', x: e.x, y: e.y, r: 78, color: '#f3a5c9', life: .4, maxLife: .4 });
            playSfx('boss-attack');
          }
        } else if (e.attackClock <= 0 && dist < 820) { e.windup = .55; speed = 0; }
      }
      const oldX = e.x, oldY = e.y;
      moveThroughTerrain(e, ux * speed * dt, uy * speed * dt);
      if (e.charging > 0 && Math.hypot(e.x - oldX, e.y - oldY) < speed * dt * .35) e.charging = 0;
      e.moving = Math.hypot(e.x - oldX, e.y - oldY) > .1;
      if (!e.moving && speed > 0 && dist > e.r + p.radius + 12) {
        e.stuckTime = Math.min(1.5, e.stuckTime + dt);
        if (e.stuckTime > .45) { run.enemyFlowClock = 0; run.enemyFlowCell = -1; }
      } else e.stuckTime = Math.max(0, e.stuckTime - dt * 2);
      if (e.moving) e.animTime += dt;
      if (distance(e, p) < e.r + p.radius - 2) {
        if (e.id === 'crawler' && e.biteCooldown <= 0) { e.attackPose = .24; e.biteCooldown = .65; }
        hurtPlayer(e.damage);
      }
      if (phase !== 'combat') break;
    }
    run.enemies = run.enemies.filter(e => !e.dead);
  }
  function shootEnemyBullet(x, y, ux, uy, damage, speed) {
    run.enemyBullets.push({ x, y, vx: ux * speed, vy: uy * speed, damage, life: 4, r: 6 });
  }
  function updateEnemyBullets(dt) {
    for (let i = run.enemyBullets.length - 1; i >= 0; i--) {
      const b = run.enemyBullets[i];
      const fromX = b.x, fromY = b.y;
      b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
      const wallTime = terrainHitTime(fromX, fromY, b.x, b.y, b.r);
      const playerTime = segmentCircleHitTime(fromX, fromY, b.x, b.y,
        run.player.x, run.player.y, b.r + run.player.radius);
      if (playerTime <= 1 && playerTime <= wallTime) { hurtPlayer(b.damage); run.enemyBullets.splice(i, 1); continue; }
      if (wallTime <= 1 || b.life <= 0 || b.x < 0 || b.y < 0 || b.x > WORLD.w || b.y > WORLD.h) run.enemyBullets.splice(i, 1);
    }
  }
  function dropPickup(x, y, count) {
    for (let i = 0; i < count && run.pickups.length < 450; i++) {
      const point = nearestWalkable(x + rand(-23, 23), y + rand(-23, 23), 6);
      run.pickups.push({ kind: 'material', x: point.x, y: point.y, r: 5, drift: rand(0, TAU) });
    }
  }
  function dropChest(x, y) {
    const point = nearestWalkable(x, y, 13);
    run.pickups.push({ kind: 'chest', x: point.x, y: point.y, r: 12, drift: rand(0, TAU) });
    showToast('宝箱掉落：拾取回血，结算开装备');
  }
  function killEnemy(e) {
    if (e.dead) return;
    e.dead = true; run.kills += 1;
    const bonus = Math.random() * 100 < run.stats.luck * .5 ? 1 : 0;
    dropPickup(e.x, e.y, e.value + bonus);
    if (e.id === 'elite' || e.id === 'boss') dropChest(e.x, e.y);
    else if (e.value > 0 && !run.normalChestDropped && Math.random() < .1) {
      dropChest(e.x, e.y);
      run.normalChestDropped = true;
    }
    run.effects.push({ kind: 'pulse', x: e.x, y: e.y, r: e.r * 1.8, color: ENEMIES[e.id].color, life: .26, maxLife: .26 });
    if (SKIN_ART[selectedSkin][e.id]) run.effects.push({ kind: 'shards', x: e.x, y: e.y, r: e.r, color: ENEMIES[e.id].color, life: .34, maxLife: .34 });
    if (e.id === 'splitter') { spawnEnemy('runner', e.x - 18, e.y, true); spawnEnemy('runner', e.x + 18, e.y, true); }
    if (e.id === 'boss' && run.wave === MAX_WAVES) run.pendingVictory = true;
    if (e.id === 'boss') showToast('首领已击败！');
  }
  function damageEnemy(e, amount, directHit = true, hit = null) {
    if (e.dead) return;
    const s = run.skills;
    if (hit?.type === 'ranged' && run.character.id === 'rover' && s.mark?.target === e && distance(e, run.player) >= hit.range * .5) amount *= 1.2;
    const steady = hit?.type === 'ranged' && run.character.id === 'rover' && s.steadyReady;
    const crit = directHit && Math.random() * 100 < run.stats.crit + (steady ? 15 : 0);
    if (steady) { s.steadyReady = false; s.moveTime = 0; skillBurst(1, e.x, e.y, e.r + 24, .28); }
    const damage = Math.max(1, Math.round(amount * (crit ? 1.8 : 1)));
    e.hp -= damage; e.hitFlash = .1;
    if (crit) run.effects.push({ kind: 'text', x: e.x + rand(-8, 8), y: e.y - e.r, text: String(damage), color: '#ffe284', life: .55, maxLife: .55 });
    if (directHit && run.lifeClock <= 0 && Math.random() * 100 < run.stats.lifesteal) { heal(1); run.lifeClock = .13; }
    if (e.hp <= 0) killEnemy(e);
    if (hit) registerWeaponHit(e, hit);
  }
  function updatePickups(dt) {
    const p = run.player, range = 75 + run.stats.pickup + (run.skills.magnetTime > 0 ? 180 : 0);
    for (let i = run.pickups.length - 1; i >= 0; i--) {
      const item = run.pickups[i], d = distance(item, p);
      if (d < range && d > 1) {
        const speed = 250 + (range - d) * 5;
        moveThroughTerrain(item, (p.x - item.x) / d * speed * dt, (p.y - item.y) / d * speed * dt);
      }
      if (d < p.radius + item.r + 3) {
        if (item.kind === 'chest') {
          const before = p.hp;
          heal(Math.max(4, Math.round(p.maxHp * CHEST_HEAL_RATE)));
          run.pendingChests += 1;
          const recovered = Math.round(p.hp - before);
          showToast(`宝箱待结算开启；${recovered ? `生命 +${recovered}` : '生命已满'}`);
          if (recovered) run.effects.push({ kind: 'text', x: p.x, y: p.y - 24, text: `+${recovered}`, color: '#ffe4a0', life: .7, maxLife: .7 });
          playSfx('chest-pickup');
        } else {
          run.money += 1; run.earned += 1; addXp(1);
          if (run.character.id === 'scavenger') countScavengedMaterial();
        }
        run.pickups.splice(i, 1);
      }
    }
  }
  function weaponDamage(w) {
    const def = WEAPONS[w.id];
    const loaded = run.character.id === 'scavenger' && run.skills.loadedTime > 0 ? 3 : 0;
    return (def.damage * Math.pow(1.65, w.tier - 1) + (run.stats[def.type] || 0) + loaded) * (1 + run.stats.damage / 100);
  }
  function projectileRadius(weaponId) {
    if (weaponId === 'spore') return 9;
    if (weaponId === 'rail') return 5;
    return 4;
  }
  function attackSpeed() { return run.stats.attackSpeed + (run.character.id === 'scavenger' && run.skills.loadedTime > 0 ? 20 : 0); }
  function registerWeaponHit(e, hit) {
    const s = run.skills;
    if (s.hitIds.has(hit.attackId)) return;
    s.hitIds.add(hit.attackId);
    if (run.character.id === 'rover' && hit.type === 'ranged') {
      s.rangedHits += 1;
      if (s.rangedHits % 12 === 0) {
        const targets = run.enemies.filter(enemy => !enemy.dead).sort((a, b) => distance(a, run.player) - distance(b, run.player)).slice(0, 3);
        for (const target of targets) {
          const angle = Math.atan2(target.y - run.player.y, target.x - run.player.x);
          run.bullets.push({ x: run.player.x, y: run.player.y, vx: Math.cos(angle) * 650, vy: Math.sin(angle) * 650,
            life: 1.25, damage: hit.damage * .5, r: 5, color: '#b5f6eb', pierce: 1, explosion: 0, hit: new Set(), skill: true, visualTag: 'stars', homing: target });
        }
        skillBurst(3, run.player.x, run.player.y, 62, .4);
        showToast('星点合围！');
      }
    } else if (run.character.id === 'conductor' && hit.type === 'elemental') addCharge();
  }
  function getTarget(range, type, weaponId) {
    const p = run.player;
    const radius = projectileRadius(weaponId);
    let candidates = run.enemies.filter(e => !e.dead && distance(e, p) <= range
      && (weaponId === 'arc' || !terrainLineBlocked(p.x, p.y, e.x, e.y, radius, false)));
    if (!candidates.length) return null;
    if (type === 'ranged' && run.character.id === 'rover' && run.skills.mark && candidates.includes(run.skills.mark.target)) return run.skills.mark.target;
    if (run.aimTarget) {
      const near = candidates.filter(e => distance(e, run.aimTarget) < 120).sort((a, b) => distance(a, run.aimTarget) - distance(b, run.aimTarget))[0];
      if (near) return near;
    }
    candidates.sort((a, b) => distance(a, p) - distance(b, p));
    return candidates[0];
  }
  function addShot(x, y, angle, w, damage, options = {}) {
    const def = WEAPONS[w.id];
    const speed = def.speed || 620;
    run.bullets.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: def.range / speed, damage,
      r: projectileRadius(w.id), color: def.color,
      pierce: options.pierce || def.pierce || 1, explosion: options.skill ? 0 : def.explosion ? def.explosion * (1 + .15 * (w.tier - 1)) : 0,
      hit: new Set(), skill: !!options.skill,
      visualTag: options.visualTag || (run.character.id === 'scavenger' && run.skills.loadedTime > 0 ? 'loaded' : null),
      attackId: options.attackId, type: def.type, range: def.range, baseDamage: damage });
  }
  function fireWeapon(w) {
    const def = WEAPONS[w.id];
    if (w.id === 'drone') return;
    const p = run.player;
    const target = getTarget(def.range, def.type, w.id);
    if (!target) return;
    w.cool = Math.max(.09, def.cooldown * Math.pow(.95, w.tier - 1) / (1 + attackSpeed() / 100));
    const angle = Math.atan2(target.y - p.y, target.x - p.x);
    p.attackPose = .2;
    p.attackFacing = angle;
    const damage = weaponDamage(w);
    const attackId = ++run.attackSeq;
    const hit = { attackId, type: def.type, range: def.range, damage };
    if (w.id === 'blade' || w.id === 'ember') {
      const halfArc = w.id === 'blade' ? .9 : .5;
      for (const e of run.enemies) {
        if (e.dead || distance(e, p) > def.range + e.r) continue;
        const relative = Math.atan2(Math.sin(Math.atan2(e.y - p.y, e.x - p.x) - angle), Math.cos(Math.atan2(e.y - p.y, e.x - p.x) - angle));
        if (Math.abs(relative) < halfArc && !terrainLineBlocked(p.x, p.y, e.x, e.y, 4, false)) {
          damageEnemy(e, damage, true, hit); if (w.id === 'ember') { e.burn = 2; e.burnClock = .4; }
        }
      }
      if (w.id === 'blade') {
        run.effects.push({ kind: 'melee-swing', x: p.x, y: p.y, r: def.range, angle, direction: run.attackSeq % 2 ? 1 : -1, color: def.color, life: .28, maxLife: .28 });
      } else {
        run.effects.push({ kind: 'arc', x: p.x, y: p.y, r: def.range, angle, arc: halfArc, color: def.color, life: .13, maxLife: .13 });
      }
    } else if (w.id === 'arc') {
      const struck = new Set();
      let current = target, from = p;
      for (let i = 0; i < 2 + w.tier && current; i++) {
        struck.add(current);
        run.effects.push({ kind: 'line', x1: from.x, y1: from.y, x2: current.x, y2: current.y, color: def.color, life: .16, maxLife: .16, width: 3 });
        damageEnemy(current, damage * Math.pow(.75, i), true, hit);
        from = current;
        current = run.enemies.filter(e => !e.dead && !struck.has(e) && distance(e, from) < 190).sort((a, b) => distance(a, from) - distance(b, from))[0];
      }
    } else {
      const count = def.count || 1;
      for (let i = 0; i < count; i++) {
        const spread = count > 1 ? (i - (count - 1) / 2) * .16 : 0;
        addShot(p.x + Math.cos(angle) * 21, p.y + Math.sin(angle) * 21, angle + spread, w, damage, { attackId });
      }
    }
    if (run.character.id === 'rover' && def.type === 'ranged') {
      run.skills.rangedFires += 1;
      if (run.skills.rangedFires % 6 === 0) {
        addShot(p.x, p.y, angle, w, damage * .6, { skill: true, pierce: 3, visualTag: 'pierce' });
        skillBurst(2, p.x, p.y, 48, .3, angle);
        showToast('掠线！');
      }
    } else if (run.character.id === 'bulwark' && def.type === 'melee') {
      run.skills.meleeFires += 1;
      if (run.skills.meleeFires % 5 === 0) {
        const side = angle + (run.skills.meleeFires % 2 ? 1 : -1) * Math.PI / 2;
        for (const e of run.enemies) if (!e.dead && distance(e, p) <= 120 + e.r) {
          const relative = Math.atan2(Math.sin(Math.atan2(e.y - p.y, e.x - p.x) - side), Math.cos(Math.atan2(e.y - p.y, e.x - p.x) - side));
          if (Math.abs(relative) < .7) dealSkillDamage(e, 10 + run.stats.melee * .5);
        }
        run.effects.push({ kind: 'arc', x: p.x, y: p.y, r: 120, angle: side, arc: .7, color: '#ffcd91', life: .2, maxLife: .2 });
        skillBurst(2, p.x, p.y, 120, .32, side);
      }
    }
    playSfx(w.id);
  }
  function updateWeapons(dt) {
    const drones = run.weapons.filter(w => w.id === 'drone');
    for (const w of run.weapons) {
      w.cool = Math.max(0, w.cool - dt);
      if (w.id === 'drone') {
        if (w.cool > 0) continue;
        const index = drones.indexOf(w), angle = run.totalTime * 2.8 + index * TAU / Math.max(1, drones.length);
        const orb = { x: run.player.x + Math.cos(angle) * 87, y: run.player.y + Math.sin(angle) * 87 };
        const hit = run.enemies.find(e => !e.dead && distance(e, orb) < e.r + 17);
        if (hit) {
          const damage = weaponDamage(w);
          damageEnemy(hit, damage, true, { attackId: ++run.attackSeq, type: 'elemental', range: WEAPONS.drone.range, damage });
          playSfx('drone');
          w.cool = Math.max(.13, WEAPONS.drone.cooldown / (1 + attackSpeed() / 100));
        }
      } else if (w.cool <= 0) fireWeapon(w);
    }
  }
  function explode(b) {
    run.effects.push({ kind: 'pulse', x: b.x, y: b.y, r: b.explosion, color: '#c2e88c', life: .33, maxLife: .33 });
    for (const e of run.enemies) if (!e.dead && distance(e, b) < b.explosion + e.r) damageEnemy(e, b.damage, true, { attackId: b.attackId, type: b.type, range: b.range, damage: b.baseDamage });
    playSfx('explosion');
  }
  function updateBullets(dt) {
    for (let i = run.bullets.length - 1; i >= 0; i--) {
      const b = run.bullets[i];
      const fromX = b.x, fromY = b.y;
      if (b.homing && !b.homing.dead) {
        const angle = Math.atan2(b.homing.y - b.y, b.homing.x - b.x);
        b.vx = Math.cos(angle) * 650; b.vy = Math.sin(angle) * 650;
      }
      b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
      let remove = false;
      const dx = b.x - fromX, dy = b.y - fromY;
      const wallTime = terrainHitTime(fromX, fromY, b.x, b.y, b.r);
      const hits = run.enemies.filter(e => !e.dead && !b.hit.has(e))
        .map(e => ({ enemy: e, time: segmentCircleHitTime(fromX, fromY, b.x, b.y, e.x, e.y, b.r + e.r) }))
        .filter(hit => hit.time <= 1 && hit.time <= wallTime)
        .sort((a, b) => a.time - b.time);
      for (const { enemy: e, time } of hits) {
        if (e.dead) continue;
        const hitX = fromX + dx * time, hitY = fromY + dy * time;
        b.hit.add(e);
        if (b.explosion) { b.x = hitX; b.y = hitY; explode(b); remove = true; break; }
        damageEnemy(e, b.damage, !b.skill, b.skill ? null : { attackId: b.attackId, type: b.type, range: b.range, damage: b.baseDamage });
        if (b.visualTag === 'stars' || b.visualTag === 'pierce') skillBurst(b.visualTag === 'stars' ? 3 : 2, e.x, e.y, e.r + 18, .24);
        b.pierce -= 1;
        if (b.pierce <= 0) { remove = true; break; }
      }
      if (wallTime <= 1 && !remove) {
        b.x = fromX + dx * wallTime; b.y = fromY + dy * wallTime;
        run.effects.push({ kind: 'pulse', x: b.x, y: b.y, r: 12, color: b.color, life: .16, maxLife: .16 });
        remove = true;
      }
      if (b.life <= 0) { if (b.explosion && !remove) explode(b); remove = true; }
      if (remove || b.x < 0 || b.y < 0 || b.x > WORLD.w || b.y > WORLD.h) run.bullets.splice(i, 1);
    }
  }
  function updateHazards(dt) {
    run.hazardClock -= dt;
    if (run.hazardClock <= 0 && run.timeLeft > 4) {
      run.hazardClock = rand(9, 12);
      const angle = rand(0, TAU), offset = rand(70, 220);
      const radius = rand(60, 85);
      const point = nearestWalkable(run.player.x + Math.cos(angle) * offset, run.player.y + Math.sin(angle) * offset, radius);
      run.hazards.push({ x: point.x, y: point.y, r: radius, life: 3, hit: false });
      showToast(`小心：${run.biome.hazard}`);
    }
    for (let i = run.hazards.length - 1; i >= 0; i--) {
      const h = run.hazards[i]; h.life -= dt;
      if (h.life < 1.5 && !h.hit && distance(h, run.player) < h.r + run.player.radius) { hurtPlayer(6 + run.wave * .25); h.hit = true; }
      if (h.life <= 0) run.hazards.splice(i, 1);
    }
  }
  function updateEffects(dt) {
    for (let i = run.effects.length - 1; i >= 0; i--) { run.effects[i].life -= dt; if (run.effects[i].life <= 0) run.effects.splice(i, 1); }
    run.screenShake = Math.max(0, run.screenShake - dt * 25);
  }
  function skillStatus(index) {
    const s = run.skills, id = run.character.id;
    if (index === 0) return s.activeCooldown > 0 ? `${s.activeCooldown.toFixed(1)} 秒` : 'Q / 就绪';
    if (id === 'rover') return [null, s.steadyReady ? '下次命中就绪' : `移动 ${s.moveTime.toFixed(1)} / 1 秒`, `${s.rangedFires % 6} / 6 次开火`, `${s.rangedHits % 12} / 12 次命中`][index];
    if (id === 'bulwark') return [null, s.guardReady ? '周围 3 名敌人 · 减伤 22%' : '需要 3 名近敌', `${s.meleeFires % 5} / 5 次攻击`, s.counterCooldown > 0 ? `${s.counterCooldown.toFixed(1)} 秒` : '4 名敌人 · 自动就绪'][index];
    if (id === 'scavenger') return [null, `${s.manualPickups % 8} / 8 材料`, s.shieldTime > 0 ? `防护 ${s.shieldTime.toFixed(1)} 秒` : `${s.manualPickups % 12} / 12 材料`, s.loadedTime > 0 ? `强化 ${s.loadedTime.toFixed(1)} 秒` : s.loadedUsed ? '本波已触发' : `${s.manualPickups} / 18 材料`][index];
    return [null, `${s.charge} / 10 电荷`, s.returnCooldown > 0 ? `${s.returnCooldown.toFixed(1)} 秒` : '3 层自动释放', s.overload ? '脉冲释放中' : `${s.charge} / 10 电荷`][index];
  }
  function renderSkillStrip() {
    const skills = SKILLS[run.character.id];
    $('skill-strip').innerHTML = skills.map((skill, i) => `<div class="skill-slot ${i === 0 && run.skills.activeCooldown <= 0 ? 'is-ready' : i === 0 ? 'is-cooling' : ''}" title="${skill.desc}"><strong><span class="skill-icon">${artIcon(`skill-${run.character.id}${i ? `-${i}` : ''}`, '')}</span>${skill.name}</strong><span>${skillStatus(i)}</span></div>`).join('');
    $('skill-button').disabled = run.skills.activeCooldown > 0;
    $('skill-button').innerHTML = `<span class="active-skill-art">${artIcon(`skill-${run.character.id}`, '')}</span><span>${skills[0].name}</span><small>${run.skills.activeCooldown > 0 ? `<span class="key-hint">Q · </span>${run.skills.activeCooldown.toFixed(1)} 秒` : '<span class="key-hint">Q</span>'}</small>`;
    $('skill-button').setAttribute('aria-label', `施放${skills[0].name}${run.skills.activeCooldown > 0 ? `，冷却 ${run.skills.activeCooldown.toFixed(1)} 秒` : '，就绪'}`);
  }
  function renderPauseDetails() {
    const s = run.stats, p = run.player;
    const stats = [
      ['生命', `${Math.ceil(p.hp)} / ${p.maxHp}`], ['护甲', s.armor], ['移动速度', `${s.speed}%`], ['攻击速度', `${attackSpeed()}%`],
      ['远程伤害加值', s.ranged], ['近战伤害加值', s.melee], ['法术伤害加值', s.elemental], ['全伤害', `${s.damage}%`],
      ['暴击率', `${s.crit}%`], ['暴击伤害', '180%'], ['闪避率', `${s.dodge}%`], ['生命窃取', `${s.lifesteal}%`],
      ['每 5 秒回血', s.regen], ['拾取范围', 75 + s.pickup + (run.skills.magnetTime > 0 ? 180 : 0)], ['幸运', s.luck],
      ['当前武器射程', run.weapons.map(w => WEAPONS[w.id].range).join(' / ')]
    ];
    $('pause-stats').innerHTML = stats.map(([name, value]) => `<div class="pause-stat"><span>${name}</span><strong>${value}</strong></div>`).join('');
    $('pause-weapons').innerHTML = run.weapons.map(w => `<div class="pause-weapon"><span>${artIcon(w.id, WEAPONS[w.id].icon)}</span><strong>${WEAPONS[w.id].name} · ${'ⅠⅡⅢⅣ'[w.tier - 1]}阶</strong></div>`).join('');
    $('pause-skills').innerHTML = SKILLS[run.character.id].map((skill, i) => `<div class="pause-skill"><strong><span class="pause-skill-art">${artIcon(`skill-${run.character.id}${i ? `-${i}` : ''}`, '')}</span>${skill.name}</strong><span>${skill.desc}</span><span>当前：${skillStatus(i)}</span></div>`).join('');
  }
  function updateHUD() {
    if (!run) return;
    $('wave-label').textContent = `第 ${run.wave} / ${MAX_WAVES} 波`;
    $('time-label').textContent = run.timeLeft <= 0 && run.bossFight ? '首领' : String(Math.max(0, Math.ceil(run.timeLeft)));
    $('biome-label').textContent = run.biome.name;
    $('hp-label').textContent = `生命 ${Math.ceil(run.player.hp)} / ${run.player.maxHp}`;
    $('hp-fill').style.width = `${Math.max(0, run.player.hp / run.player.maxHp * 100)}%`;
    $('xp-label').textContent = `等级 ${run.level}${run.pendingLevels ? ` · 待选 ${run.pendingLevels}` : ''}`;
    $('xp-fill').style.width = `${run.xp / run.xpNeed * 100}%`;
    $('money-label').textContent = run.money;
    $('hud-stats').textContent = `击败 ${run.kills} · 冲刺 ${run.player.dashCooldown > 0 ? `${run.player.dashCooldown.toFixed(1)}s` : '就绪'}`;
    $('dash-button').disabled = run.player.dashCooldown > 0;
    renderSkillStrip();
  }
  function updateCombat(dt) {
    run.elapsed += dt; run.totalTime += dt; run.timeLeft -= dt;
    movePlayer(dt);
    spawnWaveEnemies(dt);
    updateHazards(dt);
    if (phase !== 'combat') return;
    updateEnemies(dt);
    if (phase !== 'combat') return;
    if (run.pendingVictory) { finishWave(); return; }
    updateSkills(dt);
    if (run.pendingVictory) { finishWave(); return; }
    updateWeapons(dt);
    if (phase !== 'combat') return;
    if (run.pendingVictory) { finishWave(); return; }
    updateBullets(dt);
    if (phase !== 'combat') return;
    if (run.pendingVictory) { finishWave(); return; }
    updateEnemyBullets(dt);
    if (phase !== 'combat') return;
    updatePickups(dt);
    updateEffects(dt);
    run.hudClock -= dt;
    if (run.hudClock <= 0) { run.hudClock = .08; updateHUD(); }
    if (run.timeLeft <= 0 && (run.wave < MAX_WAVES || !run.bossFight || run.pendingVictory)) finishWave();
  }

  function camera() {
    if (!run) return { x: 0, y: 0 };
    return { x: clamp(run.player.x - viewW / 2, 0, Math.max(0, WORLD.w - viewW)), y: clamp(run.player.y - viewH / 2, 0, Math.max(0, WORLD.h - viewH)) };
  }
  function visible(o, cam, pad = 100) {
    const x = o.x ?? o.x1, y = o.y ?? o.y1;
    return x > cam.x - pad && x < cam.x + viewW + pad && y > cam.y - pad && y < cam.y + viewH + pad;
  }
  function drawBackdrop(cam) {
    const b = run.biome;
    ctx.fillStyle = b.ground;
    ctx.fillRect(0, 0, WORLD.w, WORLD.h);
    if (selectedSkin === 'pixel') {
      const ground = artImage(`map-${b.id}-ground`);
      if (ground) {
        for (let x = Math.floor(cam.x / 64) * 64; x < cam.x + viewW + 64; x += 64) {
          for (let y = Math.floor(cam.y / 64) * 64; y < cam.y + viewH + 64; y += 64) {
            ctx.drawImage(ground, x, y, 64, 64);
          }
        }
        ctx.fillStyle = 'rgba(8, 21, 29, .18)';
        ctx.fillRect(cam.x, cam.y, viewW, viewH);
        ctx.fillStyle = b.accent; ctx.globalAlpha = .5;
        ctx.fillRect(0, 0, WORLD.w, 6); ctx.fillRect(0, WORLD.h - 6, WORLD.w, 6);
        ctx.fillRect(0, 0, 6, WORLD.h); ctx.fillRect(WORLD.w - 6, 0, 6, WORLD.h);
        ctx.globalAlpha = 1;
        return;
      }
      ctx.fillStyle = b.grid;
      ctx.globalAlpha = .22;
      const grid = 80;
      for (let x = Math.floor(cam.x / grid) * grid; x < cam.x + viewW + grid; x += grid) ctx.fillRect(x, cam.y, 2, viewH);
      for (let y = Math.floor(cam.y / grid) * grid; y < cam.y + viewH + grid; y += grid) ctx.fillRect(cam.x, y, viewW, 2);
      ctx.fillStyle = b.accent;
      for (const d of decor) {
        if (!visible(d, cam, 20)) continue;
        const x = Math.round(d.x / 4) * 4, y = Math.round(d.y / 4) * 4;
        ctx.fillRect(x - 8, y - 2, 16, 4);
        if (b.id === 'grove') ctx.fillRect(x - 4, y - 6, 8, 12);
        else if (b.id === 'frost') ctx.fillRect(x - 2, y - 8, 4, 16);
        else ctx.fillRect(x - 4, y + 2, 8, 4);
      }
      ctx.globalAlpha = .5;
      ctx.fillRect(0, 0, WORLD.w, 6); ctx.fillRect(0, WORLD.h - 6, WORLD.w, 6);
      ctx.fillRect(0, 0, 6, WORLD.h); ctx.fillRect(WORLD.w - 6, 0, 6, WORLD.h);
      ctx.globalAlpha = 1;
      return;
    }
    ctx.strokeStyle = b.grid;
    ctx.globalAlpha = .32;
    ctx.lineWidth = 1;
    const grid = 80;
    for (let x = Math.floor(cam.x / grid) * grid; x < cam.x + viewW + grid; x += grid) { ctx.beginPath(); ctx.moveTo(x, Math.max(0, cam.y)); ctx.lineTo(x, Math.min(WORLD.h, cam.y + viewH)); ctx.stroke(); }
    for (let y = Math.floor(cam.y / grid) * grid; y < cam.y + viewH + grid; y += grid) { ctx.beginPath(); ctx.moveTo(Math.max(0, cam.x), y); ctx.lineTo(Math.min(WORLD.w, cam.x + viewW), y); ctx.stroke(); }
    ctx.globalAlpha = 1;
    for (const d of decor) {
      if (!visible(d, cam, 20)) continue;
      ctx.save(); ctx.translate(d.x, d.y); ctx.rotate(d.angle);
      ctx.fillStyle = b.accent; ctx.globalAlpha = .16;
      if (b.id === 'grove') { ctx.beginPath(); ctx.arc(0, 0, d.r, 0, TAU); ctx.fill(); ctx.fillRect(-1, -d.r, 2, d.r * 2); }
      else if (b.id === 'frost') { ctx.fillRect(-d.r, -2, d.r * 2, 4); ctx.fillRect(-2, -d.r, 4, d.r * 2); }
      else { ctx.fillRect(-d.r, -3, d.r * 2, 6); ctx.fillRect(-d.r * .55, 3, d.r * .8, 4); }
      ctx.restore();
    }
    ctx.strokeStyle = b.accent; ctx.globalAlpha = .45; ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, WORLD.w - 8, WORLD.h - 8);
    ctx.globalAlpha = 1;
  }
  function drawTerrain(cam) {
    const biome = run.biome.id;
    for (const o of run.terrain) {
      const w = o.kind === 'water' ? o.w : 48, h = o.kind === 'tree' ? 64 : o.kind === 'water' ? o.h : 48;
      const left = o.kind === 'water' ? o.x : o.x - 24;
      const top = o.kind === 'tree' ? o.y - 48 : o.kind === 'rock' ? o.y - 24 : o.y;
      if (left + w < cam.x || left > cam.x + viewW || top + h < cam.y || top > cam.y + viewH) continue;
      const image = artImage(`map-${biome}-${o.kind}`);
      if (image) {
        if (o.kind === 'water') {
          for (let x = o.x; x < o.x + o.w; x += 64) {
            for (let y = o.y; y < o.y + o.h; y += 64) ctx.drawImage(image, x, y, 64, 64);
          }
        } else ctx.drawImage(image, left, top, w, h);
      } else if (o.kind === 'water') {
        ctx.fillStyle = '#285c69'; ctx.fillRect(o.x, o.y, o.w, o.h);
      } else if (o.kind === 'tree') {
        ctx.fillStyle = '#6e6652'; ctx.fillRect(o.x - 6, o.y - 12, 12, 27);
        ctx.fillStyle = run.biome.accent; ctx.beginPath(); ctx.arc(o.x, o.y - 26, 23, 0, TAU); ctx.fill();
      } else {
        ctx.fillStyle = '#7f9194'; ctx.beginPath(); ctx.arc(o.x, o.y, 23, 0, TAU); ctx.fill();
      }
      if (o.kind === 'water') {
        ctx.strokeStyle = run.biome.accent; ctx.globalAlpha = .55; ctx.lineWidth = selectedSkin === 'pixel' ? 4 : 3;
        ctx.strokeRect(o.x + 2, o.y + 2, o.w - 4, o.h - 4); ctx.globalAlpha = 1;
      }
    }
  }
  function drawHazards(cam) {
    for (const h of run.hazards) {
      if (!visible(h, cam, h.r)) continue;
      const active = h.life < 1.5;
      if (selectedSkin === 'pixel') {
        const size = Math.round(h.r / 4) * 8;
        ctx.globalAlpha = active ? .26 : .12;
        ctx.fillStyle = run.biome.accent;
        drawPixelArc(h.x, h.y, h.r, 0, TAU, 5);
        const trap = artImage(`map-${run.biome.id}-trap`);
        if (trap) {
          ctx.globalAlpha = active ? .95 : .55 + Math.sin(ambientTime * 12) * .15;
          ctx.drawImage(trap, Math.round(h.x - size * .35), Math.round(h.y - size * .35), size * .7, size * .7);
        }
        ctx.globalAlpha = active ? .9 : .6;
        ctx.fillStyle = run.biome.accent; drawPixelArc(h.x, h.y, h.r, 0, TAU, 5);
        ctx.globalAlpha = 1;
        continue;
      }
      ctx.fillStyle = run.biome.accent;
      ctx.globalAlpha = active ? .28 : .09 + Math.sin(ambientTime * 12) * .04;
      ctx.beginPath(); ctx.arc(h.x, h.y, h.r, 0, TAU); ctx.fill();
      ctx.globalAlpha = active ? .85 : .52;
      ctx.strokeStyle = run.biome.accent; ctx.lineWidth = active ? 4 : 2;
      ctx.setLineDash(active ? [] : [8, 7]);
      ctx.beginPath(); ctx.arc(h.x, h.y, h.r, 0, TAU); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;
    }
  }
  function drawPickups(cam) {
    for (const item of run.pickups) {
      if (!visible(item, cam, 15)) continue;
      const glow = .72 + .22 * Math.sin(ambientTime * 7 + item.drift);
      if (item.kind === 'chest') {
        ctx.save(); ctx.globalAlpha = glow;
        if (selectedSkin === 'pixel') {
          const x = Math.round(item.x), y = Math.round(item.y);
          ctx.fillStyle = '#182932'; ctx.fillRect(x - 14, y - 10, 28, 22);
          ctx.fillStyle = '#9d663e'; ctx.fillRect(x - 11, y - 7, 22, 16);
          ctx.fillStyle = '#f6c76e'; ctx.fillRect(x - 12, y - 10, 24, 6);
          ctx.fillRect(x - 9, y + 1, 4, 8); ctx.fillRect(x + 5, y + 1, 4, 8);
          ctx.fillStyle = '#fff5d8'; ctx.fillRect(x - 3, y - 5, 6, 10);
        } else {
          ctx.fillStyle = '#6d4738'; ctx.strokeStyle = '#ffe2a0'; ctx.lineWidth = 2;
          ctx.fillRect(item.x - 11, item.y - 8, 22, 18); ctx.strokeRect(item.x - 11, item.y - 8, 22, 18);
          ctx.fillStyle = '#f6c76e'; ctx.fillRect(item.x - 12, item.y - 10, 24, 6);
          ctx.fillStyle = '#fff5d8'; ctx.fillRect(item.x - 2, item.y - 4, 4, 10); ctx.fillRect(item.x - 5, item.y - 1, 10, 4);
        }
        ctx.restore();
        continue;
      }
      if (selectedSkin === 'pixel') {
        const x = Math.round(item.x), y = Math.round(item.y);
        ctx.globalAlpha = glow;
        ctx.fillStyle = '#b8f9d1';
        ctx.fillRect(x - 3, y - 6, 6, 12);
        ctx.fillRect(x - 6, y - 3, 12, 6);
        continue;
      }
      ctx.fillStyle = '#b8f9d1'; ctx.globalAlpha = glow;
      ctx.beginPath(); ctx.moveTo(item.x, item.y - 6); ctx.lineTo(item.x + 5, item.y); ctx.lineTo(item.x, item.y + 6); ctx.lineTo(item.x - 5, item.y); ctx.closePath(); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function drawEnemy(e) {
    const def = ENEMIES[e.id];
    ctx.save(); ctx.translate(selectedSkin === 'pixel' ? Math.round(e.x) : e.x, selectedSkin === 'pixel' ? Math.round(e.y) : e.y);
    ctx.fillStyle = '#0007';
    if (selectedSkin === 'pixel') ctx.fillRect(-e.r, e.r * .58, e.r * 2, e.r * .5);
    else { ctx.beginPath(); ctx.ellipse(2, e.r * .75, e.r * .95, e.r * .48, 0, 0, TAU); ctx.fill(); }
    if (e.id === 'elite' && e.windup > 0) {
      ctx.strokeStyle = '#ffc47c'; ctx.lineWidth = 3;
      if (selectedSkin === 'pixel') { ctx.fillStyle = '#ffc47c'; drawPixelArc(0, 0, e.r + 7 + (1 - e.windup / .4) * 7, 0, TAU); }
      else { ctx.beginPath(); ctx.arc(0, 0, e.r + 7 + (1 - e.windup / .4) * 7, 0, TAU); ctx.stroke(); }
    }
    if (e.id === 'boss' && e.windup > 0) {
      ctx.strokeStyle = '#f7a6cf'; ctx.lineWidth = 4;
      if (selectedSkin === 'pixel') { ctx.fillStyle = '#f7a6cf'; drawPixelArc(0, 0, e.r + 9 + (1 - e.windup / .55) * 15, 0, TAU, 6); }
      else { ctx.beginPath(); ctx.arc(0, 0, e.r + 9 + (1 - e.windup / .55) * 15, 0, TAU); ctx.stroke(); }
    }
    ctx.rotate((e.id === 'elite' || e.id === 'charger') && (e.windup > 0 || e.charging > 0)
      ? Math.atan2(e.chargeY, e.chargeX)
      : Math.atan2(run.player.y - e.y, run.player.x - e.x));
    if (e.id === 'crawler' && selectedSkin !== 'pixel') ctx.translate(0, Math.sin(e.animTime * 22) * .7);
    if (e.id === 'elite' && e.windup > 0) ctx.scale(.9, 1.08);
    if (e.id === 'elite' && e.charging > 0) ctx.scale(1.12, .9);
    if (e.id === 'boss') {
      const pulse = e.attackPose > 0 ? 1.12 : e.windup > 0 ? 1 + (1 - e.windup / .55) * .09 : 1 + Math.sin(run.totalTime * 4) * .025;
      ctx.scale(pulse, pulse);
    }
    const pose = e.windup > 0 && (e.id === 'charger' || e.id === 'elite' || e.id === 'boss') ? `${e.id}-windup`
      : e.charging > 0 && (e.id === 'charger' || e.id === 'elite') ? `${e.id}-charge`
      : e.attackPose > 0 && (e.id === 'crawler' || e.id === 'shooter' || e.id === 'boss') ? `${e.id}-attack`
      : e.moving && Math.floor(e.animTime * 6) % 2 && ENEMY_POSES[e.id].includes('step') ? `${e.id}-step` : e.id;
    const image = artImage(pose) || artImage(e.id);
    if (image?.complete && image.naturalWidth) {
      const size = e.r * 2.4;
      if (e.hitFlash > 0) ctx.filter = 'brightness(1.9)';
      ctx.drawImage(image, -size / 2, -size / 2, size, size);
    } else {
      ctx.fillStyle = e.hitFlash > 0 ? '#fff3e4' : def.color;
      ctx.strokeStyle = '#16232b'; ctx.lineWidth = e.id === 'boss' ? 5 : 3;
      ctx.beginPath();
      const sides = e.id === 'boss' ? 9 : e.id === 'tank' || e.id === 'elite' ? 6 : 5;
      for (let i = 0; i < sides; i++) {
        const a = i * TAU / sides, r = e.r * (i % 2 && e.id === 'boss' ? .85 : 1);
        const x = Math.cos(a) * r, y = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#23343c'; ctx.beginPath(); ctx.arc(-e.r * .1, 0, e.r * .55, 0, TAU); ctx.fill();
      ctx.fillStyle = e.id === 'boss' ? '#ffdcef' : '#f8f6d5';
      ctx.fillRect(e.r * .03, -e.r * .26, e.r * .3, e.r * .18);
      ctx.fillRect(e.r * .03, e.r * .08, e.r * .3, e.r * .18);
      if (e.id === 'shooter') { ctx.fillStyle = '#eeceff'; ctx.fillRect(e.r * .3, -4, e.r * .6, 8); }
      if (e.id === 'charger' && e.charging > 0) { ctx.strokeStyle = '#fff8c6'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-e.r, 0); ctx.lineTo(e.r * 1.5, 0); ctx.stroke(); }
    }
    ctx.restore();
    if (e.hp < e.maxHp || e.id === 'boss' || e.id === 'elite') {
      const width = e.r * 2.2;
      ctx.fillStyle = '#07131be0'; ctx.fillRect(e.x - width / 2, e.y - e.r - 12, width, 5);
      ctx.fillStyle = e.id === 'boss' ? '#f3a5c9' : '#ffd07c'; ctx.fillRect(e.x - width / 2, e.y - e.r - 12, width * Math.max(0, e.hp / e.maxHp), 5);
    }
  }
  function drawPlayer() {
    const p = run.player;
    ctx.save(); ctx.translate(selectedSkin === 'pixel' ? Math.round(p.x) : p.x, selectedSkin === 'pixel' ? Math.round(p.y) : p.y);
    if (p.invuln > 0 && Math.floor(ambientTime * 18) % 2 === 0) ctx.globalAlpha = .55;
    ctx.fillStyle = '#0008';
    if (selectedSkin === 'pixel') ctx.fillRect(-17, 11, 34, 9);
    else { ctx.beginPath(); ctx.ellipse(2, 15, 18, 8, 0, 0, TAU); ctx.fill(); }
    const facing = p.attackPose > 0 ? p.attackFacing : p.facing;
    if (Math.cos(facing) < -.2) ctx.scale(-1, 1);
    if (selectedSkin !== 'pixel' && run.character.id === 'scavenger' && p.attackPose <= 0 && run.movedThisFrame) ctx.translate(0, Math.sin(p.animTime * 24) * 1.3);
    const pose = p.attackPose > 0 ? `${run.character.id}-attack`
      : run.movedThisFrame && Math.floor(p.animTime * 6) % 2 ? `${run.character.id}-step` : run.character.id;
    const image = artImage(pose) || artImage(run.character.id);
    if (image?.complete && image.naturalWidth) {
      const size = p.radius * 2.5;
      ctx.drawImage(image, -size / 2, -size / 2, size, size);
    } else {
      ctx.fillStyle = run.character.id === 'conductor' ? '#b6aef0' : run.character.id === 'bulwark' ? '#b0c3c0' : run.character.id === 'scavenger' ? '#ddb88b' : '#90d9c6';
      ctx.strokeStyle = '#132931'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, p.radius, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#223a45'; ctx.beginPath(); ctx.ellipse(5, 0, 10, 11, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#fff4cf'; ctx.fillRect(5, -8, 9, 5); ctx.fillRect(5, 3, 9, 5);
      ctx.fillStyle = '#f7b96e'; ctx.beginPath(); ctx.arc(-7, -12, 5, 0, TAU); ctx.fill();
    }
    ctx.restore();
    if (run.aimTarget) {
      ctx.strokeStyle = '#ffe69c'; ctx.globalAlpha = Math.min(1, run.aimTarget.life);
      ctx.lineWidth = 2;
      if (selectedSkin === 'pixel') { ctx.fillStyle = '#ffe69c'; drawPixelArc(run.aimTarget.x, run.aimTarget.y, 17, 0, TAU); }
      else { ctx.beginPath(); ctx.arc(run.aimTarget.x, run.aimTarget.y, 17, 0, TAU); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(run.aimTarget.x - 24, run.aimTarget.y); ctx.lineTo(run.aimTarget.x - 11, run.aimTarget.y); ctx.moveTo(run.aimTarget.x + 11, run.aimTarget.y); ctx.lineTo(run.aimTarget.x + 24, run.aimTarget.y); ctx.stroke(); ctx.globalAlpha = 1;
    }
    if (moveTarget) {
      ctx.strokeStyle = '#91f5cf'; ctx.lineWidth = 2;
      if (selectedSkin === 'pixel') { ctx.fillStyle = '#91f5cf'; drawPixelArc(moveTarget.x, moveTarget.y, 13, 0, TAU); ctx.fillRect(moveTarget.x - 2, moveTarget.y - 2, 4, 4); }
      else { ctx.beginPath(); ctx.arc(moveTarget.x, moveTarget.y, 13, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(moveTarget.x, moveTarget.y, 3, 0, TAU); ctx.stroke(); }
    }
  }
  function drawWeapons(cam) {
    for (const b of run.bullets) {
      if (!visible(b, cam)) continue;
      ctx.fillStyle = b.color;
      if (selectedSkin === 'pixel') {
        const size = Math.max(6, Math.round(b.r * 2));
        if (b.visualTag) {
          const angle = Math.atan2(b.vy, b.vx);
          ctx.save(); ctx.translate(Math.round(b.x), Math.round(b.y)); ctx.rotate(angle);
          ctx.fillStyle = b.visualTag === 'stars' ? '#b5f6eb' : '#f9e39a';
          ctx.fillRect(-18, -3, 24, 6); ctx.fillRect(-30, -1, 8, 2);
          if (b.visualTag === 'stars') { ctx.fillRect(-2, -10, 4, 20); ctx.fillRect(-10, -2, 20, 4); }
          ctx.restore();
        } else ctx.fillRect(Math.round(b.x - size / 2), Math.round(b.y - size / 2), size, size);
      } else {
        ctx.shadowColor = b.color; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, TAU); ctx.fill();
      }
    }
    ctx.shadowBlur = 0;
    const drones = run.weapons.filter(w => w.id === 'drone');
    for (let i = 0; i < drones.length; i++) {
      const angle = run.totalTime * 2.8 + i * TAU / drones.length;
      const x = run.player.x + Math.cos(angle) * 87, y = run.player.y + Math.sin(angle) * 87;
      const image = artImage('drone');
      if (image) { ctx.drawImage(image, Math.round(x - 17), Math.round(y - 17), 34, 34); continue; }
      ctx.fillStyle = '#8ef0d6'; ctx.strokeStyle = '#13343a'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x, y, 14, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x + 3, y - 2, 4, 0, TAU); ctx.fill();
    }
  }
  function drawPixelArc(x, y, radius, from, to, size = 4) {
    const steps = Math.max(8, Math.ceil(Math.abs(to - from) * radius / 5));
    for (let i = 0; i <= steps; i++) {
      const angle = from + (to - from) * i / steps;
      const px = Math.round((x + Math.cos(angle) * radius) / size) * size;
      const py = Math.round((y + Math.sin(angle) * radius) / size) * size;
      ctx.fillRect(px - size / 2, py - size / 2, size, size);
    }
  }
  function drawEffects(cam) {
    for (const fx of run.effects) {
      const inView = fx.kind === 'line'
        ? Math.max(fx.x1, fx.x2) >= cam.x && Math.min(fx.x1, fx.x2) <= cam.x + viewW
          && Math.max(fx.y1, fx.y2) >= cam.y && Math.min(fx.y1, fx.y2) <= cam.y + viewH
        : visible(fx, cam, fx.r || 30);
      if (!inView) continue;
      ctx.globalAlpha = clamp(fx.life / fx.maxLife, 0, 1);
      ctx.strokeStyle = fx.color; ctx.fillStyle = fx.color;
      if (fx.kind === 'signature') {
        const progress = 1 - fx.life / fx.maxLife;
        const pulse = fx.r * (.35 + progress * .7);
        ctx.save(); ctx.translate(Math.round(fx.x), Math.round(fx.y)); ctx.rotate(fx.angle || 0);
        const colors = { rover: '#b5f6eb', bulwark: '#ffcd91', conductor: '#c5b2ff', scavenger: '#f6d17e' };
        ctx.strokeStyle = colors[fx.character] || '#fff'; ctx.fillStyle = ctx.strokeStyle;
        ctx.lineWidth = selectedSkin === 'pixel' ? 5 : 3;
        if (fx.character === 'rover') {
          if (selectedSkin === 'pixel') {
            drawPixelArc(0, 0, pulse, 0, TAU, 4);
            ctx.fillRect(-pulse - 10, -3, 20, 6); ctx.fillRect(pulse - 10, -3, 20, 6);
            ctx.fillRect(-3, -pulse - 10, 6, 20); ctx.fillRect(-3, pulse - 10, 6, 20);
          } else {
            ctx.beginPath(); ctx.arc(0, 0, pulse, 0, TAU); ctx.stroke();
            for (const a of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) { ctx.beginPath(); ctx.moveTo(Math.cos(a) * (pulse - 20), Math.sin(a) * (pulse - 20)); ctx.lineTo(Math.cos(a) * (pulse + 12), Math.sin(a) * (pulse + 12)); ctx.stroke(); }
          }
        } else if (fx.character === 'bulwark') {
          if (selectedSkin === 'pixel') {
            drawPixelArc(0, 0, pulse, -1.15, 1.15, 7);
            drawPixelArc(0, 0, pulse * .7, -1.15, 1.15, 5);
          } else {
            ctx.beginPath(); ctx.arc(0, 0, pulse, -1.15, 1.15); ctx.stroke();
            ctx.beginPath(); ctx.arc(0, 0, pulse * .7, -1.15, 1.15); ctx.stroke();
          }
        } else if (fx.character === 'conductor') {
          for (let i = 0; i < 8; i++) {
            const a = i * TAU / 8, inner = pulse * .3, outer = pulse;
            ctx.beginPath(); ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
            ctx.lineTo(Math.cos(a + .12) * outer * .62, Math.sin(a + .12) * outer * .62);
            ctx.lineTo(Math.cos(a - .08) * outer, Math.sin(a - .08) * outer); ctx.stroke();
          }
        } else {
          for (let i = 0; i < 12; i++) {
            const a = i * TAU / 12 + progress * 2, reach = pulse * (.55 + (i % 2) * .35);
            ctx.save(); ctx.rotate(a); ctx.fillRect(reach, -3, 16, 6); ctx.restore();
          }
          if (selectedSkin === 'pixel') drawPixelArc(0, 0, pulse * .5, 0, TAU, 4);
          else { ctx.beginPath(); ctx.arc(0, 0, pulse * .5, 0, TAU); ctx.stroke(); }
        }
        ctx.restore();
      }
      else if (fx.kind === 'skill-burst') {
        const progress = 1 - fx.life / fx.maxLife;
        const color = SKILL_FX_COLORS[fx.character];
        ctx.save(); ctx.translate(Math.round(fx.x), Math.round(fx.y)); ctx.rotate(fx.angle || 0);
        ctx.fillStyle = color; ctx.strokeStyle = color;
        if (selectedSkin === 'pixel') {
          drawPixelArc(0, 0, fx.r * (.35 + progress * .65), 0, TAU, 4);
          for (let i = 0; i < 8; i++) {
            const angle = i * TAU / 8, reach = fx.r * (.22 + progress * .7);
            ctx.fillRect(Math.round(Math.cos(angle) * reach / 4) * 4 - 3,
              Math.round(Math.sin(angle) * reach / 4) * 4 - 3, 6, 6);
          }
          const image = artImage(fx.skill === 0 ? `effect-${fx.character}` : `skill-${fx.character}-${fx.skill}`);
          if (image) {
            const size = Math.min(80, Math.max(38, fx.r * .65)) * (1 + progress * .35);
            ctx.drawImage(image, -size / 2, -size / 2, size, size);
          }
        } else {
          ctx.shadowColor = color; ctx.shadowBlur = 15; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(0, 0, fx.r * (.4 + progress * .6), 0, TAU); ctx.stroke();
          for (let i = 0; i < 8; i++) {
            const angle = i * TAU / 8, reach = fx.r * (.2 + progress * .65);
            ctx.beginPath(); ctx.moveTo(Math.cos(angle) * (reach - 12), Math.sin(angle) * (reach - 12));
            ctx.lineTo(Math.cos(angle) * reach, Math.sin(angle) * reach); ctx.stroke();
          }
        }
        ctx.restore();
      }
      else if (fx.kind === 'pulse') {
        const radius = fx.r * (1.15 - fx.life / fx.maxLife * .35);
        if (selectedSkin === 'pixel') drawPixelArc(fx.x, fx.y, radius, 0, TAU, 5);
        else { ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(fx.x, fx.y, radius, 0, TAU); ctx.stroke(); }
      }
      else if (fx.kind === 'shards') {
        const travel = 1 - fx.life / fx.maxLife;
        for (let i = 0; i < 4; i++) {
          const angle = i * TAU / 4 + .4;
          ctx.save(); ctx.translate(fx.x + Math.cos(angle) * fx.r * travel, fx.y + Math.sin(angle) * fx.r * travel);
          if (selectedSkin !== 'pixel') ctx.rotate(angle + travel * 2);
          ctx.fillRect(-4, -3, 8, 6); ctx.restore();
        }
      }
      else if (fx.kind === 'line') {
        if (selectedSkin === 'pixel') {
          const steps = Math.max(1, Math.ceil(Math.hypot(fx.x2 - fx.x1, fx.y2 - fx.y1) / 5));
          for (let i = 0; i <= steps; i++) {
            const x = fx.x1 + (fx.x2 - fx.x1) * i / steps, y = fx.y1 + (fx.y2 - fx.y1) * i / steps;
            ctx.fillRect(Math.round(x / 4) * 4, Math.round(y / 4) * 4, fx.width || 4, fx.width || 4);
          }
        } else { ctx.lineWidth = fx.width || 3; ctx.beginPath(); ctx.moveTo(fx.x1, fx.y1); ctx.lineTo(fx.x2, fx.y2); ctx.stroke(); }
      }
      else if (fx.kind === 'arc') {
        if (selectedSkin === 'pixel') drawPixelArc(fx.x, fx.y, fx.r, fx.angle - fx.arc, fx.angle + fx.arc, 8);
        else { ctx.lineWidth = fx.angle ? 14 : 8; ctx.beginPath(); ctx.arc(fx.x, fx.y, fx.r, fx.angle - fx.arc, fx.angle + fx.arc); ctx.stroke(); }
      }
      else if (fx.kind === 'text') { ctx.font = 'bold 18px system-ui'; ctx.textAlign = 'center'; ctx.fillText(fx.text, fx.x, fx.y - (1 - fx.life / fx.maxLife) * 24); }
    }
    ctx.globalAlpha = 1;
  }
  function drawSkillGround() {
    const field = run.skills.field;
    if (!field) return;
    ctx.fillStyle = '#b5b4ff'; ctx.strokeStyle = '#d5cfff'; ctx.lineWidth = 2; ctx.globalAlpha = .12;
    if (selectedSkin === 'pixel') {
      ctx.fillRect(field.x - 80, field.y - 80, 160, 160);
      const image = artImage('effect-conductor');
      if (image) { ctx.globalAlpha = .32; ctx.drawImage(image, field.x - 88, field.y - 88, 176, 176); }
      ctx.globalAlpha = .7; ctx.fillStyle = '#d5cfff'; drawPixelArc(field.x, field.y, 115, 0, TAU);
    } else { ctx.beginPath(); ctx.arc(field.x, field.y, 115, 0, TAU); ctx.fill(); ctx.globalAlpha = .55; ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  function drawSkillAreas() {
    const s = run.skills;
    if (s.mark && !s.mark.target.dead) {
      ctx.strokeStyle = '#b5f6eb'; ctx.lineWidth = 3; ctx.globalAlpha = .65 + .25 * Math.sin(ambientTime * 10);
      if (selectedSkin === 'pixel') {
        ctx.fillStyle = '#b5f6eb'; drawPixelArc(s.mark.target.x, s.mark.target.y, s.mark.target.r + 12, 0, TAU);
        const image = artImage('effect-rover');
        if (image) ctx.drawImage(image, s.mark.target.x - 32, s.mark.target.y - 32, 64, 64);
      }
      else { ctx.beginPath(); ctx.arc(s.mark.target.x, s.mark.target.y, s.mark.target.r + 12, 0, TAU); ctx.stroke(); }
      ctx.globalAlpha = 1;
    }
    if (selectedSkin === 'pixel' && run.character.id === 'scavenger' && s.magnetTime > 0) {
      const image = artImage('effect-scavenger');
      ctx.globalAlpha = .65 + .2 * Math.sin(ambientTime * 9);
      if (image) ctx.drawImage(image, run.player.x - 42, run.player.y - 42, 84, 84);
      ctx.fillStyle = '#f6d17e'; drawPixelArc(run.player.x, run.player.y, 75 + run.stats.pickup, 0, TAU, 5);
      ctx.globalAlpha = 1;
    }
    if (selectedSkin === 'pixel' && run.character.id === 'conductor' && s.charge > 0) {
      for (let i = 0; i < s.charge; i++) {
        const angle = i * TAU / 10 - Math.PI / 2;
        ctx.fillStyle = i % 2 ? '#c5b2ff' : '#f0dcff';
        ctx.fillRect(Math.round(run.player.x + Math.cos(angle) * 34) - 2,
          Math.round(run.player.y + Math.sin(angle) * 34) - 2, 5, 5);
      }
    }
    if (s.shieldTime > 0 || s.guardReady) {
      ctx.strokeStyle = s.guardReady ? '#ffcd91' : '#ffe4a0'; ctx.lineWidth = 3; ctx.globalAlpha = .8;
      if (selectedSkin === 'pixel') { ctx.fillStyle = ctx.strokeStyle; drawPixelArc(run.player.x, run.player.y, run.player.radius + 8, 0, TAU); }
      else { ctx.beginPath(); ctx.arc(run.player.x, run.player.y, run.player.radius + 8, 0, TAU); ctx.stroke(); }
      ctx.globalAlpha = 1;
    }
  }
  function drawCombat() {
    const cam = camera();
    ctx.save();
    if (run.screenShake > 0 && phase === 'combat') ctx.translate(rand(-run.screenShake, run.screenShake), rand(-run.screenShake, run.screenShake));
    ctx.translate(selectedSkin === 'pixel' ? -Math.round(cam.x) : -cam.x, selectedSkin === 'pixel' ? -Math.round(cam.y) : -cam.y);
    drawBackdrop(cam); drawTerrain(cam); drawHazards(cam); drawSkillGround(); drawPickups(cam);
    for (const b of run.enemyBullets) {
      if (!visible(b, cam)) continue;
      ctx.fillStyle = '#ff8da8';
      if (selectedSkin === 'pixel') ctx.fillRect(Math.round(b.x - b.r), Math.round(b.y - b.r), b.r * 2, b.r * 2);
      else { ctx.shadowColor = '#ff8da8'; ctx.shadowBlur = 9; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, TAU); ctx.fill(); }
    }
    ctx.shadowBlur = 0;
    for (const e of run.enemies) if (visible(e, cam, e.r + 20)) drawEnemy(e);
    drawWeapons(cam); drawPlayer(); drawSkillAreas(); drawEffects(cam);
    ctx.restore();
  }
  function drawTitleScene() {
    if (selectedSkin === 'pixel') {
      ctx.fillStyle = '#102530'; ctx.fillRect(0, 0, viewW, viewH);
      for (let i = 0; i < 65; i++) {
        const x = Math.floor((i * 7919 % 1000) / 1000 * viewW / 4) * 4;
        const y = Math.floor((i * 6151 % 1000) / 1000 * viewH / 4) * 4;
        ctx.fillStyle = i % 6 ? '#3e6972' : '#a5d6b7';
        ctx.fillRect(x, y, i % 6 ? 2 : 4, i % 6 ? 2 : 4);
      }
      const x = Math.round(viewW * .73 / 8) * 8, y = Math.round(viewH * .57 / 8) * 8;
      for (let i = 4; i >= 0; i--) {
        const size = 64 + i * 32;
        ctx.fillStyle = i % 2 ? '#25444e' : '#476b66';
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
      ctx.fillStyle = '#ffcf7a'; ctx.fillRect(x - 48, y - 48, 96, 96);
      ctx.fillStyle = '#ffebad'; ctx.fillRect(x - 24, y - 24, 48, 48);
      return;
    }
    const grd = ctx.createLinearGradient(0, 0, viewW, viewH);
    grd.addColorStop(0, '#0a1d28'); grd.addColorStop(.6, '#17343c'); grd.addColorStop(1, '#10232e');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, viewW, viewH);
    for (let i = 0; i < 65; i++) {
      const x = (i * 7919 % 1000) / 1000 * viewW, y = (i * 6151 % 1000) / 1000 * viewH;
      ctx.fillStyle = '#bcefe5'; ctx.globalAlpha = .12 + .1 * Math.sin(ambientTime + i);
      ctx.beginPath(); ctx.arc(x, y, i % 5 === 0 ? 2 : 1, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
    const x = viewW * .73, y = viewH * .57, r = Math.min(viewW, viewH) * .27;
    ctx.strokeStyle = '#9eecd6'; ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) { ctx.globalAlpha = .15 + i * .05; ctx.beginPath(); ctx.arc(x, y, r * (.4 + i * .25), ambientTime * .12 + i, ambientTime * .12 + i + Math.PI * 1.45); ctx.stroke(); }
    ctx.globalAlpha = .45;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
    glow.addColorStop(0, '#ffd184'); glow.addColorStop(.35, '#e89373'); glow.addColorStop(1, '#e8937300');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }
  function resize() {
    viewW = Math.max(1, canvas.clientWidth);
    viewH = Math.max(1, canvas.clientHeight);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvasScale = selectedSkin === 'pixel' ? 1 : dpr;
    canvas.width = Math.round(viewW * canvasScale); canvas.height = Math.round(viewH * canvasScale);
    ctx.setTransform(canvasScale, 0, 0, canvasScale, 0, 0);
    ctx.imageSmoothingEnabled = selectedSkin !== 'pixel';
  }
  function loop(now) {
    const dt = Math.min(.05, (now - (lastFrame || now)) / 1000);
    lastFrame = now; ambientTime += dt;
    if (phase === 'combat' && run) updateCombat(dt);
    if (phase === 'wave-result' && run) updateWaveIntermission(dt);
    ctx.setTransform(canvasScale, 0, 0, canvasScale, 0, 0);
    ctx.imageSmoothingEnabled = selectedSkin !== 'pixel';
    ctx.clearRect(0, 0, viewW, viewH);
    if (run && phase !== 'title') drawCombat(); else drawTitleScene();
    requestAnimationFrame(loop);
  }

  function pause() {
    if (phase !== 'combat' && phase !== 'wave-result') return;
    previousPhase = phase; showPhase('pause'); keys.clear(); resetStick();
    clearTimeout(toastTimer); $('toast').classList.remove('show');
    renderPauseDetails();
    $('resume-button').textContent = previousPhase === 'wave-result' ? '继续读秒' : '继续战斗';
    $('resume-button').focus({ preventScroll: true });
  }
  function resume() {
    if (phase !== 'pause') return;
    showPhase(previousPhase);
    $(previousPhase === 'wave-result' ? 'wave-result-continue' : 'pause-button').focus({ preventScroll: true });
  }
  function goTitle() { run = null; moveFlow = null; keys.clear(); resetStick(); showPhase('title'); renderTitle(); $('start-button').focus({ preventScroll: true }); }
  function resetStick() { stick.x = 0; stick.y = 0; stick.pointerId = null; $('joystick-knob').style.transform = 'translate(0,0)'; }
  function moveStick(event) {
    const box = $('joystick').getBoundingClientRect();
    const x = event.clientX - box.left - box.width / 2, y = event.clientY - box.top - box.height / 2;
    const limit = box.width * .3, length = Math.hypot(x, y), scale = length > limit ? limit / length : 1;
    const mx = x * scale, my = y * scale;
    stick.x = clamp(mx / limit, -1, 1); stick.y = clamp(my / limit, -1, 1);
    $('joystick-knob').style.transform = `translate(${mx}px, ${my}px)`;
  }
  function bindEvents() {
    $('character-list').addEventListener('click', event => { const b = event.target.closest('[data-character]'); if (b) { selectedCharacter = b.dataset.character; renderTitle(); refocus(`[data-character="${selectedCharacter}"]`); } });
    $('biome-list').addEventListener('click', event => { const b = event.target.closest('[data-biome]'); if (b) { selectedBiome = b.dataset.biome; renderTitle(); refocus(`[data-biome="${selectedBiome}"]`); } });
    $('difficulty-list').addEventListener('click', event => { const b = event.target.closest('[data-difficulty]'); if (b) { selectedDifficulty = b.dataset.difficulty; persist(); renderTitle(); refocus(`[data-difficulty="${selectedDifficulty}"]`); } });
    $('pace-list').addEventListener('click', event => { const b = event.target.closest('[data-pace]'); if (b) { selectedPace = b.dataset.pace; persist(); renderTitle(); refocus(`[data-pace="${selectedPace}"]`); } });
    for (const id of ['title-skin-button', 'skin-button', 'pause-skin-button']) {
      $(id).addEventListener('click', () => { toggleSkin(); $(id).focus({ preventScroll: true }); });
    }
    $('sound-button').addEventListener('click', () => { soundEnabled = !soundEnabled; persist(); renderTitle(); refocus('#sound-button'); if (soundEnabled) playSfx('select'); });
    $('start-button').addEventListener('click', startRun);
    $('pause-button').addEventListener('click', pause);
    $('resume-button').addEventListener('click', resume);
    $('restart-button').addEventListener('click', startRun);
    $('quit-button').addEventListener('click', goTitle);
    $('result-restart').addEventListener('click', startRun);
    $('result-home').addEventListener('click', goTitle);
    $('level-options').addEventListener('click', event => {
      const button = event.target.closest('[data-level]');
      if (!button || phase !== 'level') return;
      const choice = run.levelChoices[Number(button.dataset.level)];
      if (!choice) return;
      applyBonus(choice.bonus); run.pendingLevels -= 1; playSfx('level');
      if (run.pendingLevels > 0) levelOffers(); else openShop();
    });
    $('shop-offers').addEventListener('click', event => {
      const buy = event.target.closest('[data-buy]'), lock = event.target.closest('[data-lock]');
      if (buy) buyOffer(Number(buy.dataset.buy));
      if (lock) { const index = Number(lock.dataset.lock), offer = run.shopOffers[index]; if (offer) { offer.locked = !offer.locked; renderShop(); refocus(`[data-lock="${index}"]`); } }
    });
    $('inventory').addEventListener('click', event => {
      const merge = event.target.closest('[data-merge]'), sell = event.target.closest('[data-sell]');
      if (merge) mergeWeapon(Number(merge.dataset.merge));
      if (sell) sellWeapon(Number(sell.dataset.sell));
    });
    $('reroll-button').addEventListener('click', rerollShop);
    $('next-wave-button').addEventListener('click', beginNextWaveCountdown);
    $('wave-result-continue').addEventListener('click', resolveWaveIntermission);
    $('chest-take-button').addEventListener('click', () => resolveChest(true));
    $('chest-scrap-button').addEventListener('click', () => resolveChest(false));
    window.addEventListener('keydown', event => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key === 'Escape') { if (phase === 'combat' || phase === 'wave-result') pause(); else if (phase === 'pause') resume(); return; }
      if (phase !== 'combat') return;
      if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'q'].includes(key)) event.preventDefault();
      if (key === ' ') { if (!event.repeat) tryDash(); return; }
      if (key === 'q') { if (!event.repeat) tryActiveSkill(); return; }
      keys.add(key);
    });
    window.addEventListener('keyup', event => { keys.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key); });
    window.addEventListener('blur', () => { keys.clear(); pause(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
    const joystick = $('joystick');
    joystick.addEventListener('pointerdown', event => { if (phase !== 'combat') return; event.preventDefault(); stick.pointerId = event.pointerId; joystick.setPointerCapture(event.pointerId); moveStick(event); });
    joystick.addEventListener('pointermove', event => { if (event.pointerId === stick.pointerId) { event.preventDefault(); moveStick(event); } });
    joystick.addEventListener('pointerup', event => { if (event.pointerId === stick.pointerId) resetStick(); });
    joystick.addEventListener('pointercancel', event => { if (event.pointerId === stick.pointerId) resetStick(); });
    $('dash-button').addEventListener('pointerdown', event => { event.preventDefault(); tryDash(); });
    $('skill-button').addEventListener('pointerdown', event => { event.preventDefault(); tryActiveSkill(); });
    $('dash-button').addEventListener('click', event => { if (event.detail === 0) tryDash(); });
    $('skill-button').addEventListener('click', event => { if (event.detail === 0) tryActiveSkill(); });
    canvas.addEventListener('pointerdown', event => {
      if (phase !== 'combat') return;
      const box = canvas.getBoundingClientRect(), cam = camera();
      const x = event.clientX - box.left + cam.x, y = event.clientY - box.top + cam.y;
      if (event.button === 2) {
        event.preventDefault();
        moveTarget = nearestWalkable(x, y, run.player.radius);
        moveFlow = makeFlow(moveTarget.x, moveTarget.y, run.player.radius);
      } else if (event.button === 0) {
        run.aimTarget = { x: clamp(x, 0, WORLD.w), y: clamp(y, 0, WORLD.h), life: 3.5 };
      }
    });
    canvas.addEventListener('contextmenu', event => { if (phase === 'combat') event.preventDefault(); });
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);
  }

  resize(); bindEvents(); renderTitle(); requestAnimationFrame(loop);
})();
