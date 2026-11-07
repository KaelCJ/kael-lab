import { BIOMES } from './game-settings.js?v=20261106-title1';
import { createResourcePack } from './resource-loading.js?v=20261107-resource-packs1';
import { buildTerrain } from './maps.js?v=20261107-resource-packs1';

export const MAP_ART = Object.fromEntries(BIOMES.filter(map => map.id !== 'dota').flatMap(({ id }) =>
  ['ground', 'tree', 'rock', 'water', 'trap', 'preview'].map(kind => [`map-${id}-${kind}`, `./assets/art/pixel/map-${id}-${kind}.svg`])));

export function createMapResources(images, prepareGeometry) {
  const records = new Map();
  function get(id) {
    if (!records.has(id)) {
      const record = { id, terrain: buildTerrain(id), navGrids: new Map(), spawnFlows: new Map(), collision: null, pack: null };
      const tasks = id === 'dota' ? [] : ['ground', 'tree', 'rock', 'water', 'trap'].map(kind =>
        signal => images.load(MAP_ART[`map-${id}-${kind}`], { signal }));
      tasks.push(signal => prepareGeometry(record, signal));
      record.pack = createResourcePack(tasks);
      records.set(id, record);
    }
    return records.get(id);
  }
  return { get, isReady: id => records.get(id)?.pack.ready === true };
}
