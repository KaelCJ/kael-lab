import { createStudioRuntime } from './studio-runtime.js?v=20261014-tb1';
import { createFireRenderer } from './effects/fire.js';
import { WORLD, BIOMES, buildTerrain, SCENERY_COLORS } from './maps.js';
import { CHARACTERS, BASE_ATTACKS, TB_DEMON_ATTACK, ACTIVE_SKILL_CONFIG, HERO_TEXT, KAEL_SPELLS } from './heroes.js?v=20261015-kael1';
import { createTerrorbladeState, updateTerrorblade, registerTerrorbladeHit } from './terrorblade.js?v=20261014-tb1';
import { BUFFS, BUFF_IDS, buffRarityChances, randomBuff, resetBuffWave, absorbBuffDamage, buffAttackSpeed, buffMoveSpeed, buffAuraSlow, buffPhysicalAmp } from './buffs.js?v=20261013-deadshot1';
import { EQUIPMENT, EQUIPMENT_CAPACITY, EQUIPMENT_UPGRADES, equipmentLevel, resolveEquipment, equipmentUpgradeDescription, equipmentUpgradeIndices, equipmentResale } from './equipment.js?v=20261026-restore1';
import { planEquipmentCraft, availableEquipmentCrafts } from './equipment-crafting.js?v=20261026-restore1';
import { acquisition, craft as craftLoadout, upgrade as upgradeLoadout, move as moveLoadout, automate } from './equipment-loadout.js?v=20261026-restore1';
import { equipmentBuilds, resolveBuilds, buildName, buildDescription } from './equipment-builds.js?v=20261026-restore1';
import { createEquipmentCombat } from './equipment-combat.js?v=20261026-restore1';
import { heroGrowthTier, drawHeroGrowthAreas, drawHeroGrowthEffect, drawHeroGrowthProjectile, drawHeroGrowthKaelBody } from './effects/hero-growth.js?v=20261026-restore1';
import { drawWeaponStrike, drawBuildFeedback } from './effects/weapon-builds.js?v=20261026-restore1';
import { createWindRenderer } from './effects/wind.js';
import { createMeteorRenderer } from './effects/meteor.js';
import { drawEvolutionEquipment, drawEvolutionCleave, drawDagonFork, drawMirrorStrike } from './effects/equipment-evolution.js?v=20261017-evolution2';

(() => {
  'use strict';

  const studioMode = new URLSearchParams(location.search).get('studio') === '1';
  let studio = null;

  const $ = id => document.getElementById(id);
  const canvas = $('arena');
  const ctx = canvas.getContext('2d');
  const MAX_WAVES = 20;
  const MODES = [
    { id: 'expedition', name: '远征' },
    { id: 'endless', name: '无尽' }
  ];
  const SALVAGE_RATE = .8;
  const CHEST_HEAL_RATE = .2;
  // Legacy key retained so the DotaRogue rename keeps existing browser records.
  const SAVE_KEY = 'kael-lab-starcore-survivor-v1';
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const ART_PATHS = {
    crawler: './art/crawler.svg',
    'crawler-step': './art/crawler-step.svg', 'crawler-attack': './art/crawler-attack.svg',
    elite: './art/elite.svg', boss: './art/boss.svg',
    roshan: './art/roshan.svg', 'roshan-windup': './art/roshan-windup.svg', 'roshan-attack': './art/roshan-attack.svg',
    blade: './art/blade.svg'
  };

  const UPCOMING_HEROES = [
    { id: 'meepo', names: ['Meepo', 'Meepo', 'Meepo'] },
    { id: 'druid', names: ['德鲁伊', '德魯伊', 'Lone Druid'] },
    { id: 'night-stalker', names: ['夜魔', '夜魔', 'Night Stalker'] },
    { id: 'pom', names: ['POM', 'POM', 'POM'] }
  ];
  // Each river is a centerline with a local radius. The same curve drives both
  // the rounded water silhouette and the capsule collision used by movement.
  const DIFFICULTIES = [
    { id: 'normal', name: '标准', mult: 1, spawnRate: 1, enemyCap: 95, nearbyMin: 3 },
    { id: 'hard', name: '挑战', mult: 1.3, spawnRate: 1.16, enemyCap: 120, nearbyMin: 4 },
    { id: 'nightmare', name: '极限', mult: 1.65, spawnRate: 1.38, enemyCap: 150, nearbyMin: 6 }
  ];
  const PACES = [{ id: 'normal', name: '标准' }, { id: 'quick', name: '速战' }];


  // The attack pose is split into anticipation, contact and recovery. Keep the
  // gameplay hit on the contact frame so the visible weapon motion and damage
  // event arrive together instead of firing as soon as the pose starts.
  const BASE_ATTACK_STRIKE_TIME = .16;
  const EQUIPMENT_IDS = Object.keys(EQUIPMENT);
  const CHARACTER_ATTACKS = Object.fromEntries(CHARACTERS.map(c => [c.id, c.id]));
  const SHOP_OFFER_COUNT = 5;
  function equipmentName(def) {
    const name = selectedLocale === 'en' ? (def.nameEn || def.name) : selectedLocale === 'zh-TW' ? (def.nameTw || def.name) : def.name;
    return EQUIPMENT_UPGRADES[def.id] ? `${name} · Lv.${def.level}` : name;
  }
  function equipmentDesc(def) {
    if (EQUIPMENT_UPGRADES[def.id]) return equipmentUpgradeDescription(def, selectedLocale, true);
    return selectedLocale === 'en' ? (def.descEn || def.desc) : selectedLocale === 'zh-TW' ? (def.descTw || def.desc) : def.desc;
  }
  function buffName(def) { return selectedLocale === 'en' ? (def.nameEn || def.name) : selectedLocale === 'zh-TW' ? (def.nameTw || def.name) : def.name; }
  function buffDesc(def) { return selectedLocale === 'en' ? (def.descEn || def.desc) : selectedLocale === 'zh-TW' ? (def.descTw || def.desc) : def.desc; }
  function buffIcon(def) { return `<img class="buff-icon" src="${def.icon}" alt="" width="34" height="34">`; }
  function buffRarityBadge(def) { return `<span class="buff-rarity">${t(`buffRarity_${def.rarity}`)}</span>`; }
  function equipmentDef(item) { return resolveEquipment(item); }
  function equipmentIcon(id) { return artIcon(`equipment-${id}`, ''); }
  function createEquipment(id, level = 1) { return { id, uid: ++uid, level, procAttackId: 0 }; }

  const SKILLS = Object.fromEntries(CHARACTERS.map(c => [c.id, [{ kind: 'active' }, { kind: 'passive' }]]));
  const KAEL_SPELL_BY_ID = Object.fromEntries(KAEL_SPELLS.map(spell => [spell.id, spell]));
  function kaelSpellName(id) { return KAEL_SPELL_BY_ID[id]?.names[selectedLocale] || id || ''; }
  function kaelSpellDesc(id) { return KAEL_SPELL_BY_ID[id]?.desc[selectedLocale] || ''; }
  const UPGRADE_TEXT = {
    'zh-CN': [['生命成长','最大生命+6，并恢复6生命'],['护甲加固','护甲+2'],['敏捷步伐','移动速度+8%'],['物理攻击','物理攻击+4'],['攻击范围','所有基础攻击范围+24'],['法术成长','法术攻击+4'],['攻击速度','攻击速度+10%'],['致命一击','暴击率+6%'],['拾取范围','拾取范围+30'],['生命回复','每5秒回复1生命'],['闪避','闪避率+5%'],['伤害成长','所有伤害+7%'],['生命窃取','物理普攻吸血+3%'],['幸运','幸运+10'],['暴击伤害','暴击伤害+15%'],['法力回复','每秒回蓝+0.75'],['技能冷却','主动技能冷却缩减+6%']],
    'zh-TW': [['生命成長','最大生命+6，並回復6生命'],['護甲加固','護甲+2'],['敏捷步伐','移動速度+8%'],['物理攻擊','物理攻擊+4'],['攻擊範圍','所有基礎攻擊範圍+24'],['法術成長','法術攻擊+4'],['攻擊速度','攻擊速度+10%'],['致命一擊','暴擊率+6%'],['拾取範圍','拾取範圍+30'],['生命回復','每5秒回復1生命'],['閃避','閃避率+5%'],['傷害成長','所有傷害+7%'],['生命竊取','物理普攻吸血+3%'],['幸運','幸運+10'],['暴擊傷害','暴擊傷害+15%'],['法力回復','每秒回魔+0.75'],['技能冷卻','主動技能冷卻縮減+6%']],
    en: [['Health','Max HP +6 and restore 6 HP'],['Armor','Armor +2'],['Footwork','Move speed +8%'],['Physical Attack','Physical attack +4'],['Attack Range','All basic attack ranges +24'],['Magic Attack','Magic attack +4'],['Attack Speed','Attack speed +10%'],['Critical Chance','Critical chance +6%'],['Pickup Range','Pickup range +30'],['Regeneration','Restore 1 HP per 5 sec'],['Evasion','Evasion +5%'],['Damage Growth','All damage +7%'],['Lifesteal','Physical basic attack lifesteal +3%'],['Luck','Luck +10'],['Critical Damage','Critical damage +15%'],['Mana Regeneration','Restore 0.75 MP per sec'],['Ability Cooldown','Active cooldown reduction +6%']]
  };
  const UPGRADES = [
    { maxHp: 6 }, { armor: 2 }, { speed: 8 }, { attackDamage: 4 }, { attackRange: 24 },
    { elemental: 4 }, { attackSpeed: 10 }, { crit: 6 }, { pickup: 30 }, { regen: 1 },
    { dodge: 5 }, { damage: 7 }, { lifesteal: 3 }, { luck: 10 }, { critDamage: 15 },
    { manaRegen: .75 }, { abilityHaste: 6 }
  ].map((bonus, i) => ({ bonus, icon: ['✚','⬡','»','⚔','◎','ϟ','↻','✧','◇','✿','↝','✦','◉','❖','✧','◇','⌛'][i] }));
  const ENEMIES = {
    crawler: { name: '爬行机', hp: 17, speed: 90, radius: 16, damage: 4, color: '#dd9b79', value: 1 },
    runner: { name: '追猎虫', hp: 13, speed: 155, radius: 13, damage: 3, color: '#e9cb7c', value: 1 },
    tank: { name: '铁甲兽', hp: 63, speed: 59, radius: 25, damage: 7, color: '#93aeb3', value: 3 },
    shooter: { name: '孢射体', hp: 26, speed: 78, radius: 18, damage: 4, color: '#ad9fdb', value: 2 },
    charger: { name: '冲锋残骸', hp: 40, speed: 94, radius: 21, damage: 6, color: '#f39779', value: 2 },
    splitter: { name: '分裂菌团', hp: 32, speed: 74, radius: 20, damage: 5, color: '#b2cf8c', value: 2 },
    elite: { name: '精英哨卫', elite: true, hp: 270, speed: 96, radius: 31, damage: 10, color: '#ffbf79', value: 17 },
    centaur: { name: '半人马可汗', elite: true, hp: 220, speed: 90, radius: 31, damage: 8, color: '#efc17c', value: 17, windup: .8, cooldown: 4.5, reach: 185, area: 115 },
    satyr: { name: '萨特苦难使者', elite: true, hp: 195, speed: 83, radius: 28, damage: 8, color: '#d7a3f5', value: 17, windup: .9, cooldown: 4.2, reach: 600 },
    hellbear: { name: '地狱熊怪粉碎者', elite: true, hp: 255, speed: 80, radius: 34, damage: 9, color: '#ffa77a', value: 17, windup: .95, cooldown: 5.5, reach: 190, area: 125 },
    darkTroll: { name: '黑暗巨魔召唤师', elite: true, hp: 190, speed: 78, radius: 28, damage: 7, color: '#9de4cf', value: 17, windup: 1, cooldown: 6, reach: 560 },
    boss: { name: '远古暴君', hp: 1150, speed: 74, radius: 53, damage: 14, color: '#f3a5c9', value: 40 }
  };
  const BOSS_VARIANTS = {
    roshan: { hp: 1680, speed: 66, radius: 60, damage: 17, color: '#c77b55', value: 55 }
  };
  const BOSS_VARIANT_NAMES = {
    roshan: { 'zh-CN': '肉山（Roshan）', 'zh-TW': '肉山（Roshan）', en: 'Roshan' }
  };
  const ELITE_ROTATION = ['centaur', 'satyr', 'hellbear', 'darkTroll', 'elite'];
  const ELITE_WAVES = [3, 5, 7, 9, 12, 15, 18];
  const isElite = enemy => ENEMIES[enemy.id].elite === true;
  const SUPPORTED_LOCALES = ['zh-CN', 'zh-TW', 'en'];
  const DEFAULT_LOCALE = 'zh-CN';
  const LOCALES = {
    'zh-CN': {
      ui: {
        documentTitle: 'DotaRogue · Kael Lab',
        metaDescription: 'DotaRogue：受 Dota 启发的网页生存肉鸽游戏。桌面与手机横竖屏都能游玩，在 20 波远征或无尽敌潮中移动、自动攻击、升级和购物。',
        canvasAria: 'DotaRogue游戏战场。电脑使用方向键、WASD 或右键点击移动，空格冲刺、Q 施放主动技能；手机使用摇杆和右侧技能、冲刺按钮。攻击自动进行。',
        home: '← 选择游戏', eyebrow: 'KAEL LAB · BROWSER GAME',
        titleLead: '在敌潮中活过 20 波，或进入无尽模式。选择英雄、升级和装备，打造你的构筑。',
        chooseCharacter: '选择驾驶员', chooseBiome: '选择战场', difficulty: '难度', pace: '节奏', visuals: '画面', sound: '音效', language: '语言',
        start: '开始挑战', controls: '电脑：WASD / 方向键移动，右键点击目的地自动前往，Q 主动技能、空格冲刺、Esc 暂停。手机使用摇杆和技能、冲刺按钮。角色自动普攻；主动技能需要蓝量且受冷却限制。',
        levelKicker: '成长选择', levelTitle: '选择一项升级', levelDesc: '每次升级强化一项能力。选择后继续处理剩余等级。',
        shopKicker: '波间补给 · ', shopTitle: '战场补给站', shopCaption: '波末未拾取材料按 80% 折算货币，经验全额保留；商店出售组件，材料齐全后可按固定配方合成，配方不占装备格。', shopEquipment: '装备与属性',
        chestKicker: '波间战利品 · 待开 ', chestTitle: '拾获补给箱', chestDesc: '依次查看宝箱装备，决定收下或拆解。', chestTake: '收下装备', chestScrap: '拆解为材料',
        waveAuto: '自动继续', waveContinue: '继续结算',
        pauseKicker: '远征暂歇', pauseTitle: '已暂停', pauseDesc: '你的远征会在这里等你。', pauseDriver: '当前驾驶员', pauseStats: '属性', pauseSkills: '角色技能', pauseVisual: '画面：{name}', resume: '继续战斗', resumeCountdown: '继续读秒', restart: '重新开始', backTitle: '返回标题',
        resultRestart: '再来一局', resultHome: '返回标题', support: '支持开发', supportNote: '自愿支持，不影响游玩。',
        soundOn: '开启', soundOff: '关闭', skinPixel: '像素风', skinDraft: '初版',
        languageZhCN: '简体中文', languageZhTW: '繁體中文', languageEn: 'English',
        pauseAria: '暂停游戏', pauseTitleAttr: '暂停 (Esc)', skillStripAria: '角色技能', touchAria: '触控操作', joystickAria: '移动摇杆', skillButton: '技能', skillAria: '施放主动技能', skillTitle: '主动技能 (Q)', dash: '冲刺', dashAria: '冲刺', dashTitle: '冲刺 (空格)',
        noScriptTitle: 'DotaRogue', noScript: '这是一款纯前端网页游戏，需要启用 JavaScript 才能游玩。电脑使用 WASD、方向键或鼠标右键移动，Q 主动技能、空格冲刺；手机横竖屏均可使用触控摇杆与右侧按钮。装备按固定组件配方合成，技能同时需要冷却完成和蓝量足够。游戏不需要账号或服务器。',
        skillPreview: '专属技能：{skills}', soundState: '{state}', record: '最佳记录：{best} · 通关 {wins} 次', bestWave: '第 {wave} 波', noRecord: '暂无', wave: '第 {wave} / {max} 波', boss: '首领', level: '等级 {level}', pending: ' · 待选 {count}', hp: '生命 {hp} / {max}', defeated: '击败 {kills}', dashReady: '就绪', dashCooldown: '{time}s',
        finalWaveStart: '最终波次：击败{boss}！', waveStart: '第 {wave} 波开始', expeditionComplete: '远征完成', expeditionEnded: '远征终止', coreCalmed: '战场已清空', reachedWave: '这次抵达第 {wave} 波', victoryMessage: '你撑过了全部 20 波敌潮，成为最后的幸存者。', defeatMessage: '已保存本次记录。调整装备组合，再向更深处出发。',
        completedWaves: '完成波次', earnedMaterials: '获得材料', characterLevel: '角色等级', levelsLeft: '剩余 {count} 次',
        wavePrepare: '波次准备', waveSummary: '本波结算', nextWaveTitle: '下一波：第 {wave} 波', waveDoneTitle: '第 {wave} 波完成', nextWaveMessage: '战场即将重新开放，准备迎接新的敌潮。', lootMessage: '战利品已经记录，接下来处理宝箱、升级和补给。', finalWaveMessage: '最终敌潮已清理，正在整理远征结果。', aboutToStart: '即将开始', currentDifficulty: '难度', waveMaterials: '本波材料', pendingChests: '待开宝箱', currentLevel: '当前等级', startNow: '立即开始', seconds: '{time} 秒', secondsRemaining: '剩余 {time} 秒',
        scrapFor: '拆解为 ◇ {amount}', acquired: '获得{item}', scrapItem: '拆解{item}：材料 +{amount}', autoRecover: '自动回收 {count} 个宝箱，待结算开启；{status}', fullHealth: '生命已满', healthGain: '生命 +{amount}',
        waveComplete: '第 {wave} 波完成', nextWaveHint: '下一波：第 {wave} 波 · 准备完成后进入倒计时', finalWaveDone: '最终波次已完成 · 正在整理远征结果', startWaveButton: '开始第 {wave} 波 ➜', viewResult: '查看远征结果', soldOut: '售罄', buy: '购买', refresh: '刷新商品 ◇ {cost}', emptySlot: '空槽', merge: '合成', sell: '卖 ◇{price}', lock: '锁定', unlock: '解锁', locked: '🔒',
        insufficient: '材料不足', merged: '已合成{item}',
        statLife: '生命', statArmor: '护甲', statMove: '移速', statAttackSpeed: '攻速', statRanged: '远程', statMelee: '近战', statElemental: '元素', statCrit: '暴击', statDodge: '闪避', statRegen: '再生', statLuck: '幸运', statRangedBonus: '远程伤害加值', statMeleeBonus: '近战伤害加值', statSpellBonus: '法术伤害加值', statAllDamage: '全伤害', statCritDamage: '暴击伤害', statLifesteal: '生命窃取', statRegen5: '每 5 秒回血', statPickup: '拾取范围', statBaseAttackRange: '基础攻击射程', current: '当前：{status}',
        warningBoss: '警告：{boss}接近！', eliteAppears: '{elite}出现！', noTarget: '射程内没有可标定目标', marked: '已标定', overload: '过载边界！', salvageBonus: '拾荒分红：材料 +2', shieldReady: '废件护层就绪', loaded: '满载运转！', dodge: '闪避！', chestDrop: '宝箱掉落：拾取回血，结算开装备', bossDefeated: '首领已击败！', roshanEnrage: '肉山进入暴怒！', chestPending: '宝箱待结算开启；{status}', line: '掠线！', hazard: '小心：{hazard}',
        activeReady: 'Q / 就绪', cooldown: '{time} 秒', nextHitReady: '下次命中就绪', moving: '移动 {time} / 1 秒', fires: '{count} / 6 次开火', hits: '{count} / 12 次命中', guardReduce: '周围 3 名敌人 · 减伤 22%', needNearby: '需要 3 名近敌', attacks: '{count} / 5 次攻击', counterReady: '4 名敌人 · 自动就绪', materials: '{count} / {max} 材料', shield: '防护 {time} 秒', strengthened: '强化 {time} 秒', triggered: '本波已触发', charge: '{count} / 10 电荷', autoRelease: '3 层自动释放', pulseReleasing: '脉冲释放中',
        statSummary: '生命 {hp}/{max} · 护甲 {armor} · 移速 {speed}% · 攻速 {attackSpeed}% · 远程 {ranged} · 近战 {melee} · 元素 {elemental} · 暴击 {crit}% · 闪避 {dodge}% · 再生 {regen} · 幸运 {luck}',
        currentSkin: '当前{name}，切换为{next}', switchSkin: '切换为{next}',
      },

      biomes: { docks: ['赤沙废港', '灼热沙尘与失控机械', '热流喷口'], grove: ['荧菌裂谷', '发光菌簇与腐蚀孢雾', '孢雾爆发'], frost: ['蓝霜残骸', '冻结碎片与寒流裂缝', '寒流爆裂'] },
      difficulty: { normal: '标准', hard: '挑战', nightmare: '极限' }, pace: { normal: '标准', quick: '速战' },


      enemies: { crawler: '爬行机', runner: '追猎虫', tank: '铁甲兽', shooter: '孢射体', charger: '冲锋残骸', splitter: '分裂菌团', elite: '精英哨卫', centaur: '半人马可汗', satyr: '萨特苦难使者', hellbear: '地狱熊怪粉碎者', darkTroll: '黑暗巨魔召唤师', boss: '远古暴君' }
    },
    'zh-TW': {
      ui: {
        documentTitle: 'DotaRogue · Kael Lab', metaDescription: 'DotaRogue：受 Dota 啟發的網頁生存肉鴿遊戲。桌面與手機橫豎屏都能遊玩，在 20 波遠征或無盡敵潮中移動、自動攻擊、升級和購物。', canvasAria: 'DotaRogue遊戲戰場。電腦使用方向鍵、WASD 或右鍵點擊移動，空格衝刺、Q 施放主動技能；手機使用搖桿和右側技能、衝刺按鈕。攻擊自動進行。', home: '← 選擇遊戲', eyebrow: 'KAEL LAB · BROWSER GAME', titleLead: '在敵潮中活過 20 波，或進入無盡模式。選擇英雄、升級和裝備，打造你的構築。', chooseCharacter: '選擇駕駛員', chooseBiome: '選擇戰場', difficulty: '難度', pace: '節奏', visuals: '畫面', sound: '音效', language: '語言', start: '開始挑戰', controls: '電腦：WASD / 方向鍵移動，右鍵點擊目的地自動前往，Q 主動技能、空格衝刺、Esc 暫停。手機使用搖桿和技能、衝刺按鈕。角色自動普攻；主動技能需要魔法且受冷卻限制。', levelKicker: '成長選擇', levelTitle: '選擇一項升級', levelDesc: '每次升級強化一項能力。選擇後繼續處理剩餘等級。', shopKicker: '波間補給 · ', shopTitle: '戰場補給站', shopCaption: '波末未拾取材料按 80% 折算貨幣，經驗全額保留；商店出售組件，材料齊全後可按固定配方合成，配方不占裝備格。', shopEquipment: '裝備與屬性', chestKicker: '波間戰利品 · 待開 ', chestTitle: '拾獲補給箱', chestDesc: '依次查看寶箱裝備，決定收下或拆解。', chestTake: '收下裝備', chestScrap: '拆解為材料', waveAuto: '自動繼續', waveContinue: '繼續結算', pauseKicker: '遠征暫歇', pauseTitle: '已暫停', pauseDesc: '你的遠征會在這裡等你。', pauseDriver: '目前駕駛員', pauseStats: '屬性', pauseSkills: '角色技能', pauseVisual: '畫面：{name}', resume: '繼續戰鬥', resumeCountdown: '繼續讀秒', restart: '重新開始', backTitle: '返回標題', resultRestart: '再來一局', resultHome: '返回標題', support: '支持開發', supportNote: '自願支持，不影響遊玩。', soundOn: '開啟', soundOff: '關閉', skinPixel: '像素風', skinDraft: '初版', languageZhCN: '簡體中文', languageZhTW: '繁體中文', languageEn: 'English', pauseAria: '暫停遊戲', pauseTitleAttr: '暫停 (Esc)', skillStripAria: '角色技能', touchAria: '觸控操作', joystickAria: '移動搖桿', skillButton: '技能', skillAria: '施放主動技能', skillTitle: '主動技能 (Q)', dash: '衝刺', dashAria: '衝刺', dashTitle: '衝刺 (空格)', noScriptTitle: 'DotaRogue', noScript: '這是一款純前端網頁遊戲，需要啟用 JavaScript 才能遊玩。電腦使用 WASD、方向鍵或滑鼠右鍵移動，Q 主動技能、空格衝刺；手機橫豎屏均可使用觸控搖桿與右側按鈕。裝備按固定組件配方合成，技能同時需要冷卻完成和魔法足夠。遊戲不需要帳號或伺服器。', skillPreview: '專屬技能：{skills}', soundState: '{state}', record: '最佳紀錄：{best} · 通關 {wins} 次', bestWave: '第 {wave} 波', noRecord: '暫無', wave: '第 {wave} / {max} 波', boss: '首領', level: '等級 {level}', pending: ' · 待選 {count}', hp: '生命 {hp} / {max}', defeated: '擊敗 {kills}', dashReady: '就緒', dashCooldown: '{time}s', finalWaveStart: '最終波次：擊敗{boss}！', waveStart: '第 {wave} 波開始', expeditionComplete: '遠征完成', expeditionEnded: '遠征終止', coreCalmed: '戰場已清空', reachedWave: '這次抵達第 {wave} 波', victoryMessage: '你撐過了全部 20 波敵潮，成為最後的倖存者。', defeatMessage: '已保存本次紀錄。調整裝備組合，再向更深處出發。', completedWaves: '完成波次', earnedMaterials: '獲得材料', characterLevel: '角色等級', levelsLeft: '剩餘 {count} 次', wavePrepare: '波次準備', waveSummary: '本波結算', nextWaveTitle: '下一波：第 {wave} 波', waveDoneTitle: '第 {wave} 波完成', nextWaveMessage: '戰場即將重新開放，準備迎接新的敵潮。', lootMessage: '戰利品已經記錄，接下來處理寶箱、升級和補給。', finalWaveMessage: '最終敵潮已清理，正在整理遠征結果。', aboutToStart: '即將開始', currentDifficulty: '難度', waveMaterials: '本波材料', pendingChests: '待開寶箱', currentLevel: '目前等級', startNow: '立即開始', seconds: '{time} 秒', secondsRemaining: '剩餘 {time} 秒', scrapFor: '拆解為 ◇ {amount}', acquired: '獲得{item}', scrapItem: '拆解{item}：材料 +{amount}', autoRecover: '自動回收 {count} 個寶箱，待結算開啟；{status}', fullHealth: '生命已滿', healthGain: '生命 +{amount}', waveComplete: '第 {wave} 波完成', nextWaveHint: '下一波：第 {wave} 波 · 準備完成後進入倒計時', finalWaveDone: '最終波次已完成 · 正在整理遠征結果', startWaveButton: '開始第 {wave} 波 ➜', viewResult: '查看遠征結果', soldOut: '售罄', buy: '購買', refresh: '刷新商品 ◇ {cost}', emptySlot: '空槽', merge: '合成', sell: '賣 ◇{price}', lock: '鎖定', unlock: '解鎖', locked: '🔒', insufficient: '材料不足', merged: '已合成{item}', statLife: '生命', statArmor: '護甲', statMove: '移速', statAttackSpeed: '攻速', statRanged: '遠程', statMelee: '近戰', statElemental: '元素', statCrit: '暴擊', statDodge: '閃避', statRegen: '再生', statLuck: '幸運', statRangedBonus: '遠程傷害加值', statMeleeBonus: '近戰傷害加值', statSpellBonus: '法術傷害加值', statAllDamage: '全傷害', statCritDamage: '暴擊傷害', statLifesteal: '生命竊取', statRegen5: '每 5 秒回血', statPickup: '拾取範圍', statBaseAttackRange: '基礎攻擊射程', current: '目前：{status}', warningBoss: '警告：{boss}接近！', eliteAppears: '{elite}出現！', noTarget: '射程內沒有可標定目標', marked: '已標定', overload: '過載邊界！', salvageBonus: '拾荒分紅：材料 +2', shieldReady: '廢件護層就緒', loaded: '滿載運轉！', dodge: '閃避！', chestDrop: '寶箱掉落：拾取回血，結算開裝備', bossDefeated: '首領已擊敗！', chestPending: '寶箱待結算開啟；{status}', line: '掠線！', hazard: '小心：{hazard}', activeReady: 'Q / 就緒', cooldown: '{time} 秒', nextHitReady: '下次命中就緒', moving: '移動 {time} / 1 秒', fires: '{count} / 6 次開火', hits: '{count} / 12 次命中', guardReduce: '周圍 3 名敵人 · 減傷 22%', needNearby: '需要 3 名近敵', attacks: '{count} / 5 次攻擊', counterReady: '4 名敵人 · 自動就緒', materials: '{count} / {max} 材料', shield: '防護 {time} 秒', strengthened: '強化 {time} 秒', triggered: '本波已觸發', charge: '{count} / 10 電荷', autoRelease: '3 層自動釋放', pulseReleasing: '脈衝釋放中', statSummary: '生命 {hp}/{max} · 護甲 {armor} · 移速 {speed}% · 攻速 {attackSpeed}% · 遠程 {ranged} · 近戰 {melee} · 元素 {elemental} · 暴擊 {crit}% · 閃避 {dodge}% · 再生 {regen} · 幸運 {luck}', currentSkin: '目前{name}，切換為{next}', switchSkin: '切換為{next}'
      },

        biomes: { docks: ['赤沙廢港', '灼熱沙塵與失控機械', '熱流噴口'], grove: ['熒菌裂谷', '發光菌簇與腐蝕孢霧', '孢霧爆發'], frost: ['藍霜殘骸', '凍結碎片與寒流裂縫', '寒流爆裂'] }, difficulty: { normal: '標準', hard: '挑戰', nightmare: '極限' }, pace: { normal: '標準', quick: '速戰' },
        enemies: { crawler: '爬行機', runner: '追獵蟲', tank: '鐵甲獸', shooter: '孢射體', charger: '衝鋒殘骸', splitter: '分裂菌團', elite: '精英哨衛', centaur: '半人馬可汗', satyr: '薩特苦難使者', hellbear: '地獄熊怪粉碎者', darkTroll: '黑暗巨魔召喚師', boss: '遠古暴君' }
    },
    en: {
      ui: {
        documentTitle: 'DotaRogue · Kael Lab', metaDescription: 'DotaRogue is a Dota-inspired survivor roguelite. Move, auto-attack, upgrade and shop through a 20-wave expedition or an endless enemy surge on desktop or mobile.', canvasAria: 'DotaRogue arena. Use WASD or arrow keys, or right-click to move; Space to dash and Q for your active skill. Use the joystick and buttons on mobile. Attacks are automatic.', home: '← Game selection', eyebrow: 'KAEL LAB · BROWSER GAME', titleLead: 'Survive 20 waves or face the endless surge. Choose a hero, upgrade and craft your build.', chooseCharacter: 'Choose pilot', chooseBiome: 'Choose battlefield', difficulty: 'Difficulty', pace: 'Pace', visuals: 'Visuals', sound: 'Sound', language: 'Language', start: 'Start run', controls: 'Desktop: WASD / arrows or right-click to move, Q for the active skill, Space to dash, Esc to pause. Mobile uses the joystick and buttons. Basic attacks are automatic; active skills require mana and cooldown.', levelKicker: 'Growth choice', levelTitle: 'Choose an upgrade', levelDesc: 'Each level strengthens one ability. Choose one, then resolve any remaining levels.', shopKicker: 'Between-wave supply · ', shopTitle: 'Battlefield Supply', shopCaption: 'Uncollected materials convert at 80% and all XP is kept. Buy components and combine them through fixed recipes when ready. Recipes take no equipment slot.', shopEquipment: 'Loadout & stats', chestKicker: 'Between-wave loot · unopened ', chestTitle: 'Supply chest', chestDesc: 'Review each chest equipment reward, then take or scrap it.', chestTake: 'Take equipment', chestScrap: 'Scrap for materials', waveAuto: 'Continue automatically', waveContinue: 'Continue settlement', pauseKicker: 'Expedition paused', pauseTitle: 'Paused', pauseDesc: 'Your expedition is waiting here.', pauseDriver: 'Current pilot', pauseStats: 'Stats', pauseSkills: 'Character skills', pauseVisual: 'Visuals: {name}', resume: 'Resume battle', resumeCountdown: 'Resume countdown', restart: 'Restart', backTitle: 'Back to title', resultRestart: 'Play again', resultHome: 'Back to title', support: 'Support development', supportNote: 'Optional support; gameplay stays free.', soundOn: 'On', soundOff: 'Off', skinPixel: 'Pixel', skinDraft: 'Draft', languageZhCN: '简体中文', languageZhTW: '繁體中文', languageEn: 'English', pauseAria: 'Pause game', pauseTitleAttr: 'Pause (Esc)', skillStripAria: 'Character skills', touchAria: 'Touch controls', joystickAria: 'Movement joystick', skillButton: 'Skill', skillAria: 'Cast active skill', skillTitle: 'Active skill (Q)', dash: 'Dash', dashAria: 'Dash', dashTitle: 'Dash (Space)', noScriptTitle: 'DotaRogue', noScript: 'This frontend browser game needs JavaScript. Use WASD, arrow keys or right-click to move, Q for the active skill, and Space to dash. Mobile uses the joystick and buttons. Equipment combines through fixed component recipes, and skills need both cooldown and mana. No account or server is required.', skillPreview: 'Signature ', soundState: '{state}', record: 'Best record: {best} · Wins {wins}', bestWave: 'Wave {wave}', noRecord: 'none', wave: 'Wave {wave} / {max}', boss: 'Boss', level: 'Level {level}', pending: ' · {count} pending', hp: 'HP {hp} / {max}', defeated: 'Defeated {kills}', dashReady: 'Ready', dashCooldown: '{time}s', finalWaveStart: 'Final wave: defeat {boss}!', waveStart: 'Wave {wave} begins', expeditionComplete: 'Expedition complete', expeditionEnded: 'Expedition ended', coreCalmed: 'The battlefield is clear', reachedWave: 'You reached wave {wave}', victoryMessage: 'You survived all 20 enemy waves and became the last survivor.', defeatMessage: 'This record is saved. Tune your loadout and venture deeper.', completedWaves: 'Waves cleared', earnedMaterials: 'Materials earned', characterLevel: 'Pilot level', levelsLeft: '{count} levels left', wavePrepare: 'Wave preparation', waveSummary: 'Wave settlement', nextWaveTitle: 'Next wave: {wave}', waveDoneTitle: 'Wave {wave} complete', nextWaveMessage: 'The battlefield will reopen soon. Prepare for the next enemy surge.', lootMessage: 'Loot recorded. Next, resolve chests, upgrades and supplies.', finalWaveMessage: 'The final enemy surge is cleared. Preparing the expedition result.', aboutToStart: 'Starting', currentDifficulty: 'Difficulty', waveMaterials: 'Wave materials', pendingChests: 'Chests unopened', currentLevel: 'Current level', startNow: 'Start now', seconds: '{time} sec', secondsRemaining: '{time} sec remaining', scrapFor: 'Scrap for ◇ {amount}', acquired: 'Gained {item}', scrapItem: 'Scrapped {item}: +{amount} materials', autoRecover: 'Recovered {count} chest(s); open between waves. {status}', fullHealth: 'Health full', healthGain: 'Health +{amount}', waveComplete: 'Wave {wave} complete', nextWaveHint: 'Next wave: {wave} · countdown after preparation', finalWaveDone: 'Final wave complete · preparing expedition result', startWaveButton: 'Start wave {wave} ➜', viewResult: 'View expedition result', soldOut: 'Sold out', buy: 'Buy', refresh: 'Refresh stock ◇ {cost}', emptySlot: 'Empty slot', merge: 'Merge', sell: 'Sell ◇{price}', lock: 'Lock', unlock: 'Unlock', locked: '🔒', insufficient: 'Not enough materials', merged: 'Crafted {item}', statLife: 'HP', statArmor: 'Armor', statMove: 'Move speed', statAttackSpeed: 'Attack speed', statRanged: 'Ranged', statMelee: 'Melee', statElemental: 'Elemental', statCrit: 'Crit', statDodge: 'Dodge', statRegen: 'Regen', statLuck: 'Luck', statRangedBonus: 'Ranged damage bonus', statMeleeBonus: 'Melee damage bonus', statSpellBonus: 'Spell damage bonus', statAllDamage: 'All damage', statCritDamage: 'Crit damage', statLifesteal: 'Lifesteal', statRegen5: 'HP per 5 sec', statPickup: 'Pickup range', statBaseAttackRange: 'Basic attack range', current: 'Current: {status}', warningBoss: 'Warning: {boss} is approaching!', eliteAppears: '{elite} appears!', noTarget: 'No target in range to mark', marked: 'Marked', overload: 'Overload boundary!', salvageBonus: 'Scavenger bonus: +2 materials', shieldReady: 'Scrap shield ready', loaded: 'Fully loaded!', dodge: 'Dodged!', chestDrop: 'Chest dropped: pick it up to heal; open it between waves', bossDefeated: 'Boss defeated!', chestPending: 'Chest queued; {status}', line: 'Tracer volley!', hazard: 'Watch out: {hazard}', activeReady: 'Q / Ready', cooldown: '{time} sec', nextHitReady: 'Next hit ready', moving: 'Move {time} / 1 sec', fires: '{count} / 6 fires', hits: '{count} / 12 hits', guardReduce: '3 nearby enemies · 22% damage reduction', needNearby: 'Need 3 nearby enemies', attacks: '{count} / 5 attacks', counterReady: '4 enemies · counter ready', materials: '{count} / {max} materials', shield: 'Shield {time} sec', strengthened: 'Boosted {time} sec', triggered: 'Triggered this wave', charge: '{count} / 10 charge', autoRelease: 'Auto-release at 3 stacks', pulseReleasing: 'Pulse releasing', statSummary: 'HP {hp}/{max} · Armor {armor} · Move {speed}% · Attack {attackSpeed}% · Ranged {ranged} · Melee {melee} · Elemental {elemental} · Crit {crit}% · Dodge {dodge}% · Regen {regen} · Luck {luck}', currentSkin: 'Current {name}, switch to {next}', switchSkin: 'Switch to {next}'
      },
       biomes: { docks: ['Red Sand Docks', 'Scorching dust and rogue machinery', 'Thermal vents'], grove: ['Glowfungus Rift', 'Luminous fungi and corrosive spores', 'Spore burst'], frost: ['Bluefrost Wreckage', 'Frozen debris and cold cracks', 'Cold surge'] }, difficulty: { normal: 'Standard', hard: 'Challenge', nightmare: 'Nightmare' }, pace: { normal: 'Standard', quick: 'Quick' },   enemies: { crawler: 'Crawler', runner: 'Hunter Bug', tank: 'Ironback', shooter: 'Spore Shooter', charger: 'Charging Wreck', splitter: 'Splitting Fungus', elite: 'Elite Sentinel', centaur: 'Centaur Khan', satyr: 'Satyr Tormenter', hellbear: 'Hellbear Smasher', darkTroll: 'Dark Troll Summoner', boss: 'Ancient Tyrant' }
    }
  };
  const EXTRA_UI = {
    'zh-CN': { titlePrefix: 'Dota', titleSuffix: 'Rogue', reachedWaveLabel: '抵达波次', mode: '模式', modeExpedition: '远征模式', modeEndless: '无尽模式', endlessReached: '无尽远征：第 {wave} 波', endlessMessage: '你抵达了第 {wave} 波，记录已保存；无尽敌潮最终将你逼退。', defeatedLabel: '击败敌人', factor: '当前因子', roshanEnrage: '肉山进入暴怒！' },
    'zh-TW': { titlePrefix: 'Dota', titleSuffix: 'Rogue', reachedWaveLabel: '抵達波次', mode: '模式', modeExpedition: '遠征模式', modeEndless: '無盡模式', endlessReached: '無盡遠征：第 {wave} 波', endlessMessage: '你抵達了第 {wave} 波，紀錄已保存；無盡敵潮最終將你逼退。', defeatedLabel: '擊敗敵人', factor: '目前因子', roshanEnrage: '肉山進入暴怒！' },
    en: { titlePrefix: 'Dota', titleSuffix: 'Rogue', reachedWaveLabel: 'Wave reached', mode: 'Mode', modeExpedition: 'Expedition mode', modeEndless: 'Endless mode', endlessReached: 'Endless expedition: wave {wave}', endlessMessage: 'You reached wave {wave}; the record is saved. The endless surge eventually pushed you back.', defeatedLabel: 'Enemies defeated', factor: 'Run factor', roshanEnrage: 'Roshan is enraged!' }
  };
  Object.assign(EXTRA_UI['zh-CN'], {




    pauseEquipment: '当前装备', equipmentStripAria: '已持有装备', recipesTitle: '固定合成', equipmentCatalog: '查看装备图鉴', equipmentCatalogNewTab: '新标签查看装备图鉴',
    equipmentGrade: '{grade}级装备', fullEquipment: '装备格已满', equipmentSold: '装备已卖出',
    emptyEquipment: '暂无装备', needMana: '蓝量不足', mana: '法力', manaValue: '法力 {mana} / {max}', statAttackDamage: '基础攻击力',
    });
  Object.assign(EXTRA_UI['zh-TW'], {




    pauseEquipment: '目前裝備', equipmentStripAria: '已持有裝備', recipesTitle: '固定合成', equipmentCatalog: '查看裝備圖鑑', equipmentCatalogNewTab: '在新分頁查看裝備圖鑑',
    equipmentGrade: '{grade}級裝備', fullEquipment: '裝備格已滿', equipmentSold: '裝備已賣出',
    emptyEquipment: '暫無裝備', needMana: '魔法不足', mana: '魔法', manaValue: '魔法 {mana} / {max}', statAttackDamage: '基礎攻擊力',
    });
  Object.assign(EXTRA_UI.en, {




    pauseEquipment: 'Current equipment', equipmentStripAria: 'Held equipment', recipesTitle: 'Fixed recipes', equipmentCatalog: 'View equipment archive', equipmentCatalogNewTab: 'Open equipment archive in new tab',
    equipmentGrade: 'Grade {grade}', fullEquipment: 'Equipment slots full', equipmentSold: 'Equipment sold',
    emptyEquipment: 'No equipment', needMana: 'Not enough mana', mana: 'Mana', manaValue: 'Mana {mana} / {max}', statAttackDamage: 'Basic attack damage',
    });

  const BUFF_UI = {
    'zh-CN': {
      buffRarity: 'Buff 品质', buffRarity_common: '普通', buffRarity_rare: '稀有', buffRarity_epic: '史诗', buffRarity_legendary: '传说',
      buffChances: '新 Buff 概率 · 幸运 {luck}',
      shopBuffs: '永久增益', pauseBuffs: '永久增益', buffKind: '永久增益', buffRepeatable: '可重复购买', buffStack: '已持有 {count} 层 · 可重复购买',
      buffEmpty: '尚未购买永久增益。它们不占装备格；纯正面效果或正负效果都会按层数叠加。', buffBought: '获得{item}：第 {count} 层', buffCharges: '本波薄葬：{count}/{total} 次', buffNextCharges: '下一波薄葬：{count} 次（每波恢复）', thinBurialTriggered: '薄葬抵挡伤害 · 剩余 {count} 次', buffLimits: '叠加下限：有效移速／攻速为基础 20%，射程 48，全伤害 10%。',
      shopRates: '新商品：成品{finished}%／中间件{intermediate}%，另有 1 个永久增益位',
    },
    'zh-TW': {
      shopBuffs: '永久增益', pauseBuffs: '永久增益', buffKind: '永久增益', buffRepeatable: '可重複購買', buffStack: '目前持有 {count} 層 · 可重複購買',
      buffRarity: 'Buff 品質', buffRarity_common: '普通', buffRarity_rare: '稀有', buffRarity_epic: '史詩', buffRarity_legendary: '傳說',
      buffChances: '新 Buff 機率 · 幸運 {luck}',
      buffEmpty: '尚未購買永久增益。它們不占裝備格；純正面效果或正負效果都會按層數疊加。', buffBought: '獲得{item}：第 {count} 層', buffCharges: '本波薄葬：{count}/{total} 次', buffNextCharges: '下一波薄葬：{count} 次（每波恢復）', thinBurialTriggered: '薄葬抵擋傷害 · 剩餘 {count} 次', buffLimits: '疊加下限：有效移速／攻速為基礎 20%，射程 48，全傷害 10%。',
      shopRates: '新商品：成品{finished}%／中間件{intermediate}%，另有 1 個永久增益位',
    },
    en: {
      shopBuffs: 'Permanent buffs', pauseBuffs: 'Permanent buffs', buffKind: 'Permanent buff', buffRepeatable: 'Repeatable', buffStack: '{count} stack(s) owned · repeatable',
      buffRarity: 'Buff rarity', buffRarity_common: 'Common', buffRarity_rare: 'Rare', buffRarity_epic: 'Epic', buffRarity_legendary: 'Legendary',
      buffChances: 'New Buff odds · Luck {luck}',
      buffEmpty: 'No permanent buffs yet. They use no equipment slots; pure-positive and mixed effects both stack.', buffBought: 'Gained {item}: stack {count}', buffCharges: 'Grave this wave: {count}/{total}', buffNextCharges: 'Grave next wave: {count} (recharges each wave)', thinBurialTriggered: 'Shallow Grave blocked damage · {count} left', buffLimits: 'Stacking floors: movement/attack rate 20% of base, range 48, all damage 10%.',
      shopRates: 'New offers: {finished}% finished / {intermediate}% intermediate, plus 1 permanent buff slot',
    }
  };
  for (const locale of SUPPORTED_LOCALES) Object.assign(EXTRA_UI[locale], BUFF_UI[locale]);

  const HERO_UI = {
    'zh-CN': { active: '主动', passive: '被动', availableHeroes: '可玩英雄', upcomingHeroes: '待制作英雄', unavailableHero: '未开放', component: '基础组件', intermediate: '中间装备', finished: '成品装备', shopRates: '新商品：成品{finished}%／中间件{intermediate}%，另有 1 个永久增益位', statAttackDamage: '物理攻击', statSpellBonus: '法术攻击', statManaRegen: '每秒回蓝', statAbilityHaste: '冷却缩减', quillCount: '受击 {count}/4 · 背后减伤40%', staticReady: '静电场 · 同敌1秒', dividendCount: '拾取 {count}/8 · 额外1币', leapCount: '有效攻击 {count}/5', soulCount: '累计收魂 {count} · 攻击 +{attack}', dividend: '炼金分红：货币 +1', bloodRage: '撒旦狂热', chooseCharacter: '选择英雄', pauseDriver: '当前英雄', titleLead: '九名英雄，20波远征或无尽敌潮。收集组件、合成装备，用伤害成长塑造你的构筑。', shopCaption: '波末材料按80%回收，经验全额保留；商店以组件为主，另有可重复购买的永久增益。固定配方不占装备格，满格仍能合成释放组件格。' },
    'zh-TW': { active: '主動', passive: '被動', availableHeroes: '可玩英雄', upcomingHeroes: '待製作英雄', unavailableHero: '未開放', component: '基礎組件', intermediate: '中間裝備', finished: '成品裝備', shopRates: '新商品：成品{finished}%／中間件{intermediate}%，另有 1 個永久增益位', statAttackDamage: '物理攻擊', statSpellBonus: '法術攻擊', statManaRegen: '每秒回魔', statAbilityHaste: '冷卻縮減', quillCount: '受擊 {count}/4 · 背後減傷40%', staticReady: '靜電場 · 同敵1秒', dividendCount: '拾取 {count}/8 · 額外1幣', leapCount: '有效攻擊 {count}/5', soulCount: '累計收魂 {count} · 攻擊 +{attack}', dividend: '煉金分紅：貨幣 +1', bloodRage: '撒旦狂熱', chooseCharacter: '選擇英雄', pauseDriver: '當前英雄', titleLead: '九名英雄，20波遠征或無盡敵潮。收集組件、合成裝備，用傷害成長塑造你的構築。', shopCaption: '波末材料按80%回收，經驗全額保留；商店以組件為主，另有可重複購買的永久增益。固定配方不占裝備格，滿格仍能合成釋放組件格。' },
    en: { active: 'Active', passive: 'Passive', availableHeroes: 'Playable heroes', upcomingHeroes: 'Planned heroes', unavailableHero: 'Unavailable', component: 'Component', intermediate: 'Intermediate', finished: 'Finished item', shopRates: 'New offers: {finished}% finished / {intermediate}% intermediate, plus 1 permanent buff slot', statAttackDamage: 'Physical attack', statSpellBonus: 'Magic attack', statManaRegen: 'Mana per sec', statAbilityHaste: 'Cooldown reduction', quillCount: 'Hits {count}/4 · Rear damage -40%', staticReady: 'Static Field · 1 sec per enemy', dividendCount: 'Pickups {count}/8 · +1 gold', leapCount: 'Successful attacks {count}/5', soulCount: 'Souls {count} · Attack +{attack}', dividend: 'Alchemy Dividend: +1 gold', bloodRage: 'Satanic rage', chooseCharacter: 'Choose a hero', pauseDriver: 'Current hero', titleLead: 'Nine heroes, 20-wave expeditions or endless hordes. Collect components, craft equipment and build your damage growth.', shopCaption: 'Uncollected materials convert at 80% and all XP is kept. Most offers are components, plus repeatable permanent buffs. Fixed recipes take no slot; crafting also works with a full inventory.' }
  };
  for (const locale of SUPPORTED_LOCALES) Object.assign(EXTRA_UI[locale], HERO_UI[locale]);

  const EQUIPMENT_UPGRADE_UI = {
    'zh-CN': { upgradeRule: '全部成品装备均可用三件同名同级免费合一，最高 Lv.3；每次释放两格。组件和中间件不参与。', upgradeTo: '升至 Lv.{level}（{count}/3）', upgradePreview: '查看升阶结果', upgradeKept: '三件合为一件；保留三件属性总和与总卖价，释放 2 格。', upgradeMax: 'Lv.3 · 已满级', upgradeDone: '已升阶：{item} · 释放 2 格', upgradeActual: '当前角色实际：暴击 {crit}% · 闪避 {dodge}% · 冷缩 {haste}%。合并前后相同。' },
    'zh-TW': { upgradeRule: '全部成品裝備均可用三件同名同級免費合一，最高 Lv.3；每次釋放兩格。組件和中間件不參與。', upgradeTo: '升至 Lv.{level}（{count}/3）', upgradePreview: '查看升階結果', upgradeKept: '三件合為一件；保留三件屬性總和與總售價，釋放 2 格。', upgradeMax: 'Lv.3 · 已滿級', upgradeDone: '已升階：{item} · 釋放 2 格', upgradeActual: '目前角色實際：暴擊 {crit}% · 閃避 {dodge}% · 冷縮 {haste}%。合併前後相同。' },
    en: { upgradeRule: 'All finished gear can merge: combine three identical, same-level items for free, up to Lv.3. Each merge frees two slots. Components and intermediate items are excluded.', upgradeTo: 'Upgrade to Lv.{level} ({count}/3)', upgradePreview: 'Preview upgrade', upgradeKept: 'Three become one: keep their combined stats and resale value, and free 2 slots.', upgradeMax: 'Lv.3 · Max level', upgradeDone: 'Upgraded: {item} · 2 slots freed', upgradeActual: 'Current effective stats: Crit {crit}% · Dodge {dodge}% · Cooldown reduction {haste}%. Unchanged by merging.' }
  };
  for (const locale of SUPPORTED_LOCALES) Object.assign(EXTRA_UI[locale], EQUIPMENT_UPGRADE_UI[locale]);
  function modeName(id) { return selectedLocale === 'en' ? (id === 'endless' ? 'Endless' : 'Expedition') : selectedLocale === 'zh-TW' ? (id === 'endless' ? '無盡' : '遠征') : (id === 'endless' ? '无尽' : '远征'); }
  let selectedLocale = DEFAULT_LOCALE;
  const EARLY_GAME_UI = {
    'zh-CN': {
      freeRefresh: '免费刷新（本波首次）', waveSupply: '含通关补给 ◇ {amount}。',
      shopRates: '随机装备位：成品{finished}%／中间件{intermediate}%，另有 1 个永久增益位',
      shopCaption: '前5波每店首刷免费，至少提供2件基础组件（锁定优先），并优先补齐已有配方。波末未拾材料按80%回收，经验全额保留；合成免费，不占额外配方格。'
    },
    'zh-TW': {
      freeRefresh: '免費刷新（本波首次）', waveSupply: '含通關補給 ◇ {amount}。',
      shopRates: '隨機裝備位：成品{finished}%／中間件{intermediate}%，另有 1 個永久增益位',
      shopCaption: '前5波每店首刷免費，至少提供2件基礎組件（鎖定優先），並優先補齊已有配方。波末未拾材料按80%回收，經驗全額保留；合成免費，不佔額外配方格。'
    },
    en: {
      freeRefresh: 'Free refresh (first this wave)', waveSupply: 'Includes ◇ {amount} clear bonus.',
      shopRates: 'Random equipment slots: {finished}% finished / {intermediate}% intermediate, plus 1 permanent buff slot',
      shopCaption: 'Waves 1–5: first refresh free, at least 2 components (locks take priority), and offers favor missing recipe parts. Uncollected materials return 80% gold and full XP. Crafting is free; recipes use no slot.'
    }
  };
  for (const locale of SUPPORTED_LOCALES) Object.assign(EXTRA_UI[locale], EARLY_GAME_UI[locale]);

  const CRAFT_UI = {
    'zh-CN': {
      quickCraftTitle: '即时合成与升阶', allRecipes: '全部配方与合成路线',
      upgradeProgress: '升阶进度与预览（{count} 类）',
      craftSummary: '可合成 {crafts} 项 · 可升阶 {upgrades} 组 · 装备 {used}/{capacity} 格',
      craftEmpty: '暂时没有可合成项。商品会标注合成用途，全部配方可在下方展开。',
      craftTarget: '合成{item}', craftChain: '一键合成{item}', craftInputs: '消耗：{items}',
      craftRoute: '合成路线：{items}', craftResult: '查看结果', craftKind: '固定配方 · 免费',
      craftProgress: '直接材料 {owned}/{total}', craftUses: '合成用途：{items}',
      buyCraft: '◇ {cost} 购买并合成{item}', takeCraft: '收下并合成{item}',
      craftChoices: '可完成 {count} 项配方，选择结果', inventoryCount: '持有 {count} 件 · 共占 {count} 格',
      sellOne: '卖出一件 ◇{price}', upgradeGroup: 'Lv.{level} · 持有 {count} 件 · 可合 {groups} 组',
      upgradeBatch: '全部升至 Lv.{level}（{groups} 组）', upgradeBatchDone: '已升阶：{item} · 释放 {slots} 格',
      buyUpgrade: '◇ {cost} 购买并升至 Lv.2', chestOrganize: '先合成已有装备，腾出空格',
      chestFullCraft: '装备格已满；可选择合成结果，或先合成已有装备腾出空格。'
    },
    'zh-TW': {
      quickCraftTitle: '即時合成與升階', allRecipes: '全部配方與合成路線',
      upgradeProgress: '升階進度與預覽（{count} 類）',
      craftSummary: '可合成 {crafts} 項 · 可升階 {upgrades} 組 · 裝備 {used}/{capacity} 格',
      craftEmpty: '暫時沒有可合成項。商品會標註合成用途，全部配方可在下方展開。',
      craftTarget: '合成{item}', craftChain: '一鍵合成{item}', craftInputs: '消耗：{items}',
      craftRoute: '合成路線：{items}', craftResult: '查看結果', craftKind: '固定配方 · 免費',
      craftProgress: '直接材料 {owned}/{total}', craftUses: '合成用途：{items}',
      buyCraft: '◇ {cost} 購買並合成{item}', takeCraft: '收下並合成{item}',
      craftChoices: '可完成 {count} 項配方，選擇結果', inventoryCount: '持有 {count} 件 · 共占 {count} 格',
      sellOne: '賣出一件 ◇{price}', upgradeGroup: 'Lv.{level} · 持有 {count} 件 · 可合 {groups} 組',
      upgradeBatch: '全部升至 Lv.{level}（{groups} 組）', upgradeBatchDone: '已升階：{item} · 釋放 {slots} 格',
      buyUpgrade: '◇ {cost} 購買並升至 Lv.2', chestOrganize: '先合成已有裝備，騰出空格',
      chestFullCraft: '裝備格已滿；可選擇合成結果，或先合成已有裝備騰出空格。'
    },
    en: {
      quickCraftTitle: 'Craft & upgrade now', allRecipes: 'All recipes & crafting routes',
      upgradeProgress: 'Upgrade progress & previews ({count} types)',
      craftSummary: '{crafts} craft option(s) · {upgrades} upgrade group(s) · Slots {used}/{capacity}',
      craftEmpty: 'Nothing to craft yet. Offers show their uses; expand all recipes below to plan your build.',
      craftTarget: 'Craft {item}', craftChain: 'Craft full route: {item}', craftInputs: 'Consumes: {items}',
      craftRoute: 'Crafting route: {items}', craftResult: 'Preview result', craftKind: 'Fixed recipe · Free',
      craftProgress: 'Direct parts {owned}/{total}', craftUses: 'Used in: {items}',
      buyCraft: 'Buy & craft {item} · ◇ {cost}', takeCraft: 'Take & craft {item}',
      craftChoices: '{count} recipe option(s): choose a result', inventoryCount: '{count} owned · Uses {count} slots',
      sellOne: 'Sell one · ◇{price}', upgradeGroup: 'Lv.{level} · {count} owned · {groups} merge group(s)',
      upgradeBatch: 'Upgrade all to Lv.{level} ({groups} groups)', upgradeBatchDone: 'Upgraded: {item} · {slots} slots freed',
      buyUpgrade: 'Buy & upgrade to Lv.2 · ◇ {cost}', chestOrganize: 'Craft held equipment to free a slot first',
      chestFullCraft: 'Inventory full. Choose a crafting result, or craft held equipment to free a slot first.'
    }
  };
  for (const locale of SUPPORTED_LOCALES) Object.assign(EXTRA_UI[locale], CRAFT_UI[locale]);

  function t(key, vars = {}) {
    const value = EXTRA_UI[selectedLocale]?.[key] ?? LOCALES[selectedLocale]?.ui?.[key] ?? EXTRA_UI[DEFAULT_LOCALE]?.[key] ?? LOCALES[DEFAULT_LOCALE].ui[key] ?? key;
    return String(value).replace(/\{(\w+)\}/g, (_, name) => vars[name] == null ? '' : String(vars[name]));
  }

  function applyLocaleData() {
    const locale = LOCALES[selectedLocale] || LOCALES[DEFAULT_LOCALE];
    for (const c of CHARACTERS) {
      const [name, profession, desc, active, activeDesc, passive, passiveDesc] = HERO_TEXT[selectedLocale][c.id];
      Object.assign(c, { name, profession, desc });
      Object.assign(SKILLS[c.id][0], { name: active, desc: activeDesc });
      Object.assign(SKILLS[c.id][1], { name: passive, desc: passiveDesc });
    }
    for (const b of BIOMES) { const value = locale.biomes[b.id]; if (value) [b.name, b.desc, b.hazard] = value; }
    for (const d of DIFFICULTIES) d.name = locale.difficulty[d.id] || d.name;
    for (const pace of PACES) pace.name = locale.pace[pace.id] || pace.name;
    UPGRADES.forEach((upgrade, i) => { [upgrade.name, upgrade.desc] = UPGRADE_TEXT[selectedLocale][i]; });
    Object.entries(ENEMIES).forEach(([id, enemy]) => { if (locale.enemies[id]) enemy.name = locale.enemies[id]; });
  }
  function applyStaticLocale() {
    const ui = LOCALES[selectedLocale].ui;
    document.documentElement.lang = selectedLocale;
    document.title = ui.documentTitle;
    $('game-title').firstChild.textContent = t('titlePrefix');
    $('game-title').querySelector('span').textContent = t('titleSuffix');
    document.querySelector('meta[name="description"]')?.setAttribute('content', ui.metaDescription);
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => el.dataset.i18nAttr.split(';').forEach(pair => { const [attr, key] = pair.split(':'); if (attr && key) el.setAttribute(attr, t(key)); }));
    const localeLabel = $('locale-label'); if (localeLabel) localeLabel.textContent = t('language');
    for (const [id, key] of [['locale-zh-CN', 'languageZhCN'], ['locale-zh-TW', 'languageZhTW'], ['locale-en', 'languageEn']]) if ($(id)) { $(id).textContent = t(key); $(id).setAttribute('aria-pressed', String($(id).dataset.locale === selectedLocale)); }
  }
  function setLocale(locale) {
    if (!SUPPORTED_LOCALES.includes(locale)) locale = DEFAULT_LOCALE;
    selectedLocale = locale; applyLocaleData(); applyStaticLocale(); persist();
    renderTitle();
    if (!run) return;
    if (phase === 'shop') renderShop();
    if (phase === 'pause') renderPauseDetails();
    if (phase === 'level') renderLevelChoices();
    if (phase === 'chest') renderChestReward();
    if (phase === 'wave-result') renderWaveResult();
    if (phase === 'result') renderResult(run.resultVictory);
    updateHUD();
  }
  const ENEMY_POSES = {
    crawler: ['step', 'attack'], runner: ['step'], tank: ['step'], shooter: ['attack'],
    centaur: ['step', 'windup', 'attack'], satyr: ['step', 'windup', 'attack'],
    hellbear: ['step', 'windup', 'attack'], darkTroll: ['step', 'windup', 'attack'],
    charger: ['windup', 'charge'], splitter: ['step'], elite: ['windup', 'charge'], boss: ['windup', 'attack'], roshan: ['windup', 'attack']
  };

  const PIXEL_ART_IDS = [
    ...Object.keys(ENEMIES).flatMap(id => [id, ...ENEMY_POSES[id].map(pose => `${id}-${pose}`)]),
    'roshan', 'roshan-windup', 'roshan-attack',
    ...UPGRADES.slice(0, 14).map((_, index) => `upgrade-${index}`),
    ...BIOMES.flatMap(({ id }) => ['ground', 'tree', 'rock', 'water', 'trap', 'preview'].map(kind => `map-${id}-${kind}`))
  ];
  const HERO_ART_VERSION = '?v=20261013-kael-elf1';
  const LUNA_ART_VERSION = '?v=20261013-luna-glaive1';
  const HERO_ART = Object.fromEntries(CHARACTERS.map(({ id }) =>
    [id, `./characters/${id}/art/runtime/${id}-idle-a.svg${id === 'luna' ? LUNA_ART_VERSION : HERO_ART_VERSION}`]));
  const HERO_POSE_ART = Object.fromEntries(Object.keys(HERO_ART).flatMap(id =>
    ['idle-alt', 'walk-a', 'walk-b', 'dash', 'attack-windup', 'attack', 'attack-release', 'skill',
      'side-idle-a', 'side-idle-alt', 'side-walk-a', 'side-walk-b', 'side-dash',
      'side-attack-windup', 'side-attack', 'side-attack-release', 'side-skill'].map(pose =>
      [`${id}-${pose}`, `./characters/${id}/art/runtime/${id}-${pose}.svg${id === 'luna' ? LUNA_ART_VERSION : HERO_ART_VERSION}`])));
  HERO_POSE_ART['luna-glaive'] = `./characters/luna/art/runtime/luna-glaive.svg${LUNA_ART_VERSION}`;
  for (const pose of ['idle-a', 'idle-alt', 'walk-a', 'walk-b', 'dash', 'attack-windup', 'attack', 'attack-release', 'skill']) {
    for (const side of ['', 'side-']) HERO_POSE_ART[`tb-demon-${side}${pose}`] = `./characters/tb/art/runtime/tb-demon-${side}${pose}.svg?v=20261014-tb1`;
  }
  const LUNA_GLAIVE_BLADE = new Path2D('M-9-7C-24-16-22-34-5-44C-12-29-6-22 8-21C22-20 32-11 33 3C24-7 15-9 5-5L0 7Z');
  const EQUIPMENT_ART = Object.fromEntries(EQUIPMENT_IDS.map(id => [`equipment-${id}`, `./art/pixel/equipment-${id}.svg`]));
  const SKIN_ART = {
    draft: { ...ART_PATHS, ...HERO_ART, ...EQUIPMENT_ART,
      ...Object.fromEntries(ELITE_ROTATION.filter(id => id !== 'elite').flatMap(id =>
        [id, ...ENEMY_POSES[id].map(pose => `${id}-${pose}`)].map(pose => [pose, `./art/pixel/${pose}.svg`]))) },
    pixel: { ...Object.fromEntries(PIXEL_ART_IDS.map(id => [id, `./art/pixel/${id}.svg`])), ...HERO_ART, ...EQUIPMENT_ART }
  };
  const imagesByPath = {};
  let windRenderer = null, meteorRenderer = null;
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  createWindRenderer().then(renderer => { windRenderer = renderer; })
    .catch(error => console.warn('Wind sprites unavailable; using the projectile fallback.', error));
  createMeteorRenderer().then(renderer => { meteorRenderer = renderer; })
    .catch(error => console.warn('Meteor sprites unavailable; using the rock fallback.', error));
  const artImages = Object.fromEntries(Object.entries(SKIN_ART).flatMap(([skin, paths]) => Object.entries(paths).map(([id, path]) => {
    const image = imagesByPath[path] || (imagesByPath[path] = new Image());
    if (!image.src) image.src = path;
    return [`${skin}:${id}`, image];
  })));
  const heroPoseImages = {};
  function loadHeroPoses(id) {
    for (const [pose, path] of Object.entries(HERO_POSE_ART)) {
      if (!pose.startsWith(`${id}-`) || heroPoseImages[pose]) continue;
      const image = new Image();
      image.src = path;
      heroPoseImages[pose] = image;
    }
  }
  const artIcon = (id, fallback) => SKIN_ART[selectedSkin][id]
    ? `<img class="art-icon" src="${id === 'kael' ? `./characters/kael/art/runtime/kael-portrait.svg${HERO_ART_VERSION}` : id === 'tb' ? './characters/tb/art/runtime/tb-portrait.svg?v=20261014-tb1' : SKIN_ART[selectedSkin][id]}" alt="" decoding="async">`
    : id === 'kael' ? '<span class="art-icon" aria-hidden="true">✦</span>' : (fallback || '');
  const artImage = id => {
    const image = heroPoseImages[id] || artImages[`${selectedSkin}:${id}`];
    return image?.complete && image.naturalWidth ? image : null;
  };

  let save = loadSave();
  selectedLocale = SUPPORTED_LOCALES.includes(save.settings.locale) ? save.settings.locale : DEFAULT_LOCALE;
  applyLocaleData();
  let selectedCharacter = CHARACTERS[0].id;
  let selectedBiome = BIOMES[0].id;
  let selectedDifficulty = save.settings.difficulty || 'normal';
  let selectedPace = save.settings.pace || 'normal';
  let selectedMode = save.settings.mode === 'endless' ? 'endless' : 'expedition';
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

  function terrainCollision(x, y, radius, blockWater = true) {
    if (x < radius || y < radius || x > WORLD.w - radius || y > WORLD.h - radius) return true;
    for (const o of run.terrain) {
      if (o.kind === 'water') {
        if (blockWater && riverSegments(o).some(segment => pointSegmentDistance(x, y, segment.a, segment.b) < radius + segment.r)) return true;
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
      if (riverSegments(o).some(segment => segmentSegmentDistance(x1, y1, x2, y2, segment.a.x, segment.a.y, segment.b.x, segment.b.y) < radius + segment.r)) return true;
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
    if (studioMode) return { settings: { sound: false }, records: {}, wins: 0 };
    try {
      const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
      const records = {};
      for (const [key, wave] of Object.entries(raw.records || {})) {
        const modeKey = key.split(':').length === 3 ? `${key}:expedition` : key;
        records[modeKey] = Math.max(records[modeKey] || 0, Number(wave) || 0);
      }
      return { settings: raw.settings || {}, records, wins: Number(raw.wins) || 0 };
    } catch (_) { return { settings: {}, records: {}, wins: 0 }; }
  }
  function persist() {
    if (studioMode) return;
    save.settings = { sound: soundEnabled, pace: selectedPace, difficulty: selectedDifficulty, mode: selectedMode, skin: selectedSkin, locale: selectedLocale };
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (_) { /* Storage may be unavailable. */ }
  }
  function isEndlessRun() { return run?.mode === 'endless'; }
  function bossVariantForWave(wave) { return wave === MAX_WAVES ? 'roshan' : 'standard'; }
  function bossDisplayName(variant = 'standard') {
    return variant === 'roshan' ? (BOSS_VARIANT_NAMES.roshan[selectedLocale] || BOSS_VARIANT_NAMES.roshan.en) : ENEMIES.boss.name;
  }
  function enemyDef(enemy) { return BOSS_VARIANTS[enemy.variant] || ENEMIES[enemy.id]; }
  function endlessFactor(wave = run?.wave || 0) {
    if (!isEndlessRun()) return 0;
    const endlessWave = Math.max(0, wave - MAX_WAVES);
    const endlessMult = 2 + Math.max(0, (wave - 35) * .2);
    const raw = Math.max(0, endlessWave * (endlessWave + 1) / 200) * endlessMult;
    return raw;
  }
  function endlessSpeedFactor(wave = run?.wave || 0) {
    return 1 + Math.min(1.75, endlessFactor(wave) / 13.33);
  }
  function endlessDropChance(wave = run?.wave || 0) {
    return isEndlessRun() ? Math.max(.5, 1 - Math.max(0, wave - MAX_WAVES) * .015) : 1;
  }
  function enemyCap() {
    return run.difficulty.enemyCap + (isEndlessRun() ? Math.min(70, Math.floor(endlessFactor() * 2)) : 0);
  }
  function nearbyEnemyMinimum() {
    const base = run.difficulty.nearbyMin;
    if (!isEndlessRun() || run.difficulty.id !== 'nightmare') return base;
    return Math.min(base, 2 + Math.max(0, run.wave - 1) * 2);
  }
  function recordKey(character = run?.character, biome = run?.biome, difficulty = run?.difficulty, mode = run?.mode) {
    return `${character.id}:${biome.id}:${difficulty.id}:${mode || 'expedition'}`;
  }
  function updateSkinButtons() {
    const name = selectedSkin === 'pixel' ? t('skinPixel') : t('skinDraft');
    const next = selectedSkin === 'pixel' ? t('skinDraft') : t('skinPixel');
    $('game').dataset.skin = selectedSkin;
    for (const id of ['title-skin-button', 'skin-button', 'pause-skin-button']) {
      const button = $(id);
      button.textContent = id === 'pause-skin-button' ? t('pauseVisual', { name }) : name;
      button.setAttribute('aria-label', t('currentSkin', { name, next }));
      button.title = t('switchSkin', { next });
    }
  }
  function toggleSkin() {
    selectedSkin = selectedSkin === 'pixel' ? 'draft' : 'pixel';
    updateSkinButtons(); persist(); resize(); renderTitle();
    if (!run) return;
    renderEquipmentStrip(); renderSkillStrip();
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
    const combat = Object.hasOwn(BASE_ATTACKS, kind) || kind === 'explosion' || kind === 'shooter-fire' || kind === 'boss-attack';
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
        case 'equipment-crit': wave('triangle', 1120, 570, .09, .014); break;
        case 'shooter-fire': wave('triangle', 460, 190, .09, .012); break;
        case 'boss-attack': wave('sawtooth', 180, 55, .25, .032); noise(.16, .018, 680, 'lowpass'); break;
        case 'skill-rover': wave('sine', 530, 880, .13, .031); wave('triangle', 990, 1250, .1, .015, .055); break;
        case 'skill-bulwark': wave('sawtooth', 210, 90, .2, .028); noise(.16, .02, 1100); break;
        case 'skill-conductor': wave('square', 520, 135, .2, .02); noise(.13, .023, 2600, 'highpass'); break;
        case 'skill-scavenger': wave('sine', 310, 940, .2, .027); wave('triangle', 620, 1240, .15, .013, .06); break;
        case 'skill-jugg': wave('sawtooth', 380, 110, .3, .022); noise(.25, .018, 1200); break;
        case 'soul': wave('sine', 280, 140, .12, .018); break;
        case 'skill-sf': wave('sawtooth', 190, 70, .5, .024); wave('sine', 440, 100, .4, .02, .1); break;
        case 'skill-luna': wave('sine', 780, 165, .34, .03); wave('triangle', 1180, 420, .28, .018, .08); break;
        case 'luna-bounce': wave('triangle', 960, 360, .11, .014); break;
        case 'skill-tb': wave('sawtooth', 85, 210, .36, .026); wave('triangle', 420, 95, .42, .02); break;
        case 'tb-image': wave('sine', 380, 710, .16, .014); break;
        case 'kael-spell': wave('sine', 620, 1240, .24, .024); wave('triangle', 1040, 420, .18, .018, .08); break;
        case 'dash': wave('triangle', 410, 140, .11, .024); noise(.08, .012, 1300); break;
        case 'hurt': wave('sawtooth', 165, 70, .15, .038); break;
        case 'shield': wave('sine', 340, 880, .2, .028); wave('triangle', 760, 1180, .16, .017, .08); break;
        case 'chest-pickup': wave('sine', 580, 860, .11, .034); wave('sine', 800, 1100, .12, .017, .07); break;
        case 'chest-open': wave('triangle', 510, 830, .2, .025); wave('sine', 930, 1370, .25, .021, .1); break;
        case 'chest-take': wave('sine', 760, 1060, .16, .033); break;
        case 'chest-scrap': wave('triangle', 550, 250, .14, .025); noise(.075, .01, 1200); break;
        case 'warning-boss': wave('sawtooth', 170, 125, .31, .045); wave('sawtooth', 160, 95, .32, .036, .18); break;
        case 'warning-elite': wave('sawtooth', 260, 145, .25, .037); break;
        case 'victory': wave('triangle', 500, 670, .28, .035); wave('triangle', 750, 1030, .32, .034, .18); break;
        case 'defeat': wave('triangle', 310, 115, .4, .042); break;
        case 'merge': wave('triangle', 590, 980, .18, .033); wave('sine', 900, 1260, .2, .022, .09); break;
        case 'merge-max': wave('triangle', 590, 980, .18, .033); wave('sine', 900, 1260, .2, .022, .09); wave('sine', 180, 90, .17, .024, .22); break;
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
    $('character-list').innerHTML = CHARACTERS.map(c => `<button class="hero-tile" type="button" data-character="${c.id}" aria-pressed="${selectedCharacter === c.id}" aria-controls="hero-details"><span class="hero-avatar">${artIcon(c.id, '')}</span><span class="hero-tile-name">${c.id === 'tb' && selectedLocale === 'en' ? 'Terror<wbr>blade' : c.name}</span></button>`).join('');
    $('upcoming-hero-list').innerHTML = UPCOMING_HEROES.map(hero => `<div class="hero-tile hero-tile-unavailable"><span class="hero-avatar"><img class="art-icon" src="./art/hero-pending.svg" alt=""></span><span class="hero-tile-name">${hero.names[SUPPORTED_LOCALES.indexOf(selectedLocale)]}</span><span class="hero-tile-status">${t('unavailableHero')}</span></div>`).join('');
    const selectedHero = CHARACTERS.find(c => c.id === selectedCharacter);
    const details = $('hero-details');
    if (details.dataset.hero !== selectedHero.id || details.dataset.locale !== selectedLocale) {
      details.innerHTML = `<div class="hero-details-art">${artIcon(selectedHero.id, '')}</div><div class="hero-details-copy"><h3>${selectedHero.name}</h3><p class="hero-profession">${selectedHero.profession}</p><p>${selectedHero.desc}</p><p class="hero-skill"><span>${t('passive')}</span> ${SKILLS[selectedHero.id][1].name}</p><p class="hero-skill"><span>${t('active')}</span> ${SKILLS[selectedHero.id][0].name}</p></div>`;
      details.dataset.hero = selectedHero.id;
      details.dataset.locale = selectedLocale;
    }
    $('biome-list').innerHTML = BIOMES.map(b => `<button class="selection-card" type="button" data-biome="${b.id}" aria-pressed="${selectedBiome === b.id}"><span class="selection-icon">${artIcon(`map-${b.id}-preview`, b.icon)}</span><span><strong>${b.name}</strong><small>${b.desc}</small></span></button>`).join('');
    $('difficulty-list').innerHTML = DIFFICULTIES.map(d => `<button type="button" data-difficulty="${d.id}" aria-pressed="${selectedDifficulty === d.id}">${d.name}</button>`).join('');
    $('pace-list').innerHTML = PACES.map(p => `<button type="button" data-pace="${p.id}" aria-pressed="${selectedPace === p.id}">${p.name}</button>`).join('');
    $('mode-list').innerHTML = MODES.map(m => `<button type="button" data-mode="${m.id}" aria-pressed="${selectedMode === m.id}">${modeName(m.id)}</button>`).join('');
    $('sound-button').textContent = soundEnabled ? t('soundOn') : t('soundOff');
    const key = `${selectedCharacter}:${selectedBiome}:${selectedDifficulty}:${selectedMode}`;
    const best = save.records[key] || 0;
    $('record-label').textContent = `${t('record', { best: best ? t('bestWave', { wave: best }) : t('noRecord'), wins: save.wins })} · ${selectedMode === 'endless' ? t('modeEndless') : t('modeExpedition')}`;
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
  function createBaseAttack(id) { return { id, uid: ++uid, cool: 0 }; }
  function createRun() {
    loadHeroPoses(selectedCharacter);
    resetStick(); keys.clear(); moveTarget = null; moveFlow = null;
    const character = CHARACTERS.find(c => c.id === selectedCharacter);
    const biome = BIOMES.find(b => b.id === selectedBiome);
    const difficulty = DIFFICULTIES.find(d => d.id === selectedDifficulty);
    const stats = { armor: 0, speed: 0, elemental: 0, attackDamage: 0, attackRange: 0, critDamage: 80, abilityHaste: 0, attackSpeed: 0, crit: 5, dodge: 0, regen: 0, pickup: 0, luck: 0, lifesteal: 0, damage: 0, manaRegen: 3, ...character.stats };
    run = {
      character, biome, difficulty, mode: selectedMode, stats, player: { x: WORLD.w / 2, y: WORLD.h / 2, radius: 17, hp: character.hp, maxHp: character.hp, mana: 100, maxMana: 100, facing: 0, attackFacing: 0, visualSide: false, visualMirror: 1, attackPose: 0, attackClock: 0, pendingAttack: null, skillPose: 0, skillClock: 0, animTime: 0, invuln: 0, dashTime: 0, dashCooldown: 0, dashX: 1, dashY: 0 },
      wave: 0, elapsed: 0, totalTime: 0, timeLeft: 0, kills: 0, money: 0, earned: 0,
      level: 1, xp: 0, xpNeed: 8, pendingLevels: 0, levelChoices: [],
      baseAttack: createBaseAttack(CHARACTER_ATTACKS[character.id]),
      equipment: [], equipmentReserve: [], autoForge: true, forgeTargets: ['', ''], builds: [], buffs: {}, buffState: { graveCharges: 0, receivedHits: 0 }, shopOffers: [], rerolls: 0,
      equipmentCapacity: EQUIPMENT_CAPACITY,
      pendingChests: 0, chestReward: null, attackSeq: 0, chainProcAttackId: 0, chainReadyAt: 0,

      skills: { activeCooldown: 0, receivedHits: 0, attackHits: 0, lastBasicAttack: 0, manualPickups: 0, radianceClock: 0, mantaAttackCount: 0, mantaProcAttackId: 0,
        souls: 0, jump: null, leapCooldown: 0, spin: null, rageTime: 0, rageAmp: 1,
        thunder: null, requiem: null, bloodTime: 0, bloodCooldown: 0,
        kaelPassiveTimer: 5, lastPassiveSpell: null, kaelSpellRank: 1,
        kaelMeteors: [], kaelIceWalls: [], kaelBlast: null, kaelSpirits: [],
        eclipse: null, tb: createTerrorbladeState(), dagonReadyAt: 6, cycloneReadyAt: 9, necroReadyAt: 12,
        necroUnits: [], spellHeals: [], lastHurtAt: 0, phaseSpeedUntil: 0, phaseAttackUntil: 0, returnReadyAt: 0 },
      terrain: buildTerrain(biome.id), enemyFlow: null, enemyFlowClock: 0,
      enemies: [], bullets: [], enemyBullets: [], pickups: [], effects: [], hazards: [],
      spawnClock: 0, nearbySpawnClock: 0, hazardClock: 8, specialSpawned: false, eliteIndex: 0, normalChestDropped: false, regenClock: 0, lifeClock: 0,
      bossFight: false, bossesRemaining: 0, pendingVictory: false, hudClock: 0, screenShake: 0,
      waveStartKills: 0, waveStartMoney: 0, waveStartPendingChests: 0, waveSummary: null,
      intermission: null
    };
  }
  function startRun() {
    createRun();
    startWave();
  }
  function waveDuration(pace = selectedPace) {
    if (pace === 'quick') return 15 + Math.min(6, run.wave * .3);
    if (run.wave <= 5) return 14 + run.wave * 4;
    return run.wave === MAX_WAVES || (isEndlessRun() && run.wave > MAX_WAVES && run.wave % 10 === 0)
      ? 90 : Math.min(60, 15 + run.wave * 5);
  }
  function startWave() {
    resetStick(); keys.clear(); moveTarget = null; moveFlow = null;
    run.wave += 1;
    run.elapsed = 0;
    resetBuffWave(run);
    run.timeLeft = waveDuration();
    run.spawnClock = .3;
    run.nearbySpawnClock = 0;
    run.hazardClock = 8;
    run.specialSpawned = false;
    run.normalChestDropped = false;
    run.bossFight = false;
    run.bossesRemaining = 0;
    run.pendingVictory = false;

    const souls = run.skills.souls, manualPickups = run.skills.manualPickups;
    Object.assign(run.skills, { activeCooldown: 0, receivedHits: 0, attackHits: 0, lastBasicAttack: 0,
      manualPickups, radianceClock: 0, mantaAttackCount: 0, mantaProcAttackId: 0, jump: null, leapCooldown: 0, spin: null, rageTime: 0,
      thunder: null, requiem: null, bloodTime: 0, souls,
      kaelPassiveTimer: 5,
      kaelMeteors: [], kaelIceWalls: [], kaelBlast: null, kaelSpirits: [], eclipse: null, tb: createTerrorbladeState(),
      necroUnits: [], phaseSpeedUntil: 0, phaseAttackUntil: 0 });
    run.enemies = []; run.bullets = []; run.enemyBullets = []; run.pickups = []; run.effects = []; run.hazards = [];
    run.player.invuln = 1;
    run.waveStartKills = run.kills;
    run.waveStartMoney = run.money;
    run.waveStartPendingChests = run.pendingChests;
    run.waveSummary = null;
    run.intermission = null;
    showPhase('combat');
    renderEquipmentStrip();
    updateHUD();
    $('pause-button').focus({ preventScroll: true });
    showToast(!isEndlessRun() && run.wave === MAX_WAVES ? t('finalWaveStart', { boss: bossDisplayName(bossVariantForWave(run.wave)) }) : t('waveStart', { wave: run.wave }));
    playSfx('wave-start');
  }
  function updateRecord() {
    const key = recordKey();
    save.records[key] = Math.max(save.records[key] || 0, run.wave);
    persist();
  }
  function renderResult(victory) {
    const endless = isEndlessRun();
    $('result-kicker').textContent = endless ? t('expeditionEnded') : victory ? t('expeditionComplete') : t('expeditionEnded');
    $('result-title').textContent = endless ? t('endlessReached', { wave: run.wave }) : victory ? t('coreCalmed') : t('reachedWave', { wave: run.wave });
    $('result-message').textContent = endless ? t('endlessMessage', { wave: run.wave }) : victory ? t('victoryMessage') : t('defeatMessage');
    $('result-stats').innerHTML = `<div><span>${t(victory && !endless ? 'completedWaves' : 'reachedWaveLabel')}</span><strong>${run.wave}${isEndlessRun() ? '' : ` / ${MAX_WAVES}`}</strong></div><div><span>${t('defeatedLabel')}</span><strong>${run.kills}</strong></div><div><span>${t('earnedMaterials')}</span><strong>${run.earned}</strong></div><div><span>${t('factor')}</span><strong>${endlessFactor().toFixed(2)}</strong></div><div><span>${t('characterLevel')}</span><strong>${run.level}</strong></div>`;
  }
  function endRun(victory) {
    if (studioMode) return;
    if (phase === 'result') return;
    if (run.character.id === 'tb') { run.skills.tb = createTerrorbladeState(); run.bullets = []; run.player.pendingAttack = null; }
    if (victory && !isEndlessRun()) save.wins += 1;
    updateRecord();
    showPhase('result');
    run.resultVictory = victory;
    renderResult(run.resultVictory);
    $('result-restart').focus({ preventScroll: true });
    playSfx(victory ? 'victory' : 'defeat');
    renderTitle();
  }


  function applyBonus(bonus) {
    for (const [key, value] of Object.entries(bonus)) {
      if (key === 'maxHp') { run.player.maxHp += value; heal(value); }
      else if (key === 'maxMana') { run.player.maxMana += value; run.player.mana = Math.min(run.player.maxMana, run.player.mana + value); }
      else if (key === 'heal') heal(value);
      else run.stats[key] = (run.stats[key] || 0) + value;
    }
  }
  function heal(amount) { run.player.hp = Math.min(run.player.maxHp, run.player.hp + amount); }
  function applyStatBlock(stats, direction = 1) {
    if (!stats) return;
    for (const [key, value] of Object.entries(stats)) {
      if (key === 'maxHp') {
        run.player.maxHp = Math.max(1, run.player.maxHp + value * direction);
        run.player.hp = Math.max(1, Math.min(run.player.maxHp, run.player.hp + value * direction));
      } else if (key === 'maxMana') {
        run.player.maxMana = Math.max(1, run.player.maxMana + value * direction);
        run.player.mana = Math.max(0, Math.min(run.player.maxMana, run.player.mana + value * direction));
      } else run.stats[key] = (run.stats[key] || 0) + value * direction;
    }
  }
  function applyEquipmentStats(id, direction = 1) { applyStatBlock(equipmentDef(id)?.stats, direction); }
  function buffCount(id) { return run?.buffs?.[id] || 0; }
  function addBuff(id) {
    const def = BUFFS[id];
    if (!def) return false;
    run.buffs[id] = buffCount(id) + 1;
    applyStatBlock(def.stats, 1);
    showToast(t('buffBought', { item: buffName(def), count: run.buffs[id] }));
    return true;
  }
  const WEAPON_TEXT = {
    'zh-CN': { reserve: '待用储备', reserveHint: '满格物品保留在这里，不提供属性、被动或羁绊；可装备、交换或作为合成材料。', reserveEmpty: '储备为空，满格后仍可继续收集。', active: '生效装备', stash: '移入储备', equip: '装备', swap: '交换装备', swapWith: '替换哪件生效装备', auto: '自动合成与同级升阶', target: '合成目标 {n}', none: '未追踪目标', forgeHint: '按目标顺序完成整条配方，重复成品自动三合一。可关闭自动化，继续手动合成。', forged: '自动完成 {count} 次合成／升阶', builds: '装备羁绊', independent: '独立成品 · 机动', members: '搭配装备', buildRule: '仅生效的不同成品计数，同名重复与强化等级不额外计件。', buildActive: '已激活', buildNext: '下一档 {count} 件', stored: '已收入储备：{item}', unlock: '圣剑铸造：通关第10波解锁（{wave}/10）', unlocked: '本局圣剑已解锁：高额剑气伤害，同时增加承伤。', summary: '生效 {active}/12 · 储备 {reserve} 件', quality: '品级 {grade} · {name}', level: '强化 Lv.{level}', qualities: ['普通','精良','稀有','史诗','传说'] },
    'zh-TW': { reserve: '待用儲備', reserveHint: '滿格物品保留在這裡，不提供屬性、被動或羈絆；可裝備、交換或作為合成材料。', reserveEmpty: '儲備為空，滿格後仍可繼續收集。', active: '生效裝備', stash: '移入儲備', equip: '裝備', swap: '交換裝備', swapWith: '替換哪件生效裝備', auto: '自動合成與同級升階', target: '合成目標 {n}', none: '未追蹤目標', forgeHint: '按目標順序完成整條配方，重複成品自動三合一。可關閉自動化，繼續手動合成。', forged: '自動完成 {count} 次合成／升階', builds: '裝備羈絆', independent: '獨立成品 · 機動', members: '搭配裝備', buildRule: '僅生效的不同成品計數，同名重複與強化等級不額外計件。', buildActive: '已啟用', buildNext: '下一檔 {count} 件', stored: '已收入儲備：{item}', unlock: '聖劍鑄造：通關第10波解鎖（{wave}/10）', unlocked: '本局聖劍已解鎖：高額劍氣傷害，同時增加承傷。', summary: '生效 {active}/12 · 儲備 {reserve} 件', quality: '品級 {grade} · {name}', level: '強化 Lv.{level}', qualities: ['普通','精良','稀有','史詩','傳說'] },
    en: { reserve: 'Reserve', reserveHint: 'Overflow items stay here without stats, passives or set bonuses. Equip, swap, sell or craft with them.', reserveEmpty: 'Reserve is empty. Full slots never stop collecting.', active: 'Active equipment', stash: 'Store in reserve', equip: 'Equip', swap: 'Swap equipment', swapWith: 'Active item to replace', auto: 'Auto craft and merge', target: 'Crafting priority {n}', none: 'No tracked target', forgeHint: 'Complete whole recipes in priority order; merge matching finished items automatically. Disable to craft manually.', forged: '{count} automatic craft / merge action(s)', builds: 'Equipment synergies', independent: 'Independent · Mobility', members: 'Matching gear', buildRule: 'Count unique active finished items. Copies and upgrade levels do not add set pieces.', buildActive: 'Active', buildNext: 'Next tier: {count} items', stored: 'Stored in reserve: {item}', unlock: 'Divine Rapier: clear wave 10 to unlock ({wave}/10)', unlocked: 'Divine Rapier unlocked for this run: powerful sword waves, with increased damage taken.', summary: 'Active {active}/12 · Reserve {reserve}', quality: 'Grade {grade} · {name}', level: 'Upgrade Lv.{level}', qualities: ['Common','Uncommon','Rare','Epic','Legendary'] }
  };
  function wt(key, values = {}) {
    return Object.entries(values).reduce((value, [name, replacement]) => value.replaceAll(`{${name}}`, replacement), WEAPON_TEXT[selectedLocale][key]);
  }
  function equipmentAttributes(def) { return `data-grade="${def.grade}" data-upgrade-level="${EQUIPMENT_UPGRADES[def.id] ? def.level : 0}"`; }
  function equipmentBadges(def) {
    return `<span class="equipment-quality">${wt('quality', { grade: def.grade, name: WEAPON_TEXT[selectedLocale].qualities[def.grade - 1] })}</span>${EQUIPMENT_UPGRADES[def.id] ? `<span class="equipment-level">${wt('level', { level: def.level })}</span>` : ''}${equipmentBuilds(def.id).map(id => `<span class="equipment-build-tag">${buildName(id, selectedLocale)}</span>`).join('')}${def.kind === 'finished' && !equipmentBuilds(def.id).length ? `<span class="equipment-build-tag">${wt('independent')}</span>` : ''}`;
  }
  function allEquipment() { return [...run.equipment, ...run.equipmentReserve]; }
  function unlockedEquipment(id) { return !EQUIPMENT[id].hidden || run.wave >= 10; }
  function craftPlans(incomingId = null) { return availableEquipmentCrafts(allEquipment(), incomingId).filter(plan => unlockedEquipment(plan.id)); }
  function commitLoadout(next, preserveResources = true) {
    if (!next) return false;
    const hp = run.player.hp, mana = run.player.mana, delta = {};
    for (const [items, sign] of [[run.equipment, -1], [next.active, 1]]) for (const item of items) {
      for (const [key, value] of Object.entries(equipmentDef(item).stats)) delta[key] = (delta[key] || 0) + sign * value;
    }
    applyStatBlock(delta);
    if (preserveResources) { run.player.hp = Math.min(hp, run.player.maxHp); run.player.mana = Math.min(mana, run.player.maxMana); }
    run.equipment = next.active; run.equipmentReserve = next.reserve;
    run.builds = resolveBuilds(run.equipment);
    equipmentCombat.syncLoadout();
    return true;
  }
  function autoForge() {
    if (!run.autoForge) return;
    const targets = [...new Set(run.forgeTargets.filter(id => id && unlockedEquipment(id)))];
    const next = automate(run.equipment, run.equipmentReserve, targets, createEquipment, run.equipmentCapacity);
    if (next?.actions.length && commitLoadout(next)) {
      showToast(wt('forged', { count: next.actions.length })); playSfx('merge');
    }
  }
  function equipmentCanFit(extra = 1) { return !!run && run.equipment.length + extra <= run.equipmentCapacity; }
  function equipmentGroups(items = allEquipment()) {
    const groups = new Map();
    for (const item of items) {
      const key = `${item.id}:${equipmentLevel(item)}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    }
    return [...groups.values()];
  }
  function addEquipment(id, silent = false) {
    const def = equipmentDef(id);
    if (!def || !unlockedEquipment(id)) return false;
    const next = acquisition(run.equipment, run.equipmentReserve, createEquipment(id), run.equipmentCapacity);
    if (!commitLoadout(next, false)) return false;
    if (!silent) showToast(next.location === 'reserve' ? wt('stored', { item: equipmentName(def) }) : t('acquired', { item: equipmentName(def) }));
    return true;
  }
  function craftEquipment(id, incomingId = null) {
    if (!run || !['shop', 'chest'].includes(phase) || !unlockedEquipment(id)) return false;
    const next = craftLoadout(run.equipment, run.equipmentReserve, id, createEquipment, run.equipmentCapacity, incomingId);
    if (!commitLoadout(next)) return false;
    showToast(t('merged', { item: equipmentName(equipmentDef(id)) })); playSfx('merge');
    autoForge();
    return true;
  }
  function equipmentSellPrice(item) { return equipmentResale(item); }
  function upgradeEquipment(itemUid, batch = false) {
    if (!run || !['shop', 'chest'].includes(phase)) return false;
    const next = upgradeLoadout(run.equipment, run.equipmentReserve, itemUid, createEquipment, run.equipmentCapacity, batch);
    if (!commitLoadout(next)) return false;
    autoForge();
    if (phase === 'shop') renderShop(); else renderChestReward();
    renderEquipmentStrip(); focusCraftResult();
    showToast(t('merged', { item: equipmentName(equipmentDef(next.result)) })); playSfx('merge');
    return true;
  }

  function equipmentUpgradeControls(item, count) {
    if (!EQUIPMENT_UPGRADES[item.id]) return '';
    const level = equipmentLevel(item);
    if (level === 3) return `<span class="upgrade-max">${t('upgradeMax')}</span>`;
    const next = equipmentDef({ id: item.id, level: level + 1 });
    const actual = t('upgradeActual', { crit: clamp(run.stats.crit, 0, 90), dodge: clamp(run.stats.dodge, 0, 55), haste: clamp(run.stats.abilityHaste, 0, 60) });
    return `<details class="upgrade-preview"><summary>${t('upgradePreview')}</summary><p><strong>${equipmentName(next)}</strong></p><p>${equipmentUpgradeDescription(next, selectedLocale)}</p><p>${t('upgradeKept')}</p><p>${actual}</p></details><div class="craft-actions"><button class="upgrade-button" type="button" data-upgrade="${item.uid}" ${count < 3 ? 'disabled' : ''}>${t('upgradeTo', { level: level + 1, count })}</button>${count >= 6 ? `<button class="upgrade-button" type="button" data-upgrade="${item.uid}" data-batch="true">${t('upgradeBatch', { level: level + 1, groups: Math.floor(count / 3) })}</button>` : ''}</div>`;
  }

  function focusCraftResult(id) {
    const target = phase === 'chest' ? '#chest-craft-list button:not(:disabled), #chest-take-button:not(:disabled), #chest-scrap-button'
      : id ? `#quick-craft-list [data-craft="${id}"]` : '#craft-hub-summary';
    (document.querySelector(target) || $('craft-hub-summary')).focus();
  }

  function equipmentPool() {
    return EQUIPMENT_IDS.filter(id => EQUIPMENT[id].kind === 'component' && EQUIPMENT[id].grade <= (run.wave >= 3 ? 2 : 1));
  }
  function weightedEquipment(pool) {
    const magicHero = run.character.id === 'conductor';
    const weights = pool.map(id => {
      const stats = EQUIPMENT[id].stats;
      return 1 + (magicHero ? (stats.elemental ? .65 : stats.manaRegen ? .45 : 0) : (stats.attackDamage ? .4 : 0))
        + (stats.maxHp || stats.armor || stats.regen ? .2 : 0);
    });
    let roll = Math.random() * weights.reduce((a, b) => a + b, 0);
    return pool.find((_, i) => (roll -= weights[i]) < 0) || pool[pool.length - 1];
  }
  function randomEquipmentId() { return weightedEquipment(equipmentPool()); }
  function shopRates() { return { finished: run.wave >= 10 ? .06 : run.wave >= 5 ? .04 : .02, intermediate: run.wave >= 10 ? .14 : run.wave >= 5 ? .1 : 0 }; }
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
  function kaelVolleyText(count) {
    return selectedLocale === 'en' ? `Tornado / Meteor: ${count} each`
      : selectedLocale === 'zh-TW' ? `風／隕石：各 ${count} 個` : `风／陨石：各 ${count} 个`;
  }
  function levelChoiceDescription(choice) {
    if (run.character.id !== 'kael' || !choice.bonus.elemental) return choice.desc;
    const rank = run.skills.kaelSpellRank;
    return `${choice.desc} · ${kaelVolleyText(rank < 3 ? `${rank} → ${rank + 1}` : '3 / 3')}`;
  }
  function renderLevelChoices() {
    $('levels-left').textContent = t('levelsLeft', { count: run.pendingLevels });
    $('level-options').innerHTML = run.levelChoices.map((u, i) => `<button class="choice-option" type="button" data-level="${i}"><span class="choice-icon">${artIcon(`upgrade-${UPGRADES.indexOf(u)}`, u.icon)}</span><strong>${u.name}</strong><span>${levelChoiceDescription(u)}</span></button>`).join('');
  }
  function finishWave() {
    if (phase !== 'combat') return;
    if (run.character.id === 'tb') { run.skills.tb = createTerrorbladeState(); run.player.pendingAttack = null; }
    collectRemainingPickups();
    const paceBonus = !studioMode && run.wave <= 5 && selectedPace === 'quick'
      ? Math.round((run.money - run.waveStartMoney) * (waveDuration('normal') / waveDuration() - 1)) : 0;
    const supply = !studioMode && run.wave <= 5
      ? paceBonus + (run.wave === 1 ? Math.max(24, 40 - run.money - paceBonus) : 10) : 0;
    run.money += supply; run.earned += supply;
    run.enemies = []; run.enemyBullets = []; run.bullets = [];
    run.waveSummary = {
      wave: run.wave,
      kills: run.kills - run.waveStartKills,
      money: run.money - run.waveStartMoney,
      supply,
      chests: run.pendingChests - run.waveStartPendingChests,
      level: run.level,
      nextWave: isEndlessRun() || run.wave < MAX_WAVES ? run.wave + 1 : null
    };
    beginWaveSummary();
    playSfx('wave-end');
  }
  function beginWaveSummary() {
    run.intermission = { kind: 'summary', time: run.wave <= 5 ? 2 : 3.5 };
    renderWaveResult();
    showPhase('wave-result');
    $('wave-result-continue').focus({ preventScroll: true });
  }
  function beginNextWaveCountdown() {
    if (!run || (!isEndlessRun() && run.wave >= MAX_WAVES) || phase !== 'shop') return;
    run.intermission = { kind: 'next', time: run.wave <= 5 ? 1 : 3 };
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
    $('wave-result-kicker').textContent = isNext ? t('wavePrepare') : t('waveSummary');
    $('wave-result-title').textContent = isNext ? t('nextWaveTitle', { wave: summary.nextWave }) : t('waveDoneTitle', { wave: summary.wave });
    $('wave-result-message').textContent = isNext
      ? t('nextWaveMessage')
      : (summary.nextWave ? t('lootMessage') : t('finalWaveMessage')) + (summary.supply ? ` ${t('waveSupply', { amount: summary.supply })}` : '');
    $('wave-result-stats').innerHTML = isNext
      ? `<div><span>${t('aboutToStart')}</span><strong>${t('bestWave', { wave: summary.nextWave })}</strong></div><div><span>${t('currentDifficulty')}</span><strong>${run.difficulty.name}</strong></div>`
      : `<div><span>${t('defeated', { kills: '' }).replace(' ', '')}</span><strong>${summary.kills}</strong></div><div><span>${t('waveMaterials')}</span><strong>◇ ${summary.money}</strong></div><div><span>${t('pendingChests')}</span><strong>${summary.chests}</strong></div><div><span>${t('currentLevel')}</span><strong>${summary.level}</strong></div>`;
    $('wave-result-continue').textContent = isNext ? t('startNow') : t('waveContinue');
    updateWaveResultCountdown();
  }
  function updateWaveResultCountdown() {
    if (!run?.intermission) return;
    const time = Math.max(0, run.intermission.time);
    $('wave-result-countdown').textContent = t('seconds', { time: time.toFixed(1) });
    $('wave-result-countdown').setAttribute('aria-label', t('secondsRemaining', { time: time.toFixed(1) }));
  }
  function finishChestSequence() {
    if (!isEndlessRun() && run.wave >= MAX_WAVES) endRun(true);
    else if (run.pendingLevels > 0) levelOffers();
    else openShop();
  }
  function openChest() {
    run.chestReward = { id: randomEquipmentId() };
    renderChestReward();
    showPhase('chest');
    playSfx('chest-open');
    $('chest-take-button').focus({ preventScroll: true });
  }
  function renderChestReward() {
    const def = equipmentDef(run.chestReward.id);
    $('chests-left').textContent = run.pendingChests;
    const canTake = equipmentCanFit();
    const plans = craftPlans(run.chestReward.id);
    $('chest-reward').innerHTML = `<span class="chest-reward-icon">${equipmentIcon(run.chestReward.id)}</span><div><strong>${equipmentName(def)}</strong><p>${equipmentDesc(def)}</p>${equipmentBadges(def)}${canTake ? '' : `<p class="equipment-full-note">${wt('reserveHint')}</p>`}</div>`;
    const organize = canTake ? '' : craftPlans().map(plan => `<button type="button" data-chest-organize="${plan.id}">${t('craftTarget', { item: equipmentName(equipmentDef(plan.id)) })}</button>`).join('')
      + equipmentGroups().filter(group => equipmentUpgradeIndices(allEquipment(), group[0].uid)).map(group => `<button type="button" data-upgrade="${group[0].uid}">${equipmentName(equipmentDef(group[0]))} · ${t('upgradeTo', { level: equipmentLevel(group[0]) + 1, count: group.length })}</button>`).join('');
    $('chest-craft-list').innerHTML = plans.map(plan => `<button type="button" data-chest-craft="${plan.id}">${t('takeCraft', { item: equipmentName(equipmentDef(plan.id)) })}</button>`).join('')
      + (organize ? `<details class="chest-organize"><summary>${t('chestOrganize')}</summary><div class="craft-actions">${organize}</div></details>` : '');
    $('chest-scrap-button').textContent = t('scrapFor', { amount: Math.round(def.price * .5) });
    $('chest-take-button').disabled = false;
    $('chest-take-button').title = canTake ? '' : wt('reserveHint');
  }
  function resolveChest(take, targetId = null) {
    if (phase !== 'chest' || !run.chestReward) return;
    const item = equipmentDef(run.chestReward.id);
    if (take && targetId) {
      if (!craftEquipment(targetId, run.chestReward.id)) return;
    } else if (take) {
      if (!addEquipment(run.chestReward.id)) return;
    }
    else {
      const salvage = Math.round(item.price * .5);
      run.money += salvage; run.earned += salvage;
      showToast(t('scrapItem', { item: equipmentName(item), amount: salvage }));
    }
    autoForge();
    run.pendingChests -= 1;
    run.chestReward = null;
    renderEquipmentStrip();
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
      showToast(t('autoRecover', { count: chests, status: recovered ? t('healthGain', { amount: recovered }) : t('fullHealth') }));
    }
    run.pickups = [];
  }

  function openShop() {
    autoForge();
    run.rerolls = 0;
    restockShop();
    heal(2 + Math.round(run.player.maxHp * .16));
    showPhase('shop'); renderShop();
    $('shop-screen').querySelector('.shop-card').scrollTop = 0;
    $('craft-hub-summary').focus({ preventScroll: true });
  }
  function recipeComponentHint(excluded) {
    const pool = equipmentPool().filter(id => !excluded.has(id));
    let best = null, bestProgress = 0;
    for (const def of Object.values(EQUIPMENT)) {
      if (!def.recipe) continue;
      if (!unlockedEquipment(def.id || Object.keys(EQUIPMENT).find(id => EQUIPMENT[id] === def))) continue;
      const missing = def.recipe.filter(id => !allEquipment().some(item => item.id === id));
      const progress = (def.recipe.length - missing.length) / def.recipe.length;
      if (!progress || !missing.length) continue;
      for (const id of missing.filter(id => pool.includes(id))) {
        if (progress > bestProgress || (progress === bestProgress && EQUIPMENT[id].price < EQUIPMENT[best].price)) {
          best = id; bestProgress = progress;
        }
      }
    }
    return best;
  }
  function restockShop() {
    const offers = Array.from({ length: SHOP_OFFER_COUNT }, (_, i) => run.shopOffers[i]?.locked ? run.shopOffers[i] : null);
    const used = new Set(offers.filter(offer => offer?.kind === 'equipment').map(offer => offer.id));
    let components = offers.filter(offer => offer?.kind === 'equipment' && EQUIPMENT[offer.id].kind === 'component').length;
    let hint = run.wave <= 5 ? recipeComponentHint(used) : null;
    for (let i = 0; i < SHOP_OFFER_COUNT - 1; i++) {
      if (offers[i]) continue;
      offers[i] = randomShopOffer(run.wave <= 5 && components < 2 ? 'component' : null, used, hint);
      used.add(offers[i].id);
      if (EQUIPMENT[offers[i].id].kind === 'component') components += 1;
      hint = null;
    }
    offers[SHOP_OFFER_COUNT - 1] ||= randomShopOffer('buff');
    run.shopOffers = offers;
  }
  function randomShopOffer(forceKind = null, excluded = new Set(), hint = null) {
    if (forceKind === 'buff') {
      const id = randomBuff(run.wave, run.stats.luck), def = BUFFS[id];
      const baseCost = def.price + run.wave * 1.4;
      return { kind: 'buff', id, cost: Math.round(baseCost * (1 + endlessFactor() / 5)), locked: false };
    }
    const rates = shopRates(), roll = Math.random();
    const kind = hint ? 'component' : forceKind || (roll < rates.finished ? 'finished' : roll < rates.finished + rates.intermediate ? 'intermediate' : 'component');
    const pool = (kind === 'component' ? equipmentPool() : EQUIPMENT_IDS.filter(id => EQUIPMENT[id].kind === kind && unlockedEquipment(id))).filter(id => !excluded.has(id));
    const id = hint || weightedEquipment(pool);
    const baseCost = EQUIPMENT[id].price + run.wave * 1.4;
    return { kind: 'equipment', id, cost: Math.round(baseCost * (1 + endlessFactor() / 5)), locked: false };
  }
  function equipmentKind(def) { return t(def.kind); }
  function shopRerollCost() {
    const freeFirst = run.wave <= 5;
    if (freeFirst && run.rerolls === 0) return 0;
    return Math.round((3 + run.wave + Math.max(0, run.rerolls - (freeFirst ? 1 : 0)) * 3) * (1 + endlessFactor() / 5));
  }
  function craftSourceText(plan) {
    const counts = new Map();
    for (const item of allEquipment().filter(item => plan.consumeUids.includes(item.uid))) counts.set(item.id, (counts.get(item.id) || 0) + 1);
    return [...counts].map(([id, count]) => `${equipmentName(equipmentDef(id))}${count > 1 ? ` ×${count}` : ''}`).join(' + ');
  }
  function recipeProgress(def) {
    const remaining = allEquipment().map(item => item.id);
    return def.recipe.reduce((count, id) => {
      const index = remaining.indexOf(id);
      if (index < 0) return count;
      remaining.splice(index, 1);
      return count + 1;
    }, 0);
  }
  function renderCraftHub(plans, groups) {
    const upgradeGroups = groups.filter(group => EQUIPMENT_UPGRADES[group[0].id] && equipmentLevel(group[0]) < 3)
      .sort((a, b) => Number(b.length >= 3) - Number(a.length >= 3));
    $('craft-hub-summary').textContent = t('craftSummary', { crafts: plans.length,
      upgrades: upgradeGroups.reduce((total, group) => total + Math.floor(group.length / 3), 0), used: run.equipment.length, capacity: run.equipmentCapacity });
    const upgradeCard = group => {
      const item = group[0];
      return `<div class="quick-craft-card ${group.length >= 3 ? 'is-ready' : ''}" ${equipmentAttributes(equipmentDef(item))}><span class="craft-kind">${t('upgradeGroup', { level: equipmentLevel(item), count: group.length, groups: Math.floor(group.length / 3) })}</span><strong>${equipmentIcon(item.id)} ${equipmentName(equipmentDef(item))}</strong>${equipmentUpgradeControls(item, group.length)}</div>`;
    };
    const ready = plans.map(plan => {
      const def = equipmentDef(plan.id);
      return `<div class="quick-craft-card is-ready" ${equipmentAttributes(def)}><span class="craft-kind">${t('craftKind')}</span><strong>${equipmentIcon(plan.id)} ${equipmentName(def)}</strong><p class="craft-meta">${t('craftInputs', { items: craftSourceText(plan) })}</p>${plan.steps.length > 1 ? `<p class="craft-meta">${t('craftRoute', { items: plan.steps.map(id => equipmentName(equipmentDef(id))).join(' → ') })}</p>` : ''}<details class="upgrade-preview"><summary>${t('craftResult')}</summary><p>${equipmentDesc(def)}</p></details><div class="craft-actions"><button type="button" data-craft="${plan.id}">${t(plan.steps.length > 1 ? 'craftChain' : 'craftTarget', { item: equipmentName(def) })}</button></div></div>`;
    }).join('') + upgradeGroups.filter(group => group.length >= 3).map(upgradeCard).join('');
    const incomplete = upgradeGroups.filter(group => group.length < 3);
    $('quick-craft-list').innerHTML = (ready || `<p class="craft-empty">${t('craftEmpty')}</p>`)
      + (incomplete.length ? `<details class="craft-progress"><summary>${t('upgradeProgress', { count: incomplete.length })}</summary><div class="quick-craft-list">${incomplete.map(upgradeCard).join('')}</div></details>` : '');
  }
  function renderShop() {
    $('shop-wave').textContent = t('waveComplete', { wave: run.wave });
    const hasNextWave = isEndlessRun() || run.wave < MAX_WAVES;
    const rates = shopRates();
    $('shop-next-wave').textContent = (hasNextWave ? t('nextWaveHint', { wave: run.wave + 1 }) : t('finalWaveDone')) + ' · ' + t('shopRates', { finished: Math.round(rates.finished * 100), intermediate: Math.round(rates.intermediate * 100) });
    $('next-wave-button').textContent = hasNextWave ? t('startWaveButton', { wave: run.wave + 1 }) : t('viewResult');
    $('shop-money').textContent = run.money;
    const oddsLocale = selectedLocale === 'en' ? 'en-US' : selectedLocale;
    $('buff-rarity-legend').innerHTML = `<span>${t('buffChances', { luck: run.stats.luck })}</span>` + Object.entries(buffRarityChances(run.wave, run.stats.luck)).map(([rarity, chance]) => `<span class="buff-rarity" data-buff-rarity="${rarity}">${t('buffRarity_' + rarity)} ${(chance * 100).toLocaleString(oddsLocale, { maximumFractionDigits: 2 })}%</span>`).join('');
    $('shop-offers').innerHTML = run.shopOffers.map((offer, i) => {
      if (!offer) return `<div class="offer-card" aria-label="${t('soldOut')}"><span class="tier-label">${t('soldOut')}</span></div>`;
      const isBuff = offer.kind === 'buff';
      const def = isBuff ? BUFFS[offer.id] : equipmentDef(offer.id);
      const disabled = run.money < offer.cost;
      const reason = run.money < offer.cost ? t('insufficient') : t('fullEquipment');
      const name = isBuff ? buffName(def) : equipmentName(def);
      const desc = isBuff ? buffDesc(def) : equipmentDesc(def);
      const icon = isBuff ? buffIcon(def) : equipmentIcon(offer.id);
      const tier = isBuff ? `${buffRarityBadge(def)} ${t('buffKind')} · ${t('buffStack', { count: buffCount(offer.id) })}` : `${equipmentKind(def)} · ${equipmentBadges(def)}`;
      const plans = isBuff ? [] : craftPlans(offer.id);
      const uses = isBuff ? [] : EQUIPMENT_IDS.filter(id => EQUIPMENT[id].recipe?.includes(offer.id) && unlockedEquipment(id));
      const canUpgrade = !isBuff && EQUIPMENT_UPGRADES[offer.id] && allEquipment().filter(item => item.id === offer.id && equipmentLevel(item) === 1).length >= 2;
      const craftActions = plans.map(plan => `<button type="button" data-buy="${i}" data-buy-craft="${plan.id}" ${run.money < offer.cost ? 'disabled' : ''}>${t('buyCraft', { cost: offer.cost, item: equipmentName(equipmentDef(plan.id)) })}</button>`).join('')
        + (canUpgrade ? `<button type="button" data-buy="${i}" data-buy-upgrade="true" ${run.money < offer.cost ? 'disabled' : ''}>${t('buyUpgrade', { cost: offer.cost })}</button>` : '');
      return `<div class="offer-card ${isBuff ? 'buff-offer' : def.kind === 'finished' ? 'finished-equipment' : ''} ${offer.locked ? 'locked' : ''}" ${isBuff ? `data-buff-rarity="${def.rarity}"` : equipmentAttributes(def)}><div class="offer-head"><span class="offer-icon">${icon}</span><span class="tier-label">${tier}</span></div><strong>${name}</strong><p>${desc}</p>${uses.length ? `<p class="offer-craft-hint">${t('craftUses', { items: uses.map(id => equipmentName(equipmentDef(id))).join(' / ') })}</p>` : ''}${craftActions ? `<details class="offer-craft-actions"><summary>${t('craftChoices', { count: plans.length + Number(!!canUpgrade) })}</summary><div class="craft-actions">${craftActions}</div></details>` : ''}<div class="offer-actions"><button class="buy-button" type="button" data-buy="${i}" ${disabled ? `disabled title="${reason}"` : ''}>◇ ${offer.cost} ${t('buy')}</button><button type="button" data-lock="${i}" aria-label="${offer.locked ? t('unlock') : t('lock')} ${name}" aria-pressed="${offer.locked}">${offer.locked ? t('locked') : t('lock')}</button></div></div>`;
    }).join('');
    const rerollCost = shopRerollCost();
    $('reroll-button').textContent = rerollCost === 0 ? t('freeRefresh') : t('refresh', { cost: rerollCost });
    $('reroll-button').disabled = run.money < rerollCost;
    const groups = equipmentGroups(), plans = craftPlans();
    renderCraftHub(plans, groups);
    renderForgeSettings();
    $('inventory').innerHTML = inventoryCards(run.equipment, false);
    $('reserve-inventory').innerHTML = inventoryCards(run.equipmentReserve, true);
    $('reserve-title').textContent = wt('reserve');
    $('reserve-caption').textContent = wt('reserveHint');
    $('active-equipment-title').textContent = wt('active');
    $('shop-build-title').textContent = wt('builds');
    $('build-rule').textContent = wt('buildRule');
    $('shop-builds').innerHTML = buildCards();
    $('buff-list').innerHTML = BUFF_IDS.filter(id => buffCount(id) > 0).map(id => {
      const def = BUFFS[id];
      const chargeNote = id === 'shallowGrave' ? `<small>${t('buffNextCharges', { count: buffCount(id) })}</small>` : '';
      return `<div class="buff-item" data-buff-rarity="${def.rarity}">${buffIcon(def)}<div><strong>${buffName(def)}</strong>${buffRarityBadge(def)}<small>${t('buffStack', { count: buffCount(id) })}</small>${chargeNote}<p>${buffDesc(def)}</p></div></div>`;
    }).join('') || `<p class="buff-empty">${t('buffEmpty')}</p>`;
    $('buff-list').insertAdjacentHTML('beforeend', `<p class="buff-empty">${t('buffLimits')}</p>`);
    $('recipe-list').innerHTML = EQUIPMENT_IDS.filter(id => equipmentDef(id).recipe && unlockedEquipment(id))
      .sort((a, b) => Number(!!planEquipmentCraft(allEquipment(), b)) - Number(!!planEquipmentCraft(allEquipment(), a)) || recipeProgress(equipmentDef(b)) / EQUIPMENT[b].recipe.length - recipeProgress(equipmentDef(a)) / EQUIPMENT[a].recipe.length).map(id => {
      const def = equipmentDef(id), plan = planEquipmentCraft(allEquipment(), id), ready = !!plan;
      const parts = def.recipe.map(part => `<span class="recipe-node ${allEquipment().some(item => item.id === part) ? '' : 'missing'}">${equipmentIcon(part)} ${equipmentName(equipmentDef(part))}</span>`).join('<span class="recipe-arrow" aria-hidden="true">+</span>');
      return `<div class="recipe-card ${def.kind === 'finished' ? 'finished-equipment' : ''} ${ready ? 'is-ready' : ''}" ${equipmentAttributes(def)}><strong>${equipmentIcon(id)} ${equipmentName(def)}</strong>${equipmentBadges(def)}<span class="recipe-chain">${parts}</span><span class="recipe-progress">${t('craftProgress', { owned: recipeProgress(def), total: def.recipe.length })}</span>${plan?.steps.length > 1 ? `<p>${t('craftRoute', { items: plan.steps.map(step => equipmentName(equipmentDef(step))).join(' → ') })}</p>` : ''}<p>${equipmentDesc(def)}</p><button type="button" data-craft="${id}" ${ready ? '' : 'disabled'}>${t(plan?.steps.length > 1 ? 'craftChain' : 'craftTarget', { item: equipmentName(def) })}</button></div>`;
    }).join('');
    $('shop-stats').textContent = statSummary();
  }
  function inventoryCards(items, reserve) {
    if (!items.length) return `<p class="reserve-caption">${reserve ? wt('reserveEmpty') : t('emptyEquipment')}</p>`;
    return equipmentGroups(items).map(group => {
      const item = group[0], def = equipmentDef(item);
      const swap = reserve && !equipmentCanFit() ? `<label>${wt('swapWith')}<select data-swap-for="${item.uid}">${run.equipment.map(active => `<option value="${active.uid}">${equipmentName(equipmentDef(active))}</option>`).join('')}</select></label>` : '';
      return `<div class="inventory-item ${def.kind === 'finished' ? 'finished-equipment' : ''}" data-equipment-uid="${item.uid}" data-equipment-id="${item.id}" ${equipmentAttributes(def)} tabindex="-1"><strong>${equipmentIcon(item.id)} ${equipmentName(def)}</strong><span class="inventory-count">${group.length} ${reserve ? wt('reserve') : wt('active')}</span>${equipmentBadges(def)}<p>${equipmentDesc(def)}</p><div class="equipment-actions">${swap}<button type="button" data-move="${item.uid}" data-to-active="${reserve}">${reserve ? wt(equipmentCanFit() ? 'equip' : 'swap') : wt('stash')}</button><button type="button" data-sell="${item.uid}">${t('sellOne', { price: equipmentSellPrice(item) })}</button></div></div>`;
    }).join('');
  }
  function buildCards() {
    return (run.builds.length ? run.builds : resolveBuilds(run.equipment)).map(build => {
      const status = [build.tier ? wt('buildActive') : '', build.next ? wt('buildNext', { count: build.next }) : ''].filter(Boolean).join(' · ');
      const members = build.members.map(id => `<span class="equipment-build-tag" data-equipped="${build.items.includes(id)}">${equipmentName(EQUIPMENT[id])}${build.items.includes(id) ? ` · ${wt('buildActive')}` : ''}</span>`).join('');
      return `<div class="build-card" data-build-id="${build.id}" data-active="${build.tier > 0}"><strong>${buildName(build.id, selectedLocale)} · ${build.count}/${build.thresholds.at(-1)}</strong><span>${status}</span><p>${buildDescription(build.id, selectedLocale)}</p><details class="build-members"><summary>${wt('members')}</summary>${members}</details></div>`;
    }).join('');
  }
  function renderForgeSettings() {
    $('forge-settings').innerHTML = `<label class="forge-auto"><input type="checkbox" id="auto-forge" ${run.autoForge ? 'checked' : ''}>${wt('auto')}</label>` + run.forgeTargets.map((target, index) => `<label>${wt('target', { n: index + 1 })}<select data-forge-target="${index}"><option value="">${wt('none')}</option>${EQUIPMENT_IDS.filter(id => EQUIPMENT[id].kind === 'finished' && unlockedEquipment(id)).map(id => `<option value="${id}" ${target === id ? 'selected' : ''}>${equipmentName(equipmentDef(id))}</option>`).join('')}</select></label>`).join('') + `<p>${wt('forgeHint')}</p>`;
    $('equipment-summary').textContent = wt('summary', { active: run.equipment.length, reserve: run.equipmentReserve.length });
    $('forge-unlock').textContent = wt(run.wave >= 10 ? 'unlocked' : 'unlock', { wave: Math.min(10, run.wave) });
  }
  function focusShopControl(preferred) {
    const preferredButton = document.querySelector(preferred);
    const nextButton = [preferredButton, ...document.querySelectorAll('#shop-offers [data-buy]'), $('reroll-button'), $('next-wave-button')]
      .find(button => button && !button.disabled && button.getClientRects().length);
    nextButton?.focus({ preventScroll: true });
  }

  function statSummary() {
    const s = run.stats;
    const signed = value => `${value >= 0 ? '+' : ''}${value}`;
    return `${t('statLife')} ${Math.ceil(run.player.hp)}/${run.player.maxHp} · ${t('statAttackDamage')} ${signed(Number(physicalBonus().toFixed(2)))} · ${t('statSpellBonus')} ${signed(s.elemental)} · ${t('statAllDamage')} ${signed(s.damage)}% · ${t('statAttackSpeed')} ${signed(attackSpeed().toFixed(0))}% · ${t('statArmor')} ${s.armor}`;
  }
  function renderEquipmentStrip() {
    $('equipment-strip').innerHTML = run.equipment.map(item => {
      const def = equipmentDef(item), name = equipmentName(def);
      return `<span class="equipment-slot ${def.kind === 'finished' ? 'finished-equipment' : ''}" ${equipmentAttributes(def)} role="img" aria-label="${name}" title="${name}: ${equipmentDesc(def)}">${equipmentIcon(item.id)}<small>${EQUIPMENT_UPGRADES[item.id] ? `Lv.${def.level}` : def.grade}</small></span>`;
    }).join('');
  }
  function buyOffer(index, targetId = null, upgrade = false) {
    if (!run || phase !== 'shop') return;
    const offer = run.shopOffers[index];
    if (!offer || run.money < offer.cost) return;
    if ((targetId || upgrade) && offer.kind === 'buff') return;
    if (offer.kind === 'buff') {
      run.money -= offer.cost;
      addBuff(offer.id);
      run.shopOffers[index] = null;
      renderShop(); playSfx('buy');
      focusShopControl(`#shop-offers [data-buy="${(index + 1) % run.shopOffers.length}"]`);
      return;
    }
    if (targetId) {
      if (!craftEquipment(targetId, offer.id)) return;
    } else if (upgrade) {
      const pair = allEquipment().filter(item => item.id === offer.id && equipmentLevel(item) === 1).slice(0, 2);
      if (!EQUIPMENT_UPGRADES[offer.id] || pair.length !== 2) return;
      const acquired = acquisition(run.equipment, run.equipmentReserve, createEquipment(offer.id), run.equipmentCapacity);
      if (!acquired) return;
      const next = upgradeLoadout(acquired.active, acquired.reserve, pair[0].uid, createEquipment, run.equipmentCapacity);
      if (!commitLoadout(next)) return;
    } else if (!addEquipment(offer.id)) return;
    run.money -= offer.cost;
    run.shopOffers[index] = null;
    autoForge();
    renderShop(); renderEquipmentStrip(); playSfx('buy');
    if (targetId || upgrade) focusCraftResult(targetId);
    else focusShopControl(`#shop-offers [data-buy="${(index + 1) % run.shopOffers.length}"]`);
  }
  function sellEquipment(itemUid) {
    const item = allEquipment().find(item => item.uid === itemUid);
    if (!item || phase !== 'shop') return;
    const next = { active: run.equipment.filter(item => item.uid !== itemUid), reserve: run.equipmentReserve.filter(item => item.uid !== itemUid) };
    if (!commitLoadout(next)) return;
    run.money += equipmentSellPrice(item);
    autoForge(); renderShop(); renderEquipmentStrip(); showToast(t('equipmentSold'));
    focusCraftResult();
  }
  function moveEquipment(itemUid, toActive) {
    if (phase !== 'shop') return;
    const swap = document.querySelector(`[data-swap-for="${itemUid}"]`);
    const next = moveLoadout(run.equipment, run.equipmentReserve, itemUid, toActive, run.equipmentCapacity, swap ? Number(swap.value) : null);
    if (!commitLoadout(next)) return;
    autoForge(); renderShop(); renderEquipmentStrip(); focusCraftResult();
  }
  function rerollShop() {
    if (!run || phase !== 'shop') return;
    const cost = shopRerollCost();
    if (run.money < cost) return;
    run.money -= cost; run.rerolls += 1;
    restockShop();
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
  function spawnEnemy(id, x, y, small = false, nearPlayer = false, variant = null) {
    const def = BOSS_VARIANTS[variant] || ENEMIES[id];
    if (x === undefined) {
      const p = run.player;
      const angle = rand(0, TAU);
      const viewport = Math.max(viewW, viewH);
      const radius = nearPlayer
        ? rand(110, Math.max(180, Math.min(260, Math.min(viewW, viewH) * .5)))
        : run.wave <= 5 ? Math.min(560, viewport * .45) + rand(100, 160) : viewport * .58 + rand(100, 210);
      x = clamp(p.x + Math.cos(angle) * radius, 45, WORLD.w - 45);
      y = clamp(p.y + Math.sin(angle) * radius, 45, WORLD.h - 45);
    }
    const spawn = nearestWalkable(x, y, def.radius * (small ? .7 : 1));
    x = spawn.x; y = spawn.y;
    const factor = endlessFactor();
    const healthScale = (1 + (run.wave - 1) * .19) * run.difficulty.mult * (1 + factor * 2.25);
    const hp = Math.round(def.hp * healthScale * (small ? .45 : 1));
    const speed = def.speed * (1 + run.wave * .008) * endlessSpeedFactor();
    const damage = Math.max(1, Math.round(def.damage * (1 + factor)));
    const enemy = { id, variant, x, y, hp, maxHp: hp, r: def.radius * (small ? .7 : 1), speed, damage, value: small ? 0 : def.value, summoned: small,
      attackClock: rand(.6, 2.1), chargeClock: rand(1.5, 3.5), charging: 0, windup: 0, enrage: 0, enraged: false, chargeX: 0, chargeY: 0, attackPose: 0, biteCooldown: 0, animTime: rand(0, 1), hitFlash: 0, stuckTime: 0, dead: false };
    run.enemies.push(enemy);
    return enemy;
  }
  function spawnElite() {
    const id = ELITE_ROTATION[run.eliteIndex++ % ELITE_ROTATION.length];
    const early = run.wave <= 5;
    const p = run.player, angle = rand(0, TAU), radius = early ? rand(300, 360) : rand(360, 440);
    for (let i = 0; i < 12; i++) {
      const a = angle + i * TAU / 12;
      const point = nearestWalkable(clamp(p.x + Math.cos(a) * radius, 45, WORLD.w - 45),
        clamp(p.y + Math.sin(a) * radius, 45, WORLD.h - 45), ENEMIES[id].radius);
      if (distance(point, p) < (early ? 260 : 320) || distance(point, p) > (early ? 420 : 500)) continue;
      spawnEnemy(id, point.x, point.y);
      return id;
    }
    spawnEnemy(id);
    return id;
  }
  function spawnWaveEnemies(dt) {
    if (run.timeLeft <= 0) return;
    run.spawnClock -= dt;
    const early = run.wave <= 5;
    const spawnRate = run.difficulty.spawnRate;
    const interval = Math.max(.26, ((early ? 1.15 : 1.35) - run.wave * .045) / spawnRate);
    const nearbyRadius = Math.max(260, Math.min(520, Math.max(viewW, viewH) * .7));
    const cam = camera();
    let nearby = run.enemies.filter(e => !e.dead && visible(e, cam, 0) && distance(e, run.player) <= nearbyRadius).length;
    if (run.spawnClock <= 0) {
      run.spawnClock += interval;
      if (run.enemies.length < enemyCap()) {
        const count = Math.min(10, 1 + Math.floor((run.wave + (early ? 2 : 0)) / 5) + Math.floor((run.difficulty.spawnRate - 1) * 3) + Math.floor(endlessFactor() / 10));
        const pool = enemyPool();
        const nearbyMinimum = nearbyEnemyMinimum();
        for (let i = 0; i < count && run.enemies.length < enemyCap(); i++) {
          const nearPlayer = i === 0 && nearby < nearbyMinimum;
          spawnEnemy(pick(pool), undefined, undefined, false, nearPlayer);
          if (nearPlayer) nearby += 1;
        }
      }
    }
    run.nearbySpawnClock -= dt;
    if (nearby < nearbyEnemyMinimum() && run.nearbySpawnClock <= 0 && run.enemies.length < enemyCap()) {
      const pool = enemyPool();
      spawnEnemy(pick(pool), undefined, undefined, false, true);
      run.nearbySpawnClock = .55 / spawnRate;
    }
    if (!run.specialSpawned && run.elapsed > Math.min(7, waveDuration() * (early ? .2 : .3))) {
      run.specialSpawned = true;
      const campaignBossWave = run.wave === 10 || run.wave === MAX_WAVES;
      const endlessBossWave = isEndlessRun() && run.wave >= MAX_WAVES && run.wave % 10 === 0;
      if (campaignBossWave || endlessBossWave) {
        const bossCount = endlessBossWave && run.wave > MAX_WAVES ? 2 : 1;
        run.bossFight = true;
        run.bossesRemaining = bossCount;
        const bossVariant = bossVariantForWave(run.wave);
        for (let i = 0; i < bossCount; i++) spawnEnemy('boss', undefined, undefined, false, false, bossVariant);
        if (endlessBossWave && run.wave > MAX_WAVES) {
          const eliteCount = Math.floor((run.wave - MAX_WAVES) / 10);
          for (let i = 0; i < eliteCount; i++) spawnElite();
        }
        showToast(t('warningBoss', { boss: bossDisplayName(bossVariant) })); playSfx('warning-boss');
      } else if (ELITE_WAVES.includes(run.wave) || (isEndlessRun() && run.wave > MAX_WAVES && run.wave % 5 === 0)) {
        const eliteCount = isEndlessRun() ? Math.max(1, 1 + Math.floor((run.wave - MAX_WAVES) / 10)) : 1;
        const names = [];
        for (let i = 0; i < eliteCount; i++) names.push(ENEMIES[spawnElite()].name);
        showToast(t('eliteAppears', { elite: [...new Set(names)].join(' / ') })); playSfx('warning-elite');
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
  function pointSegmentDistance(x, y, a, b) {
    return segmentDistance({ x, y }, a.x, a.y, b.x, b.y);
  }
  function riverSegments(o) {
    const points = o.curve?.length > 1 ? o.curve : [{ x: o.x, y: o.y + o.h / 2, r: o.h / 2 }, { x: o.x + o.w, y: o.y + o.h / 2, r: o.h / 2 }];
    return points.slice(0, -1).map((a, index) => ({ a, b: points[index + 1], r: Math.max(a.r || 0, points[index + 1].r || 0) }));
  }
  function orientation(ax, ay, bx, by, cx, cy) { return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax); }
  function segmentsIntersect(ax, ay, bx, by, cx, cy, dx, dy) {
    const ab1 = orientation(ax, ay, bx, by, cx, cy), ab2 = orientation(ax, ay, bx, by, dx, dy);
    const cd1 = orientation(cx, cy, dx, dy, ax, ay), cd2 = orientation(cx, cy, dx, dy, bx, by);
    if ((ab1 > 0 && ab2 < 0 || ab1 < 0 && ab2 > 0) && (cd1 > 0 && cd2 < 0 || cd1 < 0 && cd2 > 0)) return true;
    const on = (a, b, c) => Math.abs(orientation(a[0], a[1], b[0], b[1], c[0], c[1])) < .001
      && c[0] >= Math.min(a[0], b[0]) - .001 && c[0] <= Math.max(a[0], b[0]) + .001
      && c[1] >= Math.min(a[1], b[1]) - .001 && c[1] <= Math.max(a[1], b[1]) + .001;
    return on([ax, ay], [bx, by], [cx, cy]) || on([ax, ay], [bx, by], [dx, dy])
      || on([cx, cy], [dx, dy], [ax, ay]) || on([cx, cy], [dx, dy], [bx, by]);
  }
  function segmentSegmentDistance(ax, ay, bx, by, cx, cy, dx, dy) {
    if (segmentsIntersect(ax, ay, bx, by, cx, cy, dx, dy)) return 0;
    return Math.min(
      pointSegmentDistance(ax, ay, { x: cx, y: cy }, { x: dx, y: dy }),
      pointSegmentDistance(bx, by, { x: cx, y: cy }, { x: dx, y: dy }),
      pointSegmentDistance(cx, cy, { x: ax, y: ay }, { x: bx, y: by }),
      pointSegmentDistance(dx, dy, { x: ax, y: ay }, { x: bx, y: by })
    );
  }

  function soulAttackBonus() { return Math.min(36, run.skills.souls) * .55 + Math.max(0, run.skills.souls - 36) * .05; }
  function physicalBonus() { return run.stats.attackDamage + (run.character.id === 'sf' ? soulAttackBonus() : 0); }
  function baseAttackDefinition(id = run.baseAttack.id) { return id === 'tb' && run.skills.tb.time > 0 ? TB_DEMON_ATTACK : BASE_ATTACKS[id]; }
  function basicRange() { return Math.max(48, baseAttackDefinition().range + run.stats.attackRange + (run.character.id === 'rover' ? 140 : 0)); }
  function equipmentPassive(id) {
    return run.equipment.map(equipmentDef).filter(def => def.passive?.id === id)
      .sort((a, b) => b.grade - a.grade || b.level - a.level)[0]?.passive;
  }
  function activeAmplify() { return equipmentPassive('activeAmplify')?.multiplier || 1; }
  function dealSkillDamage(e, amount, active = false, area = true) {
    if (!e || e.dead) return;
    const hp = Math.max(0, e.hp);
    const dealt = damageEnemy(e, amount * (active ? activeAmplify() : 1), false);
    restoreSpellHealth(Math.min(hp, dealt), area);
  }
  function restoreSpellHealth(damage, area = false) {
    const passive = equipmentPassive('spellLeech'), s = run.skills, p = run.player;
    if (!passive || !(damage > 0) || p.hp <= 0 || p.hp >= p.maxHp) return;
    s.spellHeals = s.spellHeals.filter(entry => run.totalTime - entry.time < 1);
    const available = Math.max(0, p.maxHp * passive.capPerSecond - s.spellHeals.reduce((sum, entry) => sum + entry.amount, 0));
    const amount = Math.min(available, damage * passive.ratio * (area ? passive.areaRatio : 1), p.maxHp - p.hp);
    if (amount <= 0) return;
    heal(amount); s.spellHeals.push({ time: run.totalTime, amount });
    if (run.totalTime >= (s.spellHealFxAt || 0)) {
      s.spellHealFxAt = run.totalTime + .5;
      addEquipmentUpgradeEffect('bloodstone', passive.level, { x: p.x, y: p.y, r: 26 });
    }
  }
  function triggerOrchid() {
    const passive = equipmentPassive('soulMark');
    if (!passive) return;
    const target = run.enemies.filter(e => !e.dead && run.totalTime < (e.orchidUntil || 0)
      && distance(e, run.player) <= passive.range + e.r)
      .sort((a, b) => distance(a, run.player) - distance(b, run.player))[0];
    if (!target) return;
    target.orchidUntil = 0;
    damageEnemy(target, passive.damage + run.stats.elemental * passive.magicRatio, false);
    addEquipmentUpgradeEffect('orchid', passive.level, { x: target.x, y: target.y, r: target.r + 12 });
  }
  function pulse(x, y, r, color, life = .35, kind = 'pulse') { run.effects.push({ kind, x, y, r, color, life, maxLife: life, heroGrowthTier: heroGrowthTier(run.level) }); }
  function equippedUpgradeLevel(id) {
    return run.equipment.reduce((level, item) => item.id === id ? Math.max(level, item.level || 1) : level, 0);
  }
  function addEquipmentUpgradeEffect(weapon, level, details = {}) {
    const evolution = ['battlefury', 'dagon', 'manta'].includes(weapon);
    if (!(evolution || level > 1 || ['bloodstone', 'orchid', 'bladeMail', 'heart', 'phaseBoots', 'cyclone', 'necronomicon'].includes(weapon)) || (motionPreference.matches && !evolution)) return null;
    if (run.effects.filter(fx => fx.kind === 'equipment-upgrade').length >= 24) return null;
    run.upgradeFxTimes ||= {};
    const times = (run.upgradeFxTimes[weapon] || []).filter(time => run.totalTime - time < 1);
    run.upgradeFxTimes[weapon] = times;
    if (times.length >= 6) return null;
    times.push(run.totalTime);
    const fx = { kind: 'equipment-upgrade', weapon, level, x: run.player.x, y: run.player.y + 12,
      r: 38, angle: run.player.facing, life: .24, maxLife: .24, ...details };
    run.effects.push(fx);
    return fx;
  }
  function inAttackFan(origin, enemy, angle, degrees) {
    if (degrees >= 360) return true;
    const delta = Math.atan2(enemy.y - origin.y, enemy.x - origin.x) - angle;
    const edge = Math.asin(clamp(enemy.r / Math.max(1, distance(enemy, origin)), 0, 1));
    return Math.abs(Math.atan2(Math.sin(delta), Math.cos(delta))) <= degrees * Math.PI / 360 + edge;
  }
  const equipmentCombat = createEquipmentCombat({ getRun: () => run, passive: equipmentPassive, damageEnemy, blocked: terrainLineBlocked, pulse, isElite, heal, basicRange, label: id => buildName(id, selectedLocale) });
  function updateEquipmentPassives(dt) {
    equipmentCombat.update(dt);
    const s = run.skills, p = run.player;
    const dagon = equipmentPassive('arcaneBurst');
    if (dagon && run.totalTime >= s.dagonReadyAt) {
      const target = run.enemies.filter(e => !e.dead && distance(e, p) <= dagon.range + e.r
        && !terrainLineBlocked(p.x, p.y, e.x, e.y, 4, false))
        .sort((a, b) => Number(b.id === 'boss' || isElite(b)) - Number(a.id === 'boss' || isElite(a)) || distance(a, p) - distance(b, p))[0];
      if (target) {
        s.dagonReadyAt = run.totalTime + dagon.cooldown;
        const angle = Math.atan2(target.y - p.y, target.x - p.x);
        const others = run.enemies.filter(e => e !== target && !e.dead && distance(e, p) <= dagon.range + e.r
          && inAttackFan(p, e, angle, dagon.spreadDegrees)
          && !terrainLineBlocked(p.x, p.y, e.x, e.y, 4, false))
          .sort((a, b) => distance(a, target) - distance(b, target)).slice(0, dagon.targets - 1);
        const targets = [target, ...others], budget = dagon.damage + run.stats.elemental * dagon.magicRatio;
        for (let i = 0; i < targets.length; i++) {
          const share = targets.length === 1 ? 1 : (i === 0 ? 2 : 1) / (targets.length + 1);
          damageEnemy(targets[i], budget * share, false);
        }
        addEquipmentUpgradeEffect('dagon', dagon.level, { x: p.x, y: p.y - 24, r: dagon.range,
          targets: targets.map(e => ({ x: e.x, y: e.y, r: e.r })) });
      }
    }
    const cyclone = equipmentPassive('cyclone');
    if (cyclone && run.totalTime >= s.cycloneReadyAt) {
      const target = run.enemies.filter(e => !e.dead && distance(e, p) <= cyclone.range + e.r)
        .sort((a, b) => distance(a, p) - distance(b, p))[0];
      if (target) {
        s.cycloneReadyAt = run.totalTime + cyclone.cooldown;
        target.cycloneUntil = run.totalTime + cyclone.duration * (target.id === 'boss' ? .2 : isElite(target) ? .5 : 1);
        addEquipmentUpgradeEffect('cyclone', cyclone.level, { x: target.x, y: target.y, r: target.r + 12 });
      }
    }
    const restoration = equipmentPassive('restoration');
    if (restoration && run.totalTime - s.lastHurtAt >= restoration.delay && p.hp < p.maxHp) {
      heal(p.maxHp * restoration.ratio * dt);
      if (run.totalTime >= (s.restorationFxAt || 0)) {
        s.restorationFxAt = run.totalTime + 1;
        addEquipmentUpgradeEffect('heart', restoration.level, { x: p.x, y: p.y, r: 30 });
      }
    }
    const necro = equipmentPassive('necromancy');
    if (necro && run.totalTime >= s.necroReadyAt && s.necroUnits.length === 0 && run.enemies.some(e => !e.dead)) {
      s.necroReadyAt = run.totalTime + necro.cooldown;
      s.necroUnits = [-1, 1].map(side => ({ ...nearestWalkable(p.x + side * 32, p.y + 20, 10), r: 10,
        side, life: necro.duration, attack: .3, damage: necro.damage, magicRatio: necro.magicRatio, level: necro.level, facing: p.facing }));
      addEquipmentUpgradeEffect('necronomicon', necro.level, { x: p.x, y: p.y, r: 38 });
    }
    s.necroUnits = s.necroUnits.filter(unit => {
      unit.life -= dt; unit.attack -= dt; unit.attackFlash = Math.max(0, (unit.attackFlash || 0) - dt);
      if (unit.life <= 0 || !necro) return false;
      const ranged = unit.side > 0, range = ranged ? 300 : 58;
      const target = run.enemies.filter(e => !e.dead && distance(e, unit) <= 480
        && !terrainLineBlocked(unit.x, unit.y, e.x, e.y, 4, false))
        .sort((a, b) => distance(a, unit) - distance(b, unit))[0];
      const toward = target || { x: p.x + unit.side * 32, y: p.y + 20 };
      const d = distance(toward, unit); unit.facing = Math.atan2(toward.y - unit.y, toward.x - unit.x);
      if (d > (target ? range * .85 : 40)) moveThroughTerrain(unit, Math.cos(unit.facing) * 155 * dt, Math.sin(unit.facing) * 155 * dt);
      if (target && d <= range + target.r && unit.attack <= 0) {
        unit.attack = ranged ? 1.1 : .9; unit.attackFlash = .18;
        damageEnemy(target, unit.damage + run.stats.elemental * unit.magicRatio, false, null, false, false);
        if (ranged) run.effects.push({ kind: 'line', x1: unit.x, y1: unit.y - 8, x2: target.x, y2: target.y, color: '#9de8bd', life: .16, maxLife: .16, width: 2 });
      }
      return true;
    });
    const aura = equipmentPassive('radiance');
    if (!aura) { run.skills.radianceClock = 0; return; }
    run.skills.radianceClock -= dt;
    while (run.skills.radianceClock <= 0) {
      run.skills.radianceClock += aura.interval;
      let affected = false;
      for (const e of run.enemies) {
        if (e.dead || distance(e, run.player) > aura.radius + e.r) continue;
        damageEnemy(e, aura.damage, false);
        affected = true;
      }
      if (affected) {
        pulse(run.player.x, run.player.y, aura.radius, '#ffb14a', .32, 'radiance');
        addEquipmentUpgradeEffect('radiance', aura.level, { x: run.player.x, y: run.player.y, r: aura.radius });
      }
    }
  }
  function quillSpray(active = false) {
    const p = run.player;
    for (const e of run.enemies) if (!e.dead && distance(e, p) <= 220 + e.r) {
      if (run.totalTime >= (e.quillUntil || 0)) e.quillStacks = 0;
      dealSkillDamage(e, 16 + physicalBonus() * .8 + (e.quillStacks || 0) * 4, active);
      e.quillStacks = Math.min(5, (e.quillStacks || 0) + 1); e.quillUntil = run.totalTime + 10;
    }
    pulse(p.x, p.y, 220, '#dac69b', .42, 'quills');
    playSfx('skill-bulwark');
  }
  function triggerStaticField(center) {
    const magic = run.stats.elemental;
    let affected = false;
    for (const e of run.enemies) if (!e.dead && distance(e, center) <= 120 + e.r && run.totalTime >= (e.staticReadyAt || 0)) {
      e.staticReadyAt = run.totalTime + 1;
      dealSkillDamage(e, Math.min(e.hp * .06, 8 + magic * .4) + magic * .2);
      affected = true;
    }
    if (affected) pulse(center.x, center.y, 120, '#a1dfff', .25, 'static');
  }
  function beginLeap() {
    const p = run.player, s = run.skills;
    const target = run.enemies.filter(e => !e.dead && distance(e, p) <= 260 && !terrainLineBlocked(p.x, p.y, e.x, e.y, p.radius))
      .sort((a, b) => distance(a, p) - distance(b, p))[0];
    if (!target) return;
    const angle = Math.atan2(target.y - p.y, target.x - p.x), travel = Math.min(180, Math.max(0, distance(target, p) - 52));
    s.jump = { time: .44, maxTime: .44, angle, dx: Math.cos(angle) * travel, dy: Math.sin(angle) * travel };
    s.attackHits = 0; s.leapCooldown = 3;
    p.attackFacing = angle;
    playSfx('blade');
  }
  function kaelNearbyTarget(range, predicate = () => true) {
    return run.enemies.filter(e => !e.dead && predicate(e) && distance(e, run.player) <= range + e.r)
      .sort((a, b) => distance(a, run.player) - distance(b, run.player))[0] || null;
  }
  function kaelPushEnemy(e, amount, angle) {
    moveThroughTerrain(e, Math.cos(angle) * amount, Math.sin(angle) * amount);
    e.kaelSlowUntil = Math.max(e.kaelSlowUntil || 0, run.totalTime + .7);
  }
  function castKaelSpell(id, source = 'active') {
    const s = run.skills, p = run.player, fromActive = source === 'active';
    const range = { tornado: 774, emp: 190, 'chaos-meteor': 720, 'ice-wall': 240, 'forge-spirit': 340, 'deafening-blast': 170 }[id];
    if (!range) return false;
    const target = kaelNearbyTarget(range, e => !['chaos-meteor', 'forge-spirit'].includes(id)
      || !terrainLineBlocked(p.x, p.y, e.x, e.y, 10));
    if (!target) return false;
    const angle = Math.atan2(target.y - p.y, target.x - p.x);
    const damage = (enemy, amount) => dealSkillDamage(enemy, amount, fromActive);
    switch (id) {
      case 'tornado': {
        for (let i = 0; i < s.kaelSpellRank; i++) {
          const direction = angle + [0, -.24, .24][i];
          const tornado = addShot(p.x, p.y, direction, { id: 'kael' }, 18 + run.stats.elemental * .75,
            { skill: true, pierce: 8, kaelSpell: id });
          Object.assign(tornado, { vx: Math.cos(direction) * 430, vy: Math.sin(direction) * 430,
            life: 1.8, r: 26, active: fromActive, startedAt: run.totalTime });
        }
        break;
      }
      case 'emp': {
        const affected = run.enemies.filter(e => !e.dead && distance(e, p) <= 190 + e.r);
        for (const [index, e] of affected.entries()) {
          const angle = Math.atan2(e.y - p.y, e.x - p.x), originX = p.x + Math.cos(angle) * 18, originY = p.y + Math.sin(angle) * 18;
          damage(e, 22 + run.stats.elemental * .65);
          const midX = (originX + e.x) * .5, midY = (originY + e.y) * .5;
          run.effects.push({ kind: 'kael-emp-bolt', x: midX, y: midY, x1: originX, y1: originY, x2: e.x, y2: e.y,
            r: Math.hypot(e.x - originX, e.y - originY) * .5 + 24, seed: index * 17.3 + e.x * .01 + e.y * .017, color: '#73d8ff', life: .22, maxLife: .22 });
          run.effects.push({ kind: 'kael-emp-explosion', x: e.x, y: e.y, r: Math.max(28, e.r + 28), seed: index * 11.7 + e.x * .013,
            delay: .16 + index * .018, color: '#b9edff', life: .65, maxLife: .65 });
        }
        p.mana = Math.min(p.maxMana, p.mana + 12); break;
      }
      case 'chaos-meteor': {
        const forward = Math.min(38, Math.max(0, distance(target, p) - 72));
        for (let i = 0; i < s.kaelSpellRank; i++) {
          const side = [0, -76, 76][i];
          const meteor = { x: p.x, y: p.y,
            r: 10, angle, life: 3, tick: 0, travel: 0, trailAngle: angle, active: fromActive };
          moveThroughTerrain(meteor, Math.cos(angle) * forward - Math.sin(angle) * side,
            Math.sin(angle) * forward + Math.cos(angle) * side);
          s.kaelMeteors.push(meteor);
          pulse(meteor.x, meteor.y, 40, '#ff9e6a', .45);
        }
        break;
      }
      case 'ice-wall':
        s.kaelIceWalls.push({ x: target.x, y: target.y, angle, life: 6, maxLife: 6, age: 0, tick: .4, active: fromActive });
        pulse(target.x, target.y, 85, '#a7ecff', .55); break;
      case 'forge-spirit':
        s.kaelSpirits = [-1, 1].map(side => ({ x: p.x + side * 38, y: p.y + 4, r: 9, life: 7, attack: 0,
          attackFlash: 0, attackAngle: angle, facing: angle, side, active: fromActive }));
        pulse(p.x, p.y, 58, '#ffbd7d', .5); break;
      case 'deafening-blast': {
        const blastTargets = run.enemies.filter(e => {
          if (e.dead) return false;
          const dx = e.x - p.x, dy = e.y - p.y, along = dx * Math.cos(angle) + dy * Math.sin(angle);
          const across = -dx * Math.sin(angle) + dy * Math.cos(angle);
          return along >= -e.r && along <= 170 + e.r && Math.abs(across) <= Math.max(34, along * .85) + e.r;
        });
        if (!blastTargets.length) return false;
        for (const e of blastTargets) { damage(e, 28 + run.stats.elemental * .8); kaelPushEnemy(e, 70, angle); }
        s.kaelBlast = { x: p.x, y: p.y, angle, age: 0, life: .78, maxLife: .78 }; break;
      }
      default: return false;
    }
    p.facing = p.attackFacing = angle;
    p.skillPose = .56; p.skillClock = 0;
    showToast(`${source === 'passive' ? '✦' : '↻'} ${kaelSpellName(id)}`);
    playSfx('kael-spell');
    return true;
  }
  function tryKaelPassiveSpell() {
    const s = run.skills;
    if (run.character.id !== 'kael') return false;
    const candidates = [...KAEL_SPELLS];
    for (let attempt = 0; attempt < 3; attempt++) {
      const spell = pick(candidates);
      candidates.splice(candidates.indexOf(spell), 1);
      if (castKaelSpell(spell.id, 'passive')) { s.lastPassiveSpell = spell.id; return true; }
    }
    return false;
  }
  function lunaTargetInEclipse(center, randomize = false) {
    const targets = run.enemies.filter(e => !e.dead && distance(e, center) <= 430);
    return randomize ? (targets.length ? pick(targets) : null) : targets.sort((a, b) => distance(a, center) - distance(b, center))[0] || null;
  }
  function scheduleLunaBeam(eclipse) {
    const target = lunaTargetInEclipse(eclipse, true);
    let x, y;
    if (target) {
      const offset = rand(0, 55), angle = rand(0, TAU);
      x = target.x + Math.cos(angle) * offset;
      y = target.y + Math.sin(angle) * offset;
    } else {
      const angle = rand(0, TAU), radius = Math.sqrt(Math.random()) * 430;
      x = eclipse.x + Math.cos(angle) * radius;
      y = eclipse.y + Math.sin(angle) * radius;
    }
    const dx = x - eclipse.x, dy = y - eclipse.y, maxRadius = 430;
    const d = Math.hypot(dx, dy);
    if (d > maxRadius) { x = eclipse.x + dx / d * maxRadius; y = eclipse.y + dy / d * maxRadius; }
    eclipse.beams.push({ x, y, warning: .22, life: .62, hit: false });
  }
  function resolveLunaBeam(eclipse, beam) {
    for (const e of run.enemies) {
      if (e.dead || distance(e, beam) > 52 + e.r) continue;
      const count = eclipse.hits.get(e) || 0;
      if (count >= 2) continue;
      eclipse.hits.set(e, count + 1);
      const multiplier = e.id === 'boss' ? .65 : isElite(e) ? .8 : 1;
      dealSkillDamage(e, (24 + run.stats.elemental * .9) * multiplier, true);
    }
    run.effects.push({ kind: 'lunar-impact', heroGrowthTier: heroGrowthTier(run.level), x: beam.x, y: beam.y, r: 52, color: '#e8ddff', life: .46, maxLife: .46 });
    playSfx('skill-luna');
  }
  function beginLunaEclipse() {
    const p = run.player, target = lunaTargetInEclipse(p);
    if (!target) { showToast(t('noTarget')); return false; }
    run.skills.eclipse = { x: p.x, y: p.y, timer: .25, remaining: 9, hits: new Map(), beams: [] };
    scheduleLunaBeam(run.skills.eclipse);
    pulse(p.x, p.y, 430, '#d9c9ff', .45, 'lunar-field');
    return true;
  }
  function updateLunaSkills(dt) {
    if (run.character.id !== 'luna') return;
    const eclipse = run.skills.eclipse;
    if (!eclipse) return;
    for (const beam of eclipse.beams) {
      beam.warning -= dt; beam.life -= dt;
      if (!beam.hit && beam.warning <= 0) { beam.hit = true; resolveLunaBeam(eclipse, beam); }
    }
    eclipse.beams = eclipse.beams.filter(beam => beam.life > 0);
    eclipse.timer -= dt;
    while (eclipse.remaining > 0 && eclipse.timer <= 1e-9) {
      eclipse.timer += .25;
      eclipse.remaining -= 1;
      scheduleLunaBeam(eclipse);
    }
    if (eclipse.remaining <= 0 && eclipse.beams.length === 0) run.skills.eclipse = null;
  }
  function tryActiveSkill() {
    if (phase !== 'combat' || !run || run.skills.activeCooldown > 0) return;
    const p = run.player, s = run.skills, id = run.character.id, cfg = ACTIVE_SKILL_CONFIG[id];
    if (id === 'tb' && s.tb.time > 0) return;
    if (id === 'kael') {
      if (!s.lastPassiveSpell) return;
      if (p.mana < cfg.manaCost) { showToast(t('needMana')); updateHUD(); return; }
      if (!castKaelSpell(s.lastPassiveSpell, 'active')) { showToast(t('noTarget')); return; }
      p.mana -= cfg.manaCost;
      s.activeCooldown = cfg.cooldown * (1 - clamp(run.stats.abilityHaste, 0, 60) / 100);
      addEquipmentUpgradeEffect('aghanim', equipmentPassive('activeAmplify')?.level);
      triggerOrchid(); equipmentCombat.onActive();
      updateHUD();
      return;
    }
    if (p.mana < cfg.manaCost) { showToast(t('needMana')); updateHUD(); return; }
    if (s.jump || s.spin || s.requiem || s.thunder || s.eclipse) return;
    if (id === 'rover') {
      const target = getTarget(basicRange(), 'ranged', id);
      const angle = target ? Math.atan2(target.y - p.y, target.x - p.x) : p.facing;
      const hitCounts = new Map();
      for (let i = 0; i < 7; i++) {
        const shotAngle = angle + (i - 3) * .14;
        addShot(p.x + Math.cos(shotAngle) * 21, p.y + Math.sin(shotAngle) * 21, shotAngle, run.baseAttack,
          baseAttackDamage(run.baseAttack) * .55 * activeAmplify(), { skill: true, hitCounts, maxHits: 2 });
      }
      p.attackFacing = angle;
      run.effects.push({ kind: 'muzzle', heroGrowthTier: heroGrowthTier(run.level), x: p.x, y: p.y, angle, r: 22, color: '#ffe7a2', life: .2, maxLife: .2 });
    } else if (id === 'bulwark') quillSpray(true);
    else if (id === 'conductor') {
      const targets = run.enemies.filter(e => !e.dead);
      if (!targets.length) { showToast(t('noTarget')); return; }
      s.thunder = { time: .55, targets };
      for (const e of targets) pulse(e.x, e.y, e.r + 12, '#d5f4ff', .55, 'thunder-mark');
    } else if (id === 'scavenger') { s.rageTime = 6; s.rageAmp = activeAmplify(); pulse(p.x, p.y, 65, '#a4ec6b', .6); }
    else if (id === 'jugg') s.spin = { time: 3, tick: 0 };
    else if (id === 'sf') s.requiem = { delay: .55, age: 0, x: p.x, y: p.y, souls: Math.min(36, s.souls), hit: new Set() };
    else if (id === 'luna' && !beginLunaEclipse()) return;
    else if (id === 'tb') { s.tb.time = 8; s.tb.amp = 1 + .4 * activeAmplify(); pulse(p.x, p.y, 52, '#a7f07a', .45); }
    p.mana -= cfg.manaCost;
    p.skillPose = .56; p.skillClock = 0;
    s.activeCooldown = cfg.cooldown * (1 - clamp(run.stats.abilityHaste, 0, 60) / 100);
    addEquipmentUpgradeEffect('aghanim', equipmentPassive('activeAmplify')?.level);
    triggerOrchid(); equipmentCombat.onActive();
    playSfx(`skill-${id}`); updateHUD();
  }
  function countScavengedMaterial() {
    run.skills.manualPickups += 1;
    if (run.skills.manualPickups % 8 === 0) { run.money += 1; run.earned += 1; showToast(t('dividend')); }
  }
  function updateKaelSkills(dt) {
    if (run.character.id !== 'kael') return;
    const s = run.skills, p = run.player;
    s.kaelPassiveTimer -= dt;
    if (s.kaelPassiveTimer <= 0) s.kaelPassiveTimer = tryKaelPassiveSpell() ? 5 : 2;
    for (const meteor of s.kaelMeteors) {
      const step = Math.min(dt, meteor.life);
      meteor.life -= dt; meteor.tick += step;
      const previousX = meteor.x, previousY = meteor.y;
      moveThroughTerrain(meteor, Math.cos(meteor.angle) * 240 * step, Math.sin(meteor.angle) * 240 * step);
      const dx = meteor.x - previousX, dy = meteor.y - previousY;
      meteor.travel += Math.hypot(dx, dy) * ((dx || Math.cos(meteor.angle)) < 0 ? -1 : 1);
      if (dx || dy) meteor.trailAngle = Math.atan2(dy, dx);
      while (meteor.tick >= .3 - 1e-9) {
        meteor.tick -= .3;
        for (const e of run.enemies) if (!e.dead && distance(e, meteor) <= 68 + e.r) dealSkillDamage(e, 12 + run.stats.elemental * .45, meteor.active);
        pulse(meteor.x, meteor.y, 68, '#ff9c65', .2, 'meteor');
      }
    }
    s.kaelMeteors = s.kaelMeteors.filter(meteor => meteor.life > 0);
    for (const wall of s.kaelIceWalls) {
      wall.tick += Math.min(dt, wall.life); wall.life -= dt; wall.age += dt;
      while (wall.tick >= .4 - 1e-9) {
        wall.tick -= .4;
        const ax = wall.x - Math.sin(wall.angle) * 120, ay = wall.y + Math.cos(wall.angle) * 120;
        const bx = wall.x + Math.sin(wall.angle) * 120, by = wall.y - Math.cos(wall.angle) * 120;
        for (const e of run.enemies) if (!e.dead && pointSegmentDistance(e.x, e.y, { x: ax, y: ay }, { x: bx, y: by }) <= e.r + 26) {
          dealSkillDamage(e, 7 + run.stats.elemental * .25, wall.active); e.kaelSlowUntil = run.totalTime + .55;
        }
      }
    }
    s.kaelIceWalls = s.kaelIceWalls.filter(wall => wall.life > 0);
    if (s.kaelBlast) {
      s.kaelBlast.age += dt; s.kaelBlast.life -= dt;
      if (s.kaelBlast.life <= 0) s.kaelBlast = null;
    }
    s.kaelSpirits = s.kaelSpirits.filter(spirit => {
      spirit.life -= dt; spirit.attack -= dt; spirit.attackFlash = Math.max(0, (spirit.attackFlash || 0) - dt);
      const target = run.enemies.filter(e => !e.dead && distance(e, spirit) <= 380).sort((a, b) => distance(a, spirit) - distance(b, spirit))[0];
      if (target) {
        const d = distance(target, spirit);
        spirit.facing = Math.atan2(target.y - spirit.y, target.x - spirit.x);
        if (d > 110) moveThroughTerrain(spirit, Math.cos(spirit.facing) * 120 * dt, Math.sin(spirit.facing) * 120 * dt);
        if (spirit.attack <= 0 && d < 150) { spirit.attack = .7; spirit.attackFlash = .18; spirit.attackAngle = spirit.facing; dealSkillDamage(target, 10 + run.stats.elemental * .3, spirit.active, false); pulse(target.x, target.y, 16, '#ffb979', .18); }
      } else moveThroughTerrain(spirit, Math.cos(run.totalTime * 2 + spirit.side) * 20 * dt, Math.sin(run.totalTime * 2 + spirit.side) * 20 * dt);
      return spirit.life > 0;
    });
  }
  function updateSkills(dt) {
    const s = run.skills, p = run.player;
    p.mana = Math.min(p.maxMana, p.mana + Math.max(0, run.stats.manaRegen) * dt);
    updateEquipmentPassives(dt);
    if (buffCount('armlet')) p.hp = Math.max(1, p.hp - buffCount('armlet') * dt);
    s.activeCooldown = Math.max(0, s.activeCooldown - dt);
    s.leapCooldown = Math.max(0, s.leapCooldown - dt);
    s.bloodCooldown = Math.max(0, s.bloodCooldown - dt);
    s.bloodTime = Math.max(0, s.bloodTime - dt);
    updateKaelSkills(dt);
    updateLunaSkills(dt);
    if (run.character.id === 'tb') updateTerrorblade(s.tb, dt);
    const blood = equipmentPassive('bloodRage');
    if (blood && p.hp / p.maxHp < blood.threshold && s.bloodCooldown <= 0) {
      s.bloodTime = blood.duration; s.bloodCooldown = blood.cooldown;
      pulse(p.x, p.y, 40, '#dd4c41', .55); showToast(t('bloodRage'));
    }
    if (s.rageTime > 0) { heal(2.5 * s.rageAmp * Math.min(dt, s.rageTime)); s.rageTime = Math.max(0, s.rageTime - dt); }
    if (run.character.id === 'jugg' && s.attackHits >= 5 && s.leapCooldown <= 0 && !s.spin && !s.jump) beginLeap();
    if (s.jump) {
      const jump = s.jump, step = Math.min(dt, jump.time) / jump.maxTime;
      moveThroughTerrain(p, jump.dx * step, jump.dy * step);
      jump.time -= dt;
      if (jump.time <= 0) {
        for (const e of run.enemies) if (!e.dead && distance(e, p) <= 76 + e.r && !terrainLineBlocked(p.x, p.y, e.x, e.y, 4, false)) dealSkillDamage(e, 26 + physicalBonus());
        run.effects.push({ kind: 'landing', x: p.x, y: p.y, angle: jump.angle, r: 76, color: '#f4ddae', life: .45, maxLife: .45 });
        s.jump = null; p.invuln = Math.max(p.invuln, .28); p.attackDuration = .42; p.attackPose = .42; p.attackClock = 0; p.landTime = .18; playSfx('blade');
      }
    }
    if (s.spin) {
      s.spin.tick += Math.min(dt, s.spin.time); s.spin.time -= dt;
      while (s.spin.tick >= .2 - 1e-9) {
        s.spin.tick -= .2;
        for (const e of run.enemies) if (!e.dead && distance(e, p) <= 138 + e.r && !terrainLineBlocked(p.x, p.y, e.x, e.y, 4, false))
          dealSkillDamage(e, 6 + run.stats.elemental * .35 + physicalBonus() * .35, true);
      }
      if (s.spin.time <= 0) s.spin = null;
    }
    if (s.thunder) {
      s.thunder.time -= dt;
      if (s.thunder.time <= 0) {
        for (const e of s.thunder.targets) if (!e.dead) {
          dealSkillDamage(e, (34 + run.stats.elemental * 1.25) * (e.id === 'boss' ? .65 : isElite(e) ? .8 : 1), true);
          triggerStaticField(e); pulse(e.x, e.y, e.r + 10, '#e6f8ff', .35, 'thunder');
        }
        s.thunder = null; playSfx('arc');
      }
    }
    if (s.requiem) {
      const cast = s.requiem;
      if (cast.delay > 0) {
        cast.delay -= dt; cast.x = p.x; cast.y = p.y;
        if (cast.delay <= 0) playSfx('skill-sf');
      } else {
        cast.age += dt;
        const radius = Math.min(280, cast.age / .55 * 280);
        for (const e of run.enemies) if (!e.dead && !cast.hit.has(e) && distance(e, cast) <= radius + e.r) {
          cast.hit.add(e); dealSkillDamage(e, 34 + run.stats.elemental * .9 + run.stats.attackDamage * .45 + cast.souls * 1.25, true);
        }
        if (cast.age >= 1) s.requiem = null;
      }
    }
  }
  function movePlayer(dt) {
    const p = run.player, v = movementVector();
    let vx = v.x, vy = v.y;
    const dashing = p.dashTime > 0;
    if (dashing) {
      vx = p.dashX * 3.3; vy = p.dashY * 3.3; p.dashTime = Math.max(0, p.dashTime - dt);
      const phaseStrike = equipmentPassive('phaseStrike');
      if (p.dashTime === 0 && phaseStrike) {
        run.skills.phaseSpeedUntil = run.totalTime + phaseStrike.duration;
        run.skills.phaseAttackUntil = run.totalTime + phaseStrike.attackWindow;
        addEquipmentUpgradeEffect('phaseBoots', phaseStrike.level, { x: p.x, y: p.y, r: 30, angle: Math.atan2(p.dashY, p.dashX) });
      }
    }
    else if (Math.hypot(vx, vy) > .05) p.facing = Math.atan2(vy, vx);
    const bonus = run.skills.rageTime > 0 ? 15 * run.skills.rageAmp : run.skills.spin ? 20 : 0;
    const phaseSpeed = run.totalTime < run.skills.phaseSpeedUntil ? equipmentPassive('phaseStrike')?.speed || 0 : 0;
    const speed = 215 * Math.max(.2, 1 + (run.stats.speed + bonus + phaseSpeed + buffMoveSpeed(run)) / 100) * (run.skills.requiem?.delay > 0 ? .65 : 1);
    const step = dashing ? speed * dt : Math.min(speed * dt, v.remaining ?? Infinity);
    const oldX = p.x, oldY = p.y;
    if (!run.skills.jump) moveThroughTerrain(p, vx * step, vy * step);
    run.movedThisFrame = Math.hypot(p.x - oldX, p.y - oldY) > .1;
    p.animTime = run.movedThisFrame ? p.animTime + dt : 0;
    if (p.attackPose > 0) p.attackClock += dt;
    else p.attackClock = 0;
    if (p.pendingAttack && !p.pendingAttack.resolved) {
      p.pendingAttack.elapsed += dt;
      if (p.pendingAttack.elapsed >= p.pendingAttack.strikeTime) resolvePendingBaseAttack();
    }
    if (p.skillPose > 0) p.skillClock += dt;
    else p.skillClock = 0;
    p.attackPose = Math.max(0, p.attackPose - dt);
    p.skillPose = Math.max(0, p.skillPose - dt);
    p.landTime = Math.max(0, (p.landTime || 0) - dt);
    if (!dashing && v.remaining !== undefined && v.remaining <= step + 3) { moveTarget = null; moveFlow = null; }
    p.invuln = Math.max(0, p.invuln - dt);
    p.dashCooldown = Math.max(0, p.dashCooldown - dt);
    run.lifeClock = Math.max(0, run.lifeClock - dt);
    run.regenClock += dt;
    if (run.regenClock >= 5) { run.regenClock -= 5; if (run.stats.regen > 0) heal(run.stats.regen); }
    if (run.aimTarget) { run.aimTarget.life -= dt; if (run.aimTarget.life <= 0) run.aimTarget = null; }
  }

  function hurtPlayer(rawDamage, source = null, contact = false) {
    const p = run.player, s = run.skills;
    if (p.invuln > 0 || phase !== 'combat') return;
    if (Math.random() * 100 < clamp(run.stats.dodge, 0, 55)) {
      p.invuln = .18; showToast(t('dodge'));
      addEquipmentUpgradeEffect('butterfly', equippedUpgradeLevel('butterfly'), { angle: source ? Math.atan2(source.y - p.y, source.x - p.x) : p.facing });
      return;
    }
    let damage = rawDamage * (1 + (equipmentPassive('divineEdge')?.incomingAmp || 0)) * (1 + buffCount('bloodrage') * .1) * run.difficulty.mult * (15 / (15 + Math.max(-5, run.stats.armor)));
    if (source && run.character.id === 'bulwark') {
      const relative = Math.atan2(source.y - p.y, source.x - p.x) - p.facing;
      const fromRear = Math.abs(Math.atan2(Math.sin(relative), Math.cos(relative))) >= Math.PI - 70 * Math.PI / 180;
      if (fromRear) damage *= .6;
    }
    if (contact && s.spin) damage *= .65;
    const block = equipmentPassive('damageBlock');
    if (source && block && Math.random() < block.chance) damage = Math.max(0, damage - block.amount);
    damage = Math.round(damage);
    if (damage <= 0) { p.invuln = .18; pulse(p.x, p.y, 25, '#d7e3d0', .2); return; }
    if (equipmentCombat.blockDamage(damage)) { p.invuln = .55; playSfx('shield'); return; }
    if (absorbBuffDamage(run, damage)) {
      p.invuln = .55;
      run.effects.push({ kind: 'text', x: p.x, y: p.y - 40, text: buffName(BUFFS.shallowGrave), color: '#d9f5ff', life: .8, maxLife: .8 });
      showToast(t('thinBurialTriggered', { count: run.buffState.graveCharges }));
      pulse(p.x, p.y, 38, '#d9f5ff', .55);
      playSfx('shield');
      return;
    }
    const lostHp = Math.min(Math.max(0, p.hp), damage);
    p.hp -= damage; p.invuln = .55; run.screenShake = 7; s.lastHurtAt = run.totalTime;
    run.effects.push({ kind: 'text', x: p.x, y: p.y - 40, text: `-${damage}`, color: '#ff9290', life: .65, maxLife: .65 });
    playSfx('hurt');
    const attacker = source?.enemy || source, reflected = equipmentPassive('damageReturn');
    if (reflected && attacker && run.enemies.includes(attacker) && !attacker.dead && run.totalTime >= s.returnReadyAt) {
      s.returnReadyAt = run.totalTime + reflected.interval;
        const returned = Math.round(Math.min(reflected.cap, lostHp * reflected.ratio));
        if (returned > 0) damageEnemy(attacker, returned, false, null, true);
      addEquipmentUpgradeEffect('bladeMail', reflected.level, { x: attacker.x, y: attacker.y, r: attacker.r + 10 });
    }
    if (p.hp <= 0) { p.hp = 0; endRun(false); return; }
    if (buffCount('frostArmor') && attacker && run.enemies.includes(attacker) && !attacker.dead) {
      attacker.buffSlowUntil = run.totalTime + 2;
      attacker.buffSlow = Math.min(.6, buffCount('frostArmor') * .2);
      pulse(attacker.x, attacker.y, attacker.r + 8, '#a9e9ff', .25);
    }
    if (buffCount('counterHelix') && ++run.buffState.receivedHits % 4 === 0) {
      for (const enemy of run.enemies) if (!enemy.dead && distance(enemy, p) <= 150 + enemy.r && !terrainLineBlocked(p.x, p.y, enemy.x, enemy.y, 4, false))
        damageEnemy(enemy, 16 * buffCount('counterHelix'), false);
      pulse(p.x, p.y, 150, '#ffba72', .35);
      showToast(buffName(BUFFS.counterHelix));
    }
    if (source && run.character.id === 'bulwark') { s.receivedHits += 1; if (s.receivedHits % 4 === 0) quillSpray(); }
  }
  function castEliteAbility(e) {
    const def = ENEMIES[e.id];
    if (def.area) {
      if (distance(e, run.player) < def.area + run.player.radius &&
          !terrainLineBlocked(e.x, e.y, run.player.x, run.player.y, 6)) {
        hurtPlayer(e.damage * (e.id === 'hellbear' ? 1.4 : 1.25), e);
      }
      pulse(e.x, e.y, def.area, def.color, .4);
      if (e.id === 'hellbear') e.enrage = 3;
      playSfx('boss-attack');
    } else if (e.id === 'satyr') {
      shootEnemyBullet(e.x, e.y, e.chargeX, e.chargeY, e.damage * 1.1, 260, 14, def.color, def.reach / 260, e);
      playSfx('shooter-fire');
    } else if (e.id === 'darkTroll') {
      const alive = run.enemies.filter(child => !child.dead && child.summoner === e).length;
      const count = Math.min(2, 4 - alive, enemyCap() - run.enemies.length);
      for (let i = 0; i < count; i++) {
        const a = Math.atan2(e.chargeY, e.chargeX) + (i ? 1 : -1) * Math.PI / 2;
        const child = spawnEnemy('runner', e.x + Math.cos(a) * 48, e.y + Math.sin(a) * 48, true);
        child.summoner = e;
        pulse(child.x, child.y, 25, def.color, .4);
      }
      pulse(e.x, e.y, 58, def.color, .4);
      playSfx('shooter-fire');
    }
    e.attackClock = def.cooldown;
    e.attackPose = .35;
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
      if (run.totalTime < (e.cycloneUntil || 0)) { e.moving = false; continue; }
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
      e.enrage = Math.max(0, e.enrage - dt);
      const auraRate = 1 - buffAuraSlow(run, dist);
      e.attackClock -= dt * auraRate; e.chargeClock -= dt * auraRate;
      if (run.pendingVictory) break;
      if (e.dead) continue;
      const skadiSlow = run.totalTime < (e.skadiSlowUntil || 0) ? (e.skadiSlowRatio || 1) : 1;
      const enrageSpeed = e.variant === 'roshan' ? (e.enraged ? 1.18 : 1) : (e.enrage > 0 ? 1.35 : 1);
      const frostSlow = run.totalTime < (e.buffSlowUntil || 0) ? 1 - e.buffSlow : 1;
      let speed = e.speed * Math.min(skadiSlow, frostSlow, auraRate) * enrageSpeed;
      if (run.character.id === 'kael' && e.kaelSlowUntil > run.totalTime) speed *= .65;
      const def = ENEMIES[e.id];
      if (def.elite && def.windup) {
        const canSee = !terrainLineBlocked(e.x, e.y, p.x, p.y, 14, false);
        if ((e.id === 'satyr' || e.id === 'darkTroll') && canSee) {
          if (dist < 180) { ux = -ux; uy = -uy; }
          else if (dist < 300) { ux = 0; uy = 0; }
        }
        if (e.windup > 0) {
          e.windup = Math.max(0, e.windup - dt); speed = 0;
          if (e.windup === 0) castEliteAbility(e);
        } else if (e.attackPose > 0) speed = 0;
        else if (e.attackClock <= 0 && dist < def.reach && canSee) {
          e.chargeX = dx / dist; e.chargeY = dy / dist;
          e.windup = def.windup; speed = 0;
        }
      } else if (e.id === 'shooter') {
        const canSee = !terrainLineBlocked(e.x, e.y, p.x, p.y, 6, false);
        if (canSee && dist < 270) { ux = -ux; uy = -uy; }
        else if (canSee && dist < 370) { ux = 0; uy = 0; }
        if (e.attackClock <= 0 && dist < 650 && canSee) {
          shootEnemyBullet(e.x, e.y, dx / dist, dy / dist, e.damage, 235, 6, '#ff8da8', 4, e);
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
        if (e.variant === 'roshan') {
          if (!e.enraged && e.hp <= e.maxHp * .55) {
            e.enrage = 999;
            e.enraged = true;
            e.damage = Math.round(e.damage * 1.2);
            pulse(e.x, e.y, 110, '#f5b65f', .65);
            showToast(t('roshanEnrage'));
            playSfx('warning-boss');
          }
          if (dist < 210) speed *= .48;
          if (e.windup > 0) {
            e.windup -= dt; speed = 0;
            if (e.windup <= 0) {
              const slamRadius = e.enraged ? 185 : 160;
              if (distance(e, p) <= slamRadius + p.radius && !terrainLineBlocked(e.x, e.y, p.x, p.y, e.r))
                hurtPlayer(e.damage * (e.enraged ? 1.5 : 1.25), e);
              const count = e.enraged ? 12 : 10;
              for (let i = 0; i < count; i++) {
                const angle = i * TAU / count + run.elapsed * .15;
                shootEnemyBullet(e.x, e.y, Math.cos(angle), Math.sin(angle), e.damage * .38, 185, 8, '#f5b65f', 2.8, e);
              }
              e.attackClock = e.enraged ? 2.55 : 3.35; e.attackPose = .42;
              run.effects.push({ kind: 'pulse', x: e.x, y: e.y, r: slamRadius, color: '#f5b65f', life: .48, maxLife: .48 });
              playSfx('boss-attack');
            }
          } else if (e.attackClock <= 0 && dist < 760) { e.windup = e.enraged ? .55 : .72; speed = 0; }
        } else {
          if (dist < 200) speed *= .5;
          if (e.windup > 0) {
            e.windup -= dt; speed = 0;
            if (e.windup <= 0) {
              const count = 12;
              for (let i = 0; i < count; i++) {
                const angle = i * TAU / count + run.elapsed * .25;
                shootEnemyBullet(e.x, e.y, Math.cos(angle), Math.sin(angle), e.damage * .55, 215, 6, '#ff8da8', 4, e);
              }
              e.attackClock = 2.7; e.attackPose = .32;
              run.effects.push({ kind: 'pulse', x: e.x, y: e.y, r: 78, color: '#f3a5c9', life: .4, maxLife: .4 });
              playSfx('boss-attack');
            }
          } else if (e.attackClock <= 0 && dist < 820) { e.windup = .55; speed = 0; }
        }
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
        hurtPlayer(e.damage, e, true);
      }
      if (phase !== 'combat') break;
    }
    run.enemies = run.enemies.filter(e => !e.dead);
  }
  function shootEnemyBullet(x, y, ux, uy, damage, speed, r = 6, color = '#ff8da8', life = 4, enemy = null) {
    run.enemyBullets.push({ enemy, sourceX: x, sourceY: y, x, y, vx: ux * speed, vy: uy * speed, damage, life, r, color });
  }
  function updateEnemyBullets(dt) {
    for (let i = run.enemyBullets.length - 1; i >= 0; i--) {
      const b = run.enemyBullets[i];
      const fromX = b.x, fromY = b.y;
      b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
      const wallTime = terrainHitTime(fromX, fromY, b.x, b.y, b.r);
      const playerTime = segmentCircleHitTime(fromX, fromY, b.x, b.y,
        run.player.x, run.player.y, b.r + run.player.radius);
      if (playerTime <= 1 && playerTime <= wallTime) { hurtPlayer(b.damage, { x: b.sourceX, y: b.sourceY, enemy: b.enemy }); run.enemyBullets.splice(i, 1); continue; }
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
    showToast(t('chestDrop'));
  }
  function killEnemy(e, rewards = true) {
    if (e.dead) return;
    e.dead = true; run.kills += 1;
    if (rewards) {
      if (run.character.id === 'sf' && !e.summoned) run.skills.souls += e.id === 'boss' ? 6 : isElite(e) ? 3 : 1;
      if (run.character.id === 'scavenger' && (isElite(e) || e.id === 'boss')) { const extra = e.id === 'boss' ? 10 : 3; run.money += extra; run.earned += extra; }
      const bonus = Math.random() * 100 < run.stats.luck * .5 ? 1 : 0;
      const materialCount = e.value > 0 && Math.random() < endlessDropChance() ? e.value + bonus : 0;
      dropPickup(e.x, e.y, materialCount);
      if (isElite(e) || e.id === 'boss') dropChest(e.x, e.y);
      else if (e.value > 0 && !run.normalChestDropped && Math.random() < .1) {
        dropChest(e.x, e.y);
        run.normalChestDropped = true;
      }
    }
    const def = enemyDef(e);
    run.effects.push({ kind: 'pulse', x: e.x, y: e.y, r: e.r * 1.8, color: def.color, life: .26, maxLife: .26 });
    if (SKIN_ART[selectedSkin][e.id] || (e.variant === 'roshan' && SKIN_ART[selectedSkin].roshan)) run.effects.push({ kind: 'shards', x: e.x, y: e.y, r: e.r, color: def.color, life: .34, maxLife: .34 });
    if (e.id === 'splitter') { spawnEnemy('runner', e.x - 18, e.y, true); spawnEnemy('runner', e.x + 18, e.y, true); }
    if (e.id === 'boss') {
      run.bossesRemaining = Math.max(0, run.bossesRemaining - 1);
      if (run.bossesRemaining === 0 && (isEndlessRun() || run.wave === MAX_WAVES)) run.pendingVictory = true;
    }
    if (e.id === 'boss') showToast(t('bossDefeated'));
  }

  function damageEnemy(e, amount, directHit = true, hit = null, resolvedDamage = false, rewards = true) {
    if (e.dead) return 0;
    const hpBefore = Math.max(0, e.hp);
    const crit = directHit && Math.random() * 100 < clamp(run.stats.crit, 0, 90);
    const critical = 1 + Math.max(0, run.stats.critDamage) / 100;
    const desolateAmp = directHit && hit?.type !== 'elemental' && run.totalTime < (e.desolateUntil || 0) ? 1 + (e.desolateMultiplier || 0) : 1;
    const assaultAmp = directHit && hit && hit.type !== 'elemental' ? 1 + buffPhysicalAmp(run, distance(e, run.player)) : 1;
    const damage = Math.max(1, Math.round(resolvedDamage ? amount : amount * Math.max(.1, 1 + run.stats.damage / 100) * desolateAmp * assaultAmp * (crit ? critical : 1)));
    e.hp -= damage; e.hitFlash = .1;
    if (crit) {
      run.effects.push({ kind: 'text', x: e.x, y: e.y - e.r, text: String(damage), color: '#ffe284', life: .5, maxLife: .5 });
      if (hit) {
        const fx = addEquipmentUpgradeEffect('buriza', equippedUpgradeLevel('buriza'), { x: e.x, y: e.y, r: Math.min(30, e.r + 12), angle: Math.atan2(e.y - run.player.y, e.x - run.player.x) });
        if (fx && run.upgradeCritAttackId !== hit.attackId) {
          run.upgradeCritAttackId = hit.attackId;
          if (run.totalTime >= (run.upgradeCritReadyAt || 0)) { run.upgradeCritReadyAt = run.totalTime + .25; playSfx('equipment-crit'); }
        }
      }
    }
    if (directHit && hit?.type !== 'elemental') {
      const blood = run.skills.bloodTime > 0 ? equipmentPassive('bloodRage')?.lifesteal || 0 : 0;
      heal(damage * clamp(run.stats.lifesteal + blood, 0, 65) / 100);
    }
    if (directHit && hit?.type === 'elemental') restoreSpellHealth(Math.min(hpBefore, damage));
    equipmentCombat.onDamage(Math.min(hpBefore, damage));
    if (e.hp <= 0) killEnemy(e, rewards);
    if (hit) {
      registerBaseAttackHit(e, hit);
      triggerEquipmentOnHit(e, hit);
      if (run.character.id === 'conductor') triggerStaticField(e);
    }
    return damage;
  }
  function triggerEquipmentOnHit(target, hit) {
    if (!hit) return;
    equipmentCombat.onHit(target, hit);
    const mark = equipmentPassive('soulMark');
    if (mark && !target.dead) target.orchidUntil = run.totalTime + mark.duration;
    const phaseStrike = equipmentPassive('phaseStrike');
    if (phaseStrike && run.totalTime < run.skills.phaseAttackUntil) {
      run.skills.phaseAttackUntil = 0;
      if (!target.dead) damageEnemy(target, phaseStrike.damage + physicalBonus() * phaseStrike.attackRatio, false);
      addEquipmentUpgradeEffect('phaseBoots', phaseStrike.level, { x: target.x, y: target.y, r: target.r + 8, angle: Math.atan2(target.y - run.player.y, target.x - run.player.x) });
    }
    const desolate = equipmentPassive('desolate');
    if (!target.dead && desolate && hit.type !== 'elemental') {
      target.desolateUntil = run.totalTime + desolate.duration;
      target.desolateMultiplier = desolate.multiplier;
      run.effects.push({ kind: 'desolate', x: target.x, y: target.y, r: target.r + 10, color: '#d85f58', life: .45, maxLife: .45 });
      addEquipmentUpgradeEffect('desolator', desolate.level, { x: target.x, y: target.y, r: target.r + 6, angle: Math.atan2(target.y - run.player.y, target.x - run.player.x) });
    }
    const frost = equipmentPassive('frostAttack');
    if (!target.dead && frost) {
      target.skadiSlowUntil = run.totalTime + frost.duration;
      target.skadiSlowRatio = 1 - frost.slow;
      run.effects.push({ kind: 'frost', x: target.x, y: target.y, r: target.r + 13, color: '#a9e8ff', life: .45, maxLife: .45 });
      addEquipmentUpgradeEffect('skadi', frost.level, { x: target.x, y: target.y, r: target.r + 13 });
    }
    const lightning = equipmentPassive('chainLightning');
    if (lightning && run.chainProcAttackId !== hit.attackId) {
      run.chainProcAttackId = hit.attackId;
      if (run.totalTime >= run.chainReadyAt && Math.random() < lightning.chance) {
        run.chainReadyAt = run.totalTime + .2;
        let current = target, from = run.player;
        const struck = new Set();
        const upgradeFx = addEquipmentUpgradeEffect('mjollnir', lightning.level, { x: target.x, y: target.y, r: 22, angle: Math.atan2(target.y - run.player.y, target.x - run.player.x) });
        for (let jump = 0; jump <= lightning.jumps && current; jump++) {
          struck.add(current);
          run.effects.push({ kind: 'line', x1: from.x, y1: from.y, x2: current.x, y2: current.y, color: upgradeFx ? '#54caff' : '#c7eeff', life: .2, maxLife: .2, width: upgradeFx ? 5 : 4, upgradeLevel: upgradeFx?.level });
          if (!current.dead) damageEnemy(current, (lightning.damage + run.stats.elemental * .4) * Math.pow(.7, jump), false);
          from = current;
          current = run.enemies.filter(e => !e.dead && !struck.has(e) && distance(e, from) <= 190).sort((a, b) => distance(a, from) - distance(b, from))[0];
        }
        playSfx('arc');
      }
    }
    const cleave = equipmentPassive('cleave');
    if (cleave && hit.type === 'melee' && run.cleaveAttackId !== hit.attackId) {
      run.cleaveAttackId = hit.attackId;
      const origin = cleave.mode === 'impact' ? target : run.player;
      const angle = Math.atan2(target.y - run.player.y, target.x - run.player.x);
      for (const e of run.enemies) if (e !== target && !e.dead && distance(e, origin) <= cleave.radius + e.r
        && inAttackFan(origin, e, angle, cleave.arcDegrees)) {
        damageEnemy(e, hit.damage * cleave.damageRatio, false);
      }
      addEquipmentUpgradeEffect('battlefury', cleave.level, { x: origin.x, y: origin.y, r: cleave.radius,
        angle, mode: cleave.mode, arcDegrees: cleave.arcDegrees });
    }
    const mirror = equipmentPassive('mirrorImage');
    if (mirror && run.skills.mantaProcAttackId !== hit.attackId) {
      run.skills.mantaProcAttackId = hit.attackId;
      run.skills.mantaAttackCount += 1;
      if (run.skills.mantaAttackCount >= mirror.hits) {
        run.skills.mantaAttackCount = 0;
        const angle = Math.atan2(target.y - run.player.y, target.x - run.player.x);
        const upgradeFx = addEquipmentUpgradeEffect('manta', mirror.level, { x: run.player.x, y: run.player.y, angle });
        for (let i = 0; i < mirror.projectiles; i++) {
          const offset = (i / (mirror.projectiles - 1) * 2 - 1) * mirror.spread;
          addShot(run.player.x + Math.cos(angle) * 21, run.player.y + Math.sin(angle) * 21,
            angle + offset, run.baseAttack, hit.damage * mirror.ratio * 2 / mirror.projectiles,
            { attackId: hit.attackId, illusion: true, color: '#b9a6ff', upgradeFx, evolutionLevel: mirror.level });
        }
        run.effects.push({ kind: 'manta', x: run.player.x, y: run.player.y, r: 42, color: '#c5b4ff', life: .55, maxLife: .55 });
      }
    }
  }
  function updatePickups(dt) {
    const p = run.player, range = 75 + run.stats.pickup;
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
          showToast(t('chestPending', { status: recovered ? t('healthGain', { amount: recovered }) : t('fullHealth') }));
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

  function baseAttackDamage(w) {
    const def = baseAttackDefinition(w.id);
    return (def.damage + (def.type === 'elemental' ? run.stats.elemental : physicalBonus())) * (w.id === 'tb' && run.skills.tb.time > 0 ? run.skills.tb.amp : 1);
  }
  function attackSpeed() { return run.stats.attackSpeed + buffAttackSpeed(run) + (run.skills.rageTime > 0 ? 40 * run.skills.rageAmp : 0); }
  function registerBaseAttackHit(e, hit) {
    const s = run.skills;
    if (run.character.id === 'tb' && registerTerrorbladeHit(s.tb, hit.tbAttack)) playSfx('tb-image');
    if (s.lastBasicAttack === hit.attackId) return;
    s.lastBasicAttack = hit.attackId;
    if (run.character.id === 'jugg') s.attackHits = Math.min(5, s.attackHits + 1);
  }
  function damageTerrorbladeImage(enemy, amount) {
    const desolate = run.totalTime < (enemy.desolateUntil || 0) ? 1 + (enemy.desolateMultiplier || 0) : 1;
    return damageEnemy(enemy, amount * desolate * (1 + buffPhysicalAmp(run, distance(enemy, run.player))), false);
  }
  function getTarget(range, type, baseAttackId) {
    const p = run.player;
    const candidates = run.enemies.filter(e => !e.dead && distance(e, p) <= range
      && (type === 'elemental' || !terrainLineBlocked(p.x, p.y, e.x, e.y, 4, false)));
    if (run.aimTarget) {
      const near = candidates.filter(e => distance(e, run.aimTarget) < 120).sort((a, b) => distance(a, run.aimTarget) - distance(b, run.aimTarget))[0];
      if (near) return near;
    }
    return candidates.sort((a, b) => distance(a, p) - distance(b, p))[0];
  }
  function addShot(x, y, angle, w, damage, options = {}) {
    const def = baseAttackDefinition(w.id), speed = def.speed || 700;
    const shot = { x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      life: basicRange() / speed, damage, r: w.id === 'sf' ? 5 : 3, color: options.color || def.color,
      pierce: options.pierce || 1, hit: new Set(), skill: !!options.skill, illusion: !!options.illusion, kaelSpell: options.kaelSpell, hero: w.id,
      hitCounts: options.hitCounts, maxHits: options.maxHits, attackId: options.attackId, upgradeFx: options.upgradeFx,
      evolutionLevel: options.evolutionLevel, heroGrowthTier: heroGrowthTier(run.level),
      tbAttack: options.tbAttack, tbImage: !!options.tbImage, imageSide: options.imageSide || 0,
      deadShotJumps: options.kaelSpell ? 0 : buffCount('deadShot'),
      type: def.type, range: basicRange(), baseDamage: damage };
    run.bullets.push(shot);
    return shot;
  }
  function addDeadShotBounce(origin, shot, damage) {
    if (!(shot.deadShotJumps > 0)) return;
    const target = pick(run.enemies.filter(e => !e.dead && !shot.hit.has(e)
      && (!shot.hitCounts || (shot.hitCounts.get(e) || 0) < shot.maxHits)
      && distance(e, origin) <= 240
      && !terrainLineBlocked(origin.x, origin.y, e.x, e.y, shot.r, false)));
    if (!target) return;
    const angle = Math.atan2(target.y - origin.y, target.x - origin.x), speed = Math.hypot(shot.vx, shot.vy);
    run.bullets.push({ ...shot, x: origin.x, y: origin.y,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, homing: target,
      life: 240 / speed, range: 240, damage: damage * .7, pierce: 1,
      deadShotChain: true, deadShotJumps: shot.deadShotJumps - 1, lunaChain: false });
  }
  function addLunaBounce(origin, hitSet, damage, depth, deadShotJumps = 0) {
    if (depth >= 2) return false;
    const target = run.enemies.filter(e => !e.dead && !hitSet.has(e)
      && distance(e, origin) <= 190
      && !terrainLineBlocked(origin.x, origin.y, e.x, e.y, 4, false))
      .sort((a, b) => distance(a, origin) - distance(b, origin))[0];
    if (!target) return false;
    const angle = Math.atan2(target.y - origin.y, target.x - origin.x), speed = 760;
    run.bullets.push({ x: origin.x, y: origin.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      life: 190 / speed, damage: damage * .7, r: 4, color: '#b9d9ff',
      pierce: 1, hit: hitSet, skill: false, illusion: false, lunaChain: true, lunaDepth: depth + 1,
      hero: 'luna', type: 'ranged', range: 190, baseDamage: damage * .7, deadShotJumps });
    return true;
  }
  function resolvePendingBaseAttack() {
    const p = run.player, pending = p.pendingAttack;
    if (!pending || pending.resolved) return;
    pending.resolved = true;
    const { weaponId, attackId } = pending;
    const def = baseAttackDefinition(weaponId);
    let { type, damage, angle } = pending;
    if (weaponId === 'tb') {
      const target = pending.target;
      if (!target || target.dead || distance(target, p) > basicRange() + (def.type === 'melee' ? target.r : 0)
        || terrainLineBlocked(p.x, p.y, target.x, target.y, 4, false)) { p.pendingAttack = null; return; }
      type = def.type; damage = baseAttackDamage({ id: weaponId });
      angle = Math.atan2(target.y - p.y, target.x - p.x); p.attackFacing = angle;
    }
    const hit = { attackId, type, range: basicRange(), damage, tbAttack: weaponId === 'tb' ? { counted: false } : null };
    // Snapshot before the direct hit can create a new image.
    const images = weaponId === 'tb' ? run.skills.tb.images.length : 0;
    const animationScale = pending.duration / .42;
    if (type === 'melee') {
      for (const e of run.enemies) {
        if (e.dead || distance(e, p) > hit.range + e.r) continue;
        const relative = Math.atan2(Math.sin(Math.atan2(e.y - p.y, e.x - p.x) - angle), Math.cos(Math.atan2(e.y - p.y, e.x - p.x) - angle));
        if (Math.abs(relative) < .9 && !terrainLineBlocked(p.x, p.y, e.x, e.y, 4, false)) {
          damageEnemy(e, damage, true, hit);
          for (let i = 0; i < images && !e.dead; i++) damageTerrorbladeImage(e, damage * .3);
        }
      }
      run.effects.push({ kind: 'melee-swing', character: weaponId, x: p.x, y: p.y, r: hit.range, angle, direction: attackId % 2 ? 1 : -1, color: def.color, life: .28 * animationScale, maxLife: .28 * animationScale });
    } else if (type === 'elemental') {
      addShot(p.x + Math.cos(angle) * 20, p.y + Math.sin(angle) * 20, angle, { id: weaponId }, damage, { attackId });
      run.effects.push({ kind: 'muzzle', x: p.x + Math.cos(angle) * 20, y: p.y + Math.sin(angle) * 20, angle, r: 10, color: def.color, life: .14 * animationScale, maxLife: .14 * animationScale });
    } else {
      const offset = weaponId === 'tb' ? 0 : 21;
      addShot(p.x + Math.cos(angle) * offset, p.y + Math.sin(angle) * offset, angle, { id: weaponId }, damage, { attackId, tbAttack: hit.tbAttack });
      for (let i = 0; i < images; i++) addShot(p.x, p.y, angle, { id: weaponId }, damage * .3,
        { illusion: true, tbImage: true, imageSide: i ? 1 : -1 });
      run.effects.push({ kind: weaponId === 'sf' ? 'soul-muzzle' : 'muzzle', x: p.x + Math.cos(angle) * 21, y: p.y + Math.sin(angle) * 21, angle, r: 13, color: def.color, life: .13 * animationScale, maxLife: .13 * animationScale });
    }
    playSfx(type === 'melee' ? 'blade' : type === 'elemental' ? 'arc' : weaponId === 'sf' ? 'soul' : 'pulse');
    p.pendingAttack = null;
  }
  function fireBaseAttack(w) {
    const def = baseAttackDefinition(w.id), p = run.player, target = getTarget(basicRange(), def.type, w.id);
    if (!target) return;
    w.cool = Math.max(.09, def.cooldown / Math.max(.2, 1 + attackSpeed() / 100));
    const angle = Math.atan2(target.y - p.y, target.x - p.x);
    p.attackDuration = Math.min(.42, w.cool);
    p.attackPose = p.attackDuration; p.attackClock = 0; p.attackFacing = angle;
    const damage = baseAttackDamage(w), attackId = ++run.attackSeq;
    p.pendingAttack = { weaponId: w.id, type: def.type, damage, attackId, angle, target, resolved: false,
      duration: p.attackDuration, strikeTime: BASE_ATTACK_STRIKE_TIME * p.attackDuration / .42, elapsed: 0 };
  }
  function updateBaseAttack(dt) {
    const attack = run.baseAttack;
    attack.cool = Math.max(0, attack.cool - dt);
    if (attack.cool <= 0 && run.player.attackPose <= 0 && !run.player.pendingAttack
      && run.player.dashTime <= 0) fireBaseAttack(attack);
  }
  function updateBullets(dt) {
    for (let i = run.bullets.length - 1; i >= 0; i--) {
      const b = run.bullets[i];
      const fromX = b.x, fromY = b.y;
      if (b.homing && !b.homing.dead) {
        const angle = Math.atan2(b.homing.y - b.y, b.homing.x - b.x);
        const speed = Math.hypot(b.vx, b.vy);
        b.vx = Math.cos(angle) * speed; b.vy = Math.sin(angle) * speed;
      }
      const step = b.lunaChain || b.deadShotChain ? Math.min(dt, Math.max(0, b.life)) : dt;
      b.x += b.vx * step; b.y += b.vy * step; b.life -= dt;
      let remove = false;
      const dx = b.x - fromX, dy = b.y - fromY;
      const wallTime = b.type === 'elemental' && !b.deadShotChain ? Infinity : terrainHitTime(fromX, fromY, b.x, b.y, b.r);
      const hits = run.enemies.filter(e => !e.dead && !b.hit.has(e))
        .map(e => ({ enemy: e, time: segmentCircleHitTime(fromX, fromY, b.x, b.y, e.x, e.y, b.r + e.r) }))
        .filter(hit => hit.time <= 1 && hit.time <= wallTime)
        .sort((a, b) => a.time - b.time);
      for (const { enemy: e } of hits) {
        if (e.dead) continue;
        b.hit.add(e);
        const count = b.hitCounts?.get(e) || 0;
        if (!b.hitCounts || count < b.maxHits) {
          b.hitCounts?.set(e, count + 1);
          if (b.kaelSpell) dealSkillDamage(e, b.damage, b.active);
          else if (b.deadShotChain) {
            const dealt = damageEnemy(e, b.damage, false, null, true);
            addDeadShotBounce(e, b, dealt);
          }
          else if (b.lunaChain) {
            const dealt = damageEnemy(e, b.damage, false, null, true);
            if (!addLunaBounce(e, b.hit, b.damage, b.lunaDepth, b.deadShotJumps)) addDeadShotBounce(e, b, dealt);
            playSfx('luna-bounce');
          } else {
            const hpBefore = Math.max(0, e.hp);
            const dealt = b.tbImage ? damageTerrorbladeImage(e, b.damage)
              : damageEnemy(e, b.damage, !b.skill && !b.illusion, b.skill || b.illusion ? null : { attackId: b.attackId, type: b.type, range: b.range, damage: b.baseDamage, tbAttack: b.tbAttack });
            if (b.skill && !b.illusion && !b.tbImage) restoreSpellHealth(Math.min(hpBefore, dealt), true);
            if (dealt > 0) {
              const lunaBounce = b.hero === 'luna' && !b.skill && !b.illusion && b.hit.size === 1
                && addLunaBounce(e, b.hit, dealt, 0, b.deadShotJumps);
              if (!lunaBounce) addDeadShotBounce(e, b, dealt);
            }
          }
          if (b.kaelSpell === 'tornado' && !e.dead) kaelPushEnemy(e, 34, Math.atan2(e.y - run.player.y, e.x - run.player.x));
        }
        b.pierce -= 1;
        if (b.pierce <= 0) { remove = true; break; }
      }
      if (wallTime <= 1 && !remove) {
        b.x = fromX + dx * wallTime; b.y = fromY + dy * wallTime;
        run.effects.push({ kind: 'pulse', x: b.x, y: b.y, r: 12, color: b.color, life: .16, maxLife: .16 });
        remove = true;
      }
      if (b.life <= 0) remove = true;
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
      showToast(t('hazard', { hazard: run.biome.hazard }));
    }
    for (let i = run.hazards.length - 1; i >= 0; i--) {
      const h = run.hazards[i]; h.life -= dt;
      if (h.life < 1.5 && !h.hit && distance(h, run.player) < h.r + run.player.radius) { hurtPlayer(6 + run.wave * .25); h.hit = true; }
      if (h.life <= 0) run.hazards.splice(i, 1);
    }
  }
  function updateEffects(dt) {
    for (let i = run.effects.length - 1; i >= 0; i--) {
      const fx = run.effects[i];
      if (fx.kind === 'melee-swing') { fx.x = run.player.x; fx.y = run.player.y; }
      fx.life -= dt;
      if (fx.life <= 0) run.effects.splice(i, 1);
    }
    run.screenShake = Math.max(0, run.screenShake - dt * 25);
  }

  function skillStatus(index) {
    const s = run.skills, id = run.character.id;
    if (index === 0) {
      if (id === 'tb' && s.tb.time > 0) return `${selectedLocale === 'en' ? 'Demon' : selectedLocale === 'zh-TW' ? '惡魔形態' : '恶魔形态'} ${s.tb.time.toFixed(1)}s`;
      if (id === 'kael' && !s.lastPassiveSpell) return selectedLocale === 'en' ? 'Waiting for a spell' : selectedLocale === 'zh-TW' ? '等待隨機法術' : '等待随机法术';
      return s.activeCooldown > 0 ? t('cooldown', { time: s.activeCooldown.toFixed(1) })
        : run.player.mana < ACTIVE_SKILL_CONFIG[id].manaCost ? t('needMana') : id === 'kael' ? `${selectedLocale === 'en' ? 'Replay' : selectedLocale === 'zh-TW' ? '重放' : '重放'}：${kaelSpellName(s.lastPassiveSpell)}` : t('activeReady');
    }
    if (id === 'kael') return s.lastPassiveSpell ? `${selectedLocale === 'en' ? 'Last' : selectedLocale === 'zh-TW' ? '最近' : '最近'}：${kaelSpellName(s.lastPassiveSpell)} · ${Math.max(0, s.kaelPassiveTimer).toFixed(1)}s` : `${selectedLocale === 'en' ? 'Next random' : selectedLocale === 'zh-TW' ? '下次隨機' : '下次随机'}：${Math.max(0, s.kaelPassiveTimer).toFixed(1)}s`;
    if (id === 'rover') return `${t('statBaseAttackRange')} ${basicRange()}`;
    if (id === 'bulwark') return t('quillCount', { count: s.receivedHits % 4 });
    if (id === 'conductor') return t('staticReady');
    if (id === 'scavenger') return t('dividendCount', { count: s.manualPickups % 8 });
    if (id === 'jugg') return t('leapCount', { count: s.attackHits }) + (s.leapCooldown > 0 ? ` · ${s.leapCooldown.toFixed(1)}s` : '');
    if (id === 'luna') return selectedLocale === 'en' ? 'Bounces 2' : selectedLocale === 'zh-TW' ? '彈射 2' : '弹射 2';
    if (id === 'tb') return `${selectedLocale === 'en' ? 'Charge' : selectedLocale === 'zh-TW' ? '蓄影' : '蓄影'} ${s.tb.hits}/6 · ${selectedLocale === 'en' ? 'Images' : '魔影'} ${s.tb.images.length}/2`;
    return t('soulCount', { count: s.souls, attack: Number(soulAttackBonus().toFixed(2)) });
  }
  function renderSkillStrip() {
    const skills = SKILLS[run.character.id];
    $('skill-strip').dataset.hero = run.character.id;
    const ready = run.skills.activeCooldown <= 0 && run.player.mana >= ACTIVE_SKILL_CONFIG[run.character.id].manaCost && (run.character.id !== 'kael' || !!run.skills.lastPassiveSpell) && !(run.character.id === 'tb' && run.skills.tb.time > 0);
    $('skill-strip').innerHTML = skills.map((skill, i) => `<div class="skill-slot ${i === 0 && ready ? 'is-ready' : i === 0 ? 'is-cooling' : ''}" title="${skill.desc}"><strong><span class="skill-kind">${t(i ? 'passive' : 'active')}</span> ${skill.name}</strong><span>${skillStatus(i)}</span></div>`).join('');
    $('skill-button').disabled = !ready;
    $('skill-button').classList.toggle('is-mana-blocked', run.skills.activeCooldown <= 0 && !ready);
    const cost = ACTIVE_SKILL_CONFIG[run.character.id].manaCost;
    const shortStatus = run.character.id === 'tb' && run.skills.tb.time > 0 ? skillStatus(0) : run.skills.activeCooldown > 0 ? `${run.skills.activeCooldown.toFixed(1)}s · ${cost} MP` : run.character.id === 'kael' && !run.skills.lastPassiveSpell ? skillStatus(0) : `${ready ? 'Q' : t('needMana')} · ${cost} MP`;
    const buttonName = run.character.id === 'tb' && selectedLocale === 'en' ? 'Demon Form' : skills[0].name;
    $('skill-button').innerHTML = `<span>${buttonName}</span><small>${shortStatus}</small>`;
    $('skill-button').setAttribute('aria-label', `${buttonName} · ${skillStatus(0)} · ${t('mana')} ${cost}`);
  }
  function renderPauseDetails() {
    const s = run.stats, p = run.player;
    const stats = [
      [t('statLife'), `${Math.ceil(p.hp)} / ${p.maxHp}`], [t('statArmor'), s.armor], [t('statMove'), `${s.speed}%`], [t('statAttackSpeed'), `${attackSpeed().toFixed(0)}%`],
      [t('statAttackDamage'), Number(physicalBonus().toFixed(2))], [t('statSpellBonus'), s.elemental], [t('statAllDamage'), `${s.damage}%`],
      [t('statCrit'), `${Math.min(90, s.crit)}%`], [t('statCritDamage'), `${100 + s.critDamage}%`], [t('statDodge'), `${Math.min(55, s.dodge)}%`], [t('statLifesteal'), `${Math.min(65, s.lifesteal)}%`],
      [t('statRegen5'), s.regen], [t('statPickup'), 75 + s.pickup], [t('statLuck'), s.luck],
      [t('statBaseAttackRange'), basicRange()], [t('mana'), `${Math.floor(p.mana)} / ${p.maxMana}`],
      [t('statManaRegen'), `${s.manaRegen}/s`], [t('statAbilityHaste'), `${clamp(s.abilityHaste, 0, 60)}%`]
    ];
    $('pause-stats').innerHTML = stats.map(([name, value]) => `<div class="pause-stat"><span>${name}</span><strong>${value}</strong></div>`).join('');
    $('pause-equipment').innerHTML = run.equipment.length ? run.equipment.map(item => {
      const def = equipmentDef(item);
      return `<div class="equipment-item ${def.kind === 'finished' ? 'finished-equipment' : ''}" ${equipmentAttributes(def)}><span>${equipmentIcon(item.id)}</span><div><strong>${equipmentName(def)}</strong>${equipmentBadges(def)}<p>${equipmentDesc(def)}</p></div></div>`;
    }).join('') : `<p>${t('emptyEquipment')}</p>`;
    $('pause-builds').innerHTML = `<h3>${wt('builds')}</h3>${buildCards()}<p class="reserve-caption">${wt('summary', { active: run.equipment.length, reserve: run.equipmentReserve.length })}</p>`;
    $('pause-buffs').innerHTML = BUFF_IDS.filter(id => buffCount(id) > 0).map(id => {
      const def = BUFFS[id];
      const chargeNote = id === 'shallowGrave' ? `<small>${t('buffCharges', { count: run.buffState.graveCharges, total: buffCount(id) })}</small>` : '';
      return `<div class="pause-buff" data-buff-rarity="${def.rarity}">${buffIcon(def)}<div><strong>${buffName(def)} ×${buffCount(id)}</strong>${buffRarityBadge(def)}${chargeNote}<p>${buffDesc(def)}</p></div></div>`;
    }).join('') || `<p class="equipment-empty">${t('buffEmpty')}</p>`;
    $('pause-buffs').insertAdjacentHTML('beforeend', `<p class="buff-empty">${t('buffLimits')}</p>`);
    $('pause-skills').dataset.hero = run.character.id;
    $('pause-skills').innerHTML = SKILLS[run.character.id].map((skill, i) => `<div class="pause-skill"><strong>${t(i ? 'passive' : 'active')} · ${skill.name}</strong><p>${skill.desc}</p><small>${t('current', { status: skillStatus(i) })}</small></div>`).join('')
      + (run.character.id === 'kael' ? `<div class="pause-skill"><strong>${selectedLocale === 'en' ? 'Spell pool' : selectedLocale === 'zh-TW' ? '法術池' : '法术池'}</strong><p>${kaelVolleyText(run.skills.kaelSpellRank)}</p>${KAEL_SPELLS.map(spell => `<p${run.skills.lastPassiveSpell === spell.id ? ' class="is-current"' : ''}><strong>${kaelSpellName(spell.id)}</strong> · ${kaelSpellDesc(spell.id)}</p>`).join('')}</div>` : '');
  }
  function updateHUD() {
    if (!run) return;
    $('wave-label').textContent = isEndlessRun() ? `${modeName('endless')} · ${t('bestWave', { wave: run.wave })}` : t('wave', { wave: run.wave, max: MAX_WAVES });
    $('time-label').textContent = run.timeLeft <= 0 && run.bossFight ? t('boss') : String(Math.max(0, Math.ceil(run.timeLeft)));
    $('biome-label').textContent = run.biome.name;
    $('hp-label').textContent = t('hp', { hp: Math.ceil(run.player.hp), max: run.player.maxHp });
    $('hp-fill').style.width = `${Math.max(0, run.player.hp / run.player.maxHp * 100)}%`;
    $('mana-label').textContent = t('manaValue', { mana: Math.floor(run.player.mana), max: run.player.maxMana });
    $('mana-fill').style.width = `${Math.max(0, run.player.mana / run.player.maxMana * 100)}%`;
    $('xp-label').textContent = `${t('level', { level: run.level })}${run.pendingLevels ? t('pending', { count: run.pendingLevels }) : ''}`;
    $('xp-fill').style.width = `${run.xp / run.xpNeed * 100}%`;
    $('money-label').textContent = run.money;
    $('hud-stats').textContent = isEndlessRun()
      ? `${t('defeated', { kills: run.kills })} · ${t('factor')} F${endlessFactor().toFixed(2)} · ${t('dash')} ${run.player.dashCooldown > 0 ? t('dashCooldown', { time: run.player.dashCooldown.toFixed(1) }) : t('dashReady')}`
      : `${t('defeated', { kills: run.kills })} · ${t('dash')} ${run.player.dashCooldown > 0 ? t('dashCooldown', { time: run.player.dashCooldown.toFixed(1) }) : t('dashReady')}`;
    $('dash-button').disabled = run.player.dashCooldown > 0;
    $('dash-button').innerHTML = `${t('dash')}<small class="key-hint">${selectedLocale === 'en' ? 'Space' : '空格'}</small>`;
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
    updateBaseAttack(dt);
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
  // Cosmetic variation depends only on world coordinates, never the combat RNG.
  function sceneryNoise(x, y) {
    let n = Math.imul(x, 374761393) ^ Math.imul(y, 668265263);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
  }
  function drawPixelGround(cam) {
    const colors = SCENERY_COLORS[run.biome.id];
    const ground = artImage(`map-${run.biome.id}-ground`);
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, WORLD.w, WORLD.h); ctx.clip();
    ctx.fillStyle = colors.ground; ctx.fillRect(0, 0, WORLD.w, WORLD.h);
    if (ground) {
      for (let x = Math.floor(cam.x / 64) * 64; x < Math.min(WORLD.w, cam.x + viewW + 64); x += 64) {
        for (let y = Math.floor(cam.y / 64) * 64; y < Math.min(WORLD.h, cam.y + viewH + 64); y += 64) {
          const flip = Math.floor(sceneryNoise(x, y) * 4);
          ctx.save(); ctx.translate(x + (flip & 1 ? 64 : 0), y + (flip & 2 ? 64 : 0));
          ctx.scale(flip & 1 ? -1 : 1, flip & 2 ? -1 : 1);
          ctx.drawImage(ground, 0, 0, 64, 64); ctx.restore();
        }
      }
    }
    // Broad, soft material changes break up the small repeated texture.
    for (let x = Math.floor((cam.x - 240) / 240) * 240; x < cam.x + viewW + 240; x += 240) {
      for (let y = Math.floor((cam.y - 180) / 180) * 180; y < cam.y + viewH + 180; y += 180) {
        const n = sceneryNoise(x, y), px = x + Math.floor(n * 120), py = y + Math.floor(sceneryNoise(y, x + 1) * 80);
        const rx = 64 + Math.floor(n * 100), ry = 28 + Math.floor(n * 48);
        ctx.fillStyle = n > .45 ? colors.shade : colors.light; ctx.globalAlpha = .18;
        for (let row = -ry; row < ry; row += 8) {
          const half = Math.round(rx * Math.sqrt(Math.max(0, 1 - row * row / (ry * ry))) / 4) * 4;
          ctx.fillRect(px - half, py + row, half * 2, 8);
        }
      }
    }
    ctx.globalAlpha = .7;
    for (let x = Math.floor(cam.x / 96) * 96; x < cam.x + viewW + 96; x += 96) {
      for (let y = Math.floor(cam.y / 96) * 96; y < cam.y + viewH + 96; y += 96) {
        const n = sceneryNoise(x + 9, y), px = x + Math.floor(n * 72 / 2) * 2, py = y + Math.floor(sceneryNoise(y, x + 7) * 72 / 2) * 2;
        if (n < .35) continue;
        ctx.fillStyle = colors.shade; ctx.fillRect(px - 4, py + 2, 12, 2);
        if (run.biome.id === 'grove' || n > .82) {
          ctx.fillStyle = colors.grass;
          ctx.fillRect(px, py - 5, 2, 8); ctx.fillRect(px - 4, py - 2, 2, 5); ctx.fillRect(px + 4, py - 3, 2, 6);
        } else {
          ctx.fillStyle = colors.light; ctx.fillRect(px, py, 5, 2); ctx.fillRect(px + 9, py + 6, 3, 2);
        }
      }
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = colors.bank;
    ctx.fillRect(0, 0, WORLD.w, 10); ctx.fillRect(0, WORLD.h - 10, WORLD.w, 10);
    ctx.fillRect(0, 0, 10, WORLD.h); ctx.fillRect(WORLD.w - 10, 0, 10, WORLD.h);
    ctx.fillStyle = colors.shore;
    ctx.fillRect(10, 10, WORLD.w - 20, 3); ctx.fillRect(10, WORLD.h - 13, WORLD.w - 20, 3);
    ctx.fillRect(10, 10, 3, WORLD.h - 20); ctx.fillRect(WORLD.w - 13, 10, 3, WORLD.h - 20);
    ctx.restore();
  }
  function drawBackdrop(cam) {
    const b = run.biome;
    ctx.fillStyle = b.ground;
    ctx.fillRect(0, 0, WORLD.w, WORLD.h);
    if (selectedSkin === 'pixel') {
      drawPixelGround(cam);
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
    if (selectedSkin === 'pixel') {
      for (const o of run.terrain) {
        if (o.kind !== 'water' || o.x + o.w + 16 < cam.x || o.x - 16 > cam.x + viewW || o.y + o.h + 16 < cam.y || o.y - 16 > cam.y + viewH) continue;
        drawWater(o);
      }
      return;
    }
    const biome = run.biome.id;
    for (const o of run.terrain) {
      const w = o.kind === 'water' ? o.w : 48, h = o.kind === 'tree' ? 64 : o.kind === 'water' ? o.h : 48;
      const left = o.kind === 'water' ? o.x : o.x - 24;
      const top = o.kind === 'tree' ? o.y - 48 : o.kind === 'rock' ? o.y - 24 : o.y;
      if (left + w < cam.x || left > cam.x + viewW || top + h < cam.y || top > cam.y + viewH) continue;
      const image = artImage(`map-${biome}-${o.kind}`);
      if (o.kind === 'water') {
        drawWater(o);
      } else if (image) {
        ctx.drawImage(image, left, top, w, h);
      } else if (o.kind === 'tree') {
        ctx.fillStyle = '#6e6652'; ctx.fillRect(o.x - 6, o.y - 12, 12, 27);
        ctx.fillStyle = run.biome.accent; ctx.beginPath(); ctx.arc(o.x, o.y - 26, 23, 0, TAU); ctx.fill();
      } else {
        ctx.fillStyle = '#7f9194'; ctx.beginPath(); ctx.arc(o.x, o.y, 23, 0, TAU); ctx.fill();
      }
    }
  }
  function riverPoints(o) {
    if (o.renderPoints?.length) return o.renderPoints;
    const source = o.curve?.length > 1 ? o.curve : [{ x: o.x, y: o.y + o.h / 2, r: o.h / 2 }, { x: o.x + o.w, y: o.y + o.h / 2, r: o.h / 2 }];
    const points = [], subdivisions = 8;
    const catmull = (a, b, c, d, t) => .5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
    for (let i = 0; i < source.length - 1; i++) {
      const p0 = source[Math.max(0, i - 1)], p1 = source[i], p2 = source[i + 1], p3 = source[Math.min(source.length - 1, i + 2)];
      for (let step = 0; step < subdivisions; step++) {
        const t = step / subdivisions;
        points.push({
          x: catmull(p0.x, p1.x, p2.x, p3.x, t),
          y: catmull(p0.y, p1.y, p2.y, p3.y, t),
          r: p1.r + (p2.r - p1.r) * t
        });
      }
    }
    points.push({ ...source[source.length - 1] });
    o.renderPoints = points;
    return points;
  }
  function riverPath(o, pad = 0) {
    const points = riverPoints(o), left = [], right = [];
    for (let i = 0; i < points.length; i++) {
      const prev = points[Math.max(0, i - 1)], next = points[Math.min(points.length - 1, i + 1)];
      const dx = next.x - prev.x, dy = next.y - prev.y, length = Math.hypot(dx, dy) || 1;
      const radius = Math.max(4, points[i].r + pad), nx = -dy / length, ny = dx / length;
      left.push({ x: points[i].x + nx * radius, y: points[i].y + ny * radius });
      right.push({ x: points[i].x - nx * radius, y: points[i].y - ny * radius });
    }
    ctx.beginPath(); ctx.moveTo(left[0].x, left[0].y);
    for (let i = 1; i < left.length; i++) ctx.lineTo(left[i].x, left[i].y);
    const end = points[points.length - 1], endAngle = Math.atan2(end.y - points[points.length - 2].y, end.x - points[points.length - 2].x);
    for (let step = 1; step <= 8; step++) {
      const angle = endAngle + Math.PI / 2 - Math.PI * step / 8, radius = Math.max(4, end.r + pad);
      ctx.lineTo(end.x + Math.cos(angle) * radius, end.y + Math.sin(angle) * radius);
    }
    for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i].x, right[i].y);
    const start = points[0], startAngle = Math.atan2(points[1].y - start.y, points[1].x - start.x);
    for (let step = 1; step <= 8; step++) {
      const angle = startAngle - Math.PI / 2 - Math.PI * step / 8, radius = Math.max(4, start.r + pad);
      ctx.lineTo(start.x + Math.cos(angle) * radius, start.y + Math.sin(angle) * radius);
    }
    ctx.closePath();
  }
  function drawRiverStroke(o, color, width, alpha = 1) {
    const points = riverPoints(o);
    ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i++) {
      const midX = (points[i].x + points[i + 1].x) / 2, midY = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
    }
    const last = points[points.length - 1], previous = points[points.length - 2];
    ctx.quadraticCurveTo(previous.x, previous.y, last.x, last.y); ctx.stroke(); ctx.restore();
  }
  function riverPointAt(o, amount) {
    const segments = riverSegments(o), lengths = segments.map(segment => Math.hypot(segment.b.x - segment.a.x, segment.b.y - segment.a.y));
    const total = lengths.reduce((sum, length) => sum + length, 0), target = clamp(amount, 0, .99999) * total;
    let walked = 0;
    for (let i = 0; i < segments.length; i++) {
      const length = lengths[i];
      if (target <= walked + length || i === segments.length - 1) {
        const segment = segments[i], t = clamp((target - walked) / (length || 1), 0, 1);
        const dx = segment.b.x - segment.a.x, dy = segment.b.y - segment.a.y;
        return { x: segment.a.x + dx * t, y: segment.a.y + dy * t, r: segment.r, angle: Math.atan2(dy, dx) };
      }
      walked += length;
    }
    return { ...segments[0].a, angle: 0 };
  }
  function drawRiverFish(x, y, size, direction, color) {
    ctx.save(); ctx.translate(Math.round(x), Math.round(y)); ctx.scale(direction, 1);
    ctx.fillStyle = '#183d46';
    ctx.fillRect(-size, -2, size * 2, size);
    ctx.fillRect(-size * 1.45, -size * .5, size * .45, size * 1.5);
    ctx.fillStyle = color; ctx.fillRect(-size * .65, -size * .5, size * 1.1, size * .65);
    ctx.fillStyle = '#f2f2d3'; ctx.fillRect(size * .45, -size * .25, 2, 2);
    ctx.restore();
  }
  function drawRiverStone(x, y, size, colors) {
    ctx.fillStyle = '#183b43'; ctx.globalAlpha = .42;
    ctx.fillRect(Math.round(x - size * 1.2), Math.round(y + size * .45), Math.ceil(size * 2.4), Math.ceil(size * .35));
    ctx.globalAlpha = .9; ctx.fillStyle = colors.stone;
    ctx.fillRect(Math.round(x - size), Math.round(y - size * .35), Math.ceil(size * 2), Math.ceil(size * .8));
    ctx.fillStyle = colors.shore; ctx.globalAlpha = .72;
    ctx.fillRect(Math.round(x - size * .55), Math.round(y - size * .35), Math.ceil(size * 1.05), Math.max(2, Math.ceil(size * .25)));
    ctx.globalAlpha = 1;
  }
  function drawRiverDetails(o, colors) {
    ctx.save();
    riverPath(o); ctx.clip();
    const seed = sceneryNoise(o.x + 41, o.y + 71), stoneCount = o.w * o.h < 50000 ? 2 : 3;
    for (let i = 0; i < stoneCount; i++) {
      const point = riverPointAt(o, .18 + i * .27 + sceneryNoise(o.x + i * 31, o.y + i * 47) * .12);
      const offset = (sceneryNoise(o.y + i * 37, o.x + i * 53) - .5) * point.r * .8;
      drawRiverStone(point.x - Math.sin(point.angle) * offset, point.y + Math.cos(point.angle) * offset, 4 + Math.floor(sceneryNoise(o.x + i * 11, o.y + 9) * 3), colors);
    }
    const fishCount = o.h < 80 ? 1 : 2;
    for (let i = 0; i < fishCount; i++) {
      const phase = (run.totalTime * (.035 + i * .012) + seed + i * .43) % 1, point = riverPointAt(o, phase);
      ctx.save(); ctx.translate(point.x, point.y); ctx.rotate(point.angle); drawRiverFish(0, 0, 3 + i, 1, colors.fish); ctx.restore();
    }
    ctx.restore();
  }
  function drawWater(o) {
    const colors = SCENERY_COLORS[run.biome.id], image = artImage(`map-${run.biome.id}-water`), points = riverPoints(o);
    ctx.save();
    const maxRadius = Math.max(...points.map(point => point.r));
    drawRiverStroke(o, colors.bank, maxRadius * 2 + 18);
    drawRiverStroke(o, colors.shore, maxRadius * 2 + 8);
    drawRiverStroke(o, colors.water, maxRadius * 2);
    ctx.save(); riverPath(o); ctx.clip();
    ctx.fillStyle = colors.water; ctx.fillRect(o.x, o.y, o.w, o.h);
    if (image) {
      for (let x = o.x; x < o.x + o.w; x += 64) {
        for (let y = o.y; y < o.y + o.h; y += 64) ctx.drawImage(image, x, y, 64, 64);
      }
    }
    drawRiverDetails(o, colors);
    ctx.globalAlpha = .28; ctx.fillStyle = '#1c414b';
    for (let i = 0; i < 7; i++) {
      const point = riverPointAt(o, (run.totalTime * (run.biome.id === 'frost' ? .025 : .06) + i * .14) % 1);
      ctx.save(); ctx.translate(point.x, point.y); ctx.rotate(point.angle);
      ctx.beginPath(); ctx.moveTo(-18, -point.r * .25); ctx.quadraticCurveTo(0, -point.r * .42, 18, -point.r * .2); ctx.strokeStyle = colors.shore; ctx.lineWidth = 2; ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
    ctx.restore();
  }
  function drawScenery(o) {
    const tree = o.kind === 'tree', top = o.y - (tree ? 80 : 64);
    const image = artImage(`map-${run.biome.id}-${o.kind}`), colors = SCENERY_COLORS[run.biome.id];
    ctx.save();
    const p = run.player;
    const actorBehind = (a, radius) => a && a.y + radius * .8 < o.y && a.y + radius > top && Math.abs(a.x - o.x) < 48;
    if (actorBehind(p, 22) || run.enemies.some(e => actorBehind(e, e.r))) ctx.globalAlpha = .42;
    if (image) ctx.drawImage(image, o.x - 32, top, 64, tree ? 96 : 80);
    else {
      ctx.fillStyle = '#20362b55'; ctx.fillRect(o.x - 24, o.y - 4, 48, 16);
      ctx.fillStyle = colors.bank; ctx.fillRect(o.x - 7, o.y - 20, 14, 24);
      ctx.fillStyle = tree ? colors.grass : colors.shade;
      ctx.fillRect(o.x - 24, top + 16, 48, tree ? 52 : 40);
      ctx.fillStyle = colors.light; ctx.fillRect(o.x - 16, top + 8, 26, 24);
    }
    ctx.restore();
  }
  function drawEliteTelegraph(e) {
    const def = ENEMIES[e.id];
    if (!def.windup || e.windup <= 0) return;
    const progress = 1 - e.windup / def.windup;
    ctx.save(); ctx.translate(e.x, e.y);
    ctx.fillStyle = def.color; ctx.strokeStyle = def.color;
    ctx.lineWidth = 3;
    if (e.id === 'satyr') {
      ctx.rotate(Math.atan2(e.chargeY, e.chargeX));
      ctx.globalAlpha = .16; ctx.fillRect(0, -14, 600, 28);
      ctx.globalAlpha = .9; ctx.setLineDash([10, 8]);
      ctx.strokeStyle = '#302832'; ctx.lineWidth = 6; ctx.strokeRect(0, -14, 600, 28);
      ctx.strokeStyle = def.color; ctx.lineWidth = 3; ctx.strokeRect(0, -14, 600, 28);
      ctx.setLineDash([]); ctx.fillRect(0, -2, 600 * progress, 4);
    } else {
      const radius = def.area || 58;
      ctx.globalAlpha = .12 + progress * .12;
      ctx.beginPath(); ctx.arc(0, 0, radius, 0, TAU); ctx.fill();
      ctx.globalAlpha = .95;
      ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.arc(0, 0, radius, 0, TAU);
      ctx.strokeStyle = '#302832'; ctx.lineWidth = 6; ctx.stroke();
      ctx.strokeStyle = def.color; ctx.lineWidth = 3; ctx.stroke();
      ctx.setLineDash([]); ctx.beginPath(); ctx.arc(0, 0, radius * progress, 0, TAU); ctx.stroke();
    }
    ctx.restore();
  }
  function drawTerrainIndicators(cam) {
    // Health bars, telegraphs and move/aim markers stay readable above foreground canopies.
    for (const e of run.enemies) {
      if (!visible(e, cam, e.r + 36)) continue;
      if (e.id === 'elite' && e.windup > 0) {
        ctx.strokeStyle = '#ffc47c'; ctx.lineWidth = 3; ctx.globalAlpha = .95;
        if (selectedSkin === 'pixel') { ctx.fillStyle = '#ffc47c'; drawPixelArc(e.x, e.y, e.r + 7 + (1 - e.windup / .4) * 7, 0, TAU); }
        else { ctx.beginPath(); ctx.arc(e.x, e.y, e.r + 7 + (1 - e.windup / .4) * 7, 0, TAU); ctx.stroke(); }
      }
      if (e.id === 'boss' && e.windup > 0) {
        const telegraphColor = e.variant === 'roshan' ? '#f5b65f' : '#f7a6cf';
        const telegraphTime = e.variant === 'roshan' ? (e.enraged ? .55 : .72) : .55;
        ctx.strokeStyle = telegraphColor; ctx.lineWidth = e.variant === 'roshan' ? 5 : 4; ctx.globalAlpha = .95;
        if (selectedSkin === 'pixel') { ctx.fillStyle = telegraphColor; drawPixelArc(e.x, e.y, e.r + 9 + (1 - e.windup / telegraphTime) * 15, 0, TAU, e.variant === 'roshan' ? 8 : 6); }
        else { ctx.beginPath(); ctx.arc(e.x, e.y, e.r + 9 + (1 - e.windup / telegraphTime) * 15, 0, TAU); ctx.stroke(); }
      }
      if (e.hp < e.maxHp || e.id === 'boss' || isElite(e)) {
        const width = e.r * 2.2;
        ctx.fillStyle = '#07131be0'; ctx.fillRect(e.x - width / 2, e.y - e.r - 12, width, 5);
        ctx.fillStyle = e.id === 'boss' ? (e.variant === 'roshan' ? '#f5b65f' : '#f3a5c9') : '#ffd07c'; ctx.fillRect(e.x - width / 2, e.y - e.r - 12, width * Math.max(0, e.hp / e.maxHp), 5);
      }
    }
    if (run.aimTarget) {
      ctx.strokeStyle = '#ffe69c'; ctx.globalAlpha = Math.min(1, run.aimTarget.life); ctx.lineWidth = 2;
      if (selectedSkin === 'pixel') { ctx.fillStyle = '#ffe69c'; drawPixelArc(run.aimTarget.x, run.aimTarget.y, 17, 0, TAU); }
      else { ctx.beginPath(); ctx.arc(run.aimTarget.x, run.aimTarget.y, 17, 0, TAU); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(run.aimTarget.x - 24, run.aimTarget.y); ctx.lineTo(run.aimTarget.x - 11, run.aimTarget.y); ctx.moveTo(run.aimTarget.x + 11, run.aimTarget.y); ctx.lineTo(run.aimTarget.x + 24, run.aimTarget.y); ctx.stroke();
    }
    if (moveTarget) {
      ctx.strokeStyle = '#91f5cf'; ctx.lineWidth = 2; ctx.globalAlpha = .95;
      if (selectedSkin === 'pixel') { ctx.fillStyle = '#91f5cf'; drawPixelArc(moveTarget.x, moveTarget.y, 13, 0, TAU); ctx.fillRect(moveTarget.x - 2, moveTarget.y - 2, 4, 4); }
      else { ctx.beginPath(); ctx.arc(moveTarget.x, moveTarget.y, 13, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(moveTarget.x, moveTarget.y, 3, 0, TAU); ctx.stroke(); }
    }
    ctx.globalAlpha = 1;
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
    const def = enemyDef(e), visualId = e.variant === 'roshan' ? 'roshan' : e.id;
    ctx.save(); ctx.translate(selectedSkin === 'pixel' ? Math.round(e.x) : e.x, selectedSkin === 'pixel' ? Math.round(e.y) : e.y);
    ctx.fillStyle = '#0007';
    if (selectedSkin === 'pixel') ctx.fillRect(-e.r, e.r * .58, e.r * 2, e.r * .5);
    else { ctx.beginPath(); ctx.ellipse(2, e.r * .75, e.r * .95, e.r * .48, 0, 0, TAU); ctx.fill(); }
    if (run.totalTime < (e.cycloneUntil || 0)) {
      ctx.strokeStyle = '#c6f3ed'; ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.ellipse(0, 6 - i * 10, e.r + 8 - i * 3, 5, 0, 0, TAU); ctx.stroke();
      }
      ctx.translate(0, motionPreference.matches ? -8 : -12 + Math.sin(run.totalTime * 12) * 3);
    }
    if (e.id === 'elite' && e.windup > 0) {
      ctx.strokeStyle = '#ffc47c'; ctx.lineWidth = 3;
      if (selectedSkin === 'pixel') { ctx.fillStyle = '#ffc47c'; drawPixelArc(0, 0, e.r + 7 + (1 - e.windup / .4) * 7, 0, TAU); }
      else { ctx.beginPath(); ctx.arc(0, 0, e.r + 7 + (1 - e.windup / .4) * 7, 0, TAU); ctx.stroke(); }
    }
    if (e.id === 'boss' && e.windup > 0) {
      const telegraphColor = e.variant === 'roshan' ? '#f5b65f' : '#f7a6cf';
      const telegraphTime = e.variant === 'roshan' ? (e.enraged ? .55 : .72) : .55;
      ctx.strokeStyle = telegraphColor; ctx.lineWidth = e.variant === 'roshan' ? 5 : 4;
      if (selectedSkin === 'pixel') { ctx.fillStyle = telegraphColor; drawPixelArc(0, 0, e.r + 9 + (1 - e.windup / telegraphTime) * 15, 0, TAU, e.variant === 'roshan' ? 8 : 6); }
      else { ctx.beginPath(); ctx.arc(0, 0, e.r + 9 + (1 - e.windup / telegraphTime) * 15, 0, TAU); ctx.stroke(); }
    }
    ctx.rotate(((e.id === 'elite' || e.id === 'charger') && (e.windup > 0 || e.charging > 0)) || (def.windup && (e.windup > 0 || e.attackPose > 0))
      ? Math.atan2(e.chargeY, e.chargeX)
      : Math.atan2(run.player.y - e.y, run.player.x - e.x));
    if (e.id === 'crawler' && selectedSkin !== 'pixel') ctx.translate(0, Math.sin(e.animTime * 22) * .7);
    if (e.id === 'elite' && e.windup > 0) ctx.scale(.9, 1.08);
    if (e.id === 'elite' && e.charging > 0) ctx.scale(1.12, .9);
    if (e.enrage > 0 || e.enraged) {
      ctx.strokeStyle = def.color; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, e.r + 5, 0, TAU); ctx.stroke();
    }
    if (e.id === 'boss') {
      const windupTime = e.variant === 'roshan' ? (e.enraged ? .55 : .72) : .55;
      const pulse = e.attackPose > 0 ? 1.12 : e.windup > 0 ? 1 + (1 - e.windup / windupTime) * .09 : 1 + Math.sin(run.totalTime * 4) * .025;
      ctx.scale(pulse, pulse);
    }
    const pose = e.windup > 0 && ENEMY_POSES[visualId].includes('windup') ? `${visualId}-windup`
      : e.charging > 0 && (e.id === 'charger' || e.id === 'elite') ? `${e.id}-charge`
      : e.attackPose > 0 && ENEMY_POSES[visualId].includes('attack') ? `${visualId}-attack`
      : e.moving && Math.floor(e.animTime * 6) % 2 && ENEMY_POSES[visualId].includes('step') ? `${visualId}-step` : visualId;
    const image = artImage(pose) || artImage(visualId);
    if (image?.complete && image.naturalWidth) {
      const size = selectedSkin === 'pixel' ? Math.max(32, Math.round(e.r * 2.4 / 4) * 4) : e.r * 2.4;
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
    if (run.totalTime < (e.orchidUntil || 0)) {
      ctx.fillStyle = '#e4a6ed'; ctx.strokeStyle = '#38203e'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(e.x, e.y - e.r - 25); ctx.lineTo(e.x + 5, e.y - e.r - 19);
      ctx.lineTo(e.x, e.y - e.r - 13); ctx.lineTo(e.x - 5, e.y - e.r - 19); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    if (e.hp < e.maxHp || e.id === 'boss' || isElite(e)) {
      const width = e.r * 2.2;
      ctx.fillStyle = '#07131be0'; ctx.fillRect(e.x - width / 2, e.y - e.r - 12, width, 5);
      ctx.fillStyle = e.id === 'boss' ? (e.variant === 'roshan' ? '#f5b65f' : '#f3a5c9') : '#ffd07c'; ctx.fillRect(e.x - width / 2, e.y - e.r - 12, width * Math.max(0, e.hp / e.maxHp), 5);
    }
  }

  function drawKaelOrbs(front, mirror) {
    const time = motionPreference.matches ? 0 : run.totalTime;
    const colors = ['#72dcff', '#bb8aff', '#ffad50'];
    ctx.save();
    // Keep the orbit continuous when the body turns, and freeze it with game time.
    ctx.scale(mirror, 1);
    for (let i = 0; i < 3; i++) {
      const angle = time * 1.45 + i * TAU / 3 - Math.PI / 2;
      const depth = Math.sin(angle);
      if ((depth >= 0) !== front) continue;
      const x = Math.cos(angle) * 20, y = -64 + depth * 5;
      const r = 3.5 + depth * .35;
      ctx.globalAlpha = .16; ctx.fillStyle = colors[i];
      ctx.beginPath(); ctx.arc(x, y, r * 1.9, 0, TAU); ctx.fill();
      ctx.globalAlpha = 1; ctx.strokeStyle = '#362945'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff5de';
      ctx.beginPath(); ctx.arc(x - r * .3, y - r * .32, r * .38, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#fff8e8'; ctx.lineWidth = .75;
      ctx.beginPath();
      if (i === 0) {
        ctx.moveTo(x - 2, y); ctx.lineTo(x + 2, y);
        ctx.moveTo(x, y - 2); ctx.lineTo(x, y + 2);
      } else if (i === 1) {
        ctx.moveTo(x + 1, y - 2); ctx.lineTo(x - 1, y); ctx.lineTo(x + 1, y); ctx.lineTo(x - 1, y + 2);
      } else {
        ctx.moveTo(x, y - 2); ctx.quadraticCurveTo(x + 3, y + 2, x, y + 2); ctx.quadraticCurveTo(x - 2, y + 1, x, y - 2);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
  function drawLunaGlaive(size, rotation = 0) {
    const image = artImage('luna-glaive');
    ctx.save(); ctx.rotate(rotation); ctx.imageSmoothingEnabled = true;
    if (image) ctx.drawImage(image, -size / 2, -size / 2, size, size);
    else {
      // Match the held SVG silhouette while the weapon image is unavailable.
      ctx.scale(size / 96, size / 96);
      ctx.fillStyle = '#c5dfff'; ctx.strokeStyle = '#253560'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
      for (let i = 0; i < 3; i++) { ctx.fill(LUNA_GLAIVE_BLADE); ctx.stroke(LUNA_GLAIVE_BLADE); ctx.rotate(TAU / 3); }
      ctx.fillStyle = '#35487f'; ctx.strokeStyle = '#e5f5ff'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#c6a36d'; ctx.fillRect(-7, -2, 14, 5);
    }
    ctx.restore();
  }
  function drawPlayer() {
    const p = run.player, s = run.skills, id = run.character.id;
    const demon = id === 'tb' && s.tb.time > 0, artId = demon ? 'tb-demon' : id;
    ctx.save(); ctx.translate(p.x, p.y);
    ctx.fillStyle = '#0007'; ctx.beginPath(); ctx.ellipse(0, 14, id === 'luna' ? 30 : 19, 7, 0, 0, TAU); ctx.fill();
    if (s.weaponSystem?.shieldReady && s.weaponSystem.shieldTier) {
      ctx.save(); ctx.strokeStyle = '#3e3825'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.ellipse(0, -28, id === 'luna' || demon ? 43 : 31, demon ? 66 : 49, 0, 0, TAU); ctx.stroke();
      ctx.strokeStyle = '#fff0b3'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    }
    if (p.invuln > 0 && Math.floor(run.totalTime * 18) % 2 === 0) ctx.globalAlpha = .6;
    const direction = p.dashTime > 0 ? Math.atan2(p.dashY, p.dashX)
      : id === 'bulwark' ? p.facing : p.attackPose > 0 || s.jump ? p.attackFacing : p.facing;
    const moving = run.movedThisFrame;
    if (moving || p.attackPose > 0 || p.dashTime > 0 || s.jump) {
      p.visualSide = Math.abs(Math.cos(direction)) >= .55;
      p.visualMirror = Math.cos(direction) < 0 ? -1 : 1;
    }
    let mirror = p.visualMirror;
    const pose = p.dashTime > 0 ? 'dash' : p.skillPose > 0 || s.jump || s.spin || s.requiem?.delay > 0 || s.thunder || s.eclipse ? 'skill'
      : p.attackPose > 0 ? 'attack' : moving ? 'walk' : 'idle';
    const walkFrame = moving
      ? `walk-${Math.floor(p.animTime * (s.rageTime > 0 ? 11 : 8)) % 2 ? 'b' : 'a'}`
      : null;
    let frame;
    if (pose === 'walk') {
      frame = walkFrame;
    } else if (pose === 'attack') {
      // Pose stages and the contact event share the same attack-speed scale.
      const clock = p.attackClock * .42 / (p.attackDuration || .42);
      frame = clock < .13 ? 'attack-windup' : clock < .27 ? 'attack' : 'attack-release';
    } else {
      frame = pose === 'idle' ? (Math.floor(run.totalTime * 2.5) % 2 ? 'idle-alt' : 'idle-a') : pose;
    }
    const image = (p.visualSide && artImage(`${artId}-side-${frame}`)) || artImage(`${artId}-${frame}`) || artImage(`${artId}-idle-a`) || artImage(id);
    const footImage = moving && (p.attackPose > 0 || (id === 'luna' && pose === 'skill')) && !p.dashTime && walkFrame
      ? ((p.visualSide && artImage(`${artId}-side-${walkFrame}`)) || artImage(`${artId}-${walkFrame}`))
      : null;
    const walkPhase = p.animTime * 13;
    const stride = moving ? Math.sin(walkPhase) : 0;
    const attackProgress = p.attackPose > 0 ? clamp(p.attackClock / (p.attackDuration || .42), 0, 1) : 0;
    const attackSnap = Math.sin(clamp(attackProgress, 0, 1) * Math.PI);
    let scaleX = 1, scaleY = 1;
    let lift = moving ? Math.abs(stride) * (id === 'luna' ? 3 : 5) : 0;
    let lean = moving ? stride * (id === 'luna' ? .025 : .075) : 0;
    if (pose === 'idle') {
      // The two idle drawings provide silhouette variation; this breathing
      // motion keeps the character alive between attacks without SVG SMIL.
      const breathe = Math.sin(run.totalTime * 2.2);
      scaleY *= 1 + breathe * .018;
      lift += breathe * 1.15;
      lean += breathe * .012;
    }
    if (s.jump) {
      const progress = 1 - s.jump.time / s.jump.maxTime;
      lift = Math.sin(progress * Math.PI) * 34;
      scaleY = 1.04;
      lean += Math.sin(progress * Math.PI) * .08;
    } else if (p.landTime > 0) {
      scaleY = .86; scaleX = 1.08;
    } else if (p.attackPose > 0) {
      scaleX = 1.025 + attackSnap * .045;
      scaleY = 1 + attackSnap * .025;
      lift += attackSnap * 4;
      // The selected front or side frame carries the arm and weapon motion.
      lean += attackSnap * (id === 'jugg' ? .04 : id === 'scavenger' ? .028 : .012);
    }
    if (s.spin) { const turn = (3 - s.spin.time) * 18; scaleX = .76 + .24 * Math.abs(Math.cos(turn)); mirror = Math.cos(turn) < 0 ? -1 : 1; }
    if (s.rageTime > 0) { scaleX *= 1.04; scaleY *= 1.025; }
    if (s.requiem?.delay > 0 || s.thunder) { scaleX *= 1.04; lift += 3; }
    ctx.translate(0, -lift); ctx.rotate(lean); ctx.scale(mirror * scaleX, scaleY);
    const evolutionLevels = { battlefury: equippedUpgradeLevel('battlefury'), dagon: equippedUpgradeLevel('dagon'), manta: equippedUpgradeLevel('manta') };
    const evolutionView = { time: run.totalTime, attack: attackSnap, pixel: selectedSkin === 'pixel', reducedMotion: motionPreference.matches };
    drawEvolutionEquipment(ctx, evolutionLevels, evolutionView);
    if (id === 'kael') drawKaelOrbs(false, mirror);
    if (image) {
      const visibleHeight = id === 'tb' ? (demon ? 126 : 98) : id === 'luna' ? 100 : id === 'scavenger' ? 94 : id === 'rover' ? 82 : id === 'sf' ? 90 : 86;
      const height = visibleHeight;
      const width = height * image.naturalWidth / image.naturalHeight;
      const bottom = id === 'tb' ? 16 + height * 30 / 384 : 16;
      const footTop = bottom - height + height * (id === 'luna' ? .70 : .66);
      ctx.imageSmoothingEnabled = true;
      if (id === 'tb') {
        for (let i = 0; i < s.tb.images.length; i++) {
          ctx.save(); ctx.globalAlpha *= .46 * Math.min(1, s.tb.images[i].time / .3);
          ctx.translate((i ? 1 : -1) * (demon ? 54 : 40), 8); ctx.scale(.82, .82);
          ctx.drawImage(image, -width / 2, bottom - height, width, height); ctx.restore();
        }
      }
      if (p.dashTime > 0) {
        ctx.save(); ctx.globalAlpha *= .26;
        ctx.translate(-p.dashX * mirror * 19, -p.dashY * 19);
        ctx.drawImage(image, -width / 2, bottom - height, width, height);
        ctx.restore();
      }
      if ((id === 'luna' || id === 'tb') && footImage && footImage !== image) {
        ctx.save(); ctx.beginPath();
        ctx.rect(-width / 2 - 2, bottom - height - 2, width + 4, footTop - bottom + height + 2);
        ctx.clip(); ctx.drawImage(image, -width / 2, bottom - height, width, height); ctx.restore();
      } else ctx.drawImage(image, -width / 2, bottom - height, width, height);
      if (footImage && footImage !== image) {
        // Automatic attacks can occupy most of a fast walk cycle. Keep the
        // attack pose for the upper body, while the lower crop follows the
        // same alternating walk frames used during non-attacking movement.
        const footWidth = height * footImage.naturalWidth / footImage.naturalHeight;
        ctx.save();
        ctx.beginPath();
        ctx.rect(-Math.max(width, footWidth) / 2 - 2, footTop, Math.max(width, footWidth) + 4, height * .36 + 2);
        ctx.clip();
        ctx.drawImage(footImage, -footWidth / 2, bottom - height, footWidth, height);
        ctx.restore();
      }
    } else if (id === 'tb') {
      ctx.fillStyle = demon ? '#273329' : '#7b65a0'; ctx.strokeStyle = '#b1eb85'; ctx.lineWidth = 3;
      if (demon) {
        for (const side of [-1, 1]) { ctx.beginPath(); ctx.moveTo(side * 10, -45); ctx.lineTo(side * 55, -71); ctx.lineTo(side * 46, -9); ctx.lineTo(side * 20, -29); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      }
      ctx.fillRect(-13, -42, 26, 42); ctx.fillRect(-13, 0, 9, 15); ctx.fillRect(4, 0, 9, 15);
      ctx.beginPath(); ctx.arc(0, -51, 10, 0, TAU); ctx.fill();
      ctx.fillStyle = '#18211f'; ctx.fillRect(-11, -55, 22, 6);
      for (const side of [-1, 1]) { ctx.beginPath(); ctx.moveTo(side * 7, -57); ctx.lineTo(side * 17, -75); ctx.lineTo(side * 20, -53); ctx.stroke(); }
      if (!demon) for (const side of [-1, 1]) { ctx.beginPath(); ctx.arc(side * 23, -13, 18, -.9, 1.9); ctx.stroke(); }
    } else if (id === 'luna') {
      ctx.fillStyle = '#111a2c'; ctx.beginPath(); ctx.ellipse(-3, -3, 28, 12, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(27, -10, 12, 10, -.12, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#111a2c'; ctx.lineWidth = 6;
      for (const x of [-23, -12, 14, 24]) { ctx.beginPath(); ctx.moveTo(x, 3); ctx.lineTo(x + 3, 15); ctx.stroke(); }
      ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-28, -5); ctx.quadraticCurveTo(-49, -25, -43, 0); ctx.stroke();
      ctx.fillStyle = '#b9d8ff'; ctx.beginPath(); ctx.arc(32, -12, 2, 0, TAU); ctx.fill();
      ctx.fillStyle = '#394a86'; ctx.beginPath(); ctx.moveTo(-12, -12); ctx.lineTo(-9, -38); ctx.lineTo(9, -38); ctx.lineTo(12, -12); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#c998c1'; ctx.beginPath(); ctx.arc(0, -47, 8, 0, TAU); ctx.fill();
      ctx.fillStyle = '#b8c7ee'; ctx.beginPath(); ctx.arc(0, -50, 9, Math.PI, TAU); ctx.fill();
      ctx.strokeStyle = '#394a86'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(8, -34); ctx.lineTo(23, -37); ctx.stroke();
      ctx.save(); ctx.translate(25, -39); drawLunaGlaive(24, -.3); ctx.restore();
      ctx.fillStyle = '#c998c1'; ctx.beginPath(); ctx.arc(25, -39, 2.5, 0, TAU); ctx.fill();
    } else if (id === 'kael') {
      ctx.fillStyle = '#9f273f'; ctx.strokeStyle = '#edc675'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-17, 13); ctx.lineTo(-15, -36); ctx.lineTo(-9, -29); ctx.lineTo(9, -29); ctx.lineTo(15, -36); ctx.lineTo(17, 13); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#eecb77'; ctx.fillRect(-11, -48, 22, 32);
      ctx.fillStyle = '#f2d7bb'; ctx.beginPath(); ctx.moveTo(-8, -37); ctx.lineTo(-19, -44); ctx.lineTo(-10, -30); ctx.lineTo(10, -30); ctx.lineTo(19, -44); ctx.lineTo(8, -37); ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, -36, 8, 11, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#d8a748'; ctx.beginPath(); ctx.arc(0, -43, 11, Math.PI, TAU); ctx.fill();
    }
    drawEvolutionEquipment(ctx, evolutionLevels, { ...evolutionView, front: true });
    if (id === 'kael') drawKaelOrbs(true, mirror);
    ctx.restore();
    if (run.aimTarget) { ctx.strokeStyle = '#ffe69c'; ctx.lineWidth = 2; ctx.globalAlpha = run.aimTarget.life; ctx.beginPath(); ctx.arc(run.aimTarget.x, run.aimTarget.y, 17, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1; }
    if (moveTarget) { ctx.strokeStyle = '#91f5cf'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(moveTarget.x, moveTarget.y, 13, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(moveTarget.x, moveTarget.y, 3, 0, TAU); ctx.stroke(); }
  }
  function drawProjectiles(cam) {
    for (const b of run.bullets) {
      if (!visible(b, cam, b.kaelSpell === 'tornado' ? 170 : 100)) continue;
      if (b.kaelSpell === 'tornado' && windRenderer) {
        const age = run.totalTime - b.startedAt;
        // The foot follows the projectile; the upright funnel uses the paused game clock.
        windRenderer.draw(ctx, { x: b.x, y: b.y, time: motionPreference.matches ? 1.4 : age,
          scale: .56, opacity: Math.min(1, age / .06, b.life / .1), detail: motionPreference.matches ? 0 : .6 });
        drawHeroGrowthKaelBody(ctx, 'tornado', { ...b, age }, { level: run.level, pixel: selectedSkin === 'pixel', reducedMotion: motionPreference.matches });
        continue;
      }
      if (b.kaelSpell === 'tornado') {
        const angle = Math.atan2(b.vy, b.vx), opacity = Math.min(1, (run.totalTime - b.startedAt) / .06, b.life / .1);
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(angle); ctx.globalAlpha = opacity;
        ctx.strokeStyle = '#d8c7ff'; ctx.lineWidth = 4;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath(); ctx.ellipse(-10 + i * 8, 0, 10 + i * 3, 16 + i * 4, 0, 0, TAU); ctx.stroke();
        }
        ctx.restore();
        drawHeroGrowthKaelBody(ctx, 'tornado', { ...b, age: run.totalTime - b.startedAt }, { level: run.level, pixel: selectedSkin === 'pixel', reducedMotion: motionPreference.matches });
        continue;
      }
      const angle = Math.atan2(b.vy, b.vx);
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(angle);
      if (b.illusion && !b.tbImage) {
        drawMirrorStrike(ctx, b.evolutionLevel || 1, { pixel: selectedSkin === 'pixel', reducedMotion: motionPreference.matches, time: run.totalTime });
      } else if (b.hero === 'tb') {
        if (b.tbImage) { ctx.globalAlpha = .66; ctx.translate(0, b.imageSide * 7); }
        ctx.fillStyle = '#18352a'; ctx.strokeStyle = '#b2f585'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(11, 0); ctx.quadraticCurveTo(-2, -10, -28, -3); ctx.lineTo(-16, 1); ctx.lineTo(-30, 6); ctx.quadraticCurveTo(-2, 10, 11, 0); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ecffd1'; ctx.beginPath(); ctx.ellipse(3, 0, 6, 3, 0, 0, TAU); ctx.fill();
      } else if (b.hero === 'sf') {
        ctx.fillStyle = '#6c1929'; ctx.beginPath(); ctx.ellipse(-5, 0, 11, 5, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = '#bd423d'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-24, -2); ctx.quadraticCurveTo(-10, 5, 3, 0); ctx.stroke();
        ctx.fillStyle = '#f98162'; ctx.beginPath(); ctx.arc(1, 0, 4, 0, TAU); ctx.fill();
        ctx.fillStyle = '#ffe0a0'; ctx.beginPath(); ctx.arc(2, -1, 1.5, 0, TAU); ctx.fill();
      } else if (b.hero === 'conductor') {
        ctx.strokeStyle = '#4eaddc'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-22, -3); ctx.lineTo(-13, 3); ctx.lineTo(-7, -3); ctx.lineTo(0, 0); ctx.stroke();
        ctx.strokeStyle = '#eaffff'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#74d9ff'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, TAU); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(1, -1, 3, 0, TAU); ctx.fill();
      } else if (b.hero === 'kael') {
        ctx.strokeStyle = b.kaelSpell === 'tornado' ? '#d8c7ff' : '#c99aff'; ctx.lineWidth = b.skill ? 5 : 3;
        ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(2, 0); ctx.stroke();
        ctx.fillStyle = b.kaelSpell === 'tornado' ? '#e5dcff' : '#fff0b4'; ctx.beginPath(); ctx.arc(4, 0, b.skill ? 7 : 5, 0, TAU); ctx.fill();
      } else if (b.hero === 'luna') {
        ctx.strokeStyle = b.lunaChain ? '#b9d9ff' : '#718eb7'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-21, 0); ctx.lineTo(-9, 0); ctx.stroke();
        // Keep one spin phase through direction changes and freeze with combat time.
        ctx.rotate(-angle); drawLunaGlaive(26, motionPreference.matches ? 0 : run.totalTime * 18);
      } else {
        ctx.strokeStyle = '#d79d55'; ctx.lineWidth = b.skill ? 4 : 3; ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-4, 0); ctx.stroke();
        ctx.fillStyle = '#fff0ba'; ctx.beginPath(); ctx.ellipse(1, 0, b.skill ? 8 : 6, b.skill ? 3.5 : 2.5, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#b56739'; ctx.fillRect(-7, -2.5, 4, 5);
      }
      drawHeroGrowthProjectile(ctx, b, { level: run.level, time: run.totalTime, pixel: selectedSkin === 'pixel', reducedMotion: motionPreference.matches });
      ctx.restore();
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

  function drawMeleeSwing(fx) {
    const progress = 1 - fx.life / fx.maxLife, direction = fx.direction || 1;
    const angle = fx.angle + direction * (-.65 + progress * 1.45);
    ctx.save(); ctx.translate(fx.x, fx.y); ctx.rotate(angle);
    if (fx.character === 'tb') {
      for (const side of [-1, 1]) {
        ctx.strokeStyle = '#203d32'; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(30, side * 19, 24, -.95, 1.45); ctx.stroke();
        ctx.strokeStyle = '#c9f0ae'; ctx.lineWidth = 4; ctx.stroke();
      }
    } else if (fx.character === 'bulwark') {
      ctx.fillStyle = '#6b4334'; ctx.beginPath(); ctx.moveTo(13, -10); ctx.lineTo(47, -14); ctx.lineTo(61, -4); ctx.lineTo(58, 13); ctx.lineTo(22, 12); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#e4aa66'; ctx.lineWidth = 4;
      for (const offset of [-10, 0, 10]) { ctx.beginPath(); ctx.moveTo(43, offset); ctx.lineTo(76 + (10 - Math.abs(offset)), offset * 1.7); ctx.stroke(); }
    } else if (fx.character === 'scavenger') {
      ctx.strokeStyle = '#624431'; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(76, 0); ctx.stroke();
      ctx.fillStyle = '#617b50'; ctx.beginPath(); ctx.moveTo(65, -17); ctx.lineTo(90, -15); ctx.lineTo(96, 0); ctx.lineTo(88, 17); ctx.lineTo(65, 13); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#bbdc7f'; ctx.fillRect(76, -10, 7, 20);
    } else if (fx.character === 'jugg') {
      // Juggernaut's basic attack is a long katana sweep rather than the
      // compact blade used by the other melee pilots.
      ctx.strokeStyle = '#713d35'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(37, 0); ctx.stroke();
      ctx.fillStyle = '#c95e4f'; ctx.fillRect(30, -13, 7, 26);
      ctx.fillStyle = '#eef0d6'; ctx.beginPath(); ctx.moveTo(38, -7); ctx.lineTo(126, -17); ctx.quadraticCurveTo(141, -7, 145, 2); ctx.quadraticCurveTo(117, 11, 38, 6); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#9aaeb1'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(43, -3); ctx.quadraticCurveTo(111, -11, 136, 1); ctx.stroke();
    } else {
      ctx.strokeStyle = '#604534'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(37, 0); ctx.stroke();
      ctx.fillStyle = '#d4a45b'; ctx.fillRect(31, -11, 6, 22);
      ctx.fillStyle = '#42565b'; ctx.beginPath(); ctx.moveTo(37, -6); ctx.lineTo(101, -10); ctx.quadraticCurveTo(118, -3, 121, 6); ctx.quadraticCurveTo(93, 11, 37, 5); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#f5f0d7'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(42, -4); ctx.quadraticCurveTo(96, -7, 116, 4); ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = fx.character === 'bulwark' ? '#e8b578' : fx.character === 'scavenger' ? '#baf182' : fx.character === 'jugg' ? '#fff0bb' : '#ffefc1'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(fx.x, fx.y, fx.r * .87, angle - direction * .55, angle, direction < 0); ctx.stroke();
  }
  function drawEquipmentUpgradeEffect(fx, progress) {
    const pixel = selectedSkin === 'pixel';
    const view = { pixel, reducedMotion: motionPreference.matches };
    if (fx.weapon === 'battlefury') { drawEvolutionCleave(ctx, fx, progress, view); return; }
    if (fx.weapon === 'dagon') { drawDagonFork(ctx, fx, progress, view); return; }
    ctx.save(); ctx.translate(fx.x, fx.y); ctx.lineCap = pixel ? 'butt' : 'round'; ctx.lineJoin = pixel ? 'miter' : 'round';
    const arc = (radius, from, to, color, width = 3) => {
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
      if (pixel) drawPixelArc(0, 0, radius, from, to, width);
      else { ctx.beginPath(); ctx.arc(0, 0, radius, from, to); ctx.stroke(); }
    };
    if (fx.weapon === 'bloodstone' || fx.weapon === 'heart') {
      const color = fx.weapon === 'heart' ? '#b9e78c' : '#e3a4c3';
      for (let i = 0; i < fx.level + 1; i++) {
        const x = (i - fx.level / 2) * 13, y = -12 - progress * 20;
        ctx.fillStyle = color; ctx.fillRect(x - 2, y - 7, 4, 14); ctx.fillRect(x - 7, y - 2, 14, 4);
      }
    } else if (fx.weapon === 'orchid') {
      for (let i = 0; i < 4 + fx.level; i++) {
        const angle = i * TAU / (4 + fx.level), r = fx.r * (1 - progress * .5);
        ctx.save(); ctx.rotate(angle); ctx.fillStyle = '#e6adf2';
        ctx.beginPath(); ctx.moveTo(3, 0); ctx.lineTo(r, -5); ctx.lineTo(r + 8, 0); ctx.lineTo(r, 5); ctx.closePath(); ctx.fill(); ctx.restore();
      }
    } else if (fx.weapon === 'bladeMail') {
      for (let i = 0; i < 3 + fx.level; i++) {
        const angle = i * TAU / (3 + fx.level), r = 8 + progress * fx.r;
        ctx.save(); ctx.rotate(angle); ctx.strokeStyle = '#e1d7bd'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(r - 6, -5); ctx.lineTo(r + 8, 0); ctx.lineTo(r - 6, 5); ctx.stroke(); ctx.restore();
      }
    } else if (fx.weapon === 'phaseBoots') {
      ctx.rotate(fx.angle); ctx.strokeStyle = '#e6ccff'; ctx.lineWidth = 3;
      for (let i = 0; i < fx.level + 1; i++) {
        const x = -i * 9 - progress * 10;
        ctx.beginPath(); ctx.moveTo(x - 8, -12); ctx.lineTo(x + 4, 0); ctx.lineTo(x - 8, 12); ctx.stroke();
      }
    } else if (fx.weapon === 'cyclone') {
      for (let i = 0; i < 3; i++) arc(fx.r * (1 - i * .18), progress * 3 + i, progress * 3 + i + 4.3, '#b9e5df', 2);
    } else if (fx.weapon === 'necronomicon') {
      ctx.scale(1, .45);
      for (let i = 0; i < fx.level; i++) arc(20 + i * 8 + progress * 10, 0, TAU, '#a4d9b8', 2);
    } else if (fx.weapon === 'mjollnir') {
      if (fx.level === 3) {
        for (const side of [-1, 0, 1]) {
          ctx.beginPath(); ctx.moveTo(side * 22 - 5, -64);
          ctx.lineTo(side * 15 + 8, -44); ctx.lineTo(side * 10 - 6, -26); ctx.lineTo(0, 0);
          ctx.strokeStyle = '#369dd9'; ctx.lineWidth = 5; ctx.stroke();
          ctx.strokeStyle = '#efffff'; ctx.lineWidth = 2; ctx.stroke();
        }
      }
      ctx.strokeStyle = '#b6f5ff'; ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const angle = fx.angle + i * TAU / 3, near = 5 + progress * 5, far = 13 + progress * 8;
        ctx.beginPath(); ctx.moveTo(Math.cos(angle) * near, Math.sin(angle) * near);
        ctx.lineTo(Math.cos(angle + .25) * (far - 3), Math.sin(angle + .25) * (far - 3));
        ctx.lineTo(Math.cos(angle) * far, Math.sin(angle) * far); ctx.stroke();
      }
    } else if (fx.weapon === 'buriza') {
      ctx.rotate(fx.angle + Math.PI / 4);
      const rays = fx.level === 3 ? 8 : 4, radius = fx.r * (.65 + progress * .35);
      ctx.strokeStyle = '#ffe7a3'; ctx.lineWidth = pixel ? 3 : 2.5;
      for (let i = 0; i < rays; i++) {
        const angle = i * TAU / rays;
        ctx.beginPath(); ctx.moveTo(Math.cos(angle) * 6, Math.sin(angle) * 6);
        ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius); ctx.stroke();
      }
      if (fx.level === 3) arc(7 + progress * 11, 0, TAU, '#ffc665', 2);
    } else if (fx.weapon === 'butterfly') {
      ctx.rotate(fx.angle - Math.PI / 2);
      for (const side of [-1, 1]) {
        ctx.save(); ctx.scale(side, 1);
        if (fx.level === 3) {
          ctx.beginPath(); ctx.moveTo(12, 0);
          if (pixel) { ctx.lineTo(24, -16); ctx.lineTo(36, -12); ctx.lineTo(32, 4); ctx.lineTo(28, 16); ctx.lineTo(16, 9); }
          else { ctx.bezierCurveTo(28, -28, 45, -14, 30, 3); ctx.bezierCurveTo(38, 19, 17, 23, 12, 0); }
          ctx.closePath(); ctx.fillStyle = '#62e9ba'; ctx.globalAlpha *= .24; ctx.fill(); ctx.globalAlpha /= .24;
          ctx.strokeStyle = '#a9f6ce'; ctx.lineWidth = 2; ctx.stroke();
        } else {
          ctx.strokeStyle = '#a5f1d4'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(13 + progress * 6, 9);
          if (pixel) { ctx.lineTo(23 + progress * 6, 0); ctx.lineTo(25 + progress * 6, -10); }
          else ctx.quadraticCurveTo(31 + progress * 6, 2, 25 + progress * 6, -10);
          ctx.stroke();
        }
        ctx.restore();
      }
    } else if (fx.weapon === 'radiance') {
      ctx.globalAlpha *= .65;
      for (let i = 0; i < (fx.level === 3 ? 6 : 3); i++) {
        const angle = fx.angle + i * TAU / (fx.level === 3 ? 6 : 3) + progress * .25;
        arc(fx.r, angle, angle + .45, '#ffe09b', 3);
        if (fx.level === 3) arc(fx.r - 9, angle + .1, angle + .4, '#ff9f50', 2);
        const radius = fx.r * (.72 + progress * .23), x = Math.cos(angle) * radius, y = Math.sin(angle) * radius;
        ctx.fillStyle = '#ffd783';
        if (pixel) ctx.fillRect(Math.round(x - 2), Math.round(y - progress * 7), 4, 4);
        else { ctx.beginPath(); ctx.ellipse(x, y - progress * 7, 2, 3, angle, 0, TAU); ctx.fill(); }
      }
    } else if (fx.weapon === 'desolator') {
      ctx.rotate(fx.angle);
      for (let i = 0; i < fx.level; i++) {
        const offset = (i - (fx.level - 1) / 2) * 9, length = fx.r * (.7 + progress * .15);
        ctx.beginPath(); ctx.moveTo(-length, offset - 4); ctx.lineTo(-length * .25, offset + 2);
        ctx.lineTo(length * .18, offset - 3); ctx.lineTo(length, offset + 4);
        ctx.strokeStyle = '#5a1830'; ctx.lineWidth = 5; ctx.stroke();
        ctx.strokeStyle = fx.level === 3 ? '#f09a96' : '#d7656a'; ctx.lineWidth = 2; ctx.stroke();
      }
    } else if (fx.weapon === 'skadi') {
      for (let layer = 0; layer < fx.level; layer++) {
        const radius = fx.r - layer * 5, turn = fx.angle + layer * .5 + progress * .2;
        for (let i = 0; i < 3; i++) arc(radius, turn + i * TAU / 3, turn + i * TAU / 3 + .65,
          layer % 2 ? '#d9f8ff' : '#76cfff', 2);
      }
    } else if (fx.weapon === 'manta') {
      ctx.rotate(fx.angle); ctx.strokeStyle = fx.level === 3 ? '#c3e8ff' : '#b7bfff'; ctx.lineWidth = 2;
      for (const side of [-1, 1]) {
        const y = side * (15 + progress * 9), x = 9 + progress * 10;
        ctx.beginPath(); ctx.moveTo(x + 11, y); ctx.lineTo(x - 5, y - 6); ctx.lineTo(x - 12, y); ctx.lineTo(x - 5, y + 6); ctx.closePath(); ctx.stroke();
        if (fx.level === 3) { ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.lineTo(x - 25, y + side * 3); ctx.stroke(); }
      }
    } else if (fx.weapon === 'aghanim') {
      ctx.scale(1, .45);
      const radius = 24 + progress * 14;
      arc(radius, 0, TAU, '#74ceff', 3);
      if (fx.level === 3) arc(radius * .7, 0, TAU, '#ccefff', 2);
      for (let i = 0; i < 6; i++) {
        const angle = fx.angle + i * TAU / 6;
        ctx.strokeStyle = '#ccefff'; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * (radius - 5), Math.sin(angle) * (radius - 5));
        ctx.lineTo(Math.cos(angle) * (radius + 4), Math.sin(angle) * (radius + 4)); ctx.stroke();
      }
      if (fx.level === 3) {
        ctx.fillStyle = '#effbff';
        for (let i = 0; i < 3; i++) {
          const angle = fx.angle + i * TAU / 3, x = Math.cos(angle) * radius * .7, y = Math.sin(angle) * radius * .7;
          if (pixel) ctx.fillRect(Math.round(x - 2), Math.round(y - 3), 4, 6);
          else { ctx.beginPath(); ctx.ellipse(x, y, 2, 4, 0, 0, TAU); ctx.fill(); }
        }
      }
    }
    ctx.restore();
  }
  function drawEffects(cam) {
    const aura = equipmentPassive('radiance');
    if (aura) {
      const p = run.player, phase = run.totalTime * 1.6;
      ctx.save(); ctx.globalAlpha = .18; ctx.strokeStyle = '#ffbd5e'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(p.x, p.y, aura.radius + Math.sin(phase) * 4, 0, TAU); ctx.stroke();
      ctx.globalAlpha = .36; ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) { const a = phase + i * TAU / 8; ctx.beginPath(); ctx.moveTo(p.x + Math.cos(a) * (aura.radius - 12), p.y + Math.sin(a) * (aura.radius - 12)); ctx.lineTo(p.x + Math.cos(a) * aura.radius, p.y + Math.sin(a) * aura.radius); ctx.stroke(); }
      ctx.restore();
    }
    let emphasized = 0;
    for (const fx of run.effects) {
      const inView = fx.kind === 'line' ? Math.max(fx.x1, fx.x2) >= cam.x && Math.min(fx.x1, fx.x2) <= cam.x + viewW && Math.max(fx.y1, fx.y2) >= cam.y && Math.min(fx.y1, fx.y2) <= cam.y + viewH : visible(fx, cam, (fx.r || 30) + 180);
      if (!inView) continue;
      const progress = 1 - fx.life / fx.maxLife;
      ctx.globalAlpha = clamp(fx.life / fx.maxLife, 0, 1); ctx.strokeStyle = fx.color; ctx.fillStyle = fx.color;
      const view = { hero: run.character.id, level: run.level, pixel: selectedSkin === 'pixel', reducedMotion: motionPreference.matches };
      if (emphasized < 24 && (fx.weapon || fx.build || ['quills', 'thunder', 'lunar-impact', 'muzzle', 'kael-emp-bolt', 'kael-emp-explosion'].includes(fx.kind))) {
        emphasized++;
        if (drawWeaponStrike(ctx, fx, progress, view) || drawBuildFeedback(ctx, fx, progress, view)
          || drawHeroGrowthEffect(ctx, fx, progress, view)) continue;
      }
      if (fx.kind === 'equipment-upgrade') drawEquipmentUpgradeEffect(fx, progress);
      else if (fx.kind === 'line') {
        const dx = fx.x2 - fx.x1, dy = fx.y2 - fx.y1, length = Math.hypot(dx, dy) || 1;
        for (const [color, width] of [[fx.color, fx.width || 4], ['#ffffff', 1.4]]) {
          ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(fx.x1, fx.y1);
          const segments = fx.upgradeLevel === 3 ? 12 : 8;
          for (let i = 1; i <= segments; i++) {
            const t = i / segments, bend = i === segments ? 0 : Math.sin(i * 2.7 + fx.x1) * (fx.upgradeLevel === 3 ? 10 : 7);
            let x = fx.x1 + dx * t - dy / length * bend, y = fx.y1 + dy * t + dx / length * bend;
            if (fx.upgradeLevel && selectedSkin === 'pixel' && i < segments) { x = Math.round(x / 2) * 2; y = Math.round(y / 2) * 2; }
            ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else if (fx.kind === 'thunder') {
        for (const [color, width] of [['#7ccaff', 7], ['#f4fcff', 2]]) {
          ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(fx.x - 9, fx.y - 190);
          ctx.lineTo(fx.x + 11, fx.y - 135); ctx.lineTo(fx.x - 15, fx.y - 98); ctx.lineTo(fx.x + 9, fx.y - 55); ctx.lineTo(fx.x, fx.y); ctx.stroke();
        }
        ctx.beginPath(); ctx.ellipse(fx.x, fx.y, fx.r * (1 + progress), fx.r * .55, 0, 0, TAU); ctx.stroke();
      } else if (fx.kind === 'kael-emp-bolt') {
        const dx = fx.x2 - fx.x1, dy = fx.y2 - fx.y1, length = Math.hypot(dx, dy) || 1;
        const end = clamp(progress / .72, 0, 1), segments = 8;
        ctx.save(); ctx.lineCap = 'round';
        for (const [color, width, alpha] of [['#60cfff', 8, .72], ['#f5ffff', 2.4, 1]]) {
          ctx.globalAlpha *= alpha; ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(fx.x1, fx.y1);
          const visibleSegments = Math.max(1, Math.ceil(segments * end));
          for (let i = 1; i <= visibleSegments; i++) {
            const t = i === visibleSegments ? end : i / segments;
            const bend = i === visibleSegments ? 0 : Math.sin(fx.seed + i * 4.7) * (width > 3 ? 9 : 5);
            ctx.lineTo(fx.x1 + dx * t - dy / length * bend, fx.y1 + dy * t + dx / length * bend);
          }
          ctx.stroke();
        }
        ctx.restore();
      } else if (fx.kind === 'kael-emp-explosion') {
        const start = fx.delay / fx.maxLife, blastProgress = clamp((progress - start) / (1 - start), 0, 1);
        if (progress >= start) {
          ctx.save(); ctx.globalAlpha *= 1 - blastProgress * .72;
          const radius = fx.r * (.28 + blastProgress * .72);
          ctx.fillStyle = '#e7fbff'; ctx.globalAlpha *= .16; ctx.beginPath(); ctx.arc(fx.x, fx.y, radius * .42, 0, TAU); ctx.fill();
          ctx.globalAlpha *= 5.2; ctx.strokeStyle = '#e7fbff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(fx.x, fx.y, radius, 0, TAU); ctx.stroke();
          ctx.strokeStyle = '#63cfff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(fx.x, fx.y, radius * .62, 0, TAU); ctx.stroke();
          for (let i = 0; i < 8; i++) {
            const angle = i * TAU / 8 + fx.seed * .03, inner = radius * .35, outer = radius * (1.05 + (i % 2) * .16);
            ctx.strokeStyle = i % 2 ? '#a4e8ff' : '#f5ffff'; ctx.lineWidth = i % 2 ? 2 : 3;
            ctx.beginPath(); ctx.moveTo(fx.x + Math.cos(angle) * inner, fx.y + Math.sin(angle) * inner);
            ctx.lineTo(fx.x + Math.cos(angle + .08) * outer, fx.y + Math.sin(angle + .08) * outer); ctx.stroke();
          }
          ctx.restore();
        }
      } else if (fx.kind === 'lunar-field') {
        ctx.globalAlpha *= .32; ctx.lineWidth = 3; ctx.setLineDash([12, 10]);
        ctx.beginPath(); ctx.arc(fx.x, fx.y, fx.r, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
      } else if (fx.kind === 'lunar-impact') {
        const radius = fx.r * (.45 + progress * .55);
        ctx.globalAlpha *= .85; ctx.lineWidth = 5; ctx.strokeStyle = '#f0e8ff';
        ctx.beginPath(); ctx.arc(fx.x, fx.y, radius, 0, TAU); ctx.stroke();
        ctx.globalAlpha *= .7; ctx.strokeStyle = '#a7c9ff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(fx.x, fx.y - 74); ctx.lineTo(fx.x, fx.y - 12); ctx.stroke();
        for (let i = 0; i < 6; i++) {
          const a = i * TAU / 6 + progress * 1.8, x = fx.x + Math.cos(a) * radius, y = fx.y + Math.sin(a) * radius;
          ctx.fillRect(x - 2, y - 2, 4, 4);
        }
      } else if (fx.kind === 'quills') {
        ctx.save(); ctx.translate(fx.x, fx.y);
        const reach = 24 + progress * (fx.r - 24);
        for (let i = 0; i < 16; i++) { ctx.save(); ctx.rotate(i * TAU / 16); ctx.strokeStyle = '#5c4934'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(reach - 27, 0); ctx.lineTo(reach, 0); ctx.stroke(); ctx.strokeStyle = '#ead6a7'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }
        ctx.restore();
      } else if (fx.kind === 'static') {
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) { const a = i * TAU / 6; ctx.beginPath(); ctx.moveTo(fx.x, fx.y); ctx.lineTo(fx.x + Math.cos(a + .2) * fx.r * .55, fx.y + Math.sin(a + .2) * fx.r * .55); ctx.lineTo(fx.x + Math.cos(a) * fx.r, fx.y + Math.sin(a) * fx.r); ctx.stroke(); }
      } else if (fx.kind === 'radiance') {
        ctx.lineWidth = 3; ctx.globalAlpha *= .7;
        ctx.beginPath(); ctx.arc(fx.x, fx.y, fx.r * (.72 + progress * .28), 0, TAU); ctx.stroke();
        for (let i = 0; i < 10; i++) { const a = i * TAU / 10 + progress * 2; const r = fx.r * (.35 + progress * .55); ctx.fillRect(fx.x + Math.cos(a) * r - 2, fx.y + Math.sin(a) * r - 2, 4, 4); }
      } else if (fx.kind === 'desolate') {
        ctx.lineWidth = 3; ctx.globalAlpha *= .9;
        ctx.beginPath(); ctx.arc(fx.x, fx.y, fx.r * (1 + progress * .2), 0, TAU); ctx.stroke();
        for (let i = 0; i < 4; i++) { const a = i * TAU / 4 + .35; ctx.beginPath(); ctx.moveTo(fx.x + Math.cos(a) * fx.r * .35, fx.y + Math.sin(a) * fx.r * .35); ctx.lineTo(fx.x + Math.cos(a + .22) * fx.r, fx.y + Math.sin(a + .22) * fx.r); ctx.stroke(); }
      } else if (fx.kind === 'frost') {
        ctx.lineWidth = 2; ctx.globalAlpha *= .9;
        ctx.beginPath(); ctx.arc(fx.x, fx.y, fx.r * (1 + progress * .15), 0, TAU); ctx.stroke();
        for (let i = 0; i < 6; i++) { const a = i * TAU / 6; const x = fx.x + Math.cos(a) * fx.r * .55, y = fx.y + Math.sin(a) * fx.r * .55; ctx.beginPath(); ctx.moveTo(x - 5, y); ctx.lineTo(x + 5, y); ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 5); ctx.stroke(); }
      } else if (fx.kind === 'manta') {
        ctx.globalAlpha *= .7; ctx.lineWidth = 3;
        for (const side of [-1, 1]) { ctx.beginPath(); ctx.ellipse(fx.x + side * 18, fx.y, fx.r * .45, fx.r * .8, side * .25, 0, TAU); ctx.stroke(); }
        ctx.fillStyle = '#f3efff'; ctx.fillRect(fx.x - 3, fx.y - 3 - progress * 18, 6, 6); ctx.fillRect(fx.x - 3, fx.y - 3 + progress * 18, 6, 6);
      } else if (fx.kind === 'muzzle' || fx.kind === 'soul-muzzle') {
        ctx.save(); ctx.translate(fx.x, fx.y); ctx.rotate(fx.angle);
        ctx.beginPath(); ctx.moveTo(16, -4); ctx.lineTo(22 + fx.r, 0); ctx.lineTo(18, 6); ctx.lineTo(24, 0); ctx.closePath(); ctx.fill(); ctx.restore();
      } else if (fx.kind === 'landing') {
        ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(fx.x, fx.y, fx.r * (.55 + progress * .45), fx.r * (.22 + progress * .14), 0, 0, TAU); ctx.stroke();
        ctx.save(); ctx.translate(fx.x, fx.y); ctx.rotate(fx.angle); ctx.strokeStyle = '#fff2d2'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-22, -40); ctx.lineTo(62, 35); ctx.stroke(); ctx.restore();
      } else if (fx.kind === 'melee-swing') drawMeleeSwing(fx);
      else if (fx.kind === 'text') { ctx.font = 'bold 18px system-ui'; ctx.textAlign = 'center'; ctx.fillText(fx.text, fx.x, fx.y - progress * 24); }
      else if (fx.kind === 'shards') {
        for (let i = 0; i < 4; i++) { const a = i * TAU / 4 + .4; ctx.fillRect(fx.x + Math.cos(a) * fx.r * progress - 3, fx.y + Math.sin(a) * fx.r * progress - 3, 6, 6); }
      } else if (fx.kind === 'arc') { ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(fx.x, fx.y, fx.r, fx.angle - fx.arc, fx.angle + fx.arc); ctx.stroke(); }
      else { ctx.lineWidth = fx.kind === 'thunder-mark' ? 2 : 3; const r = fx.kind === 'thunder-mark' ? fx.r : fx.r * (.65 + progress * .5); ctx.beginPath(); ctx.arc(fx.x, fx.y, r, 0, TAU); ctx.stroke(); }
    }
    ctx.globalAlpha = 1;
  }

  function drawKaelSpirit(spirit) {
    const fade = clamp(spirit.life / .35, 0, 1), bob = Math.sin(run.totalTime * 7 + spirit.side) * 1.5;
    const facing = Number.isFinite(spirit.facing) ? spirit.facing : 0;
    const attackFacing = Number.isFinite(spirit.attackAngle) ? spirit.attackAngle : facing;
    ctx.save(); ctx.translate(spirit.x, spirit.y + bob); ctx.rotate(facing); ctx.globalAlpha = .95 * fade;
    ctx.fillStyle = '#4b2b2a'; ctx.beginPath(); ctx.ellipse(-1, 11, 8, 3, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#ff8b4b'; ctx.beginPath(); ctx.moveTo(-12, 3); ctx.quadraticCurveTo(-18, -2, -11, -8); ctx.quadraticCurveTo(-8, -3, -5, -1); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#d95737'; ctx.strokeStyle = '#6d2c2a'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-8, -5); ctx.quadraticCurveTo(-10, 5, -5, 10); ctx.quadraticCurveTo(0, 14, 6, 9); ctx.quadraticCurveTo(10, 3, 7, -5); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f47b3f'; ctx.beginPath(); ctx.moveTo(-8, -5); ctx.lineTo(-5, -14); ctx.lineTo(-1, -8); ctx.lineTo(4, -14); ctx.lineTo(7, -5); ctx.quadraticCurveTo(1, -1, -8, -5); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff1a8'; ctx.fillRect(2, -7, 3, 2); ctx.fillRect(7, -6, 2, 2);
    ctx.strokeStyle = '#ffb979'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-5, 2); ctx.lineTo(-12, 7); ctx.moveTo(5, 2); ctx.lineTo(11, 6); ctx.moveTo(-3, 8); ctx.lineTo(-6, 13); ctx.moveTo(4, 8); ctx.lineTo(7, 13); ctx.stroke();
    if (spirit.attackFlash > 0) {
      const attack = clamp(spirit.attackFlash / .18, 0, 1);
      ctx.save(); ctx.rotate(attackFacing - facing);
      ctx.globalAlpha = .8 * attack * fade; ctx.strokeStyle = '#ffe4a2'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(9, 1); ctx.quadraticCurveTo(18 + (1 - attack) * 12, -8, 28 + (1 - attack) * 18, 0); ctx.stroke();
      ctx.fillStyle = '#ffbd6b'; ctx.beginPath(); ctx.arc(27 + (1 - attack) * 18, 0, 3 + attack * 2, 0, TAU); ctx.fill(); ctx.restore();
    }
    ctx.restore();
  }
  function drawKaelSpirits() { for (const spirit of run.skills.kaelSpirits) drawKaelSpirit(spirit); }

  function drawNecroUnit(unit) {
    const pixel = selectedSkin === 'pixel', ranged = unit.side > 0;
    ctx.save(); ctx.translate(pixel ? Math.round(unit.x) : unit.x, pixel ? Math.round(unit.y) : unit.y);
    ctx.globalAlpha = clamp(unit.life / .3, 0, 1);
    ctx.fillStyle = '#071b20a0'; ctx.beginPath(); ctx.ellipse(0, 12, 12, 5, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = ranged ? '#397f79' : '#655e92'; ctx.strokeStyle = '#182c35'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-8, -8); ctx.lineTo(8, -8); ctx.lineTo(11, 9); ctx.lineTo(0, 14); ctx.lineTo(-11, 9); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#cce0c3'; ctx.fillRect(-6, -18, 12, 10); ctx.fillStyle = '#142e35'; ctx.fillRect(-4, -15, 3, 3); ctx.fillRect(2, -15, 3, 3);
    ctx.strokeStyle = ranged ? '#99e9cc' : '#e7d7b8'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-4, 9); ctx.lineTo(-5, 17); ctx.moveTo(5, 9); ctx.lineTo(6, 17); ctx.stroke();
    for (let i = 1; i < unit.level; i++) { ctx.fillStyle = '#e7dfb1'; ctx.fillRect(-5 + (i - 1) * 7, -5, 3, 3); }
    ctx.save(); ctx.rotate(unit.facing);
    const swing = unit.attackFlash > 0 ? (1 - unit.attackFlash / .18) * .8 : 0;
    if (ranged) {
      ctx.strokeStyle = '#e0c793'; ctx.beginPath(); ctx.moveTo(13, -13); ctx.quadraticCurveTo(24, 0, 13, 13); ctx.stroke();
      ctx.strokeStyle = '#bde6ce'; ctx.beginPath(); ctx.moveTo(13, -13); ctx.lineTo(11 - swing * 6, 0); ctx.lineTo(13, 13); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(9, 0); ctx.lineTo(24, 0); ctx.stroke();
    } else {
      ctx.rotate(-.55 + swing); ctx.strokeStyle = '#c7d7dc'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(30, 0); ctx.stroke();
      ctx.strokeStyle = '#d4ac6f'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(13, -6); ctx.lineTo(13, 6); ctx.stroke();
    }
    ctx.restore(); ctx.restore();
  }

  function drawSkillGround() {
    const p = run.player;
    if (run.character.id === 'kael') {
      const s = run.skills;
      ctx.save();
      for (const wall of s.kaelIceWalls) {
        const build = clamp(wall.age / .18, 0, 1), fade = clamp(wall.life / .5, 0, 1);
        ctx.save(); ctx.translate(wall.x, wall.y); ctx.rotate(wall.angle); ctx.scale(1.45, 120 / 58); ctx.globalAlpha = .78 * fade;
        ctx.fillStyle = '#7bbfd6'; ctx.beginPath(); ctx.ellipse(0, 0, 19 * build, 63 * build, 0, 0, TAU); ctx.fill();
        const chunks = [
          [-10, -49, 17, 34, '#bcefff'], [5, -39, 19, 43, '#75c8e2'], [-7, -22, 22, 38, '#a5e5f5'],
          [7, -3, 18, 45, '#6bb6d3'], [-9, 18, 20, 39, '#b9f2ff'], [6, 39, 18, 36, '#83d4ea'], [-6, 52, 21, 26, '#c6f5ff']
        ];
        for (let i = 0; i < chunks.length; i++) {
          const [x, y, width, height, color] = chunks[i], h = height * build;
          ctx.fillStyle = color; ctx.strokeStyle = i % 2 ? '#3984a5' : '#e8fcff'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(x - width * .52, y + h * .42); ctx.lineTo(x - width * .35, y - h * .22);
          ctx.lineTo(x + Math.sin(i * 4.3) * width * .15, y - h * .55); ctx.lineTo(x + width * .52, y + h * .36);
          ctx.lineTo(x + width * .2, y + h * .55); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = '#f4ffff'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x - width * .2, y - h * .2); ctx.lineTo(x + width * .12, y + h * .2); ctx.stroke();
        }
        ctx.globalAlpha *= .45; ctx.fillStyle = '#e8fbff';
        for (let i = 0; i < 8; i++) { const y = -52 + ((i * 17) % 104); ctx.fillRect(-24 + (i % 3) * 4, y, 3, 3); }
        ctx.restore();
      }
      ctx.restore();
    }
    if (run.character.id === 'bulwark') {
      const back = p.facing + Math.PI, half = 70 * Math.PI / 180;
      ctx.fillStyle = '#d6be8870'; ctx.strokeStyle = '#e5cda6'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.arc(p.x, p.y, 33, back - half, back + half); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.save(); ctx.translate(p.x + Math.cos(back) * 39, p.y + Math.sin(back) * 39); ctx.rotate(back); ctx.fillStyle = '#ffe4af'; ctx.beginPath(); ctx.moveTo(5, 0); ctx.lineTo(-4, -4); ctx.lineTo(-4, 4); ctx.closePath(); ctx.fill(); ctx.restore();
    }
  }
  function drawBuffAuras() {
    const p = run?.player;
    if (!p) return;
    const assaultStacks = buffCount('assaultCuirass');
    const shivaStacks = buffCount('shivasGuard');
    if (!assaultStacks && !shivaStacks) return;
    const time = motionPreference.matches ? 0 : run.totalTime;
    const footY = p.y + 14;
    const ellipse = (rx, ry, color, alpha, width, dash = null, offset = 0) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.setLineDash(dash || []);
      ctx.lineDashOffset = offset;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
      ctx.stroke();
      ctx.restore();
    };
    ctx.save();
    ctx.translate(p.x, footY);
    if (assaultStacks) {
      const pulse = .34 + Math.sin(time * 1.45) * .035;
      const outerX = 59, outerY = 24;
      ellipse(outerX, outerY, '#dcefed', pulse, 2);
      ellipse(outerX - 8, outerY - 3.6, '#f4ffff', pulse * .8, 1.6);
      ellipse(outerX - 16, outerY - 7.2, '#6f95a2', pulse * .72, 1.25);

      ctx.save();
      ctx.globalAlpha = .5 + Math.sin(time * 1.2 + .8) * .05;
      ctx.strokeStyle = '#f4ffff'; ctx.lineWidth = 2; ctx.lineCap = 'round';
      for (let i = 0; i < 8; i++) {
        const angle = i * TAU / 8;
        const inner = .78, outer = 1.08;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * outerX * inner, Math.sin(angle) * outerY * inner);
        ctx.lineTo(Math.cos(angle) * outerX * outer, Math.sin(angle) * outerY * outer);
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = .58;
      ctx.strokeStyle = '#efffff'; ctx.lineWidth = 1.4; ctx.lineJoin = 'round';
      for (const angle of [Math.PI / 4, Math.PI * 3 / 4, Math.PI * 5 / 4, Math.PI * 7 / 4]) {
        const nx = Math.cos(angle), ny = Math.sin(angle), tx = -ny, ty = nx;
        const tip = { x: nx * outerX * 1.16, y: ny * outerY * 1.16 };
        const base = { x: nx * outerX * 1.01, y: ny * outerY * 1.01 };
        ctx.beginPath();
        ctx.moveTo(tip.x, tip.y);
        ctx.lineTo(base.x + tx * 3.4, base.y + ty * 3.4);
        ctx.lineTo(base.x - tx * 3.4, base.y - ty * 3.4);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();

      // A narrow travelling highlight keeps the ring alive without rotating the
      // fixed radial marks, matching the restrained DotA1 line animation.
      ctx.save();
      ctx.globalAlpha = .38;
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
      const sweep = time * .22;
      ctx.beginPath();
      ctx.ellipse(0, 0, outerX - 4, outerY - 2, 0, sweep, sweep + .32);
      ctx.stroke();
      ctx.restore();
    }
    if (shivaStacks) {
      const shivaX = assaultStacks ? 46 : 55, shivaY = assaultStacks ? 18 : 22;
      const dashOffset = motionPreference.matches ? 0 : -time * 3.5;
      ellipse(shivaX, shivaY, '#a9d8ef', .38, 1.8, [12, 8], dashOffset);
      ellipse(shivaX - 6, shivaY - 2.8, '#d8f5ff', .3, 1.2, [7, 9], -dashOffset * .7);
      ctx.save();
      ctx.globalAlpha = .48; ctx.strokeStyle = '#bfeeff'; ctx.lineWidth = 1.5;
      for (let i = 0; i < 6; i++) {
        const angle = i * TAU / 6 + Math.PI / 6;
        const inner = .86, outer = 1.1;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * shivaX * inner, Math.sin(angle) * shivaY * inner);
        ctx.lineTo(Math.cos(angle) * shivaX * outer, Math.sin(angle) * shivaY * outer);
        ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();
  }
  function drawSkillAreas() {
    const p = run.player, s = run.skills;
    if (s.kaelBlast) {
      const blast = s.kaelBlast;
      ctx.save(); ctx.translate(blast.x, blast.y); ctx.rotate(blast.angle);
      for (let wave = 0; wave < 3; wave++) {
        const age = blast.age - wave * .07;
        if (age < 0 || age > .62) continue;
        const progress = clamp(age / .62, 0, 1), distance = 24 + progress * 180, radius = 21 + wave * 13 + progress * 9;
        ctx.globalAlpha = (1 - progress) * .8; ctx.strokeStyle = '#6ec9e8'; ctx.lineWidth = 7;
        ctx.beginPath(); ctx.arc(distance, 0, radius, -.88, .88); ctx.stroke();
        ctx.globalAlpha = (1 - progress) * .95; ctx.strokeStyle = '#effcff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(distance, 0, radius, -.88, .88); ctx.stroke();
        for (const side of [-1, 1]) {
          const a = side * .88, x = distance + Math.cos(a) * radius, y = Math.sin(a) * radius;
          ctx.strokeStyle = '#c8f5ff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a + side * .24) * 9, y + Math.sin(a + side * .24) * 9); ctx.stroke();
        }
      }
      ctx.restore();
    }
    if (s.eclipse) {
      ctx.save();
      ctx.globalAlpha = .18; ctx.strokeStyle = '#d8c9ff'; ctx.lineWidth = 2; ctx.setLineDash([16, 12]);
      ctx.beginPath(); ctx.arc(s.eclipse.x, s.eclipse.y, 430, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
      for (const beam of s.eclipse.beams) {
        if (beam.warning > 0) {
          const progress = clamp(1 - beam.warning / .22, 0, 1);
          ctx.globalAlpha = .25 + progress * .55; ctx.strokeStyle = '#efe5ff'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(beam.x, beam.y, 52 + progress * 5, 0, TAU); ctx.stroke();
          ctx.globalAlpha = .16 + progress * .18; ctx.fillStyle = '#cbbdff'; ctx.beginPath(); ctx.arc(beam.x, beam.y, 52, 0, TAU); ctx.fill();
        } else {
          const impact = clamp((-beam.warning) / .4, 0, 1);
          ctx.globalAlpha = .7 * (1 - impact); ctx.strokeStyle = '#f5edff'; ctx.lineWidth = 8;
          ctx.beginPath(); ctx.moveTo(beam.x, beam.y - 120); ctx.lineTo(beam.x, beam.y + 8); ctx.stroke();
          ctx.globalAlpha = .75 * (1 - impact); ctx.strokeStyle = '#b5ceff'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(beam.x, beam.y, 52 + impact * 25, 0, TAU); ctx.stroke();
        }
      }
      ctx.restore();
    }
    if (s.spin) {
      const angle = (3 - s.spin.time) * 18;
      for (let i = 0; i < 3; i++) { ctx.strokeStyle = i ? '#d0b68e' : '#f8eed0'; ctx.lineWidth = i ? 4 : 7; ctx.beginPath(); ctx.arc(p.x, p.y - 8, 92 + i * 20, angle + i * 2, angle + i * 2 + 1.8); ctx.stroke(); }
      ctx.save(); ctx.translate(p.x, p.y - 8); ctx.rotate(angle); ctx.fillStyle = '#f1ead0'; ctx.beginPath(); ctx.moveTo(36, -4); ctx.lineTo(131, -7); ctx.lineTo(139, 1); ctx.lineTo(40, 7); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    if (s.rageTime > 0 || s.bloodTime > 0) {
      const color = s.rageTime > 0 ? '#a4df67' : '#d45643';
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.globalAlpha = .6;
      ctx.beginPath(); ctx.ellipse(p.x, p.y + 12, 28 + Math.sin(run.totalTime * 9) * 3, 11, 0, 0, TAU); ctx.stroke();
      for (let i = 0; i < 5; i++) { const lift = (run.totalTime * 24 + i * 13) % 58; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(p.x + Math.sin(i * 4) * 24, p.y + 12 - lift, 2, 0, TAU); ctx.fill(); }
      ctx.globalAlpha = 1;
    }
    if (run.character.id === 'sf') {
      const count = Math.min(6, Math.ceil(s.souls / 6));
      ctx.fillStyle = '#ef7753';
      for (let i = 0; i < count; i++) { const a = run.totalTime * .8 + i * TAU / Math.max(1, count); ctx.beginPath(); ctx.arc(p.x + Math.cos(a) * 30, p.y - 25 + Math.sin(a) * 13, 2.5, 0, TAU); ctx.fill(); }
    }
    if (s.requiem) {
      const cast = s.requiem;
      if (cast.delay > 0) {
        ctx.strokeStyle = '#e46a58'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(p.x, p.y + 12, 34, 13, 0, 0, TAU); ctx.stroke();
        for (const side of [-1, 1]) { ctx.fillStyle = '#fc9872'; ctx.beginPath(); ctx.arc(p.x + side * 22, p.y - 31, 5 + (1 - cast.delay / .55) * 5, 0, TAU); ctx.fill(); }
      } else for (let wave = 0; wave < 3; wave++) {
        const progress = clamp((cast.age - wave * .15) / .55, 0, 1);
        if (progress <= 0 || progress >= 1) continue;
        const r = progress * 280; ctx.globalAlpha = 1 - progress * .6;
        ctx.strokeStyle = wave ? '#a82f3d' : '#f18560'; ctx.lineWidth = wave ? 4 : 6;
        ctx.beginPath(); ctx.arc(cast.x, cast.y, r, 0, TAU); ctx.stroke();
        for (let i = 0; i < 12; i++) { const a = i * TAU / 12; ctx.save(); ctx.translate(cast.x + Math.cos(a) * r, cast.y + Math.sin(a) * r); ctx.rotate(a); ctx.fillStyle = '#f09b71'; ctx.beginPath(); ctx.moveTo(9, 0); ctx.lineTo(-9, -4); ctx.lineTo(-4, 0); ctx.lineTo(-9, 4); ctx.closePath(); ctx.fill(); ctx.restore(); }
      }
    }
    ctx.globalAlpha = 1;
    drawHeroGrowthAreas(ctx, { hero: run.character.id, level: run.level, player: p, skills: s,
      time: run.totalTime, pixel: selectedSkin === 'pixel', reducedMotion: motionPreference.matches });
  }
  function drawKaelMeteor(meteor) {
    const age = clamp(3 - meteor.life, 0, 3), reduced = motionPreference.matches;
    // Ground position, lifetime and damage still belong to the existing skill.
    const lift = reduced ? 0 : 72 * Math.max(0, 1 - age / .15) ** 2;
    if (meteorRenderer) {
      meteorRenderer.draw(ctx, { x: meteor.x, y: meteor.y, angle: meteor.trailAngle,
        time: reduced ? 1.4 : age, travel: reduced ? 0 : meteor.travel / 1.45, lift, scale: 1.45,
        opacity: Math.min(1, age / .04, meteor.life / .12), detail: reduced ? 0 : .6 });
    } else {
      ctx.save(); ctx.fillStyle = '#59392c'; ctx.strokeStyle = '#ff9c65'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(meteor.x, meteor.y - 35 - lift, 35, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
    }
    drawHeroGrowthKaelBody(ctx, 'chaos-meteor', meteor, { level: run.level, pixel: selectedSkin === 'pixel', reducedMotion: reduced });
  }
  function drawCombat() {
    const cam = camera();
    ctx.save();
    if (run.screenShake > 0 && phase === 'combat') ctx.translate(Math.sin(run.totalTime * 71) * run.screenShake, Math.cos(run.totalTime * 83) * run.screenShake);
    ctx.translate(selectedSkin === 'pixel' ? -Math.round(cam.x) : -cam.x, selectedSkin === 'pixel' ? -Math.round(cam.y) : -cam.y);
    drawBackdrop(cam); drawTerrain(cam); drawSkillGround(); drawBuffAuras(); drawPickups(cam);
    if (selectedSkin === 'pixel') {
      const layers = run.terrain.filter(o => o.kind !== 'water' && o.x + 32 >= cam.x && o.x - 32 <= cam.x + viewW && o.y + 16 >= cam.y && o.y - 80 <= cam.y + viewH)
        .map(o => ({ y: o.y, scenery: o }));
      for (const e of run.enemies) if (visible(e, cam, e.r + 20)) layers.push({ y: e.y + e.r * .8, enemy: e });
      for (const spirit of run.skills.kaelSpirits) if (visible(spirit, cam, 24)) layers.push({ y: spirit.y + 10, spirit });
      for (const unit of run.skills.necroUnits) if (visible(unit, cam, 32)) layers.push({ y: unit.y + 12, necro: unit });
      for (const meteor of run.skills.kaelMeteors) layers.push({ y: meteor.y, meteor });
      layers.push({ y: run.player.y + 16, player: true });
      layers.sort((a, b) => a.y - b.y);
      for (const layer of layers) {
        if (layer.scenery) drawScenery(layer.scenery);
        else if (layer.enemy) drawEnemy(layer.enemy);
        else if (layer.spirit) drawKaelSpirit(layer.spirit);
        else if (layer.necro) drawNecroUnit(layer.necro);
        else if (layer.meteor) drawKaelMeteor(layer.meteor);
        else drawPlayer();
      }
    } else {
      for (const e of run.enemies) if (visible(e, cam, e.r + 20)) drawEnemy(e);
      drawKaelSpirits();
      for (const unit of run.skills.necroUnits) if (visible(unit, cam, 32)) drawNecroUnit(unit);
      for (const meteor of run.skills.kaelMeteors) drawKaelMeteor(meteor);
      drawPlayer();
    }
    drawHazards(cam);
    if (selectedSkin === 'pixel') drawTerrainIndicators(cam);
    for (const e of run.enemies) if (visible(e, cam, 650)) drawEliteTelegraph(e);
    for (const b of run.enemyBullets) {
      if (!visible(b, cam)) continue;
      ctx.fillStyle = b.color;
      if (selectedSkin === 'pixel') ctx.fillRect(Math.round(b.x - b.r), Math.round(b.y - b.r), b.r * 2, b.r * 2);
      else { ctx.shadowColor = '#ff8da8'; ctx.shadowBlur = 9; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, TAU); ctx.fill(); }
    }
    ctx.shadowBlur = 0;
    drawProjectiles(cam); drawSkillAreas(); drawEffects(cam);
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
    canvasScale = dpr;
    canvas.width = Math.round(viewW * canvasScale); canvas.height = Math.round(viewH * canvasScale);
    ctx.setTransform(canvasScale, 0, 0, canvasScale, 0, 0);
    ctx.imageSmoothingEnabled = selectedSkin !== 'pixel';
  }
  function loop(now) {
    const dt = Math.min(.05, (now - (lastFrame || now)) / 1000);
    lastFrame = now;
    if (studio) { drawStudioFrame(dt); requestAnimationFrame(loop); return; }
    if (phase === 'pause') { requestAnimationFrame(loop); return; }
    ambientTime += dt;
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
    $('resume-button').textContent = previousPhase === 'wave-result' ? t('resumeCountdown') : t('resume');
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
    $('character-list').addEventListener('click', event => { const b = event.target.closest('[data-character]'); if (b) { selectedCharacter = b.dataset.character; loadHeroPoses(selectedCharacter); renderTitle(); refocus(`[data-character="${selectedCharacter}"]`); } });
    $('biome-list').addEventListener('click', event => { const b = event.target.closest('[data-biome]'); if (b) { selectedBiome = b.dataset.biome; renderTitle(); refocus(`[data-biome="${selectedBiome}"]`); } });
    $('difficulty-list').addEventListener('click', event => { const b = event.target.closest('[data-difficulty]'); if (b) { selectedDifficulty = b.dataset.difficulty; persist(); renderTitle(); refocus(`[data-difficulty="${selectedDifficulty}"]`); } });
    $('pace-list').addEventListener('click', event => { const b = event.target.closest('[data-pace]'); if (b) { selectedPace = b.dataset.pace; persist(); renderTitle(); refocus(`[data-pace="${selectedPace}"]`); } });
    document.querySelectorAll('[data-locale]').forEach(button => button.addEventListener('click', () => { setLocale(button.dataset.locale); refocus(`[data-locale="${selectedLocale}"]`); }));
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
      applyBonus(choice.bonus);
      if (run.character.id === 'kael' && choice.bonus.elemental) run.skills.kaelSpellRank = Math.min(3, run.skills.kaelSpellRank + 1);
      run.pendingLevels -= 1; playSfx('level');
      if (run.pendingLevels > 0) levelOffers(); else openShop();
    });
    $('shop-offers').addEventListener('click', event => {
      const buy = event.target.closest('[data-buy]'), lock = event.target.closest('[data-lock]');
      if (buy) buyOffer(Number(buy.dataset.buy), buy.dataset.buyCraft || null, buy.dataset.buyUpgrade === 'true');
      if (lock) { const index = Number(lock.dataset.lock), offer = run.shopOffers[index]; if (offer) { offer.locked = !offer.locked; renderShop(); refocus(`[data-lock="${index}"]`); } }
    });
    const inventoryClick = event => {
      if (phase !== 'shop') return;
      const sell = event.target.closest('[data-sell]'), move = event.target.closest('[data-move]');
      if (sell) sellEquipment(Number(sell.dataset.sell));
      if (move) moveEquipment(Number(move.dataset.move), move.dataset.toActive === 'true');
    };
    $('inventory').addEventListener('click', inventoryClick);
    $('reserve-inventory').addEventListener('click', inventoryClick);
    $('forge-settings').addEventListener('change', event => {
      if (phase !== 'shop') return;
      if (event.target.id === 'auto-forge') run.autoForge = event.target.checked;
      else if (event.target.matches('[data-forge-target]')) {
        const index = Number(event.target.dataset.forgeTarget), value = event.target.value;
        run.forgeTargets[index] = value;
        if (value && run.forgeTargets[1 - index] === value) run.forgeTargets[1 - index] = '';
      } else return;
      const selector = event.target.id === 'auto-forge' ? '#auto-forge' : `[data-forge-target="${event.target.dataset.forgeTarget}"]`;
      autoForge(); renderShop(); renderEquipmentStrip(); document.querySelector(selector)?.focus({ preventScroll: true });
    });
    const craftClick = event => {
      if (phase !== 'shop') return;
      const upgrade = event.target.closest('[data-upgrade]');
      if (upgrade) { upgradeEquipment(Number(upgrade.dataset.upgrade), upgrade.dataset.batch === 'true'); return; }
      const craft = event.target.closest('[data-craft]');
      if (craft && craftEquipment(craft.dataset.craft)) {
        renderShop(); renderEquipmentStrip();
        focusCraftResult(craft.dataset.craft);
      }
    };
    $('quick-craft-list').addEventListener('click', craftClick);
    $('recipe-list').addEventListener('click', craftClick);
    $('chest-craft-list').addEventListener('click', event => {
      if (phase !== 'chest') return;
      const reward = event.target.closest('[data-chest-craft]');
      if (reward) { resolveChest(true, reward.dataset.chestCraft); return; }
      const upgrade = event.target.closest('[data-upgrade]');
      if (upgrade) { upgradeEquipment(Number(upgrade.dataset.upgrade)); return; }
      const organize = event.target.closest('[data-chest-organize]');
      if (organize && craftEquipment(organize.dataset.chestOrganize)) {
        renderChestReward(); renderEquipmentStrip(); focusCraftResult();
      }
    });
    $('reroll-button').addEventListener('click', rerollShop);
    $('next-wave-button').addEventListener('click', beginNextWaveCountdown);
    $('wave-result-continue').addEventListener('click', resolveWaveIntermission);
    $('chest-take-button').addEventListener('click', () => resolveChest(true));
    $('chest-scrap-button').addEventListener('click', () => resolveChest(false));
    $('mode-list').addEventListener('click', event => { const b = event.target.closest('[data-mode]'); if (b) { selectedMode = b.dataset.mode; persist(); renderTitle(); refocus(`[data-mode="${selectedMode}"]`); } });
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

  // The studio controls scenarios; combat rules and rendering stay in this runtime.
  let studioFire = null, studioAttack = false, studioSelection = null;
  function studioCatalog() {
    return [
      { id: 'heroes', label: '英雄', items: CHARACTERS.map(hero => {
        const text = HERO_TEXT['zh-CN'][hero.id];
        return { id: hero.id, name: text[0], description: text[2], levels: 3, icon: HERO_ART[hero.id], source: '../static/js/game/heroes.js', duration: hero.id === 'tb' ? 12 : 8, variants: [
          { id: 'idle', name: '待机', description: '观察待机形态与呼吸。' },
          { id: 'walk', name: '移动', description: '沿当前方向往返，使用真实移动与动作帧。' },
          { id: 'basic', name: '普通攻击', description: '持续攻击静止演示目标。' },
          { id: 'active', name: text[3], description: text[4] },
          { id: 'passive', name: text[5], description: text[6] },
          ...(hero.id === 'kael' ? KAEL_SPELLS.map(spell => ({ id: spell.id, name: spell.names['zh-CN'], description: spell.desc['zh-CN'] })) : [])
        ] };
      }) },
      { id: 'equipment', label: '武器 / 装备', items: Object.entries(EQUIPMENT).map(([id, def]) => ({ id, name: def.name, description: def.desc,
        icon: `./art/pixel/equipment-${id}.svg`, source: '../static/js/game/equipment.js', levels: EQUIPMENT_UPGRADES[id] ? 3 : 1,
        duration: id === 'necronomicon' ? 22 : ['dagon', 'cyclone', 'heart'].includes(id) ? 12 : 8 })) },
      { id: 'buffs', label: 'Buff', items: Object.entries(BUFFS).map(([id, def]) => ({ id, name: def.name, description: def.desc,
        icon: def.icon, source: '../static/js/game/buffs.js', stacks: true })) },
      { id: 'effects', label: '特效', items: [
        { id: 'meteor', name: '陨石', description: '燃烧岩石与火尾。与卡尔混沌陨石共用绘制模块。' },
        { id: 'fire', name: '火', description: '焰舌、烟气与火星。也是陨石火尾的组成部分。' },
        { id: 'wind', name: '风', description: '直立旋转气流。与卡尔混沌之风共用绘制模块。' }
      ].map(item => ({ ...item, source: `../static/js/game/effects/${item.id}.js` })) },
      { id: 'maps', label: '地图', items: BIOMES.map(biome => ({ id: biome.id, name: biome.name, description: biome.desc, source: '../static/js/game/maps.js',
        variants: [{ id: 'overview', name: '全图', description: '同一地形布局的全景，水道与树石位置来自游戏定义。' },
          { id: 'ground', name: '地面细节', description: '观察出生点附近的真实地形与装饰。' }] })) }
    ];
  }
  function resetStudio(selection) {
    studioSelection = selection; studioAttack = false;
    selectedCharacter = selection.category === 'heroes' ? selection.id : selection.category === 'equipment' && selection.id === 'battlefury' ? 'jugg'
      : selection.category === 'equipment' && selection.id === 'bloodstone' ? 'conductor'
      : selection.category === 'equipment' && selection.id === 'dagon' ? 'kael'
      : selection.category === 'equipment' && selection.id === 'manta' ? 'luna' : 'rover';
    selectedBiome = selection.category === 'maps' ? selection.id : 'docks';
    selectedDifficulty = 'normal'; selectedMode = 'expedition'; selectedPace = 'normal';
    selectedSkin = selection.skin; soundEnabled = false;
    createRun(); phase = 'combat'; ambientTime = 0; run.wave = 1;
    if (selection.category !== 'maps') run.terrain = [];
    if (selection.category === 'heroes') run.level = [1, 5, 10][selection.level - 1];
    if (selection.category === 'equipment') {
      const item = createEquipment(selection.id, selection.level);
      run.equipment.push(item); applyEquipmentStats(item);
      run.player.hp *= .4;
    }
    if (selection.category === 'buffs') {
      for (let i = 0; i < selection.stacks; i++) addBuff(selection.id);
      resetBuffWave(run); run.player.hp *= .65;
    }
    const passive = selection.category === 'heroes' && selection.variant === 'passive';
    run.skills.kaelPassiveTimer = passive ? 1 : Infinity;
    if (selection.category !== 'maps' && selection.category !== 'effects' && !['idle', 'walk'].includes(selection.variant)) {
      const targets = selection.category === 'equipment' && ['battlefury', 'dagon', 'manta'].includes(selection.id)
        ? [[70, 0], [95, 38], [90, -50], [-105, -25], [-75, 100]] : [[86, -15], [129, 25], [172, -15], [215, 25]];
      for (const [x, y] of targets) {
        const enemy = spawnEnemy('crawler', run.player.x + x, run.player.y + y);
        enemy.value = 0;
        enemy.hp = enemy.maxHp = passive && selectedCharacter === 'sf' ? 12 : 15000;
      }
    }
    viewStudio(selection);
  }
  function viewStudio(selection) {
    studioSelection = selection; selectedSkin = selection.skin;
    $('game').dataset.skin = selectedSkin;
    if (!run) return;
    const p = run.player, reverse = Math.cos(p.facing) * Math.cos(selection.direction) < 0;
    if (reverse) for (const enemy of run.enemies) enemy.x = p.x - (enemy.x - p.x);
    p.facing = p.attackFacing = selection.direction;
    p.visualSide = true; p.visualMirror = selection.direction ? -1 : 1;
  }
  function triggerStudio(selection, time, dt) {
    const hero = selection.category === 'heroes', passive = hero && selection.variant === 'passive';
    const crossed = at => time - dt < at - 1e-9 && time >= at - 1e-9;
    studioAttack = selection.category === 'equipment' || selection.category === 'buffs' || (hero && !['idle', 'walk'].includes(selection.variant));
    keys.clear();
    if (hero && selection.variant === 'walk') keys.add((Math.floor(time / 1.5) % 2 === 0) === !selection.direction ? 'd' : 'a');
    if (crossed(.35) && hero && selection.variant !== 'passive') {
      if (selection.variant === 'active') {
        if (selectedCharacter === 'kael') run.skills.lastPassiveSpell = 'chaos-meteor';
        tryActiveSkill();
      } else if (KAEL_SPELL_BY_ID[selection.variant]) castKaelSpell(selection.variant, 'passive');
    }
    if (selection.category === 'equipment' && ['aghanim', 'orchid', 'bloodstone'].includes(selection.id) && crossed(.5)) tryActiveSkill();
    if (selection.category === 'equipment' && selection.id === 'phaseBoots' && crossed(.35)) tryDash();
    if (Math.floor(time / .8) !== Math.floor((time - dt) / .8)) {
      if ((passive && selectedCharacter === 'bulwark') || selection.category === 'buffs' || selection.category === 'equipment') {
        if (run.player.hp > 6 && !(selection.category === 'equipment' && selection.id === 'heart' && time > 1)) hurtPlayer(3, run.enemies.find(enemy => !enemy.dead), true);
      }
      if (passive && selectedCharacter === 'scavenger') { dropPickup(run.player.x, run.player.y, 1); updatePickups(.01); }
    }
  }
  function tickStudio(dt) {
    run.elapsed += dt; run.totalTime += dt; ambientTime += dt;
    movePlayer(dt); updateSkills(dt);
    if (studioAttack) updateBaseAttack(dt);
    updateBullets(dt); updateEffects(dt);
    for (const enemy of run.enemies) enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
    run.enemies = run.enemies.filter(enemy => !enemy.dead);
  }
  function describeStudio(selection) {
    const p = run.player;
    if (selection.category === 'maps') return { summary: `${run.biome.name} · ${WORLD.w} × ${WORLD.h}`, detail: '使用游戏的地形定义、绘制与两套画面主题。此处不生成敌潮或地形伤害。' };
    if (selection.category === 'effects') return { summary: '独立效果 · 与游戏共用绘制模块', detail: '观察场景控制位置与时间；技能的伤害、碰撞和寿命由真实游戏负责。' };
    let detail = `静止演示目标，每 ${selection.duration || 8} 秒重置场景。生命 ${Math.ceil(p.hp)}/${p.maxHp} · 法力 ${Math.floor(p.mana)}/${p.maxMana} · 物攻加成 ${Number(physicalBonus().toFixed(2))} · 法攻 ${run.stats.elemental} · 攻速 ${attackSpeed().toFixed(0)}% · 护甲 ${run.stats.armor} · 射程 ${basicRange()}`;
    if (selection.category === 'heroes') detail += ` · 英雄Lv.${run.level}（仅观察成长表现，不额外增加属性）`;
    if (selection.category === 'equipment') detail += `。${equipmentDesc(equipmentDef(run.equipment[0]))}；概率被动按实际概率触发。`;
    if (selection.category === 'buffs') detail += `。${selection.stacks} 层；定时承受轻伤，用于观察受击、吸收和回复。光环减速 ${(buffAuraSlow(run, 100) * 100).toFixed(0)}%，物理增伤 ${(buffPhysicalAmp(run, 100) * 100).toFixed(0)}%。`;
    if (run.character.id === 'sf') detail += ` · 灵魂 ${run.skills.souls}`;
    if (run.character.id === 'scavenger') detail += ` · 拾取 ${run.skills.manualPickups} · 材料 ${run.money}`;
    if (run.character.id === 'tb') detail += ` · ${skillStatus(0)} · ${skillStatus(1)}`;
    return { summary: `${HERO_TEXT['zh-CN'][run.character.id][0]} · ${run.enemies.length} 个演示目标`, detail };
  }
  function drawStudioEffect(context, width, height, selection, time) {
    if (selection.category !== 'effects') return;
    const renderer = selection.id === 'fire' ? studioFire : selection.id === 'wind' ? windRenderer : meteorRenderer;
    const scale = Math.min(width / 420, height / 360, 1.4) * selection.zoom;
    renderer?.draw(context, { x: width * .5, y: height * .78, time: time + .8,
      scale: selection.id === 'meteor' ? scale * 1.4 : scale, angle: selection.direction,
      travel: time * 240 * (selection.direction ? -1 : 1), spin: selection.direction ? -1 : 1,
      detail: motionPreference.matches ? .6 : 1 });
  }
  function drawStudioFrame(dt) {
    studio.update(dt);
    const width = canvas.clientWidth, height = canvas.clientHeight, selection = studio.selection;
    const fullMap = studio.isMap && selection?.variant === 'overview';
    const scale = fullMap ? Math.min(width / WORLD.w, height / WORLD.h) * studio.zoom : studio.zoom;
    viewW = width / scale; viewH = height / scale;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, width, height);
    if (run && selection?.category !== 'effects') { ctx.scale(scale, scale); drawCombat(); }
    else { ctx.fillStyle = selectedSkin === 'pixel' ? '#182d33' : '#27383d'; ctx.fillRect(0, 0, width, height); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); studio.draw(ctx, width, height);
  }
  function initStudio() {
    document.body.classList.add('studio-runtime');
    canvas.setAttribute('aria-label', '当前对象的受控演示，由外部工作台按钮操作');
    studio = createStudioRuntime({ catalog: studioCatalog(), reset: resetStudio, tick: tickStudio,
      trigger: triggerStudio, view: viewStudio, describe: describeStudio, drawEffect: drawStudioEffect });
    createFireRenderer().then(renderer => { studioFire = renderer; }).catch(error => {
      parent.postMessage({ source: 'dotarogue-runtime', type: 'error', message: error.message }, location.origin);
    });
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);
  }

  resize(); applyStaticLocale();
  if (studioMode) initStudio();
  else { bindEvents(); renderTitle(); }
  requestAnimationFrame(loop);
})();
