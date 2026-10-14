// Hero-owned transient state; the combat loop supplies paused game time.
export function createTerrorbladeState() {
  return { time: 0, amp: 1, hits: 0, images: [] };
}

export function updateTerrorblade(state, dt) {
  state.time = Math.max(0, state.time - dt);
  for (const image of state.images) image.time -= dt;
  state.images = state.images.filter(image => image.time > 0);
}

export function registerTerrorbladeHit(state, attack) {
  // The same token follows every direct hit of a swing/projectile, including
  // delayed shots arriving out of order. A last-ID comparison is insufficient.
  if (!attack || attack.counted) return false;
  attack.counted = true;
  state.hits += 1;
  if (state.hits < 6) return false;
  state.hits = 0;
  if (state.images.length < 2) state.images.push({ time: 5 });
  else state.images.reduce((oldest, image) => image.time < oldest.time ? image : oldest).time = 5;
  return true;
}
