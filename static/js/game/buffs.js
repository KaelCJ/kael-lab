export const BUFFS = {
  deadShot: {
    rarity: 'rare', price: 32, icon: './art/buffs/deadShot.svg',
    name: '弹无虚发', nameTw: '彈無虛發', nameEn: 'Dead Shot',
    desc: '普攻、散弹及幻影投射物命中后，随机弹向 240 范围内另一名未命中过的敌人。每层 +1 跳，每跳伤害降低 30%；不再次暴击、吸血或触发装备。月刃结束后追加，不影响持续区域技能。',
    descTw: '普攻、散彈及幻影投射物命中後，隨機彈向 240 範圍內另一名未命中過的敵人。每層 +1 跳，每跳傷害降低 30%；不再次暴擊、吸血或觸發裝備。月刃結束後追加，不影響持續區域技能。',
    descEn: 'Basic, shotgun and illusion projectiles bounce on hit to a random unhit enemy within 240. +1 bounce per stack; each bounce loses 30% damage, without new crits, lifesteal or item procs. Follows Moon Glaives; excludes persistent area skills.',
    stats: {}
  },
  ironBranch: {
    rarity: 'common', price: 10, icon: './art/buffs/ironBranch.svg',
    name: '树枝', nameTw: '樹枝', nameEn: 'Iron Branch',
    desc: '全属性 +1：最大生命、物理攻击、法术攻击各 +1。',
    descTw: '全屬性 +1：最大生命、物理攻擊、法術攻擊各 +1。',
    descEn: 'All attributes +1: Max HP, physical attack and magic attack each +1.',
    stats: { maxHp: 1, attackDamage: 1, elemental: 1 }
  },
  enduranceAura: {
    rarity: 'common', price: 16, icon: './art/buffs/enduranceAura.svg',
    name: '耐久光环', nameTw: '耐久光環', nameEn: 'Endurance Aura',
    desc: '移动速度 +6%。',
    descTw: '移動速度 +6%。',
    descEn: 'Move speed +6%.',
    stats: { speed: 6 }
  },
  fervor: {
    rarity: 'common', price: 18, icon: './art/buffs/fervor.svg',
    name: '热血战魂', nameTw: '熱血戰魂', nameEn: 'Fervor',
    desc: '攻击速度 +10%。',
    descTw: '攻擊速度 +10%。',
    descEn: 'Attack speed +10%.',
    stats: { attackSpeed: 10 }
  },
  dragonBlood: {
    rarity: 'common', price: 24, icon: './art/buffs/dragonBlood.svg',
    name: '龙族血统', nameTw: '龍族血統', nameEn: 'Dragon Blood',
    desc: '最大生命 +8、每 5 秒回血 +1。',
    descTw: '最大生命 +8、每 5 秒回血 +1。',
    descEn: 'Max HP +8 and HP per 5 sec +1.',
    stats: { maxHp: 8, regen: 1 }
  },
  arcaneAura: {
    rarity: 'rare', price: 30, icon: './art/buffs/arcaneAura.svg',
    name: '奥术光环', nameTw: '奧術光環', nameEn: 'Arcane Aura',
    desc: '每秒回蓝 +1、冷却缩减 +6%；冷却缩减上限 60%。',
    descTw: '每秒回魔 +1、冷卻縮減 +6%；冷卻縮減上限 60%。',
    descEn: 'Mana regeneration +1/sec and cooldown reduction +6%; cooldown reduction caps at 60%.',
    stats: { manaRegen: 1, abilityHaste: 6 }
  },
  assaultCuirass: {
    rarity: 'epic', price: 36, icon: './art/buffs/assaultCuirass.svg',
    name: '强袭光环', nameTw: '強襲光環', nameEn: 'Assault Aura',
    desc: '攻速 +12%、护甲 +2；240 范围敌人受到自身直接物理普攻伤害每层 +8%，最多 +40%，不放大弹射或技能。',
    descTw: '攻速 +12%、護甲 +2；240 範圍敵人受到自身直接物理普攻傷害每層 +8%，最多 +40%，不放大彈射或技能。',
    descEn: 'Attack speed +12% and Armor +2. Enemies within 240 take +8% damage per stack from your direct physical basic attacks, up to +40%; excludes bounces and skills.',
    stats: { attackSpeed: 12, armor: 2 }
  },
  shivasGuard: {
    rarity: 'epic', price: 38, icon: './art/buffs/shivasGuard.svg',
    name: '冰心', nameTw: '冰心', nameEn: "Shiva's Guard",
    desc: '护甲 +3；240 范围敌人移速和攻击冷却计时速度每层 -8%，最多 -40%。冰心、霜甲、冰眼减速取最强，不延长攻击前摇。',
    descTw: '護甲 +3；240 範圍敵人移速和攻擊冷卻計時速度每層 -8%，最多 -40%。冰心、霜甲、冰眼減速取最強，不延長攻擊前搖。',
    descEn: 'Armor +3. Enemies within 240 move and recover attack cooldowns 8% slower per stack, up to 40%. Only the strongest Shiva/Frost Armor/Skadi slow applies; attack windups stay unchanged.',
    stats: { armor: 3 }
  },
  vladmir: {
    rarity: 'epic', price: 34, icon: './art/buffs/vladmir.svg',
    name: '祭品', nameTw: '祭品', nameEn: "Vladmir's Offering",
    desc: '吸血 +4%、护甲 +1、每秒回蓝 +1；吸血上限 65%。',
    descTw: '吸血 +4%、護甲 +1、每秒回魔 +1；吸血上限 65%。',
    descEn: 'Lifesteal +4%, Armor +1 and Mana regeneration +1/sec; lifesteal caps at 65%.',
    stats: { lifesteal: 4, armor: 1, manaRegen: 1 }
  },
  shallowGrave: {
    rarity: 'legendary', price: 26, icon: './art/buffs/shallowGrave.svg',
    name: '薄葬', nameTw: '薄葬', nameEn: 'Shallow Grave',
    desc: '每波抵挡前 N 次有效伤害，N 为购买层数；生命不变，每次抵挡后无敌 0.55 秒。每波补满，暂停不重置。',
    descTw: '每波抵擋前 N 次有效傷害，N 為購買層數；生命不變，每次抵擋後無敵 0.55 秒。每波補滿，暫停不重置。',
    descEn: 'Block the first N damaging hits each wave, where N is your stack count. HP stays unchanged; each block grants 0.55 sec of invulnerability. Refilled each wave, never on resume.',
    stats: {}
  },
  livingArmor: {
    rarity: 'common', price: 26, icon: './art/buffs/livingArmor.svg',
    name: '活体护甲', nameTw: '活體護甲', nameEn: 'Living Armor',
    desc: '最大生命 +18、每 5 秒回血 +1，但移速 -8%；有效移速最低为基础的 20%。',
    descTw: '最大生命 +18、每 5 秒回血 +1，但移速 -8%；有效移速最低為基礎的 20%。',
    descEn: 'Max HP +18 and HP per 5 sec +1, but move speed -8%; effective move speed cannot fall below 20% of base.',
    stats: { maxHp: 18, regen: 1, speed: -8 }
  },
  surge: {
    rarity: 'rare', price: 28, icon: './art/buffs/surge.svg',
    name: '奔腾', nameTw: '奔騰', nameEn: 'Surge',
    desc: '攻速 +24%、移速 +8%，但护甲 -2。',
    descTw: '攻速 +24%、移速 +8%，但護甲 -2。',
    descEn: 'Attack speed +24% and move speed +8%, but Armor -2.',
    stats: { attackSpeed: 24, speed: 8, armor: -2 }
  },
  bloodrage: {
    rarity: 'rare', price: 30, icon: './art/buffs/bloodrage.svg',
    name: '血怒', nameTw: '血怒', nameEn: 'Bloodrage',
    desc: '全伤害 +14%、攻速 +12%，但受到伤害每层 +10%，按独立倍率结算。',
    descTw: '全傷害 +14%、攻速 +12%，但受到傷害每層 +10%，按獨立倍率結算。',
    descEn: 'All damage +14% and attack speed +12%, but damage taken increases by 10% per stack as a separate multiplier.',
    stats: { damage: 14, attackSpeed: 12 }
  },
  greevilsGreed: {
    rarity: 'common', price: 22, icon: './art/buffs/greevilsGreed.svg',
    name: '贪魔的贪婪', nameTw: '貪魔的貪婪', nameEn: "Greevil's Greed",
    desc: '拾取范围 +70、幸运 +8，但攻速 -8%；有效攻速最低为基础的 20%。',
    descTw: '拾取範圍 +70、幸運 +8，但攻速 -8%；有效攻速最低為基礎的 20%。',
    descEn: 'Pickup range +70 and Luck +8, but attack speed -8%; effective attack speed cannot fall below 20% of base.',
    stats: { pickup: 70, luck: 8, attackSpeed: -8 }
  },
  coupDeGrace: {
    rarity: 'epic', price: 32, icon: './art/buffs/coupDeGrace.svg',
    name: '恩赐解脱', nameTw: '恩賜解脫', nameEn: 'Coup de Grace',
    desc: '物理攻击 +8、暴击伤害 +20%，但护甲 -3。',
    descTw: '物理攻擊 +8、暴擊傷害 +20%，但護甲 -3。',
    descEn: 'Physical attack +8 and Crit damage +20%, but Armor -3.',
    stats: { attackDamage: 8, critDamage: 20, armor: -3 }
  },
  sacrifice: {
    rarity: 'epic', price: 34, icon: './art/buffs/sacrifice.svg',
    name: '牺牲', nameTw: '犧牲', nameEn: 'Sacrifice',
    desc: '法术攻击 +8、冷却缩减 +8%，但全伤害 -6%；冷却缩减上限 60%，全伤害倍率最低 10%。',
    descTw: '法術攻擊 +8、冷卻縮減 +8%，但全傷害 -6%；冷卻縮減上限 60%，全傷害倍率最低 10%。',
    descEn: 'Magic attack +8 and cooldown reduction +8%, but all damage -6%; cooldown reduction caps at 60% and the all-damage multiplier bottoms out at 10%.',
    stats: { elemental: 8, abilityHaste: 8, damage: -6 }
  },
  madness: {
    rarity: 'common', price: 28, icon: './art/buffs/madness.svg',
    name: '疯狂面具', nameTw: '瘋狂面具', nameEn: 'Mask of Madness',
    desc: '攻速 +24%、吸血 +4%，但护甲 -3；吸血上限 65%。',
    descTw: '攻速 +24%、吸血 +4%，但護甲 -3；吸血上限 65%。',
    descEn: 'Attack speed +24% and Lifesteal +4%, but Armor -3; lifesteal caps at 65%.',
    stats: { attackSpeed: 24, lifesteal: 4, armor: -3 }
  },
  armlet: {
    rarity: 'epic', price: 32, icon: './art/buffs/armlet.svg',
    name: '臂章', nameTw: '臂章', nameEn: 'Armlet of Mordiggian',
    desc: '物理攻击 +8、攻速 +12%、护甲 +2；战斗中每层每秒流失 1 生命，最低保留 1。流失不算伤害，暂停和商店停止。',
    descTw: '物理攻擊 +8、攻速 +12%、護甲 +2；戰鬥中每層每秒流失 1 生命，最低保留 1。流失不算傷害，暫停和商店停止。',
    descEn: 'Physical attack +8, attack speed +12% and Armor +2. Lose 1 HP/sec per stack in combat, down to 1 HP. This is not damage; it stops while paused or shopping.',
    stats: { attackDamage: 8, attackSpeed: 12, armor: 2 }
  },
  focusFire: {
    rarity: 'epic', price: 34, icon: './art/buffs/focusFire.svg',
    name: '集中火力', nameTw: '集中火力', nameEn: 'Focus Fire',
    desc: '攻速 +30%，但全伤害 -8%；全伤害倍率最低 10%。',
    descTw: '攻速 +30%，但全傷害 -8%；全傷害倍率最低 10%。',
    descEn: 'Attack speed +30%, but all damage -8%; the all-damage multiplier cannot fall below 10%.',
    stats: { attackSpeed: 30, damage: -8 }
  },
  windrun: {
    rarity: 'rare', price: 33, icon: './art/buffs/windrun.svg',
    name: '风行', nameTw: '風行', nameEn: 'Windrun',
    desc: '移速 +15%、闪避 +8%，但最大生命 -5、护甲 -1；生命上限最低 1，闪避上限 55%。',
    descTw: '移速 +15%、閃避 +8%，但最大生命 -5、護甲 -1；生命上限最低 1，閃避上限 55%。',
    descEn: 'Move speed +15% and Dodge +8%, but Max HP -5 and Armor -1; Max HP bottoms out at 1 and dodge caps at 55%.',
    stats: { speed: 15, dodge: 8, maxHp: -5, armor: -1 }
  },
  godsStrength: {
    rarity: 'rare', price: 29, icon: './art/buffs/godsStrength.svg',
    name: '神之力量', nameTw: '神之力量', nameEn: "God's Strength",
    desc: '物理攻击 +8，但基础攻击射程 -16；有效射程最低 48。',
    descTw: '物理攻擊 +8，但基礎攻擊射程 -16；有效射程最低 48。',
    descEn: 'Physical attack +8, but basic attack range -16; effective range cannot fall below 48.',
    stats: { attackDamage: 8, attackRange: -16 }
  },
  bloodlust: {
    rarity: 'rare', price: 30, icon: './art/buffs/bloodlust.svg',
    name: '嗜血术', nameTw: '嗜血術', nameEn: 'Bloodlust',
    desc: '每波开始立即增益 5 秒，此后每 10 秒重复：每层攻速 +20%、移速 +8%。叠加不延长时段，暂停冻结计时。',
    descTw: '每波開始立即增益 5 秒，此後每 10 秒重複：每層攻速 +20%、移速 +8%。疊加不延長時段，暫停凍結計時。',
    descEn: 'Gain +20% attack speed and +8% move speed per stack for the first 5 sec of every 10 sec, starting at each wave. Stacks do not extend the window; pausing freezes its timer.',
    stats: {}
  },
  berserkersBlood: {
    rarity: 'epic', price: 30, icon: './art/buffs/berserkersBlood.svg',
    name: '狂战士之血', nameTw: '狂戰士之血', nameEn: "Berserker's Blood",
    desc: '按已损失生命比例增加攻速，每层最多 +40%；半血时每层 +20%，满血时不增加。',
    descTw: '按已損失生命比例增加攻速，每層最多 +40%；半血時每層 +20%，滿血時不增加。',
    descEn: 'Gain attack speed proportional to missing HP, up to +40% per stack: +20% per stack at half HP, with no bonus at full HP.',
    stats: {}
  },
  frostArmor: {
    rarity: 'rare', price: 28, icon: './art/buffs/frostArmor.svg',
    name: '霜冻护甲', nameTw: '霜凍護甲', nameEn: 'Frost Armor',
    desc: '护甲 +1；实际受伤后，使存活的伤害来源敌人移速每层 -20%，持续 2 秒，最多 -60%。冰心、霜甲、冰眼减速取最强。',
    descTw: '護甲 +1；實際受傷後，使存活的傷害來源敵人移速每層 -20%，持續 2 秒，最多 -60%。冰心、霜甲、冰眼減速取最強。',
    descEn: 'Armor +1. After taking damage, slow the surviving source enemy by 20% per stack for 2 sec, up to 60%. Only the strongest Shiva/Frost Armor/Skadi slow applies.',
    stats: { armor: 1 }
  },
  counterHelix: {
    rarity: 'epic', price: 32, icon: './art/buffs/counterHelix.svg',
    name: '反击螺旋', nameTw: '反擊螺旋', nameEn: 'Counter Helix',
    desc: '每实际承受 4 次非致命伤害，对 150 范围敌人造成每层 16 点伤害，受全伤害加成；不暴击、不吸血，计数每波清零。',
    descTw: '每實際承受 4 次非致命傷害，對 150 範圍敵人造成每層 16 點傷害，受全傷害加成；不暴擊、不吸血，計數每波清零。',
    descEn: 'Every 4 nonfatal damaging hits, deal 16 damage per stack to enemies within 150, scaled by all-damage bonuses. Cannot crit or lifesteal; the hit count resets each wave.',
    stats: {}
  }
};

