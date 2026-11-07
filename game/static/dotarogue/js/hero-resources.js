import { CHARACTERS } from './heroes.js?v=20261031-sf-requiem5';
import { createResourcePack } from './resource-loading.js?v=20261107-resource-packs1';
import { createWindRenderer } from './effects/wind.js?v=20261107-resource-packs1';
import { createMeteorRenderer } from './effects/meteor.js?v=20261107-resource-packs1';
import { createRequiemRenderer } from './effects/requiem.js?v=20261031-sf-requiem5';
import { createEclipseRenderer } from './effects/eclipse.js?v=20261031-luna-eclipse2';

const HERO_ART_VERSION = '?v=20261013-kael-elf1';
const LUNA_ART_VERSION = '?v=20261013-luna-glaive1';
export const HERO_ART = Object.fromEntries(CHARACTERS.map(({ id }) =>
  [id, `./assets/characters/${id}/${id}-idle-a.svg${id === 'luna' ? LUNA_ART_VERSION : HERO_ART_VERSION}`]));
export const DOTA1_MODEL_DISPLAY = {"rover": {"height": 149.7765, "bottomRatio": 0.32574031890660593}, "bulwark": {"height": 99.3129, "bottomRatio": 0.19718309859154926}, "conductor": {"height": 118.4795, "bottomRatio": 0.28673835125448033}, "scavenger": {"height": 175.48586118251927, "bottomRatio": 0.39892183288409705}, "jugg": {"height": 352.9231, "bottomRatio": 0.19729729729729728}, "kael": {"height": 157.2289, "bottomRatio": 0.30000000000000004}, "luna": {"height": 138, "bottomRatio": 0.23206751054852326}, "tb": {"height": 193.3362, "bottomRatio": 0.27813163481953296}, "tb-demon": {"height": 208.8462, "bottomRatio": 0.2762430939226519}, "sf": {"height": 120, "bottomRatio": 0.21666666666666667}, "scavenger-rage": {"height": 175.48586118251927, "bottomRatio": 0.39892183288409705}};
export const HERO_DOTA1_ART = Object.fromEntries(CHARACTERS.map(({ id }) =>
  [id, `./assets/characters/dota1/${id}/${id}-idle-a.webp?v=20261031-lossless1`]));
export const HERO_POSE_ART = Object.fromEntries(Object.keys(HERO_ART).flatMap(id =>
  ['idle-alt', 'walk-a', 'walk-b', 'dash', 'attack-windup', 'attack', 'attack-release', 'skill',
    'side-idle-a', 'side-idle-alt', 'side-walk-a', 'side-walk-b', 'side-dash',
    'side-attack-windup', 'side-attack', 'side-attack-release', 'side-skill'].map(pose =>
    [`${id}-${pose}`, `./assets/characters/${id}/${id}-${pose}.svg${id === 'luna' ? LUNA_ART_VERSION : HERO_ART_VERSION}`])));
HERO_POSE_ART['luna-glaive'] = `./assets/characters/luna/luna-glaive.svg${LUNA_ART_VERSION}`;
export const HERO_POSE_DOTA1_ART = Object.fromEntries(Object.keys(HERO_DOTA1_ART).flatMap(id =>
  ['idle-a', 'idle-alt', 'walk-a', 'walk-b', 'dash', 'attack-windup', 'attack', 'attack-release', 'skill',
    'side-idle-a', 'side-idle-alt', 'side-walk-a', 'side-walk-b', 'side-dash',
    'side-attack-windup', 'side-attack', 'side-attack-release', 'side-skill'].map(pose =>
    [`${id}-${pose}`, `./assets/characters/dota1/${id}/${id}-${pose}.webp?v=20261031-lossless1`])));
