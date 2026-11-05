import { ENEMIES, ENEMY_NAMES, BOSS_VARIANTS, BOSS_VARIANT_NAMES, ELITE_ROTATION, ELITE_WAVES } from './enemies.js?v=20261105-catalog1';
import { NEUTRAL_CAMP_DEFS } from './neutral-camp-defs.js?v=20261105-catalog1';
import { JUNGLE_BUFFS } from './jungle-buffs.js?v=20261105-catalog1';
import { initCatalogPage } from './catalog-ui.js?v=20261105-catalog1';

const COPY = {
  'zh-CN': {
    title: '怪物图鉴', lead: '了解敌潮中的怪物，以及经典战场红蓝守卫与固定肉山的属性、招式和奖励。',
    baseline: '以下是生成前的基础数值；实战会随波次、难度、无尽压强和其他效果变化。',
    catalog: '图鉴首页', heroes: '角色', equipment: '武器', enemies: '怪物', buffs: 'Buff', studio: '设计工作台', back: '返回游戏',
    searchLabel: '搜索怪物或招式', empty: '没有匹配的怪物。', normal: '普通敌人', elite: '精英', boss: '首领', variant: '旧战场第20波变体', neutral: '固定中立目标', guardian: '守卫', fixedLair: '固定巢穴', strike: '基础重击伤害', patrol: '巡逻半径', leash: '活动半径', respawn: '重生', seconds: '{count} 秒', reward: '击杀奖励', classic: '仅 DotA 经典战场', neutralLife: '脱离活动边界后回巢回血、清除控制；生命状态跨波保留。营地生命乘难度倍率，每次击杀后重生的生命提高25%；重生和增益计时在暂停、商店与波间冻结。', guardAttack: '警戒范围内追击玩家，0.65秒前摇后对近处砸地；离开营地活动边界可令其脱战回巢。', fixedRoshanAttack: '基础生命14,000；0.95秒前摇后砸地，并沿锁定方向发射三枚巨石。半血后暴怒，提高移速、伤害和出手频率；经典图第20波在原巢回满生命并觉醒，不另刷第二只。', guardReward: '18材料、12经验，以及持续{duration}秒的{buff}。', roshanReward: '60经验与持续{duration}秒的肉山之力。',
    hp: '基础生命', damage: '接触伤害', speed: '移动速度', value: '材料价值', wave: '精英出场：第 {wave} 波', count: '{count} 条怪物记录',
    appearance: '出场', bossWave: '所有战场第10波；无尽模式第30波起的首领波', roshanWave: '仅赤沙废港、荧菌裂谷、蓝霜残骸第20波；经典图使用固定巢穴肉山', observe: '在工作台观察',
    behavior: {
      crawler: '追踪玩家并造成接触伤害，是敌潮中的基础近身威胁。', runner: '移动较快，持续追踪玩家。', tank: '生命较高、移动较慢，通过近身追击压缩走位空间。',
      shooter: '与玩家保持距离，视线未被地形阻挡时发射直线弹丸。', charger: '短暂蓄力后沿锁定方向冲锋；横移可避开冲锋线。', splitter: '被击败后分裂成小追猎虫；分裂子体不给影魔收魂成长。',
      centaur: '0.8 秒预警后，对自身周围 115 半径范围踩踏，造成 1.25 倍当前接触伤害。',
      satyr: '0.9 秒前摇时锁定方向，随后发射直线大弹。横向离开预警线或利用树石阻挡。',
      hellbear: '0.95 秒预警后，对周围 125 半径砸地，造成 1.4 倍当前接触伤害；出手后短时加速追击。',
      darkTroll: '1 秒蓄力后召唤 2 只小追猎虫，每名召唤师同时存活的召唤物最多 4 只。召唤物不继承精英奖励。',
      elite: '0.4 秒前摇后沿锁定方向冲锋 0.65 秒，地形阻挡会结束冲锋。',
      frostWraith: '锁定玩家当前位置，1.05 秒蓝圈预警后在该点 115 半径内霜爆，造成 1.35 倍当前接触伤害。目标位置不追踪玩家。',
      thunderLizard: '1.15 秒前摇后，沿锁定方向同时释放三条雷击带，长度 520、半宽 18；重叠区域只结算一次。',
      boss: '大体型追击，蓄力后释放环形弹幕；注意预警并留出撤离空间。',
      roshan: '重击前有环形预警，并向外释放冲击弹幕。生命低于 55% 后暴怒，移速和伤害提高、前摇缩短。'
    }
  },
  'zh-TW': {
    title: '怪物圖鑑', lead: '了解敵潮中的怪物，以及經典戰場紅藍守衛與固定肉山的屬性、招式和獎勵。',
    baseline: '以下是生成前的基礎數值；實戰會隨波次、難度、無盡壓強和其他效果變化。',
    catalog: '圖鑑首頁', heroes: '角色', equipment: '武器', enemies: '怪物', buffs: 'Buff', studio: '設計工作台', back: '返回遊戲',
    searchLabel: '搜尋怪物或招式', empty: '沒有符合的怪物。', normal: '普通敵人', elite: '精英', boss: '首領', variant: '舊戰場第20波變體', neutral: '固定中立目標', guardian: '守衛', fixedLair: '固定巢穴', strike: '基礎重擊傷害', patrol: '巡邏半徑', leash: '活動半徑', respawn: '重生', seconds: '{count} 秒', reward: '擊殺獎勵', classic: '僅 DotA 經典戰場', neutralLife: '脫離活動邊界後回巢回血、清除控制；生命狀態跨波保留。營地生命乘難度倍率，每次擊殺後重生的生命提高25%；重生和增益計時在暫停、商店與波間凍結。', guardAttack: '警戒範圍內追擊玩家，0.65秒前搖後對近處砸地；離開營地活動邊界可令其脫戰回巢。', fixedRoshanAttack: '基礎生命14,000；0.95秒前搖後砸地，並沿鎖定方向發射三枚巨石。半血後暴怒，提高移速、傷害和出手頻率；經典圖第20波在原巢回滿生命並覺醒，不另刷第二隻。', guardReward: '18材料、12經驗，以及持續{duration}秒的{buff}。', roshanReward: '60經驗與持續{duration}秒的肉山之力。',
    hp: '基礎生命', damage: '接觸傷害', speed: '移動速度', value: '材料價值', wave: '精英出場：第 {wave} 波', count: '{count} 條怪物記錄',
    appearance: '出場', bossWave: '所有戰場第10波；無盡模式第30波起的首領波', roshanWave: '僅赤沙廢港、熒菌裂谷、藍霜殘骸第20波；經典圖使用固定巢穴肉山', observe: '在工作台觀察',
    behavior: {
      crawler: '追蹤玩家並造成接觸傷害，是敵潮中的基礎近身威脅。', runner: '移動較快，持續追蹤玩家。', tank: '生命較高、移動較慢，透過近身追擊壓縮走位空間。',
      shooter: '與玩家保持距離，視線未被地形阻擋時發射直線彈丸。', charger: '短暫蓄力後沿鎖定方向衝鋒；橫移可避開衝鋒線。', splitter: '被擊敗後分裂成小追獵蟲；分裂子體不給影魔收魂成長。',
      centaur: '0.8 秒預警後，對自身周圍 115 半徑範圍踩踏，造成 1.25 倍目前接觸傷害。',
      satyr: '0.9 秒前搖時鎖定方向，隨後發射直線大彈。橫向離開預警線或利用樹石阻擋。',
      hellbear: '0.95 秒預警後，對周圍 125 半徑砸地，造成 1.4 倍目前接觸傷害；出手後短時加速追擊。',
      darkTroll: '1 秒蓄力後召喚 2 隻小追獵蟲，每名召喚師同時存活的召喚物最多 4 隻。召喚物不繼承精英獎勵。',
      elite: '0.4 秒前搖後沿鎖定方向衝鋒 0.65 秒，地形阻擋會結束衝鋒。',
      frostWraith: '鎖定玩家目前位置，1.05 秒藍圈預警後在該點 115 半徑內霜爆，造成 1.35 倍目前接觸傷害。目標位置不追蹤玩家。',
      thunderLizard: '1.15 秒前搖後，沿鎖定方向同時釋放三條雷擊帶，長度 520、半寬 18；重疊區域只結算一次。',
      boss: '大體型追擊，蓄力後釋放環形彈幕；注意預警並留出撤離空間。',
      roshan: '重擊前有環形預警，並向外釋放衝擊彈幕。生命低於 55% 後暴怒，移速和傷害提高、前搖縮短。'
    }
  },
  en: {
    title: 'Enemy Archive', lead: 'Explore wave enemies and the classic battlefield’s red and blue guardians and fixed Roshan through their stats, attacks and rewards.',
    baseline: 'These values are before spawning. Waves, difficulty, endless pressure and other effects change actual combat values.',
    catalog: 'Archive home', heroes: 'Heroes', equipment: 'Weapons', enemies: 'Enemies', buffs: 'Buffs', studio: 'Design workbench', back: 'Back to game',
    searchLabel: 'Search enemies or attacks', empty: 'No matching enemies.', normal: 'Basic enemy', elite: 'Elite', boss: 'Boss', variant: 'Wave 20 variant · legacy battlefields', neutral: 'Fixed neutral objective', guardian: 'Guardian', fixedLair: 'Fixed lair', strike: 'Base slam damage', patrol: 'Patrol radius', leash: 'Leash radius', respawn: 'Respawn', seconds: '{count} sec', reward: 'Kill rewards', classic: 'DotA Classic only', neutralLife: 'Leaving the activity boundary sends the unit home to heal and clear control effects. Health persists across waves. Camp HP scales with difficulty and gains 25% per previous kill on respawn. Menus and pause freeze respawn and buff timers.', guardAttack: 'Pursues the player within its alert radius and slams after a 0.65 sec windup. Leaving the camp boundary makes it disengage and return home.', fixedRoshanAttack: 'Base HP 14,000. After a 0.95 sec windup, slams and fires three rocks along a fixed direction. Below half HP, enrage increases speed, damage and attack frequency. Classic wave 20 restores and awakens the same Roshan in his lair instead of spawning another.', guardReward: '18 materials, 12 XP and {buff} for {duration} sec.', roshanReward: '60 XP and Roshan’s Might for {duration} sec.',
    hp: 'Base HP', damage: 'Contact damage', speed: 'Move speed', value: 'Material value', wave: 'Elite encounter: wave {wave}', count: '{count} enemy records',
    appearance: 'Encounter', bossWave: 'All battlefields: wave 10 and endless boss waves from wave 30', roshanWave: 'Wave 20 in Red Sand Docks, Glowfungus Rift and Bluefrost Wreckage only; Classic uses fixed-lair Roshan', observe: 'View in workbench',
    behavior: {
      crawler: 'Pursues the player and deals contact damage: a basic close-range threat.', runner: 'Moves quickly and keeps pursuing the player.', tank: 'High health and low speed create steady pressure at close range.',
      shooter: 'Keeps its distance and fires straight projectiles when terrain does not block sight.', charger: 'Winds up, then charges along a fixed direction. Move sideways out of its path.', splitter: 'Splits into small hunter bugs on death. Split offspring grant no Shadow Fiend souls.',
      centaur: 'After a 0.8 sec warning, stomps within 115 radius for 1.25 times its current contact damage.',
      satyr: 'Locks a direction during a 0.9 sec windup, then fires a large straight projectile. Dodge sideways or use trees and rocks.',
      hellbear: 'After a 0.95 sec warning, slams within 125 radius for 1.4 times current contact damage, then briefly pursues faster.',
      darkTroll: 'After a 1 sec windup, summons 2 small hunter bugs, up to 4 living summons per troll. Summons do not inherit elite rewards.',
      elite: 'Winds up for 0.4 sec, then charges along a fixed direction for 0.65 sec. Terrain stops the charge.',
      frostWraith: 'Locks the player’s position, then bursts within 115 radius after a 1.05 sec blue-circle warning for 1.35 times contact damage. The circle does not track movement.',
      thunderLizard: 'After a 1.15 sec windup, fires three fixed lightning lanes, 520 long with half-width 18. Overlapping lanes deal damage only once.',
      boss: 'A large pursuing enemy that winds up a radial barrage. Watch the warning and leave room to retreat.',
      roshan: 'Warns with a ring before slamming and firing a radial shock barrage. Below 55% HP, enrage increases speed and damage and shortens the windup.'
    }
  }
};

