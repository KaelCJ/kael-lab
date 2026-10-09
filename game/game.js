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

  const CHARACTERS = [
    { id: 'rover', name: '巡星者', icon: '✦', desc: '均衡机动 · 初始脉冲枪', weapon: 'pulse', hp: 30, stats: { speed: 8, ranged: 2 } },
    { id: 'bulwark', name: '装甲匠', icon: '⬡', desc: '高生命护甲 · 初始弧刃', weapon: 'blade', hp: 40, stats: { armor: 3, speed: -8, melee: 3 } },
    { id: 'conductor', name: '导电师', icon: 'ϟ', desc: '元素连锁 · 初始电弧线圈', weapon: 'arc', hp: 26, stats: { elemental: 4, attackSpeed: 8 } },
    { id: 'scavenger', name: '拾荒鸦', icon: '◇', desc: '更易拾取 · 初始碎片霰枪', weapon: 'scatter', hp: 27, stats: { luck: 15, pickup: 38, crit: 5 } }
  ];
  const BIOMES = [
    { id: 'docks', name: '赤沙废港', icon: '◈', desc: '灼热沙尘与失控机械', ground: '#263238', grid: '#40515a', accent: '#ffba72', hazard: '热流喷口' },
    { id: 'grove', name: '荧菌裂谷', icon: '✿', desc: '发光菌簇与腐蚀孢雾', ground: '#26303c', grid: '#3f4c61', accent: '#d6a0f1', hazard: '孢雾爆发' },
    { id: 'frost', name: '蓝霜残骸', icon: '❄', desc: '冻结碎片与寒流裂缝', ground: '#1e3440', grid: '#3b5967', accent: '#9fdcf5', hazard: '寒流爆裂' }
  ];
  const DIFFICULTIES = [
    { id: 'normal', name: '标准', mult: 1 },
    { id: 'hard', name: '挑战', mult: 1.3 },
    { id: 'nightmare', name: '极限', mult: 1.65 }
  ];
  const PACES = [{ id: 'normal', name: '标准' }, { id: 'quick', name: '速战' }];

  const WEAPONS = {
    pulse: { name: '脉冲枪', icon: '✦', type: 'ranged', color: '#a9d9ff', damage: 7, cooldown: .42, range: 570, speed: 760, price: 12, desc: '精准的自动追踪射击。' },
    scatter: { name: '碎片霰枪', icon: '✧', type: 'ranged', color: '#ffc789', damage: 4, cooldown: .9, range: 390, speed: 590, count: 5, price: 16, desc: '近距离扇形散射。' },
    blade: { name: '回旋弧刃', icon: '◒', type: 'melee', color: '#ffcd91', damage: 18, cooldown: .75, range: 122, price: 13, desc: '挥砍前方一片敌人。' },
    arc: { name: '电弧线圈', icon: 'ϟ', type: 'elemental', color: '#b5b4ff', damage: 11, cooldown: 1.12, range: 430, price: 18, desc: '闪电会跳向附近敌人。' },
    drone: { name: '护航浮球', icon: '◉', type: 'elemental', color: '#8ef0d6', damage: 6, cooldown: .3, range: 90, price: 20, desc: '围绕你持续撞击敌人。' },
    ember: { name: '余烬喷射器', icon: '♨', type: 'elemental', color: '#ff9d73', damage: 4, cooldown: .16, range: 230, price: 20, desc: '锥形火焰使敌人燃烧。' },
    rail: { name: '棱光轨炮', icon: '↗', type: 'ranged', color: '#f5e99c', damage: 28, cooldown: 1.7, range: 720, speed: 1100, pierce: 4, price: 25, desc: '高伤害穿透射线。' },
    spore: { name: '孢子发射器', icon: '●', type: 'elemental', color: '#c2e88c', damage: 13, cooldown: 1.15, range: 480, speed: 460, explosion: 92, price: 22, desc: '爆炸波及附近目标。' }
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
      { name: '踏稳', desc: '周围多名敌人持续逼近时积蓄一次减伤。' },
      { name: '回锋', desc: '每 5 次近战物理武器攻击，追加一次侧向横扫。' },
      { name: '裂阵反击', desc: '本波承伤累积到门槛时释放环形剑气。' }
    ],
    conductor: [
      { name: '极差场', desc: '放置持续 4 秒的法术伤害场域。', kind: 'active' },
      { name: '蓄电', desc: '法术攻击命中积累电荷；每次攻击最多积一层。' },
      { name: '绝缘回流', desc: '受击时消耗电荷减伤，并反击附近敌人。' },
      { name: '过载边界', desc: '电荷满后释放向外扩散的法术脉冲。' }
    ],
    scavenger: [
      { name: '磁流召回', desc: '4 秒内拾取范围 +180。', kind: 'active' },
      { name: '拾荒分红', desc: '每手动拾取 8 个材料，额外获得 2 个材料。' },
      { name: '废件护层', desc: '每手动拾取 12 个材料，获得短时防护。' },
      { name: '满载运转', desc: '本波拾取 18 个材料后，短时提高伤害与攻速。' }
    ]
  };
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

  let save = loadSave();
  let selectedCharacter = CHARACTERS[0].id;
  let selectedBiome = BIOMES[0].id;
  let selectedDifficulty = save.settings.difficulty || 'normal';
  let selectedPace = save.settings.pace || 'normal';
  let soundEnabled = save.settings.sound !== false;
  let phase = 'title';
  let previousPhase = 'combat';
  let run = null;
  let viewW = 0, viewH = 0, dpr = 1, lastFrame = 0, ambientTime = 0;
  let uid = 0, toastTimer = 0, audio = null;
  const keys = new Set();
  const stick = { x: 0, y: 0, pointerId: null };
  let moveTarget = null;
  const decor = Array.from({ length: 125 }, () => ({ x: rand(30, WORLD.w - 30), y: rand(30, WORLD.h - 30), r: rand(2, 13), angle: rand(0, TAU) }));

  function loadSave() {
    try {
      const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
      return { settings: raw.settings || {}, records: raw.records || {}, wins: Number(raw.wins) || 0 };
    } catch (_) { return { settings: {}, records: {}, wins: 0 }; }
  }
  function persist() {
    save.settings = { sound: soundEnabled, pace: selectedPace, difficulty: selectedDifficulty };
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (_) { /* Storage may be unavailable. */ }
  }
  function showToast(message) {
    const el = $('toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 1900);
  }
  function refocus(selector) { requestAnimationFrame(() => document.querySelector(selector)?.focus({ preventScroll: true })); }
  function tone(freq = 440, duration = .08, type = 'sine', volume = .035) {
    if (!soundEnabled) return;
    try {
      audio ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume().catch(() => {});
      const osc = audio.createOscillator(), gain = audio.createGain();
      osc.type = type; osc.frequency.setValueAtTime(freq, audio.currentTime);
      gain.gain.setValueAtTime(volume, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + duration);
      osc.connect(gain); gain.connect(audio.destination);
      osc.start(); osc.stop(audio.currentTime + duration);
    } catch (_) { /* Sound is optional. */ }
  }
  function renderTitle() {
    $('character-list').innerHTML = CHARACTERS.map(c => `<button class="selection-card" type="button" data-character="${c.id}" aria-pressed="${selectedCharacter === c.id}"><span class="selection-icon">${c.icon}</span><span><strong>${c.name}</strong><small>${c.desc}</small><small class="skill-preview">专属技能：${SKILLS[c.id].map(skill => skill.name).join(' · ')}</small></span></button>`).join('');
    $('biome-list').innerHTML = BIOMES.map(b => `<button class="selection-card" type="button" data-biome="${b.id}" aria-pressed="${selectedBiome === b.id}"><span class="selection-icon">${b.icon}</span><span><strong>${b.name}</strong><small>${b.desc}</small></span></button>`).join('');
    $('difficulty-list').innerHTML = DIFFICULTIES.map(d => `<button type="button" data-difficulty="${d.id}" aria-pressed="${selectedDifficulty === d.id}">${d.name}</button>`).join('');
    $('pace-list').innerHTML = PACES.map(p => `<button type="button" data-pace="${p.id}" aria-pressed="${selectedPace === p.id}">${p.name}</button>`).join('');
    $('sound-button').textContent = soundEnabled ? '开启' : '关闭';
    const key = `${selectedCharacter}:${selectedBiome}:${selectedDifficulty}`;
    const best = save.records[key] || 0;
    $('record-label').textContent = `最佳记录：${best ? `第 ${best} 波` : '暂无'} · 通关 ${save.wins} 次`;
  }
  function hideScreens() {
    ['title-screen', 'level-screen', 'shop-screen', 'chest-screen', 'pause-screen', 'result-screen'].forEach(id => $(id).classList.add('hidden'));
  }
  function showPhase(next) {
    phase = next;
    if (next !== 'combat') moveTarget = null;
    hideScreens();
    $('hud').classList.toggle('hidden', next !== 'combat');
    $('touch-controls').classList.toggle('hidden', next !== 'combat');
    const screen = { title: 'title-screen', level: 'level-screen', shop: 'shop-screen', chest: 'chest-screen', pause: 'pause-screen', result: 'result-screen' }[next];
    if (screen) $(screen).classList.remove('hidden');
  }
  function createWeapon(id, tier = 1) { return { id, tier, uid: ++uid, cool: 0 }; }
  function startRun() {
    resetStick(); keys.clear(); moveTarget = null;
    const character = CHARACTERS.find(c => c.id === selectedCharacter);
    const biome = BIOMES.find(b => b.id === selectedBiome);
    const difficulty = DIFFICULTIES.find(d => d.id === selectedDifficulty);
    const stats = { armor: 0, speed: 0, ranged: 0, melee: 0, elemental: 0, attackSpeed: 0, crit: 5, dodge: 0, regen: 0, pickup: 0, luck: 0, lifesteal: 0, damage: 0, ...character.stats };
    run = {
      character, biome, difficulty, stats, player: { x: WORLD.w / 2, y: WORLD.h / 2, radius: 17, hp: character.hp, maxHp: character.hp, facing: 0, invuln: 0, dashTime: 0, dashCooldown: 0, dashX: 1, dashY: 0 },
      wave: 0, elapsed: 0, totalTime: 0, timeLeft: 0, kills: 0, money: 0, earned: 0,
      level: 1, xp: 0, xpNeed: 8, pendingLevels: 0, levelChoices: [],
      weapons: [createWeapon(character.weapon)], shopOffers: [], rerolls: 0,
      pendingChests: 0, chestReward: null, attackSeq: 0,
      skills: { activeCooldown: 0, mark: null, moveTime: 0, steadyReady: false, rangedFires: 0, rangedHits: 0, meleeFires: 0,
        manualPickups: 0, shieldTime: 0, loadedTime: 0, loadedUsed: false, charge: 0, field: null, overload: null,
        guardTime: 0, guardReady: false, guardCooldown: 0, damageTaken: 0, counterCooldown: 0, returnCooldown: 0, hitIds: new Set() },
      enemies: [], bullets: [], enemyBullets: [], pickups: [], effects: [], hazards: [],
      spawnClock: 0, hazardClock: 8, specialSpawned: false, normalChestDropped: false, regenClock: 0, lifeClock: 0,
      bossFight: false, pendingVictory: false, hudClock: 0, screenShake: 0
    };
    startWave();
  }
  function waveDuration() { return selectedPace === 'quick' ? 15 + Math.min(6, run.wave * .3) : run.wave === MAX_WAVES ? 90 : Math.min(60, 15 + run.wave * 5); }
  function startWave() {
    resetStick(); keys.clear(); moveTarget = null;
    run.wave += 1;
    run.elapsed = 0;
    run.timeLeft = waveDuration();
    run.spawnClock = .3;
    run.hazardClock = 8;
    run.specialSpawned = false;
    run.normalChestDropped = false;
    run.bossFight = false;
    run.pendingVictory = false;
    run.skills.activeCooldown = 0;
    run.skills.moveTime = 0; run.skills.steadyReady = false; run.skills.rangedFires = 0; run.skills.rangedHits = 0; run.skills.meleeFires = 0;
    run.skills.manualPickups = 0; run.skills.loadedUsed = false; run.skills.loadedTime = 0; run.skills.damageTaken = 0;
    run.skills.magnetTime = 0; run.skills.shieldTime = 0; run.skills.guardTime = 0; run.skills.guardReady = false;
    run.skills.guardCooldown = 0; run.skills.counterCooldown = 0; run.skills.returnCooldown = 0; run.skills.charge = 0;
    run.skills.hitIds.clear(); run.skills.mark = null; run.skills.field = null; run.skills.overload = null;
    run.enemies = []; run.bullets = []; run.enemyBullets = []; run.pickups = []; run.effects = []; run.hazards = [];
    run.player.invuln = 1;
    showPhase('combat');
    renderWeaponStrip();
    updateHUD();
    $('pause-button').focus({ preventScroll: true });
    showToast(run.wave === MAX_WAVES ? '最终波次：击败星核吞噬者！' : `第 ${run.wave} 波开始`);
    tone(540, .16, 'triangle', .045);
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
    tone(victory ? 790 : 210, .45, 'triangle', .06);
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
      tone(680, .1, 'sine', .02);
    }
  }
  function levelOffers() {
    run.levelChoices = [...UPGRADES].sort(() => Math.random() - .5).slice(0, 3);
    $('levels-left').textContent = `剩余 ${run.pendingLevels} 次`;
    $('level-options').innerHTML = run.levelChoices.map((u, i) => `<button class="choice-option" type="button" data-level="${i}"><span class="choice-icon">${u.icon}</span><strong>${u.name}</strong><span>${u.desc}</span></button>`).join('');
    showPhase('level');
    $('level-options').querySelector('button')?.focus({ preventScroll: true });
  }
  function finishWave() {
    if (phase !== 'combat') return;
    collectRemainingPickups();
    run.enemies = []; run.enemyBullets = []; run.bullets = [];
    if (run.pendingChests > 0) openChest();
    else finishChestSequence();
    tone(660, .2, 'triangle', .05);
  }
  function finishChestSequence() {
    if (run.wave >= MAX_WAVES) endRun(true);
    else if (run.pendingLevels > 0) levelOffers();
    else openShop();
  }
  function openChest() {
    run.chestReward = pick(CHEST_ITEMS);
    $('chests-left').textContent = run.pendingChests;
    $('chest-reward').innerHTML = `<span class="chest-reward-icon">${run.chestReward.icon}</span><div><strong>${run.chestReward.name}</strong><p>${run.chestReward.desc}</p></div>`;
    $('chest-scrap-button').textContent = `拆解为 ◇ ${Math.round(run.chestReward.price * .5)}`;
    showPhase('chest');
    $('chest-take-button').focus({ preventScroll: true });
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
    tone(take ? 760 : 450, .12, 'triangle', .04);
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
    const held = run.shopOffers.filter(offer => offer?.locked).slice(0, 4);
    run.shopOffers = [...held, ...Array.from({ length: 4 - held.length }, () => randomShopOffer())];
    heal(2 + Math.round(run.player.maxHp * .16));
    showPhase('shop');
    renderShop();
    $('reroll-button').focus({ preventScroll: true });
  }
  function randomShopOffer() {
    if (Math.random() < .58) {
      const tier = run.wave >= 14 && Math.random() < .15 ? 3 : run.wave >= 6 && Math.random() < .36 ? 2 : 1;
      const id = pick(WEAPON_IDS);
      return { kind: 'weapon', id, tier, cost: Math.round(WEAPONS[id].price + run.wave * 1.7 + (tier - 1) * 22), locked: false };
    }
    const item = pick(ITEMS);
    return { kind: 'item', id: item.id, cost: Math.round(item.price + run.wave * 1.4), locked: false };
  }
  function canFitWeapon(offer) {
    return run.weapons.length < 6 || run.weapons.some(w => w.id === offer.id && w.tier === offer.tier && w.tier < 4);
  }
  function renderShop() {
    $('shop-wave').textContent = `第 ${run.wave} 波完成`;
    $('shop-money').textContent = run.money;
    $('shop-offers').innerHTML = run.shopOffers.map((offer, i) => {
      if (!offer) return `<div class="offer-card" aria-label="售罄"><span class="tier-label">售罄</span></div>`;
      const def = offer.kind === 'weapon' ? WEAPONS[offer.id] : ITEMS.find(item => item.id === offer.id);
      const disabled = run.money < offer.cost || (offer.kind === 'weapon' && !canFitWeapon(offer));
      const reason = run.money < offer.cost ? '材料不足' : '武器槽已满';
      return `<div class="offer-card ${offer.locked ? 'locked' : ''}"><div class="offer-head"><span class="offer-icon">${def.icon}</span><span class="tier-label">${offer.kind === 'weapon' ? `武器 · ${'ⅠⅡⅢⅣ'[offer.tier - 1]}阶` : '改装'}</span></div><strong>${def.name}</strong><p>${def.desc}</p><div class="offer-actions"><button class="buy-button" type="button" data-buy="${i}" ${disabled ? `disabled title="${reason}"` : ''}>◇ ${offer.cost} 购买</button><button type="button" data-lock="${i}" aria-label="${offer.locked ? '解锁' : '锁定'} ${def.name}" aria-pressed="${offer.locked}">${offer.locked ? '🔒' : '锁'}</button></div></div>`;
    }).join('');
    const rerollCost = 3 + run.wave + run.rerolls * 3;
    $('reroll-button').textContent = `刷新商品 ◇ ${rerollCost}`;
    $('reroll-button').disabled = run.money < rerollCost;
    $('inventory').innerHTML = Array.from({ length: 6 }, (_, i) => {
      const w = run.weapons[i];
      if (!w) return '<div class="inventory-item empty">空槽</div>';
      const def = WEAPONS[w.id];
      const merge = w.tier < 4 && run.weapons.some(other => other !== w && other.id === w.id && other.tier === w.tier);
      return `<div class="inventory-item"><strong>${def.icon} ${def.name} ${'ⅠⅡⅢⅣ'[w.tier - 1]}</strong><div class="item-actions">${merge ? `<button type="button" data-merge="${i}">合成</button>` : ''}<button type="button" data-sell="${i}">卖 ◇${sellPrice(w)}</button></div></div>`;
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
      return w ? `<span class="weapon-slot" title="${WEAPONS[w.id].name} ${w.tier} 阶">${WEAPONS[w.id].icon}<small>${'ⅠⅡⅢⅣ'[w.tier - 1]}</small></span>` : '<span class="weapon-slot empty">+</span>';
    }).join('');
  }
  function buyOffer(index) {
    const offer = run.shopOffers[index];
    if (!offer || run.money < offer.cost) return;
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
    renderShop(); renderWeaponStrip(); tone(770, .09, 'triangle', .04);
    focusShopControl(`#shop-offers [data-buy="${(index + 1) % 4}"]`);
  }
  function mergeWeapon(index) {
    const first = run.weapons[index];
    if (!first || first.tier >= 4) return;
    const secondIndex = run.weapons.findIndex((w, i) => i !== index && w.id === first.id && w.tier === first.tier);
    if (secondIndex < 0) return;
    first.tier += 1; first.cool = 0;
    run.weapons.splice(secondIndex, 1);
    renderShop(); renderWeaponStrip(); showToast(`${WEAPONS[first.id].name}合成为 ${first.tier} 阶`); tone(830, .17, 'triangle', .06);
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
    renderShop(); tone(480, .1, 'square', .02);
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
  function spawnEnemy(id, x, y, small = false) {
    const def = ENEMIES[id];
    if (x === undefined) {
      const p = run.player;
      const angle = rand(0, TAU);
      const radius = Math.max(viewW, viewH) * .58 + rand(100, 210);
      x = clamp(p.x + Math.cos(angle) * radius, 45, WORLD.w - 45);
      y = clamp(p.y + Math.sin(angle) * radius, 45, WORLD.h - 45);
    }
    const healthScale = (1 + (run.wave - 1) * .19) * run.difficulty.mult;
    const hp = Math.round(def.hp * healthScale * (small ? .45 : 1));
    run.enemies.push({ id, x, y, hp, maxHp: hp, r: def.radius * (small ? .7 : 1), speed: def.speed * (1 + run.wave * .008), damage: def.damage, value: small ? 0 : def.value,
      attackClock: rand(.6, 2.1), chargeClock: rand(1.5, 3.5), charging: 0, chargeX: 0, chargeY: 0, burn: 0, burnClock: 0, hitFlash: 0, dead: false, hitBy: new Map() });
  }
  function spawnWaveEnemies(dt) {
    if (run.timeLeft <= 0) return;
    run.spawnClock -= dt;
    const interval = Math.max(.42, 1.35 - run.wave * .045);
    if (run.spawnClock <= 0) {
      run.spawnClock += interval;
      if (run.enemies.length < 95) {
        const count = Math.min(4, 1 + Math.floor(run.wave / 6));
        const pool = enemyPool();
        for (let i = 0; i < count; i++) spawnEnemy(pick(pool));
      }
    }
    if (!run.specialSpawned && run.elapsed > Math.min(7, waveDuration() * .3)) {
      run.specialSpawned = true;
      if (run.wave === 10 || run.wave === 20) {
        spawnEnemy('boss'); run.bossFight = true;
        showToast('警告：星核吞噬者接近！'); tone(190, .4, 'sawtooth', .07);
      } else if (run.wave % 5 === 0) {
        spawnEnemy('elite'); showToast('精英哨卫出现！'); tone(230, .28, 'sawtooth', .06);
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
    if (length > .05) moveTarget = null;
    else if (moveTarget && run) {
      const dx = moveTarget.x - run.player.x, dy = moveTarget.y - run.player.y;
      const remaining = Math.hypot(dx, dy);
      if (remaining <= 3) { moveTarget = null; return { x: 0, y: 0 }; }
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
    moveTarget = null;
    run.player.dashTime = .18;
    run.player.dashCooldown = 4.2;
    run.player.invuln = Math.max(run.player.invuln, .25);
    run.effects.push({ kind: 'pulse', x: run.player.x, y: run.player.y, r: 32, color: '#b5f6eb', life: .3, maxLife: .3 });
    updateHUD();
    tone(330, .08, 'triangle', .035);
  }
  function segmentDistance(e, x1, y1, x2, y2) {
    const dx = x2 - x1, dy = y2 - y1;
    const t = clamp(((e.x - x1) * dx + (e.y - y1) * dy) / (dx * dx + dy * dy || 1), 0, 1);
    return Math.hypot(e.x - x1 - dx * t, e.y - y1 - dy * t);
  }
  function dealSkillDamage(e, amount) { damageEnemy(e, amount * (1 + run.stats.damage / 100), false); }
  function tryActiveSkill() {
    if (phase !== 'combat' || run.skills.activeCooldown > 0) return;
    const p = run.player, s = run.skills;
    if (run.character.id === 'rover') {
      const range = Math.max(0, ...run.weapons.filter(w => WEAPONS[w.id].type === 'ranged').map(w => WEAPONS[w.id].range));
      const target = run.enemies.filter(e => !e.dead && distance(e, p) <= range).sort((a, b) => distance(b, p) - distance(a, p))[0];
      if (!target) { showToast('射程内没有可标定目标'); return; }
      s.mark = { target, time: 5 };
      s.activeCooldown = 12;
      run.effects.push({ kind: 'text', x: target.x, y: target.y - target.r - 15, text: '已标定', color: '#b5f6eb', life: .8, maxLife: .8 });
    } else if (run.character.id === 'bulwark') {
      const v = movementVector(), nearest = run.enemies.filter(e => !e.dead).sort((a, b) => distance(a, p) - distance(b, p))[0];
      const angle = Math.hypot(v.x, v.y) > .05 ? Math.atan2(v.y, v.x) : nearest ? Math.atan2(nearest.y - p.y, nearest.x - p.x) : p.facing;
      const x = p.x, y = p.y;
      p.x = clamp(x + Math.cos(angle) * 100, p.radius, WORLD.w - p.radius);
      p.y = clamp(y + Math.sin(angle) * 100, p.radius, WORLD.h - p.radius);
      p.facing = angle; moveTarget = null;
      for (const e of run.enemies) if (!e.dead && segmentDistance(e, x, y, p.x, p.y) < e.r + 38) dealSkillDamage(e, 16 + run.stats.melee);
      run.effects.push({ kind: 'line', x1: x, y1: y, x2: p.x, y2: p.y, color: '#ffcd91', life: .23, maxLife: .23, width: 22 });
      s.activeCooldown = 9;
    } else if (run.character.id === 'scavenger') {
      s.magnetTime = 4;
      s.activeCooldown = 12;
      run.effects.push({ kind: 'pulse', x: p.x, y: p.y, r: 255 + run.stats.pickup, color: '#ffe4a0', life: .4, maxLife: .4 });
    } else {
      s.field = { x: p.x, y: p.y, time: 4, tick: 0 };
      s.activeCooldown = 10;
      run.effects.push({ kind: 'pulse', x: p.x, y: p.y, r: 115, color: '#b5b4ff', life: .4, maxLife: .4 });
    }
    updateHUD();
    tone(610, .14, 'triangle', .045);
  }
  function addCharge() {
    const s = run.skills;
    s.charge += 1;
    if (s.charge >= 10) {
      s.charge = 0;
      s.overload = { age: 0, hit: new Set(), first: false, second: false };
      showToast('过载边界！');
    }
  }
  function countScavengedMaterial() {
    const s = run.skills;
    s.manualPickups += 1;
    if (s.manualPickups % 8 === 0) { run.money += 2; run.earned += 2; showToast('拾荒分红：材料 +2'); }
    if (s.manualPickups % 12 === 0) { s.shieldTime = 8; showToast('废件护层就绪'); }
    if (s.manualPickups >= 18 && !s.loadedUsed) { s.loadedUsed = true; s.loadedTime = 6; showToast('满载运转！'); }
  }
  function updateSkills(dt) {
    const s = run.skills, p = run.player;
    s.activeCooldown = Math.max(0, s.activeCooldown - dt);
    s.guardCooldown = Math.max(0, s.guardCooldown - dt);
    s.counterCooldown = Math.max(0, s.counterCooldown - dt);
    s.returnCooldown = Math.max(0, s.returnCooldown - dt);
    s.shieldTime = Math.max(0, s.shieldTime - dt);
    s.loadedTime = Math.max(0, s.loadedTime - dt);
    s.magnetTime = Math.max(0, (s.magnetTime || 0) - dt);
    if (s.mark) { s.mark.time -= dt; if (s.mark.time <= 0 || s.mark.target.dead) s.mark = null; }
    if (run.character.id === 'rover') {
      s.moveTime = run.movedThisFrame ? Math.min(1, s.moveTime + dt) : 0;
      if (s.moveTime >= 1) s.steadyReady = true;
    } else if (run.character.id === 'bulwark') {
      const nearby = run.enemies.filter(e => !e.dead && distance(e, p) <= 160).length;
      s.guardTime = nearby >= 3 && s.guardCooldown <= 0 ? s.guardTime + dt : 0;
      if (s.guardTime >= 1) { s.guardReady = true; s.guardTime = 0; }
    } else if (run.character.id === 'conductor') {
      if (s.field) {
        s.field.time -= dt; s.field.tick += dt;
        while (s.field.tick >= .5 && s.field.time > -.5) {
          s.field.tick -= .5;
          let hit = false;
          for (const e of run.enemies) if (!e.dead && distance(e, s.field) <= 115 + e.r) { dealSkillDamage(e, 3 + run.stats.elemental * .4); hit = true; }
          if (hit) addCharge();
          run.effects.push({ kind: 'pulse', x: s.field.x, y: s.field.y, r: 115, color: '#b5b4ff', life: .22, maxLife: .22 });
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
        if (burst.age >= .24 && !burst.second) { burst.second = true; run.effects.push({ kind: 'pulse', x: p.x, y: p.y, r: 220, color: '#c6b8ff', life: .42, maxLife: .42 }); }
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
    p.x = clamp(p.x + vx * step, p.radius, WORLD.w - p.radius);
    p.y = clamp(p.y + vy * step, p.radius, WORLD.h - p.radius);
    run.movedThisFrame = Math.hypot(p.x - oldX, p.y - oldY) > .1;
    if (!dashing && v.remaining !== undefined && v.remaining <= step + 3) moveTarget = null;
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
    if (run.character.id === 'bulwark' && s.guardReady) {
      damage = Math.max(1, Math.round(damage * .75));
      s.guardReady = false; s.guardCooldown = 5;
    }
    if (run.character.id === 'scavenger' && s.shieldTime > 0) { damage = Math.max(1, damage - 3); s.shieldTime = 0; }
    if (run.character.id === 'conductor' && s.charge >= 3 && s.returnCooldown <= 0) {
      s.charge -= 3; s.returnCooldown = 5;
      damage = Math.max(1, Math.round(damage * .7));
      const target = run.enemies.filter(e => !e.dead && distance(e, p) <= 160).sort((a, b) => distance(a, p) - distance(b, p))[0];
      if (target) { dealSkillDamage(target, 6 + run.stats.elemental * .5); run.effects.push({ kind: 'line', x1: p.x, y1: p.y, x2: target.x, y2: target.y, color: '#b5b4ff', life: .2, maxLife: .2, width: 3 }); }
    }
    const actualDamage = Math.min(p.hp, damage);
    p.hp -= damage;
    if (run.character.id === 'bulwark') {
      s.damageTaken += actualDamage;
      if (s.damageTaken >= 15 && s.counterCooldown <= 0 && p.hp > 0) {
        s.damageTaken = 0; s.counterCooldown = 6;
        for (const e of run.enemies) if (!e.dead && distance(e, p) <= 155 + e.r) {
          dealSkillDamage(e, 12 + run.stats.melee);
          if (!e.dead && e.id !== 'boss' && e.id !== 'elite') {
            const angle = Math.atan2(e.y - p.y, e.x - p.x);
            e.x = clamp(e.x + Math.cos(angle) * 65, e.r, WORLD.w - e.r);
            e.y = clamp(e.y + Math.sin(angle) * 65, e.r, WORLD.h - e.r);
          }
        }
        run.effects.push({ kind: 'pulse', x: p.x, y: p.y, r: 155, color: '#ffcd91', life: .35, maxLife: .35 });
      }
    }
    p.invuln = .55;
    run.screenShake = 9;
    run.effects.push({ kind: 'text', x: p.x, y: p.y - 23, text: `-${damage}`, color: '#ff777a', life: .65, maxLife: .65 });
    tone(150, .13, 'sawtooth', .06);
    if (p.hp <= 0) { p.hp = 0; endRun(false); }
  }
  function updateEnemies(dt) {
    const p = run.player;
    for (const e of run.enemies) {
      if (e.dead) continue;
      const dx = p.x - e.x, dy = p.y - e.y;
      const dist = Math.max(1, Math.hypot(dx, dy));
      let ux = dx / dist, uy = dy / dist;
      e.hitFlash = Math.max(0, e.hitFlash - dt);
      e.attackClock -= dt; e.chargeClock -= dt;
      if (e.burn > 0) {
        e.burn -= dt; e.burnClock -= dt;
        if (e.burnClock <= 0) { e.burnClock = .5; dealSkillDamage(e, 2 + run.stats.elemental * .2); }
      }
      if (run.pendingVictory) break;
      if (e.dead) continue;
      let speed = e.speed;
      if (e.id === 'shooter') {
        if (dist < 270) { ux = -ux; uy = -uy; }
        else if (dist < 370) { ux = 0; uy = 0; }
        if (e.attackClock <= 0 && dist < 650) {
          shootEnemyBullet(e.x, e.y, dx / dist, dy / dist, e.damage, 235);
          e.attackClock = 2.1 / (1 + run.wave * .015);
        }
      } else if (e.id === 'charger' || e.id === 'elite') {
        if (e.charging > 0) { e.charging -= dt; ux = e.chargeX; uy = e.chargeY; speed *= e.id === 'elite' ? 3.1 : 3.7; }
        else if (e.chargeClock <= 0 && dist < 480) {
          e.charging = .65; e.chargeClock = e.id === 'elite' ? 3.5 : 3;
          e.chargeX = ux; e.chargeY = uy;
          run.effects.push({ kind: 'line', x1: e.x, y1: e.y, x2: e.x + ux * 160, y2: e.y + uy * 160, color: '#ff9c71', life: .35, maxLife: .35, width: 8 });
        }
      } else if (e.id === 'boss') {
        if (dist < 200) speed *= .5;
        if (e.attackClock <= 0 && dist < 820) {
          const count = 12;
          for (let i = 0; i < count; i++) {
            const angle = i * TAU / count + run.elapsed * .25;
            shootEnemyBullet(e.x, e.y, Math.cos(angle), Math.sin(angle), e.damage * .55, 215);
          }
          e.attackClock = 2.7;
          run.effects.push({ kind: 'pulse', x: e.x, y: e.y, r: 78, color: '#f3a5c9', life: .4, maxLife: .4 });
          tone(170, .18, 'sawtooth', .04);
        }
      }
      e.x = clamp(e.x + ux * speed * dt, e.r, WORLD.w - e.r);
      e.y = clamp(e.y + uy * speed * dt, e.r, WORLD.h - e.r);
      if (distance(e, p) < e.r + p.radius - 2) hurtPlayer(e.damage);
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
      b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
      if (b.life <= 0 || b.x < 0 || b.y < 0 || b.x > WORLD.w || b.y > WORLD.h) { run.enemyBullets.splice(i, 1); continue; }
      if (distance(b, run.player) < b.r + run.player.radius) { hurtPlayer(b.damage); run.enemyBullets.splice(i, 1); }
    }
  }
  function dropPickup(x, y, count) {
    for (let i = 0; i < count && run.pickups.length < 450; i++) {
      run.pickups.push({ kind: 'material', x: clamp(x + rand(-23, 23), 12, WORLD.w - 12), y: clamp(y + rand(-23, 23), 12, WORLD.h - 12), r: 5, drift: rand(0, TAU) });
    }
  }
  function dropChest(x, y) {
    run.pickups.push({ kind: 'chest', x: clamp(x, 12, WORLD.w - 12), y: clamp(y, 12, WORLD.h - 12), r: 12, drift: rand(0, TAU) });
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
    if (steady) { s.steadyReady = false; s.moveTime = 0; }
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
        item.x += (p.x - item.x) / d * speed * dt;
        item.y += (p.y - item.y) / d * speed * dt;
      }
      if (d < p.radius + item.r + 3) {
        if (item.kind === 'chest') {
          const before = p.hp;
          heal(Math.max(4, Math.round(p.maxHp * CHEST_HEAL_RATE)));
          run.pendingChests += 1;
          const recovered = Math.round(p.hp - before);
          showToast(`宝箱待结算开启；${recovered ? `生命 +${recovered}` : '生命已满'}`);
          if (recovered) run.effects.push({ kind: 'text', x: p.x, y: p.y - 24, text: `+${recovered}`, color: '#ffe4a0', life: .7, maxLife: .7 });
          tone(720, .12, 'triangle', .045);
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
            life: 1.25, damage: hit.damage * .5, r: 5, color: '#b5f6eb', pierce: 1, explosion: 0, hit: new Set(), skill: true, homing: target });
        }
        showToast('星点合围！');
      }
    } else if (run.character.id === 'conductor' && hit.type === 'elemental') addCharge();
  }
  function getTarget(range, type) {
    const p = run.player;
    let candidates = run.enemies.filter(e => !e.dead && distance(e, p) <= range);
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
      r: w.id === 'spore' ? 9 : w.id === 'rail' ? 5 : 4, color: def.color,
      pierce: options.pierce || def.pierce || 1, explosion: options.skill ? 0 : def.explosion ? def.explosion * (1 + .15 * (w.tier - 1)) : 0,
      hit: new Set(), skill: !!options.skill, attackId: options.attackId, type: def.type, range: def.range, baseDamage: damage });
  }
  function fireWeapon(w) {
    const def = WEAPONS[w.id];
    if (w.id === 'drone') return;
    const p = run.player;
    const target = getTarget(def.range, def.type);
    if (!target) return;
    w.cool = Math.max(.09, def.cooldown * Math.pow(.95, w.tier - 1) / (1 + attackSpeed() / 100));
    const angle = Math.atan2(target.y - p.y, target.x - p.x);
    const damage = weaponDamage(w);
    const attackId = ++run.attackSeq;
    const hit = { attackId, type: def.type, range: def.range, damage };
    if (w.id === 'blade' || w.id === 'ember') {
      const halfArc = w.id === 'blade' ? .9 : .5;
      for (const e of run.enemies) {
        if (e.dead || distance(e, p) > def.range + e.r) continue;
        const relative = Math.atan2(Math.sin(Math.atan2(e.y - p.y, e.x - p.x) - angle), Math.cos(Math.atan2(e.y - p.y, e.x - p.x) - angle));
        if (Math.abs(relative) < halfArc) { damageEnemy(e, damage, true, hit); if (w.id === 'ember') { e.burn = 2; e.burnClock = .4; } }
      }
      run.effects.push({ kind: 'arc', x: p.x, y: p.y, r: def.range, angle, arc: halfArc, color: def.color, life: w.id === 'blade' ? .18 : .13, maxLife: .18 });
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
        addShot(p.x, p.y, angle, w, damage * .6, { skill: true, pierce: 3 });
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
      }
    }
    if (Math.random() < .24) tone(w.id === 'rail' ? 440 : 590, .04, 'triangle', .012);
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
          w.cool = Math.max(.13, WEAPONS.drone.cooldown / (1 + attackSpeed() / 100));
        }
      } else if (w.cool <= 0) fireWeapon(w);
    }
  }
  function explode(b) {
    run.effects.push({ kind: 'pulse', x: b.x, y: b.y, r: b.explosion, color: '#c2e88c', life: .33, maxLife: .33 });
    for (const e of run.enemies) if (!e.dead && distance(e, b) < b.explosion + e.r) damageEnemy(e, b.damage, true, { attackId: b.attackId, type: b.type, range: b.range, damage: b.baseDamage });
    tone(180, .1, 'sawtooth', .025);
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
      const lengthSq = dx * dx + dy * dy;
      for (const e of run.enemies) {
        if (e.dead || b.hit.has(e)) continue;
        const t = lengthSq ? clamp(((e.x - fromX) * dx + (e.y - fromY) * dy) / lengthSq, 0, 1) : 0;
        const hitX = fromX + dx * t, hitY = fromY + dy * t;
        const radius = b.r + e.r;
        if ((hitX - e.x) ** 2 + (hitY - e.y) ** 2 >= radius * radius) continue;
        b.hit.add(e);
        if (b.explosion) { b.x = hitX; b.y = hitY; explode(b); remove = true; break; }
        damageEnemy(e, b.damage, !b.skill, b.skill ? null : { attackId: b.attackId, type: b.type, range: b.range, damage: b.baseDamage });
        b.pierce -= 1;
        if (b.pierce <= 0) { remove = true; break; }
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
      run.hazards.push({ x: clamp(run.player.x + Math.cos(angle) * offset, 80, WORLD.w - 80), y: clamp(run.player.y + Math.sin(angle) * offset, 80, WORLD.h - 80), r: rand(60, 85), life: 3, hit: false });
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
    if (id === 'bulwark') return [null, s.guardReady ? '防护就绪' : s.guardCooldown > 0 ? `${s.guardCooldown.toFixed(1)} 秒` : `${s.guardTime.toFixed(1)} / 1 秒`, `${s.meleeFires % 5} / 5 次攻击`, `${s.damageTaken} / 15 承伤`][index];
    if (id === 'scavenger') return [null, `${s.manualPickups % 8} / 8 材料`, s.shieldTime > 0 ? `防护 ${s.shieldTime.toFixed(1)} 秒` : `${s.manualPickups % 12} / 12 材料`, s.loadedTime > 0 ? `强化 ${s.loadedTime.toFixed(1)} 秒` : s.loadedUsed ? '本波已触发' : `${s.manualPickups} / 18 材料`][index];
    return [null, `${s.charge} / 10 电荷`, s.returnCooldown > 0 ? `${s.returnCooldown.toFixed(1)} 秒` : '受击触发', s.overload ? '脉冲释放中' : `${s.charge} / 10 电荷`][index];
  }
  function renderSkillStrip() {
    const skills = SKILLS[run.character.id];
    $('skill-strip').innerHTML = skills.map((skill, i) => `<div class="skill-slot ${i === 0 && run.skills.activeCooldown <= 0 ? 'is-ready' : i === 0 ? 'is-cooling' : ''}" title="${skill.desc}"><strong>${skill.name}</strong><span>${skillStatus(i)}</span></div>`).join('');
    $('skill-button').disabled = run.skills.activeCooldown > 0;
    $('skill-button').innerHTML = `${skills[0].name}<small>Q${run.skills.activeCooldown > 0 ? ` · ${run.skills.activeCooldown.toFixed(1)}` : ''}</small>`;
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
    $('pause-skills').innerHTML = SKILLS[run.character.id].map((skill, i) => `<div class="pause-skill"><strong>${skill.name}</strong><span>${skill.desc} ${i === 0 ? `当前：${skillStatus(i)}` : ''}</span></div>`).join('');
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
  function drawHazards(cam) {
    for (const h of run.hazards) {
      if (!visible(h, cam, h.r)) continue;
      const active = h.life < 1.5;
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
        ctx.fillStyle = '#6d4738'; ctx.strokeStyle = '#ffe2a0'; ctx.lineWidth = 2;
        ctx.fillRect(item.x - 11, item.y - 8, 22, 18); ctx.strokeRect(item.x - 11, item.y - 8, 22, 18);
        ctx.fillStyle = '#f6c76e'; ctx.fillRect(item.x - 12, item.y - 10, 24, 6);
        ctx.fillStyle = '#fff5d8'; ctx.fillRect(item.x - 2, item.y - 4, 4, 10); ctx.fillRect(item.x - 5, item.y - 1, 10, 4);
        ctx.restore();
        continue;
      }
      ctx.fillStyle = '#b8f9d1'; ctx.globalAlpha = glow;
      ctx.beginPath(); ctx.moveTo(item.x, item.y - 6); ctx.lineTo(item.x + 5, item.y); ctx.lineTo(item.x, item.y + 6); ctx.lineTo(item.x - 5, item.y); ctx.closePath(); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function drawEnemy(e) {
    const def = ENEMIES[e.id];
    ctx.save(); ctx.translate(e.x, e.y);
    ctx.rotate(Math.atan2(run.player.y - e.y, run.player.x - e.x));
    ctx.fillStyle = '#0007'; ctx.beginPath(); ctx.ellipse(2, e.r * .75, e.r * .95, e.r * .48, 0, 0, TAU); ctx.fill();
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
    ctx.restore();
    if (e.hp < e.maxHp || e.id === 'boss' || e.id === 'elite') {
      const width = e.r * 2.2;
      ctx.fillStyle = '#07131be0'; ctx.fillRect(e.x - width / 2, e.y - e.r - 12, width, 5);
      ctx.fillStyle = e.id === 'boss' ? '#f3a5c9' : '#ffd07c'; ctx.fillRect(e.x - width / 2, e.y - e.r - 12, width * Math.max(0, e.hp / e.maxHp), 5);
    }
  }
  function drawPlayer() {
    const p = run.player;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.facing);
    if (p.invuln > 0 && Math.floor(ambientTime * 18) % 2 === 0) ctx.globalAlpha = .55;
    ctx.fillStyle = '#0008'; ctx.beginPath(); ctx.ellipse(2, 15, 18, 8, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = run.character.id === 'conductor' ? '#b6aef0' : run.character.id === 'bulwark' ? '#b0c3c0' : run.character.id === 'scavenger' ? '#ddb88b' : '#90d9c6';
    ctx.strokeStyle = '#132931'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, p.radius, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#223a45'; ctx.beginPath(); ctx.ellipse(5, 0, 10, 11, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#fff4cf'; ctx.fillRect(5, -8, 9, 5); ctx.fillRect(5, 3, 9, 5);
    ctx.fillStyle = '#f7b96e'; ctx.beginPath(); ctx.arc(-7, -12, 5, 0, TAU); ctx.fill();
    ctx.restore();
    if (run.aimTarget) {
      ctx.strokeStyle = '#ffe69c'; ctx.globalAlpha = Math.min(1, run.aimTarget.life);
      ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(run.aimTarget.x, run.aimTarget.y, 17, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(run.aimTarget.x - 24, run.aimTarget.y); ctx.lineTo(run.aimTarget.x - 11, run.aimTarget.y); ctx.moveTo(run.aimTarget.x + 11, run.aimTarget.y); ctx.lineTo(run.aimTarget.x + 24, run.aimTarget.y); ctx.stroke(); ctx.globalAlpha = 1;
    }
    if (moveTarget) {
      ctx.strokeStyle = '#91f5cf'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(moveTarget.x, moveTarget.y, 13, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(moveTarget.x, moveTarget.y, 3, 0, TAU); ctx.stroke();
    }
  }
  function drawWeapons(cam) {
    for (const b of run.bullets) {
      if (!visible(b, cam)) continue;
      ctx.fillStyle = b.color; ctx.shadowColor = b.color; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, TAU); ctx.fill();
    }
    ctx.shadowBlur = 0;
    const drones = run.weapons.filter(w => w.id === 'drone');
    for (let i = 0; i < drones.length; i++) {
      const angle = run.totalTime * 2.8 + i * TAU / drones.length;
      const x = run.player.x + Math.cos(angle) * 87, y = run.player.y + Math.sin(angle) * 87;
      ctx.fillStyle = '#8ef0d6'; ctx.strokeStyle = '#13343a'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x, y, 14, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x + 3, y - 2, 4, 0, TAU); ctx.fill();
    }
  }
  function drawEffects(cam) {
    for (const fx of run.effects) {
      if (!visible(fx, cam, fx.r || 30)) continue;
      ctx.globalAlpha = clamp(fx.life / fx.maxLife, 0, 1);
      ctx.strokeStyle = fx.color; ctx.fillStyle = fx.color;
      if (fx.kind === 'pulse') { ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(fx.x, fx.y, fx.r * (1.15 - fx.life / fx.maxLife * .35), 0, TAU); ctx.stroke(); }
      else if (fx.kind === 'line') { ctx.lineWidth = fx.width || 3; ctx.beginPath(); ctx.moveTo(fx.x1, fx.y1); ctx.lineTo(fx.x2, fx.y2); ctx.stroke(); }
      else if (fx.kind === 'arc') { ctx.lineWidth = fx.angle ? 14 : 8; ctx.beginPath(); ctx.arc(fx.x, fx.y, fx.r, fx.angle - fx.arc, fx.angle + fx.arc); ctx.stroke(); }
      else if (fx.kind === 'text') { ctx.font = 'bold 18px system-ui'; ctx.textAlign = 'center'; ctx.fillText(fx.text, fx.x, fx.y - (1 - fx.life / fx.maxLife) * 24); }
    }
    ctx.globalAlpha = 1;
  }
  function drawSkillAreas() {
    const s = run.skills;
    if (s.field) {
      ctx.fillStyle = '#b5b4ff'; ctx.strokeStyle = '#d5cfff'; ctx.lineWidth = 2; ctx.globalAlpha = .12;
      ctx.beginPath(); ctx.arc(s.field.x, s.field.y, 115, 0, TAU); ctx.fill();
      ctx.globalAlpha = .55; ctx.stroke(); ctx.globalAlpha = 1;
    }
    if (s.mark && !s.mark.target.dead) {
      ctx.strokeStyle = '#b5f6eb'; ctx.lineWidth = 3; ctx.globalAlpha = .65 + .25 * Math.sin(ambientTime * 10);
      ctx.beginPath(); ctx.arc(s.mark.target.x, s.mark.target.y, s.mark.target.r + 12, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1;
    }
    if (s.shieldTime > 0 || s.guardReady) {
      ctx.strokeStyle = s.guardReady ? '#ffcd91' : '#ffe4a0'; ctx.lineWidth = 3; ctx.globalAlpha = .8;
      ctx.beginPath(); ctx.arc(run.player.x, run.player.y, run.player.radius + 8, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1;
    }
  }
  function drawCombat() {
    const cam = camera();
    ctx.save();
    if (run.screenShake > 0 && phase === 'combat') ctx.translate(rand(-run.screenShake, run.screenShake), rand(-run.screenShake, run.screenShake));
    ctx.translate(-cam.x, -cam.y);
    drawBackdrop(cam); drawHazards(cam); drawPickups(cam);
    for (const b of run.enemyBullets) {
      if (!visible(b, cam)) continue;
      ctx.fillStyle = '#ff8da8'; ctx.shadowColor = '#ff8da8'; ctx.shadowBlur = 9;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, TAU); ctx.fill();
    }
    ctx.shadowBlur = 0;
    for (const e of run.enemies) if (visible(e, cam, e.r + 20)) drawEnemy(e);
    drawWeapons(cam); drawPlayer(); drawSkillAreas(); drawEffects(cam);
    ctx.restore();
  }
  function drawTitleScene() {
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
    canvas.width = Math.round(viewW * dpr); canvas.height = Math.round(viewH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function loop(now) {
    const dt = Math.min(.05, (now - (lastFrame || now)) / 1000);
    lastFrame = now; ambientTime += dt;
    if (phase === 'combat' && run) updateCombat(dt);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, viewW, viewH);
    if (run && phase !== 'title') drawCombat(); else drawTitleScene();
    requestAnimationFrame(loop);
  }

  function pause() {
    if (phase !== 'combat') return;
    previousPhase = phase; showPhase('pause'); keys.clear(); resetStick();
    clearTimeout(toastTimer); $('toast').classList.remove('show');
    renderPauseDetails();
    $('resume-button').focus({ preventScroll: true });
  }
  function resume() { if (phase === 'pause') { showPhase(previousPhase); $('pause-button').focus({ preventScroll: true }); } }
  function goTitle() { run = null; keys.clear(); resetStick(); showPhase('title'); renderTitle(); $('start-button').focus({ preventScroll: true }); }
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
    $('sound-button').addEventListener('click', () => { soundEnabled = !soundEnabled; persist(); renderTitle(); refocus('#sound-button'); if (soundEnabled) tone(660, .1); });
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
      applyBonus(choice.bonus); run.pendingLevels -= 1; tone(790, .14, 'triangle', .04);
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
    $('next-wave-button').addEventListener('click', startWave);
    $('chest-take-button').addEventListener('click', () => resolveChest(true));
    $('chest-scrap-button').addEventListener('click', () => resolveChest(false));
    window.addEventListener('keydown', event => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key === 'Escape') { if (phase === 'combat') pause(); else if (phase === 'pause') resume(); return; }
      if (phase !== 'combat') return;
      if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'q'].includes(key)) event.preventDefault();
      if (key === ' ') { if (!event.repeat) tryDash(); return; }
      if (key === 'q') { if (!event.repeat) tryActiveSkill(); return; }
      keys.add(key);
    });
    window.addEventListener('keyup', event => { keys.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key); });
    window.addEventListener('blur', () => { keys.clear(); if (phase === 'combat') pause(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden && phase === 'combat') pause(); });
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
        moveTarget = { x: clamp(x, run.player.radius, WORLD.w - run.player.radius), y: clamp(y, run.player.radius, WORLD.h - run.player.radius) };
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
