import { createResourcePack } from './resource-loading.js?v=20261107-resource-packs1';

export const ENEMY_POSES = {
  crawler: ['step', 'attack'], runner: ['step'], tank: ['step'], shooter: ['attack'],
  centaur: ['step', 'windup', 'attack'], satyr: ['step', 'windup', 'attack'],
  hellbear: ['step', 'windup', 'attack'], darkTroll: ['step', 'windup', 'attack'],
  frostWraith: ['step', 'windup', 'attack'], thunderLizard: ['step', 'windup', 'attack'],
  charger: ['windup', 'charge'], splitter: ['step'], elite: ['windup', 'charge'], boss: ['windup', 'attack'], roshan: ['windup', 'attack']
};

export const COMBAT_ART = Object.fromEntries(Object.entries(ENEMY_POSES).flatMap(([id, poses]) =>
  [id, ...poses.map(pose => `${id}-${pose}`)].map(key => [key, `./assets/art/pixel/${key}.svg`])));

export function createCombatResources(images) {
  return createResourcePack(Object.values(COMBAT_ART).map(path => signal => images.load(path, { signal })));
}

export const DRAFT_ART = {
  crawler: './assets/art/crawler.svg',
  'crawler-step': './assets/art/crawler-step.svg', 'crawler-attack': './assets/art/crawler-attack.svg',
  elite: './assets/art/elite.svg', boss: './assets/art/boss.svg',
  roshan: './assets/art/roshan.svg', 'roshan-windup': './assets/art/roshan-windup.svg', 'roshan-attack': './assets/art/roshan-attack.svg',
  blade: './assets/art/blade.svg'
};

export const UPGRADE_ART = Object.fromEntries(Array.from({ length: 14 }, (_, index) => [`upgrade-${index}`, `./assets/art/pixel/upgrade-${index}.svg`]));