const records = Object.entries(ENEMIES).map(([id, def]) => ({ id, def }));
records.push({ id: 'roshan', def: BOSS_VARIANTS.roshan });
records.push(...NEUTRAL_CAMP_DEFS.map(def => ({ id: `neutral-${def.key}`, def, neutral: true })));
const create = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text != null) element.textContent = text;
  return element;
};

function render(locale, query = '') {
  const text = COPY[locale];
  const term = query.trim().toLocaleLowerCase();
  const list = document.getElementById('catalog-list');
  const cards = [];
  for (const { id, def, neutral } of records) {
    const buff = neutral ? JUNGLE_BUFFS[def.key] : null;
    const name = neutral
      ? `${def.name[locale]} · ${def.key === 'roshan' ? text.fixedLair : text.guardian}`
      : id === 'roshan' ? `${BOSS_VARIANT_NAMES.roshan[locale]} · ${text.variant}` : ENEMY_NAMES[locale][id];
    const kind = neutral ? text.neutral : id === 'roshan' ? text.variant : id === 'boss' ? text.boss : def.elite ? text.elite : text.normal;
    const description = neutral ? text[def.key === 'roshan' ? 'fixedRoshanAttack' : 'guardAttack'] : text.behavior[id];
    const reward = neutral ? `${text[def.key === 'roshan' ? 'roshanReward' : 'guardReward'].replace('{duration}', buff.duration).replace('{buff}', buff.name[locale])} ${buff.desc[locale]}` : '';
    if (term && !`${name} ${kind} ${description} ${reward} ${neutral ? text.classic : ''} ${id}`.toLocaleLowerCase().includes(term)) continue;
    const card = create('article', 'catalog-card');
    card.id = `enemy-${id}`;
    const head = create('div', 'catalog-card-head');
    if (!neutral || def.key === 'roshan') {
      const image = create('img');
      image.src = `assets/art/pixel/${neutral ? 'roshan' : id}.svg`;
      image.alt = '';
      image.width = 64;
      image.height = 64;
      image.loading = 'lazy';
      image.decoding = 'async';
      head.append(image);
    }
    const title = create('div');
    title.append(create('p', 'catalog-meta', kind), create('h2', '', name));
    head.append(title);
    const stats = create('dl', 'catalog-stats');
    for (const key of neutral ? ['hp', 'damage', 'speed', 'patrolRadius', 'leashRadius', 'respawn'] : ['hp', 'damage', 'speed', 'value']) {
      const row = create('div');
      const label = neutral && key === 'damage' ? text.strike : key === 'patrolRadius' ? text.patrol : key === 'leashRadius' ? text.leash : text[key];
      const value = key === 'respawn' ? text.seconds.replace('{count}', def[key]) : String(def[key]);
      row.append(create('dt', '', label), create('dd', '', value));
      stats.append(row);
    }
    card.append(head, stats, create('p', '', description));
    if (neutral) {
      card.append(create('p', 'catalog-meta', text.classic));
      card.append(create('p', '', text.neutralLife));
      card.append(create('h3', '', text.reward), create('p', '', reward));
    } else if (def.elite) {
      card.append(create('p', 'catalog-meta', text.wave.replace('{wave}', ELITE_WAVES[ELITE_ROTATION.indexOf(id)])));
      const preview = create('a', 'catalog-preview-link', text.observe);
      preview.href = `studio.html#category=enemies&id=${id}&variant=ability&skin=pixel&zoom=1`;
      card.append(preview);
    } else if (id === 'boss' || id === 'roshan') {
      card.append(create('p', 'catalog-meta', `${text.appearance} · ${id === 'roshan' ? text.roshanWave : text.bossWave}`));
    }
    cards.push(card);
  }
  list.replaceChildren(...cards);
  document.getElementById('catalog-empty').hidden = cards.length > 0;
  document.getElementById('catalog-count').textContent = text.count.replace('{count}', cards.length);
}

initCatalogPage({ copy: COPY, render });
