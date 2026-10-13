export const EQUIPMENT_CAPACITY = 12;

export const EQUIPMENT = {
  mithrilHammer: {
    kind: "component",
    grade: 1,
    price: 16,
    name: "秘银锤",
    nameTw: "秘銀錘",
    nameEn: "Mithril Hammer",
    desc: "物理攻击 +5。",
    descTw: "物理攻擊 +5。",
    descEn: "Physical attack +5.",
    stats: {"attackDamage": 5}
  },
  glovesHaste: {
    kind: "component",
    grade: 1,
    price: 12,
    name: "加速手套",
    nameTw: "加速手套",
    nameEn: "Gloves of Haste",
    desc: "攻速 +15%。",
    descTw: "攻速 +15%。",
    descEn: "Attack speed +15%.",
    stats: {"attackSpeed": 15}
  },
  eaglehorn: {
    kind: "component",
    grade: 2,
    price: 24,
    name: "鹰角弓",
    nameTw: "鷹角弓",
    nameEn: "Eaglehorn",
    desc: "物理攻击 +6。",
    descTw: "物理攻擊 +6。",
    descEn: "Physical attack +6.",
    stats: {"attackDamage": 6}
  },
  ringHealth: {
    kind: "component",
    grade: 1,
    price: 15,
    name: "治疗指环",
    nameTw: "治療指環",
    nameEn: "Ring of Health",
    desc: "每5秒回血 +2。",
    descTw: "每5秒回血 +2。",
    descEn: "HP per 5 sec +2.",
    stats: {"regen": 2}
  },
  claymore: {
    kind: "component",
    grade: 2,
    price: 22,
    name: "大剑",
    nameTw: "大劍",
    nameEn: "Claymore",
    desc: "物理攻击 +7。",
    descTw: "物理攻擊 +7。",
    descEn: "Physical attack +7.",
    stats: {"attackDamage": 7}
  },
  broadsword: {
    kind: "component",
    grade: 2,
    price: 20,
    name: "阔剑",
    nameTw: "闊劍",
    nameEn: "Broadsword",
    desc: "物理攻击 +6。",
    descTw: "物理攻擊 +6。",
    descEn: "Physical attack +6.",
    stats: {"attackDamage": 6}
  },
  voidStone: {
    kind: "component",
    grade: 2,
    price: 15,
    name: "虚无宝石",
    nameTw: "虛無寶石",
    nameEn: "Void Stone",
    desc: "每秒回蓝 +1。",
    descTw: "每秒回魔 +1。",
    descEn: "Mana per sec +1.",
    stats: {"manaRegen": 1}
  },
  stoutShield: {
    kind: "component",
    grade: 1,
    price: 13,
    name: "小圆盾",
    nameTw: "小圓盾",
    nameEn: "Stout Shield",
    desc: "护甲 +2。",
    descTw: "護甲 +2。",
    descEn: "Armor +2.",
    stats: {"armor": 2}
  },
  vitalityBooster: {
    kind: "component",
    grade: 1,
    price: 18,
    name: "活力之球",
    nameTw: "活力之球",
    nameEn: "Vitality Booster",
    desc: "最大生命 +8。",
    descTw: "最大生命 +8。",
    descEn: "Max HP +8.",
    stats: {"maxHp": 8}
  },
  bladesAttack: {
    kind: "component",
    grade: 1,
    price: 14,
    name: "攻击之爪",
    nameTw: "攻擊之爪",
    nameEn: "Blades of Attack",
    desc: "物理攻击 +3。",
    descTw: "物理攻擊 +3。",
    descEn: "Physical attack +3.",
    stats: {"attackDamage": 3}
  },
  demonEdge: {
    kind: "component",
    grade: 2,
    price: 30,
    name: "恶魔刀锋",
    nameTw: "惡魔刀鋒",
    nameEn: "Demon Edge",
    desc: "物理攻击 +10。",
    descTw: "物理攻擊 +10。",
    descEn: "Physical attack +10.",
    stats: {"attackDamage": 10}
  },
  quarterstaff: {
    kind: "component",
    grade: 1,
    price: 16,
    name: "短棍",
    nameTw: "短棍",
    nameEn: "Quarterstaff",
    desc: "物理攻击 +3，攻速 +8%。",
    descTw: "物理攻擊 +3，攻速 +8%。",
    descEn: "Physical attack +3; Attack speed +8%.",
    stats: {"attackDamage": 3, "attackSpeed": 8}
  },
  talismanEvasion: {
    kind: "component",
    grade: 2,
    price: 24,
    name: "闪避护符",
    nameTw: "閃避護符",
    nameEn: "Talisman of Evasion",
    desc: "闪避 +8%。",
    descTw: "閃避 +8%。",
    descEn: "Dodge +8%.",
    stats: {"dodge": 8}
  },
  maskDeath: {
    kind: "component",
    grade: 1,
    price: 15,
    name: "吸血面具",
    nameTw: "吸血面具",
    nameEn: "Mask of Death",
    desc: "物理普攻吸血 +5%。",
    descTw: "物理普攻吸血 +5%。",
    descEn: "Physical basic attack lifesteal +5%.",
    stats: {"lifesteal": 5}
  },
  helmIron: {
    kind: "component",
    grade: 1,
    price: 15,
    name: "铁艺头盔",
    nameTw: "鐵藝頭盔",
    nameEn: "Helm of Iron Will",
    desc: "护甲 +2，每5秒回血 +1。",
    descTw: "護甲 +2，每5秒回血 +1。",
    descEn: "Armor +2; HP per 5 sec +1.",
    stats: {"armor": 2, "regen": 1}
  },
  reaver: {
    kind: "component",
    grade: 2,
    price: 28,
    name: "希梅斯特的掠夺",
    nameTw: "希梅斯特的掠奪",
    nameEn: "Messerschmidt's Reaver",
    desc: "最大生命 +12，物理攻击 +4。",
    descTw: "最大生命 +12，物理攻擊 +4。",
    descEn: "Max HP +12; Physical attack +4.",
    stats: {"maxHp": 12, "attackDamage": 4}
  },
  staffWizardry: {
    kind: "component",
    grade: 2,
    price: 22,
    name: "魔力法杖",
    nameTw: "魔力法杖",
    nameEn: "Staff of Wizardry",
    desc: "法术攻击 +5。",
    descTw: "法術攻擊 +5。",
    descEn: "Magic attack +5.",
    stats: {"elemental": 5}
  },
  robeMagi: {
    kind: "component",
    grade: 1,
    price: 14,
    name: "法师长袍",
    nameTw: "法師長袍",
    nameEn: "Robe of the Magi",
    desc: "法术攻击 +3。",
    descTw: "法術攻擊 +3。",
    descEn: "Magic attack +3.",
    stats: {"elemental": 3}
  },
  sobiMask: {
    kind: "component",
    grade: 1,
    price: 13,
    name: "艺人面具",
    nameTw: "藝人面具",
    nameEn: "Sobi Mask",
    desc: "每秒回蓝 +0.75。",
    descTw: "每秒回魔 +0.75。",
    descEn: "Mana per sec +0.75.",
    stats: {"manaRegen": 0.75}
  },
  pointBooster: {
    kind: "component",
    grade: 2,
    price: 26,
    name: "精气之球",
    nameTw: "精氣之球",
    nameEn: "Point Booster",
    desc: "最大生命 +6，最大法力 +25。",
    descTw: "最大生命 +6，最大法力 +25。",
    descEn: "Max HP +6; Max mana +25.",
    stats: {"maxHp": 6, "maxMana": 25}
  },
  bootsSpeed: {
    kind: "component",
    grade: 1,
    price: 14,
    name: "速度之鞋",
    nameTw: "速度之鞋",
    nameEn: "Boots of Speed",
    desc: "移动速度 +8%。",
    descTw: "移動速度 +8%。",
    descEn: "Movement speed +8%.",
    stats: {"speed": 8}
  },
  maelstrom: {
    kind: "intermediate",
    grade: 3,
    price: 42,
    name: "漩涡",
    nameTw: "漩渦",
    nameEn: "Maelstrom",
    desc: "物理攻击 +8，攻速 +8%。普攻有20%概率释放连锁闪电，最多命中3个目标。",
    descTw: "物理攻擊 +8，攻速 +8%。普攻有20%機率釋放連鎖閃電，最多命中3個目標。",
    descEn: "Physical attack +8; Attack speed +8%. Basic attacks have a 20% chance to chain lightning to up to 3 enemies.",
    stats: {"attackDamage": 8, "attackSpeed": 8},
    recipe: ["mithrilHammer", "glovesHaste"],
    passive: {"id": "chainLightning", "chance": 0.2, "damage": 24, "jumps": 2}
  },
  perseverance: {
    kind: "intermediate",
    grade: 3,
    price: 36,
    name: "坚韧球",
    nameTw: "堅韌球",
    nameEn: "Perseverance",
    desc: "每5秒回血 +3，每秒回蓝 +2。",
    descTw: "每5秒回血 +3，每秒回魔 +2。",
    descEn: "HP per 5 sec +3; Mana per sec +2.",
    stats: {"regen": 3, "manaRegen": 2},
    recipe: ["ringHealth", "voidStone"]
  },
  crystalys: {
    kind: "intermediate",
    grade: 3,
    price: 38,
    name: "水晶剑",
    nameTw: "水晶劍",
    nameEn: "Crystalys",
    desc: "物理攻击 +10，暴击率 +8%，暴击伤害 +20%。",
    descTw: "物理攻擊 +10，暴擊率 +8%，暴擊傷害 +20%。",
    descEn: "Physical attack +10; Crit chance +8%; Critical damage +20%.",
    stats: {"attackDamage": 10, "crit": 8, "critDamage": 20},
    recipe: ["broadsword", "bladesAttack"]
  },
  helmDominator: {
    kind: "intermediate",
    grade: 3,
    price: 38,
    name: "支配头盔",
    nameTw: "支配頭盔",
    nameEn: "Helm of the Dominator",
    desc: "物理攻击 +4，护甲 +3，物理普攻吸血 +9%，每 5 秒回血 +1。",
    descTw: "物理攻擊 +4，護甲 +3，物理普攻吸血 +9%，每 5 秒回血 +1。",
    descEn: "Physical attack +4, armor +3, physical basic attack lifesteal +9%, regeneration +1 every 5 sec.",
    stats: {"attackDamage": 4, "armor": 3, "lifesteal": 9, "regen": 1},
    recipe: ["helmIron", "maskDeath"]
  },
  oblivionStaff: {
    kind: "intermediate",
    grade: 3,
    price: 42,
    name: "空明杖",
    nameTw: "空明杖",
    nameEn: "Oblivion Staff",
    desc: "法术攻击 +9，每秒回蓝 +1.5，攻速 +8%。",
    descTw: "法術攻擊 +9，每秒回魔 +1.5，攻速 +8%。",
    descEn: "Magic attack +9; Mana per sec +1.5; Attack speed +8%.",
    stats: {"elemental": 9, "manaRegen": 1.5, "attackSpeed": 8},
    recipe: ["staffWizardry", "robeMagi", "sobiMask"]
  },
  mjollnir: {
    kind: "finished",
    grade: 5,
    price: 86,
    name: "雷神之锤",
    nameTw: "雷神之錘",
    nameEn: "Mjollnir",
    desc: "物理攻击 +14，攻速 +18%。普攻有25%概率释放强化连锁闪电，最多命中4个目标。",
    descTw: "物理攻擊 +14，攻速 +18%。普攻有25%機率釋放強化連鎖閃電，最多命中4個目標。",
    descEn: "Physical attack +14; Attack speed +18%. Basic attacks have a 25% chance to chain stronger lightning to up to 4 enemies.",
    stats: {"attackDamage": 14, "attackSpeed": 18},
    recipe: ["maelstrom", "eaglehorn"],
    passive: {"id": "chainLightning", "chance": 0.25, "damage": 42, "jumps": 3}
  },
  battlefury: {
    kind: "finished",
    grade: 5,
    price: 78,
    name: "狂战斧",
    nameTw: "狂戰斧",
    nameEn: "Battle Fury",
    desc: "物理攻击 +16，每 5 秒回血 +5；近战普攻对周围敌人造成 35% 分裂伤害。",
    descTw: "物理攻擊 +16，每 5 秒回血 +5；近戰普攻對周圍敵人造成 35% 分裂傷害。",
    descEn: "Physical attack +16, regeneration +5 every 5 sec; melee basic attacks cleave nearby enemies for 35% damage.",
    stats: {"attackDamage": 16, "regen": 5},
    recipe: ["claymore", "broadsword", "perseverance"],
    passive: {"id": "cleave", "radius": 88, "damageRatio": 0.35}
  },
  buriza: {
    kind: "finished",
    grade: 5,
    price: 92,
    name: "大炮",
    nameTw: "大炮",
    nameEn: "Buriza-Dokyanon",
    desc: "物理攻击 +22，暴击率 +14%，暴击伤害 +45%。",
    descTw: "物理攻擊 +22，暴擊率 +14%，暴擊傷害 +45%。",
    descEn: "Physical attack +22; Crit chance +14%; Critical damage +45%.",
    stats: {"attackDamage": 22, "crit": 14, "critDamage": 45},
    recipe: ["crystalys", "demonEdge"]
  },
  butterfly: {
    kind: "finished",
    grade: 5,
    price: 88,
    name: "蝴蝶",
    nameTw: "蝴蝶",
    nameEn: "the Butterfly",
    desc: "物理攻击 +14，攻速 +25%，闪避 +16%。",
    descTw: "物理攻擊 +14，攻速 +25%，閃避 +16%。",
    descEn: "Physical attack +14; Attack speed +25%; Dodge +16%.",
    stats: {"attackDamage": 14, "attackSpeed": 25, "dodge": 16},
    recipe: ["eaglehorn", "quarterstaff", "talismanEvasion"]
  },
  vanguard: {
    kind: "finished",
    grade: 4,
    price: 58,
    name: "先锋盾",
    nameTw: "先鋒盾",
    nameEn: "Vanguard",
    desc: "最大生命 +16，护甲 +4，每 5 秒回血 +3；有来源的伤害有 35% 概率格挡 3 点。",
    descTw: "最大生命 +16，護甲 +4，每 5 秒回血 +3；有來源的傷害有 35% 機率格擋 3 點。",
    descEn: "Max HP +16, armor +4, regeneration +3 every 5 sec; 35% chance to block 3 damage when the hit has a source.",
    stats: {"maxHp": 16, "armor": 4, "regen": 3},
    recipe: ["stoutShield", "vitalityBooster", "ringHealth"],
    passive: {"id": "damageBlock", "chance": 0.35, "amount": 3}
  },
  satanic: {
    kind: "finished",
    grade: 5,
    price: 92,
    name: "撒旦之邪力",
    nameTw: "撒旦之邪力",
    nameEn: "Satanic",
    desc: "物理攻击 +12，最大生命 +14，护甲 +4，物理普攻吸血 +18%，每 5 秒回血 +1。生命低于 35% 时自动狂热：5 秒内额外吸血 12%，冷却 20 秒。",
    descTw: "物理攻擊 +12，最大生命 +14，護甲 +4，物理普攻吸血 +18%，每 5 秒回血 +1。生命低於 35% 時自動狂熱：5 秒內額外吸血 12%，冷卻 20 秒。",
    descEn: "Physical attack +12, max HP +14, armor +4, physical basic attack lifesteal +18%, regeneration +1 every 5 sec. Below 35% HP, gain another 12% lifesteal for 5 sec; 20 sec cooldown.",
    stats: {"attackDamage": 12, "maxHp": 14, "armor": 4, "lifesteal": 18, "regen": 1},
    recipe: ["helmDominator", "reaver"],
    passive: {"id": "bloodRage", "threshold": 0.35, "duration": 5, "cooldown": 20, "lifesteal": 12}
  },
  aghanim: {
    kind: "finished",
    grade: 5,
    price: 84,
    name: "蓝杖",
    nameTw: "藍杖",
    nameEn: "Aghanim's Scepter",
    desc: "法术攻击 +12，最大生命 +10，最大法力 +50，每秒回蓝 +2，主动技能冷却缩减 +15%；主动技能伤害或增益效果强化 25%。",
    descTw: "法術攻擊 +12，最大生命 +10，最大法力 +50，每秒回魔 +2，主動技能冷卻縮減 +15%；主動技能傷害或增益效果強化 25%。",
    descEn: "Magic attack +12, max HP +10, max mana +50, mana regeneration +2/sec, active cooldown reduction +15%; active skill damage or buffs +25%.",
    stats: {"elemental": 12, "maxHp": 10, "maxMana": 50, "manaRegen": 2, "abilityHaste": 15},
    recipe: ["pointBooster", "oblivionStaff"],
    passive: {"id": "activeAmplify", "multiplier": 1.25}
  },
  powerTreads: {
    kind: "finished",
    grade: 3,
    price: 48,
    name: "动力鞋",
    nameTw: "動力鞋",
    nameEn: "Power Treads",
    desc: "最大生命 +10，移动速度 +12%，攻速 +22%。",
    descTw: "最大生命 +10，移動速度 +12%，攻速 +22%。",
    descEn: "Max HP +10; Movement speed +12%; Attack speed +22%.",
    stats: {"maxHp": 10, "speed": 12, "attackSpeed": 22},
    recipe: ["bootsSpeed", "glovesHaste", "vitalityBooster"]
  },
  radiance: {
    kind: "finished",
    grade: 5,
    price: 96,
    name: "辉耀",
    nameTw: "輝耀",
    nameEn: "Radiance",
    desc: "物理攻击 +18，所有伤害 +8%。灼热光环每秒灼烧 165 范围内敌人。",
    descTw: "物理攻擊 +18，所有傷害 +8%。灼熱光環每秒灼燒 165 範圍內敵人。",
    descEn: "Physical attack +18; all damage +8%. A searing aura burns enemies within 165 range every second.",
    stats: {"attackDamage": 18, "damage": 8},
    recipe: ["demonEdge", "perseverance"],
    passive: {"id": "radiance", "radius": 165, "damage": 8, "interval": 1}
  },
  desolator: {
    kind: "finished",
    grade: 5,
    price: 94,
    name: "暗灭",
    nameTw: "黯滅",
    nameEn: "Desolator",
    desc: "物理攻击 +20。物理普攻命中后使目标进入破甲状态 4 秒，受到的后续物理伤害提高 18%。",
    descTw: "物理攻擊 +20。物理普攻命中後使目標進入破甲狀態 4 秒，受到的後續物理傷害提高 18%。",
    descEn: "Physical attack +20. Physical basic attacks mark targets for 4 sec, increasing subsequent physical damage taken by 18%.",
    stats: {"attackDamage": 20},
    recipe: ["demonEdge", "crystalys"],
    passive: {"id": "desolate", "duration": 4, "multiplier": 0.18}
  },
  skadi: {
    kind: "finished",
    grade: 5,
    price: 96,
    name: "冰眼",
    nameTw: "冰眼",
    nameEn: "Eye of Skadi",
    desc: "物理攻击 +12，最大生命 +20，最大法力 +35，攻速 +10%。普攻命中使敌人减速 45%，持续 2.5 秒。",
    descTw: "物理攻擊 +12，最大生命 +20，最大法力 +35，攻速 +10%。普攻命中使敵人減速 45%，持續 2.5 秒。",
    descEn: "Physical attack +12; max HP +20; max mana +35; attack speed +10%. Basic attacks slow enemies by 45% for 2.5 sec.",
    stats: {"attackDamage": 12, "maxHp": 20, "maxMana": 35, "attackSpeed": 10},
    recipe: ["pointBooster", "vitalityBooster", "talismanEvasion"],
    passive: {"id": "frostAttack", "duration": 2.5, "slow": 0.45}
  },
  manta: {
    kind: "finished",
    grade: 5,
    price: 90,
    name: "分身斧",
    nameTw: "分身斧",
    nameEn: "Manta Style",
    desc: "物理攻击 +10，攻速 +20%，移速 +10%，闪避 +10%。每 5 次基础攻击召出两道幻影追击，各造成 65% 伤害。",
    descTw: "物理攻擊 +10，攻速 +20%，移速 +10%，閃避 +10%。每 5 次基礎攻擊召出兩道幻影追擊，各造成 65% 傷害。",
    descEn: "Physical attack +10; attack speed +20%; move speed +10%; dodge +10%. Every 5 basic attacks launch two mirror strikes for 65% damage each.",
    stats: {"attackDamage": 10, "attackSpeed": 20, "speed": 10, "dodge": 10},
    recipe: ["quarterstaff", "bootsSpeed", "talismanEvasion"],
    passive: {"id": "mirrorImage", "hits": 5, "ratio": 0.65, "spread": 0.16}
  }
};

