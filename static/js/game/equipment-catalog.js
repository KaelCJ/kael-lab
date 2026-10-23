import { EQUIPMENT, EQUIPMENT_UPGRADES, resolveEquipment, equipmentUpgradeDescription, equipmentResale } from './equipment.js?v=20261017-evolution1';

// Legacy key retained so the DotaRogue rename keeps existing browser records.
const SAVE_KEY = 'kael-lab-starcore-survivor-v1';
const STAGES = ['component', 'intermediate', 'finished'];
const ITEMS = Object.entries(EQUIPMENT);
const UI = {
  'zh-CN': {
    back: '返回游戏', gameList: '选择游戏', title: '装备图鉴', lead: '从基础组件到中间件，再到成品。三个数字代表合成阶段；每件装备的 1～5 级另行标明。',
    itemCount: '件当前装备', recipeCount: '条固定配方', stageCount: '个合成阶段',
    component: '基础组件', intermediate: '中间件', finished: '成品',
    componentCount: '21 件 · 装备 1～2 级', intermediateCount: '5 件 · 装备 3 级', finishedCount: '20 件 · 装备 3～5 级',
    componentHelp: '合成路线的起点，持有时也提供自身属性。', intermediateHelp: '由组件合成，也能作为成品材料。', finishedHelp: '有的经过中间件，有的可由组件直接合成。',
    detailKicker: '装备档案 / 当前版本', priceLabel: '基础价格', routeTitle: '合成路线', usedForTitle: '可用于合成',
    detailNote: '配方是固定规则，图鉴只供查阅；实际合成需在波间商店手动完成。基础价格不等于当波商店售价。',
    rulesTitle: '合成与等级', rulesBody: '阶段表示组件、中间件、成品的关系；装备等级仍按游戏中的 1～5 级显示。合成消耗配方材料，结果装备的属性与效果替换材料效果。部分成品直接由组件合成。',
    grade: '装备 {grade} 级', direct: '直接配方：{items}', noRecipe: '基础组件没有合成配方。', noUses: '当前没有后续合成配方。', pageTitle: '装备图鉴 · DotaRogue',
    upgradeTitle: '成品装备升阶', upgradeRange: '强化 Lv.1–3', upgradeLevel: '强化 Lv.{level}',
    upgradeRules: '全部成品装备均可升阶，包括防御、鞋类和吸血类。波间商店免费手动合并：3 件同名同级成品变成 1 件高一级成品，释放 2 格。Lv.3 封顶；不同强化等级不能混用，组件和中间件不参与。',
    upgradeStats: '各级属性为单件贡献，按 1／3／9 倍保留投入；升阶保留三件材料的属性总和与总卖价。同类被动只取最强的一份。强化 Lv. 与装备基础等级、三个合成阶段分别计算。',
    upgradeBase: '固定配方合成或商店直购获得 Lv.1。', upgradeFrom: '3 件同名 Lv.{level} → 1 件 Lv.{next}',
    upgradeUnavailable: '本装备不参与三合一升阶。', upgradeResale: '卖出：{price} 材料',
    description: 'DotaRogue装备图鉴：46 件装备、25 条固定配方，以及全部成品装备的 Lv.1–3 升阶成长。'
  },
  'zh-TW': {
    back: '返回遊戲', gameList: '選擇遊戲', title: '裝備圖鑑', lead: '從基礎組件到中間件，再到成品。三個數字代表合成階段；每件裝備的 1～5 級另行標明。',
    itemCount: '件目前裝備', recipeCount: '條固定配方', stageCount: '個合成階段',
    component: '基礎組件', intermediate: '中間件', finished: '成品',
    componentCount: '21 件 · 裝備 1～2 級', intermediateCount: '5 件 · 裝備 3 級', finishedCount: '20 件 · 裝備 3～5 級',
    componentHelp: '合成路線的起點，持有時也提供自身屬性。', intermediateHelp: '由組件合成，也能作為成品材料。', finishedHelp: '有的經過中間件，有的可由組件直接合成。',
    detailKicker: '裝備檔案 / 目前版本', priceLabel: '基礎價格', routeTitle: '合成路線', usedForTitle: '可用於合成',
    detailNote: '配方是固定規則，圖鑑僅供查閱；實際合成需在波間商店手動完成。基礎價格不等於當波商店售價。',
    rulesTitle: '合成與等級', rulesBody: '階段表示組件、中間件、成品的關係；裝備等級仍按遊戲中的 1～5 級顯示。合成消耗配方材料，結果裝備的屬性與效果取代材料效果。部分成品直接由組件合成。',
    grade: '裝備 {grade} 級', direct: '直接配方：{items}', noRecipe: '基礎組件沒有合成配方。', noUses: '目前沒有後續合成配方。', pageTitle: '裝備圖鑑 · DotaRogue',
    upgradeTitle: '成品裝備升階', upgradeRange: '強化 Lv.1–3', upgradeLevel: '強化 Lv.{level}',
    upgradeRules: '全部成品裝備均可升階，包括防禦、鞋類和吸血類。波間商店免費手動合併：3 件同名同級成品變成 1 件高一級成品，釋放 2 格。Lv.3 封頂；不同強化等級不能混用，組件和中間件不參與。',
    upgradeStats: '各級屬性為單件貢獻，按 1／3／9 倍保留投入；升階保留三件材料的屬性總和與總賣價。同類被動只取最強的一份。強化 Lv. 與裝備基礎等級、三個合成階段分別計算。',
    upgradeBase: '固定配方合成或商店直購獲得 Lv.1。', upgradeFrom: '3 件同名 Lv.{level} → 1 件 Lv.{next}',
    upgradeUnavailable: '本裝備不參與三合一升階。', upgradeResale: '賣出：{price} 材料',
    description: 'DotaRogue裝備圖鑑：46 件裝備、25 條固定配方，以及全部成品裝備的 Lv.1–3 升階成長。'
  },
  en: {
    back: 'Back to game', gameList: 'Choose a game', title: 'Equipment Archive', lead: 'Follow components into intermediate items and finished gear. The three numbers mark crafting stages; each item keeps its actual grade from 1 to 5.',
    itemCount: 'current items', recipeCount: 'fixed recipes', stageCount: 'crafting stages',
    component: 'Components', intermediate: 'Intermediate', finished: 'Finished gear',
    componentCount: '21 items · grades 1–2', intermediateCount: '5 items · grade 3', finishedCount: '20 items · grades 3–5',
    componentHelp: 'The start of a crafting route, with useful stats of their own.', intermediateHelp: 'Crafted from components and used in finished gear.', finishedHelp: 'Some use intermediate items; others use components directly.',
    detailKicker: 'ITEM RECORD / CURRENT BUILD', priceLabel: 'Base price', routeTitle: 'Crafting route', usedForTitle: 'Used to craft',
    detailNote: 'These are fixed recipes for reference. Crafting is done manually in the between-wave shop. Base price is not the current shop price.',
    rulesTitle: 'Crafting and grades', rulesBody: 'Stages describe components, intermediate items and finished gear. Actual item grades still run from 1 to 5. Crafting consumes the listed ingredients, and the result replaces their stats and effects. Some finished gear is made directly from components.',
    grade: 'Grade {grade}', direct: 'Direct recipe: {items}', noRecipe: 'Components have no crafting recipe.', noUses: 'No further recipe currently uses this item.', pageTitle: 'Equipment Archive · DotaRogue',
    upgradeTitle: 'Finished gear upgrades', upgradeRange: 'Upgrade Lv.1–3', upgradeLevel: 'Upgrade Lv.{level}',
    upgradeRules: 'All finished gear can upgrade, including defensive, footwear and lifesteal items. In the between-wave shop, manually merge 3 copies of the same item at the same level into 1 at the next level for free, opening 2 slots. Lv.3 is the maximum; mixed levels, components and intermediate items cannot merge this way.',
    upgradeStats: 'Stats are per item, scaled by 1 / 3 / 9 to preserve your investment. Merging keeps the three inputs’ total stats and resale value. Only the strongest passive of each type applies. Upgrade levels are separate from item grades and the three crafting stages.',
    upgradeBase: 'Crafting recipes and direct shop purchases provide Lv.1.', upgradeFrom: '3 matching Lv.{level} copies → 1 Lv.{next}',
    upgradeUnavailable: 'This item cannot merge for an upgrade.', upgradeResale: 'Sell: {price} materials',
    description: 'DotaRogue equipment archive: 46 items, 25 fixed recipes, and Lv.1–3 upgrades for all finished gear.'
  }
};

