import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './game-settings.js?v=20261106-title1';

export const UPGRADE_TEXT = {
  'zh-CN': [['生命成长','最大生命+6，并恢复6生命'],['护甲加固','护甲+2'],['敏捷步伐','移动速度+8%'],['攻击力','攻击力+4'],['攻击范围','所有基础攻击范围+24'],['攻击速度','攻击速度+10%'],['致命一击','暴击率+6%'],['拾取范围','拾取范围+30'],['生命回复','每5秒回复1生命'],['闪避','闪避率+5%'],['伤害成长','所有伤害+7%'],['生命窃取','普攻吸血+3%'],['幸运','幸运+10'],['暴击伤害','暴击伤害+15%'],['法力回复','每秒回蓝+0.75'],['技能冷却','主动技能冷却缩减+6%']],
  'zh-TW': [['生命成長','最大生命+6，並回復6生命'],['護甲加固','護甲+2'],['敏捷步伐','移動速度+8%'],['攻擊力','攻擊力+4'],['攻擊範圍','所有基礎攻擊範圍+24'],['攻擊速度','攻擊速度+10%'],['致命一擊','暴擊率+6%'],['拾取範圍','拾取範圍+30'],['生命回復','每5秒回復1生命'],['閃避','閃避率+5%'],['傷害成長','所有傷害+7%'],['生命竊取','普攻吸血+3%'],['幸運','幸運+10'],['暴擊傷害','暴擊傷害+15%'],['法力回復','每秒回魔+0.75'],['技能冷卻','主動技能冷卻縮減+6%']],
  en: [['Health','Max HP +6 and restore 6 HP'],['Armor','Armor +2'],['Footwork','Move speed +8%'],['Attack Power','Attack power +4'],['Attack Range','All basic attack ranges +24'],['Attack Speed','Attack speed +10%'],['Critical Chance','Critical chance +6%'],['Pickup Range','Pickup range +30'],['Regeneration','Restore 1 HP per 5 sec'],['Evasion','Evasion +5%'],['Damage Growth','All damage +7%'],['Lifesteal','Basic attack lifesteal +3%'],['Luck','Luck +10'],['Critical Damage','Critical damage +15%'],['Mana Regeneration','Restore 0.75 MP per sec'],['Ability Cooldown','Active cooldown reduction +6%']]
};

