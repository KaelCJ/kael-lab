export const CHARACTERS = [
  { id: 'rover', hp: 34, stats: { speed: 8 }, name: '矮人火枪手' },
  { id: 'bulwark', hp: 44, stats: { armor: 3 }, name: '刚背兽' },
  { id: 'conductor', hp: 32, stats: {}, name: '众神之王' },
  { id: 'scavenger', hp: 38, stats: { luck: 12, pickup: 30 }, name: '炼金术士' },
  { id: 'jugg', hp: 38, stats: { speed: 8 }, name: '剑圣' },
  { id: 'sf', hp: 32, stats: {}, name: '影魔' },
  { id: 'kael', hp: 30, stats: { attackPower: 4 }, name: '召唤师' },
  { id: 'luna', hp: 32, stats: { speed: 6 }, name: '月之骑士' },
  { id: 'tb', hp: 36, stats: { armor: 1 }, name: '灵魂守卫' }
];

export const BASE_ATTACKS = {
  rover: { type: 'ranged', damage: 9, cooldown: .48, range: 460, speed: 850, color: '#ffe8ac' },
  bulwark: { type: 'melee', damage: 18, cooldown: .8, range: 122, color: '#decfae' },
  conductor: { type: 'ranged', ignoresTerrain: true, sound: 'arc', damage: 13, cooldown: 1, range: 430, speed: 1000, color: '#c6efff' },
  scavenger: { type: 'melee', damage: 17, cooldown: .85, range: 118, color: '#b8df83' },
  jugg: { type: 'melee', damage: 20, cooldown: .75, range: 122, color: '#f8e6ba' },
  sf: { type: 'ranged', damage: 9, cooldown: .6, range: 500, speed: 640, color: '#ef6754' },
  kael: { type: 'ranged', ignoresTerrain: true, sound: 'arc', damage: 8, cooldown: .72, range: 470, speed: 880, color: '#c99aff' },
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

// Original short voice lines for browser speech synthesis. These are written
// for DotaRogue and are not recordings or quotations from another game.
export const HERO_VOICE_LINES = {
  rover: {
    'zh-CN': { select: '装填完毕。', start: '保持距离，逐个点名。', active: '散开！', lowhp: '护甲快撑不住了。', elite: '漂亮的靶子。', win: '枪口还热着。', defeat: '先撤，枪还在。' },
    'zh-TW': { select: '裝填完畢。', start: '保持距離，逐個點名。', active: '散開！', lowhp: '護甲快撐不住了。', elite: '漂亮的靶子。', win: '槍口還熱著。', defeat: '先撤，槍還在。' },
    en: { select: 'Loaded and ready.', start: 'Keep your distance. Pick them off.', active: 'Scatter!', lowhp: 'Armor is giving way.', elite: 'A fine target.', win: 'The barrel is still warm.', defeat: 'Fall back. The rifle stays.' }
  },
  bulwark: {
    'zh-CN': { select: '背朝危险，正面交给你们。', start: '来，撞上来。', active: '刚毛出鞘！', lowhp: '还没倒。', elite: '刺得不错。', win: '背后没有伤口。', defeat: '还会站起来。' },
    'zh-TW': { select: '背朝危險，正面交給你們。', start: '來，撞上來。', active: '剛毛出鞘！', lowhp: '還沒倒。', elite: '刺得不錯。', win: '背後沒有傷口。', defeat: '還會站起來。' },
    en: { select: 'Danger at my back. Face me.', start: 'Come on. Hit me.', active: 'Quills out!', lowhp: 'I am not down.', elite: 'That one felt the quills.', win: 'Nothing got through my back.', defeat: 'I will stand again.' }
  },
  conductor: {
    'zh-CN': { select: '雷霆听令。', start: '天空已经看见你们。', active: '雷落！', lowhp: '风暴也会受伤。', elite: '被雷霆审判。', win: '余雷归于寂静。', defeat: '雷声暂歇。' },
    'zh-TW': { select: '雷霆聽令。', start: '天空已經看見你們。', active: '雷落！', lowhp: '風暴也會受傷。', elite: '被雷霆審判。', win: '餘雷歸於寂靜。', defeat: '雷聲暫歇。' },
    en: { select: 'Thunder, answer me.', start: 'The sky has seen you.', active: 'Fall, thunder!', lowhp: 'Even a storm can bleed.', elite: 'Judged by thunder.', win: 'The last sparks fade.', defeat: 'The thunder rests.' }
  },
  scavenger: {
    'zh-CN': { select: '配方和路线都准备好了。', start: '先收材料，再收敌人。', active: '试试这瓶！', lowhp: '容器快裂了。', elite: '这份残骸值钱。', win: '实验成功，收益可观。', defeat: '账还没算完。' },
    'zh-TW': { select: '配方和路線都準備好了。', start: '先收材料，再收敵人。', active: '試試這瓶！', lowhp: '容器快裂了。', elite: '這份殘骸值錢。', win: '實驗成功，收益可觀。', defeat: '帳還沒算完。' },
    en: { select: 'The recipe and route are ready.', start: 'Collect the parts, then the enemies.', active: 'Try this bottle!', lowhp: 'The container is cracking.', elite: 'That wreckage will sell.', win: 'Experiment complete. Profits are good.', defeat: 'The ledger is not finished.' }
  },
  jugg: {
    'zh-CN': { select: '刀锋不会迟到。', start: '以刃开路。', active: '剑刃风暴！', lowhp: '面具之下仍在战斗。', elite: '一斩。', win: '风停，刃未钝。', defeat: '刀锋还会回来。' },
    'zh-TW': { select: '刀鋒不會遲到。', start: '以刃開路。', active: '劍刃風暴！', lowhp: '面具之下仍在戰鬥。', elite: '一斬。', win: '風停，刃未鈍。', defeat: '刀鋒還會回來。' },
    en: { select: 'The blade is never late.', start: 'The edge opens the way.', active: 'Blade storm!', lowhp: 'The fight remains beneath the mask.', elite: 'One cut.', win: 'The wind stops. The blade does not.', defeat: 'The blade will return.' }
  },
  sf: {
    'zh-CN': { select: '灵魂会记账。', start: '你们的影子归我。', active: '魂之挽歌。', lowhp: '火焰不会熄灭。', elite: '又一缕魂。', win: '寂静留下了。', defeat: '影子仍在。' },
    'zh-TW': { select: '靈魂會記帳。', start: '你們的影子歸我。', active: '魂之輓歌。', lowhp: '火焰不會熄滅。', elite: '又一縷魂。', win: '寂靜留下了。', defeat: '影子仍在。' },
    en: { select: 'Every soul is counted.', start: 'Your shadows belong to me.', active: 'Requiem.', lowhp: 'The fire will not go out.', elite: 'Another soul.', win: 'Silence remains.', defeat: 'The shadow remains.' }
  },
  kael: {
    'zh-CN': { select: '元素已经就位。', start: '三相轮转，听我号令。', active: '回响施法！', lowhp: '法阵正在崩解。', elite: '归于混沌。', win: '万象归于一手。', defeat: '这只是一次失算。' },
    'zh-TW': { select: '元素已經就位。', start: '三相輪轉，聽我號令。', active: '迴響施法！', lowhp: '法陣正在崩解。', elite: '歸於混沌。', win: '萬象歸於一手。', defeat: '這只是一次失算。' },
    en: { select: 'The elements are in place.', start: 'Three forces turn at my command.', active: 'Echo cast!', lowhp: 'The pattern is breaking.', elite: 'Return to chaos.', win: 'All forces answer one hand.', defeat: 'A single miscalculation.' }
  },
  luna: {
    'zh-CN': { select: '月影随行。', start: '让夜色替我点亮道路。', active: '月蚀降临！', lowhp: '月光还没有熄灭。', elite: '落在月影之外。', win: '天亮之前，路已经清空。', defeat: '月光会找到我。' },
    'zh-TW': { select: '月影隨行。', start: '讓夜色替我點亮道路。', active: '月蝕降臨！', lowhp: '月光還沒有熄滅。', elite: '落在月影之外。', win: '天亮之前，路已經清空。', defeat: '月光會找到我。' },
    en: { select: 'The moon follows.', start: 'Night will light the road for me.', active: 'Eclipse descending!', lowhp: 'The moonlight is not gone.', elite: 'Outside the moon shadow.', win: 'The road is clear before dawn.', defeat: 'The moonlight will find me.' }
  },
  tb: {
    'zh-CN': { select: '黑暗，也有形状。', start: '跟紧我的影子。', active: '让他们看清。', lowhp: '我还能再战。', elite: '归于寂静。', win: '影子随我前行。', defeat: '影子不会散去。' },
    'zh-TW': { select: '黑暗，也有形狀。', start: '跟緊我的影子。', active: '讓他們看清。', lowhp: '我還能再戰。', elite: '歸於寂靜。', win: '影子隨我前行。', defeat: '影子不會散去。' },
    en: { select: 'Even darkness has a shape.', start: 'Stay close to my shadow.', active: 'Let them see clearly.', lowhp: 'I can fight again.', elite: 'Return to silence.', win: 'The shadow moves with me.', defeat: 'The shadow will not scatter.' }
  }
};

export const HERO_VOICE_PROFILES = {
  rover: { rate: 1.08, pitch: .72 }, bulwark: { rate: .82, pitch: .54 }, conductor: { rate: .9, pitch: .66 },
  scavenger: { rate: 1.12, pitch: .88 }, jugg: { rate: .94, pitch: .58 }, sf: { rate: .86, pitch: .48 },
  kael: { rate: .98, pitch: .82 }, luna: { rate: 1.02, pitch: .9 }, tb: { rate: .84, pitch: .42 }
};

export const HERO_TEXT = {
  'zh-CN': {
    rover: ['矮人火枪手', '人族 · 矮人火枪手', '远程 · 远距点杀与散弹清群', '散弹齐射', '7枚扇形弹，每枚55%普攻伤害；同敌最多2枚。9秒／30蓝。', '增程瞄准', '基础攻击射程增加140；装备与升级继续增加射程。'],
    bulwark: ['刚背兽', '中立 · 野猪人战士', '近战 · 背向承伤与刚毛反击', '刚毛齐射', '220范围释放刚毛；连续命中叠加伤害，最多5层、持续10秒。8秒／28蓝。', '刚背', '后方140°来袭伤害降低40%；每4次有方向的有效受击自动释放刚毛。'],
    conductor: ['众神之王', '人族 · 矮人山丘之王', '远程 · 静电削血与全场落雷', '全场雷击', '0.55秒后雷击施放时已生成的全场敌人；首领伤害降低。16秒／40蓝。', '静电场', '普攻或主动命中时，周围敌人受到6%当前生命加附加伤害；同敌1秒间隔且有伤害上限。'],
    scavenger: ['炼金术士', '中立 · 地精与食人魔炼金师', '近战 · 经济成长与化学狂暴', '化学狂暴', '6秒内攻速+40%、移速+15%，每秒回复2.5生命。16秒／36蓝。', '炼金分红', '每实际拾取8材料额外1币；击杀精英额外3币、首领10币。'],
    jugg: ['剑圣', '兽族 · 兽人剑圣／战士', '近战 · 跳劈切入与旋转清场', '剑刃风暴', '旋转3秒，138范围持续伤害、接触减伤35%；普攻同时进行，伤害随攻击力成长。12秒／36蓝。', '跃空斩', '每5次有效近战攻击跳起斩击，落地范围伤害与0.28秒短暂无敌；不会跨越地形。'],
    sf: ['影魔', '中立 · 火元素／火焰领主', '远程 · 收魂成长与魔法魂波', '魂之挽歌', '蓄力0.55秒释放魂波，同敌只受一次伤害，普攻继续。随攻击力与最多36魂增伤，不消耗魂。16秒／42蓝。', '收魂', '普通击杀1魂、精英3魂、首领6魂；前36魂每魂攻击力+0.55，之后+0.05，无上限。跨波保留，新局清零；召唤及分裂小怪不计。'],
    kael: ['召唤师', '血精灵 · 元素法师', '远程 · 随机法术与记忆回响', '回响施法', '消耗20魔法，自动对准有效目标，重放最近被动法术。6秒冷却；无目标不消耗。', '万象轮转', '每5秒随机施放一个有效法术并记录。选择攻击力成长，风与陨石各增加1个，最多3个。'],
    luna: ['月之骑士', '暗夜精灵 · 月光猎手', '远程 · 月刃弹射与范围落月', '月蚀', '以施法位置为中心，2.5秒内随机落下10道月光；每名敌人最多被命中2道。18秒／42蓝。', '月刃弹射', '基础月刃首次命中后，向190范围内最多2名未命中的敌人弹射，伤害衰减70%／49%。'],
    tb: ['灵魂守卫', '暗夜精灵 · 伊利丹恶魔猎手原型', '近战／远程 · 双刃蓄影与恶魔集火', '恶魔变身', '变成远程大恶魔8秒，基础射程420，普攻原始伤害+40%。24秒／40蓝。', '魔影', '每6次有效普攻生成5秒魔影，最多2个，各以30%未暴击普攻伤害跟随攻击；随本体变身，不触发装备。']
  },
  'zh-TW': {
    rover: ['矮人火槍手', '人族 · 矮人火槍手', '遠程 · 遠距點殺與散彈清群', '散彈齊射', '7枚扇形彈，每枚55%普攻傷害；同敵最多2枚。9秒／30魔。', '增程瞄準', '基礎攻擊射程增加140；裝備與升級繼續增加射程。'],
    bulwark: ['剛背獸', '中立 · 野豬人戰士', '近戰 · 背向承傷與剛毛反擊', '剛毛齊射', '220範圍釋放剛毛；連續命中疊加傷害，最多5層、持續10秒。8秒／28魔。', '剛背', '後方140°來襲傷害降低40%；每4次有方向的有效受擊自動釋放剛毛。'],
    conductor: ['眾神之王', '人族 · 矮人山丘之王', '遠程 · 靜電削血與全場落雷', '全場雷擊', '0.55秒後雷擊施放時已生成的全場敵人；首領傷害降低。16秒／40魔。', '靜電場', '普攻或主動命中時，周圍敵人受到6%當前生命加附加傷害；同敵1秒間隔且有傷害上限。'],
    scavenger: ['煉金術士', '中立 · 地精與食人魔煉金師', '近戰 · 經濟成長與化學狂暴', '化學狂暴', '6秒內攻速+40%、移速+15%，每秒回復2.5生命。16秒／36魔。', '煉金分紅', '每實際拾取8材料額外1幣；擊殺精英額外3幣、首領10幣。'],
    jugg: ['劍聖', '獸族 · 獸人劍聖／戰士', '近戰 · 跳劈切入與旋轉清場', '劍刃風暴', '旋轉3秒，138範圍持續傷害、接觸減傷35%；普攻同時進行，傷害隨攻擊力成長。12秒／36魔。', '躍空斬', '每5次有效近戰攻擊跳起斬擊，落地範圍傷害與0.28秒短暫無敵；不會跨越地形。'],
    sf: ['影魔', '中立 · 火元素／火焰領主', '遠程 · 收魂成長與魔法魂波', '魂之輓歌', '蓄力0.55秒釋放魂波，同敵只受一次傷害，普攻繼續。隨攻擊力與最多36魂增傷，不消耗魂。16秒／42魔。', '收魂', '普通擊殺1魂、精英3魂、首領6魂；前36魂每魂攻击力+0.55，之後+0.05，無上限。跨波保留，新局清零；召喚及分裂小怪不計。'],
    kael: ['召喚師', '血精靈 · 元素法師', '遠程 · 隨機法術與記憶迴響', '迴響施法', '消耗20魔力，自動對準有效目標，重放最近被動法術。6秒冷卻；無目標不消耗。', '萬象輪轉', '每5秒隨機施放一個有效法術並記錄。選擇攻擊力成長，風與隕石各增加1個，最多3個。'],
    luna: ['月之騎士', '暗夜精靈 · 月光獵手', '遠程 · 月刃彈射與範圍落月', '月蝕', '以施法位置為中心，2.5秒內隨機落下10道月光；每名敵人最多被命中2道。18秒／42魔。', '月刃彈射', '基礎月刃首次命中後，向190範圍內最多2名未命中的敵人彈射，傷害衰減70%／49%。'],
    tb: ['靈魂守衛', '暗夜精靈 · 伊利丹惡魔獵手原型', '近戰／遠程 · 雙刃蓄影與惡魔集火', '惡魔變身', '變成遠程大惡魔8秒，基礎射程420，普攻原始傷害+40%。24秒／40魔。', '魔影', '每6次有效普攻生成5秒魔影，最多2個，各以30%未暴擊普攻傷害跟隨攻擊；隨本體變身，不觸發裝備。']
  },
  en: {
    rover: ['Dwarven Sniper', 'Human · Dwarven rifleman', 'Ranged · Long shots and shotgun volleys', 'Shotgun Volley', 'Fire 7 fan-shaped shots at 55% basic damage each, up to 2 hits per enemy. 9 sec / 30 MP.', 'Take Aim', 'Basic attack range +140; equipment and upgrades add further range.'],
    bulwark: ['Bristleback', 'Neutral · Quillboar warrior', 'Melee · Rear defense and quill retaliation', 'Quill Spray', 'Spray quills within 220 range; hits stack bonus damage up to 5 times for 10 sec. 8 sec / 28 MP.', 'Bristleback', 'Take 40% less damage from the rear 140 degrees; every 4 real hits from attackers automatically spray quills.'],
    conductor: ['Lord of Olympia', 'Human · Dwarven mountain king', 'Ranged · Static Field and global thunder', 'Thundergod\'s Wrath', 'After 0.55 sec, strike every enemy present at cast time. Bosses take reduced damage. 16 sec / 40 MP.', 'Static Field', 'Basic attacks and active hits deal capped 6% current HP plus bonus damage nearby; 1 sec per enemy.'],
    scavenger: ['Alchemist', 'Neutral · Goblin alchemist and ogre', 'Melee · Bonus gold and Chemical Rage', 'Chemical Rage', 'For 6 sec gain 40% attack speed, 15% move speed and 2.5 HP per sec. 16 sec / 36 MP.', 'Alchemy Dividend', 'Every 8 collected materials grant 1 extra gold; elite kills grant 3 and bosses 10.'],
    jugg: ['Juggernaut', 'Orc · Blademaster / warrior', 'Melee · Leaping strikes and Blade Fury', 'Blade Fury', 'Spin for 3 sec, dealing damage within 138 range and reducing contact damage by 35%. Basic attacks continue and damage scales with attack power. 12 sec / 36 MP.', 'Leaping Strike', 'Every 5 successful melee attacks leap and slash on landing, with 0.28 sec invulnerability. Never jumps through terrain.'],
    sf: ['Shadow Fiend', 'Neutral · Fire elemental / firelord', 'Ranged · Soul growth and magic waves', 'Requiem of Souls', 'Channel 0.55 sec, then hit each enemy once while basic attacks continue. Scales with attack power and up to 36 souls; consumes no souls. 16 sec / 42 MP.', 'Necromastery', 'Normal kills grant 1 soul, elites 3, bosses 6. Each of the first 36 adds 0.55 attack power, then 0.05 with no cap. Kept between waves; reset each run. Summoned and split offspring grant none.'],
    kael: ['Invoker', 'Blood elf · Elemental mage', 'Ranged · Random spells and remembered echoes', 'Echo Cast', 'Aim at a valid target and replay the last passive spell. 20 mana / 6 sec; no target, no cost.', 'Prismatic Cycle', 'Cast and remember a random valid spell every 5 sec. Attack Power level-up choices add one Tornado and Meteor, up to 3 each.'],
    luna: ['Moon Rider', 'Night elf · Moonlight hunter', 'Ranged · Lunar glaives and falling moonlight', 'Eclipse', 'For 2.5 sec, call down 10 random moonbeams around the cast position; each enemy can be hit twice. 18 sec / 42 MP.', 'Lunar Glaives', 'The first hit of each basic glaive bounces to up to 2 nearby unhit enemies for 70% / 49% damage.'],
    tb: ['Terrorblade', 'Night elf · Illidan demon hunter archetype', 'Melee / ranged · Build images and unleash the demon', 'Metamorphosis', 'Become a ranged demon for 8 sec: 420 base range and +40% raw basic damage. 24 sec / 40 MP.', 'Conjure Image', 'Every 6 successful basic attacks summon a 5 sec image, up to 2. Each follows attacks for 30% non-critical basic damage, shares your form and triggers no equipment effects.']
  }
};

export const KAEL_SPELLS = [
  { id: 'tornado', names: { 'zh-CN': '混沌之风', 'zh-TW': '混沌之風', en: 'Tornado' }, desc: { 'zh-CN': '朝敌人发出持续1.8秒的大型龙卷风，穿透并推离敌人；攻击力成长增加数量。', 'zh-TW': '朝敵人發出持續1.8秒的大型龍捲風，穿透並推離敵人；攻擊力成長增加數量。', en: 'Launch large tornadoes toward enemies for 1.8 sec; Attack Power level-ups add tornadoes.' } },
  { id: 'emp', names: { 'zh-CN': '电磁脉冲', 'zh-TW': '電磁脈衝', en: 'EMP' }, desc: { 'zh-CN': '向附近敌人释放雷电，在命中点爆炸，造成范围伤害并返还魔法。', 'zh-TW': '向附近敵人釋放雷電，在命中點爆炸，造成範圍傷害並返還魔力。', en: 'Strike nearby enemies with lightning, then detonate at each hit point while restoring mana.' } },
  { id: 'chaos-meteor', names: { 'zh-CN': '混沌陨石', 'zh-TW': '混沌隕石', en: 'Chaos Meteor' }, desc: { 'zh-CN': '大型燃烧岩石朝敌人滚动3秒，持续伤害路径上的敌人；攻击力成长增加数量。', 'zh-TW': '大型燃燒岩石朝敵人滾動3秒，持續傷害路徑上的敵人；攻擊力成長增加數量。', en: 'Roll large burning rocks toward enemies for 3 sec; Attack Power level-ups add meteors.' } },
  { id: 'ice-wall', names: { 'zh-CN': '寒冰之墙', 'zh-TW': '寒冰之牆', en: 'Ice Wall' }, desc: { 'zh-CN': '在附近敌人处生成长240、持续6秒的冰墙，减速并持续伤害敌人。', 'zh-TW': '在附近敵人處生成長240、持續6秒的冰牆，減速並持續傷害敵人。', en: 'Raise a 240-unit ice wall at a nearby enemy for 6 sec, slowing and damaging enemies.' } },
  { id: 'forge-spirit', names: { 'zh-CN': '炽魂召唤', 'zh-TW': '熾魂召喚', en: 'Forge Spirit' }, desc: { 'zh-CN': '召唤两个短寿命小怪物炽魂，协助攻击附近敌人。', 'zh-TW': '召喚兩個短壽命小怪物熾魂，協助攻擊附近敵人。', en: 'Summon two short-lived forge spirit creatures to help attack nearby enemies.' } },
  { id: 'deafening-blast', names: { 'zh-CN': '震荡波', 'zh-TW': '震盪波', en: 'Deafening Blast' }, desc: { 'zh-CN': '沿面向推出三道弧形冲击波，伤害并推离前方敌人。', 'zh-TW': '沿面向推出三道弧形衝擊波，傷害並推離前方敵人。', en: 'Send three arcing shock waves forward to damage and push enemies away.' } }
];
