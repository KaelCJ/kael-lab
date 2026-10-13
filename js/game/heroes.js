export const CHARACTERS = [
  { id: 'rover', hp: 34, stats: { speed: 8 }, name: '矮人火枪手' },
  { id: 'bulwark', hp: 44, stats: { armor: 3 }, name: '刚背兽' },
  { id: 'conductor', hp: 32, stats: {}, name: '众神之王' },
  { id: 'scavenger', hp: 38, stats: { luck: 12, pickup: 30 }, name: '炼金术士' },
  { id: 'jugg', hp: 38, stats: { speed: 8 }, name: '剑圣' },
  { id: 'sf', hp: 32, stats: {}, name: '影魔' },
  { id: 'kael', hp: 30, stats: { elemental: 4 }, name: '召唤师' },
  { id: 'luna', hp: 32, stats: { speed: 6 }, name: '月之骑士' }
];

export const BASE_ATTACKS = {
  rover: { type: 'ranged', damage: 9, cooldown: .48, range: 460, speed: 850, color: '#ffe8ac' },
  bulwark: { type: 'melee', damage: 18, cooldown: .8, range: 122, color: '#decfae' },
  conductor: { type: 'elemental', damage: 13, cooldown: 1, range: 430, speed: 1000, color: '#c6efff' },
  scavenger: { type: 'melee', damage: 17, cooldown: .85, range: 118, color: '#b8df83' },
  jugg: { type: 'melee', damage: 20, cooldown: .75, range: 122, color: '#f8e6ba' },
  sf: { type: 'ranged', damage: 9, cooldown: .6, range: 500, speed: 640, color: '#ef6754' },
  kael: { type: 'elemental', damage: 8, cooldown: .72, range: 470, speed: 880, color: '#c99aff' },
  luna: { type: 'ranged', damage: 10, cooldown: .62, range: 440, speed: 820, color: '#d9e9ff' }
};

export const ACTIVE_SKILL_CONFIG = {
  rover: { cooldown: 9, manaCost: 30 }, bulwark: { cooldown: 8, manaCost: 28 },
  conductor: { cooldown: 16, manaCost: 40 }, scavenger: { cooldown: 16, manaCost: 36 },
  jugg: { cooldown: 12, manaCost: 36 }, sf: { cooldown: 16, manaCost: 42 },
  kael: { cooldown: 8, manaCost: 35 }, luna: { cooldown: 18, manaCost: 42 }
};