export const LOCALES = {
  'zh-CN': {
    ui: {
      documentTitle: 'DotaRogue · Kael Lab',
      metaDescription: 'DotaRogue：受 Dota 启发的网页生存肉鸽游戏。桌面与手机横竖屏都能游玩，在 20 波远征或无尽敌潮中移动、自动攻击、升级和购物。',
      canvasAria: 'DotaRogue游戏战场。电脑使用方向键、WASD 或右键点击移动，空格冲刺、Q 施放主动技能；手机使用摇杆和右侧技能、冲刺按钮。攻击自动进行。',
      home: '← 选择游戏', eyebrow: 'KAEL LAB · BROWSER GAME',
      titleLead: '在敌潮中活过 20 波，或进入无尽模式。选择英雄、升级和装备，打造你的构筑。',
      chooseCharacter: '选择驾驶员', chooseBiome: '选择战场', difficulty: '难度', pace: '节奏', visuals: '角色皮肤', skinPixel: '普通皮肤', skinDota1: 'DotA1 皮肤', sound: '音效', language: '语言',
      start: '开始挑战', controls: '电脑：WASD / 方向键移动，右键点击目的地自动前往，Q 主动技能、空格冲刺、Esc 暂停。手机使用摇杆和技能、冲刺按钮。角色自动普攻；主动技能需要蓝量且受冷却限制。',
      levelKicker: '成长选择', levelTitle: '选择一项升级', levelDesc: '每次升级强化一项能力。选择后继续处理剩余等级。',
      shopKicker: '波间补给 · ', shopTitle: '战场补给站', shopCaption: '波末未拾取材料按 80% 折算货币，经验全额保留；商店出售组件，材料齐全后可按固定配方合成，配方不占装备格。', shopEquipment: '装备与属性',
      chestKicker: '波间战利品 · 待开 ', chestTitle: '拾获补给箱', chestDesc: '依次查看宝箱装备，决定收下或拆解。', chestTake: '收下装备', chestScrap: '拆解为材料',
      waveAuto: '自动继续', waveContinue: '继续结算',
      pauseKicker: '远征暂歇', pauseTitle: '已暂停', pauseDesc: '你的远征会在这里等你。', pauseDriver: '当前驾驶员', pauseStats: '属性', catalog: '查看图鉴', pauseCatalog: '打开图鉴', pauseBuffEmpty: '暂无永久增益', pauseSkills: '角色技能', resume: '继续战斗', resumeCountdown: '继续读秒', restart: '重新开始', backTitle: '返回标题',
      resultRestart: '再来一局', resultHome: '返回标题',
      soundOn: '开启', soundOff: '关闭',
      languageZhCN: '简体中文', languageZhTW: '繁體中文', languageEn: 'English',
      pauseAria: '暂停游戏', pauseTitleAttr: '暂停 (Esc)', skillStripAria: '角色技能', touchAria: '触控操作', joystickAria: '移动摇杆', skillButton: '技能', skillAria: '施放主动技能', skillTitle: '主动技能 (Q)', dash: '冲刺', dashAria: '冲刺', dashTitle: '冲刺 (空格)',
      noScriptTitle: 'DotaRogue', noScript: '这是一款纯前端网页游戏，需要启用 JavaScript 才能游玩。电脑使用 WASD、方向键或鼠标右键移动，Q 主动技能、空格冲刺；手机横竖屏均可使用触控摇杆与右侧按钮。装备按固定组件配方合成，技能同时需要冷却完成和蓝量足够。游戏不需要账号或服务器。',
      skillPreview: '专属技能：{skills}', soundState: '{state}', record: '最佳记录：{best} · 通关 {wins} 次', bestWave: '第 {wave} 波', noRecord: '暂无', wave: '第 {wave} / {max} 波', boss: '首领', level: '等级 {level}', pending: ' · 待选 {count}', hp: '生命 {hp} / {max}', defeated: '击败 {kills}', dashReady: '就绪', dashCooldown: '{time}s',
      finalWaveStart: '最终波次：击败{boss}！', waveStart: '第 {wave} 波开始', expeditionComplete: '远征完成', expeditionEnded: '远征终止', coreCalmed: '战场已清空', reachedWave: '这次抵达第 {wave} 波', victoryMessage: '你撑过了全部 20 波敌潮，成为最后的幸存者。', defeatMessage: '已保存本次记录。调整装备组合，再向更深处出发。',
      completedWaves: '完成波次', earnedMaterials: '获得材料', characterLevel: '角色等级', levelsLeft: '剩余 {count} 次',
      wavePrepare: '波次准备', waveSummary: '本波结算', nextWaveTitle: '下一波：第 {wave} 波', waveDoneTitle: '第 {wave} 波完成', nextWaveMessage: '战场即将重新开放，准备迎接新的敌潮。', lootMessage: '战利品已经记录，接下来处理宝箱、升级和补给。', finalWaveMessage: '最终敌潮已清理，正在整理远征结果。', aboutToStart: '即将开始', currentDifficulty: '难度', waveMaterials: '本波材料', pendingChests: '待开宝箱', currentLevel: '当前等级', startNow: '立即开始', seconds: '{time} 秒', secondsRemaining: '剩余 {time} 秒',
      scrapFor: '拆解为 ◇ {amount}', acquired: '获得{item}', scrapItem: '拆解{item}：材料 +{amount}', autoRecover: '自动回收 {count} 个宝箱，待结算开启；{status}', fullHealth: '生命已满', healthGain: '生命 +{amount}',
      waveComplete: '第 {wave} 波完成', nextWaveHint: '下一波：第 {wave} 波 · 准备完成后进入倒计时', finalWaveDone: '最终波次已完成 · 正在整理远征结果', startWaveButton: '开始第 {wave} 波 ➜', viewResult: '查看远征结果', soldOut: '售罄', buy: '购买', refresh: '刷新商品 ◇ {cost}', emptySlot: '空槽', merge: '合成', sell: '卖 ◇{price}', lock: '锁定', unlock: '解锁', locked: '🔒',
      insufficient: '材料不足', merged: '已合成{item}',
      statLife: '生命', statPrimaryAttribute: '主属性', statStrength: '力量', statAgility: '敏捷', statIntelligence: '智力', statArmor: '护甲', statMove: '移速', statAttackSpeed: '攻速', statCrit: '暴击', statDodge: '闪避', statRegen: '再生', statLuck: '幸运', statAllDamage: '全伤害', statCritDamage: '暴击伤害', statLifesteal: '生命窃取', statRegen5: '每 5 秒回血', statPickup: '拾取范围', statBaseAttackRange: '基础攻击射程', current: '当前：{status}',
      warningBoss: '警告：{boss}接近！', eliteAppears: '{elite}出现！', noTarget: '射程内没有可标定目标', marked: '已标定', overload: '过载边界！', salvageBonus: '拾荒分红：材料 +2', shieldReady: '废件护层就绪', loaded: '满载运转！', dodge: '闪避！', chestDrop: '宝箱掉落：拾取回血，结算开装备', bossDefeated: '首领已击败！', roshanEnrage: '肉山进入暴怒！', chestPending: '宝箱待结算开启；{status}', line: '掠线！', hazard: '小心：{hazard}',
      activeReady: 'Q / 就绪', cooldown: '{time} 秒', nextHitReady: '下次命中就绪', moving: '移动 {time} / 1 秒', fires: '{count} / 6 次开火', hits: '{count} / 12 次命中', guardReduce: '周围 3 名敌人 · 减伤 22%', needNearby: '需要 3 名近敌', attacks: '{count} / 5 次攻击', counterReady: '4 名敌人 · 自动就绪', materials: '{count} / {max} 材料', shield: '防护 {time} 秒', strengthened: '强化 {time} 秒', triggered: '本波已触发', charge: '{count} / 10 电荷', autoRelease: '3 层自动释放', pulseReleasing: '脉冲释放中', minimapTitle: '小地图', minimapAria: '经典战场小地图。近卫在左下，天灾在右上；黄色圆点是你，白框是当前视野。',

    },

    biomes: { dota: ['DotA 经典战场', '近卫与天灾 · 三路、河道与野区', '远古裂隙'], docks: ['赤沙废港', '灼热沙尘与失控机械', '热流喷口'], grove: ['荧菌裂谷', '发光菌簇与腐蚀孢雾', '孢雾爆发'], frost: ['蓝霜残骸', '冻结碎片与寒流裂缝', '寒流爆裂'] },
    difficulty: { normal: '标准', hard: '挑战', nightmare: '极限' }, pace: { normal: '标准', quick: '速战' },


    
  },
  'zh-TW': {
    ui: {
      documentTitle: 'DotaRogue · Kael Lab', metaDescription: 'DotaRogue：受 Dota 啟發的網頁生存肉鴿遊戲。桌面與手機橫豎屏都能遊玩，在 20 波遠征或無盡敵潮中移動、自動攻擊、升級和購物。', canvasAria: 'DotaRogue遊戲戰場。電腦使用方向鍵、WASD 或右鍵點擊移動，空格衝刺、Q 施放主動技能；手機使用搖桿和右側技能、衝刺按鈕。攻擊自動進行。', home: '← 選擇遊戲', eyebrow: 'KAEL LAB · BROWSER GAME', titleLead: '在敵潮中活過 20 波，或進入無盡模式。選擇英雄、升級和裝備，打造你的構築。', chooseCharacter: '選擇駕駛員', chooseBiome: '選擇戰場', difficulty: '難度', pace: '節奏', visuals: '角色造型', skinPixel: '普通皮膚', skinDota1: 'DotA1 皮膚', sound: '音效', language: '語言', start: '開始挑戰', controls: '電腦：WASD / 方向鍵移動，右鍵點擊目的地自動前往，Q 主動技能、空格衝刺、Esc 暫停。手機使用搖桿和技能、衝刺按鈕。角色自動普攻；主動技能需要魔法且受冷卻限制。', levelKicker: '成長選擇', levelTitle: '選擇一項升級', levelDesc: '每次升級強化一項能力。選擇後繼續處理剩餘等級。', shopKicker: '波間補給 · ', shopTitle: '戰場補給站', shopCaption: '波末未拾取材料按 80% 折算貨幣，經驗全額保留；商店出售組件，材料齊全後可按固定配方合成，配方不占裝備格。', shopEquipment: '裝備與屬性', chestKicker: '波間戰利品 · 待開 ', chestTitle: '拾獲補給箱', chestDesc: '依次查看寶箱裝備，決定收下或拆解。', chestTake: '收下裝備', chestScrap: '拆解為材料', waveAuto: '自動繼續', waveContinue: '繼續結算', pauseKicker: '遠征暫歇', pauseTitle: '已暫停', pauseDesc: '你的遠征會在這裡等你。', pauseDriver: '目前駕駛員', pauseStats: '屬性', catalog: '查看圖鑑', pauseCatalog: '打開圖鑑', pauseBuffEmpty: '暫無永久增益', pauseSkills: '角色技能', resume: '繼續戰鬥', resumeCountdown: '繼續讀秒', restart: '重新開始', backTitle: '返回標題', resultRestart: '再來一局', resultHome: '返回標題', soundOn: '開啟', soundOff: '關閉', languageZhCN: '簡體中文', languageZhTW: '繁體中文', languageEn: 'English', pauseAria: '暫停遊戲', pauseTitleAttr: '暫停 (Esc)', skillStripAria: '角色技能', touchAria: '觸控操作', joystickAria: '移動搖桿', skillButton: '技能', skillAria: '施放主動技能', skillTitle: '主動技能 (Q)', dash: '衝刺', dashAria: '衝刺', dashTitle: '衝刺 (空格)', noScriptTitle: 'DotaRogue', noScript: '這是一款純前端網頁遊戲，需要啟用 JavaScript 才能遊玩。電腦使用 WASD、方向鍵或滑鼠右鍵移動，Q 主動技能、空格衝刺；手機橫豎屏均可使用觸控搖桿與右側按鈕。裝備按固定組件配方合成，技能同時需要冷卻完成和魔法足夠。遊戲不需要帳號或伺服器。', skillPreview: '專屬技能：{skills}', soundState: '{state}', record: '最佳紀錄：{best} · 通關 {wins} 次', bestWave: '第 {wave} 波', noRecord: '暫無', wave: '第 {wave} / {max} 波', boss: '首領', level: '等級 {level}', pending: ' · 待選 {count}', hp: '生命 {hp} / {max}', defeated: '擊敗 {kills}', dashReady: '就緒', dashCooldown: '{time}s', finalWaveStart: '最終波次：擊敗{boss}！', waveStart: '第 {wave} 波開始', expeditionComplete: '遠征完成', expeditionEnded: '遠征終止', coreCalmed: '戰場已清空', reachedWave: '這次抵達第 {wave} 波', victoryMessage: '你撐過了全部 20 波敵潮，成為最後的倖存者。', defeatMessage: '已保存本次紀錄。調整裝備組合，再向更深處出發。', completedWaves: '完成波次', earnedMaterials: '獲得材料', characterLevel: '角色等級', levelsLeft: '剩餘 {count} 次', wavePrepare: '波次準備', waveSummary: '本波結算', nextWaveTitle: '下一波：第 {wave} 波', waveDoneTitle: '第 {wave} 波完成', nextWaveMessage: '戰場即將重新開放，準備迎接新的敵潮。', lootMessage: '戰利品已經記錄，接下來處理寶箱、升級和補給。', finalWaveMessage: '最終敵潮已清理，正在整理遠征結果。', aboutToStart: '即將開始', currentDifficulty: '難度', waveMaterials: '本波材料', pendingChests: '待開寶箱', currentLevel: '目前等級', startNow: '立即開始', seconds: '{time} 秒', secondsRemaining: '剩餘 {time} 秒', scrapFor: '拆解為 ◇ {amount}', acquired: '獲得{item}', scrapItem: '拆解{item}：材料 +{amount}', autoRecover: '自動回收 {count} 個寶箱，待結算開啟；{status}', fullHealth: '生命已滿', healthGain: '生命 +{amount}', waveComplete: '第 {wave} 波完成', nextWaveHint: '下一波：第 {wave} 波 · 準備完成後進入倒計時', finalWaveDone: '最終波次已完成 · 正在整理遠征結果', startWaveButton: '開始第 {wave} 波 ➜', viewResult: '查看遠征結果', soldOut: '售罄', buy: '購買', refresh: '刷新商品 ◇ {cost}', emptySlot: '空槽', merge: '合成', sell: '賣 ◇{price}', lock: '鎖定', unlock: '解鎖', locked: '🔒', insufficient: '材料不足', merged: '已合成{item}', statLife: '生命', statPrimaryAttribute: '主屬性', statStrength: '力量', statAgility: '敏捷', statIntelligence: '智力', statArmor: '護甲', statMove: '移速', statAttackSpeed: '攻速', statCrit: '暴擊', statDodge: '閃避', statRegen: '再生', statLuck: '幸運', statAllDamage: '全傷害', statCritDamage: '暴擊傷害', statLifesteal: '生命竊取', statRegen5: '每 5 秒回血', statPickup: '拾取範圍', statBaseAttackRange: '基礎攻擊射程', current: '目前：{status}', warningBoss: '警告：{boss}接近！', eliteAppears: '{elite}出現！', noTarget: '射程內沒有可標定目標', marked: '已標定', overload: '過載邊界！', salvageBonus: '拾荒分紅：材料 +2', shieldReady: '廢件護層就緒', loaded: '滿載運轉！', dodge: '閃避！', chestDrop: '寶箱掉落：拾取回血，結算開裝備', bossDefeated: '首領已擊敗！', chestPending: '寶箱待結算開啟；{status}', line: '掠線！', hazard: '小心：{hazard}', activeReady: 'Q / 就緒', cooldown: '{time} 秒', nextHitReady: '下次命中就緒', moving: '移動 {time} / 1 秒', fires: '{count} / 6 次開火', hits: '{count} / 12 次命中', guardReduce: '周圍 3 名敵人 · 減傷 22%', needNearby: '需要 3 名近敵', attacks: '{count} / 5 次攻擊', counterReady: '4 名敵人 · 自動就緒', materials: '{count} / {max} 材料', shield: '防護 {time} 秒', strengthened: '強化 {time} 秒', triggered: '本波已觸發', charge: '{count} / 10 電荷', autoRelease: '3 層自動釋放', pulseReleasing: '脈衝釋放中', minimapTitle: '小地圖', minimapAria: '經典戰場小地圖。近衛在左下，天災在右上；黃色圓點是你，白框是目前視野。',
    },

      biomes: { dota: ['DotA 經典戰場', '近衛與天災 · 三路、河道與野區', '遠古裂隙'], docks: ['赤沙廢港', '灼熱沙塵與失控機械', '熱流噴口'], grove: ['熒菌裂谷', '發光菌簇與腐蝕孢霧', '孢霧爆發'], frost: ['藍霜殘骸', '凍結碎片與寒流裂縫', '寒流爆裂'] }, difficulty: { normal: '標準', hard: '挑戰', nightmare: '極限' }, pace: { normal: '標準', quick: '速戰' },
      
  },
  en: {
    ui: {
      documentTitle: 'DotaRogue · Kael Lab', metaDescription: 'DotaRogue is a Dota-inspired survivor roguelite. Move, auto-attack, upgrade and shop through a 20-wave expedition or an endless enemy surge on desktop or mobile.', canvasAria: 'DotaRogue arena. Use WASD or arrow keys, or right-click to move; Space to dash and Q for your active skill. Use the joystick and buttons on mobile. Attacks are automatic.', home: '← Game selection', eyebrow: 'KAEL LAB · BROWSER GAME', titleLead: 'Survive 20 waves or face the endless surge. Choose a hero, upgrade and craft your build.', chooseCharacter: 'Choose pilot', chooseBiome: 'Choose battlefield', difficulty: 'Difficulty', pace: 'Pace', visuals: 'Hero skin', skinPixel: 'Standard skin', skinDota1: 'DotA1 skin', sound: 'Sound', language: 'Language', start: 'Start run', controls: 'Desktop: WASD / arrows or right-click to move, Q for the active skill, Space to dash, Esc to pause. Mobile uses the joystick and buttons. Basic attacks are automatic; active skills require mana and cooldown.', levelKicker: 'Growth choice', levelTitle: 'Choose an upgrade', levelDesc: 'Each level strengthens one ability. Choose one, then resolve any remaining levels.', shopKicker: 'Between-wave supply · ', shopTitle: 'Battlefield Supply', shopCaption: 'Uncollected materials convert at 80% and all XP is kept. Buy components and combine them through fixed recipes when ready. Recipes take no equipment slot.', shopEquipment: 'Loadout & stats', chestKicker: 'Between-wave loot · unopened ', chestTitle: 'Supply chest', chestDesc: 'Review each chest equipment reward, then take or scrap it.', chestTake: 'Take equipment', chestScrap: 'Scrap for materials', waveAuto: 'Continue automatically', waveContinue: 'Continue settlement', pauseKicker: 'Expedition paused', pauseTitle: 'Paused', pauseDesc: 'Your expedition is waiting here.', pauseDriver: 'Current pilot', pauseStats: 'Stats', catalog: 'View archive', pauseCatalog: 'Open archive', pauseBuffEmpty: 'No permanent buffs', pauseSkills: 'Character skills', resume: 'Resume battle', resumeCountdown: 'Resume countdown', restart: 'Restart', backTitle: 'Back to title', resultRestart: 'Play again', resultHome: 'Back to title', soundOn: 'On', soundOff: 'Off', languageZhCN: '简体中文', languageZhTW: '繁體中文', languageEn: 'English', pauseAria: 'Pause game', pauseTitleAttr: 'Pause (Esc)', skillStripAria: 'Character skills', touchAria: 'Touch controls', joystickAria: 'Movement joystick', skillButton: 'Skill', skillAria: 'Cast active skill', skillTitle: 'Active skill (Q)', dash: 'Dash', dashAria: 'Dash', dashTitle: 'Dash (Space)', noScriptTitle: 'DotaRogue', noScript: 'This frontend browser game needs JavaScript. Use WASD, arrow keys or right-click to move, Q for the active skill, and Space to dash. Mobile uses the joystick and buttons. Equipment combines through fixed component recipes, and skills need both cooldown and mana. No account or server is required.', skillPreview: 'Signature ', soundState: '{state}', record: 'Best record: {best} · Wins {wins}', bestWave: 'Wave {wave}', noRecord: 'none', wave: 'Wave {wave} / {max}', boss: 'Boss', level: 'Level {level}', pending: ' · {count} pending', hp: 'HP {hp} / {max}', defeated: 'Defeated {kills}', dashReady: 'Ready', dashCooldown: '{time}s', finalWaveStart: 'Final wave: defeat {boss}!', waveStart: 'Wave {wave} begins', expeditionComplete: 'Expedition complete', expeditionEnded: 'Expedition ended', coreCalmed: 'The battlefield is clear', reachedWave: 'You reached wave {wave}', victoryMessage: 'You survived all 20 enemy waves and became the last survivor.', defeatMessage: 'This record is saved. Tune your loadout and venture deeper.', completedWaves: 'Waves cleared', earnedMaterials: 'Materials earned', characterLevel: 'Pilot level', levelsLeft: '{count} levels left', wavePrepare: 'Wave preparation', waveSummary: 'Wave settlement', nextWaveTitle: 'Next wave: {wave}', waveDoneTitle: 'Wave {wave} complete', nextWaveMessage: 'The battlefield will reopen soon. Prepare for the next enemy surge.', lootMessage: 'Loot recorded. Next, resolve chests, upgrades and supplies.', finalWaveMessage: 'The final enemy surge is cleared. Preparing the expedition result.', aboutToStart: 'Starting', currentDifficulty: 'Difficulty', waveMaterials: 'Wave materials', pendingChests: 'Chests unopened', currentLevel: 'Current level', startNow: 'Start now', seconds: '{time} sec', secondsRemaining: '{time} sec remaining', scrapFor: 'Scrap for ◇ {amount}', acquired: 'Gained {item}', scrapItem: 'Scrapped {item}: +{amount} materials', autoRecover: 'Recovered {count} chest(s); open between waves. {status}', fullHealth: 'Health full', healthGain: 'Health +{amount}', waveComplete: 'Wave {wave} complete', nextWaveHint: 'Next wave: {wave} · countdown after preparation', finalWaveDone: 'Final wave complete · preparing expedition result', startWaveButton: 'Start wave {wave} ➜', viewResult: 'View expedition result', soldOut: 'Sold out', buy: 'Buy', refresh: 'Refresh stock ◇ {cost}', emptySlot: 'Empty slot', merge: 'Merge', sell: 'Sell ◇{price}', lock: 'Lock', unlock: 'Unlock', locked: '🔒', insufficient: 'Not enough materials', merged: 'Crafted {item}', statLife: 'HP', statPrimaryAttribute: 'Primary attribute', statStrength: 'Strength', statAgility: 'Agility', statIntelligence: 'Intelligence', statArmor: 'Armor', statMove: 'Move speed', statAttackSpeed: 'Attack speed', statCrit: 'Crit', statDodge: 'Dodge', statRegen: 'Regen', statLuck: 'Luck', statAllDamage: 'All damage', statCritDamage: 'Crit damage', statLifesteal: 'Lifesteal', statRegen5: 'HP per 5 sec', statPickup: 'Pickup range', statBaseAttackRange: 'Basic attack range', current: 'Current: {status}', warningBoss: 'Warning: {boss} is approaching!', eliteAppears: '{elite} appears!', noTarget: 'No target in range to mark', marked: 'Marked', overload: 'Overload boundary!', salvageBonus: 'Scavenger bonus: +2 materials', shieldReady: 'Scrap shield ready', loaded: 'Fully loaded!', dodge: 'Dodged!', chestDrop: 'Chest dropped: pick it up to heal; open it between waves', bossDefeated: 'Boss defeated!', chestPending: 'Chest queued; {status}', line: 'Tracer volley!', hazard: 'Watch out: {hazard}', activeReady: 'Q / Ready', cooldown: '{time} sec', nextHitReady: 'Next hit ready', moving: 'Move {time} / 1 sec', fires: '{count} / 6 fires', hits: '{count} / 12 hits', guardReduce: '3 nearby enemies · 22% damage reduction', needNearby: 'Need 3 nearby enemies', attacks: '{count} / 5 attacks', counterReady: '4 enemies · counter ready', materials: '{count} / {max} materials', shield: 'Shield {time} sec', strengthened: 'Boosted {time} sec', triggered: 'Triggered this wave', charge: '{count} / 10 charge', autoRelease: 'Auto-release at 3 stacks', pulseReleasing: 'Pulse releasing', minimapTitle: 'Minimap', minimapAria: 'Classic battlefield minimap. Sentinel bottom left, Scourge top right. The yellow dot is you; the white box is the current view.',
    },
     biomes: { dota: ['DotA Classic', 'Sentinel & Scourge · three lanes, river & jungle', 'Ancient rift'], docks: ['Red Sand Docks', 'Scorching dust and rogue machinery', 'Thermal vents'], grove: ['Glowfungus Rift', 'Luminous fungi and corrosive spores', 'Spore burst'], frost: ['Bluefrost Wreckage', 'Frozen debris and cold cracks', 'Cold surge'] }, difficulty: { normal: 'Standard', hard: 'Challenge', nightmare: 'Nightmare' }, pace: { normal: 'Standard', quick: 'Quick' },   
  }
};
Object.assign(LOCALES['zh-CN'].ui, { frostNovaWarning: '霜爆 · 离开蓝圈', thunderFanWarning: '三叉雷击 · 避开雷线' });
Object.assign(LOCALES['zh-TW'].ui, { frostNovaWarning: '霜爆 · 離開藍圈', thunderFanWarning: '三叉雷擊 · 避開雷線' });
Object.assign(LOCALES.en.ui, { frostNovaWarning: 'Frost burst · leave the circle', thunderFanWarning: 'Triple lightning · dodge the lanes' });
export const EXTRA_UI = {
  'zh-CN': { titlePrefix: 'Dota', titleSuffix: 'Rogue', reachedWaveLabel: '抵达波次', mode: '模式', modeExpedition: '远征模式', modeEndless: '无尽模式', endlessReached: '无尽远征：第 {wave} 波', endlessMessage: '你抵达了第 {wave} 波，记录已保存；无尽敌潮最终将你逼退。', defeatedLabel: '击败敌人', factor: '当前因子', roshanEnrage: '肉山进入暴怒！' },
  'zh-TW': { titlePrefix: 'Dota', titleSuffix: 'Rogue', reachedWaveLabel: '抵達波次', mode: '模式', modeExpedition: '遠征模式', modeEndless: '無盡模式', endlessReached: '無盡遠征：第 {wave} 波', endlessMessage: '你抵達了第 {wave} 波，紀錄已保存；無盡敵潮最終將你逼退。', defeatedLabel: '擊敗敵人', factor: '目前因子', roshanEnrage: '肉山進入暴怒！' },
  en: { titlePrefix: 'Dota', titleSuffix: 'Rogue', reachedWaveLabel: 'Wave reached', mode: 'Mode', modeExpedition: 'Expedition mode', modeEndless: 'Endless mode', endlessReached: 'Endless expedition: wave {wave}', endlessMessage: 'You reached wave {wave}; the record is saved. The endless surge eventually pushed you back.', defeatedLabel: 'Enemies defeated', factor: 'Run factor', roshanEnrage: 'Roshan is enraged!' }
};
Object.assign(EXTRA_UI['zh-CN'], {




  pauseEquipment: '当前装备', equipmentStripAria: '已持有装备', recipesTitle: '固定合成', equipmentCatalog: '查看装备图鉴', equipmentCatalogNewTab: '新标签查看装备图鉴',
  equipmentGrade: '{grade}级装备', fullEquipment: '装备格已满', equipmentSold: '装备已卖出',
  emptyEquipment: '暂无装备', needMana: '蓝量不足', mana: '法力', manaValue: '法力 {mana} / {max}', statAttackPower: '攻击力', statSkillPower: '技能伤害',
  });
