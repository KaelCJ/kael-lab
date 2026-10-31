# DotaRogue角色设计包

本目录集中管理九名当前英雄及历史候选角色的设计资料；Concept 图片、可编辑输入与来源清单归 `../sources/characters/`，运行 SVG 归 `../../static/dotarogue/assets/characters/`。AI 首图和未实现的辅助资源仍属 Concept，角色包分别标注当前接入与后续计划；英雄配置位于 `../../static/dotarogue/js/heroes.js`，战斗分支位于 `../../static/dotarogue/js/game.js`。原有八名英雄各有前视、侧身各 9 张静态 SVG 姿态帧，灵魂守卫另有普通／恶魔两形态、前视／侧身四组共 36 张静态帧。待机、行走、冲刺、普攻三阶段和技能姿态由对局时钟与事件驱动，侧身按水平朝向镜像。长局平衡、上下方向独立画稿、真实手机硬件和角色首图审阅仍待验证。选人界面当前只消费九名可玩英雄；Meepo、德鲁伊、夜魔、POM 作为历史候选保留在设计资料中。

角色名称与种族、职业按 [英雄.md](../dota/英雄.md) 对照；Dota／War3 资料既可作为精确角色原型和动作回源，也可在核对许可后直接采用外部素材；台词、音效和技能数值仍按《DotaRogue》的运行规则管理。

后续角色新做、重做或新增皮肤先按[角色图片创作流程](../core/角色图片创作流程.md)执行。2026-10-29 已把影魔模型研究流程扩展到其他八名英雄及 TB 恶魔形态：九个形态共 162 张模型动画采样 PNG 已接入本地研究版，八英雄第一波短流程与换肤状态守恒已检查；正式静态站仍使用下述 SVG。具体来源、兼容转换、动作、尺寸与验证边界见[本轮制作记录](../sources/characters/dota1/model-study-20261029.md)，不把本地研究表述为正式发布或长局验收。

历史首图阶段曾参考或精确对照 DotA1／War3 的角色辨识点，并用 Kingdom Rush 的小尺寸表现检查可读性。五名英雄已通过 Lanox Image2 制作 2D 手绘卡通全身待机 PNG；众神之王的 Lanox 任务连续失败，随后改用 SVG。针对“角色只是图片、缺乏动作”，原有八名英雄各有前视 `*-hero.svg` 与右向侧身 `*-side.svg` 两张可编辑源图；两套都包含待机两帧、步行两帧、冲刺、攻击蓄力／出手／收势和技能，共每人 18 张静态运行帧。前视生成器按角色从较精细的原有路径分出手臂、手掌、武器或腿部动作组；侧身源图用肩部、前臂、握手与武器的嵌套层级驱动动作。每人的基础武器、远程弹道或近战挥砍也在运行代码中按角色区分。每名英雄使用独立工作项和 session；静态素材、源码接入和最终浏览器验收分别记录。

2026-10-28 已保留以上资源为默认普通皮肤，并增加可选 DotA1 皮肤。用户指出首版仅换色后曾重画九英雄；根据后续反馈，当前保留火枪、刚背、宙斯、炼金、剑圣和影魔的新轮廓并补体积与材质，卡尔、露娜、灵魂守卫及恶魔形态恢复普通版完整姿态几何后调色；卡尔全部前／侧姿态另统一水平适配以避免伸手裁切，纵向脚点与命名姿态变换保持不变。Luna 手持和飞行月刃均复用普通版一致几何。`../sources/characters/dota1/geometry.py` 维护新路径与色调处理，前／侧共 20 张分层源 SVG 保存在 `../sources/characters/dota1/art/source/`。`build_skin.py` 生成 180 张姿态和一张 Luna 飞行月刃，普通皮肤 203 张 SVG 保持原字节；浏览器消费 `../../static/dotarogue/assets/characters/dota1/`。形体目标与来源见[视觉规范](../core/视觉规范.md)和[来源说明](../sources/characters/dota1/README.md)，本轮真实战斗验证范围见[游戏 README](../../README.md)。

