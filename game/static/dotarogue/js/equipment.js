export const EQUIPMENT_CAPACITY = 12;

export function equipmentIconPath(id) {
  return `./assets/art/dota1/equipment/${id}.png`;
}

export const EQUIPMENT = {
  mithrilHammer: {
    kind: "component",
    grade: 1,
    price: 16,
    name: "秘银锤",
    nameTw: "秘銀錘",
    nameEn: "Mithril Hammer",
    desc: "攻击力 +5。",
    descTw: "攻擊力 +5。",
    descEn: "Attack power +5.",
    stats: { attackPower: 5 }
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
    desc: "攻击力 +6。",
    descTw: "攻擊力 +6。",
    descEn: "Attack power +6.",
    stats: { attackPower: 6 }
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
    desc: "攻击力 +7。",
    descTw: "攻擊力 +7。",
    descEn: "Attack power +7.",
    stats: { attackPower: 7 }
  },
  broadsword: {
    kind: "component",
    grade: 2,
    price: 20,
    name: "阔剑",
    nameTw: "闊劍",
    nameEn: "Broadsword",
    desc: "攻击力 +6。",
    descTw: "攻擊力 +6。",
    descEn: "Attack power +6.",
    stats: { attackPower: 6 }
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
    desc: "攻击力 +3。",
    descTw: "攻擊力 +3。",
    descEn: "Attack power +3.",
    stats: { attackPower: 3 }
  },
  demonEdge: {
    kind: "component",
    grade: 2,
    price: 30,
    name: "恶魔刀锋",
    nameTw: "惡魔刀鋒",
    nameEn: "Demon Edge",
    desc: "攻击力 +10。",
    descTw: "攻擊力 +10。",
    descEn: "Attack power +10.",
    stats: { attackPower: 10 }
  },
  quarterstaff: {
    kind: "component",
    grade: 1,
    price: 16,
    name: "短棍",
    nameTw: "短棍",
    nameEn: "Quarterstaff",
    desc: "攻击力 +3，攻速 +8%。",
    descTw: "攻擊力 +3，攻速 +8%。",
    descEn: "Attack power +3; Attack speed +8%.",
    stats: { attackPower: 3, "attackSpeed": 8 }
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
    desc: "普攻吸血 +5%。",
    descTw: "普攻吸血 +5%。",
    descEn: "Basic attack lifesteal +5%.",
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
    desc: "最大生命 +12，攻击力 +4。",
    descTw: "最大生命 +12，攻擊力 +4。",
    descEn: "Max HP +12; Attack power +4.",
    stats: { "maxHp": 12, attackPower: 4 }
  },
  staffWizardry: {
    kind: "component",
    grade: 2,
    price: 22,
    name: "魔力法杖",
    nameTw: "魔力法杖",
    nameEn: "Staff of Wizardry",
    desc: "攻击力 +5。",
    descTw: "攻擊力 +5。",
    descEn: "Attack power +5.",
    stats: { attackPower: 5 }
  },
  robeMagi: {
    kind: "component",
    grade: 1,
    price: 14,
    name: "法师长袍",
    nameTw: "法師長袍",
    nameEn: "Robe of the Magi",
    desc: "攻击力 +3。",
    descTw: "攻擊力 +3。",
    descEn: "Attack power +3.",
    stats: { attackPower: 3 }
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
    desc: "攻击力 +8，攻速 +8%。普攻有20%概率释放连锁闪电，最多命中3个目标。",
    descTw: "攻擊力 +8，攻速 +8%。普攻有20%機率釋放連鎖閃電，最多命中3個目標。",
    descEn: "Attack power +8; Attack speed +8%. Basic attacks have a 20% chance to chain lightning to up to 3 enemies.",
    stats: { attackPower: 8, "attackSpeed": 8 },
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
    desc: "攻击力 +10，暴击率 +8%，暴击伤害 +20%。",
    descTw: "攻擊力 +10，暴擊率 +8%，暴擊傷害 +20%。",
    descEn: "Attack power +10; Crit chance +8%; Critical damage +20%.",
    stats: { attackPower: 10, "crit": 8, "critDamage": 20 },
    recipe: ["broadsword", "bladesAttack"]
  },
  helmDominator: {
    kind: "intermediate",
    grade: 3,
    price: 38,
    name: "支配头盔",
    nameTw: "支配頭盔",
    nameEn: "Helm of the Dominator",
    desc: "攻击力 +4，护甲 +3，普攻吸血 +9%，每 5 秒回血 +1。",
    descTw: "攻擊力 +4，護甲 +3，普攻吸血 +9%，每 5 秒回血 +1。",
    descEn: "Attack power +4, armor +3, basic attack lifesteal +9%, regeneration +1 every 5 sec.",
    stats: { attackPower: 4, "armor": 3, "lifesteal": 9, "regen": 1 },
    recipe: ["helmIron", "maskDeath"]
  },
  oblivionStaff: {
    kind: "intermediate",
    grade: 3,
    price: 42,
    name: "空明杖",
    nameTw: "空明杖",
    nameEn: "Oblivion Staff",
    desc: "攻击力 +9，每秒回蓝 +1.5，攻速 +8%。",
    descTw: "攻擊力 +9，每秒回魔 +1.5，攻速 +8%。",
    descEn: "Attack power +9; Mana per sec +1.5; Attack speed +8%.",
    stats: { attackPower: 9, "manaRegen": 1.5, "attackSpeed": 8 },
    recipe: ["staffWizardry", "robeMagi", "sobiMask"]
  },
  mjollnir: {
    kind: "finished",
    grade: 5,
    price: 86,
    name: "雷神之锤",
    nameTw: "雷神之錘",
    nameEn: "Mjollnir",
    desc: "攻击力 +14，攻速 +18%。普攻有25%概率释放强化连锁闪电，最多命中4个目标。",
    descTw: "攻擊力 +14，攻速 +18%。普攻有25%機率釋放強化連鎖閃電，最多命中4個目標。",
    descEn: "Attack power +14; Attack speed +18%. Basic attacks have a 25% chance to chain stronger lightning to up to 4 enemies.",
    stats: { attackPower: 14, "attackSpeed": 18 },
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
    desc: "攻击力 +16，每 5 秒回血 +5。Lv.1 冲击分裂：近战有效普攻对首个命中周围半径 88 内的其他敌人造成 35% 分裂伤害；升阶变为扇面横扫、回旋环斩。",
    descTw: "攻擊力 +16，每 5 秒回血 +5。Lv.1 衝擊分裂：近戰有效普攻對首個命中周圍半徑 88 內的其他敵人造成 35% 分裂傷害；升階變為扇面橫掃、迴旋環斬。",
    descEn: "Attack power +16; HP per 5 sec +5. Lv.1 Impact Cleave: successful melee basics cleave other enemies within 88 of the first hit for 35% damage. Evolves into Sweeping Arc, then Whirling Slash.",
    stats: { attackPower: 16, "regen": 5 },
    recipe: ["claymore", "broadsword", "perseverance"],
    passive: {"id": "cleave", "radius": 88, "damageRatio": 0.35, "mode": "impact", "arcDegrees": 360}
  },
  buriza: {
    kind: "finished",
    grade: 5,
    price: 92,
    name: "大炮",
    nameTw: "大炮",
    nameEn: "Buriza-Dokyanon",
    desc: "攻击力 +22，暴击率 +14%，暴击伤害 +45%。",
    descTw: "攻擊力 +22，暴擊率 +14%，暴擊傷害 +45%。",
    descEn: "Attack power +22; Crit chance +14%; Critical damage +45%.",
    stats: { attackPower: 22, "crit": 14, "critDamage": 45 },
    recipe: ["crystalys", "demonEdge"]
  },
  butterfly: {
    kind: "finished",
    grade: 5,
    price: 88,
    name: "蝴蝶",
    nameTw: "蝴蝶",
    nameEn: "the Butterfly",
    desc: "攻击力 +14，攻速 +25%，闪避 +16%。",
    descTw: "攻擊力 +14，攻速 +25%，閃避 +16%。",
    descEn: "Attack power +14; Attack speed +25%; Dodge +16%.",
    stats: { attackPower: 14, "attackSpeed": 25, "dodge": 16 },
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
    desc: "攻击力 +12，最大生命 +14，护甲 +4，普攻吸血 +18%，每 5 秒回血 +1。生命低于 35% 时自动狂热：5 秒内额外吸血 12%，冷却 20 秒。",
    descTw: "攻擊力 +12，最大生命 +14，護甲 +4，普攻吸血 +18%，每 5 秒回血 +1。生命低於 35% 時自動狂熱：5 秒內額外吸血 12%，冷卻 20 秒。",
    descEn: "Attack power +12, max HP +14, armor +4, basic attack lifesteal +18%, regeneration +1 every 5 sec. Below 35% HP, gain another 12% lifesteal for 5 sec; 20 sec cooldown.",
    stats: { attackPower: 12, "maxHp": 14, "armor": 4, "lifesteal": 18, "regen": 1 },
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
    desc: "攻击力 +12，最大生命 +10，最大法力 +50，每秒回蓝 +2，主动技能冷却缩减 +15%；主动技能伤害或增益效果强化 25%。",
    descTw: "攻擊力 +12，最大生命 +10，最大法力 +50，每秒回魔 +2，主動技能冷卻縮減 +15%；主動技能傷害或增益效果強化 25%。",
    descEn: "Attack power +12, max HP +10, max mana +50, mana regeneration +2/sec, active cooldown reduction +15%; active skill damage or buffs +25%.",
    stats: { attackPower: 12, "maxHp": 10, "maxMana": 50, "manaRegen": 2, "abilityHaste": 15 },
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
    desc: "攻击力 +18，所有伤害 +8%。灼热光环每秒灼烧 165 范围内敌人。",
    descTw: "攻擊力 +18，所有傷害 +8%。灼熱光環每秒灼燒 165 範圍內敵人。",
    descEn: "Attack power +18; all damage +8%. A searing aura burns enemies within 165 range every second.",
    stats: { attackPower: 18, "damage": 8 },
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
    desc: "攻击力 +20。普攻命中后使目标进入易伤状态 4 秒，受到的后续伤害提高 18%。",
    descTw: "攻擊力 +20。普攻命中後使目標進入易傷狀態 4 秒，受到的後續傷害提高 18%。",
    descEn: "Attack power +20. Basic attacks mark targets for 4 sec, increasing subsequent damage taken by 18%.",
    stats: { attackPower: 20 },
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
    desc: "攻击力 +12，最大生命 +20，最大法力 +35，攻速 +10%。普攻命中使敌人减速 45%，持续 2.5 秒。",
    descTw: "攻擊力 +12，最大生命 +20，最大法力 +35，攻速 +10%。普攻命中使敵人減速 45%，持續 2.5 秒。",
    descEn: "Attack power +12; max HP +20; max mana +35; attack speed +10%. Basic attacks slow enemies by 45% for 2.5 sec.",
    stats: { attackPower: 12, "maxHp": 20, "maxMana": 35, "attackSpeed": 10 },
    recipe: ["pointBooster", "vitalityBooster", "talismanEvasion"],
    passive: {"id": "frostAttack", "duration": 2.5, "slow": 0.45}
  },
  dagon: {
    kind: "finished", grade: 4, price: 64,
    name: "红杖（大根）", nameTw: "紅杖（達貢之神力）", nameEn: "Dagon",
    desc: "Lv.1 单束冲击：每 6 秒自动向 500 范围内无遮挡敌人释放能量冲击，优先精英与首领；升阶变为双束分光、三束棱光，共享该次总伤害。",
    descTw: "Lv.1 單束衝擊：每 6 秒自動向 500 範圍內無遮擋敵人釋放能量衝擊，優先精英與首領；升階變為雙束分光、三束稜光，共享該次總傷害。",
    descEn: "Lv.1 Focused Beam: automatically blast an unobstructed enemy within 500 every 6 sec, prioritizing elites and bosses. Evolves into Twin Split, then Prismatic Trio, sharing each cast's total damage.",
    stats: { attackPower: 11, manaRegen: 1 },
    recipe: ["staffWizardry", "bladesAttack", "sobiMask"],
    passive: { id: "arcaneBurst", cooldown: 6, range: 500, damage: 38, attackRatio: .7, targets: 1, spreadDegrees: 0 }
  },
  bloodstone: {
    kind: "finished", grade: 5, price: 94,
    name: "血精石", nameTw: "血精石", nameEn: "Bloodstone",
    desc: "英雄技能按实际伤害回血，范围与持续伤害回复效率降低。",
    descTw: "英雄技能按實際傷害回血，範圍與持續傷害回復效率降低。",
    descEn: "Hero skills heal from actual damage; area and periodic damage heal less.",
    stats: { maxHp: 12, maxMana: 45, regen: 3, manaRegen: 2, lifesteal: 5 },
    recipe: ["perseverance", "pointBooster", "maskDeath"],
    passive: { id: "skillLeech", ratio: .08, areaRatio: .25, capPerSecond: .04 }
  },
  orchid: {
    kind: "finished", grade: 5, price: 82,
    name: "紫苑", nameTw: "紫苑", nameEn: "Orchid Malevolence",
    desc: "普攻标记敌人 5 秒，成功施放主动技能时引爆 600 范围内一个标记。",
    descTw: "普攻標記敵人 5 秒，成功施放主動技能時引爆 600 範圍內一個標記。",
    descEn: "Basic attacks mark enemies for 5 sec; a successful active skill detonates one mark within 600 range.",
    stats: { attackPower: 20, attackSpeed: 12, manaRegen: 2 },
    recipe: ["oblivionStaff", "claymore"],
    passive: { id: "soulMark", duration: 5, range: 600, damage: 16, attackRatio: .5 }
  },
  bladeMail: {
    kind: "finished", grade: 4, price: 62,
    name: "刃甲", nameTw: "刃甲", nameEn: "Blade Mail",
    desc: "实际承伤后向存活攻击者反伤；每击有上限，共用 0.4 秒触发间隔。",
    descTw: "實際承傷後向存活攻擊者反傷；每擊有上限，共用 0.4 秒觸發間隔。",
    descEn: "Reflects actual HP lost to a living attacker, with a per-hit cap and shared 0.4 sec interval.",
    stats: { attackPower: 11, armor: 4 },
    recipe: ["broadsword", "helmIron", "robeMagi"],
    passive: { id: "damageReturn", ratio: .35, cap: 14, interval: .4 }
  },
  heart: {
    kind: "finished", grade: 5, price: 92,
    name: "魔龙之心", nameTw: "魔龍之心", nameEn: "Heart of Tarrasque",
    desc: "连续 5 秒没有实际承伤后，按最大生命持续恢复。",
    descTw: "連續 5 秒沒有實際承傷後，按最大生命持續恢復。",
    descEn: "After 5 sec without losing HP to damage, regenerates a percentage of maximum HP.",
    stats: { maxHp: 30, attackPower: 5, regen: 4 },
    recipe: ["reaver", "vitalityBooster", "ringHealth"],
    passive: { id: "restoration", delay: 5, ratio: .015 }
  },
  phaseBoots: {
    kind: "finished", grade: 3, price: 50,
    name: "相位鞋", nameTw: "相位鞋", nameEn: "Phase Boots",
    desc: "冲刺结束后短时加速，并强化 4 秒内的下一次有效普攻。",
    descTw: "衝刺結束後短時加速，並強化 4 秒內的下一次有效普攻。",
    descEn: "After a dash ends, briefly move faster and empower the next successful basic attack within 4 sec.",
    stats: { speed: 14, attackPower: 6, armor: 3, regen: 1 },
    recipe: ["bootsSpeed", "bladesAttack", "helmIron"],
    passive: { id: "phaseStrike", speed: 20, duration: 2, attackWindow: 4, damage: 8, attackRatio: .3 }
  },
  cyclone: {
    kind: "finished", grade: 4, price: 70,
    name: "风杖", nameTw: "風杖", nameEn: "Eul's Scepter",
    desc: "每 9 秒自动吹起 160 范围内最近敌人；精英和首领控制时长降低。",
    descTw: "每 9 秒自動吹起 160 範圍內最近敵人；精英和首領控制時長降低。",
    descEn: "Every 9 sec, automatically lifts the nearest enemy within 160 range; elites and bosses recover sooner.",
    stats: { attackPower: 10, manaRegen: 2, speed: 6 },
    recipe: ["staffWizardry", "robeMagi", "voidStone"],
    passive: { id: "cyclone", cooldown: 9, range: 160, duration: 1 }
  },
  necronomicon: {
    kind: "finished", grade: 5, price: 88,
    name: "死灵书", nameTw: "死靈書", nameEn: "Necronomicon",
    desc: "每 12 秒召唤短时存在的战士与射手，最多两名；召唤击杀不产生奖励。",
    descTw: "每 12 秒召喚短時存在的戰士與射手，最多兩名；召喚擊殺不產生獎勵。",
    descEn: "Every 12 sec summons a temporary warrior and archer, up to two; their kills grant no rewards.",
    stats: { attackPower: 13, armor: 3, lifesteal: 9, regen: 1, manaRegen: 1 },
    recipe: ["helmDominator", "staffWizardry", "sobiMask"],
    passive: { id: "necromancy", cooldown: 12, duration: 6, damage: 10, attackRatio: .25 }
  },
  monkeyKingBar: {
    kind: "finished", grade: 5, price: 96,
    name: "金箍棒", nameTw: "金箍棒", nameEn: "Monkey King Bar",
    desc: "攻击力 +12，攻速 +12%。每4次有效普攻沿命中方向释放贯穿冲击；升阶减少间隔并增加长度、宽度、目标数与伤害。",
    descTw: "攻擊力 +12，攻速 +12%。每4次有效普攻沿命中方向釋放貫穿衝擊；升階減少間隔並增加長度、寬度、目標數與傷害。",
    descEn: "Attack power +12; attack speed +12%. Every 4 successful basics release a piercing strike along the hit direction; upgrades reduce the interval and increase reach, width, targets and damage.",
    stats: { attackPower: 12, attackSpeed: 12 },
    recipe: ["demonEdge", "quarterstaff", "bladesAttack"],
    passive: { id: "piercingStrike", hits: 4, range: 460, width: 16, targets: 2, damageRatio: .45 }
  },
  meteorHammer: {
    kind: "finished", grade: 5, price: 84,
    name: "陨星锤", nameTw: "隕星錘", nameEn: "Meteor Hammer",
    desc: "攻击力 +14，每5秒回血 +2。站定0.8秒后轰击450内合法敌人，冷却7秒；升阶缩短蓄力并增加范围与伤害。",
    descTw: "攻擊力 +14，每5秒回血 +2。站定0.8秒後轟擊450內合法敵人，冷卻7秒；升階縮短蓄力並增加範圍與傷害。",
    descEn: "Attack power +14; HP per 5 sec +2. Stand still for 0.8 sec to strike a legal enemy within 450, with a 7 sec cooldown. Upgrades shorten charge time and increase area and damage.",
    stats: { attackPower: 14, regen: 2 },
    recipe: ["mithrilHammer", "staffWizardry", "ringHealth"],
    passive: { id: "meteorStrike", cooldown: 7, range: 450, radius: 64, damage: 30, attackRatio: .6, hold: .8 }
  },
  divineRapier: {
    kind: "finished", grade: 5, price: 140, hidden: true,
    name: "圣剑", nameTw: "聖劍", nameEn: "Divine Rapier",
    desc: "通关第10波解锁本局商店与铸造。攻击力 +36；每5次有效普攻释放剑气，持有时承伤增加15%。升阶强化剑气，同时增加承伤风险。",
    descTw: "通關第10波解鎖本局商店與鑄造。攻擊力 +36；每5次有效普攻釋放劍氣，持有時承傷增加15%。升階強化劍氣，同時增加承傷風險。",
    descEn: "Clear wave 10 to unlock this run's shop and forging access. Attack power +36; every 5 successful basics release a divine edge. Take 15% more damage while equipped; upgrades strengthen the edge and increase this risk.",
    stats: { attackPower: 36 },
    recipe: ["demonEdge", "claymore", "broadsword"],
    passive: { id: "divineEdge", hits: 5, range: 560, width: 16, targets: 6, damage: 40, attackRatio: .5, incomingAmp: .15 }
  },
  manta: {
    kind: "finished",
    grade: 5,
    price: 90,
    name: "分身斧",
    nameTw: "分身斧",
    nameEn: "Manta Style",
    desc: "攻击力 +10，攻速 +20%，移速 +10%，闪避 +10%。Lv.1 双影投射：每 5 次有效普攻发射两道幻影，各造成 65% 伤害；升阶变为四影扇射、六影齐射，总伤害在各道间均分。",
    descTw: "攻擊力 +10，攻速 +20%，移速 +10%，閃避 +10%。Lv.1 雙影投射：每 5 次有效普攻發射兩道幻影，各造成 65% 傷害；升階變為四影扇射、六影齊射，總傷害在各道間均分。",
    descEn: "Attack power +10; attack speed +20%; move speed +10%; dodge +10%. Lv.1 Twin Mirrors: every 5 successful basics fire two mirrors at 65% damage each. Evolves into Fourfold Fan, then Sixfold Volley, dividing total damage evenly.",
    stats: { attackPower: 10, "attackSpeed": 20, "speed": 10, "dodge": 10 },
    recipe: ["quarterstaff", "bootsSpeed", "talismanEvasion"],
    passive: {"id": "mirrorImage", "hits": 5, "ratio": 0.65, "spread": 0.16, "projectiles": 2}
  }
};