Object.assign(EXTRA_UI['zh-TW'], {




  pauseEquipment: '目前裝備', equipmentStripAria: '已持有裝備', recipesTitle: '固定合成', equipmentCatalog: '查看裝備圖鑑', equipmentCatalogNewTab: '在新分頁查看裝備圖鑑',
  equipmentGrade: '{grade}級裝備', fullEquipment: '裝備格已滿', equipmentSold: '裝備已賣出',
  emptyEquipment: '暫無裝備', needMana: '魔法不足', mana: '魔法', manaValue: '魔法 {mana} / {max}', statAttackPower: '攻擊力', statSkillPower: '技能傷害',
  });
Object.assign(EXTRA_UI.en, {




  pauseEquipment: 'Current equipment', equipmentStripAria: 'Held equipment', recipesTitle: 'Fixed recipes', equipmentCatalog: 'View equipment archive', equipmentCatalogNewTab: 'Open equipment archive in new tab',
  equipmentGrade: 'Grade {grade}', fullEquipment: 'Equipment slots full', equipmentSold: 'Equipment sold',
  emptyEquipment: 'No equipment', needMana: 'Not enough mana', mana: 'Mana', manaValue: 'Mana {mana} / {max}', statAttackPower: 'Attack power', statSkillPower: 'Spell power',
  });

