import { EQUIPMENT } from "./equipment.js?v=20261027-unified1";

// Plan the entire target before the caller changes inventory, currency or rewards.
export function planEquipmentCraft(items, targetId, incomingId = null) {
  const target = EQUIPMENT[targetId];
  if (!Array.isArray(target?.recipe) || !target.recipe.length) return null;
  if (incomingId !== null && !Object.hasOwn(EQUIPMENT, incomingId)) return null;

  const incoming = Symbol("incomingEquipment");
  const inventory = items.map(item => ({ uid: item.uid, id: item.id }));
  if (incomingId !== null) inventory.unshift({ uid: incoming, id: incomingId });

  function* ingredients(recipe, state, ancestors) {
    if (!recipe.length) {
      yield state;
      return;
    }
    const [id, ...rest] = recipe;
    for (const next of material(id, state, ancestors)) {
      yield* ingredients(rest, next, ancestors);
    }
  }

  function* material(id, state, ancestors) {
    const definition = EQUIPMENT[id];
    if (!definition || definition.kind === "finished") return;

    // Identical held instances are interchangeable; the incoming item is distinct.
    let heldTried = false;
    for (let index = 0; index < state.remaining.length; index += 1) {
      const item = state.remaining[index];
      if (item.id !== id || (item.uid !== incoming && heldTried)) continue;
      if (item.uid !== incoming) heldTried = true;
      yield {
        remaining: state.remaining.filter((_, candidate) => candidate !== index),
        steps: state.steps
      };
    }

    if (!definition.recipe?.length || ancestors.has(id)) return;
    const nextAncestors = new Set(ancestors).add(id);
    for (const next of ingredients(definition.recipe, state, nextAncestors)) {
      yield { remaining: next.remaining, steps: [...next.steps, id] };
    }
  }

  for (const state of ingredients(target.recipe, { remaining: inventory, steps: [] }, new Set([targetId]))) {
    const incomingUsed = incomingId !== null && !state.remaining.some(item => item.uid === incoming);
    if (incomingId !== null && !incomingUsed) continue;
    const remaining = new Set(state.remaining.map(item => item.uid));
    return {
      id: targetId,
      consumeUids: inventory.filter(item => item.uid !== incoming && !remaining.has(item.uid)).map(item => item.uid),
      incomingUsed,
      steps: [...state.steps, targetId]
    };
  }
  return null;
}

export function availableEquipmentCrafts(items, incomingId = null) {
  return Object.keys(EQUIPMENT)
    .filter(id => EQUIPMENT[id].recipe?.length)
    .map(id => planEquipmentCraft(items, id, incomingId))
    .filter(Boolean);
}
