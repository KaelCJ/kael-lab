export const WORLD = { w: 2600, h: 1700 };

export const BIOMES = [
  { id: 'docks', name: '赤沙废港', icon: '◈', desc: '灼热沙尘与失控机械', ground: '#263238', grid: '#40515a', accent: '#ffba72', hazard: '热流喷口' },
  { id: 'grove', name: '荧菌裂谷', icon: '✿', desc: '发光菌簇与腐蚀孢雾', ground: '#26303c', grid: '#3f4c61', accent: '#d6a0f1', hazard: '孢雾爆发' },
  { id: 'frost', name: '蓝霜残骸', icon: '❄', desc: '冻结碎片与寒流裂缝', ground: '#1e3440', grid: '#3b5967', accent: '#9fdcf5', hazard: '寒流爆裂' }
];

export const RIVER_CURVES = {
  docks: [
    { points: [[.01, .54], [.18, .34], [.38, .39], [.58, .68], [.77, .5], [.99, .36]], radius: [.19, .2, .21, .2, .2, .18] },
    { points: [[.01, .58], [.24, .45], [.46, .66], [.68, .4], [.99, .52]], radius: [.22, .23, .2, .22, .2] }
  ],
  grove: [
    { points: [[.01, .38], [.2, .62], [.4, .46], [.61, .28], [.8, .52], [.99, .42]], radius: [.2, .2, .22, .21, .2, .18] },
    { points: [[.01, .58], [.23, .4], [.45, .62], [.67, .34], [.99, .5]], radius: [.21, .22, .2, .22, .2] }
  ],
  frost: [
    { points: [[.01, .52], [.19, .3], [.38, .57], [.59, .4], [.79, .7], [.99, .5]], radius: [.2, .21, .2, .22, .2, .18] },
    { points: [[.01, .42], [.24, .62], [.47, .36], [.7, .56], [.99, .32]], radius: [.21, .22, .2, .22, .2] }
  ]
};

export const TERRAIN_LAYOUTS = {
  docks: {
    water: [[1600, 520, 448, 128], [610, 1130, 384, 64]],
    tree: [[930, 580], [1010, 1135], [1450, 550], [1690, 1050], [700, 800], [2100, 1080]],
    rock: [[1510, 1000], [1180, 560], [930, 1370], [1960, 840], [1780, 1300]]
  },
  grove: {
    water: [[530, 560, 448, 128], [1630, 980, 384, 128]],
    tree: [[1140, 580], [1550, 640], [940, 990], [1250, 1210], [2010, 660], [740, 1270]],
    rock: [[1050, 760], [1600, 830], [1460, 1220], [1840, 560], [550, 1050]]
  },
  frost: {
    water: [[1000, 450, 448, 128], [1600, 1070, 448, 128]],
    tree: [[900, 720], [1510, 660], [1120, 1190], [1960, 740], [740, 1180], [2080, 1300]],
    rock: [[1560, 940], [1000, 960], [1260, 1340], [1860, 540], [560, 730]]
  }
};

export function buildTerrain(id) {
  const layout = TERRAIN_LAYOUTS[id];
  return [
    ...layout.water.map(([x, y, w, h], index) => ({
      kind: 'water', x, y, w, h,
      curve: RIVER_CURVES[id][index].points.map(([px, py], pointIndex) => ({
        x: x + px * w, y: y + py * h,
        r: RIVER_CURVES[id][index].radius[pointIndex] * h
      }))
    })),
    ...layout.tree.map(([x, y]) => ({ kind: 'tree', x, y, r: 22 })),
    ...layout.rock.map(([x, y]) => ({ kind: 'rock', x, y, r: 22 }))
  ];
}

export const SCENERY_COLORS = {
  docks: { ground: '#c7a27b', shade: '#bc956b', light: '#d5b38b', grass: '#7b8550', bank: '#967b58', shore: '#d6bc8b', water: '#5d928d', stone: '#706b5d', fish: '#e1c27f' },
  grove: { ground: '#718460', shade: '#6b7e5b', light: '#788b64', grass: '#83945f', bank: '#5b7056', shore: '#87916a', water: '#4a7475', stone: '#596b61', fish: '#b9d7ae' },
  frost: { ground: '#b9c8c7', shade: '#9eafb3', light: '#e1e6dc', grass: '#778c87', bank: '#8da7aa', shore: '#dae3da', water: '#7498a6', stone: '#74858a', fish: '#d8e9df' }
};