export const BUFF_IDS = Object.keys(BUFFS);

// Brotato-inspired cumulative thresholds; wave is the wave just completed.
export function buffRarityChances(wave, luck) {
  const multiplier = Math.max(0, 1 + luck / 100);
  const blue = Math.min(.60, Math.max(0, wave - 1) * .06 * multiplier);
  const purple = Math.min(.25, Math.max(0, wave - 3) * .02 * multiplier);
  const orange = Math.min(.08, Math.max(0, wave - 7) * .0023 * multiplier);
  return { common: 1 - blue, rare: blue - purple, epic: purple - orange, legendary: orange };
}

export function randomBuff(wave, luck) {
  const chances = buffRarityChances(wave, luck);
  let roll = Math.random();
  const rarity = ['legendary', 'epic', 'rare'].find(tier => (roll -= chances[tier]) < 0) || 'common';
  const pool = BUFF_IDS.filter(id => BUFFS[id].rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function resetBuffWave(run) {
  run.buffState = { graveCharges: run.buffs.shallowGrave || 0, receivedHits: 0 };
}

export function absorbBuffDamage(run, damage) {
  if (!(damage > 0) || !(run.buffState?.graveCharges > 0)) return false;
  run.buffState.graveCharges -= 1;
  return true;
}

export function buffAttackSpeed(run) {
  const bloodlust = run.elapsed % 10 < 5 ? (run.buffs.bloodlust || 0) * 20 : 0;
  const missingHp = Math.max(0, Math.min(1, 1 - run.player.hp / run.player.maxHp));
  return bloodlust + missingHp * (run.buffs.berserkersBlood || 0) * 40;
}

export function buffMoveSpeed(run) {
  return run.elapsed % 10 < 5 ? (run.buffs.bloodlust || 0) * 8 : 0;
}

export function buffAuraSlow(run, distance) {
  return distance <= 240 ? Math.min(.4, (run.buffs.shivasGuard || 0) * .08) : 0;
}

export function buffPhysicalAmp(run, distance) {
  return distance <= 240 ? Math.min(.4, (run.buffs.assaultCuirass || 0) * .08) : 0;
}