const BUFF_UI = {
  'zh-CN': {
    buffRarity: 'Buff 品质', buffRarity_common: '普通', buffRarity_rare: '稀有', buffRarity_epic: '史诗', buffRarity_legendary: '传说',
    buffChances: '新 Buff 概率 · 幸运 {luck}',
    shopBuffs: '永久增益', pauseBuffs: '永久增益', buffKind: '永久增益', buffRepeatable: '可重复购买', buffStack: '已持有 {count} 层 · 可重复购买',
    buffEmpty: '尚未购买永久增益。它们不占装备格，可重复购买并按层数叠加。', buffBought: '获得{item}：第 {count} 层', buffCharges: '本波薄葬：{count}/{total} 次', buffNextCharges: '下一波薄葬：{count} 次（每波恢复）', thinBurialTriggered: '薄葬抵挡伤害 · 剩余 {count} 次', buffLimits: '闪避上限 55%，吸血上限 65%，冷却缩减上限 60%；臂章流失生命最低保留 1。',
    shopRates: '新商品：成品{finished}%／中间件{intermediate}%，另有 1 个永久增益位',
  },
  'zh-TW': {
    shopBuffs: '永久增益', pauseBuffs: '永久增益', buffKind: '永久增益', buffRepeatable: '可重複購買', buffStack: '目前持有 {count} 層 · 可重複購買',
    buffRarity: 'Buff 品質', buffRarity_common: '普通', buffRarity_rare: '稀有', buffRarity_epic: '史詩', buffRarity_legendary: '傳說',
    buffChances: '新 Buff 機率 · 幸運 {luck}',
    buffEmpty: '尚未購買永久增益。它們不占裝備格，可重複購買並按層數疊加。', buffBought: '獲得{item}：第 {count} 層', buffCharges: '本波薄葬：{count}/{total} 次', buffNextCharges: '下一波薄葬：{count} 次（每波恢復）', thinBurialTriggered: '薄葬抵擋傷害 · 剩餘 {count} 次', buffLimits: '閃避上限 55%，吸血上限 65%，冷卻縮減上限 60%；臂章流失生命最低保留 1。',
    shopRates: '新商品：成品{finished}%／中間件{intermediate}%，另有 1 個永久增益位',
  },
  en: {
    shopBuffs: 'Permanent buffs', pauseBuffs: 'Permanent buffs', buffKind: 'Permanent buff', buffRepeatable: 'Repeatable', buffStack: '{count} stack(s) owned · repeatable',
    buffRarity: 'Buff rarity', buffRarity_common: 'Common', buffRarity_rare: 'Rare', buffRarity_epic: 'Epic', buffRarity_legendary: 'Legendary',
    buffChances: 'New Buff odds · Luck {luck}',
    buffEmpty: 'No permanent buffs yet. They use no equipment slots and stack with repeat purchases.', buffBought: 'Gained {item}: stack {count}', buffCharges: 'Grave this wave: {count}/{total}', buffNextCharges: 'Grave next wave: {count} (recharges each wave)', thinBurialTriggered: 'Shallow Grave blocked damage · {count} left', buffLimits: 'Caps: Dodge 55%, lifesteal 65%, cooldown reduction 60%. Armlet HP loss stops at 1 HP.',
    shopRates: 'New offers: {finished}% finished / {intermediate}% intermediate, plus 1 permanent buff slot',
  }
};
for (const locale of SUPPORTED_LOCALES) Object.assign(EXTRA_UI[locale], BUFF_UI[locale]);

