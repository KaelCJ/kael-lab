export const ENEMIES = {
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
  frostWraith: { name: '霜冻幽魂', elite: true, hp: 205, speed: 76, radius: 29, damage: 8, color: '#9fe9ff', value: 17, windup: 1.05, cooldown: 5.4, reach: 510, spellRadius: 115 },
  thunderLizard: { name: '雷霆蜥蜴', elite: true, hp: 265, speed: 71, radius: 35, damage: 9, color: '#d5c3ff', value: 17, windup: 1.15, cooldown: 5.7, reach: 520, laneRadius: 18 },
  boss: { name: '远古暴君', hp: 1150, speed: 74, radius: 53, damage: 14, color: '#f3a5c9', value: 40 }
};
export const BOSS_VARIANTS = {
  roshan: { hp: 1680, speed: 66, radius: 60, damage: 17, color: '#c77b55', value: 55 }
};
export const BOSS_VARIANT_NAMES = {
  roshan: { 'zh-CN': '肉山（Roshan）', 'zh-TW': '肉山（Roshan）', en: 'Roshan' }
};
export const ELITE_ROTATION = ['centaur', 'satyr', 'hellbear', 'darkTroll', 'elite', 'frostWraith', 'thunderLizard'];
export const ELITE_WAVES = [3, 5, 7, 9, 12, 15, 18];

export const ENEMY_NAMES = {
  'zh-CN': { crawler: '爬行机', runner: '追猎虫', tank: '铁甲兽', shooter: '孢射体', charger: '冲锋残骸', splitter: '分裂菌团', elite: '精英哨卫', centaur: '半人马可汗', satyr: '萨特苦难使者', hellbear: '地狱熊怪粉碎者', darkTroll: '黑暗巨魔召唤师', frostWraith: '霜冻幽魂', thunderLizard: '雷霆蜥蜴', boss: '远古暴君' },
  'zh-TW': { crawler: '爬行機', runner: '追獵蟲', tank: '鐵甲獸', shooter: '孢射體', charger: '衝鋒殘骸', splitter: '分裂菌團', elite: '精英哨衛', centaur: '半人馬可汗', satyr: '薩特苦難使者', hellbear: '地獄熊怪粉碎者', darkTroll: '黑暗巨魔召喚師', frostWraith: '霜凍幽魂', thunderLizard: '雷霆蜥蜴', boss: '遠古暴君' },
  en: { crawler: 'Crawler', runner: 'Hunter Bug', tank: 'Ironback', shooter: 'Spore Shooter', charger: 'Charging Wreck', splitter: 'Splitting Fungus', elite: 'Elite Sentinel', centaur: 'Centaur Khan', satyr: 'Satyr Tormenter', hellbear: 'Hellbear Smasher', darkTroll: 'Dark Troll Summoner', frostWraith: 'Frost Revenant', thunderLizard: 'Thunder Lizard', boss: 'Ancient Tyrant' }
};
