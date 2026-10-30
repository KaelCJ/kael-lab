import { EQUIPMENT } from './equipment.js?v=20261030-equipment18';

// A synergy is a combination reward, not a claim about the original DotA item.
export const EQUIPMENT_BUILDS = [
  {
    "id": "windfury",
    "thresholds": [
      2,
      4
    ],
    "name": "风怒",
    "nameTw": "風怒",
    "nameEn": "Windfury",
    "members": [
      "mjollnir",
      "butterfly",
      "powerTreads",
      "manta",
      "monkeyKingBar",
      "orchid"
    ],
    "desc": "连续出手。2／4件：每4次有效普攻，间隔0.12秒向原目标追加1／2次60%原始普攻伤害的攻击。目标死亡、离开基础射程或被地形阻挡时取消；追加攻击不暴击、不触发命中被动。",
    "descTw": "連續出手。2／4件：每4次有效普攻，間隔0.12秒向原目標追加1／2次60%原始普攻傷害的攻擊。目標死亡、離開基礎射程或被地形阻擋時取消；追加攻擊不暴擊、不觸發命中被動。",
    "descEn": "Attack in quick succession. 2 / 4 items: every 4 successful basics add 1 / 2 attacks against the same target, 0.12 sec apart, each for 60% raw basic damage. Cancelled if the target dies, leaves basic range or becomes blocked. Extra attacks cannot crit or trigger on-hit passives."
  },
  {
    "id": "cleave",
    "thresholds": [
      2,
      4
    ],
    "name": "顺劈",
    "nameTw": "順劈",
    "nameEn": "Cleave",
    "members": [
      "battlefury",
      "buriza",
      "desolator",
      "divineRapier"
    ],
    "desc": "普攻兼顾周围敌人。2／4件：每次有效普攻对首目标周围80／110范围内最多3名额外敌人造成15%／30%原始普攻伤害。每次攻击只触发一次，顺劈不触发其他命中被动。",
    "descTw": "普攻兼顧周圍敵人。2／4件：每次有效普攻對首目標周圍80／110範圍內最多3名額外敵人造成15%／30%原始普攻傷害。每次攻擊只觸發一次，順劈不觸發其他命中被動。",
    "descEn": "Basics also hit nearby enemies. 2 / 4 items: each successful basic deals 15% / 30% raw basic damage to up to 3 extra enemies within 80 / 110 of its first target. Once per attack; cleave cannot trigger on-hit passives."
  },
  {
    "id": "inspire",
    "thresholds": [
      2,
      4
    ],
    "name": "激励",
    "nameTw": "激勵",
    "nameEn": "Inspire",
    "members": [
      "aghanim",
      "dagon",
      "orchid",
      "cyclone",
      "necronomicon",
      "bloodstone",
      "meteorHammer"
    ],
    "desc": "英雄主动技带动装备。2／4件：成功施放Q回复2／4法力，并使红杖、风杖、死灵书、陨星锤已有冷却前进1／2秒。最多每秒一次，不重置Q或自动追加施放。",
    "descTw": "英雄主動技帶動裝備。2／4件：成功施放Q回復2／4法力，並使紅杖、風杖、死靈書、隕星錘已有冷卻前進1／2秒。最多每秒一次，不重置Q或自動追加施放。",
    "descEn": "Your hero ability inspires gear. 2 / 4 items: a successful Q restores 2 / 4 MP and advances existing Dagon, Eul’s Scepter, Necronomicon and Meteor Hammer cooldowns by 1 / 2 sec. At most once per second; does not reset Q or cast again."
  },
  {
    "id": "elemental",
    "thresholds": [
      2,
      3
    ],
    "name": "元素",
    "nameTw": "元素",
    "nameEn": "Elemental",
    "members": [
      "mjollnir",
      "radiance",
      "skadi",
      "meteorHammer"
    ],
    "desc": "雷、火、冰轮转。2／3件：每8／5次有效普攻，轮流释放当前装备提供的元素：雷锤连锁最多3名；辉耀或陨星锤火爆90范围最多6名；冰眼冰爆120范围最多6名并减速30%／45%一秒。伤害12／20＋攻击力×0.3，冰爆半伤；精英／首领冰控缩短。",
    "descTw": "雷、火、冰輪轉。2／3件：每8／5次有效普攻，輪流釋放目前裝備提供的元素：雷錘連鎖最多3名；輝耀或隕星錘火爆90範圍最多6名；冰眼冰爆120範圍最多6名並減速30%／45%一秒。傷害12／20＋攻擊力×0.3，冰爆半傷；精英／首領冰控縮短。",
    "descEn": "Rotate lightning, fire and frost from equipped gear. 2 / 3 items: every 8 / 5 successful basics release Mjollnir lightning (up to 3 chain targets), Radiance or Meteor Hammer fire (90 area, up to 6), or Skadi frost (120 area, up to 6, slows 30% / 45% for 1 sec). Damage: 12 / 20 + attack power × 0.3; frost deals half. Frost control is shorter on elites and bosses."
  },
  {
    "id": "lifesteal",
    "thresholds": [
      2,
      3
    ],
    "name": "吸血",
    "nameTw": "吸血",
    "nameEn": "Lifesteal",
    "members": [
      "satanic",
      "bloodstone",
      "necronomicon"
    ],
    "desc": "造成伤害恢复生命。2／3件：所有实际伤害额外回复4%／6%，任意一秒内最多回复最大生命2%／3%。包括装备、召唤与反伤；溢出伤害和尸体不计，不复活。",
    "descTw": "造成傷害恢復生命。2／3件：所有實際傷害額外回復4%／6%，任意一秒內最多回復最大生命2%／3%。包括裝備、召喚與反傷；溢出傷害和屍體不計，不復活。",
    "descEn": "Damage restores health. 2 / 3 items: all actual damage additionally heals for 4% / 6%, capped at 2% / 3% max HP in any one-second window. Includes gear, summons and reflected damage. Overkill and corpses do not count; cannot revive you."
  },
  {
    "id": "divineShield",
    "thresholds": [
      2,
      4
    ],
    "name": "圣盾",
    "nameTw": "聖盾",
    "nameEn": "Divine Shield",
    "members": [
      "vanguard",
      "bladeMail",
      "heart",
      "skadi",
      "satanic"
    ],
    "desc": "完全抵挡一次伤害。2／4件：生效14／9秒后获得一层圣盾，消耗后重新计时。未用不叠加；闪避或完全格挡不消耗，免伤不触发受伤效果。移除羁绊失去盾，切装不会刷新。",
    "descTw": "完全抵擋一次傷害。2／4件：生效14／9秒後獲得一層聖盾，消耗後重新計時。未用不疊加；閃避或完全格擋不消耗，免傷不觸發受傷效果。移除羈絆失去盾，切裝不會刷新。",
    "descEn": "Fully block one damage event. 2 / 4 items: gain one Divine Shield after 14 / 9 active seconds, then recharge after consumption. Unused shields do not stack. Dodges and fully blocked hits do not consume it; shielding cannot trigger hurt effects. Losing the synergy removes the shield; rearranging gear cannot refresh it."
  }
];

export function equipmentBuilds(id) {
  return EQUIPMENT[id]?.kind === 'finished'
    ? EQUIPMENT_BUILDS.filter(build => build.members.includes(id)).map(build => build.id) : [];
}

export function resolveBuilds(active = []) {
  const ids = new Set(active.map(item => typeof item === 'string' ? item : item?.id));
  return EQUIPMENT_BUILDS.map(build => {
    const items = build.members.filter(id => ids.has(id));
    const count = items.length, tier = build.thresholds.filter(threshold => count >= threshold).length;
    return { ...build, count, tier, next: build.thresholds[tier] ?? null, items };
  });
}

export function buildName(id, locale = 'zh-CN') {
  const build = EQUIPMENT_BUILDS.find(entry => entry.id === id);
  return build?.[locale === 'en' ? 'nameEn' : locale === 'zh-TW' ? 'nameTw' : 'name'] || '';
}

export function buildDescription(id, locale = 'zh-CN') {
  const build = EQUIPMENT_BUILDS.find(entry => entry.id === id);
  return build?.[locale === 'en' ? 'descEn' : locale === 'zh-TW' ? 'descTw' : 'desc'] || '';
}
