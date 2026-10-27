# 剑圣 · AI 与 SVG 制作方式对照

> Concept / 待用户审阅，尚未接入游戏。

[并排审阅图](../../../../sources/characters/jugg/art/comparison/jugg-ai-vs-svg-review.png)左侧为上一轮真实 Lanox Image2 图片，右侧为本轮独立编写的 SVG。两边统一背景与可见主体高度，等比例缩放，保留各自头身比例；下方为 128px／64px 实际尺寸预览。

本轮新 AI 任务和一次恢复重试均失败，未产生新的 PNG。因此当前是同一角色原型的作品对照，不能称为两张都按本轮相同提示词制作，也不能用它判断两种方式的能力上限。

## 实际产物

| 产物 | 来源与状态 |
| --- | --- |
| [AI 透明图](../../../../sources/characters/jugg/art/concept/jugg-idle-v1-clean.png) | 上一轮 Lanox Image2 的真实结果，1707×2560 RGBA；保留[生成源图](../../../../sources/characters/jugg/art/concept/jugg-idle-v1-source.png)和[提示词／任务记录](../concept/jugg-idle-v1.prompt.md)，本轮不覆盖。透明度来自本地去色键与背景清理。 |
| [SVG 原文件](../../../../sources/characters/jugg/art/comparison/jugg-svg-v1.svg) | 本轮从空白独立绘制，512×768，原生透明；121 个路径／圆形、4 个渐变，未嵌入或描摹 AI 位图。见[制作记录](jugg-svg-v1.production.md)。 |
| [SVG 渲染 PNG](../../../../sources/characters/jugg/art/comparison/jugg-svg-v1.png) | Chrome 从真实静态资源入口渲染 SVG 的透明截图，512×768；属于 SVG 派生图。 |
| [AI 128px](../../../../sources/characters/jugg/art/comparison/jugg-ai-reference-128.png)／[64px](../../../../sources/characters/jugg/art/comparison/jugg-ai-reference-64.png) | 上一轮 AI 透明图的本轮缩小预览，明确以 `reference` 命名。 |
| [SVG 128px](../../../../sources/characters/jugg/art/comparison/jugg-svg-v1-128.png)／[64px](../../../../sources/characters/jugg/art/comparison/jugg-svg-v1-64.png) | 本轮 SVG 渲染图的等比例缩小预览。 |
| [并排审阅图](../../../../sources/characters/jugg/art/comparison/jugg-ai-vs-svg-review.png) | 1200×1250 PNG，组合上述两张实际作品，不是模型生成任务。 |

预览以有效 alpha 边界裁掉外围空白，再等比例放入 128×128 或 64×64 透明画布。每边至少预留画布边长的 1/16，保证两者展示尺度一致，不拉伸角色；原图保持不变。大图的有效主体高度均为 570px，包含背旗杆尖到双脚。

## 本轮 AI 执行结果

使用现有本机凭据提交真实 Lanox Image2 异步任务，模型 `lanox-image-2`、`3:4`、`2k`、`n=1`。本轮[共同造型题目](comparison-brief-v1.md)、[AI 提示词](jugg-ai-v1.prompt.md)及[实际提交文本](../../../../sources/characters/jugg/art/comparison/jugg-ai-v1.submitted.txt)均保留；没有将上一轮产物登记为这两个任务的结果。

| 请求 | 任务 ID | 最终状态 |
| --- | --- | --- |
| 首次 | `imgtask_20261011275605068520` | `failed`，`model_service_unavailable`，无 PNG |
| 一次恢复重试 | `imgtask_20261011827211325349` | `failed`，`model_service_unavailable`，无 PNG |

两次查询均返回“模型服务暂时不可用，请稍后再试”。本轮没有创建第三个任务，也没有为失败任务伪造图片。左图的真实成功任务是上一轮的 `imgtask_20261011550878452981`。

## 看图观察

- AI 版的脸部、肌肉、布料和金属层次丰富，整体比例较高。缩到 64px 后，绿皮、红旗和长刀仍可辨，许多面部与护甲细节已合并。
- 本例 SVG 版采用较大头部、较短身体、清楚外轮廓和简化色块，小图中脸和职业轮廓更突出；材质与体积表现较简。每个路径可单独调整，改色与局部修改直接。
- 小尺寸可读性的差异同时受头身比例、细节数量与绘制方式影响。SVG 是矢量描述格式，可以绘制复杂图案；PNG 是位图格式，也可以承载简洁卡通，不能把本例的画风归因于格式本身。

已查看大图、透明边缘及 128px／64px 预览；SVG 已从本地静态 HTTP 入口在 Chrome 实际渲染。此处只记录素材检查，没有执行游戏端到端流程：这些 Concept 图片尚无运行消费者。

本组 SVG 由用户“ai作图一次, 再用svg作图一次,我想看下对比”的明确要求授权，仅用于本次对照；其他英雄首图仍按[角色图片创作流程](../../../../core/角色图片创作流程.md)使用 Lanox Image2。