const HERO_UI = {
  'zh-CN': { active: '主动', passive: '被动', availableHeroes: '可玩英雄', component: '基础组件', intermediate: '中间装备', finished: '成品装备', shopRates: '新商品：成品{finished}%／中间件{intermediate}%，另有 1 个永久增益位', statAttackPower: '攻击力', statManaRegen: '每秒回蓝', statAbilityHaste: '冷却缩减', quillCount: '受击 {count}/4 · 背后减伤40%', staticReady: '静电场 · 同敌1秒', dividendCount: '拾取 {count}/8 · 额外1币', leapCount: '有效攻击 {count}/5', soulCount: '累计收魂 {count} · 攻击 +{attack}', dividend: '炼金分红：货币 +1', bloodRage: '撒旦狂热', chooseCharacter: '选择英雄', pauseDriver: '当前英雄', titleLead: '九名英雄，20波远征或无尽敌潮。收集组件、合成装备，用伤害成长塑造你的构筑。', shopCaption: '波末材料按80%回收，经验全额保留；商店以组件为主，另有可重复购买的永久增益。固定配方不占装备格，满格仍能合成释放组件格。' },
  'zh-TW': { active: '主動', passive: '被動', availableHeroes: '可玩英雄', component: '基礎組件', intermediate: '中間裝備', finished: '成品裝備', shopRates: '新商品：成品{finished}%／中間件{intermediate}%，另有 1 個永久增益位', statAttackPower: '攻擊力', statManaRegen: '每秒回魔', statAbilityHaste: '冷卻縮減', quillCount: '受擊 {count}/4 · 背後減傷40%', staticReady: '靜電場 · 同敵1秒', dividendCount: '拾取 {count}/8 · 額外1幣', leapCount: '有效攻擊 {count}/5', soulCount: '累計收魂 {count} · 攻擊 +{attack}', dividend: '煉金分紅：貨幣 +1', bloodRage: '撒旦狂熱', chooseCharacter: '選擇英雄', pauseDriver: '當前英雄', titleLead: '九名英雄，20波遠征或無盡敵潮。收集組件、合成裝備，用傷害成長塑造你的構築。', shopCaption: '波末材料按80%回收，經驗全額保留；商店以組件為主，另有可重複購買的永久增益。固定配方不占裝備格，滿格仍能合成釋放組件格。' },
  en: { active: 'Active', passive: 'Passive', availableHeroes: 'Playable heroes', component: 'Component', intermediate: 'Intermediate', finished: 'Finished item', shopRates: 'New offers: {finished}% finished / {intermediate}% intermediate, plus 1 permanent buff slot', statAttackPower: 'Attack power', statManaRegen: 'Mana per sec', statAbilityHaste: 'Cooldown reduction', quillCount: 'Hits {count}/4 · Rear damage -40%', staticReady: 'Static Field · 1 sec per enemy', dividendCount: 'Pickups {count}/8 · +1 gold', leapCount: 'Successful attacks {count}/5', soulCount: 'Souls {count} · Attack +{attack}', dividend: 'Alchemy Dividend: +1 gold', bloodRage: 'Satanic rage', chooseCharacter: 'Choose a hero', pauseDriver: 'Current hero', titleLead: 'Nine heroes, 20-wave expeditions or endless hordes. Collect components, craft equipment and build your damage growth.', shopCaption: 'Uncollected materials convert at 80% and all XP is kept. Most offers are components, plus repeatable permanent buffs. Fixed recipes take no slot; crafting also works with a full inventory.' }
};
for (const locale of SUPPORTED_LOCALES) Object.assign(EXTRA_UI[locale], HERO_UI[locale]);