// Finished-weapon levels are independent of the existing equipment grade.
export const EQUIPMENT_UPGRADES = {
  mjollnir: { chance: [0.25, 0.3, 0.35], damage: [42, 84, 126], jumps: [3, 4, 5] },
  battlefury: { radius: [88, 108, 132], damageRatio: [0.35, 0.45, 0.6] },
  buriza: {},
  butterfly: {},
  vanguard: {},
  satanic: {},
  aghanim: { multiplier: [1.25, 1.4, 1.6] },
  powerTreads: {},
  radiance: { radius: [165, 185, 205], damage: [8, 16, 24] },
  desolator: { multiplier: [0.18, 0.26, 0.35] },
  skadi: { slow: [0.45, 0.55, 0.65], duration: [2.5, 3, 3.5] },
  manta: { ratio: [0.65, 0.85, 1.1] }
};

export function equipmentLevel(item) {
  const id = typeof item === 'string' ? item : item?.id;
  return Object.hasOwn(EQUIPMENT_UPGRADES, id) && Number.isInteger(item?.level)
    && item.level >= 1 && item.level <= 3 ? item.level : 1;
}

export function resolveEquipment(item) {
  const id = typeof item === 'string' ? item : item?.id;
  const base = Object.hasOwn(EQUIPMENT, id) ? EQUIPMENT[id] : null;
  if (!base) return undefined;
  const level = equipmentLevel(item), scale = 3 ** (level - 1);
  const stats = Object.fromEntries(Object.entries(base.stats).map(([key, value]) => [key, value * scale]));
  const passive = base.passive ? { ...base.passive, level } : undefined;
  if (passive && Object.hasOwn(EQUIPMENT_UPGRADES, id)) {
    for (const [key, values] of Object.entries(EQUIPMENT_UPGRADES[id])) passive[key] = values[level - 1];
  }
  return { ...base, id, level, stats, passive };
}

