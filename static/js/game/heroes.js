export const CHARACTERS = [
  { id: 'rover', hp: 34, stats: { speed: 8 }, name: '矮人火枪手' },
  { id: 'bulwark', hp: 44, stats: { armor: 3 }, name: '刚背兽' },
  { id: 'conductor', hp: 32, stats: {}, name: '众神之王' },
  { id: 'scavenger', hp: 38, stats: { luck: 12, pickup: 30 }, name: '炼金术士' },
  { id: 'jugg', hp: 38, stats: { speed: 8 }, name: '剑圣' },
  { id: 'sf', hp: 32, stats: {}, name: '影魔' },
  { id: 'kael', hp: 30, stats: { elemental: 4 }, name: '召唤师' },
  { id: 'luna', hp: 32, stats: { speed: 6 }, name: '月之骑士' },
  { id: 'tb', hp: 36, stats: { armor: 1 }, name: '灵魂守卫' }
];

export const BASE_ATTACKS = {
  rover: { type: 'ranged', damage: 9, cooldown: .48, range: 460, speed: 850, color: '#ffe8ac' },
  bulwark: { type: 'melee', damage: 18, cooldown: .8, range: 122, color: '#decfae' },
  conductor: { type: 'elemental', damage: 13, cooldown: 1, range: 430, speed: 1000, color: '#c6efff' },
  scavenger: { type: 'melee', damage: 17, cooldown: .85, range: 118, color: '#b8df83' },
  jugg: { type: 'melee', damage: 20, cooldown: .75, range: 122, color: '#f8e6ba' },
  sf: { type: 'ranged', damage: 9, cooldown: .6, range: 500, speed: 640, color: '#ef6754' },
  kael: { type: 'elemental', damage: 8, cooldown: .72, range: 470, speed: 880, color: '#c99aff' },
  luna: { type: 'ranged', damage: 10, cooldown: .62, range: 440, speed: 820, color: '#d9e9ff' },
  tb: { type: 'melee', damage: 14, cooldown: .65, range: 110, color: '#9ce96b' }
};

export const TB_DEMON_ATTACK = { type: 'ranged', damage: 14, cooldown: .65, range: 420, speed: 760, color: '#9ce96b' };

export const ACTIVE_SKILL_CONFIG = {
  rover: { cooldown: 9, manaCost: 30 }, bulwark: { cooldown: 8, manaCost: 28 },
  conductor: { cooldown: 16, manaCost: 40 }, scavenger: { cooldown: 16, manaCost: 36 },
  jugg: { cooldown: 12, manaCost: 36 }, sf: { cooldown: 16, manaCost: 42 },
  kael: { cooldown: 6, manaCost: 20 }, luna: { cooldown: 18, manaCost: 42 },
  tb: { cooldown: 24, manaCost: 40 }
};