const EQUIPMENT_UPGRADE_UI = {
  'zh-CN': { upgradeRule: '全部成品装备均可用三件同名同级免费合一，最高 Lv.3；每次释放两格。组件和中间件不参与。', upgradeTo: '升至 Lv.{level}（{count}/3）', upgradePreview: '查看升阶结果', upgradeKept: '三件合为一件；保留三件属性总和与总卖价，释放 2 格。', upgradeMax: 'Lv.3 · 已满级', upgradeDone: '已升阶：{item} · 释放 2 格', upgradeActual: '当前角色实际：暴击 {crit}% · 闪避 {dodge}% · 冷缩 {haste}%。合并前后相同。' },
  'zh-TW': { upgradeRule: '全部成品裝備均可用三件同名同級免費合一，最高 Lv.3；每次釋放兩格。組件和中間件不參與。', upgradeTo: '升至 Lv.{level}（{count}/3）', upgradePreview: '查看升階結果', upgradeKept: '三件合為一件；保留三件屬性總和與總售價，釋放 2 格。', upgradeMax: 'Lv.3 · 已滿級', upgradeDone: '已升階：{item} · 釋放 2 格', upgradeActual: '目前角色實際：暴擊 {crit}% · 閃避 {dodge}% · 冷縮 {haste}%。合併前後相同。' },
  en: { upgradeRule: 'All finished gear can merge: combine three identical, same-level items for free, up to Lv.3. Each merge frees two slots. Components and intermediate items are excluded.', upgradeTo: 'Upgrade to Lv.{level} ({count}/3)', upgradePreview: 'Preview upgrade', upgradeKept: 'Three become one: keep their combined stats and resale value, and free 2 slots.', upgradeMax: 'Lv.3 · Max level', upgradeDone: 'Upgraded: {item} · 2 slots freed', upgradeActual: 'Current effective stats: Crit {crit}% · Dodge {dodge}% · Cooldown reduction {haste}%. Unchanged by merging.' }
};
for (const locale of SUPPORTED_LOCALES) Object.assign(EXTRA_UI[locale], EQUIPMENT_UPGRADE_UI[locale]);
const EARLY_GAME_UI = {
  'zh-CN': {
    freeRefresh: '免费刷新（本波首次）', waveSupply: '含通关补给 ◇ {amount}。',
    shopRates: '随机装备位：成品{finished}%／中间件{intermediate}%，另有 1 个永久增益位',
    shopCaption: '前5波每店首刷免费，至少提供2件基础组件（锁定优先），并优先补齐已有配方。波末未拾材料按80%回收，经验全额保留；合成免费，不占额外配方格。'
  },
  'zh-TW': {
    freeRefresh: '免費刷新（本波首次）', waveSupply: '含通關補給 ◇ {amount}。',
    shopRates: '隨機裝備位：成品{finished}%／中間件{intermediate}%，另有 1 個永久增益位',
    shopCaption: '前5波每店首刷免費，至少提供2件基礎組件（鎖定優先），並優先補齊已有配方。波末未拾材料按80%回收，經驗全額保留；合成免費，不佔額外配方格。'
  },
  en: {
    freeRefresh: 'Free refresh (first this wave)', waveSupply: 'Includes ◇ {amount} clear bonus.',
    shopRates: 'Random equipment slots: {finished}% finished / {intermediate}% intermediate, plus 1 permanent buff slot',
    shopCaption: 'Waves 1–5: first refresh free, at least 2 components (locks take priority), and offers favor missing recipe parts. Uncollected materials return 80% gold and full XP. Crafting is free; recipes use no slot.'
  }
};
for (const locale of SUPPORTED_LOCALES) Object.assign(EXTRA_UI[locale], EARLY_GAME_UI[locale]);

