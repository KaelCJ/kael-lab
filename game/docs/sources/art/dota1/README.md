# DotA1／Warcraft III 经典图标

本目录保存按 2026-10-27 用户明确要求复用的第三方公开图标来源与校验清单。正式素材位于 `game/static/dotarogue/assets/art/dota1/`，供 DotaRogue 的装备、Buff、图鉴和工作台使用，共 76 张 PNG：49 件装备与 27 个 Buff；具体消费接线与浏览器验证以游戏代码、游戏 README 和对应工作项为准。

## 来源与处理

- 主要来源：[wc3.3dn.ru 经典 DotA 物品图标目录](https://wc3.3dn.ru/publ/dota/other/ikonki_artefaktov_doty/43-1-0-564)及逐英雄攻略中的技能图标。
- 秘银锤来源：[Dota-Heroes Mithril Hammer](https://dota-heroes.com/mithril-hammer)。
- 耐久光环与陨星锤的语义图来源：Blizzard [Tauren Chieftain](https://classic.battle.net/war3/orc/units/taurenchieftain.shtml)与[Dreadlord](https://classic.battle.net/war3/undead/units/dreadlord.shtml)经典资料页。
- 保留源图尺寸和内容，仅解码为 RGBA PNG；不重新绘制、调色、缩放或添加边框。GIF 使用其第一静帧。原文件和 PNG 的 RGBA 像素逐张相等，源／输出 SHA-256、原格式、尺寸与文件 URL 均登记在 [manifest.json](manifest.json)。源站存在边框与无边框、不同分辨率版本，本目录保留这些来源差异。

## 来源标识与权利状态

这些文件是第三方游戏美术，并非本仓库原创，不随本仓库代码授予任何开源许可。Warcraft III 原始图像归 Blizzard Entertainment；DotA 专属修改属于各自创作者。所核对的社区来源页没有声明通用再分发许可，本目录如实登记该状态，不把公开可下载、用户要求使用或来源标注当作权利人授权。

`direct-counterpart` 表示当前游戏对象与来源图标有经典同名或历史名称对应；`semantic-reference` 表示本作把已有经典图标用于新机制，不声称来源游戏有同名同机制物品：

| 本作 ID | 实际来源图标 | 类型 |
| --- | --- | --- |
| `orbitingArray` | Spirits | 本作语义复用 |
| `deadShot` | Moon Glaive | 本作语义复用 |
| `clockworkGuards` | March of the Machines | 本作语义复用 |
| `meteorHammer` | Inferno | 本作语义复用 |

陨星锤不在所核对的经典 DotA1 物品表中，采用原版 Warcraft III 的 Inferno 图标；没有把 Dota2 陨星锤或攻略截图标成 Dota1 原始装备图。弹无虚发采用 Luna 月刃图，星环装置采用 Io 幽光之魂图，机械护卫采用修补匠进军机器图。

## 文件与映射

正式图标位于 `game/static/dotarogue/assets/art/dota1/equipment/<装备 ID>.png` 与 `game/static/dotarogue/assets/art/dota1/buffs/<Buff ID>.png`。完整清单、源页、下载 URL、像素尺寸、格式、SHA-256 和映射说明由 [manifest.json](manifest.json)统一维护，`path` 以仓库根目录为基准。全部 76 文件此前已经解码、哈希和像素一致性检查并进行静态接触表审阅；此次迁移再次核对正式 PNG 的 SHA-256，此结果不替代商店、HUD、图鉴、暂停和工作台的浏览器验收。

## 本轮产物

- 保留：静态目录 PNG、本目录 manifest 与本 README。
- 验证记录：`.logs/actual-test/dota1-icons-20261027/verification.json`，不提交。
- 本机临时保留：`.tmp/dota1-assets-20261027/` 下的抓取页、来源原文件、下载／验证脚本、接触表，不提交；不删除或覆盖其他任务证据。