首图目标是略微俯视的三分之四视角、完整身体和武器、透明背景，无文字、UI 或水印；五张 PNG 已有长边 128px／64px 缩小图。五名已出图英雄的 PNG 保存在 `../sources/characters/<id>/art/concept/`，提示词 Markdown 保存在本目录各角色的 `art/concept/`；众神之王的可编辑 SVG 输入位于 `../sources/characters/conductor/art/source/`，与四次失败的 AI PNG 任务分开记录。炼金术士须完整呈现地精与食人魔搭档这一组合。

五张 PNG 使用用户指定的 Lanox Image2 与现有本机凭据生成，模型为 `lanox-image-2`；异步任务、去背景、预览与状态记录见[角色图片创作流程.md](../core/角色图片创作流程.md)。众神之王按后来单独确认的 SVG 路线制作，不改变五张现有 PNG 或[剑圣 AI／SVG 对照](jugg/art/comparison/README.md)的来源。

| 运行 ID | 角色名 | 英雄姓名 | 英文称谓 | 种族归属 | 职业 / 原型身份 | 对照简称 |
| --- | --- | --- | --- | --- | --- | --- |
| rover | 矮人火枪手 | Kardel Sharpeye | Dwarven Sniper | 人族（矮人） | 火枪手 | Sniper |
| bulwark | 刚背兽 | Rigwarl | Bristleback | 中立（野猪人） | 野猪人战士（设计候选） | BB |
| conductor | 众神之王 | Zeus | Lord of Olympia | 人族（矮人） | 山丘之王／战士 | Zeus |
| scavenger | 炼金术士 | Razzil Darkbrew | Alchemist | 中立（地精；食人魔搭档） | 炼金师 | Alchemist |
| jugg | 剑圣 | Yurnero | Juggernaut | 兽族（兽人） | 剑圣／战士 | Jugg |
| sf | 影魔 | Nevermore | Shadow Fiend | 中立（火元素） | 火焰领主 | SF |
| kael | 召唤师 | Kael | Invoker | 人族（血精灵） | 血法师／法师 | Kael |
| luna | 月之骑士 | Luna Moonfang | Moon Rider | 暗夜精灵 | 女猎手／远程战士 | Luna |
| tb | 灵魂守卫 | Terrorblade；伊利丹为本作原型 | Terrorblade / SoulKeeper | 暗夜精灵 | 恶魔猎手 | TB |

## Kael 设计包（Current / Concept 资料）

Kael（运行 ID `kael`，召唤师／Invoker）已接入当前九名可玩英雄。用户确认的核心方向“被动从 Kael 的当前法术池中随机施放，主动重放最近一次被动随机出的法术”已写入 `game.js`：六项当前法术、5 秒被动轮转、`lastPassiveSpell` 记录和 35 法力／8 秒 Q 回响均可运行。Kael 前视、侧身各 9 张静态 SVG 运行帧已接入 `HERO_ART`／`HERO_POSE_ART`，造型已修正为金发尖耳、红金法袍的血精灵。标题使用带三球的独立头像，战斗使用无球动作帧并按对局时钟绘制头顶三球，详见[视觉设计](kael/视觉设计.md)；寒冰之触、幽灵漫步、灵动迅捷和阳炎冲击保留为历史候选，不属于当前法术规则。本目录的 [Kael 角色介绍](kael/角色介绍.md)、[技能设计](kael/技能设计.md) 和 [资源规划](kael/资源规划.md) 仍保留设计来源、法术边界和后续资源计划。

## Luna 设计包（Current / Concept 资料）

