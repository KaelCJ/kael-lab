import { EQUIPMENT, EQUIPMENT_UPGRADES, equipmentIconPath, resolveEquipment, equipmentUpgradeDescription, equipmentResale } from './equipment.js?v=20261030-equipment17';
import { EQUIPMENT_BUILDS, equipmentBuilds, buildName, buildDescription } from './equipment-builds.js?v=20261030-equipment17';
import { attributeSummary } from './hero-attributes.js?v=20261029-attributes1';

// Legacy key retained so the DotaRogue rename keeps existing browser records.
const SAVE_KEY = 'kael-lab-starcore-survivor-v1';
const STAGES = ['component', 'intermediate', 'finished'];
const ITEMS = Object.entries(EQUIPMENT);
const UI = {
  'zh-CN': {
    back: '返回游戏', gameList: '选择游戏', title: '装备图鉴', lead: '从基础组件到中间件，再到成品。三个数字代表合成阶段；每件装备的 1～5 级另行标明。',
    itemCount: '件当前装备', recipeCount: '条固定配方', stageCount: '个合成阶段',
    component: '基础组件', intermediate: '中间件', finished: '成品',
    componentCount: '21 件 · 装备 1～2 级', intermediateCount: '5 件 · 装备 3 级', finishedCount: '48 件 · 装备 3～5 级',
    componentHelp: '合成路线的起点，持有时也提供自身属性。', intermediateHelp: '由组件合成，也能作为成品材料。', finishedHelp: '有的经过中间件，有的可由组件直接合成。',
    detailKicker: '装备档案 / 当前版本', priceLabel: '基础价格', routeTitle: '合成路线', usedForTitle: '可用于合成',
    detailNote: '图鉴只供查阅。波间商店可手动合成，也可追踪目标自动合成；基础价格不等于当波商店售价。',
    rulesTitle: '合成与等级', rulesBody: '阶段表示组件、中间件、成品的关系；装备等级仍按游戏中的 1～5 级显示。合成消耗配方材料，结果装备的属性与效果替换材料效果。部分成品直接由组件合成。',
    grade: '装备 {grade} 级', direct: '直接配方：{items}', noRecipe: '基础组件没有合成配方。', noUses: '当前没有后续合成配方。', pageTitle: '装备图鉴 · DotaRogue',
    upgradeTitle: '成品装备升阶', upgradeRange: '强化 Lv.1–3', upgradeLevel: '强化 Lv.{level}',
    upgradeRules: '全部成品均可免费三合一：3 件同名同级变成 1 件高一级，最高 Lv.3。默认自动升阶，也保留手动入口和关闭开关；生效与储备共同取料。不同等级不能混用，组件与中间件不参与。',
    damageRules: '普攻、技能、装备和 Buff 使用统一伤害与攻击力，按各自系数获得加值。近战、远程、弹射、穿透、控制和召唤描述攻击机制。普通吸血适用于所有英雄普攻；血精石的技能吸血只由英雄技能触发。',
    upgradeStats: '各级属性为单件贡献，按 1／3／9 倍保留投入；升阶保留三件材料的属性总和与总卖价。同类被动只取最强的一份。强化 Lv. 与装备基础等级、三个合成阶段分别计算。',
    upgradeBase: '固定配方合成或商店直购获得 Lv.1。', upgradeFrom: '3 件同名 Lv.{level} → 1 件 Lv.{next}',
    upgradeUnavailable: '本装备不参与三合一升阶。', upgradeResale: '卖出：{price} 材料',
    description: 'DotaRogue装备图鉴：74 件装备、53 条固定配方、48 件成品三级成长，以及风怒、顺劈、激励、元素、吸血、圣盾六类装备羁绊。',
    qualityGrades: ['', '普通', '精良', '稀有', '史诗', '传说'], buildsTitle: '装备羁绊', buildsJump: '查看六类羁绊与搭配装备',
    buildsRules: '六类羁绊按各卡片的件数门槛激活两档效果。生效格内不同成品各计 1 件，同名重复、强化等级与储备不增加计数。羁绊成员以当前定义为准，三合一不减少同名贡献；相位鞋是无羁绊的独立机动成品。点击成员可查看详情与配方。',
    buildThresholds: '{counts} 件激活', buildMembers: '搭配成员（点击查看详情）',
    noBuild: '组件与中间件不参与羁绊。', independentBuild: '独立成品，无装备羁绊。相位鞋强化冲刺后的移速与下一次普攻；狂月之光、守夜大剑和阿哈利姆法戒分别强化远程连射、全伤害续航与 Q 回蓝。', noSynergy: '独立成品，无装备羁绊。',
    growthTitle: '击杀成长阶段', growthStages: ['初铸', '聚魂', '铭刻', '觉醒'], growthPoints: '{points} 点',
    growthBlade: '首个有效普攻命中的追加比例，按原始普攻计算：',
    growthRing: '每次追击的总基础预算（AP 为施放 Q 前的攻击力）：',
    growthRingTargets: '强化 Lv.1／2／3 最多追击 1／2／3 个目标。主目标优先首领、再精英；多目标按 2:1:1 权重分配，缺目标时按实际数量重分配。独立间隔固定 8 秒，不受主动冷缩或激励影响。',
    growthRules: '击杀成长：普通／精英／首领各 +1／+3／+6 点；0／60／180／360 点对应初铸／聚魂／铭刻／觉醒。生效格中的同名装备共享进度，储备不增长；封神印用于普攻首击，灾星追击用于成功 Q。'
  },
  'zh-TW': {
    back: '返回遊戲', gameList: '選擇遊戲', title: '裝備圖鑑', lead: '從基礎組件到中間件，再到成品。三個數字代表合成階段；每件裝備的 1～5 級另行標明。',
    itemCount: '件目前裝備', recipeCount: '條固定配方', stageCount: '個合成階段',
    component: '基礎組件', intermediate: '中間件', finished: '成品',
    componentCount: '21 件 · 裝備 1～2 級', intermediateCount: '5 件 · 裝備 3 級', finishedCount: '48 件 · 裝備 3～5 級',
    componentHelp: '合成路線的起點，持有時也提供自身屬性。', intermediateHelp: '由組件合成，也能作為成品材料。', finishedHelp: '有的經過中間件，有的可由組件直接合成。',
    detailKicker: '裝備檔案 / 目前版本', priceLabel: '基礎價格', routeTitle: '合成路線', usedForTitle: '可用於合成',
    detailNote: '圖鑑僅供查閱。波間商店可手動合成，也可追蹤目標自動合成；基礎價格不等於當波商店售價。',
    rulesTitle: '合成與等級', rulesBody: '階段表示組件、中間件、成品的關係；裝備等級仍按遊戲中的 1～5 級顯示。合成消耗配方材料，結果裝備的屬性與效果取代材料效果。部分成品直接由組件合成。',
    grade: '裝備 {grade} 級', direct: '直接配方：{items}', noRecipe: '基礎組件沒有合成配方。', noUses: '目前沒有後續合成配方。', pageTitle: '裝備圖鑑 · DotaRogue',
    upgradeTitle: '成品裝備升階', upgradeRange: '強化 Lv.1–3', upgradeLevel: '強化 Lv.{level}',
    upgradeRules: '全部成品均可免費三合一：3 件同名同級變成 1 件高一級，最高 Lv.3。預設自動升階，也保留手動入口和關閉開關；生效與儲備共同取料。不同等級不能混用，組件與中間件不參與。',
    damageRules: '普攻、技能、裝備和 Buff 使用統一傷害與攻擊力，按各自係數獲得加值。近戰、遠程、彈射、穿透、控制和召喚描述攻擊機制。普通吸血適用於所有英雄普攻；血精石的技能吸血只由英雄技能觸發。',
    upgradeStats: '各級屬性為單件貢獻，按 1／3／9 倍保留投入；升階保留三件材料的屬性總和與總賣價。同類被動只取最強的一份。強化 Lv. 與裝備基礎等級、三個合成階段分別計算。',
    upgradeBase: '固定配方合成或商店直購獲得 Lv.1。', upgradeFrom: '3 件同名 Lv.{level} → 1 件 Lv.{next}',
    upgradeUnavailable: '本裝備不參與三合一升階。', upgradeResale: '賣出：{price} 材料',
    description: 'DotaRogue裝備圖鑑：74 件裝備、53 條固定配方、48 件成品三級成長，以及風怒、順劈、激勵、元素、吸血、聖盾六類裝備羈絆。',
    qualityGrades: ['', '普通', '精良', '稀有', '史詩', '傳說'], buildsTitle: '裝備羈絆', buildsJump: '查看六類羈絆與搭配裝備',
    buildsRules: '六類羈絆按各卡片的件數門檻啟用兩檔效果。生效格內不同成品各計 1 件，同名重複、強化等級與儲備不增加計數。羈絆成員以目前定義為準，三合一不減少同名貢獻；相位鞋是無羈絆的獨立機動成品。點擊成員可查看詳情與配方。',
    buildThresholds: '{counts} 件啟用', buildMembers: '搭配成員（點擊查看詳情）',
    noBuild: '組件與中間件不參與羈絆。', independentBuild: '獨立成品，無裝備羈絆。相位鞋強化衝刺後的移速與下一次普攻；狂月之光、守夜大劍與阿哈利姆法戒分別強化遠程連射、全傷害續航與 Q 回魔。', noSynergy: '獨立成品，無裝備羈絆。',
    growthTitle: '擊殺成長階段', growthStages: ['初鑄', '聚魂', '銘刻', '覺醒'], growthPoints: '{points} 點',
    growthBlade: '首個有效普攻命中的追加比例，依原始普攻計算：',
    growthRing: '每次追擊的總基礎預算（AP 為施放 Q 前的攻擊力）：',
    growthRingTargets: '強化 Lv.1／2／3 最多追擊 1／2／3 個目標。主目標優先首領、再精英；多目標依 2:1:1 權重分配，缺目標時依實際數量重分配。獨立間隔固定 8 秒，不受主動冷縮或激勵影響。',
    growthRules: '擊殺成長：普通／精英／首領各 +1／+3／+6 點；0／60／180／360 點對應初鑄／聚魂／銘刻／覺醒。生效格內同名裝備共享進度，儲備不成長；封神印用於普攻首擊，災星追擊用於成功 Q。'
  },
  en: {
    back: 'Back to game', gameList: 'Choose a game', title: 'Equipment Archive', lead: 'Follow components into intermediate items and finished gear. The three numbers mark crafting stages; each item keeps its actual grade from 1 to 5.',
    itemCount: 'current items', recipeCount: 'fixed recipes', stageCount: 'crafting stages',
    component: 'Components', intermediate: 'Intermediate', finished: 'Finished gear',
    componentCount: '21 items · grades 1–2', intermediateCount: '5 items · grade 3', finishedCount: '48 items · grades 3–5',
    componentHelp: 'The start of a crafting route, with useful stats of their own.', intermediateHelp: 'Crafted from components and used in finished gear.', finishedHelp: 'Some use intermediate items; others use components directly.',
    detailKicker: 'ITEM RECORD / CURRENT BUILD', priceLabel: 'Base price', routeTitle: 'Crafting route', usedForTitle: 'Used to craft',
    detailNote: 'For reference only. Craft manually in the between-wave shop or track a target for automatic crafting. Base price is not the current shop price.',
    rulesTitle: 'Crafting and grades', rulesBody: 'Stages describe components, intermediate items and finished gear. Actual item grades still run from 1 to 5. Crafting consumes the listed ingredients, and the result replaces their stats and effects. Some finished gear is made directly from components.',
    grade: 'Grade {grade}', direct: 'Direct recipe: {items}', noRecipe: 'Components have no crafting recipe.', noUses: 'No further recipe currently uses this item.', pageTitle: 'Equipment Archive · DotaRogue',
    upgradeTitle: 'Finished gear upgrades', upgradeRange: 'Upgrade Lv.1–3', upgradeLevel: 'Upgrade Lv.{level}',
    upgradeRules: 'All finished gear can merge for free: 3 matching copies at the same level become 1 at the next, up to Lv.3. Automatic merging is on by default; manual controls and an off switch remain. Active and reserve items can supply the inputs. Mixed levels, components and intermediate items cannot merge this way.',
    damageRules: 'Basic attacks, skills, gear and buffs share one damage model and attack power stat, with their own scaling ratios. Melee, ranged, bounce, piercing, control and summons describe attack mechanics. Basic lifesteal works for every hero; Bloodstone skill lifesteal only triggers from hero skills.',
    upgradeStats: 'Stats are per item, scaled by 1 / 3 / 9 to preserve your investment. Merging keeps the three inputs’ total stats and resale value. Only the strongest passive of each type applies. Upgrade levels are separate from item grades and the three crafting stages.',
    upgradeBase: 'Crafting recipes and direct shop purchases provide Lv.1.', upgradeFrom: '3 matching Lv.{level} copies → 1 Lv.{next}',
    upgradeUnavailable: 'This item cannot merge for an upgrade.', upgradeResale: 'Sell: {price} materials',
    description: 'DotaRogue equipment archive: 74 items, 53 fixed recipes, 48 finished items with three upgrade levels, and six synergies: Windfury, Cleave, Inspire, Elemental, Lifesteal and Divine Shield.',
    qualityGrades: ['', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'], buildsTitle: 'Equipment synergies', buildsJump: 'Explore six synergies and their equipment',
    buildsRules: 'Each synergy has two tiers at the item counts shown on its card. Each distinct active finished item counts once; duplicate copies, upgrade levels and reserve items add no count. Synergy membership follows the current definitions, and merging copies keeps their single contribution. Phase Boots, Shine of the Madmoon, Blade of the Vigil and Ring of Aghanim are independent gear with no synergy. Select a member to see its details and recipe.',
    buildThresholds: '{counts} items to activate', buildMembers: 'Equipment members (select for details)',
    noBuild: 'Components and intermediate items do not count toward synergies.', independentBuild: 'Independent mobility gear with no equipment synergy. Its post-dash speed and next-basic enhancement stand on their own.', noSynergy: 'Independent finished gear with no equipment synergy.',
    growthTitle: 'Kill-growth stages', growthStages: ['Forged', 'Soulbound', 'Engraved', 'Awakened'], growthPoints: '{points} points',
    growthBlade: 'Bonus ratio on the first successful basic hit, using the original raw basic damage:',
    growthRing: 'Total base budget for each chase (AP is attack power before Q):',
    growthRingTargets: 'Upgrade Lv.1 / 2 / 3 can chase up to 1 / 2 / 3 targets. The primary target prioritizes bosses, then elites. Multiple targets share the budget with weights 2:1:1, redistributed over the actual targets. The independent interval stays at 8 sec, unaffected by active cooldown reduction or Inspire.',
    growthRules: 'Kill growth: normal / elite / boss deaths grant +1 / +3 / +6 points; 0 / 60 / 180 / 360 points are Forged / Soulbound / Engraved / Awakened. Active copies share progress and reserve copies do not grow. Godseal Mark follows the first basic hit; Calamity Chase follows a successful Q.'
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
const description = id => {
  const item = resolveEquipment(id);
  const text = EQUIPMENT[id][locale === 'en' ? 'descEn' : locale === 'zh-TW' ? 'descTw' : 'desc'];
  const attributes = attributeSummary(item?.attributes, locale);
  return [text, attributes, EQUIPMENT[id].growth ? copy('growthRules') : ''].filter(Boolean).join(' · ');
};
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
  icon.src = equipmentIconPath(id);
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
  $('detail-icon').src = equipmentIconPath(selectedId);
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
      const levelAttributes = attributeSummary(upgraded.attributes, locale);
      const upgradeDescription = equipmentUpgradeDescription({ id: selectedId, level }, locale);
      stats.textContent = levelAttributes ? `${upgradeDescription} · ${levelAttributes}` : upgradeDescription;
      const resale = document.createElement('p');
      resale.className = 'upgrade-resale';
      resale.textContent = copy('upgradeResale').replace('{price}', equipmentResale({ id: selectedId, level }));
      row.append(heading, source, stats, resale);
      levels.append(row);
    }
    upgrades.append(levels);
    if (item.growth) {
      const heading = document.createElement('h4');
      heading.className = 'growth-stages-title';
      heading.textContent = copy('growthTitle');
      const explanation = document.createElement('p');
      explanation.textContent = copy(selectedId === 'godsealBlade' ? 'growthBlade' : 'growthRing');
      const stages = document.createElement('ul');
      stages.className = 'growth-stages';
      const thresholds = [0, ...item.growth.thresholds];
      const number = value => Number(value.toFixed(4));
      item.passive.growthStages.forEach((coefficient, index) => {
        const row = document.createElement('li');
        const values = [1, 2, 3].map(level => {
          const passive = resolveEquipment({ id: selectedId, level }).passive;
          return selectedId === 'godsealBlade'
            ? `Lv.${level} ${number(passive.ratio * coefficient * 100)}%`
            : `Lv.${level} ${number(passive.baseDamage * coefficient)} + AP × ${number(passive.attackRatio * coefficient)}`;
        });
        row.textContent = `${copy('growthStages')[index]} · ${copy('growthPoints').replace('{points}', thresholds[index])}${locale === 'en' ? ': ' : '：'}${values.join(locale === 'en' ? '; ' : '；')}`;
        stages.append(row);
      });
      upgrades.append(heading, explanation, stages);
      if (selectedId === 'calamityRing') {
        const rules = document.createElement('p');
        rules.textContent = copy('growthRingTargets');
        upgrades.append(rules);
      }
    }
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
    empty.textContent = copy(item.kind !== 'finished' ? 'noBuild' : selectedId === 'phaseBoots' ? 'independentBuild' : 'noSynergy');
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
