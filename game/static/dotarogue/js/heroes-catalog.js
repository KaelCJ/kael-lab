import { CHARACTERS, HERO_TEXT, KAEL_SPELLS } from './heroes.js?v=20261031-sf-requiem5';
import { initCatalogPage } from './catalog-ui.js?v=20261105-catalog1';

const COPY = {
  'zh-CN': {
    title: '角色图鉴', lead: '九名当前英雄的技能与成长规则。按需展开资料，卡尔的六个法术也收录在角色卡中。',
    skip: '跳到角色图鉴', archive: '图鉴', home: '图鉴入口', heroes: '角色', equipment: '武器', monsters: '怪物', buffs: 'Buff', studio: '设计工作台', back: '返回游戏',
    search: '搜索角色与技能', empty: '没有匹配的角色或技能。', details: '查看技能与成长', preview: '在工作台观察', active: '主动技能', passive: '被动技能', attributes: '初始属性', primary: '主属性',
    strength: '力量', agility: '敏捷', intelligence: '智力', growth: '英雄等级成长',
    growthRules: '技能按局内英雄等级分为三阶，技能伤害／主动增益乘以对应倍率；装备强化等级单独计算。',
    growthStages: ['Lv.1～4：初始阶，倍率 ×1。', 'Lv.5～9：成长阶，倍率 ×1.25。', 'Lv.10+：成熟阶，倍率 ×1.5。'],
    juggStages: ['Lv.1～4 · 跃空斩：一次跳斩，落地后获得0.28秒无敌。', 'Lv.5～9 · 连环跃斩：最多连续2段，优先选择本次尚未命中的目标。', 'Lv.10+ · 无敌斩：最多连续4段，从第一次起跳到连段结束保持无敌。'],
    juggRules: '三阶都由每5次有效近战攻击触发，内部冷却3秒；目标范围260、移动上限180，不跨越地形。',
    spellPool: '卡尔当前法术池', spellRules: '每5秒随机施放一个有效法术并记忆，连续3次不能施放时2秒后重试。回响只重放最近一次，不重新随机；没有记录或有效目标时不扣蓝、不启动冷却。记忆跨波保留，新局清空。',
    volleyRules: '选择“攻击力”升级时，混沌之风与混沌陨石每次施放的数量由1→2→3成长，上限3；装备和Buff的攻击力不触发数量成长。数量跨波保留，新局重置。'
  },
  'zh-TW': {
    title: '角色圖鑑', lead: '九名目前英雄的技能與成長規則。按需展開資料，卡爾的六個法術也收錄在角色卡中。',
    skip: '跳到角色圖鑑', archive: '圖鑑', home: '圖鑑入口', heroes: '角色', equipment: '武器', monsters: '怪物', buffs: 'Buff', studio: '設計工作台', back: '返回遊戲',
    search: '搜尋角色與技能', empty: '沒有符合的角色或技能。', details: '查看技能與成長', preview: '在工作台觀察', active: '主動技能', passive: '被動技能', attributes: '初始屬性', primary: '主屬性',
    strength: '力量', agility: '敏捷', intelligence: '智力', growth: '英雄等級成長',
    growthRules: '技能按局內英雄等級分為三階，技能傷害／主動增益乘以對應倍率；裝備強化等級單獨計算。',
    growthStages: ['Lv.1～4：初始階，倍率 ×1。', 'Lv.5～9：成長階，倍率 ×1.25。', 'Lv.10+：成熟階，倍率 ×1.5。'],
    juggStages: ['Lv.1～4 · 躍空斬：一次躍斬，落地後獲得0.28秒無敵。', 'Lv.5～9 · 連環躍斬：最多連續2段，優先選擇本次尚未命中的目標。', 'Lv.10+ · 無敵斬：最多連續4段，從第一次起跳到連段結束保持無敵。'],
    juggRules: '三階都由每5次有效近戰攻擊觸發，內部冷卻3秒；目標範圍260、移動上限180，不跨越地形。',
    spellPool: '卡爾目前法術池', spellRules: '每5秒隨機施放一個有效法術並記憶，連續3次不能施放時2秒後重試。迴響只重放最近一次，不重新隨機；沒有記錄或有效目標時不扣魔、不啟動冷卻。記憶跨波保留，新局清空。',
    volleyRules: '選擇「攻擊力」升級時，混沌之風與混沌隕石每次施放的數量由1→2→3成長，上限3；裝備和Buff的攻擊力不觸發數量成長。數量跨波保留，新局重置。'
  },
  en: {
    title: 'Hero Archive', lead: 'Skills and growth rules for all nine current heroes. Expand a record when needed; Kael’s six spells are included in his card.',
    skip: 'Skip to hero archive', archive: 'Archive', home: 'Archive home', heroes: 'Heroes', equipment: 'Weapons', monsters: 'Monsters', buffs: 'Buffs', studio: 'Design studio', back: 'Back to game',
    search: 'Search heroes and skills', empty: 'No matching hero or skill.', details: 'View skills and growth', preview: 'Observe in studio', active: 'Active skill', passive: 'Passive skill', attributes: 'Starting attributes', primary: 'Primary attribute',
    strength: 'Strength', agility: 'Agility', intelligence: 'Intelligence', growth: 'Hero level growth',
    growthRules: 'Skills have three tiers based on your level in the current run. Skill damage and active boosts use the tier multiplier; equipment upgrades are separate.',
    growthStages: ['Lv.1–4: initial tier, ×1.', 'Lv.5–9: growth tier, ×1.25.', 'Lv.10+: mature tier, ×1.5.'],
    juggStages: ['Lv.1–4 · Leaping Strike: one leap, with 0.28 sec of invulnerability on landing.', 'Lv.5–9 · Chain Slash: up to 2 strikes, preferring targets not hit during this chain.', 'Lv.10+ · Omnislash: up to 4 strikes, with invulnerability from the first leap until the chain ends.'],
    juggRules: 'All tiers trigger every 5 successful melee attacks, with a 3 sec internal cooldown, 260 target range and a 180 movement limit. Leaps never cross terrain.',
    spellPool: 'Kael’s current spell pool', spellRules: 'Every 5 sec, cast and remember a random valid spell. Retry after 2 sec if all 3 attempts fail. Echo Cast replays the latest spell without a new roll. With no recorded spell or valid target, it spends no mana and starts no cooldown. The memory persists between waves and resets each run.',
    volleyRules: 'Choosing the Attack Power level-up increases Tornado and Meteor counts from 1→2→3, capped at 3 each. Attack power from equipment and buffs does not increase the count. Counts persist between waves and reset each run.'
  }
};