export function equipmentUpgradeIndices(items, uid) {
  if (uid == null) return null;
  const index = items.findIndex(item => item?.uid === uid), selected = items[index];
  if (!selected || !Object.hasOwn(EQUIPMENT_UPGRADES, selected.id)) return null;
  const level = equipmentLevel(selected);
  if (level === 3 || (selected.level != null && selected.level !== level)) return null;
  const indices = items.flatMap((item, i) => item?.id === selected.id
    && equipmentLevel(item) === level && (item.level == null || item.level === level) ? [i] : []);
  const uids = indices.map(i => items[i].uid);
  if (indices.length < 3 || uids.some(value => value == null) || new Set(uids).size !== uids.length) return null;
  return [index, ...indices.filter(i => i !== index).slice(0, 2)];
}

export function equipmentResale(item) {
  const def = resolveEquipment(item);
  return def ? Math.max(1, Math.round(def.price * 0.5)) * 3 ** (def.level - 1) : 0;
}

export function equipmentUpgradeDescription(item, locale = 'zh-CN', compact = false) {
  const def = resolveEquipment(item);
  if (!def || !Object.hasOwn(EQUIPMENT_UPGRADES, def.id)) return '';
  const s = def.stats, p = def.passive;
  const percent = value => Math.round(value * 100);
  if (compact) {
    const summaries = {
      'zh-CN': {
        mjollnir: () => `物理攻击 +${s.attackDamage}，攻速 +${s.attackSpeed}%。普攻 ${percent(p.chance)}% 概率连锁 ${p.jumps + 1} 个目标；首跳 ${p.damage} + 法术攻击 × 0.4，逐跳保留 70%。攻击间隔最短 0.09 秒。`,
        battlefury: () => `物理攻击 +${s.attackDamage}，每 5 秒回血 +${s.regen}。近战普攻对半径 ${p.radius} 内其他敌人造成 ${percent(p.damageRatio)}% 分裂伤害。`,
        buriza: () => `物理攻击 +${s.attackDamage}，暴击率 +${s.crit}%（总上限 90%），暴击伤害 +${s.critDamage}%。`,
        butterfly: () => `物理攻击 +${s.attackDamage}，攻速 +${s.attackSpeed}%，闪避 +${s.dodge}%（总上限 55%）。攻击间隔最短 0.09 秒。`,
        vanguard: () => `最大生命 +${s.maxHp}，护甲 +${s.armor}，每 5 秒回血 +${s.regen}。有来源的伤害有 ${percent(p.chance)}% 概率格挡 ${p.amount} 点；同类只取一份。`,
        satanic: () => `物理攻击 +${s.attackDamage}，最大生命 +${s.maxHp}，护甲 +${s.armor}，物理普攻吸血 +${s.lifesteal}%，每 5 秒回血 +${s.regen}。生命低于 ${percent(p.threshold)}% 时额外吸血 +${p.lifesteal}%，持续 ${p.duration} 秒，冷却 ${p.cooldown} 秒；总吸血上限 65%，狂热只取一份。`,
        aghanim: () => `法术攻击 +${s.elemental}，生命 +${s.maxHp}，法力 +${s.maxMana}，每秒回蓝 +${s.manaRegen}，主动冷缩 +${s.abilityHaste}%（总上限 60%）。已支持的主动伤害／增益 ×${p.multiplier.toFixed(2)}，同类取最高。`,
        powerTreads: () => `最大生命 +${s.maxHp}，移速 +${s.speed}%，攻速 +${s.attackSpeed}%。攻击间隔最短 0.09 秒。`,
        radiance: () => `物理攻击 +${s.attackDamage}，所有伤害 +${s.damage}%。每 ${p.interval} 秒对 ${p.radius} 范围内敌人造成 ${p.damage} 基础灼烧伤害，受所有伤害加成；光环只取最高阶。`,
        desolator: () => `物理攻击 +${s.attackDamage}。物理普攻标记目标 ${p.duration} 秒，后续物理普攻伤害 +${percent(p.multiplier)}%；同类只取最高阶。`,
        skadi: () => `物理攻击 +${s.attackDamage}，最大生命 +${s.maxHp}，最大法力 +${s.maxMana}，攻速 +${s.attackSpeed}%。普攻减速 ${percent(p.slow)}%，持续 ${p.duration} 秒；同类只取最高阶。攻击间隔最短 0.09 秒。`,
        manta: () => `物理攻击 +${s.attackDamage}，攻速 +${s.attackSpeed}%，移速 +${s.speed}%，闪避 +${s.dodge}%（总上限 55%）。每 ${p.hits} 次有效普攻发射两道幻影，各造成 ${percent(p.ratio)}% 伤害；同类只取最高阶。攻击间隔最短 0.09 秒。`
      },
      'zh-TW': {
        mjollnir: () => `物理攻擊 +${s.attackDamage}，攻速 +${s.attackSpeed}%。普攻 ${percent(p.chance)}% 機率連鎖 ${p.jumps + 1} 個目標；首跳 ${p.damage} + 法術攻擊 × 0.4，逐跳保留 70%。攻擊間隔最短 0.09 秒。`,
        battlefury: () => `物理攻擊 +${s.attackDamage}，每 5 秒回血 +${s.regen}。近戰普攻對半徑 ${p.radius} 內其他敵人造成 ${percent(p.damageRatio)}% 分裂傷害。`,
        buriza: () => `物理攻擊 +${s.attackDamage}，暴擊率 +${s.crit}%（總上限 90%），暴擊傷害 +${s.critDamage}%。`,
        butterfly: () => `物理攻擊 +${s.attackDamage}，攻速 +${s.attackSpeed}%，閃避 +${s.dodge}%（總上限 55%）。攻擊間隔最短 0.09 秒。`,
        vanguard: () => `最大生命 +${s.maxHp}，護甲 +${s.armor}，每 5 秒回血 +${s.regen}。有來源的傷害有 ${percent(p.chance)}% 機率格擋 ${p.amount} 點；同類只取一份。`,
        satanic: () => `物理攻擊 +${s.attackDamage}，最大生命 +${s.maxHp}，護甲 +${s.armor}，物理普攻吸血 +${s.lifesteal}%，每 5 秒回血 +${s.regen}。生命低於 ${percent(p.threshold)}% 時額外吸血 +${p.lifesteal}%，持續 ${p.duration} 秒，冷卻 ${p.cooldown} 秒；總吸血上限 65%，狂熱只取一份。`,
        aghanim: () => `法術攻擊 +${s.elemental}，生命 +${s.maxHp}，法力 +${s.maxMana}，每秒回魔 +${s.manaRegen}，主動冷縮 +${s.abilityHaste}%（總上限 60%）。已支援的主動傷害／增益 ×${p.multiplier.toFixed(2)}，同類取最高。`,
        powerTreads: () => `最大生命 +${s.maxHp}，移速 +${s.speed}%，攻速 +${s.attackSpeed}%。攻擊間隔最短 0.09 秒。`,
        radiance: () => `物理攻擊 +${s.attackDamage}，所有傷害 +${s.damage}%。每 ${p.interval} 秒對 ${p.radius} 範圍內敵人造成 ${p.damage} 基礎灼燒傷害，受所有傷害加成；光環只取最高階。`,
        desolator: () => `物理攻擊 +${s.attackDamage}。物理普攻標記目標 ${p.duration} 秒，後續物理普攻傷害 +${percent(p.multiplier)}%；同類只取最高階。`,
        skadi: () => `物理攻擊 +${s.attackDamage}，最大生命 +${s.maxHp}，最大法力 +${s.maxMana}，攻速 +${s.attackSpeed}%。普攻減速 ${percent(p.slow)}%，持續 ${p.duration} 秒；同類只取最高階。攻擊間隔最短 0.09 秒。`,
        manta: () => `物理攻擊 +${s.attackDamage}，攻速 +${s.attackSpeed}%，移速 +${s.speed}%，閃避 +${s.dodge}%（總上限 55%）。每 ${p.hits} 次有效普攻發射兩道幻影，各造成 ${percent(p.ratio)}% 傷害；同類只取最高階。攻擊間隔最短 0.09 秒。`
      },
      en: {
        mjollnir: () => `Physical attack +${s.attackDamage}; attack speed +${s.attackSpeed}%. Basic attacks: ${percent(p.chance)}% chain chance, ${p.jumps + 1} targets, first hit ${p.damage} + magic attack × 0.4; 70% damage per jump. Min attack interval 0.09 sec.`,
        battlefury: () => `Physical attack +${s.attackDamage}; HP per 5 sec +${s.regen}. Melee basic attacks cleave other enemies for ${percent(p.damageRatio)}% damage within ${p.radius} range.`,
        buriza: () => `Physical attack +${s.attackDamage}; crit chance +${s.crit}% (total cap 90%); critical damage +${s.critDamage}%.`,
        butterfly: () => `Physical attack +${s.attackDamage}; attack speed +${s.attackSpeed}%; dodge +${s.dodge}% (total cap 55%). Min attack interval 0.09 sec.`,
        vanguard: () => `Max HP +${s.maxHp}; armor +${s.armor}; HP per 5 sec +${s.regen}. Hits with a source have a ${percent(p.chance)}% chance to block ${p.amount} damage; only one block passive applies.`,
        satanic: () => `Physical attack +${s.attackDamage}; max HP +${s.maxHp}; armor +${s.armor}; physical basic attack lifesteal +${s.lifesteal}%; HP per 5 sec +${s.regen}. Below ${percent(p.threshold)}% HP: extra lifesteal +${p.lifesteal}% for ${p.duration} sec, ${p.cooldown} sec cooldown; total lifesteal caps at 65%. Only one rage applies.`,
        aghanim: () => `Magic attack +${s.elemental}; max HP +${s.maxHp}; max mana +${s.maxMana}; mana/sec +${s.manaRegen}; active cooldown reduction +${s.abilityHaste}% (total cap 60%). Supported active damage/buffs ×${p.multiplier.toFixed(2)}; highest only.`,
        powerTreads: () => `Max HP +${s.maxHp}; move speed +${s.speed}%; attack speed +${s.attackSpeed}%. Min attack interval 0.09 sec.`,
        radiance: () => `Physical attack +${s.attackDamage}; all damage +${s.damage}%. Aura: ${p.damage} base damage every ${p.interval} sec within ${p.radius} range, affected by all-damage bonuses. Highest-level aura only.`,
        desolator: () => `Physical attack +${s.attackDamage}. Physical basic attacks mark for ${p.duration} sec: subsequent physical basic attack damage +${percent(p.multiplier)}%. Highest-level mark only.`,
        skadi: () => `Physical attack +${s.attackDamage}; max HP +${s.maxHp}; max mana +${s.maxMana}; attack speed +${s.attackSpeed}%. Basic attacks slow by ${percent(p.slow)}% for ${p.duration} sec; highest-level slow only. Min attack interval 0.09 sec.`,
        manta: () => `Physical attack +${s.attackDamage}; attack speed +${s.attackSpeed}%; move speed +${s.speed}%; dodge +${s.dodge}% (total cap 55%). Every ${p.hits} successful basic attacks fire two mirror strikes at ${percent(p.ratio)}% damage each; highest-level passive only. Min attack interval 0.09 sec.`
      }
    };
    return summaries[Object.hasOwn(summaries, locale) ? locale : 'zh-CN'][def.id]();
  }
  const descriptions = {
    'zh-CN': {
      mjollnir: () => `物理攻击 +${s.attackDamage}，攻速 +${s.attackSpeed}%。有效普攻有 ${percent(p.chance)}% 概率触发连锁，最多命中 ${p.jumps + 1} 个目标；首跳 ${p.damage} + 法术攻击 × 0.4，每跳保留 70% 伤害，跳距 190。雷锤／漩涡只取最强，共用 0.2 秒间隔；连锁不暴击、不吸血、不触发其他被动。`,
      battlefury: () => `物理攻击 +${s.attackDamage}，每 5 秒回血 +${s.regen}。每次近战普攻以首个有效命中为中心，对半径 ${p.radius} 内其他敌人造成暴击前伤害的 ${percent(p.damageRatio)}% 分裂，所有伤害加成只计算一次。只取最强分裂；分裂不暴击、不吸血、不触发其他被动。`,
      buriza: () => `物理攻击 +${s.attackDamage}，暴击率 +${s.crit}%，暴击伤害 +${s.critDamage}%。基础攻击直接命中可暴击，不产生范围伤害。`,
      butterfly: () => `物理攻击 +${s.attackDamage}，攻速 +${s.attackSpeed}%，闪避 +${s.dodge}%。保持原有普攻与闪避规则，不追加攻击或无敌时间。`,
      vanguard: () => `最大生命 +${s.maxHp}，护甲 +${s.armor}，每 5 秒回血 +${s.regen}。有来源的伤害有 ${percent(p.chance)}% 概率格挡 ${p.amount} 点，无来源的伤害不触发。多件只使用最高强化等级的一份格挡，不叠加概率或减免；各级格挡参数不变。`,
      satanic: () => `物理攻击 +${s.attackDamage}，最大生命 +${s.maxHp}，护甲 +${s.armor}，物理普攻吸血 +${s.lifesteal}%，每 5 秒回血 +${s.regen}。生命低于 ${percent(p.threshold)}% 时自动狂热，持续 ${p.duration} 秒、冷却 ${p.cooldown} 秒，期间直接命中的非元素普攻额外获得 ${p.lifesteal}% 吸血，总吸血上限 65%。多件共用狂热与冷却，不叠加额外吸血；各级狂热参数不变。`,
      aghanim: () => `法术攻击 +${s.elemental}，最大生命 +${s.maxHp}，最大法力 +${s.maxMana}，每秒回蓝 +${s.manaRegen}，主动冷却缩减 +${s.abilityHaste}%。已支持强化的主动伤害或增益 ×${p.multiplier.toFixed(2)}；多把只取最高倍率，蓝耗不变，不额外增加持续时间、范围或数量。`,
      powerTreads: () => `最大生命 +${s.maxHp}，移动速度 +${s.speed}%，攻速 +${s.attackSpeed}%。属性随强化等级成长，沿用角色原有移动与基础攻击规则。`,
      radiance: () => `物理攻击 +${s.attackDamage}，所有伤害 +${s.damage}%。灼热光环每 ${p.interval} 秒对半径 ${p.radius} 内敌人造成 ${p.damage} 基础伤害，再应用一次所有伤害加成。多件只取最高阶光环，不叠加伤害或频率；灼烧不暴击、不吸血、不触发装备被动或普攻计数。`,
      desolator: () => `物理攻击 +${s.attackDamage}。物理普攻命中存活目标后施加 ${p.duration} 秒破甲标记，使后续物理普攻伤害提高 ${percent(p.multiplier)}%。首次施加标记的命中不受该标记加成；重复命中刷新持续时间，多件只取最高阶、不叠加倍率。标记不独立造成伤害，不增强技能、元素普攻、灼烧或幻影。`,
      skadi: () => `物理攻击 +${s.attackDamage}，最大生命 +${s.maxHp}，最大法力 +${s.maxMana}，攻速 +${s.attackSpeed}%。基础攻击命中存活敌人后使其移动速度降低 ${percent(p.slow)}%，持续 ${p.duration} 秒。重复命中刷新持续时间，多件只取最高阶、不叠加减速；减速不独立造成伤害，不改变敌人攻击频率。`,
      manta: () => `物理攻击 +${s.attackDamage}，攻速 +${s.attackSpeed}%，移速 +${s.speed}%，闪避 +${s.dodge}%。每 ${p.hits} 次有效基础攻击发射两道幻影，各造成触发普攻暴击前伤害的 ${percent(p.ratio)}%，再应用一次所有伤害加成。同一次攻击命中多个敌人只计一次，多件只取最高阶、共用计数。幻影不暴击、不吸血、不触发装备被动或普攻计数。`
    },
    'zh-TW': {
      mjollnir: () => `物理攻擊 +${s.attackDamage}，攻速 +${s.attackSpeed}%。有效普攻有 ${percent(p.chance)}% 機率觸發連鎖，最多命中 ${p.jumps + 1} 個目標；首跳 ${p.damage} + 法術攻擊 × 0.4，每跳保留 70% 傷害，跳距 190。雷錘／漩渦只取最強，共用 0.2 秒間隔；連鎖不暴擊、不吸血、不觸發其他被動。`,
      battlefury: () => `物理攻擊 +${s.attackDamage}，每 5 秒回血 +${s.regen}。每次近戰普攻以首個有效命中為中心，對半徑 ${p.radius} 內其他敵人造成暴擊前傷害的 ${percent(p.damageRatio)}% 分裂，所有傷害加成只計算一次。只取最強分裂；分裂不暴擊、不吸血、不觸發其他被動。`,
      buriza: () => `物理攻擊 +${s.attackDamage}，暴擊率 +${s.crit}%，暴擊傷害 +${s.critDamage}%。基礎攻擊直接命中可暴擊，不產生範圍傷害。`,
      butterfly: () => `物理攻擊 +${s.attackDamage}，攻速 +${s.attackSpeed}%，閃避 +${s.dodge}%。保持原有普攻與閃避規則，不追加攻擊或無敵時間。`,
      vanguard: () => `最大生命 +${s.maxHp}，護甲 +${s.armor}，每 5 秒回血 +${s.regen}。有來源的傷害有 ${percent(p.chance)}% 機率格擋 ${p.amount} 點，無來源的傷害不觸發。多件只使用最高強化等級的一份格擋，不疊加機率或減免；各級格擋參數不變。`,
      satanic: () => `物理攻擊 +${s.attackDamage}，最大生命 +${s.maxHp}，護甲 +${s.armor}，物理普攻吸血 +${s.lifesteal}%，每 5 秒回血 +${s.regen}。生命低於 ${percent(p.threshold)}% 時自動狂熱，持續 ${p.duration} 秒、冷卻 ${p.cooldown} 秒，期間直接命中的非元素普攻額外獲得 ${p.lifesteal}% 吸血，總吸血上限 65%。多件共用狂熱與冷卻，不疊加額外吸血；各級狂熱參數不變。`,
      aghanim: () => `法術攻擊 +${s.elemental}，最大生命 +${s.maxHp}，最大法力 +${s.maxMana}，每秒回魔 +${s.manaRegen}，主動冷卻縮減 +${s.abilityHaste}%。已支援強化的主動傷害或增益 ×${p.multiplier.toFixed(2)}；多把只取最高倍率，耗魔不變，不額外增加持續時間、範圍或數量。`,
      powerTreads: () => `最大生命 +${s.maxHp}，移動速度 +${s.speed}%，攻速 +${s.attackSpeed}%。屬性隨強化等級成長，沿用角色原有移動與基礎攻擊規則。`,
      radiance: () => `物理攻擊 +${s.attackDamage}，所有傷害 +${s.damage}%。灼熱光環每 ${p.interval} 秒對半徑 ${p.radius} 內敵人造成 ${p.damage} 基礎傷害，再套用一次所有傷害加成。多件只取最高階光環，不疊加傷害或頻率；灼燒不暴擊、不吸血、不觸發裝備被動或普攻計數。`,
      desolator: () => `物理攻擊 +${s.attackDamage}。物理普攻命中存活目標後施加 ${p.duration} 秒破甲標記，使後續物理普攻傷害提高 ${percent(p.multiplier)}%。首次施加標記的命中不受該標記加成；重複命中刷新持續時間，多件只取最高階、不疊加倍率。標記不獨立造成傷害，不增強技能、元素普攻、灼燒或幻影。`,
      skadi: () => `物理攻擊 +${s.attackDamage}，最大生命 +${s.maxHp}，最大法力 +${s.maxMana}，攻速 +${s.attackSpeed}%。基礎攻擊命中存活敵人後使其移動速度降低 ${percent(p.slow)}%，持續 ${p.duration} 秒。重複命中刷新持續時間，多件只取最高階、不疊加減速；減速不獨立造成傷害，不改變敵人攻擊頻率。`,
      manta: () => `物理攻擊 +${s.attackDamage}，攻速 +${s.attackSpeed}%，移速 +${s.speed}%，閃避 +${s.dodge}%。每 ${p.hits} 次有效基礎攻擊發射兩道幻影，各造成觸發普攻暴擊前傷害的 ${percent(p.ratio)}%，再套用一次所有傷害加成。同一次攻擊命中多個敵人只計一次，多件只取最高階、共用計數。幻影不暴擊、不吸血、不觸發裝備被動或普攻計數。`
    },
    en: {
      mjollnir: () => `Physical attack +${s.attackDamage}; attack speed +${s.attackSpeed}%. Successful basic attacks have a ${percent(p.chance)}% chance to chain to ${p.jumps + 1} targets: first hit ${p.damage} + magic attack × 0.4, then 70% damage per jump within 190 range. Mjollnir/Maelstrom use only the strongest proc and share a 0.2 sec interval. Lightning cannot crit, lifesteal or trigger other passives.`,
      battlefury: () => `Physical attack +${s.attackDamage}; HP per 5 sec +${s.regen}. Each melee basic attack cleaves other enemies within ${p.radius} of its first valid hit for ${percent(p.damageRatio)}% of its pre-crit damage, applying all-damage bonuses once. Only the strongest cleave applies; cleave cannot crit, lifesteal or trigger other passives.`,
      buriza: () => `Physical attack +${s.attackDamage}; crit chance +${s.crit}%; critical damage +${s.critDamage}%. Direct basic attack hits can crit; no area damage is added.`,
      butterfly: () => `Physical attack +${s.attackDamage}; attack speed +${s.attackSpeed}%; dodge +${s.dodge}%. Existing basic attacks and dodge rules remain; no extra attacks or invulnerability.`,
      vanguard: () => `Max HP +${s.maxHp}; armor +${s.armor}; HP per 5 sec +${s.regen}. Hits with a source have a ${percent(p.chance)}% chance to block ${p.amount} damage; damage without a source cannot trigger it. Only the highest-level block passive applies; chances and reductions do not stack. Block parameters stay the same at every level.`,
      satanic: () => `Physical attack +${s.attackDamage}; max HP +${s.maxHp}; armor +${s.armor}; physical basic attack lifesteal +${s.lifesteal}%; HP per 5 sec +${s.regen}. Below ${percent(p.threshold)}% HP, rage activates for ${p.duration} sec with a ${p.cooldown} sec cooldown. During rage, direct non-elemental basic attack hits gain an extra ${p.lifesteal}% lifesteal, capped at 65% total. All copies share rage and its cooldown; extra lifesteal does not stack. Rage parameters stay the same at every level.`,
      aghanim: () => `Magic attack +${s.elemental}; max HP +${s.maxHp}; max mana +${s.maxMana}; mana per sec +${s.manaRegen}; active cooldown reduction +${s.abilityHaste}%. Supported active damage or buffs ×${p.multiplier.toFixed(2)}; only the highest multiplier applies. Mana cost, duration, range and counts do not change.`,
      powerTreads: () => `Max HP +${s.maxHp}; move speed +${s.speed}%; attack speed +${s.attackSpeed}%. Stats grow with upgrade level, following the hero's existing movement and basic attack rules.`,
      radiance: () => `Physical attack +${s.attackDamage}; all damage +${s.damage}%. The aura deals ${p.damage} base damage every ${p.interval} sec to enemies within ${p.radius} range, applying all-damage bonuses once. Only the highest-level aura applies; damage and frequency do not stack. Burns cannot crit, lifesteal, trigger equipment passives or count as basic attacks.`,
      desolator: () => `Physical attack +${s.attackDamage}. Physical basic attacks mark surviving targets for ${p.duration} sec, increasing subsequent physical basic attack damage by ${percent(p.multiplier)}%. The first hit that applies the mark does not benefit from it. Further hits refresh the duration; only the highest-level mark applies and multipliers do not stack. The mark deals no damage and does not amplify skills, elemental basic attacks, burns or mirror strikes.`,
      skadi: () => `Physical attack +${s.attackDamage}; max HP +${s.maxHp}; max mana +${s.maxMana}; attack speed +${s.attackSpeed}%. Basic attacks slow surviving enemies' movement by ${percent(p.slow)}% for ${p.duration} sec. Further hits refresh the duration; only the highest-level slow applies and slows do not stack. The slow deals no damage and does not change enemy attack frequency.`,
      manta: () => `Physical attack +${s.attackDamage}; attack speed +${s.attackSpeed}%; move speed +${s.speed}%; dodge +${s.dodge}%. Every ${p.hits} successful basic attacks fire two mirror strikes, each dealing ${percent(p.ratio)}% of the triggering attack's pre-crit damage, with all-damage bonuses applied once. Each attack counts once even if it hits multiple enemies; all copies share the counter and use the highest-level passive. Mirror strikes cannot crit, lifesteal, trigger equipment passives or count as basic attacks.`
    }
  };
  const caps = {
    'zh-CN': '属性汇总后：暴击率上限 90%，闪避上限 55%，冷却缩减上限 60%，攻击间隔最短 0.09 秒；溢出不转化。',
    'zh-TW': '屬性彙總後：暴擊率上限 90%，閃避上限 55%，冷卻縮減上限 60%，攻擊間隔最短 0.09 秒；溢出不轉化。',
    en: 'After all stats are combined: crit caps at 90%, dodge at 55%, cooldown reduction at 60%, and attack interval at a minimum of 0.09 sec. Excess stats are not converted.'
  };
  const language = Object.hasOwn(descriptions, locale) ? locale : 'zh-CN';
  return `${descriptions[language][def.id]()} ${caps[language]}`;
}
