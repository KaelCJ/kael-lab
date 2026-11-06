export const MODES = [
  { id: 'expedition', name: '远征' },
  { id: 'endless', name: '无尽' }
];

export const DIFFICULTIES = [
  { id: 'normal', name: '标准', mult: 1, spawnRate: 1, enemyCap: 95, nearbyMin: 3 },
  { id: 'hard', name: '挑战', mult: 1.3, spawnRate: 1.16, enemyCap: 120, nearbyMin: 4 },
  { id: 'nightmare', name: '极限', mult: 1.65, spawnRate: 1.38, enemyCap: 150, nearbyMin: 6 }
];
export const PACES = [{ id: 'normal', name: '标准' }, { id: 'quick', name: '速战' }];

export const BIOMES = [
  { id: 'dota', name: 'DotA 经典战场', icon: '', desc: '近卫与天灾 · 三路、河道与野区', ground: '#344330', grid: '#59604c', accent: '#a8dd94', hazard: '远古裂隙' },
  { id: 'docks', name: '赤沙废港', icon: '◈', desc: '灼热沙尘与失控机械', ground: '#263238', grid: '#40515a', accent: '#ffba72', hazard: '热流喷口' },
  { id: 'grove', name: '荧菌裂谷', icon: '✿', desc: '发光菌簇与腐蚀孢雾', ground: '#26303c', grid: '#3f4c61', accent: '#d6a0f1', hazard: '孢雾爆发' },
  { id: 'frost', name: '蓝霜残骸', icon: '❄', desc: '冻结碎片与寒流裂缝', ground: '#1e3440', grid: '#3b5967', accent: '#9fdcf5', hazard: '寒流爆裂' }
];

// Keep the legacy key and migration so existing browser records remain available.
export const SAVE_KEY = 'kael-lab-starcore-survivor-v1';
export const SUPPORTED_LOCALES = ['zh-CN', 'zh-TW', 'en'];
export const DEFAULT_LOCALE = 'zh-CN';

export function loadSave(studioMode = false) {
  if (studioMode) return { settings: { sound: false }, records: {}, wins: 0 };
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    const records = {};
    for (const [key, wave] of Object.entries(raw.records || {})) {
      const modeKey = key.split(':').length === 3 ? `${key}:expedition` : key;
      records[modeKey] = Math.max(records[modeKey] || 0, Number(wave) || 0);
    }
    return { settings: raw.settings || {}, records, wins: Number(raw.wins) || 0 };
  } catch (_) { return { settings: {}, records: {}, wins: 0 }; }
}

export function saveGame(save) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (_) { /* Storage may be unavailable. */ }
}