const list = document.getElementById('catalog-list');
const empty = document.getElementById('catalog-empty');

function textElement(tag, text, className) {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  return element;
}

function appendList(parent, entries) {
  const items = document.createElement('ul');
  entries.forEach(text => items.append(textElement('li', text)));
  parent.append(items);
}

function heroCard(character, locale) {
  const text = COPY[locale], hero = HERO_TEXT[locale][character.id];
  const card = document.createElement('article');
  card.className = 'catalog-card';
  card.id = character.id;
  const head = document.createElement('div');
  head.className = 'catalog-card-head';
  const portrait = document.createElement('img');
  portrait.src = `assets/art/dota1/heroes/${character.id}.png`;
  portrait.alt = '';
  portrait.width = 64;
  portrait.height = 64;
  portrait.loading = 'lazy';
  const identity = document.createElement('div');
  identity.append(textElement('h2', hero[0]), textElement('p', hero[2], 'catalog-meta'));
  head.append(portrait, identity);
  card.append(head);
  const details = document.createElement('details');
  details.append(textElement('summary', text.details));
  const body = document.createElement('div');
  body.className = 'catalog-detail';
  body.append(textElement('p', hero[1], 'catalog-meta'));
  body.append(textElement('h3', text.attributes));
  body.append(textElement('p', `${text.primary} · ${text[character.attributes.primary]}`, 'catalog-meta'));
  body.append(textElement('p', ['strength', 'agility', 'intelligence'].map(key => `${text[key]} ${character.attributes[key]}`).join(' · '), 'catalog-stats'));
  body.append(textElement('h3', `${text.active} · ${hero[3]}`), textElement('p', hero[4]));
  body.append(textElement('h3', `${text.passive} · ${hero[5]}`), textElement('p', hero[6]));
  body.append(textElement('h3', text.growth), textElement('p', text.growthRules));
  appendList(body, text.growthStages);
  if (character.id === 'jugg') {
    appendList(body, text.juggStages);
    body.append(textElement('p', text.juggRules));
  }
  if (character.id === 'kael') {
    body.append(textElement('h3', text.spellPool), textElement('p', text.spellRules), textElement('p', text.volleyRules));
    appendList(body, KAEL_SPELLS.map(spell => `${spell.names[locale]} · ${spell.desc[locale]}`));
  }
  const preview = textElement('a', text.preview, 'catalog-preview-link');
  preview.href = `studio.html#category=heroes&id=${character.id}&variant=idle`;
  body.append(preview);
  details.append(body);
  card.append(details);
  return card;
}

function render(locale, query = '') {
  const needle = query.trim().toLocaleLowerCase();
  const characters = CHARACTERS.filter(character => {
    const text = Object.values(HERO_TEXT).flatMap(heroes => heroes[character.id]);
    if (character.id === 'kael') text.push(...KAEL_SPELLS.flatMap(spell => [...Object.values(spell.names), ...Object.values(spell.desc)]));
    if (character.id === 'jugg') text.push(...COPY[locale].juggStages);
    return text.join(' ').toLocaleLowerCase().includes(needle);
  });
  list.replaceChildren(...characters.map(character => heroCard(character, locale)));
  empty.hidden = characters.length > 0;
}

initCatalogPage({ copy: COPY, render });
