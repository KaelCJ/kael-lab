# 星核幸存者角色设计包

本目录是角色设计资料（Concept），用于集中管理名称、种族、职业、技能、台词、音效和像素资源规划；尚未代表 game/game.js 已接入。

角色名称与种族、职业按 ../../dota/英雄.md 对照；Dota 资料只作为命名和原型回源，像素图、台词、音效和技能数值仍需为《星核幸存者》重新设计。

| 运行 ID | 角色名 | 英雄姓名 | 英文称谓 | 种族归属 | 职业 / 原型身份 | 对照简称 |
| --- | --- | --- | --- | --- | --- | --- |
| rover | 矮人火枪手 | Kardel Sharpeye | Dwarven Sniper | 人族（矮人） | 火枪手 | Sniper |
| bulwark | 刚背兽 | Rigwarl | Bristleback | 中立（野猪人） | 野猪人战士（设计候选） | BB |
| conductor | 众神之王 | Zeus | Lord of Olympia | 人族（矮人） | 山丘之王／战士 | Zeus |
| scavenger | 炼金术士 | Razzil Darkbrew | Alchemist | 中立（地精；食人魔搭档） | 炼金师 | Alchemist |
| jugg | 剑圣 | Yurnero | Juggernaut | 兽族（兽人） | 剑圣／战士 | Jugg |
| sf | 影魔 | Nevermore | Shadow Fiend | 中立（火元素） | 火焰领主 | SF |

## 每个角色目录

每个角色目录固定包含：

- 角色介绍.md：命名、种族、职业、定位和初始配置。
- 技能设计.md：一主动一被动的方案、数值起点、触发、冷却和表现。
- 台词.md：选择、开战、施法、低生命、击杀和结算台词。
- 音效设计.md：技能、被动、受击和台词声音的设计稿；实际音频尚未制作。
- 视觉设计.md：像素剪影、动作帧、技能图标和主动效果图的资源规格。
- 资源规划.md：art 和 audio 目录的待制作清单。

目录使用稳定运行 ID，避免改名破坏本地最佳记录。公开游戏页面是否直接采用这些英雄名，需在实现接入时同步更新 game/README.md、core/角色.md、core/技能.md 和入口规则。
