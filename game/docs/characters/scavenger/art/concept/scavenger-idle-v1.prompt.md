# 炼金术士待机 Concept 出图提示词

## 当前已授权的生成方式

使用现有本机 Lanox key 调用 Lanox Image2，模型 `lanox-image-2`，不等待内置 `image_gen`，不使用 SVG。此前工具不可用的记录仅为历史失败停点，已被本次用户授权替代。按 [角色图片创作流程.md](../../../../core/角色图片创作流程.md) 提交一张异步图片任务，记录任务 ID，已有任务只查询。

最终交付是真实生成图派生的透明 PNG。接口没有原生透明背景参数：提交时把背景改为纯平 `#FF00FF` 色键、无阴影或渐变，下载后用本机图像工具去背景；若实际已有有效 alpha 则直接保留。保留原始生成 PNG，再检查透明图与 128px／64px 预览。生成、背景处理和视觉验收各自按实际结果记录。


> 状态：已生成 Concept / 待用户审阅（2026-10-11）
> 目标文件：`game/docs/sources/characters/scavenger/art/concept/scavenger-idle-v1.png`
> 预期类型：透明背景 PNG，全身单角色待机图
> 生成工具：Lanox Image2，模型 `lanox-image-2`；原图经本地色键去除后保存透明 PNG。

## 本轮生成记录

- 任务 ID：`imgtask_20261011573493755621`
- 模型：`lanox-image-2`
- 参数：`aspect_ratio=3:4`、`resolution=2k`、`n=1`
- 原始生成图：[scavenger-idle-v1-source.png](../../../../sources/characters/scavenger/art/concept/scavenger-idle-v1-source.png)
- 初版色键透明图（保留）：[scavenger-idle-v1.png](../../../../sources/characters/scavenger/art/concept/scavenger-idle-v1.png)
- 选用审阅图（clean）：[scavenger-idle-v1-clean.png](../../../../sources/characters/scavenger/art/concept/scavenger-idle-v1-clean.png)
- 选用缩小预览（长边 128／64）：[scavenger-idle-v1-clean-128.png](../../../../sources/characters/scavenger/art/concept/scavenger-idle-v1-clean-128.png)、[scavenger-idle-v1-clean-64.png](../../../../sources/characters/scavenger/art/concept/scavenger-idle-v1-clean-64.png)
- 保留的明确宽度中间预览：[scavenger-idle-v1-clean-width128.png](../../../../sources/characters/scavenger/art/concept/scavenger-idle-v1-clean-width128.png)、[scavenger-idle-v1-clean-width64.png](../../../../sources/characters/scavenger/art/concept/scavenger-idle-v1-clean-width64.png)
- 原始尺寸：1707×2560；原图为 RGB 色键背景，接口未提供原生透明参数。
- alpha 处理：本地 `chroma` 去除 `#FF00FF` 色键；初版透明图保留原始边缘，另以最大 alpha 连通主体清理孤立背景残留，选用 clean 图为 RGBA。

## 主提示词

```text
Use case: stylized-concept
Asset type: a small game character concept PNG for an original static web survival roguelite
Primary request: create one complete, full-body idle character illustration for “炼金术士”, a goblin alchemist riding with or clinging to a large ogre partner as one controllable hero. The goblin and ogre must read clearly as a single two-person character combination, with the goblin as the active alchemist and the ogre as the strong supporting body.
Scene/backdrop: genuinely transparent background, no ground plane, no scenery, no shadow blob, and a small even margin around the silhouette.
Subject: a small green goblin inventor perched on the shoulder/back harness of a broad, muscular ogre. The goblin wears round protective goggles, a practical alchemist coat or apron, a belt of glass vials, a chemical backpack/tank with tubes, and carries a readable throwing bottle or compact alchemy tool. The ogre has large expressive features, thick arms, a heavy harness and protective plates that support the goblin, with visible muscle mass and a stable grounded stance. Keep the pair facing slightly toward the viewer in a three-quarter pose.
Style/medium: refined 2D hand-painted cartoon game art, close to the small-scale readability and polish of Kingdom Rush, but fully original and without copying any game asset. Clear dark ink-like contour, clean silhouette, restrained grouped shading, hand-painted material accents, expressive faces, strong profession and weapon readability at small sizes.
Composition/framing: centered single character, slight three-quarter top-down view, head at the top and feet/lower body at the bottom, entire goblin, entire ogre body, harness, bottles, backpack/tank, and throwing tool visible. Keep the silhouette compact and readable when reduced to 128px and 64px. No crop and no overlapping edge cut-off.
Lighting/mood: warm neutral studio light with a subtle cool highlight on glass and metal, adventurous and mischievous but sturdy, readable separation between goblin and ogre.
Color palette: goblin greens and brass, smoky teal glass, amber chemical liquid, muted leather and steel, deep ogre browns/gray-greens, small acid-green accents reserved for alchemy.
Materials/textures: hand-painted leather, worn metal, translucent glass bottles, strapped chemical canister, rough ogre skin, cloth apron, simple tool details; use a few clear highlight shapes instead of noisy texture.
Text (verbatim): ""
Constraints: one independent character illustration only; preserve transparent alpha; show a complete goblin-and-ogre pair as one hero; retain the DotA1 Alchemist prototype cues of Razzil Darkbrew without reproducing any existing game asset; make profession, bottles, chemical tank, goggles, tool, and ogre mass immediately identifiable; no sci-fi robot replacement; no extra characters.
Avoid: text, labels, logos, UI, watermark, frame, background, scenery, cast shadow, duplicate limbs, extra heads, detached goblin, detached ogre, separate companion icon, cropped feet, cropped bottles, hidden weapon, photorealism, 3D render, pixel art, anime proportions, overly complex small details, copied or traced game artwork.
```

## 生成后验收

1. 文件为真正带 alpha 的 PNG，背景像素透明，不用白底或棋盘格烘焙。
2. 画面只含一个完整的炼金术士组合：地精与食人魔都可见，并且通过骑乘／背负／护具关系读成一个可操控角色。
3. 全身、脚或下身、玻璃药瓶、化学背罐、护目镜和投掷工具均未被裁切。
4. 以 128px 与 64px 预览检查：地精头部、食人魔大块肌肉、瓶罐和职业轮廓仍能辨认。
5. 无文字、UI、水印、额外角色或现成游戏资产痕迹。

## 本轮查看结果

- 原图和透明图均完整显示地精与大型食人魔，骑乘／背负关系清楚；地精头部、护目镜、化学背罐、玻璃药瓶、投掷瓶和食人魔双脚均未裁切。
- 初版透明图的 alpha 统计为透明 1,971,072、半透明 38,905、全不透明 2,359,943 像素；外框存在孤立低 alpha 残留，因此保留初版并另存 clean。
- clean 图 alpha 连通组件为单一主体，透明 1,974,658、半透明 35,319、全不透明 2,359,943 像素；浅色底和深色底查看均未见灰点或色键残边。
- 选用的长边预览为 85×128 与 43×64；128px 仍能辨认地精、食人魔、背罐和瓶子，64px 细节明显压缩但双人剪影、绿色地精头部和大型食人魔体块仍可辨认。
- 已查看原图、初版透明图、clean 图、两张长边预览及浅／深底复合图；未发现文字、UI、水印或额外角色。