function savedLocale() {
  try {
    const value = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}')?.settings?.locale;
    return UI[value] ? value : 'zh-CN';
  } catch { return 'zh-CN'; }
}

function saveLocale(value) {
  try {
    const stored = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    const save = stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
    save.settings = { ...(save.settings && typeof save.settings === 'object' ? save.settings : {}), locale: value };
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch { /* Browsing the archive still works when storage is unavailable. */ }
}

let locale = savedLocale();
let selectedId = 'mjollnir';
const $ = id => document.getElementById(id);
const copy = key => UI[locale][key];
const name = id => EQUIPMENT[id][locale === 'en' ? 'nameEn' : locale === 'zh-TW' ? 'nameTw' : 'name'];
const description = id => EQUIPMENT[id][locale === 'en' ? 'descEn' : locale === 'zh-TW' ? 'descTw' : 'desc'];
const grade = id => copy('grade').replace('{grade}', EQUIPMENT[id].grade);

function itemButton(id, className) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.dataset.itemId = id;
  const icon = document.createElement('img');
  icon.src = `art/pixel/equipment-${id}.svg`;
  icon.alt = '';
  icon.width = 46;
  icon.height = 46;
  const label = document.createElement('span');
  label.className = className === 'item-card' ? 'item-copy' : '';
  const title = document.createElement('strong');
  title.textContent = name(id);
  label.append(title);
  if (className === 'item-card') {
    const level = document.createElement('small');
    level.textContent = grade(id);
    label.append(level);
    if (EQUIPMENT_UPGRADES[id]) {
      const upgrade = document.createElement('small');
      upgrade.className = 'upgrade-marker';
      upgrade.textContent = copy('upgradeRange');
      label.append(upgrade);
    }
    button.setAttribute('aria-pressed', String(id === selectedId));
  }
  button.append(icon, label);
  return button;
}