HERO_POSE_DOTA1_ART['luna-glaive'] = './assets/characters/dota1/luna/luna-glaive.svg?v=20261028-dota1-reference1';
for (const pose of ['idle-a', 'idle-alt', 'walk-a', 'walk-b', 'dash', 'attack-windup', 'attack', 'attack-release', 'skill']) {
  for (const side of ['', 'side-']) HERO_POSE_DOTA1_ART[`tb-demon-${side}${pose}`] = `./assets/characters/dota1/tb/tb-demon-${side}${pose}.webp?v=20261031-lossless1`;
}
for (const pose of ['idle-a', 'idle-alt', 'walk-a', 'walk-b', 'dash', 'attack-windup', 'attack', 'attack-release', 'skill']) {
  for (const side of ['', 'side-']) HERO_POSE_ART[`tb-demon-${side}${pose}`] = `./assets/characters/tb/tb-demon-${side}${pose}.svg?v=20261014-tb1`;
}
for (const [poses, root, extension] of [[HERO_POSE_ART, './assets/characters/scavenger', 'svg'], [HERO_POSE_DOTA1_ART, './assets/characters/dota1/scavenger', 'webp']]) {
  for (const side of ['', 'side-']) {
    for (const pose of ['idle-a', 'idle-alt', 'walk-a', 'walk-b', 'dash', 'attack-windup', 'attack', 'attack-release', 'skill']) {
      poses[`scavenger-rage-${side}${pose}`] = `${root}/scavenger-rage-${side}${pose}.${extension}?v=20261030-rage1`;
    }
    for (const direction of ['in', 'out']) for (let frame = 0; frame < 3; frame++) {
      poses[`scavenger-${side}morph-${direction}-${frame}`] = `${root}/scavenger-${side}morph-${direction}-${frame}.${extension}?v=20261030-rage1`;
    }
  }
}
const heroId = id => id.replace(/-(demon|rage)$/, '');
const skinId = skin => skin === 'dota1' ? 'dota1' : 'pixel';
const skillKinds = id => id === 'kael' ? ['wind', 'meteor'] : id === 'sf' ? ['requiem'] : id === 'luna' ? ['eclipse'] : [];

export function createHeroResources(images, onChange) {
  const heroes = new Map(), skills = new Map();
  const effects = { wind: null, meteor: null, requiem: null, eclipse: null };

  function skill(kind) {
    if (!skills.has(kind)) {
      const factories = { wind: createWindRenderer, meteor: createMeteorRenderer, requiem: createRequiemRenderer, eclipse: createEclipseRenderer };
      skills.set(kind, createResourcePack([async signal => {
        const renderer = await factories[kind]({ loadImage: path => images.load(path, { signal }) });
        signal.throwIfAborted();
        effects[kind] = renderer;
        onChange();
      }]));
    }
    return skills.get(kind);
  }

  function get(id, skin) {
    const hero = heroId(id), selectedSkin = skinId(skin), key = `${selectedSkin}:${hero}`;
    if (!heroes.has(key)) {
      const base = selectedSkin === 'dota1' ? HERO_DOTA1_ART : HERO_ART;
      const poses = selectedSkin === 'dota1' ? HERO_POSE_DOTA1_ART : HERO_POSE_ART;
      const root = `./assets/characters/${selectedSkin === 'dota1' ? 'dota1/' : ''}${hero}/`;
      const paths = new Set([base[hero], ...Object.values(poses).filter(path => path.startsWith(root))]);
      heroes.set(key, { frames: createResourcePack([...paths].map(path => signal => images.load(path, { signal }))), skills: skillKinds(hero).map(skill) });
    }
    return heroes.get(key);
  }

  return {
    get, effects,
    isReady(id, skin) {
      const record = heroes.get(`${skinId(skin)}:${heroId(id)}`);
      return !!record?.frames.ready && record.skills.every(pack => pack.ready);
    },
    async loadEffect(kind) {
      try { await skill(kind).prepare(); return effects[kind]; }
      catch (error) { console.warn('Skill graphics unavailable; using the drawing fallback.', error); return null; }
    }
  };
}
