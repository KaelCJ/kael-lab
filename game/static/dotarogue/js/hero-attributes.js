export const ATTRIBUTE_KEYS = ['strength', 'agility', 'intelligence'];

export const ATTRIBUTE_LABELS = {
  'zh-CN': { strength: '力量', agility: '敏捷', intelligence: '智力' },
  'zh-TW': { strength: '力量', agility: '敏捷', intelligence: '智力' },
  en: { strength: 'Strength', agility: 'Agility', intelligence: 'Intelligence' }
};

const DERIVED_LABELS = {
  'zh-CN': { attackPower: '攻击力', skillPower: '技能伤害' },
  'zh-TW': { attackPower: '攻擊力', skillPower: '技能傷害' },
  en: { attackPower: 'Attack power', skillPower: 'Spell power' }
};

// Primary attributes deliberately expose two readable growth axes: every
// attribute adds basic attack power, while Intelligence also adds spell power.
// Spell power is a scaling source, not a second damage type.
export const ATTRIBUTE_RULES = {
  strength: { maxHp: 3, regen: .2, attackPower: .4 },
  agility: { attackSpeed: 1.5, armor: .15, attackPower: .4 },
  intelligence: { attackPower: .4, skillPower: 1, manaRegen: .12, abilityHaste: .75 }
};

export const PRIMARY_ATTACK_POWER = .4;

export function attributeLabel(key, locale = 'zh-CN') {
  return ATTRIBUTE_LABELS[locale]?.[key] || ATTRIBUTE_LABELS['zh-CN'][key] || key;
}

export function attributeText(attributes, locale = 'zh-CN') {
  return ATTRIBUTE_KEYS.filter(key => attributes?.[key]).map(key => {
    const value = Number(attributes[key].toFixed(2));
    return `${attributeLabel(key, locale)} +${value}`;
  }).join(' · ');
}

// Public aliases used by the game shell. Keep the formatting helper in one
// place so equipment cards and the pause screen show the same attribute text.
export const attributeSummary = attributeText;

export function attributeDerivedText(attributes, locale = 'zh-CN', primaryAttribute = '') {
  const totals = {};
  for (const key of ATTRIBUTE_KEYS) {
    const amount = Number(attributes?.[key]) || 0;
    if (!amount) continue;
    for (const [derivedKey, value] of Object.entries(attributeContribution(key, amount, primaryAttribute))) {
      if (!['attackPower', 'skillPower'].includes(derivedKey)) continue;
      totals[derivedKey] = (totals[derivedKey] || 0) + value;
    }
  }
  return ['attackPower', 'skillPower'].filter(key => totals[key]).map(key => {
    const value = Number(totals[key].toFixed(2));
    return `${DERIVED_LABELS[locale]?.[key] || DERIVED_LABELS['zh-CN'][key]} +${value}`;
  }).join(' · ');
}

export const attributeDerivedSummary = attributeDerivedText;

export function attributeContribution(key, amount, primaryAttribute = '') {
  const rule = ATTRIBUTE_RULES[key] || {};
  const result = {};
  for (const [derivedKey, ratio] of Object.entries(rule)) result[derivedKey] = amount * ratio;
  // Keep the argument for compatibility with older callers. Attack power now
  // comes from every attribute; primary attributes are still exposed on the
  // hero card for identity, not as a gate for the universal stat.
  return result;
}

// Heroes carry their live base values in heroes.js. This fallback keeps the
// attribute module usable for older or external hero definitions.
const DEFAULT_HERO_ATTRIBUTES = {
  rover: { primary: 'agility', strength: 1, agility: 4, intelligence: 1 },
  bulwark: { primary: 'strength', strength: 5, agility: 1, intelligence: 0 },
  conductor: { primary: 'intelligence', strength: 1, agility: 1, intelligence: 5 },
  scavenger: { primary: 'strength', strength: 4, agility: 2, intelligence: 1 },
  jugg: { primary: 'agility', strength: 2, agility: 5, intelligence: 0 },
  sf: { primary: 'intelligence', strength: 1, agility: 2, intelligence: 5 },
  kael: { primary: 'intelligence', strength: 0, agility: 1, intelligence: 7 },
  luna: { primary: 'agility', strength: 1, agility: 5, intelligence: 1 },
  tb: { primary: 'strength', strength: 4, agility: 3, intelligence: 0 }
};

export function heroAttributeProfile(id) {
  const profile = DEFAULT_HERO_ATTRIBUTES[id] || { primary: 'strength', strength: 0, agility: 0, intelligence: 0 };
  const { primary, ...base } = profile;
  return { primary, base };
}

export function cooldownWithHaste(base, abilityHaste = 0) {
  return Math.max(.2, base * (1 - Math.min(60, Math.max(0, abilityHaste)) / 100));
}