function routeStep(kind, ids) {
  const step = document.createElement('div');
  step.className = 'route-step';
  const title = document.createElement('span');
  title.textContent = `${STAGES.indexOf(kind) + 1} · ${copy(kind)}`;
  const items = document.createElement('div');
  items.className = 'route-items';
  ids.forEach(id => items.append(itemButton(id, 'route-item')));
  step.append(title, items);
  return step;
}

function recipePath(id) {
  const components = [];
  const intermediates = [];
  function collect(itemId) {
    const item = EQUIPMENT[itemId];
    if (item.kind === 'component') { components.push(itemId); return; }
    item.recipe.forEach(collect);
    if (item.kind === 'intermediate') intermediates.push(itemId);
  }
  collect(id);
  return { components, intermediates };
}

function renderDetail() {
  const item = resolveEquipment(selectedId);
  $('detail-icon').src = `art/pixel/equipment-${selectedId}.svg`;
  $('detail-stage').textContent = `${STAGES.indexOf(item.kind) + 1} · ${copy(item.kind)}`;
  $('detail-title').textContent = name(selectedId);
  $('detail-grade').textContent = EQUIPMENT_UPGRADES[selectedId] ? `${grade(selectedId)} · ${copy('upgradeLevel').replace('{level}', 1)}` : grade(selectedId);
  $('detail-description').textContent = description(selectedId);
  $('detail-price').textContent = String(item.price);

  const upgrades = $('detail-upgrades');
  upgrades.replaceChildren();
  if (EQUIPMENT_UPGRADES[selectedId]) {
    const levels = document.createElement('ol');
    levels.className = 'upgrade-levels';
    for (const level of [1, 2, 3]) {
      const upgraded = resolveEquipment({ id: selectedId, level });
      const row = document.createElement('li');
      row.className = 'upgrade-level';
      const heading = document.createElement('h4');
      heading.textContent = copy('upgradeLevel').replace('{level}', upgraded.level);
      const source = document.createElement('p');
      source.className = 'upgrade-source';
      source.textContent = level === 1 ? copy('upgradeBase') : copy('upgradeFrom').replace('{level}', level - 1).replace('{next}', level);
      const stats = document.createElement('p');
      stats.textContent = equipmentUpgradeDescription({ id: selectedId, level }, locale);
      const resale = document.createElement('p');
      resale.className = 'upgrade-resale';
      resale.textContent = copy('upgradeResale').replace('{price}', equipmentResale({ id: selectedId, level }));
      row.append(heading, source, stats, resale);
      levels.append(row);
    }
    upgrades.append(levels);
  } else {
    const unavailable = document.createElement('p');
    unavailable.className = 'route-empty';
    unavailable.textContent = copy('upgradeUnavailable');
    upgrades.append(unavailable);
  }

  const route = $('detail-route');
  route.replaceChildren();
  const path = recipePath(selectedId);
  if (path.components.length) route.append(routeStep('component', path.components));
  if (path.intermediates.length) route.append(routeStep('intermediate', path.intermediates));
  if (item.kind === 'finished') route.append(routeStep('finished', [selectedId]));
  if (item.recipe) {
    const direct = document.createElement('p');
    direct.className = 'direct-recipe';
    direct.textContent = copy('direct').replace('{items}', item.recipe.map(name).join(' + '));
    route.append(direct);
  } else {
    const noRecipe = document.createElement('p');
    noRecipe.className = 'route-empty';
    noRecipe.textContent = copy('noRecipe');
    route.append(noRecipe);
  }

  const uses = $('detail-uses');
  uses.replaceChildren();
  const next = ITEMS.filter(([, def]) => def.recipe?.includes(selectedId)).map(([id]) => id);
  if (next.length) next.forEach(id => uses.append(itemButton(id, 'route-item')));
  else {
    const empty = document.createElement('p');
    empty.className = 'route-empty';
    empty.textContent = copy('noUses');
    uses.append(empty);
  }
  document.querySelectorAll('.item-card').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.itemId === selectedId)));
}

function render() {
  document.documentElement.lang = locale;
  document.title = copy('pageTitle');
  document.querySelector('meta[name="description"]').content = copy('description');
  document.querySelectorAll('[data-copy]').forEach(element => { element.textContent = copy(element.dataset.copy); });
  document.querySelectorAll('[data-locale]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.locale === locale)));
  for (const stage of STAGES) {
    const list = $(`${stage}-list`);
    list.replaceChildren(...ITEMS.filter(([, item]) => item.kind === stage).map(([id]) => itemButton(id, 'item-card')));
  }
  renderDetail();
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-item-id]');
  if (!button) return;
  selectedId = button.dataset.itemId;
  renderDetail();
  if (event.detail > 0 && !button.closest('.detail-panel') && matchMedia('(max-width: 900px)').matches) $('detail-panel').scrollIntoView({ block: 'start' });
});
document.querySelectorAll('[data-locale]').forEach(button => button.addEventListener('click', () => {
  locale = button.dataset.locale;
  saveLocale(locale);
  render();
}));

render();