// Finished-weapon levels are independent of the existing equipment grade.
export const EQUIPMENT_UPGRADES = {
  mjollnir: { chance: [0.25, 0.3, 0.35], damage: [42, 84, 126], jumps: [3, 4, 5] },
  battlefury: { radius: [88, 108, 132], damageRatio: [0.35, 0.45, 0.6], mode: ['impact', 'sweep', 'ring'], arcDegrees: [360, 200, 360] },
  buriza: {},
  butterfly: {},
  vanguard: {},
  satanic: {},
  aghanim: { multiplier: [1.25, 1.4, 1.6] },
  powerTreads: {},
  radiance: { radius: [165, 185, 205], damage: [8, 16, 24] },
  desolator: { multiplier: [0.18, 0.26, 0.35] },
  skadi: { slow: [0.45, 0.55, 0.65], duration: [2.5, 3, 3.5] },
  manta: { ratio: [0.65, 0.85, 1.1], projectiles: [2, 4, 6], spread: [.16, .35, .55] },
  dagon: { damage: [38, 76, 114], targets: [1, 2, 3], spreadDegrees: [0, 90, 150] },
  bloodstone: { ratio: [.08, .12, .16] },
  orchid: { damage: [16, 32, 48], attackRatio: [.5, .65, .8] },
  bladeMail: { ratio: [.35, .5, .65], cap: [14, 28, 42] },
  heart: { ratio: [.015, .02, .025] },
  phaseBoots: { speed: [20, 28, 36], damage: [8, 16, 24] },
  cyclone: { duration: [1, 1.3, 1.6] },
  necronomicon: { duration: [6, 7, 8], damage: [10, 18, 26] },
  monkeyKingBar: { hits: [4, 3, 2], range: [460, 520, 580], width: [16, 20, 24], targets: [2, 3, 4], damageRatio: [.45, .55, .65] },
  meteorHammer: { hold: [.8, .6, .4], radius: [64, 84, 104], damage: [30, 60, 90] },
  divineRapier: { hits: [5, 4, 3], width: [16, 24, 32], targets: [6, 8, 10], damage: [40, 80, 120], incomingAmp: [.15, .2, .25] }
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

function equipmentEvolutionDescription(def, locale, compact) {
  if (!['battlefury', 'dagon', 'manta'].includes(def.id)) return '';
  const language = ['zh-CN', 'zh-TW', 'en'].includes(locale) ? locale : 'zh-CN';
  const s = def.stats, p = def.passive, percent = value => Number((value * 100).toFixed(2));
  const names = {
    'zh-CN': {
      battlefury: ['冲击分裂', '扇面横扫', '回旋环斩'],
      dagon: ['单束冲击', '双束分光', '三束棱光'],
      manta: ['双影投射', '四影扇射', '六影齐射']
    },
    'zh-TW': {
      battlefury: ['衝擊分裂', '扇面橫掃', '迴旋環斬'],
      dagon: ['單束衝擊', '雙束分光', '三束稜光'],
      manta: ['雙影投射', '四影扇射', '六影齊射']
    },
    en: {
      battlefury: ['Impact Cleave', 'Sweeping Arc', 'Whirling Slash'],
      dagon: ['Focused Beam', 'Twin Split', 'Prismatic Trio'],
      manta: ['Twin Mirrors', 'Fourfold Fan', 'Sixfold Volley']
    }
  };
  const title = `Lv.${def.level} · ${names[language][def.id][def.level - 1]}`;
  const halfSpread = Number((p.spread * 180 / Math.PI).toFixed(1));
  let text;
  if (language === 'en') {
    if (def.id === 'battlefury') {
      const area = p.mode === 'impact' ? `a ${p.radius}-radius circle around the first hit`
        : p.mode === 'sweep' ? `a ${p.arcDegrees}° arc of radius ${p.radius}, centered on the hero and aimed at the first hit`
          : `a ${p.arcDegrees}° circle of radius ${p.radius} around the hero`;
      text = `Attack power +${s.attackPower}; HP per 5 sec +${s.regen}. Successful melee basics cleave ${area} for ${percent(p.damageRatio)}% of pre-crit attack damage, excluding the first target. Once per attack; highest-level passive only. Cleave cannot crit, trigger basic lifesteal or trigger basic-hit passives or counters.`;
      if (!compact) text += ' All-damage bonuses apply once; ranged basics do not trigger cleave.';
    } else if (def.id === 'dagon') {
      const fan = p.targets > 1 ? ` Secondary targets must lie in a ${p.spreadDegrees}° fan aimed at the primary target.` : '';
      text = `Attack power +${s.attackPower}; mana/sec +${s.manaRegen}. Every ${p.cooldown} sec, fire up to ${p.targets} beam${p.targets > 1 ? 's' : ''} at unobstructed enemies within ${p.range}; the primary target prioritizes elites/bosses.${fan} Total base damage per cast: ${p.damage} + attack power × ${p.attackRatio}. One target takes all; with multiple targets, divide by actual target count using primary weight 2 and weight 1 for each secondary. Stays ready without a target.`;
      if (!compact) text += ' Only the highest-level passive applies. All-damage bonuses apply once; beams cannot crit, trigger basic lifesteal or trigger basic-hit passives or counters.';
    } else {
      text = `Attack power +${s.attackPower}; attack speed +${s.attackSpeed}%; move speed +${s.speed}%; dodge +${s.dodge}% (total cap 55%). Every ${p.hits} successful basics fire ${p.projectiles} mirror projectiles in a fan, dividing a total of ${percent(2 * p.ratio)}% pre-crit attack damage evenly. Mirrors cannot crit, trigger basic lifesteal or trigger basic-hit passives or counters.`;
      if (!compact) text += ` The fan extends about ${halfSpread}° to either side of the triggering hit direction. Each attack counts once even if it hits multiple enemies; all copies share the counter and use the highest-level passive. All-damage bonuses apply once; min attack interval 0.09 sec.`;
    }
    return `${title}. ${text}`;
  }
  if (language === 'zh-TW') {
    if (def.id === 'battlefury') {
      const area = p.mode === 'impact' ? `以首個命中為中心、半徑 ${p.radius} 的圓形`
        : p.mode === 'sweep' ? `以玩家為中心、朝首個命中方向的 ${p.arcDegrees}° 扇面，半徑 ${p.radius}`
          : `以玩家為中心、半徑 ${p.radius} 的 ${p.arcDegrees}° 整周範圍`;
      text = `攻擊力 +${s.attackPower}，每 5 秒回血 +${s.regen}。近戰有效普攻分裂範圍：${area}；首目標以外敵人受到觸發普攻暴擊前傷害的 ${percent(p.damageRatio)}%。每次攻擊僅一次，同類只取最高階；分裂不暴擊、不觸發普攻吸血、不觸發普攻命中被動或計數。`;
      if (!compact) text += '所有傷害加成只計算一次；遠程普攻不觸發。';
    } else if (def.id === 'dagon') {
      const fan = p.targets > 1 ? `副目標限朝向主目標的 ${p.spreadDegrees}° 扇面內。` : '';
      text = `攻擊力 +${s.attackPower}，每秒回魔 +${s.manaRegen}。每 ${p.cooldown} 秒向 ${p.range} 範圍內無遮擋敵人發射最多 ${p.targets} 束衝擊，主目標優先精英／首領。${fan}單次總基礎傷害 ${p.damage} + 攻擊力 × ${p.attackRatio}；僅一個目標時全額，多個時依實際目標數分攤，主目標權重 2、每個副目標權重 1。無目標保留就緒。`;
      if (!compact) text += '同類只取最高階；所有傷害加成只計算一次，衝擊不暴擊、不觸發普攻吸血、不觸發普攻命中被動或計數。';
    } else {
      text = `攻擊力 +${s.attackPower}，攻速 +${s.attackSpeed}%，移速 +${s.speed}%，閃避 +${s.dodge}%（總上限 55%）。每 ${p.hits} 次有效普攻扇形發射 ${p.projectiles} 道幻影，將觸發普攻暴擊前傷害的總倍率 ${percent(2 * p.ratio)}% 均分；幻影不暴擊、不觸發普攻吸血、不觸發普攻命中被動或計數。`;
      if (!compact) text += `以觸發命中方向為中心，左右各展開至約 ${halfSpread}°。同次攻擊命中多敵僅計一次，多件共用計數、只取最高階；所有傷害加成只計算一次，攻擊間隔最短 0.09 秒。`;
    }
  } else {
    if (def.id === 'battlefury') {
      const area = p.mode === 'impact' ? `以首个命中为中心、半径 ${p.radius} 的圆形`
        : p.mode === 'sweep' ? `以玩家为中心、朝首个命中方向的 ${p.arcDegrees}° 扇面，半径 ${p.radius}`
          : `以玩家为中心、半径 ${p.radius} 的 ${p.arcDegrees}° 整周范围`;
      text = `攻击力 +${s.attackPower}，每 5 秒回血 +${s.regen}。近战有效普攻分裂范围：${area}；首目标以外敌人受到触发普攻暴击前伤害的 ${percent(p.damageRatio)}%。每次攻击仅一次，同类只取最高阶；分裂不暴击、不触发普攻吸血、不触发普攻命中被动或计数。`;
      if (!compact) text += '所有伤害加成只计算一次；远程普攻不触发。';
    } else if (def.id === 'dagon') {
      const fan = p.targets > 1 ? `副目标限朝向主目标的 ${p.spreadDegrees}° 扇面内。` : '';
      text = `攻击力 +${s.attackPower}，每秒回蓝 +${s.manaRegen}。每 ${p.cooldown} 秒向 ${p.range} 范围内无遮挡敌人发射最多 ${p.targets} 束冲击，主目标优先精英／首领。${fan}单次总基础伤害 ${p.damage} + 攻击力 × ${p.attackRatio}；仅一个目标时全额，多个时依实际目标数分摊，主目标权重 2、每个副目标权重 1。无目标保留就绪。`;
      if (!compact) text += '同类只取最高阶；所有伤害加成只计算一次，冲击不暴击、不触发普攻吸血、不触发普攻命中被动或计数。';
    } else {
      text = `攻击力 +${s.attackPower}，攻速 +${s.attackSpeed}%，移速 +${s.speed}%，闪避 +${s.dodge}%（总上限 55%）。每 ${p.hits} 次有效普攻扇形发射 ${p.projectiles} 道幻影，将触发普攻暴击前伤害的总倍率 ${percent(2 * p.ratio)}% 均分；幻影不暴击、不触发普攻吸血、不触发普攻命中被动或计数。`;
      if (!compact) text += `以触发命中方向为中心，左右各展开至约 ${halfSpread}°。同次攻击命中多敌仅计一次，多件共用计数、只取最高阶；所有伤害加成只计算一次，攻击间隔最短 0.09 秒。`;
    }
  }
  return `${title}。${text}`;
}

function equipmentExtensionDescription(def, locale) {
  const s = def.stats, p = def.passive, pct = value => Number((value * 100).toFixed(2));
  const language = ['zh-CN', 'zh-TW', 'en'].includes(locale) ? locale : 'zh-CN';
  const labels = {
    'zh-CN': { attackPower: '攻击力', maxHp: '最大生命', maxMana: '最大法力', armor: '护甲', regen: '每 5 秒回血', manaRegen: '每秒回蓝', lifesteal: '普攻吸血', attackSpeed: '攻速', speed: '移速' },
    'zh-TW': { attackPower: '攻擊力', maxHp: '最大生命', maxMana: '最大法力', armor: '護甲', regen: '每 5 秒回血', manaRegen: '每秒回魔', lifesteal: '普攻吸血', attackSpeed: '攻速', speed: '移速' },
    en: { attackPower: 'Attack power', maxHp: 'Max HP', maxMana: 'Max mana', armor: 'Armor', regen: 'HP per 5 sec', manaRegen: 'Mana/sec', lifesteal: 'Basic lifesteal', attackSpeed: 'Attack speed', speed: 'Move speed' }
  };
  const descriptions = {
    'zh-CN': {
      monkeyKingBar: () => `每 ${p.hits} 次有效普攻向命中方向释放贯穿冲击，长 ${p.range}、半宽 ${p.width}，最多命中 ${p.targets} 个敌人，各造成触发普攻暴击前伤害的 ${pct(p.damageRatio)}%。同次攻击命中多敌仅计一次；多件共用计数。`,
      meteorHammer: () => `站定 ${p.hold} 秒后轰击 ${p.range} 范围内无遮挡敌人，半径 ${p.radius}，伤害 ${p.damage} + 攻击力 × ${p.attackRatio}；释放后冷却 ${p.cooldown} 秒。移动、冲刺或跳跃中断蓄力，没有合法目标不消耗就绪。`,
      divineRapier: () => `通关第10波后解锁本局商店与铸造。每 ${p.hits} 次有效普攻沿命中方向释放剑气，长 ${p.range}、半宽 ${p.width}，最多 ${p.targets} 个目标，各造成 ${p.damage} + 触发普攻暴击前伤害 × ${p.attackRatio}。持有时承伤增加 ${pct(p.incomingAmp)}%，同类风险只取最高。`,
      bloodstone: () => `英雄技能按实际伤害回复 ${pct(p.ratio)}%；范围／持续伤害效率为 ${pct(p.areaRatio)}%，滚动 1 秒最多回复最大生命的 ${pct(p.capPerSecond)}%。装备追加、幻影和装备召唤伤害不触发此技能回血。`,
      orchid: () => `普攻标记存活敌人 ${p.duration} 秒；成功施放主动技能时引爆 ${p.range} 范围内最近的一个标记，造成 ${p.damage} + 攻击力 × ${p.attackRatio} 基础伤害。不沉默，不自动施放 Q。`,
      bladeMail: () => `实际承伤后向存活攻击者反射 ${pct(p.ratio)}% 伤害，每击最多 ${p.cap} 点，共用 ${p.interval} 秒间隔。无来源、闪避或被护盾完全吸收时不触发。反伤不再放大全伤害。`,
      heart: () => `连续 ${p.delay} 秒未实际承伤后，每秒恢复最大生命的 ${pct(p.ratio)}%；再次承伤中断。被闪避或完全吸收的伤害不中断。`,
      phaseBoots: () => `冲刺结束后移速额外 +${p.speed}%，持续 ${p.duration} 秒；${p.attackWindow} 秒内下一次有效普攻追加 ${p.damage} + 攻击力 × ${p.attackRatio} 基础伤害。同次攻击仅一次。`,
      cyclone: () => `每 ${p.cooldown} 秒吹起 ${p.range} 范围内最近敌人 ${p.duration} 秒，暂停其移动与攻击；精英时长减半，首领仅 ${pct(.2)}%。目标仍可受伤，无目标保留就绪。`,
      necronomicon: () => `每 ${p.cooldown} 秒召唤一名战士和一名射手，持续 ${p.duration} 秒、最多两名。攻击间隔分别 0.9／1.1 秒，各造成 ${p.damage} + 攻击力 × ${p.attackRatio} 基础伤害。击杀不给材料、宝箱、经验或魂；不触发普攻吸血、英雄和装备被动。`
    },
    'zh-TW': {
      monkeyKingBar: () => `每 ${p.hits} 次有效普攻向命中方向釋放貫穿衝擊，長 ${p.range}、半寬 ${p.width}，最多命中 ${p.targets} 個敵人，各造成觸發普攻暴擊前傷害的 ${pct(p.damageRatio)}%。同次攻擊命中多敵僅計一次；多件共用計數。`,
      meteorHammer: () => `站定 ${p.hold} 秒後轟擊 ${p.range} 範圍內無遮擋敵人，半徑 ${p.radius}，傷害 ${p.damage} + 攻擊力 × ${p.attackRatio}；釋放後冷卻 ${p.cooldown} 秒。移動、衝刺或跳躍中斷蓄力，沒有合法目標不消耗就緒。`,
      divineRapier: () => `通關第10波後解鎖本局商店與鑄造。每 ${p.hits} 次有效普攻沿命中方向釋放劍氣，長 ${p.range}、半寬 ${p.width}，最多 ${p.targets} 個目標，各造成 ${p.damage} + 觸發普攻暴擊前傷害 × ${p.attackRatio}。持有時承傷增加 ${pct(p.incomingAmp)}%，同類風險只取最高。`,
      bloodstone: () => `英雄技能按實際傷害回復 ${pct(p.ratio)}%；範圍／持續傷害效率為 ${pct(p.areaRatio)}%，滾動 1 秒最多回復最大生命的 ${pct(p.capPerSecond)}%。裝備追加、幻影和裝備召喚傷害不觸發此技能回血。`,
      orchid: () => `普攻標記存活敵人 ${p.duration} 秒；成功施放主動技能時引爆 ${p.range} 範圍內最近的一個標記，造成 ${p.damage} + 攻擊力 × ${p.attackRatio} 基礎傷害。不沉默，不自動施放 Q。`,
      bladeMail: () => `實際承傷後向存活攻擊者反射 ${pct(p.ratio)}% 傷害，每擊最多 ${p.cap} 點，共用 ${p.interval} 秒間隔。無來源、閃避或被護盾完全吸收時不觸發。反傷不再放大全傷害。`,
      heart: () => `連續 ${p.delay} 秒未實際承傷後，每秒恢復最大生命的 ${pct(p.ratio)}%；再次承傷中斷。被閃避或完全吸收的傷害不中斷。`,
      phaseBoots: () => `衝刺結束後移速額外 +${p.speed}%，持續 ${p.duration} 秒；${p.attackWindow} 秒內下一次有效普攻追加 ${p.damage} + 攻擊力 × ${p.attackRatio} 基礎傷害。同次攻擊僅一次。`,
      cyclone: () => `每 ${p.cooldown} 秒吹起 ${p.range} 範圍內最近敵人 ${p.duration} 秒，暫停其移動與攻擊；精英時長減半，首領僅 ${pct(.2)}%。目標仍可受傷，無目標保留就緒。`,
      necronomicon: () => `每 ${p.cooldown} 秒召喚一名戰士和一名射手，持續 ${p.duration} 秒、最多兩名。攻擊間隔分別 0.9／1.1 秒，各造成 ${p.damage} + 攻擊力 × ${p.attackRatio} 基礎傷害。擊殺不給材料、寶箱、經驗或魂；不觸發普攻吸血、英雄和裝備被動。`
    },
    en: {
      monkeyKingBar: () => `Every ${p.hits} successful basics release a piercing strike along the hit direction, ${p.range} long with half-width ${p.width}. Hit up to ${p.targets} enemies for ${pct(p.damageRatio)}% of pre-crit attack damage each. Multi-target basics count once; all copies share the counter.`,
      meteorHammer: () => `After standing still for ${p.hold} sec, strike an unobstructed enemy within ${p.range} in a ${p.radius}-radius area for ${p.damage} + attack power × ${p.attackRatio} damage. Cooldown after release: ${p.cooldown} sec. Moving, dashing or jumping interrupts charge; stays ready without a legal target.`,
      divineRapier: () => `Clear wave 10 to unlock this run's shop and forging access. Every ${p.hits} successful basics release a divine edge along the hit direction, ${p.range} long with half-width ${p.width}, hitting up to ${p.targets} targets for ${p.damage} + pre-crit attack damage × ${p.attackRatio} each. Take ${pct(p.incomingAmp)}% more damage while equipped; only the highest risk applies.`,
      bloodstone: () => `Hero skills heal for ${pct(p.ratio)}% of actual damage. Area/periodic damage heals at ${pct(p.areaRatio)}% efficiency; rolling 1 sec cap: ${pct(p.capPerSecond)}% max HP. Equipment bonus, illusion and equipment-summon damage cannot trigger this skill healing.`,
      orchid: () => `Basic attacks mark surviving enemies for ${p.duration} sec. A successful active skill detonates the nearest mark within ${p.range} for ${p.damage} + attack power × ${p.attackRatio} base damage. No silence or automatic Q.`,
      bladeMail: () => `Reflect ${pct(p.ratio)}% of actual HP lost to a living attacker, capped at ${p.cap} per hit with a shared ${p.interval} sec interval. No source, dodges and fully absorbed hits do not trigger it. All-damage bonuses do not amplify reflection.`,
      heart: () => `After ${p.delay} sec without losing HP to damage, restore ${pct(p.ratio)}% max HP per second. HP damage interrupts this; dodged or fully absorbed hits do not.`,
      phaseBoots: () => `After a dash ends, gain +${p.speed}% move speed for ${p.duration} sec. The next successful basic attack within ${p.attackWindow} sec deals ${p.damage} + attack power × ${p.attackRatio} extra base damage, once per attack.`,
      cyclone: () => `Every ${p.cooldown} sec, lift the nearest enemy within ${p.range} for ${p.duration} sec, stopping movement and attacks. Elites receive half duration, bosses ${pct(.2)}%. Targets remain damageable. Stays ready without a target.`,
      necronomicon: () => `Every ${p.cooldown} sec, summon a warrior and archer for ${p.duration} sec, up to two. They attack every 0.9/1.1 sec for ${p.damage} + attack power × ${p.attackRatio} base damage each. Kills give no materials, chests, XP or souls; no basic lifesteal or hero/equipment procs.`
    }
  };
  if (!Object.hasOwn(descriptions[language], def.id)) return '';
  const stats = Object.entries(s).map(([key, value]) => `${labels[language][key]} +${value}${['speed', 'attackSpeed', 'lifesteal'].includes(key) ? '%' : ''}`).join(language === 'en' ? '; ' : '，');
  const synergy = language === 'en' ? 'The Lifesteal synergy separately heals from actual damage.' : language === 'zh-TW' ? '吸血羈絆另按實際傷害回復。' : '吸血羁绊另按实际伤害回复。';
  return `${stats}。 ${descriptions[language][def.id]()} ${synergy} ${language === 'en' ? 'Highest-level passive only; extra damage cannot crit, trigger basic lifesteal or trigger other passives. Total basic lifesteal caps at 65%; min attack interval 0.09 sec.' : language === 'zh-TW' ? '同類被動只取最高階；追加傷害不暴擊、不觸發普攻吸血、不觸發其他被動。普攻吸血總上限 65%，攻擊間隔最短 0.09 秒。' : '同类被动只取最高阶；追加伤害不暴击、不触发普攻吸血、不触发其他被动。普攻吸血总上限 65%，攻击间隔最短 0.09 秒。'}`;
}

export function equipmentUpgradeDescription(item, locale = 'zh-CN', compact = false) {
  const def = resolveEquipment(item);
  if (!def || !Object.hasOwn(EQUIPMENT_UPGRADES, def.id)) return '';
  const s = def.stats, p = def.passive;
  const percent = value => Math.round(value * 100);
  const evolution = equipmentEvolutionDescription(def, locale, compact);
  if (evolution) return evolution;
  const extension = equipmentExtensionDescription(def, locale);
  if (extension) return extension;
  if (compact) {
    const summaries = {
      'zh-CN': {
        mjollnir: () => `攻击力 +${s.attackPower}，攻速 +${s.attackSpeed}%。普攻 ${percent(p.chance)}% 概率连锁 ${p.jumps + 1} 个目标；首跳 ${p.damage} + 攻击力 × 0.4，逐跳保留 70%。攻击间隔最短 0.09 秒。`,
        buriza: () => `攻击力 +${s.attackPower}，暴击率 +${s.crit}%（总上限 90%），暴击伤害 +${s.critDamage}%。`,
        butterfly: () => `攻击力 +${s.attackPower}，攻速 +${s.attackSpeed}%，闪避 +${s.dodge}%（总上限 55%）。攻击间隔最短 0.09 秒。`,
        vanguard: () => `最大生命 +${s.maxHp}，护甲 +${s.armor}，每 5 秒回血 +${s.regen}。有来源的伤害有 ${percent(p.chance)}% 概率格挡 ${p.amount} 点；同类只取一份。`,
        satanic: () => `攻击力 +${s.attackPower}，最大生命 +${s.maxHp}，护甲 +${s.armor}，普攻吸血 +${s.lifesteal}%，每 5 秒回血 +${s.regen}。生命低于 ${percent(p.threshold)}% 时额外吸血 +${p.lifesteal}%，持续 ${p.duration} 秒，冷却 ${p.cooldown} 秒；总吸血上限 65%，狂热只取一份。`,
        aghanim: () => `攻击力 +${s.attackPower}，生命 +${s.maxHp}，法力 +${s.maxMana}，每秒回蓝 +${s.manaRegen}，主动冷缩 +${s.abilityHaste}%（总上限 60%）。已支持的主动伤害／增益 ×${p.multiplier.toFixed(2)}，同类取最高。`,
        powerTreads: () => `最大生命 +${s.maxHp}，移速 +${s.speed}%，攻速 +${s.attackSpeed}%。攻击间隔最短 0.09 秒。`,
        radiance: () => `攻击力 +${s.attackPower}，所有伤害 +${s.damage}%。每 ${p.interval} 秒对 ${p.radius} 范围内敌人造成 ${p.damage} 基础灼烧伤害，受所有伤害加成；光环只取最高阶。`,
        desolator: () => `攻击力 +${s.attackPower}。普攻标记目标 ${p.duration} 秒，后续伤害 +${percent(p.multiplier)}%；同类只取最高阶。`,
        skadi: () => `攻击力 +${s.attackPower}，最大生命 +${s.maxHp}，最大法力 +${s.maxMana}，攻速 +${s.attackSpeed}%。普攻减速 ${percent(p.slow)}%，持续 ${p.duration} 秒；同类只取最高阶。攻击间隔最短 0.09 秒。`,
      },
      'zh-TW': {
        mjollnir: () => `攻擊力 +${s.attackPower}，攻速 +${s.attackSpeed}%。普攻 ${percent(p.chance)}% 機率連鎖 ${p.jumps + 1} 個目標；首跳 ${p.damage} + 攻擊力 × 0.4，逐跳保留 70%。攻擊間隔最短 0.09 秒。`,
        buriza: () => `攻擊力 +${s.attackPower}，暴擊率 +${s.crit}%（總上限 90%），暴擊傷害 +${s.critDamage}%。`,
        butterfly: () => `攻擊力 +${s.attackPower}，攻速 +${s.attackSpeed}%，閃避 +${s.dodge}%（總上限 55%）。攻擊間隔最短 0.09 秒。`,
        vanguard: () => `最大生命 +${s.maxHp}，護甲 +${s.armor}，每 5 秒回血 +${s.regen}。有來源的傷害有 ${percent(p.chance)}% 機率格擋 ${p.amount} 點；同類只取一份。`,
        satanic: () => `攻擊力 +${s.attackPower}，最大生命 +${s.maxHp}，護甲 +${s.armor}，普攻吸血 +${s.lifesteal}%，每 5 秒回血 +${s.regen}。生命低於 ${percent(p.threshold)}% 時額外吸血 +${p.lifesteal}%，持續 ${p.duration} 秒，冷卻 ${p.cooldown} 秒；總吸血上限 65%，狂熱只取一份。`,
        aghanim: () => `攻擊力 +${s.attackPower}，生命 +${s.maxHp}，法力 +${s.maxMana}，每秒回魔 +${s.manaRegen}，主動冷縮 +${s.abilityHaste}%（總上限 60%）。已支援的主動傷害／增益 ×${p.multiplier.toFixed(2)}，同類取最高。`,
        powerTreads: () => `最大生命 +${s.maxHp}，移速 +${s.speed}%，攻速 +${s.attackSpeed}%。攻擊間隔最短 0.09 秒。`,
        radiance: () => `攻擊力 +${s.attackPower}，所有傷害 +${s.damage}%。每 ${p.interval} 秒對 ${p.radius} 範圍內敵人造成 ${p.damage} 基礎灼燒傷害，受所有傷害加成；光環只取最高階。`,
        desolator: () => `攻擊力 +${s.attackPower}。普攻標記目標 ${p.duration} 秒，後續傷害 +${percent(p.multiplier)}%；同類只取最高階。`,
        skadi: () => `攻擊力 +${s.attackPower}，最大生命 +${s.maxHp}，最大法力 +${s.maxMana}，攻速 +${s.attackSpeed}%。普攻減速 ${percent(p.slow)}%，持續 ${p.duration} 秒；同類只取最高階。攻擊間隔最短 0.09 秒。`,
      },
      en: {
        mjollnir: () => `Attack power +${s.attackPower}; attack speed +${s.attackSpeed}%. Basic attacks: ${percent(p.chance)}% chain chance, ${p.jumps + 1} targets, first hit ${p.damage} + attack power × 0.4; 70% damage per jump. Min attack interval 0.09 sec.`,
        buriza: () => `Attack power +${s.attackPower}; crit chance +${s.crit}% (total cap 90%); critical damage +${s.critDamage}%.`,
        butterfly: () => `Attack power +${s.attackPower}; attack speed +${s.attackSpeed}%; dodge +${s.dodge}% (total cap 55%). Min attack interval 0.09 sec.`,
        vanguard: () => `Max HP +${s.maxHp}; armor +${s.armor}; HP per 5 sec +${s.regen}. Hits with a source have a ${percent(p.chance)}% chance to block ${p.amount} damage; only one block passive applies.`,
        satanic: () => `Attack power +${s.attackPower}; max HP +${s.maxHp}; armor +${s.armor}; basic attack lifesteal +${s.lifesteal}%; HP per 5 sec +${s.regen}. Below ${percent(p.threshold)}% HP: extra lifesteal +${p.lifesteal}% for ${p.duration} sec, ${p.cooldown} sec cooldown; total lifesteal caps at 65%. Only one rage applies.`,
        aghanim: () => `Attack power +${s.attackPower}; max HP +${s.maxHp}; max mana +${s.maxMana}; mana/sec +${s.manaRegen}; active cooldown reduction +${s.abilityHaste}% (total cap 60%). Supported active damage/buffs ×${p.multiplier.toFixed(2)}; highest only.`,
        powerTreads: () => `Max HP +${s.maxHp}; move speed +${s.speed}%; attack speed +${s.attackSpeed}%. Min attack interval 0.09 sec.`,
        radiance: () => `Attack power +${s.attackPower}; all damage +${s.damage}%. Aura: ${p.damage} base damage every ${p.interval} sec within ${p.radius} range, affected by all-damage bonuses. Highest-level aura only.`,
        desolator: () => `Attack power +${s.attackPower}. Basic attacks mark for ${p.duration} sec: subsequent damage +${percent(p.multiplier)}%. Highest-level mark only.`,
        skadi: () => `Attack power +${s.attackPower}; max HP +${s.maxHp}; max mana +${s.maxMana}; attack speed +${s.attackSpeed}%. Basic attacks slow by ${percent(p.slow)}% for ${p.duration} sec; highest-level slow only. Min attack interval 0.09 sec.`,
      }
    };
    return summaries[Object.hasOwn(summaries, locale) ? locale : 'zh-CN'][def.id]();
  }
  const descriptions = {
    'zh-CN': {
      mjollnir: () => `攻击力 +${s.attackPower}，攻速 +${s.attackSpeed}%。有效普攻有 ${percent(p.chance)}% 概率触发连锁，最多命中 ${p.jumps + 1} 个目标；首跳 ${p.damage} + 攻击力 × 0.4，每跳保留 70% 伤害，跳距 190。雷锤／漩涡只取最强，共用 0.2 秒间隔；连锁不暴击、不触发普攻吸血、不触发其他被动。`,
      buriza: () => `攻击力 +${s.attackPower}，暴击率 +${s.crit}%，暴击伤害 +${s.critDamage}%。基础攻击直接命中可暴击，不产生范围伤害。`,
      butterfly: () => `攻击力 +${s.attackPower}，攻速 +${s.attackSpeed}%，闪避 +${s.dodge}%。保持原有普攻与闪避规则，不追加攻击或无敌时间。`,
      vanguard: () => `最大生命 +${s.maxHp}，护甲 +${s.armor}，每 5 秒回血 +${s.regen}。有来源的伤害有 ${percent(p.chance)}% 概率格挡 ${p.amount} 点，无来源的伤害不触发。多件只使用最高强化等级的一份格挡，不叠加概率或减免；各级格挡参数不变。`,
      satanic: () => `攻击力 +${s.attackPower}，最大生命 +${s.maxHp}，护甲 +${s.armor}，普攻吸血 +${s.lifesteal}%，每 5 秒回血 +${s.regen}。生命低于 ${percent(p.threshold)}% 时自动狂热，持续 ${p.duration} 秒、冷却 ${p.cooldown} 秒，期间直接命中的普攻额外获得 ${p.lifesteal}% 吸血，总吸血上限 65%。多件共用狂热与冷却，不叠加额外吸血；各级狂热参数不变。`,
      aghanim: () => `攻击力 +${s.attackPower}，最大生命 +${s.maxHp}，最大法力 +${s.maxMana}，每秒回蓝 +${s.manaRegen}，主动冷却缩减 +${s.abilityHaste}%。已支持强化的主动伤害或增益 ×${p.multiplier.toFixed(2)}；多把只取最高倍率，蓝耗不变，不额外增加持续时间、范围或数量。`,
      powerTreads: () => `最大生命 +${s.maxHp}，移动速度 +${s.speed}%，攻速 +${s.attackSpeed}%。属性随强化等级成长，沿用角色原有移动与基础攻击规则。`,
      radiance: () => `攻击力 +${s.attackPower}，所有伤害 +${s.damage}%。灼热光环每 ${p.interval} 秒对半径 ${p.radius} 内敌人造成 ${p.damage} 基础伤害，再应用一次所有伤害加成。多件只取最高阶光环，不叠加伤害或频率；灼烧不暴击、不触发普攻吸血、不触发装备被动或普攻计数。`,
      desolator: () => `攻击力 +${s.attackPower}。普攻命中存活目标后施加 ${p.duration} 秒易伤标记，使后续伤害提高 ${percent(p.multiplier)}%。首次施加标记的命中不受该标记加成；重复命中刷新持续时间，多件只取最高阶、不叠加倍率。标记不独立造成伤害；技能、灼烧、召唤和幻影均可受益，已结算的弹射与反伤不重复放大。`,
      skadi: () => `攻击力 +${s.attackPower}，最大生命 +${s.maxHp}，最大法力 +${s.maxMana}，攻速 +${s.attackSpeed}%。基础攻击命中存活敌人后使其移动速度降低 ${percent(p.slow)}%，持续 ${p.duration} 秒。重复命中刷新持续时间，多件只取最高阶、不叠加减速；减速不独立造成伤害，不改变敌人攻击频率。`,
    },
    'zh-TW': {
      mjollnir: () => `攻擊力 +${s.attackPower}，攻速 +${s.attackSpeed}%。有效普攻有 ${percent(p.chance)}% 機率觸發連鎖，最多命中 ${p.jumps + 1} 個目標；首跳 ${p.damage} + 攻擊力 × 0.4，每跳保留 70% 傷害，跳距 190。雷錘／漩渦只取最強，共用 0.2 秒間隔；連鎖不暴擊、不觸發普攻吸血、不觸發其他被動。`,
      buriza: () => `攻擊力 +${s.attackPower}，暴擊率 +${s.crit}%，暴擊傷害 +${s.critDamage}%。基礎攻擊直接命中可暴擊，不產生範圍傷害。`,
      butterfly: () => `攻擊力 +${s.attackPower}，攻速 +${s.attackSpeed}%，閃避 +${s.dodge}%。保持原有普攻與閃避規則，不追加攻擊或無敵時間。`,
      vanguard: () => `最大生命 +${s.maxHp}，護甲 +${s.armor}，每 5 秒回血 +${s.regen}。有來源的傷害有 ${percent(p.chance)}% 機率格擋 ${p.amount} 點，無來源的傷害不觸發。多件只使用最高強化等級的一份格擋，不疊加機率或減免；各級格擋參數不變。`,
      satanic: () => `攻擊力 +${s.attackPower}，最大生命 +${s.maxHp}，護甲 +${s.armor}，普攻吸血 +${s.lifesteal}%，每 5 秒回血 +${s.regen}。生命低於 ${percent(p.threshold)}% 時自動狂熱，持續 ${p.duration} 秒、冷卻 ${p.cooldown} 秒，期間直接命中的普攻額外獲得 ${p.lifesteal}% 吸血，總吸血上限 65%。多件共用狂熱與冷卻，不疊加額外吸血；各級狂熱參數不變。`,
      aghanim: () => `攻擊力 +${s.attackPower}，最大生命 +${s.maxHp}，最大法力 +${s.maxMana}，每秒回魔 +${s.manaRegen}，主動冷卻縮減 +${s.abilityHaste}%。已支援強化的主動傷害或增益 ×${p.multiplier.toFixed(2)}；多把只取最高倍率，耗魔不變，不額外增加持續時間、範圍或數量。`,
      powerTreads: () => `最大生命 +${s.maxHp}，移動速度 +${s.speed}%，攻速 +${s.attackSpeed}%。屬性隨強化等級成長，沿用角色原有移動與基礎攻擊規則。`,
      radiance: () => `攻擊力 +${s.attackPower}，所有傷害 +${s.damage}%。灼熱光環每 ${p.interval} 秒對半徑 ${p.radius} 內敵人造成 ${p.damage} 基礎傷害，再套用一次所有傷害加成。多件只取最高階光環，不疊加傷害或頻率；灼燒不暴擊、不觸發普攻吸血、不觸發裝備被動或普攻計數。`,
      desolator: () => `攻擊力 +${s.attackPower}。普攻命中存活目標後施加 ${p.duration} 秒易傷標記，使後續傷害提高 ${percent(p.multiplier)}%。首次施加標記的命中不受該標記加成；重複命中刷新持續時間，多件只取最高階、不疊加倍率。標記不獨立造成傷害；技能、灼燒、召喚和幻影均可受益，已結算的彈射與反傷不重複放大。`,
      skadi: () => `攻擊力 +${s.attackPower}，最大生命 +${s.maxHp}，最大法力 +${s.maxMana}，攻速 +${s.attackSpeed}%。基礎攻擊命中存活敵人後使其移動速度降低 ${percent(p.slow)}%，持續 ${p.duration} 秒。重複命中刷新持續時間，多件只取最高階、不疊加減速；減速不獨立造成傷害，不改變敵人攻擊頻率。`,
    },
    en: {
      mjollnir: () => `Attack power +${s.attackPower}; attack speed +${s.attackSpeed}%. Successful basic attacks have a ${percent(p.chance)}% chance to chain to ${p.jumps + 1} targets: first hit ${p.damage} + attack power × 0.4, then 70% damage per jump within 190 range. Mjollnir/Maelstrom use only the strongest proc and share a 0.2 sec interval. Lightning cannot crit, trigger basic lifesteal or trigger other passives.`,
      buriza: () => `Attack power +${s.attackPower}; crit chance +${s.crit}%; critical damage +${s.critDamage}%. Direct basic attack hits can crit; no area damage is added.`,
      butterfly: () => `Attack power +${s.attackPower}; attack speed +${s.attackSpeed}%; dodge +${s.dodge}%. Existing basic attacks and dodge rules remain; no extra attacks or invulnerability.`,
      vanguard: () => `Max HP +${s.maxHp}; armor +${s.armor}; HP per 5 sec +${s.regen}. Hits with a source have a ${percent(p.chance)}% chance to block ${p.amount} damage; damage without a source cannot trigger it. Only the highest-level block passive applies; chances and reductions do not stack. Block parameters stay the same at every level.`,
      satanic: () => `Attack power +${s.attackPower}; max HP +${s.maxHp}; armor +${s.armor}; basic attack lifesteal +${s.lifesteal}%; HP per 5 sec +${s.regen}. Below ${percent(p.threshold)}% HP, rage activates for ${p.duration} sec with a ${p.cooldown} sec cooldown. During rage, direct basic attack hits gain an extra ${p.lifesteal}% lifesteal, capped at 65% total. All copies share rage and its cooldown; extra lifesteal does not stack. Rage parameters stay the same at every level.`,
      aghanim: () => `Attack power +${s.attackPower}; max HP +${s.maxHp}; max mana +${s.maxMana}; mana per sec +${s.manaRegen}; active cooldown reduction +${s.abilityHaste}%. Supported active damage or buffs ×${p.multiplier.toFixed(2)}; only the highest multiplier applies. Mana cost, duration, range and counts do not change.`,
      powerTreads: () => `Max HP +${s.maxHp}; move speed +${s.speed}%; attack speed +${s.attackSpeed}%. Stats grow with upgrade level, following the hero's existing movement and basic attack rules.`,
      radiance: () => `Attack power +${s.attackPower}; all damage +${s.damage}%. The aura deals ${p.damage} base damage every ${p.interval} sec to enemies within ${p.radius} range, applying all-damage bonuses once. Only the highest-level aura applies; damage and frequency do not stack. Burns cannot crit, trigger basic lifesteal, trigger equipment passives or count as basic attacks.`,
      desolator: () => `Attack power +${s.attackPower}. Basic attacks mark surviving targets for ${p.duration} sec, increasing subsequent damage by ${percent(p.multiplier)}%. The first hit that applies the mark does not benefit from it. Further hits refresh the duration; only the highest-level mark applies and multipliers do not stack. The mark deals no damage; skills, burns, summons and mirrors benefit. Resolved bounces and reflections are not amplified again.`,
      skadi: () => `Attack power +${s.attackPower}; max HP +${s.maxHp}; max mana +${s.maxMana}; attack speed +${s.attackSpeed}%. Basic attacks slow surviving enemies' movement by ${percent(p.slow)}% for ${p.duration} sec. Further hits refresh the duration; only the highest-level slow applies and slows do not stack. The slow deals no damage and does not change enemy attack frequency.`,
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
