export const ATTRIBUTE_KEYS = ['strength', 'agility', 'intelligence'];

export const ATTRIBUTE_LABELS = {
  'zh-CN': { strength: '力量', agility: '敏捷', intelligence: '智力' },
  'zh-TW': { strength: '力量', agility: '敏捷', intelligence: '智力' },
  en: { strength: 'Strength', agility: 'Agility', intelligence: 'Intelligence' }
};

// These are deliberately small derived contributions. Existing flat stats and
// the unified attackPower contract remain the primary balance knobs.
export const ATTRIBUTE_RULES = {
  strength: { maxHp: 3, regen: .2 },
  agility: { attackSpeed: 1.5, armor: .15 },
  intelligence: { maxMana: 4, manaRegen: .12, abilityHaste: .75 }
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

export function attributeContribution(key, amount, primaryAttribute = '') {
  const rule = ATTRIBUTE_RULES[key] || {};
  const result = {};
  for (const [derivedKey, ratio] of Object.entries(rule)) result[derivedKey] = amount * ratio;
  if (key === primaryAttribute) result.attackPower = amount * PRIMARY_ATTACK_POWER;
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
