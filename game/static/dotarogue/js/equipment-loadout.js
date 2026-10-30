import { EQUIPMENT, equipmentLevel, equipmentUpgradeIndices } from './equipment.js?v=20261030-equipment18';
import { planEquipmentCraft } from './equipment-crafting.js?v=20261030-equipment18';

function validItem(item) {
  return !!item && item.uid != null && Object.hasOwn(EQUIPMENT, item.id)
    && (item.level == null || item.level === equipmentLevel(item));
}

function validLoadout(active, reserve, capacity) {
  if (!Array.isArray(active) || !Array.isArray(reserve) || !Number.isInteger(capacity)
    || capacity < 0 || active.length > capacity) return false;
  const items = [...active, ...reserve];
  return items.every(validItem) && new Set(items.map(item => item.uid)).size === items.length;
}

function makeResult(active, reserve, id, level, createItem) {
  if (typeof createItem !== 'function') return null;
  const result = createItem(id, level);
  return validItem(result) && result.id === id && equipmentLevel(result) === level
    && ![...active, ...reserve].some(item => item.uid === result.uid) ? result : null;
}

// Reuse the first consumed active position; unused reserve items stay inactive.
function replace(active, reserve, consumed, result, capacity) {
  const used = new Set(consumed);
  const index = active.findIndex(item => used.has(item.uid));
  const nextActive = active.filter(item => !used.has(item.uid));
  const nextReserve = reserve.filter(item => !used.has(item.uid));
  const location = nextActive.length < capacity ? 'active' : 'reserve';
  if (location === 'active') nextActive.splice(index < 0 ? nextActive.length : index, 0, result);
  else nextReserve.push(result);
  return { active: nextActive, reserve: nextReserve, result, location };
}

export function acquisition(active, reserve, item, capacity) {
  if (!validLoadout(active, reserve, capacity) || !validItem(item)
    || [...active, ...reserve].some(held => held.uid === item.uid)) return null;
  return replace(active, reserve, [], item, capacity);
}

export function craft(active, reserve, targetId, createItem, capacity, incomingId = null) {
  if (!validLoadout(active, reserve, capacity)) return null;
  const plan = planEquipmentCraft([...active, ...reserve], targetId, incomingId);
  if (!plan) return null;
  const result = makeResult(active, reserve, targetId, 1, createItem);
  if (!result) return null;
  return { ...replace(active, reserve, plan.consumeUids, result, capacity), plan };
}

export function upgrade(active, reserve, uid, createItem, capacity, batch = false) {
  if (!validLoadout(active, reserve, capacity)) return null;
  const source = [...active, ...reserve].find(item => item.uid === uid);
  if (!source || !equipmentUpgradeIndices([...active, ...reserve], uid)) return null;
  const level = equipmentLevel(source);
  const count = [...active, ...reserve].filter(item => item.id === source.id && equipmentLevel(item) === level).length;
  const groups = batch ? Math.floor(count / 3) : 1;
  let state = { active, reserve };
  const results = [];
  for (let group = 0; group < groups; group += 1) {
    const items = [...state.active, ...state.reserve];
    const selected = group === 0 ? source : items.find(item => item.id === source.id && equipmentLevel(item) === level);
    const indices = equipmentUpgradeIndices(items, selected?.uid);
    if (!indices) return null;
    const result = makeResult(state.active, state.reserve, source.id, level + 1, createItem);
    if (!result) return null;
    state = replace(state.active, state.reserve, indices.map(index => items[index].uid), result, capacity);
    results.push({ result, location: state.location });
  }
  return { ...state, results };
}

export function move(active, reserve, uid, toActive, capacity, swapUid = null) {
  if (!validLoadout(active, reserve, capacity) || typeof toActive !== 'boolean') return null;
  const source = toActive ? reserve : active;
  const index = source.findIndex(item => item.uid === uid);
  if (index < 0 || (!toActive && swapUid != null)) return null;
  const nextActive = [...active], nextReserve = [...reserve], result = source[index];
  if (!toActive) {
    nextActive.splice(index, 1);
    nextReserve.push(result);
  } else if (swapUid != null) {
    const swapIndex = active.findIndex(item => item.uid === swapUid);
    if (swapIndex < 0) return null;
    nextActive[swapIndex] = result;
    nextReserve[index] = active[swapIndex];
  } else {
    if (active.length >= capacity) return null;
    nextReserve.splice(index, 1);
    nextActive.push(result);
  }
  return { active: nextActive, reserve: nextReserve, result, location: toActive ? 'active' : 'reserve' };
}

export function automate(active, reserve, targets, createItem, capacity) {
  if (!validLoadout(active, reserve, capacity) || !Array.isArray(targets) || targets.length > 2
    || new Set(targets).size !== targets.length
    || targets.some(id => EQUIPMENT[id]?.kind !== 'finished' || !EQUIPMENT[id].recipe?.length)) return null;
  let state = { active: [...active], reserve: [...reserve] };
  const actions = [];
  // Every current recipe and three-for-one reduces the instance count. The
  // initial count is also a hard bound, including future malformed recipes.
  for (let budget = active.length + reserve.length; budget > 0; budget -= 1) {
    const items = [...state.active, ...state.reserve];
    const source = items.find(item => equipmentUpgradeIndices(items, item.uid));
    let next = source ? upgrade(state.active, state.reserve, source.uid, createItem, capacity) : null;
    let type = 'upgrade';
    if (!source) {
      const target = targets.find(id => planEquipmentCraft(items, id));
      if (target == null) break;
      next = craft(state.active, state.reserve, target, createItem, capacity);
      type = 'craft';
    }
    if (!next || next.active.length + next.reserve.length >= items.length) return null;
    actions.push({ type, id: next.result.id, level: equipmentLevel(next.result), location: next.location });
    state = next;
  }
  return { active: state.active, reserve: state.reserve, actions };
}
