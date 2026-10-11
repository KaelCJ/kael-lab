# 星核幸存者角色设计包

本目录集中管理六名英雄的角色设计资料、Concept 首图和运行 SVG。角色设计包与 AI 首图仍属 Concept；当前工作树的 `../../js/game/game.js` 已有六名英雄及技能分支，运行图映射使用每人 9 张静态 SVG 姿态帧，分层 `hero.svg` 留作可编辑动画预览源图。六人的待机、行走、冲刺、普攻三阶段和技能姿态已接入真实战斗；长局平衡、完整多方向动作、最终小尺寸动作质量和角色首图审阅仍待验证。

角色名称与种族、职业按 [英雄.md](../../dota/英雄.md) 对照；Dota／War3 资料既可作为精确角色原型和动作回源，也可在核对许可后直接采用外部素材；台词、音效和技能数值仍按《星核幸存者》的运行规则管理。

首图阶段参考或精确对照 DotA1／War3 的角色辨识点，并用 Kingdom Rush 的小尺寸表现检查可读性。五名英雄已通过 Lanox Image2 制作 2D 手绘卡通全身待机 PNG；众神之王的 Lanox 任务连续失败，随后改用 SVG。针对“角色只是图片、缺乏动作”，六名英雄现各有可编辑分层 SVG、两张待机、两张步行、冲刺、攻击蓄力／出手／收势和技能共 9 张静态运行帧；每人的基础武器、远程弹道或近战挥砍也在运行代码中按角色区分。每名英雄使用独立工作项和 session；静态素材、源码接入和最终浏览器验收分别记录。

首图目标是略微俯视的三分之四视角、完整身体和武器、透明背景，无文字、UI 或水印；五张 PNG 已有长边 128px／64px 缩小图。五名已出图英雄的 PNG 与提示词保存在各自 `art/concept/`；众神之王的 SVG 位于 `art/runtime/`，与四次失败的 AI PNG 任务分开记录。炼金术士须完整呈现地精与食人魔搭档这一组合。

五张 PNG 使用用户指定的 Lanox Image2 与现有本机凭据生成，模型为 `lanox-image-2`；异步任务、去背景、预览与状态记录见[角色图片创作流程.md](../core/角色图片创作流程.md)。众神之王按后来单独确认的 SVG 路线制作，不改变五张现有 PNG 或[剑圣 AI／SVG 对照](jugg/art/comparison/README.md)的来源。

| 运行 ID | 角色名 | 英雄姓名 | 英文称谓 | 种族归属 | 职业 / 原型身份 | 对照简称 |
| --- | --- | --- | --- | --- | --- | --- |
| rover | 矮人火枪手 | Kardel Sharpeye | Dwarven Sniper | 人族（矮人） | 火枪手 | Sniper |
| bulwark | 刚背兽 | Rigwarl | Bristleback | 中立（野猪人） | 野猪人战士（设计候选） | BB |
| conductor | 众神之王 | Zeus | Lord of Olympia | 人族（矮人） | 山丘之王／战士 | Zeus |
| scavenger | 炼金术士 | Razzil Darkbrew | Alchemist | 中立（地精；食人魔搭档） | 炼金师 | Alchemist |
| jugg | 剑圣 | Yurnero | Juggernaut | 兽族（兽人） | 剑圣／战士 | Jugg |
| sf | 影魔 | Nevermore | Shadow Fiend | 中立（火元素） | 火焰领主 | SF |

## 首图制作状态（Concept）

2026-10-11 已使用真实 Lanox Image2 任务生成五名英雄，均保留 1707×2560 原图、透明处理图和长边 128px／64px 预览；其中剑圣、刚背兽、炼金术士、矮人火枪手另有背景清理版。透明度由本地色键处理得到，不是接口原生透明输出。各角色记录有静态图像检查；用户首图审阅仍待进行。六名角色的运行资源接线与短流程验证见下节。

[五名英雄 PNG 审阅拼版](hero-concepts-v1-review.png)仅组合下表中的真实清理图与预览，不是额外的模型生成任务。

