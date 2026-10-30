import { buffDamageAmp } from './buffs.js?v=20261027-unified1';

export function attackPower(run) {
  const souls = run.character.id === 'sf' ? run.skills.souls : 0;
  return (Number(run.stats.attackPower) || 0) + (Number(run.stats.primaryAttributePower) || 0)
    + Math.min(36, souls) * .55 + Math.max(0, souls - 36) * .05;
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