Luna（运行 ID `luna`，月之骑士／Moon Rider）已进入当前九名可玩英雄。主动“月蚀”在固定施法位置半径 430 内约 2.5 秒落下 10 道月光，每敌人最多两次命中，消耗 42 法力、基础冷却 18 秒；被动“月刃弹射”在 190 范围内最多追加两跳，按首次结算伤害的 70%／49% 结算。两张源图与 18 张静态姿态帧已制作并接入，月刃／月蚀战场效果由 Canvas 绘制，`skill-luna`／`luna-bounce` 使用 Web Audio 合成；本轮已接入选择、开战、主动、低生命、精英击杀和胜利短句。2026-10-27 已加入女猎手的两条经典短录音；其余缺项仍由合成回退，详见[声音系统](../core/声音系统.md)。本目录的 [Luna 角色介绍](luna/角色介绍.md)、[技能设计](luna/技能设计.md)、[视觉设计](luna/视觉设计.md) 和 [资源规划](luna/资源规划.md) 记录来源与边界。

Luna 的真实桌面短流程已核对标题选人、18 张姿态资源返回 200、100→58 法力、18 秒冷却、月蚀范围与预警、键盘／右键移动、空格冲刺和 Esc 暂停恢复。完整主题矩阵、手机全部动作、伤害链逐项实战计量与长局仍待验收；最新证据见[游戏 README](../../README.md)。

## 灵魂守卫设计包（Current：源码与资源）

灵魂守卫（`tb`／靈魂守衛／Terrorblade）是第九名可玩英雄，采用用户指定的伊利丹恶魔猎手原型，双刃近战与远程大恶魔由主动变身切换。主动持续 8 秒、消耗 40 法力、基础冷却 24 秒；被动每 6 次本人有效普攻生成持续 5 秒的魔影，最多 2 名，各追加 30% 未暴击原始普攻伤害。机制与组合规则见[灵魂守卫设计](../core/灵魂守卫设计.md)。

`../../static/dotarogue/assets/characters/tb/` 有 41 张普通皮肤 SVG：普通与恶魔形态各有前视、右向侧身源图，共 4 张；四组标准九姿态共 36 张静态运行帧；独立 `tb-portrait.svg` 保留为旧选人素材。统一采用 384×384 透明画布，前缀分别是 `tb-`、`tb-side-`、`tb-demon-`、`tb-demon-side-`。`python3 game/docs/sources/characters/tb/build_art.py` 可重生成普通皮肤；可选 DotA1 皮肤由 `dota1/geometry.py` 复制普通版四组完整姿态几何，仅调整配色与轮廓色后生成普通／恶魔共 36 帧。魔影使用当前所选皮肤与形态的半透明运行帧。九名英雄当前选人统一使用 `../../static/dotarogue/assets/art/dota1/heroes/` 的经典 PNG，来源见[图标记录](../sources/art/dota1/README.md)；2026-10-27 已加入恶魔猎手短录音及德鲁伊变熊音效映射，详见[声音系统](../core/声音系统.md)。

[角色介绍](tb/角色介绍.md)、[技能设计](tb/技能设计.md)、[视觉设计](tb/视觉设计.md)、[资源规划](tb/资源规划.md)分别记录身份、机制、美术与制作状态。源码接线和静态资源检查不等于自然对局通过；本轮真实入口、桌面及手机布局、两主题、操作与未覆盖项以[游戏 README](../../README.md)为准，完整装备组合和长局平衡仍需继续验证。

## 首图制作状态（Concept）

2026-10-11 已使用真实 Lanox Image2 任务生成五名英雄，均保留 1707×2560 原图、透明处理图和长边 128px／64px 预览；其中剑圣、刚背兽、炼金术士、矮人火枪手另有背景清理版。透明度由本地色键处理得到，不是接口原生透明输出。各角色记录有静态图像检查；用户首图审阅仍待进行。原有八名 SVG 角色的运行资源接线与短流程验证见下节。

[五名英雄 PNG 审阅拼版](../sources/characters/hero-concepts-v1-review.png)仅组合下表中的真实清理图与预览，不是额外的模型生成任务。

