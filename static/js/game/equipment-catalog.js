import { EQUIPMENT, EQUIPMENT_UPGRADES, resolveEquipment, equipmentUpgradeDescription, equipmentResale } from './equipment.js?v=20261026-restore1';
import { EQUIPMENT_BUILDS, equipmentBuilds, buildName, buildDescription } from './equipment-builds.js?v=20261026-restore1';

// Legacy key retained so the DotaRogue rename keeps existing browser records.
const SAVE_KEY = 'kael-lab-starcore-survivor-v1';
const STAGES = ['component', 'intermediate', 'finished'];
const ITEMS = Object.entries(EQUIPMENT);
const UI = {
  'zh-CN': {
    back: '返回游戏', gameList: '选择游戏', title: '装备图鉴', lead: '从基础组件到中间件，再到成品。三个数字代表合成阶段；每件装备的 1～5 级另行标明。',
    itemCount: '件当前装备', recipeCount: '条固定配方', stageCount: '个合成阶段',
    component: '基础组件', intermediate: '中间件', finished: '成品',
    componentCount: '21 件 · 装备 1～2 级', intermediateCount: '5 件 · 装备 3 级', finishedCount: '23 件 · 装备 3～5 级',
    componentHelp: '合成路线的起点，持有时也提供自身属性。', intermediateHelp: '由组件合成，也能作为成品材料。', finishedHelp: '有的经过中间件，有的可由组件直接合成。',
    detailKicker: '装备档案 / 当前版本', priceLabel: '基础价格', routeTitle: '合成路线', usedForTitle: '可用于合成',
    detailNote: '图鉴只供查阅。波间商店可手动合成，也可追踪目标自动合成；基础价格不等于当波商店售价。',
    rulesTitle: '合成与等级', rulesBody: '阶段表示组件、中间件、成品的关系；装备等级仍按游戏中的 1～5 级显示。合成消耗配方材料，结果装备的属性与效果替换材料效果。部分成品直接由组件合成。',
    grade: '装备 {grade} 级', direct: '直接配方：{items}', noRecipe: '基础组件没有合成配方。', noUses: '当前没有后续合成配方。', pageTitle: '装备图鉴 · DotaRogue',
    upgradeTitle: '成品装备升阶', upgradeRange: '强化 Lv.1–3', upgradeLevel: '强化 Lv.{level}',
    upgradeRules: '全部成品均可免费三合一：3 件同名同级变成 1 件高一级，最高 Lv.3。默认自动升阶，也保留手动入口和关闭开关；生效与储备共同取料。不同等级不能混用，组件与中间件不参与。',
    upgradeStats: '各级属性为单件贡献，按 1／3／9 倍保留投入；升阶保留三件材料的属性总和与总卖价。同类被动只取最强的一份。强化 Lv. 与装备基础等级、三个合成阶段分别计算。',
    upgradeBase: '固定配方合成或商店直购获得 Lv.1。', upgradeFrom: '3 件同名 Lv.{level} → 1 件 Lv.{next}',
    upgradeUnavailable: '本装备不参与三合一升阶。', upgradeResale: '卖出：{price} 材料',
    description: 'DotaRogue装备图鉴：49 件装备、28 条固定配方、23 件成品三级成长，以及风怒、顺劈、激励、元素、吸血、圣盾六类装备羁绊。',
    qualityGrades: ['', '普通', '精良', '稀有', '史诗', '传说'], buildsTitle: '装备羁绊', buildsJump: '查看六类羁绊与搭配装备',
    buildsRules: '六类羁绊按各卡片的件数门槛激活两档效果。生效格内不同成品各计 1 件，同名重复、强化等级与储备不增加计数。22 件成品各有一至两个羁绊，三合一不减少同名贡献；相位鞋是无羁绊的独立机动成品。点击成员可查看详情与配方。',
    buildThresholds: '{counts} 件激活', buildMembers: '搭配成员（点击查看详情）',
    noBuild: '组件与中间件不参与羁绊。', independentBuild: '独立机动成品，无装备羁绊。冲刺后提高移速，并强化下一次有效普攻。', sourceTitle: '素材与改编',
    sourceBody: '装备名称参考 DotA；风怒、顺劈、激励、吸血、圣盾等词义参考炉石／魔兽的熟悉表达，元素按装备提供的雷、火、冰轮转。羁绊的装备归属、门槛、配方、效果和数值均为本作改编，不表示原版物品自带这些效果。金箍棒、陨星锤与圣剑图标为本仓库独立绘制的 32×32 可编辑 SVG，沿用现有像素图标系统；未引入第三方图片、模型或 AI 位图。',
    keywordSource: '关键词词义参考：炉石新手关键词表'
  },
  'zh-TW': {
    back: '返回遊戲', gameList: '選擇遊戲', title: '裝備圖鑑', lead: '從基礎組件到中間件，再到成品。三個數字代表合成階段；每件裝備的 1～5 級另行標明。',
    itemCount: '件目前裝備', recipeCount: '條固定配方', stageCount: '個合成階段',
    component: '基礎組件', intermediate: '中間件', finished: '成品',
    componentCount: '21 件 · 裝備 1～2 級', intermediateCount: '5 件 · 裝備 3 級', finishedCount: '23 件 · 裝備 3～5 級',
    componentHelp: '合成路線的起點，持有時也提供自身屬性。', intermediateHelp: '由組件合成，也能作為成品材料。', finishedHelp: '有的經過中間件，有的可由組件直接合成。',
    detailKicker: '裝備檔案 / 目前版本', priceLabel: '基礎價格', routeTitle: '合成路線', usedForTitle: '可用於合成',
    detailNote: '圖鑑僅供查閱。波間商店可手動合成，也可追蹤目標自動合成；基礎價格不等於當波商店售價。',
    rulesTitle: '合成與等級', rulesBody: '階段表示組件、中間件、成品的關係；裝備等級仍按遊戲中的 1～5 級顯示。合成消耗配方材料，結果裝備的屬性與效果取代材料效果。部分成品直接由組件合成。',
    grade: '裝備 {grade} 級', direct: '直接配方：{items}', noRecipe: '基礎組件沒有合成配方。', noUses: '目前沒有後續合成配方。', pageTitle: '裝備圖鑑 · DotaRogue',
    upgradeTitle: '成品裝備升階', upgradeRange: '強化 Lv.1–3', upgradeLevel: '強化 Lv.{level}',
    upgradeRules: '全部成品均可免費三合一：3 件同名同級變成 1 件高一級，最高 Lv.3。預設自動升階，也保留手動入口和關閉開關；生效與儲備共同取料。不同等級不能混用，組件與中間件不參與。',
    upgradeStats: '各級屬性為單件貢獻，按 1／3／9 倍保留投入；升階保留三件材料的屬性總和與總賣價。同類被動只取最強的一份。強化 Lv. 與裝備基礎等級、三個合成階段分別計算。',
    upgradeBase: '固定配方合成或商店直購獲得 Lv.1。', upgradeFrom: '3 件同名 Lv.{level} → 1 件 Lv.{next}',
    upgradeUnavailable: '本裝備不參與三合一升階。', upgradeResale: '賣出：{price} 材料',
    description: 'DotaRogue裝備圖鑑：49 件裝備、28 條固定配方、23 件成品三級成長，以及風怒、順劈、激勵、元素、吸血、聖盾六類裝備羈絆。',
    qualityGrades: ['', '普通', '精良', '稀有', '史詩', '傳說'], buildsTitle: '裝備羈絆', buildsJump: '查看六類羈絆與搭配裝備',
    buildsRules: '六類羈絆按各卡片的件數門檻啟用兩檔效果。生效格內不同成品各計 1 件，同名重複、強化等級與儲備不增加計數。22 件成品各有一至兩個羈絆，三合一不減少同名貢獻；相位鞋是無羈絆的獨立機動成品。點擊成員可查看詳情與配方。',
    buildThresholds: '{counts} 件啟用', buildMembers: '搭配成員（點擊查看詳情）',
    noBuild: '組件與中間件不參與羈絆。', independentBuild: '獨立機動成品，無裝備羈絆。衝刺後提高移速，並強化下一次有效普攻。', sourceTitle: '素材與改編',
    sourceBody: '裝備名稱參考 DotA；風怒、順劈、激勵、吸血、聖盾等詞義參考爐石／魔獸的熟悉表達，元素按裝備提供的雷、火、冰輪轉。羈絆的裝備歸屬、門檻、配方、效果和數值均為本作改編，不表示原版物品自帶這些效果。金箍棒、隕星錘與聖劍圖示為本倉庫獨立繪製的 32×32 可編輯 SVG，沿用既有像素圖示系統；未引入第三方圖片、模型或 AI 點陣圖。',
    keywordSource: '關鍵字詞義參考：爐石新手關鍵字表'
  },
  en: {
    back: 'Back to game', gameList: 'Choose a game', title: 'Equipment Archive', lead: 'Follow components into intermediate items and finished gear. The three numbers mark crafting stages; each item keeps its actual grade from 1 to 5.',
    itemCount: 'current items', recipeCount: 'fixed recipes', stageCount: 'crafting stages',
    component: 'Components', intermediate: 'Intermediate', finished: 'Finished gear',
    componentCount: '21 items · grades 1–2', intermediateCount: '5 items · grade 3', finishedCount: '23 items · grades 3–5',
    componentHelp: 'The start of a crafting route, with useful stats of their own.', intermediateHelp: 'Crafted from components and used in finished gear.', finishedHelp: 'Some use intermediate items; others use components directly.',
    detailKicker: 'ITEM RECORD / CURRENT BUILD', priceLabel: 'Base price', routeTitle: 'Crafting route', usedForTitle: 'Used to craft',
    detailNote: 'For reference only. Craft manually in the between-wave shop or track a target for automatic crafting. Base price is not the current shop price.',
    rulesTitle: 'Crafting and grades', rulesBody: 'Stages describe components, intermediate items and finished gear. Actual item grades still run from 1 to 5. Crafting consumes the listed ingredients, and the result replaces their stats and effects. Some finished gear is made directly from components.',
    grade: 'Grade {grade}', direct: 'Direct recipe: {items}', noRecipe: 'Components have no crafting recipe.', noUses: 'No further recipe currently uses this item.', pageTitle: 'Equipment Archive · DotaRogue',
    upgradeTitle: 'Finished gear upgrades', upgradeRange: 'Upgrade Lv.1–3', upgradeLevel: 'Upgrade Lv.{level}',
    upgradeRules: 'All finished gear can merge for free: 3 matching copies at the same level become 1 at the next, up to Lv.3. Automatic merging is on by default; manual controls and an off switch remain. Active and reserve items can supply the inputs. Mixed levels, components and intermediate items cannot merge this way.',
    upgradeStats: 'Stats are per item, scaled by 1 / 3 / 9 to preserve your investment. Merging keeps the three inputs’ total stats and resale value. Only the strongest passive of each type applies. Upgrade levels are separate from item grades and the three crafting stages.',
    upgradeBase: 'Crafting recipes and direct shop purchases provide Lv.1.', upgradeFrom: '3 matching Lv.{level} copies → 1 Lv.{next}',
    upgradeUnavailable: 'This item cannot merge for an upgrade.', upgradeResale: 'Sell: {price} materials',
    description: 'DotaRogue equipment archive: 49 items, 28 fixed recipes, 23 finished items with three upgrade levels, and six synergies: Windfury, Cleave, Inspire, Elemental, Lifesteal and Divine Shield.',
    qualityGrades: ['', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'], buildsTitle: 'Equipment synergies', buildsJump: 'Explore six synergies and their equipment',
    buildsRules: 'Each synergy has two tiers at the item counts shown on its card. Each distinct active finished item counts once; duplicate copies, upgrade levels and reserve items add no count. 22 finished items have one or two synergies, and merging copies keeps their single contribution. Phase Boots are independent mobility gear with no synergy. Select a member to see its details and recipe.',
    buildThresholds: '{counts} items to activate', buildMembers: 'Equipment members (select for details)',
    noBuild: 'Components and intermediate items do not count toward synergies.', independentBuild: 'Independent mobility gear with no equipment synergy. Its post-dash speed and next-basic enhancement stand on their own.', sourceTitle: 'Artwork and adaptation',
    sourceBody: 'Item names reference DotA. Terms such as Windfury, Cleave, Inspire, Lifesteal and Divine Shield use familiar Hearthstone / Warcraft meanings; Elemental rotates lightning, fire and frost supplied by your gear. Membership, thresholds, recipes, effects and values are adapted for this game, not claims about the original items. The Monkey King Bar, Meteor Hammer and Divine Rapier icons are original editable 32×32 SVGs made for this repository in its existing pixel icon style. No third-party images, models or AI bitmaps were imported.',
    keywordSource: 'Keyword meanings: Hearthstone beginner keyword reference'
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
const grade = id => `${copy('qualityGrades')[EQUIPMENT[id].grade]} · ${copy('grade').replace('{grade}', EQUIPMENT[id].grade)}`;

function itemButton(id, className) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.dataset.itemId = id;
  button.dataset.grade = EQUIPMENT[id].grade;
  button.dataset.upgradeLevel = EQUIPMENT_UPGRADES[id] ? 1 : 0;
  button.setAttribute('aria-controls', 'detail-panel');
  button.setAttribute('aria-pressed', String(id === selectedId));
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
    const summary = document.createElement('span');
    summary.className = 'equipment-summary';
    const level = document.createElement('small');
    level.className = 'equipment-quality';
    level.textContent = grade(id);
    summary.append(level);
    if (EQUIPMENT_UPGRADES[id]) {
      const upgrade = document.createElement('small');
      upgrade.className = 'equipment-level';
      upgrade.textContent = copy('upgradeRange');
      summary.append(upgrade);
    }
    for (const build of equipmentBuilds(id)) {
      const tag = document.createElement('small');
      tag.className = 'equipment-build-tag';
      tag.textContent = buildName(build, locale);
      summary.append(tag);
    }
    label.append(summary);
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

function buildCard(build) {
  const card = document.createElement('article');
  card.className = 'build-card';
  const title = document.createElement('strong');
  const counts = build.thresholds.join(locale === 'en' ? ' / ' : '／');
  title.textContent = `${buildName(build.id, locale)} · ${copy('buildThresholds').replace('{counts}', counts)}`;
  const text = document.createElement('p');
  text.textContent = buildDescription(build.id, locale);
  const label = document.createElement('p');
  label.textContent = copy('buildMembers');
  const members = document.createElement('div');
  members.className = 'route-items';
  members.dataset.buildMembers = build.id;
  members.setAttribute('role', 'group');
  members.setAttribute('aria-label', `${buildName(build.id, locale)} · ${copy('buildMembers')}`);
  for (const [id] of ITEMS.filter(([id]) => equipmentBuilds(id).includes(build.id))) {
    members.append(itemButton(id, 'route-item'));
  }
  card.append(title, text, label, members);
  return card;
}

function renderDetail() {
  const item = resolveEquipment(selectedId);
  $('detail-icon').src = `art/pixel/equipment-${selectedId}.svg`;
  $('detail-stage').textContent = `${STAGES.indexOf(item.kind) + 1} · ${copy(item.kind)}`;
  $('detail-title').textContent = name(selectedId);
  $('detail-panel').dataset.grade = item.grade;
  $('detail-panel').dataset.upgradeLevel = EQUIPMENT_UPGRADES[selectedId] ? 1 : 0;
  const summary = $('detail-grade');
  summary.className = 'equipment-summary';
  const quality = document.createElement('span');
  quality.className = 'equipment-quality';
  quality.textContent = grade(selectedId);
  summary.replaceChildren(quality);
  if (EQUIPMENT_UPGRADES[selectedId]) {
    const level = document.createElement('span');
    level.className = 'equipment-level';
    level.textContent = copy('upgradeLevel').replace('{level}', 1);
    summary.append(level);
  }
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
      row.dataset.grade = item.grade;
      row.dataset.upgradeLevel = level;
      const heading = document.createElement('h4');
      heading.textContent = copy('upgradeLevel').replace('{level}', upgraded.level);
      heading.className = 'equipment-level';
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

  const builds = $('detail-builds');
  builds.replaceChildren();
  const classes = equipmentBuilds(selectedId);
  if (!classes.length) {
    const empty = document.createElement('p');
    empty.textContent = copy(item.kind === 'finished' ? 'independentBuild' : 'noBuild');
    builds.append(empty);
  }
  for (const id of classes) {
    builds.append(buildCard(EQUIPMENT_BUILDS.find(build => build.id === id)));
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
  document.querySelectorAll('[data-item-id]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.itemId === selectedId)));
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
  const builds = $('build-list');
  builds.replaceChildren(...EQUIPMENT_BUILDS.map(buildCard));
  renderDetail();
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-item-id]');
  if (!button) return;
  const fromBuildMembers = Boolean(button.closest('[data-build-members]'));
  selectedId = button.dataset.itemId;
  renderDetail();
  if (fromBuildMembers) {
    $('detail-panel').scrollTop = 0;
    $('detail-title').focus({ preventScroll: true });
    $('detail-panel').scrollIntoView({ block: 'start' });
  } else if (event.detail > 0 && !button.closest('.detail-panel') && matchMedia('(max-width: 900px)').matches) $('detail-panel').scrollIntoView({ block: 'start' });
});
document.querySelectorAll('[data-locale]').forEach(button => button.addEventListener('click', () => {
  locale = button.dataset.locale;
  saveLocale(locale);
  render();
}));

render();
