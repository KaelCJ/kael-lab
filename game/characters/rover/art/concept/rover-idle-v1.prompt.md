# 矮人火枪手 · 第一张全身待机图提示词

## 当前已授权的生成方式

使用已授权的本机 Lanox 凭据调用 Lanox Image2，模型 `lanox-image-2`，不使用 SVG。此前等待内置 `image_gen` 的停点已被授权替代。首次任务 `imgtask_20261011645098073021` 因 `model_service_unavailable` 失败；获一次同模型恢复授权后，任务 `imgtask_20261011808164693245` 成功返回 PNG。两次请求参数均为 3:4／2k／n=1，美术提示词保持一致。

最终交付是真实生成图派生的透明 PNG。接口没有原生透明背景参数：提交时把背景改为纯平 `#FF00FF` 色键、无阴影或渐变，下载后用本机图像工具去背景；若实际已有有效 alpha 则直接保留。保留原始生成 PNG，再检查透明图与 128px／64px 预览。生成、背景处理和视觉验收各自按实际结果记录。

本次[实际提交提示词](rover-idle-v1.submitted.txt)已单独保存，包含竖幅与色键背景适配。下面的代码块保存基础美术目标，不应当作未经适配的实发请求。源图与自动色键版均保留；当前选定[rover-idle-v1-clean.png](rover-idle-v1-clean.png)，仅补充清理自动版的背景 alpha 残留，未重绘角色。


> 状态：Concept / 已生成、静态图已检查、待用户审阅。
> 执行记录：2026-10-11，恢复任务成功；透明为本地色键派生，已查看全身／武器、浅深底、外框 alpha 和 128px／64px 预览，尚未接入游戏。

## 交付规格

- 角色：矮人火枪手；运行 ID `rover`；Kardel Sharpeye / Dwarven Sniper；人族（矮人）／火枪手，回源 [英雄.md](../../../../dota/英雄.md)。
- 第一阶段：精致 2D 手绘卡通单角色全身待机图，参考 Kingdom Rush 的小尺寸辨识与表现方法；细节重新绘制。
- 当前选定文件：`rover-idle-v1-clean.png`，保留真实 alpha；原始生成 `rover-idle-v1-source.png` 和自动透明 `rover-idle-v1.png` 均保留。
- 实际尺寸：1707×2560，约 2:3；与请求 3:4 不一致，保留完整原画面。预览最长边 128px／64px，分别为 85×128／43×64。
- 图像用途：先展示供用户审阅的美术 Concept；尚未接入游戏。
- 提示词输入：下方基础目标经已保存的实发文本适配，无原游戏截图、模型或贴图输入。

## 基础美术目标提示词

```text
Use case: stylized-concept
Asset type: one full-body idle-pose character PNG concept for a small 2D fantasy survival game, readable at 128px and 64px.

Scene/backdrop: genuinely transparent background with an alpha channel. One isolated character only, no environment, ground plane, display pedestal, cast shadow on a background, or painted checkerboard.

Subject: a dwarven rifleman, based on the recognizable dwarf-and-rifle archetype of DotA1's Kardel Sharpeye / Dwarven Sniper. A short, stocky, powerful dwarf with very broad shoulders, short sturdy legs, a large head, a dense prominent beard, and a clearly readable face. The beard must remain visible as a strong shape. He holds one long-barreled fantasy rifle naturally in both hands across his body in a calm, alert idle stance. Show the complete wooden stock, mechanism, long metal barrel and muzzle. Keep the barrel readable in silhouette rather than foreshortened toward the camera. Both hands grip the same rifle convincingly. Clothing, metal armor pieces and leather details form clear layers.

Style/medium: refined 2D hand-painted cartoon game art with the polished miniature-character readability associated with Kingdom Rush. Clean dark outer outlines, exaggerated but powerful body proportions, a few broad light and shadow groups, and crisp separated material shapes. Freshly redraw the character's clothing, equipment and details; do not extract, trace or reuse an existing game asset. Preserve the classic fantasy dwarf rifleman identity.

Composition/framing: a slightly elevated three-quarter view. Keep the character upright with the head above the torso and the feet below. Center the complete character and the complete rifle on a square canvas with a small clear margin on every side. Show the top of the head, both boots, both hands, rifle stock and muzzle without clipping. Keep the legs and feet distinct and avoid hiding the beard behind the rifle. This is one independent character illustration, not a portrait crop, lineup, collage, sprite sheet or animation sheet.

Lighting/materials: controlled hand-painted shading. Group beard, clothing, wood and metal into distinct broad color masses. Use restrained metal highlights and simple cloth shadows, without dense filigree, tiny noisy details or dramatic effects that weaken the silhouette.

Constraints: a viewer must immediately recognize a stocky dwarf carrying a long rifle after reduction to 64px. Full-body idle pose; all weapons fully visible; true transparent PNG; no text, letters, logos, UI, border or watermark.

Avoid: pixel art, 32x32 pixel-grid rendering, photorealism, 3D rendering, a science-fiction robot, modern tactical equipment, a short-barreled blaster, human-height slender proportions, baby-like chibi proportions, extra characters, extra weapons, muzzle flash, smoke, projectiles, skill effects, missing or duplicate limbs, cropped boots, cropped muzzle, opaque background, or a fake transparency checkerboard.
```

## 已执行检查与后续审阅

已实际查看原图、自动透明版、清理版、128px／64px 和浅深底图；全身与长枪完整，小尺寸胡须与火枪仍可辨。清理版外框 alpha 为 0，未见明显光晕、断边或内部误挖空。视角俯视较轻、细节偏立绘，深底衣摆对比稍弱；这些实际特点留待用户审阅。

- [128px 预览](rover-idle-v1-clean-128.png)与[64px 预览](rover-idle-v1-clean-64.png)供缩小辨识审阅。
- [浅底](rover-idle-v1-clean-review-light.png)与[深底](rover-idle-v1-clean-review-dark.png)仅为检查派生图。
- 用户审阅、游戏接入与动态战斗验证尚未完成。
