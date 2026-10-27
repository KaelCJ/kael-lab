# 众神之王 · 全身待机概念图 v1

## 当前已授权的生成方式

使用现有本机 Lanox key 调用 Lanox Image2，模型 `lanox-image-2`，不等待内置 `image_gen`，不使用 SVG。此前工具不可用的记录仅为历史失败停点，已被本次用户授权替代。按 [角色图片创作流程.md](../../../../core/角色图片创作流程.md) 提交一张异步图片任务，记录任务 ID，已有任务只查询。

最终交付是真实生成图派生的透明 PNG。接口没有原生透明背景参数：提交时把背景改为纯平 `#FF00FF` 色键、无阴影或渐变，下载后用本机图像工具去背景；若实际已有有效 alpha 则直接保留。保留原始生成 PNG，再检查透明图与 128px／64px 预览。生成、背景处理和视觉验收各自按实际结果记录。


## 生成状态

- 当时目标文件（任务失败，未产生）：`game/characters/conductor/art/concept/conductor-idle-v1.png`
- 目标格式：PNG，真正透明背景（保留 alpha）
- 生成方式：Lanox Image2，模型 `lanox-image-2`；当前任务已明确失败，未生成图片
- 预览目标：生成后检查原图、128px 和 64px 缩小图的轮廓可读性

## 实际任务记录

- 任务 ID：`imgtask_20261011995081116284`
- 提交状态：`queued`
- 后续查询状态：`failed`
- 服务错误：`code=model_service_unavailable`；`message=模型服务暂时不可用，请稍后再试。`
- 一次性恢复重试任务 ID：`imgtask_20261011241557941608`
- 恢复重试状态：`queued` → `processing` → `failed`
- 恢复重试错误：`code=model_service_unavailable`；`message=模型服务暂时不可用，请稍后再试。`；HTTP 200，未返回 `Retry-After`。
- 本次再次重试任务 ID：`imgtask_20261011655061089603`
- 本次再次重试状态：`queued` → `processing` → `failed`
- 本次再次重试错误：`code=model_service_unavailable`；`message=模型服务暂时不可用，请稍后再试。`；只读 GET HTTP 200。
- 本次第三次重试任务 ID：`imgtask_20261011522642207466`
- 本次第三次重试状态：`queued` → `processing` → `failed`
- 本次第三次重试错误：`code=model_service_unavailable`；`message=模型服务暂时不可用，请稍后再试。`；只读 GET HTTP 200。
- 原始生成 PNG：未保存
- 去色键透明 PNG：未生成；本地 alpha 后处理未执行
- 128px／64px 预览：未生成、未查看
- 处理边界：本次第三次重试失败后不再自动创建后续任务；未写入凭据或原始接口响应内容。

## 最终提示词

```text
Use case: stylized-concept
Asset type: standalone game character concept art, later usable as a small in-game character reference
Primary request: Create one original full-body idle character illustration for the fantasy survival game character “众神之王”, runtime ID conductor. Show a dwarf Mountain King / warrior inspired by the broad heroic silhouette of the DotA1 Zeus reference and the Warcraft III Mountain King avatar / thunder-god archetype, with the identity of Zeus / Lord of Olympia expressed through lightning and commanding presence. This is a new public game asset; use those references only for high-level identity, redraw all details from scratch, and do not reproduce any existing game asset.
Input images: none
Scene/backdrop: genuinely transparent background with clean alpha; no floor, scenery, particles detached from the character, frame, card, or backdrop
Subject: one squat, broad-shouldered adult dwarf warrior, full body from head to boots, centered with a small even margin. Thick flowing dark beard with a few cool blue-white electric highlights, strong brow, compact powerful limbs, heavy metal shoulder armor and chest armor, layered belt and bracers, sturdy boots, small carved stone accents, and a clearly readable short war hammer held in one hand. Blue-white lightning crawls around the hammer head, beard tips, armor seams, and a restrained static field close to the body. The lightning should support the silhouette and never hide the face, hands, hammer, or feet.
Style/medium: refined 2D hand-painted cartoon game character, crisp dark contour lines, expressive but compact proportions, polished Kingdom Rush-like small-character readability without copying its characters, monsters, UI, or assets; a few grouped light and shadow planes, deliberate material separation between steel, leather, stone, hair, and electricity; hand-drawn finish rather than pixel art, 3D render, photorealism, or a sci-fi robot.
Composition/framing: slight top-down three-quarter view, head near the upper portion and feet toward the lower portion, standing idle with a grounded heroic stance and hammer visible. Show the complete body and the complete weapon, with no cropping at the hair, beard, shoulders, hammer, hands, boots, or lightning edges. Single character only, no collage, no action sheet, no alternate poses.
Lighting/mood: cool moonlit rim light from the lightning, controlled warm steel highlights, confident storm-bringer mood; enough value contrast that the beard, shoulder armor, hammer silhouette, and boots remain distinct at 128px and 64px.
Color palette: deep charcoal and muted steel, warm brass accents, stone gray, electric cyan and blue-white lightning, tiny restrained violet notes; keep the face and weapon readable against transparency.
Materials/textures: simplified hand-painted metal planes, worn leather, rough stone insets, dense beard strands grouped into readable shapes, clean stylized lightning arcs with a few branching sparks; avoid noisy micro-detail that disappears when reduced.
Text (verbatim): none
Constraints: transparent background must remain genuinely transparent; one centered full-body dwarf warrior; preserve clear head-to-feet silhouette; preserve complete hammer and all limbs; original public-game artwork; no copied model, texture, pose sheet, or logo; leave a small transparent margin around the silhouette.
Avoid: text, title, labels, UI, border, card frame, watermark, signature, background scenery, ground shadow, extra characters, duplicate limbs, cropped body, hidden hammer, hidden feet, oversized effects, excessive glow, photorealism, 3D modeling, anime proportions, modern firearms, cybernetics, robot parts, space suit, generic human wizard, tall slender elf, or a separate lightning creature.
```

## 生成后核验清单

1. 确认 PNG alpha 为真正透明，边缘没有白底或棋盘格烘焙。
2. 确认从头发、胡须到靴底完整入画，锤头、锤柄和双手没有被裁切或闪电遮挡。
3. 确认矮人山丘之王／战士身份可由矮壮体态、浓密胡须、金属护甲和锤状武器辨识，雷电只作职业强化。
4. 导出或查看 128px 与 64px 预览，检查胡须、肩甲、锤子和蓝白雷光仍能形成清楚剪影。
5. 检查没有文字、UI、水印、额外角色或非透明背景。

四次 Lanox Image2 任务均已明确失败，因此以上核验尚未执行，目标 PNG 及其派生预览均未生成；本角色不再自动创建后续任务。
