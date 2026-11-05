export const JUNGLE_BUFFS = Object.freeze({
  red: { duration: 75, color: '#ffbd94', name: { 'zh-CN': '红 Buff', 'zh-TW': '紅 Buff', en: 'Red Buff' },
    desc: { 'zh-CN': '普攻灼烧3秒，每秒6＋攻击力12%伤害；减速20%。重复命中刷新，不叠加。', 'zh-TW': '普攻灼燒3秒，每秒6＋攻擊力12%傷害；減速20%。重複命中刷新，不疊加。', en: 'Basics burn for 3s: 6 + 12% attack power per second, and slow by 20%. Hits refresh, without stacking.' } },
  blue: { duration: 75, color: '#b0e6ff', name: { 'zh-CN': '蓝 Buff', 'zh-TW': '藍 Buff', en: 'Blue Buff' },
    desc: { 'zh-CN': '每秒额外回复4法力；技能与法术装备冷却缩减＋15个百分点，总上限60%。', 'zh-TW': '每秒額外回復4法力；技能與法術裝備冷卻縮減＋15個百分點，總上限60%。', en: '+4 mana per second; +15 percentage points cooldown reduction for skills and spell items, capped at 60% total.' } },
  roshan: { duration: 120, color: '#ffe1a0', name: { 'zh-CN': '肉山之力', 'zh-TW': '肉山之力', en: 'Roshan\'s Might' },
    desc: { 'zh-CN': '所有伤害提高20%。击杀时恢复全部生命与法力，并获得200材料和3个待开奖励箱。', 'zh-TW': '所有傷害提高20%。擊殺時回復全部生命與法力，並獲得200材料和3個待開獎勵箱。', en: '+20% all damage. Killing Roshan also fully restores HP and mana, and grants 200 materials and 3 pending chests.' } }
});