| 英雄 | 实际结果 | 当前审阅图与预览 | 提示词与任务记录 |
| --- | --- | --- | --- |
| 剑圣 · jugg | 已生成并检查，待用户审阅 | [原图](jugg/art/concept/jugg-idle-v1-source.png)、[透明图](jugg/art/concept/jugg-idle-v1-clean.png)、[128px](jugg/art/concept/jugg-idle-v1-clean-128.png)、[64px](jugg/art/concept/jugg-idle-v1-clean-64.png) | [提示词 / 记录](jugg/art/concept/jugg-idle-v1.prompt.md) |
| 刚背兽 · bulwark | 已生成并检查，待用户审阅 | [原图](bulwark/art/concept/bulwark-idle-v1-source.png)、[透明图](bulwark/art/concept/bulwark-idle-v1-clean.png)、[128px](bulwark/art/concept/bulwark-idle-v1-clean-128.png)、[64px](bulwark/art/concept/bulwark-idle-v1-clean-64.png) | [提示词 / 记录](bulwark/art/concept/bulwark-idle-v1.prompt.md) |
| 炼金术士 · scavenger | 已生成并检查，待用户审阅 | [原图](scavenger/art/concept/scavenger-idle-v1-source.png)、[透明图](scavenger/art/concept/scavenger-idle-v1-clean.png)、[128px](scavenger/art/concept/scavenger-idle-v1-clean-128.png)、[64px](scavenger/art/concept/scavenger-idle-v1-clean-64.png) | [提示词 / 记录](scavenger/art/concept/scavenger-idle-v1.prompt.md) |
| 矮人火枪手 · rover | 首次失败、恢复重试成功，待用户审阅 | [原图](rover/art/concept/rover-idle-v1-source.png)、[透明图](rover/art/concept/rover-idle-v1-clean.png)、[128px](rover/art/concept/rover-idle-v1-clean-128.png)、[64px](rover/art/concept/rover-idle-v1-clean-64.png) | [提示词 / 记录](rover/art/concept/rover-idle-v1.prompt.md) |
| 众神之王 · conductor | 四次 Lanox Image2 任务均失败、无 AI PNG；后续已另绘 SVG 与 9 张静态动作帧并接入源码，真实入口已核对 | [可编辑 SVG 源图](conductor/art/runtime/conductor-hero.svg)；无 AI PNG 或对应 128px／64px PNG 预览 | [旧提示词 / 四次失败记录](conductor/art/concept/conductor-idle-v1.prompt.md) |
| 影魔 · sf | 第三次获授权重试成功，已生成并检查，待用户审阅 | [原图](sf/art/concept/sf-idle-v1-source.png)、[透明图](sf/art/concept/sf-idle-v1.png)、[128px](sf/art/concept/sf-idle-v1-128.png)、[64px](sf/art/concept/sf-idle-v1-64.png) | [提示词](sf/art/concept/sf-idle-v1.prompt.md)、[制作记录](sf/art/concept/sf-idle-v1.production.md) |

众神之王的四次 AI 任务均返回 `model_service_unavailable`，服务未给出明确恢复时间；运行 SVG 是单独的代码绘制结果。五张 PNG 适合作为首轮造型参考：部分纹理在 64px 下较密，剑圣旗尖留白较紧，刚背兽与火枪手俯视感较弱；具体边界保留在各角色视觉与制作记录中。六英雄基础图与静态动作帧已另行制作；台词音频与技能声音仍待后续制作。Concept 首图审阅与运行帧的实际动态验收是两项独立工作。

## 当前源码接入与验证边界

`game.js` 的 `HERO_ART` 当前引用六名英雄各自 `art/runtime/<角色 ID>-idle-a.svg`，`HERO_POSE_ART` 为每人提供 `idle-alt`、`walk-a`、`walk-b`、`dash`、`attack-windup`、`attack`、`attack-release`、`skill` 八张同画幅静态 SVG 的路径；选定角色或开局时加载其姿态，重复路径复用图片对象。两套画面共用这组六人资源。游戏按待机与步行时间、冲刺、自动攻击三阶段和主动技能事件选帧，Canvas 不播放 `<角色 ID>-hero.svg` 源图里的 SMIL；暂停时游戏时间停止。源图与静态帧都保持 2:3 比例，缺帧时回退到角色静态 `idle-a`。完整多方向逐帧、独立上下朝向和真实手机硬件动作验收尚未完成。

动作帧接入后，从 `games.html` 逐一进入六名英雄第一波、施放主动技、观察攻击和打开暂停页的流程；1440×900 桌面真实流程已观察六人的待机、两步行、冲刺、攻击蓄力／出手／收势和技能帧进入 Canvas，暂停后帧保持且焦点落在继续按钮。390×844 竖屏和 844×390 横屏已核对触控控件、技能、冲刺、暂停焦点和布局溢出；静态资源、攻击帧和控制台错误均已复测为通过。不同地图与主题的长局表现、失焦暂停、真实手机硬件和用户对 Concept 首图的审阅仍未完成。

火枪手的[运行源图](rover/art/runtime/rover-hero.svg)后续按现有 PNG Concept 重画，九张姿态帧也单独重生成。新造型在桌面两主题及像素风竖屏选人卡中与众神之王可区分，并在初版横屏第 1 波短局中可见；像素风桌面 Q 技能的散弹特效、蓝耗和冷却也已观察。86px 静态拼版中攻击收势与技能帧区别较弱，完整技能动作流、连续九帧、多方向与长局尚未以新造型复核。上述六英雄动作流程是改画前的接线记录，不能直接替代新造型的动态验收。

用户随后要求 AI／SVG 各制作一次以比较方法。已另存[剑圣 AI／SVG 对照](jugg/art/comparison/README.md)及[并排审阅图](jugg/art/comparison/jugg-ai-vs-svg-review.png)：SVG 为本轮新绘，新 AI 任务和一次重试均失败，AI 一侧明确复用上一轮真实 PNG。该 SVG 对照由用户明确授权，保留原始来源和 Concept 边界。

## 每个角色目录

每个角色目录固定包含：

- 角色介绍.md：命名、种族、职业、定位和初始配置。
- 技能设计.md：一主动一被动的方案、数值起点、触发、冷却和表现。
- 台词.md：选择、开战、施法、低生命、击杀和结算台词。
- 音效设计.md：技能、被动、受击和台词声音的设计稿；实际音频尚未制作。
- 视觉设计.md：角色原型、现有 9 帧动作、基础攻击姿势、技能姿态和主动效果的资源记录。
- 资源规划.md：已接入资源、待补充音频和仍未覆盖的动作方向。

目录使用稳定运行 ID，避免改名破坏本地最佳记录。当前工作树已有六英雄源码，公开页面的实际名称、技能和图片表现仍须从游戏选择页进入后核对；通过最终构建验证后再同步相关“当前实现”文档。