export const HERO_TEXT = {
  'zh-CN': {
    rover: ['矮人火枪手', '人族 · 矮人火枪手', '远程物理 · 远距点杀与散弹清群', '散弹齐射', '7枚扇形弹，每枚55%普攻伤害；同敌最多2枚。9秒／30蓝。', '增程瞄准', '基础攻击射程增加140；装备与升级继续增加射程。'],
    bulwark: ['刚背兽', '中立 · 野猪人战士', '近战物理 · 背向承伤与刚毛反击', '刚毛齐射', '220范围释放刚毛；连续命中叠加伤害，最多5层、持续10秒。8秒／28蓝。', '刚背', '后方140°来袭伤害降低40%；每4次有方向的有效受击自动释放刚毛。'],
    conductor: ['众神之王', '人族 · 矮人山丘之王', '法术远程 · 静电削血与全场落雷', '全场雷击', '0.55秒后雷击施放时已生成的全场敌人；首领伤害降低。16秒／40蓝。', '静电场', '法术普攻或主动命中时，周围敌人受到6%当前生命加少量法术伤害；同敌1秒间隔且有伤害上限。'],
    scavenger: ['炼金术士', '中立 · 地精与食人魔炼金师', '近战物理 · 经济成长与化学狂暴', '化学狂暴', '6秒内攻速+40%、移速+15%，每秒回复2.5生命。16秒／36蓝。', '炼金分红', '每实际拾取8材料额外1币；击杀精英额外3币、首领10币。'],
    jugg: ['剑圣', '兽族 · 兽人剑圣／战士', '近战物理 · 跳劈切入与旋转清场', '剑刃风暴', '旋转3秒，138范围持续伤害、接触减伤35%；普攻同时进行，伤害随物理与法术成长。12秒／36蓝。', '跃空斩', '每5次有效近战攻击跳起斩击，落地范围伤害与0.28秒短暂无敌；不会跨越地形。'],
    sf: ['影魔', '中立 · 火元素／火焰领主', '远程物理 · 收魂成长与魔法魂波', '魂之挽歌', '蓄力0.55秒释放魂波，同敌只受一次伤害，普攻继续。随物理、法术攻击与最多36魂增伤，不消耗魂。16秒／42蓝。', '收魂', '普通击杀1魂、精英3魂、首领6魂；前36魂每魂物攻+0.55，之后+0.05，无上限。跨波保留，新局清零；召唤及分裂小怪不计。'],
    kael: ['召唤师', '血精灵 · 元素法师', '远程法术 · 随机法术与记忆回响', '回响施法', '消耗20魔法，自动对准有效目标，重放最近被动法术。6秒冷却；无目标不消耗。', '万象轮转', '每5秒随机施放一个有效法术并记录。选择法术成长，风与陨石各增加1个，最多3个。'],
    luna: ['月之骑士', '暗夜精灵 · 月光猎手', '远程物理 · 月刃弹射与范围落月', '月蚀', '以施法位置为中心，2.5秒内随机落下10道月光；每名敌人最多被命中2道。18秒／42蓝。', '月刃弹射', '基础月刃首次命中后，向190范围内最多2名未命中的敌人弹射，伤害衰减70%／49%。'],
    tb: ['灵魂守卫', '暗夜精灵 · 伊利丹恶魔猎手原型', '近战／远程物理 · 双刃蓄影与恶魔集火', '恶魔变身', '变成远程大恶魔8秒，基础射程420，普攻原始伤害+40%。24秒／40蓝。', '魔影', '每6次有效普攻生成5秒魔影，最多2个，各以30%未暴击普攻伤害跟随攻击；随本体变身，不触发装备。']
  },
  'zh-TW': {
    rover: ['矮人火槍手', '人族 · 矮人火槍手', '遠程物理 · 遠距點殺與散彈清群', '散彈齊射', '7枚扇形彈，每枚55%普攻傷害；同敵最多2枚。9秒／30魔。', '增程瞄準', '基礎攻擊射程增加140；裝備與升級繼續增加射程。'],
    bulwark: ['剛背獸', '中立 · 野豬人戰士', '近戰物理 · 背向承傷與剛毛反擊', '剛毛齊射', '220範圍釋放剛毛；連續命中疊加傷害，最多5層、持續10秒。8秒／28魔。', '剛背', '後方140°來襲傷害降低40%；每4次有方向的有效受擊自動釋放剛毛。'],
    conductor: ['眾神之王', '人族 · 矮人山丘之王', '法術遠程 · 靜電削血與全場落雷', '全場雷擊', '0.55秒後雷擊施放時已生成的全場敵人；首領傷害降低。16秒／40魔。', '靜電場', '法術普攻或主動命中時，周圍敵人受到6%當前生命加少量法術傷害；同敵1秒間隔且有傷害上限。'],
    scavenger: ['煉金術士', '中立 · 地精與食人魔煉金師', '近戰物理 · 經濟成長與化學狂暴', '化學狂暴', '6秒內攻速+40%、移速+15%，每秒回復2.5生命。16秒／36魔。', '煉金分紅', '每實際拾取8材料額外1幣；擊殺精英額外3幣、首領10幣。'],
    jugg: ['劍聖', '獸族 · 獸人劍聖／戰士', '近戰物理 · 跳劈切入與旋轉清場', '劍刃風暴', '旋轉3秒，138範圍持續傷害、接觸減傷35%；普攻同時進行，傷害隨物理與法術成長。12秒／36魔。', '躍空斬', '每5次有效近戰攻擊跳起斬擊，落地範圍傷害與0.28秒短暫無敵；不會跨越地形。'],
    sf: ['影魔', '中立 · 火元素／火焰領主', '遠程物理 · 收魂成長與魔法魂波', '魂之輓歌', '蓄力0.55秒釋放魂波，同敵只受一次傷害，普攻繼續。隨物理、法術攻擊與最多36魂增傷，不消耗魂。16秒／42魔。', '收魂', '普通擊殺1魂、精英3魂、首領6魂；前36魂每魂物攻+0.55，之後+0.05，無上限。跨波保留，新局清零；召喚及分裂小怪不計。'],
    kael: ['召喚師', '血精靈 · 元素法師', '遠程法術 · 隨機法術與記憶迴響', '迴響施法', '消耗20魔力，自動對準有效目標，重放最近被動法術。6秒冷卻；無目標不消耗。', '萬象輪轉', '每5秒隨機施放一個有效法術並記錄。選擇法術成長，風與隕石各增加1個，最多3個。'],
    luna: ['月之騎士', '暗夜精靈 · 月光獵手', '遠程物理 · 月刃彈射與範圍落月', '月蝕', '以施法位置為中心，2.5秒內隨機落下10道月光；每名敵人最多被命中2道。18秒／42魔。', '月刃彈射', '基礎月刃首次命中後，向190範圍內最多2名未命中的敵人彈射，傷害衰減70%／49%。'],
    tb: ['靈魂守衛', '暗夜精靈 · 伊利丹惡魔獵手原型', '近戰／遠程物理 · 雙刃蓄影與惡魔集火', '惡魔變身', '變成遠程大惡魔8秒，基礎射程420，普攻原始傷害+40%。24秒／40魔。', '魔影', '每6次有效普攻生成5秒魔影，最多2個，各以30%未暴擊普攻傷害跟隨攻擊；隨本體變身，不觸發裝備。']
  },
  en: {
    rover: ['Dwarven Sniper', 'Human · Dwarven rifleman', 'Ranged physical · Long shots and shotgun volleys', 'Shotgun Volley', 'Fire 7 fan-shaped shots at 55% basic damage each, up to 2 hits per enemy. 9 sec / 30 MP.', 'Take Aim', 'Basic attack range +140; equipment and upgrades add further range.'],
    bulwark: ['Bristleback', 'Neutral · Quillboar warrior', 'Melee physical · Rear defense and quill retaliation', 'Quill Spray', 'Spray quills within 220 range; hits stack bonus damage up to 5 times for 10 sec. 8 sec / 28 MP.', 'Bristleback', 'Take 40% less damage from the rear 140 degrees; every 4 real hits from attackers automatically spray quills.'],
    conductor: ['Lord of Olympia', 'Human · Dwarven mountain king', 'Ranged magic · Static Field and global thunder', 'Thundergod\'s Wrath', 'After 0.55 sec, strike every enemy present at cast time. Bosses take reduced damage. 16 sec / 40 MP.', 'Static Field', 'Magic basic attacks and active hits deal capped 6% current HP plus magic damage nearby; 1 sec per enemy.'],
    scavenger: ['Alchemist', 'Neutral · Goblin alchemist and ogre', 'Melee physical · Bonus gold and Chemical Rage', 'Chemical Rage', 'For 6 sec gain 40% attack speed, 15% move speed and 2.5 HP per sec. 16 sec / 36 MP.', 'Alchemy Dividend', 'Every 8 collected materials grant 1 extra gold; elite kills grant 3 and bosses 10.'],
    jugg: ['Juggernaut', 'Orc · Blademaster / warrior', 'Melee physical · Leaping strikes and Blade Fury', 'Blade Fury', 'Spin for 3 sec, dealing damage within 138 range and reducing contact damage by 35%. Basic attacks continue and damage scales with physical and magic attack. 12 sec / 36 MP.', 'Leaping Strike', 'Every 5 successful melee attacks leap and slash on landing, with 0.28 sec invulnerability. Never jumps through terrain.'],
    sf: ['Shadow Fiend', 'Neutral · Fire elemental / firelord', 'Ranged physical · Soul growth and magic waves', 'Requiem of Souls', 'Channel 0.55 sec, then hit each enemy once while basic attacks continue. Scales with physical attack, magic attack and up to 36 souls; consumes no souls. 16 sec / 42 MP.', 'Necromastery', 'Normal kills grant 1 soul, elites 3, bosses 6. Each of the first 36 adds 0.55 physical attack, then 0.05 with no cap. Kept between waves; reset each run. Summoned and split offspring grant none.'],
    kael: ['Invoker', 'Blood elf · Elemental mage', 'Ranged magic · Random spells and remembered echoes', 'Echo Cast', 'Aim at a valid target and replay the last passive spell. 20 mana / 6 sec; no target, no cost.', 'Prismatic Cycle', 'Cast and remember a random valid spell every 5 sec. Magic Attack level-up choices add one Tornado and Meteor, up to 3 each.'],
    luna: ['Moon Rider', 'Night elf · Moonlight hunter', 'Ranged physical · Lunar glaives and falling moonlight', 'Eclipse', 'For 2.5 sec, call down 10 random moonbeams around the cast position; each enemy can be hit twice. 18 sec / 42 MP.', 'Lunar Glaives', 'The first hit of each basic glaive bounces to up to 2 nearby unhit enemies for 70% / 49% damage.'],
    tb: ['Terrorblade', 'Night elf · Illidan demon hunter archetype', 'Melee / ranged physical · Build images and unleash the demon', 'Metamorphosis', 'Become a ranged demon for 8 sec: 420 base range and +40% raw basic damage. 24 sec / 40 MP.', 'Conjure Image', 'Every 6 successful basic attacks summon a 5 sec image, up to 2. Each follows attacks for 30% non-critical basic damage, shares your form and triggers no equipment effects.']
  }
};