const CRAFT_UI = {
  'zh-CN': {
    quickCraftTitle: '即时合成与升阶', allRecipes: '全部配方与合成路线',
    upgradeProgress: '升阶进度与预览（{count} 类）',
    craftSummary: '可合成 {crafts} 项 · 可升阶 {upgrades} 组 · 装备 {used}/{capacity} 格',
    craftEmpty: '暂时没有可合成项，可在下方展开全部配方。',
    craftTarget: '合成{item}', craftChain: '一键合成{item}', craftInputs: '消耗：{items}',
    craftRoute: '合成路线：{items}', craftResult: '查看结果', craftKind: '固定配方 · 免费',
    craftProgress: '直接材料 {owned}/{total}',
    buyCraft: '◇ {cost} 购买并合成{item}', takeCraft: '收下并合成{item}',
    craftChoices: '可完成 {count} 项配方，选择结果', inventoryCount: '持有 {count} 件 · 共占 {count} 格',
    sellOne: '卖出一件 ◇{price}', upgradeGroup: 'Lv.{level} · 持有 {count} 件 · 可合 {groups} 组',
    upgradeBatch: '全部升至 Lv.{level}（{groups} 组）', upgradeBatchDone: '已升阶：{item} · 释放 {slots} 格',
    buyUpgrade: '◇ {cost} 购买并升至 Lv.2', chestOrganize: '先合成已有装备，腾出空格',
    chestFullCraft: '装备格已满；可选择合成结果，或先合成已有装备腾出空格。'
  },
  'zh-TW': {
    quickCraftTitle: '即時合成與升階', allRecipes: '全部配方與合成路線',
    upgradeProgress: '升階進度與預覽（{count} 類）',
    craftSummary: '可合成 {crafts} 項 · 可升階 {upgrades} 組 · 裝備 {used}/{capacity} 格',
    craftEmpty: '暫時沒有可合成項，可在下方展開全部配方。',
    craftTarget: '合成{item}', craftChain: '一鍵合成{item}', craftInputs: '消耗：{items}',
    craftRoute: '合成路線：{items}', craftResult: '查看結果', craftKind: '固定配方 · 免費',
    craftProgress: '直接材料 {owned}/{total}',
    buyCraft: '◇ {cost} 購買並合成{item}', takeCraft: '收下並合成{item}',
    craftChoices: '可完成 {count} 項配方，選擇結果', inventoryCount: '持有 {count} 件 · 共占 {count} 格',
    sellOne: '賣出一件 ◇{price}', upgradeGroup: 'Lv.{level} · 持有 {count} 件 · 可合 {groups} 組',
    upgradeBatch: '全部升至 Lv.{level}（{groups} 組）', upgradeBatchDone: '已升階：{item} · 釋放 {slots} 格',
    buyUpgrade: '◇ {cost} 購買並升至 Lv.2', chestOrganize: '先合成已有裝備，騰出空格',
    chestFullCraft: '裝備格已滿；可選擇合成結果，或先合成已有裝備騰出空格。'
  },
  en: {
    quickCraftTitle: 'Craft & upgrade now', allRecipes: 'All recipes & crafting routes',
    upgradeProgress: 'Upgrade progress & previews ({count} types)',
    craftSummary: '{crafts} craft option(s) · {upgrades} upgrade group(s) · Slots {used}/{capacity}',
    craftEmpty: 'Nothing to craft yet. Expand all recipes below to plan your build.',
    craftTarget: 'Craft {item}', craftChain: 'Craft full route: {item}', craftInputs: 'Consumes: {items}',
    craftRoute: 'Crafting route: {items}', craftResult: 'Preview result', craftKind: 'Fixed recipe · Free',
    craftProgress: 'Direct parts {owned}/{total}',
    buyCraft: 'Buy & craft {item} · ◇ {cost}', takeCraft: 'Take & craft {item}',
    craftChoices: '{count} recipe option(s): choose a result', inventoryCount: '{count} owned · Uses {count} slots',
    sellOne: 'Sell one · ◇{price}', upgradeGroup: 'Lv.{level} · {count} owned · {groups} merge group(s)',
    upgradeBatch: 'Upgrade all to Lv.{level} ({groups} groups)', upgradeBatchDone: 'Upgraded: {item} · {slots} slots freed',
    buyUpgrade: 'Buy & upgrade to Lv.2 · ◇ {cost}', chestOrganize: 'Craft held equipment to free a slot first',
    chestFullCraft: 'Inventory full. Choose a crafting result, or craft held equipment to free a slot first.'
  }
};
for (const locale of SUPPORTED_LOCALES) Object.assign(EXTRA_UI[locale], CRAFT_UI[locale]);
for (const [locale, messages] of Object.entries({
  'zh-CN': ['正在加载角色…', '角色图片加载失败，请重试或切换皮肤。'],
  'zh-TW': ['正在載入英雄…', '英雄圖片載入失敗，請重試或切換外觀。'],
  en: ['Loading hero…', 'Hero images could not load. Please retry or switch skins.']
})) Object.assign(EXTRA_UI[locale], { heroLoading: messages[0], heroLoadFailed: messages[1] });

export function translate(locale, key, vars = {}) {
  const value = EXTRA_UI[locale]?.[key] ?? LOCALES[locale]?.ui?.[key] ?? EXTRA_UI[DEFAULT_LOCALE]?.[key] ?? LOCALES[DEFAULT_LOCALE].ui[key] ?? key;
  return String(value).replace(/\{(\w+)\}/g, (_, name) => vars[name] == null ? '' : String(vars[name]));
}

export function modeName(locale, id) {
  return locale === 'en' ? (id === 'endless' ? 'Endless' : 'Expedition') : locale === 'zh-TW' ? (id === 'endless' ? '無盡' : '遠征') : (id === 'endless' ? '无尽' : '远征');
}
