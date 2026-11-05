import { BUFFS, BUFF_IDS } from './buffs.js?v=20261031-positive1-tree-attributes1';
import { JUNGLE_BUFFS } from './jungle-buffs.js?v=20261105-catalog1';
import { initCatalogPage } from './catalog-ui.js?v=20261105-catalog1';

const COPY = {
  'zh-CN': {
    title: 'Buff图鉴', lead: '27件永久增益与3种野区限时增益。永久增益按购买层数叠加；野区增益从经典战场的目标获得，按战斗时间计时。',
    skip: '跳到Buff图鉴', archive: '图鉴', home: '图鉴入口', heroes: '角色', equipment: '武器', monsters: '怪物', buffs: 'Buff', studio: '设计工作台', back: '返回游戏',
    search: '搜索Buff与效果', empty: '没有匹配的Buff。', details: '查看效果与叠层规则', preview: '在工作台观察', basePrice: '基础价格', materials: '材料', common: '普通', rare: '稀有', epic: '史诗', legendary: '传说',
    repeat: '可重复购买；同名按购买层数叠加。具体上限、时段与触发条件以单件效果为准。', priceNote: '基础价格用于对照；实际购买价格以当波商店为准。',
    permanent: '永久增益', jungle: '野区限时增益', jungleDetails: '查看来源与效果', source: '获取来源', duration: '持续时间', seconds: '秒',
    jungleSources: { red: '在DotA经典战场击杀红Buff野怪。', blue: '在DotA经典战场击杀蓝Buff野怪。', roshan: '在DotA经典战场击杀肉山。' },
    jungleTiming: '只消耗战斗时间，暂停与波间菜单冻结倒计时。再次获得同种增益时，从当前时刻重新计满持续时间，不叠加效果或累加剩余时间；不同种增益可同时持有。'
  },
  'zh-TW': {
    title: 'Buff圖鑑', lead: '27件永久增益與3種野區限時增益。永久增益按購買層數疊加；野區增益從經典戰場的目標獲得，按戰鬥時間計時。',
    skip: '跳到Buff圖鑑', archive: '圖鑑', home: '圖鑑入口', heroes: '角色', equipment: '武器', monsters: '怪物', buffs: 'Buff', studio: '設計工作台', back: '返回遊戲',
    search: '搜尋Buff與效果', empty: '沒有符合的Buff。', details: '查看效果與疊層規則', preview: '在工作台觀察', basePrice: '基礎價格', materials: '材料', common: '普通', rare: '稀有', epic: '史詩', legendary: '傳說',
    repeat: '可重複購買；同名按購買層數疊加。具體上限、時段與觸發條件以單件效果為準。', priceNote: '基礎價格用於對照；實際購買價格以當波商店為準。',
    permanent: '永久增益', jungle: '野區限時增益', jungleDetails: '查看來源與效果', source: '獲取來源', duration: '持續時間', seconds: '秒',
    jungleSources: { red: '在DotA經典戰場擊殺紅Buff野怪。', blue: '在DotA經典戰場擊殺藍Buff野怪。', roshan: '在DotA經典戰場擊殺肉山。' },
    jungleTiming: '只消耗戰鬥時間，暫停與波間選單凍結倒數。再次獲得同種增益時，從目前時刻重新計滿持續時間，不疊加效果或累加剩餘時間；不同種增益可同時持有。'
  },
  en: {
    title: 'Buff Archive', lead: '27 permanent buffs and 3 timed jungle buffs. Purchases add permanent stacks; jungle objectives on the classic battlefield grant buffs that use combat time.',
    skip: 'Skip to buff archive', archive: 'Archive', home: 'Archive home', heroes: 'Heroes', equipment: 'Weapons', monsters: 'Monsters', buffs: 'Buffs', studio: 'Design studio', back: 'Back to game',
    search: 'Search buffs and effects', empty: 'No matching buff.', details: 'View effects and stacking rules', preview: 'Observe in studio', basePrice: 'Base price', materials: 'materials', common: 'Common', rare: 'Rare', epic: 'Epic', legendary: 'Legendary',
    repeat: 'Repeat purchases add stacks of the same buff. Individual effects define their own caps, timing and trigger conditions.', priceNote: 'Base prices are for comparison. The current shop shows the actual purchase price.',
    permanent: 'Permanent buff', jungle: 'Timed jungle buff', jungleDetails: 'View source and effect', source: 'Source', duration: 'Duration', seconds: 'sec',
    jungleSources: { red: 'Defeat the Red Buff neutral on the DotA Classic battlefield.', blue: 'Defeat the Blue Buff neutral on the DotA Classic battlefield.', roshan: 'Defeat Roshan on the DotA Classic battlefield.' },
    jungleTiming: 'Only combat time counts down; pause and between-wave menus freeze the timer. Gaining the same buff again resets its full duration from that moment, without stacking effects or adding remaining time. Different jungle buffs can coexist.'
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

function buffCard(id, locale) {
  const def = BUFFS[id], text = COPY[locale];
  const card = document.createElement('article');
  card.className = 'catalog-card';
  card.id = id;
  card.dataset.buffKind = 'permanent';
  card.dataset.rarity = def.rarity;
  const head = document.createElement('div');
  head.className = 'catalog-card-head';
  const icon = document.createElement('img');
  icon.src = def.icon;
  icon.alt = '';
  icon.width = 48;
  icon.height = 48;
  icon.loading = 'lazy';
  const identity = document.createElement('div');
  const name = locale === 'en' ? def.nameEn : locale === 'zh-TW' ? def.nameTw : def.name;
  identity.append(textElement('h2', name), textElement('p', `${text.permanent} · ${text[def.rarity]}`, 'catalog-meta'));
  head.append(icon, identity);
  card.append(head);
  const details = document.createElement('details');
  details.append(textElement('summary', text.details));
  const body = document.createElement('div');
  body.className = 'catalog-detail';
  const description = locale === 'en' ? def.descEn : locale === 'zh-TW' ? def.descTw : def.desc;
  body.append(textElement('p', description), textElement('p', `${text.basePrice} · ${def.price} ${text.materials}`, 'catalog-stats'), textElement('p', text.repeat), textElement('p', text.priceNote, 'catalog-meta'));
  const preview = textElement('a', text.preview, 'catalog-preview-link');
  preview.href = `studio.html#category=buffs&id=${id}`;
  body.append(preview);
  details.append(body);
  card.append(details);
  return card;
}

function jungleBuffCard(id, locale) {
  const def = JUNGLE_BUFFS[id], text = COPY[locale];
  const card = document.createElement('article');
  card.className = 'catalog-card';
  card.id = `jungle-${id}`;
  card.dataset.buffKind = 'jungle';
  const head = document.createElement('div');
  head.className = 'catalog-card-head';
  const identity = document.createElement('div');
  identity.append(textElement('h2', def.name[locale]), textElement('p', `${text.jungle} · ${def.duration} ${text.seconds}`, 'catalog-meta'));
  head.append(identity);
  card.append(head);
  const details = document.createElement('details');
  details.append(textElement('summary', text.jungleDetails));
  const body = document.createElement('div');
  body.className = 'catalog-detail';
  body.append(textElement('h3', text.source), textElement('p', text.jungleSources[id]));
  body.append(textElement('p', `${text.duration} · ${def.duration} ${text.seconds}`, 'catalog-stats'));
  body.append(textElement('p', def.desc[locale]), textElement('p', text.jungleTiming));
  details.append(body);
  card.append(details);
  return card;
}

function render(locale, query = '') {
  const needle = query.trim().toLocaleLowerCase();
  const ids = BUFF_IDS.filter(id => {
    const def = BUFFS[id];
    return [def.name, def.nameTw, def.nameEn, def.desc, def.descTw, def.descEn, COPY[locale][def.rarity], ...Object.values(COPY).map(text => text.permanent)].join(' ').toLocaleLowerCase().includes(needle);
  });
  const jungleIds = Object.keys(JUNGLE_BUFFS).filter(id => {
    const def = JUNGLE_BUFFS[id];
    const terms = [...Object.values(def.name), ...Object.values(def.desc), ...Object.values(COPY).flatMap(text => [text.jungle, text.jungleSources[id], text.jungleTiming])];
    return terms.join(' ').toLocaleLowerCase().includes(needle);
  });
  list.replaceChildren(...jungleIds.map(id => jungleBuffCard(id, locale)), ...ids.map(id => buffCard(id, locale)));
  empty.hidden = ids.length + jungleIds.length > 0;
}

initCatalogPage({ copy: COPY, render });