| 英雄 | 实际结果 | 当前审阅图与预览 | 提示词与任务记录 |
| --- | --- | --- | --- |
| 剑圣 · jugg | 已生成并检查，待用户审阅 | [原图](../sources/characters/jugg/art/concept/jugg-idle-v1-source.png)、[透明图](../sources/characters/jugg/art/concept/jugg-idle-v1-clean.png)、[128px](../sources/characters/jugg/art/concept/jugg-idle-v1-clean-128.png)、[64px](../sources/characters/jugg/art/concept/jugg-idle-v1-clean-64.png) | [提示词 / 记录](jugg/art/concept/jugg-idle-v1.prompt.md) |
| 刚背兽 · bulwark | 已生成并检查，待用户审阅 | [原图](../sources/characters/bulwark/art/concept/bulwark-idle-v1-source.png)、[透明图](../sources/characters/bulwark/art/concept/bulwark-idle-v1-clean.png)、[128px](../sources/characters/bulwark/art/concept/bulwark-idle-v1-clean-128.png)、[64px](../sources/characters/bulwark/art/concept/bulwark-idle-v1-clean-64.png) | [提示词 / 记录](bulwark/art/concept/bulwark-idle-v1.prompt.md) |
| 炼金术士 · scavenger | 已生成并检查，待用户审阅 | [原图](../sources/characters/scavenger/art/concept/scavenger-idle-v1-source.png)、[透明图](../sources/characters/scavenger/art/concept/scavenger-idle-v1-clean.png)、[128px](../sources/characters/scavenger/art/concept/scavenger-idle-v1-clean-128.png)、[64px](../sources/characters/scavenger/art/concept/scavenger-idle-v1-clean-64.png) | [提示词 / 记录](scavenger/art/concept/scavenger-idle-v1.prompt.md) |
| 矮人火枪手 · rover | 首次失败、恢复重试成功，待用户审阅 | [原图](../sources/characters/rover/art/concept/rover-idle-v1-source.png)、[透明图](../sources/characters/rover/art/concept/rover-idle-v1-clean.png)、[128px](../sources/characters/rover/art/concept/rover-idle-v1-clean-128.png)、[64px](../sources/characters/rover/art/concept/rover-idle-v1-clean-64.png) | [提示词 / 记录](rover/art/concept/rover-idle-v1.prompt.md) |
| 众神之王 · conductor | 四次 Lanox Image2 任务均失败、无 AI PNG；另绘前视与侧身 SVG，各 9 张静态动作帧已接入源码；本轮第一波侧身动作已核对 | [前视 SVG 源图](../sources/characters/conductor/art/source/conductor-hero.svg)、[侧身 SVG 源图](../sources/characters/conductor/art/source/conductor-side.svg)；无 AI PNG 或对应 128px／64px PNG 预览 | [旧提示词 / 四次失败记录](conductor/art/concept/conductor-idle-v1.prompt.md) |
| 影魔 · sf | 第三次获授权重试成功，已生成并检查，待用户审阅 | [原图](../sources/characters/sf/art/concept/sf-idle-v1-source.png)、[透明图](../sources/characters/sf/art/concept/sf-idle-v1.png)、[128px](../sources/characters/sf/art/concept/sf-idle-v1-128.png)、[64px](../sources/characters/sf/art/concept/sf-idle-v1-64.png) | [提示词](sf/art/concept/sf-idle-v1.prompt.md)、[制作记录](sf/art/concept/sf-idle-v1.production.md) |

众神之王的四次 AI 任务均返回 `model_service_unavailable`，服务未给出明确恢复时间；运行 SVG 是单独的代码绘制结果。五张 PNG 继续作为首轮造型参考，运行 SVG 以实机战斗尺寸为准。原有八英雄基础图与静态动作帧已另行制作；2026-10-27 声音改为经典短录音优先、Web Audio／Speech Synthesis 缺项回退；逐文件事实见[声音系统](../core/声音系统.md)。Concept 首图审阅与长局动作验收仍是独立工作。

## 当前源码接入与验证边界