export const HERO_TEXT = {
  'zh-CN': {
    rover: ['矮人火枪手', '人族 · 矮人火枪手', '远程物理 · 远距点杀与散弹清群', '散弹齐射', '7枚扇形弹，每枚55%普攻伤害；同敌最多2枚。9秒／30蓝。', '增程瞄准', '基础攻击射程增加140；装备与升级继续增加射程。'],
    bulwark: ['刚背兽', '中立 · 野猪人战士', '近战物理 · 背向承伤与刚毛反击', '刚毛齐射', '220范围释放刚毛；连续命中叠加伤害，最多5层、持续10秒。8秒／28蓝。', '刚背', '后方140°来袭伤害降低40%；每4次有方向的有效受击自动释放刚毛。'],
    conductor: ['众神之王', '人族 · 矮人山丘之王', '法术远程 · 静电削血与全场落雷', '全场雷击', '0.55秒后雷击施放时已生成的全场敌人；首领伤害降低。16秒／40蓝。', '静电场', '法术普攻或主动命中时，周围敌人受到6%当前生命加少量法术伤害；同敌1秒间隔且有伤害上限。'],
    scavenger: ['炼金术士', '中立 · 地精与食人魔炼金师', '近战物理 · 经济成长与化学狂暴', '化学狂暴', '6秒内攻速+40%、移速+15%，每秒回复2.5生命。16秒／36蓝。', '炼金分红', '每实际拾取8材料额外1币；击杀精英额外3币、首领10币。'],
    jugg: ['剑圣', '兽族 · 兽人剑圣／战士', '近战物理 · 跳劈切入与旋转清场', '剑刃风暴', '旋转3秒，138范围持续伤害、接触减伤35%；普攻同时进行，伤害随物理与法术成长。12秒／36蓝。', '跃空斩', '每5次有效近战攻击跳起斩击，落地范围伤害与0.28秒短暂无敌；不会跨越地形。'],
    sf: ['影魔', '中立 · 火元素／火焰领主', '远程物理 · 收魂成长与魔法魂波', '魂之挽歌', '蓄力0.55秒，释放魂波；同敌整次只受一次伤害，随物理、法术攻击与魂数成长，普攻同时进行。16秒／42蓝。', '收魂', '普通击杀1魂、精英3魂、首领6魂，最多36；每魂物理攻击+0.55，跨波保留。'],
    kael: ['召唤师', '血精灵 · 元素法师', '远程法术 · 随机法术与记忆回响', '回响施法', '消耗35魔法，重放最近一次被动随机出的法术。8秒冷却。', '万象轮转', '每5秒从六个当前法术中随机施放一个；成功后记录最近法术。'],
    luna: ['月之骑士', '暗夜精灵 · 月光猎手', '远程物理 · 月刃弹射与范围落月', '月蚀', '以施法位置为中心，2.5秒内随机落下10道月光；每名敌人最多被命中2道。18秒／42蓝。', '月刃弹射', '基础月刃首次命中后，向190范围内最多2名未命中的敌人弹射，伤害衰减70%／49%。']
  },
  'zh-TW': {
    rover: ['矮人火槍手', '人族 · 矮人火槍手', '遠程物理 · 遠距點殺與散彈清群', '散彈齊射', '7枚扇形彈，每枚55%普攻傷害；同敵最多2枚。9秒／30魔。', '增程瞄準', '基礎攻擊射程增加140；裝備與升級繼續增加射程。'],
    bulwark: ['剛背獸', '中立 · 野豬人戰士', '近戰物理 · 背向承傷與剛毛反擊', '剛毛齊射', '220範圍釋放剛毛；連續命中疊加傷害，最多5層、持續10秒。8秒／28魔。', '剛背', '後方140°來襲傷害降低40%；每4次有方向的有效受擊自動釋放剛毛。'],
    conductor: ['眾神之王', '人族 · 矮人山丘之王', '法術遠程 · 靜電削血與全場落雷', '全場雷擊', '0.55秒後雷擊施放時已生成的全場敵人；首領傷害降低。16秒／40魔。', '靜電場', '法術普攻或主動命中時，周圍敵人受到6%當前生命加少量法術傷害；同敵1秒間隔且有傷害上限。'],
    scavenger: ['煉金術士', '中立 · 地精與食人魔煉金師', '近戰物理 · 經濟成長與化學狂暴', '化學狂暴', '6秒內攻速+40%、移速+15%，每秒回復2.5生命。16秒／36魔。', '煉金分紅', '每實際拾取8材料額外1幣；擊殺精英額外3幣、首領10幣。'],
    jugg: ['劍聖', '獸族 · 獸人劍聖／戰士', '近戰物理 · 跳劈切入與旋轉清場', '劍刃風暴', '旋轉3秒，138範圍持續傷害、接觸減傷35%；普攻同時進行，傷害隨物理與法術成長。12秒／36魔。', '躍空斬', '每5次有效近戰攻擊跳起斬擊，落地範圍傷害與0.28秒短暫無敵；不會跨越地形。'],
    sf: ['影魔', '中立 · 火元素／火焰領主', '遠程物理 · 收魂成長與魔法魂波', '魂之輓歌', '蓄力0.55秒，釋放魂波；同敵整次只受一次傷害，隨物理、法術攻擊與魂數成長，普攻同時進行。16秒／42魔。', '收魂', '普通擊殺1魂、精英3魂、首領6魂，最多36；每魂物理攻擊+0.55，跨波保留。'],
    kael: ['召喚師', '血精靈 · 元素法師', '遠程法術 · 隨機法術與記憶迴響', '迴響施法', '消耗35魔力，重放最近一次被動隨機出的法術。8秒冷卻。', '萬象輪轉', '每5秒從六個當前法術中隨機施放一個；成功後記錄最近法術。'],
    luna: ['月之騎士', '暗夜精靈 · 月光獵手', '遠程物理 · 月刃彈射與範圍落月', '月蝕', '以施法位置為中心，2.5秒內隨機落下10道月光；每名敵人最多被命中2道。18秒／42魔。', '月刃彈射', '基礎月刃首次命中後，向190範圍內最多2名未命中的敵人彈射，傷害衰減70%／49%。']
  },
  en: {
    rover: ['Dwarven Sniper', 'Human · Dwarven rifleman', 'Ranged physical · Long shots and shotgun volleys', 'Shotgun Volley', 'Fire 7 fan-shaped shots at 55% basic damage each, up to 2 hits per enemy. 9 sec / 30 MP.', 'Take Aim', 'Basic attack range +140; equipment and upgrades add further range.'],
    bulwark: ['Bristleback', 'Neutral · Quillboar warrior', 'Melee physical · Rear defense and quill retaliation', 'Quill Spray', 'Spray quills within 220 range; hits stack bonus damage up to 5 times for 10 sec. 8 sec / 28 MP.', 'Bristleback', 'Take 40% less damage from the rear 140 degrees; every 4 real hits from attackers automatically spray quills.'],
    conductor: ['Lord of Olympia', 'Human · Dwarven mountain king', 'Ranged magic · Static Field and global thunder', 'Thundergod\'s Wrath', 'After 0.55 sec, strike every enemy present at cast time. Bosses take reduced damage. 16 sec / 40 MP.', 'Static Field', 'Magic basic attacks and active hits deal capped 6% current HP plus magic damage nearby; 1 sec per enemy.'],
    scavenger: ['Alchemist', 'Neutral · Goblin alchemist and ogre', 'Melee physical · Bonus gold and Chemical Rage', 'Chemical Rage', 'For 6 sec gain 40% attack speed, 15% move speed and 2.5 HP per sec. 16 sec / 36 MP.', 'Alchemy Dividend', 'Every 8 collected materials grant 1 extra gold; elite kills grant 3 and bosses 10.'],
    jugg: ['Juggernaut', 'Orc · Blademaster / warrior', 'Melee physical · Leaping strikes and Blade Fury', 'Blade Fury', 'Spin for 3 sec, dealing damage within 138 range and reducing contact damage by 35%. Basic attacks continue and damage scales with physical and magic attack. 12 sec / 36 MP.', 'Leaping Strike', 'Every 5 successful melee attacks leap and slash on landing, with 0.28 sec invulnerability. Never jumps through terrain.'],
    sf: ['Shadow Fiend', 'Neutral · Fire elemental / firelord', 'Ranged physical · Soul growth and magic waves', 'Requiem of Souls', 'Channel for 0.55 sec, then release soul waves. Each enemy takes damage once per cast, scaling with physical attack, magic attack and souls while basic attacks continue. 16 sec / 42 MP.', 'Necromastery', 'Normal kills grant 1 soul, elites 3, bosses 6, up to 36. Each adds 0.55 physical attack; souls persist between waves.'],
    kael: ['Invoker', 'Blood elf · Elemental mage', 'Ranged magic · Random spells and remembered echoes', 'Echo Cast', 'Spend 35 mana to replay the last spell rolled by the passive. 8 sec cooldown.', 'Prismatic Cycle', 'Every 5 sec, randomly cast one of six current spells and remember it after a successful cast.'],
    luna: ['Moon Rider', 'Night elf · Moonlight hunter', 'Ranged physical · Lunar glaives and falling moonlight', 'Eclipse', 'For 2.5 sec, call down 10 random moonbeams around the cast position; each enemy can be hit twice. 18 sec / 42 MP.', 'Lunar Glaives', 'The first hit of each basic glaive bounces to up to 2 nearby unhit enemies for 70% / 49% damage.']
  }
};

