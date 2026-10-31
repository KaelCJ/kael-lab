import { buffDamageAmp } from './buffs.js?v=20261031-positive1-tree-attributes1';

export function attackPower(run) {
  const souls = run.character.id === 'sf' ? run.skills.souls : 0;
  return (Number(run.stats.attackPower) || 0)
    + Math.min(36, souls) * .55 + Math.max(0, souls - 36) * .05;
}

// Spell power is intentionally separate from attackPower. Basic attacks read
// attackPower; hero skills and spell-shaped equipment read this value instead.
export function skillPower(run) {
  return Number(run.stats.skillPower) || 0;
}

export function resolveDamage(run, enemy, amount, { source = 'equipment', resolved = false, criticalRoll = Math.random } = {}) {
  if (!enemy || enemy.dead || !(enemy.hp > 0) || !Number.isFinite(amount) || !(amount > 0))
    return { damage: 0, critical: false, actualLostHP: 0 };

  let critical = false, damage = amount;
  if (!resolved) {
    critical = source === 'basic' && criticalRoll() * 100 < Math.max(0, Math.min(90, run.stats.crit));
    const marked = run.totalTime < (enemy.desolateUntil || 0) ? 1 + (enemy.desolateMultiplier || 0) : 1;
    const aura = 1 + buffDamageAmp(run, Math.hypot(enemy.x - run.player.x, enemy.y - run.player.y));
    damage *= Math.max(.1, 1 + run.stats.damage / 100) * marked * aura
      * (critical ? 1 + Math.max(0, run.stats.critDamage) / 100 : 1);
  }
  damage = Math.max(1, Math.round(damage));
  return { damage, critical, actualLostHP: Math.min(enemy.hp, damage) };
}