`game.js` 的 `HERO_ART` 对原有八名英雄引用各自的前视 `game/static/dotarogue/assets/characters/<角色 ID>/<角色 ID>-idle-a.svg`；`HERO_POSE_ART` 为每人提供前视其余八张及 `side-idle-a`、`side-idle-alt`、`side-walk-a`、`side-walk-b`、`side-dash`、`side-attack-windup`、`side-attack`、`side-attack-release`、`side-skill` 九张侧身静态 SVG 路径。选定角色或开局时加载姿态，重复路径复用图片对象。游戏按移动和攻击方向选择前视或侧身，侧身左向由右向画稿镜像；再按待机与步行时间、冲刺、自动攻击三阶段和主动技能事件选帧。Canvas 不播放源图里的 SMIL；暂停时游戏时间停止。Luna 的源图与静态帧采用 384×384 方形骑乘构图，其余七名原有角色保持 2:3 比例；缺帧时回退到可用前视帧。原有八名英雄前视九帧由 `build_pose_frames.py` 生成，侧身九帧由 `build_side_pose_frames.py` 生成；灵魂守卫四组帧由独立的 `tb/build_art.py` 生成，详见上方角色条目。独立上下朝向和真实手机硬件动作验收尚未完成。

此前从 `games.html` 逐一进入六名英雄第一波的浏览器记录，曾核对 1440×900 桌面待机、攻击、技能和暂停，以及 390×844 竖屏、844×390 横屏的资源加载与触控布局。这些记录早于本轮前视精细源图恢复和侧身帧接入，不能作为新资源的浏览器验收。本轮从带版本参数的 `games.html` 进入六名英雄各自第一波，在桌面实际 Canvas 观察前视待机与侧身移动、侧身攻击蓄力／出手／收势和 Esc 暂停；炼金术士使用初版主题，其余五名使用像素风。独立 Chrome 移动触控环境在 390×844 与 844×390 从游戏选择页触摸进入火枪手第一波，摇杆左右移动时观察侧身步行、左右镜像和侧身攻击三阶段；两种视口均无水平溢出、页面错误或本地资源 4xx。横屏标题首屏在对齐修正后可见；无 JavaScript 的基础说明和返回链接已在独立环境检查。

八人的前视精细源图已恢复，前视动作帧重新生成；另为每人绘制独立右向侧身源图和九张侧身帧。86px 静态拼版已核对角色轮廓、脚点和侧身武器与手的层级。桌面六名原有英雄第一波及 Kael、Luna 桌面短流程、手机火枪手与 Luna 横竖屏仅是动作短流程；已记录流程之外的手机触控动作、每人两主题完整矩阵、完整技能动作流、长局和真实手机硬件仍未全量复核。

用户随后要求 AI／SVG 各制作一次以比较方法。已另存[剑圣 AI／SVG 对照](jugg/art/comparison/README.md)及[并排审阅图](../sources/characters/jugg/art/comparison/jugg-ai-vs-svg-review.png)：SVG 为本轮新绘，新 AI 任务和一次重试均失败，AI 一侧明确复用上一轮真实 PNG。该 SVG 对照由用户明确授权，保留原始来源和 Concept 边界。

## 每个角色目录

每个角色目录固定包含：

- 角色介绍.md：命名、种族、职业、定位和初始配置。
- 技能设计.md：一主动一被动的方案、数值起点、触发、冷却和表现。
- 台词.md：选择、开战、施法、低生命、击杀和结算台词。
- 音效设计.md：技能、被动、受击和台词声音的设计稿；运行声音由 `game/static/dotarogue/js/audio.js` 播放本地经典短录音，并保留合成回退；逐文件来源见 `game/docs/sources/audio/dota1/sources.json`。
- 视觉设计.md：角色原型、前视与侧身各 9 帧动作、基础攻击姿势、技能姿态和主动效果的资源记录。
- 资源规划.md：已接入资源、待补充音频和仍未覆盖的动作方向。

目录使用稳定运行 ID，避免改名破坏本地最佳记录。当前工作树已有九英雄源码；此前曾从游戏选择页进入六人第一波核对侧身动作，该记录不作为灵魂守卫的验证证据；后续变更仍须按对应角色、主题和入口复核实际表现。