export const KAEL_SPELLS = [
  { id: 'tornado', names: { 'zh-CN': '混沌之风', 'zh-TW': '混沌之風', en: 'Tornado' }, desc: { 'zh-CN': '沿施法朝向发出直线前进的龙卷风，穿透并推离路径上的敌人。', 'zh-TW': '沿施法朝向發出直線前進的龍捲風，穿透並推離路徑上的敵人。', en: 'Launch a tornado straight ahead, piercing and pushing enemies along its path.' } },
  { id: 'emp', names: { 'zh-CN': '电磁脉冲', 'zh-TW': '電磁脈衝', en: 'EMP' }, desc: { 'zh-CN': '以自身为中心释放脉冲，造成范围伤害并返还魔法。', 'zh-TW': '以自身為中心釋放脈衝，造成範圍傷害並返還魔力。', en: 'Pulse around yourself, dealing area damage and restoring mana.' } },
  { id: 'chaos-meteor', names: { 'zh-CN': '混沌陨石', 'zh-TW': '混沌隕石', en: 'Chaos Meteor' }, desc: { 'zh-CN': '燃烧的岩石沿面向落下并滚动，对路径上的敌人持续伤害。', 'zh-TW': '燃燒的岩石沿面向落下並滾動，對路徑上的敵人持續傷害。', en: 'Drop a burning rock that rolls forward for repeated path damage.' } },
  { id: 'ice-wall', names: { 'zh-CN': '寒冰之墙', 'zh-TW': '寒冰之牆', en: 'Ice Wall' }, desc: { 'zh-CN': '在面前生成冰墙，减速并伤害穿越的敌人。', 'zh-TW': '在面前生成冰牆，減速並傷害穿越的敵人。', en: 'Raise an ice wall that slows and damages enemies crossing it.' } },
  { id: 'forge-spirit', names: { 'zh-CN': '炽魂召唤', 'zh-TW': '熾魂召喚', en: 'Forge Spirit' }, desc: { 'zh-CN': '召唤两个短寿命炽魂，自动攻击附近敌人。', 'zh-TW': '召喚兩個短壽命熾魂，自動攻擊附近敵人。', en: 'Summon two short-lived forge spirits to attack nearby enemies.' } },
  { id: 'deafening-blast', names: { 'zh-CN': '震荡波', 'zh-TW': '震盪波', en: 'Deafening Blast' }, desc: { 'zh-CN': '以自身为中心造成范围伤害并击退敌人。', 'zh-TW': '以自身為中心造成範圍傷害並擊退敵人。', en: 'Blast around yourself, dealing area damage and knocking enemies back.' } }
];
