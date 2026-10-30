# DotA1／Warcraft III 经典图标

本目录保存按 2026-10-27 用户明确要求复用的第三方公开图标来源与校验清单。正式素材位于 `game/static/dotarogue/assets/art/dota1/`，供 DotaRogue 的装备、Buff、英雄选人、图鉴和工作台使用，共 85 张 PNG：49 件装备、27 个 Buff 与 9 名英雄头像；具体消费接线与浏览器验证以游戏代码、游戏 README 和对应工作项为准。

## 来源与处理

- 主要来源：[wc3.3dn.ru 经典 DotA 物品图标目录](https://wc3.3dn.ru/publ/dota/other/ikonki_artefaktov_doty/43-1-0-564)及逐英雄攻略中的技能图标。
- 秘银锤来源：[Dota-Heroes Mithril Hammer](https://dota-heroes.com/mithril-hammer)。
- 耐久光环与陨星锤的语义图来源：Blizzard [Tauren Chieftain](https://classic.battle.net/war3/orc/units/taurenchieftain.shtml)与[Dreadlord](https://classic.battle.net/war3/undead/units/dreadlord.shtml)经典资料页。
- 保留源图尺寸和内容，仅解码为 RGBA PNG；不重新绘制、调色、缩放或添加边框。GIF 使用其第一静帧。原文件和 PNG 的 RGBA 像素逐张相等，源／输出 SHA-256、原格式、尺寸与文件 URL 均登记在 [manifest.json](manifest.json)。源站存在边框与无边框、不同分辨率版本，本目录保留这些来源差异。

英雄头像来自同站各英雄攻略直接引用的 `Pictures/Dota_icons/` 图标：火枪手、刚背兽、宙斯、炼金术士、剑圣、影魔、卡尔、Luna 与灵魂守卫，均为 64×64 GIF 的首静帧。保留原图及内置边框，仅转为 RGBA PNG，未用 Dota2、Reforged 或通用 Warcraft III 单位大肖像替代。剑圣图的实际引用页为 Luna 攻略中的英雄配合部分，另登记剑圣本人的攻略作为身份对照。九图逐项来源见 manifest 的 `heroes` 分组。

## 来源标识与权利状态

这些文件是第三方游戏美术，并非本仓库原创，不随本仓库代码授予任何开源许可。Warcraft III 原始图像归 Blizzard Entertainment；DotA 专属修改属于各自创作者。所核对的社区来源页没有声明通用再分发许可，本目录如实登记该状态，不把公开可下载、用户要求使用或来源标注当作权利人授权。

2026-10-27 已核对 Blizzard [Legal FAQ](https://www.blizzard.com/en-us/legal/10390250-087d-41fd-aa47-1a44cbacb10b/legal-faq) 的有限个人、非商业网站使用条款；该条款不能作为公开游戏及源码仓库的通用再分发许可。本轮按用户明确要求直接使用经典头像的决定接入，仍保留上述权利状态记录。

`direct-counterpart` 表示当前游戏对象与来源图标有经典同名或历史名称对应；`semantic-reference` 表示本作把已有经典图标用于新机制，不声称来源游戏有同名同机制物品：

| 本作 ID | 实际来源图标 | 类型 |
| --- | --- | --- |
| `orbitingArray` | Spirits | 本作语义复用 |
| `deadShot` | Moon Glaive | 本作语义复用 |
| `clockworkGuards` | March of the Machines | 本作语义复用 |
| `meteorHammer` | Inferno | 本作语义复用 |

陨星锤不在所核对的经典 DotA1 物品表中，采用原版 Warcraft III 的 Inferno 图标；没有把 Dota2 陨星锤或攻略截图标成 Dota1 原始装备图。弹无虚发采用 Luna 月刃图，星环装置采用 Io 幽光之魂图，机械护卫采用修补匠进军机器图。

## 文件与映射

正式图标位于 `game/static/dotarogue/assets/art/dota1/equipment/<装备 ID>.png` 、`game/static/dotarogue/assets/art/dota1/buffs/<Buff ID>.png` 与 `game/static/dotarogue/assets/art/dota1/heroes/<英雄 ID>.png`。完整清单、源页、下载 URL、像素尺寸、格式、SHA-256 和映射说明由 [manifest.json](manifest.json)统一维护，`path` 以仓库根目录为基准。原有 76 文件此前已经解码、哈希和像素一致性检查并进行静态接触表审阅；此次迁移再次核对正式 PNG 的 SHA-256，此结果不替代商店、HUD、图鉴、暂停和工作台的浏览器验收。

## 本轮产物

- 保留：静态目录 PNG、本目录 manifest 与本 README。
- 验证记录：`.logs/actual-test/dota1-icons-20261027/verification.json`，不提交。
- 本机临时保留：`.tmp/dota1-assets-20261027/` 下的抓取页、来源原文件、下载／验证脚本、接触表，不提交；不删除或覆盖其他任务证据。

九张英雄头像本轮均已解码并与来源 GIF 首帧逐像素核对、记录哈希和查看静态拼版。保留 `.tmp/dota1-portraits-20261027/` 的来源原图、解码图、下载清单与拼版，以及 `.playwright-mcp/dota1-portraits-20261027/` 的浏览器截图和 `.logs/actual-test/dota1-portraits-20261027/` 的验证记录；它们不提交，不清理其他任务产物。

## 装备本体派生

2026-10-29 从现有装备图标派生 22 张透明装备本体，供角色周围展示和分身斧派生飞弹使用。原有 85 张图标保持原字节；抠图继承上述第三方来源与权利状态。蒙版、确定性生成器与逐件哈希见[装备本体抠图](equipment-cutouts/README.md)，正式输出归静态目录的 `equipment-cutouts/`。

## 可选角色皮肤

2026-10-28 增加的可选 DotA1 风格全身角色是本项目自绘 SVG 的衍生资源，位于 `game/static/dotarogue/assets/characters/dota1/`，不属于本清单中的第三方图标。生成入口、普通素材映射和逐帧哈希见[角色皮肤来源说明](../../characters/dota1/README.md)及其 manifest；该首版不包含导出的 Warcraft III 模型、贴图或动画文件。