export const KAEL_SPELLS = [
  { id: 'tornado', names: { 'zh-CN': '混沌之风', 'zh-TW': '混沌之風', en: 'Tornado' }, desc: { 'zh-CN': '朝敌人发出持续1.8秒的大型龙卷风，穿透并推离敌人；法术成长增加数量。', 'zh-TW': '朝敵人發出持續1.8秒的大型龍捲風，穿透並推離敵人；法術成長增加數量。', en: 'Launch large tornadoes toward enemies for 1.8 sec; Magic Attack level-ups add tornadoes.' } },
  { id: 'emp', names: { 'zh-CN': '电磁脉冲', 'zh-TW': '電磁脈衝', en: 'EMP' }, desc: { 'zh-CN': '向附近敌人释放雷电，在命中点爆炸，造成范围伤害并返还魔法。', 'zh-TW': '向附近敵人釋放雷電，在命中點爆炸，造成範圍傷害並返還魔力。', en: 'Strike nearby enemies with lightning, then detonate at each hit point while restoring mana.' } },
  { id: 'chaos-meteor', names: { 'zh-CN': '混沌陨石', 'zh-TW': '混沌隕石', en: 'Chaos Meteor' }, desc: { 'zh-CN': '大型燃烧岩石朝敌人滚动3秒，持续伤害路径上的敌人；法术成长增加数量。', 'zh-TW': '大型燃燒岩石朝敵人滾動3秒，持續傷害路徑上的敵人；法術成長增加數量。', en: 'Roll large burning rocks toward enemies for 3 sec; Magic Attack level-ups add meteors.' } },
  { id: 'ice-wall', names: { 'zh-CN': '寒冰之墙', 'zh-TW': '寒冰之牆', en: 'Ice Wall' }, desc: { 'zh-CN': '在附近敌人处生成长240、持续6秒的冰墙，减速并持续伤害敌人。', 'zh-TW': '在附近敵人處生成長240、持續6秒的冰牆，減速並持續傷害敵人。', en: 'Raise a 240-unit ice wall at a nearby enemy for 6 sec, slowing and damaging enemies.' } },
  { id: 'forge-spirit', names: { 'zh-CN': '炽魂召唤', 'zh-TW': '熾魂召喚', en: 'Forge Spirit' }, desc: { 'zh-CN': '召唤两个短寿命小怪物炽魂，协助攻击附近敌人。', 'zh-TW': '召喚兩個短壽命小怪物熾魂，協助攻擊附近敵人。', en: 'Summon two short-lived forge spirit creatures to help attack nearby enemies.' } },
  { id: 'deafening-blast', names: { 'zh-CN': '震荡波', 'zh-TW': '震盪波', en: 'Deafening Blast' }, desc: { 'zh-CN': '沿面向推出三道弧形冲击波，伤害并推离前方敌人。', 'zh-TW': '沿面向推出三道弧形衝擊波，傷害並推離前方敵人。', en: 'Send three arcing shock waves forward to damage and push enemies away.' } }
];
