# 剑圣 · 全身待机概念图出图提示词

## 当前已授权的生成方式

使用现有本机 Lanox key 调用 Lanox Image2，模型 `lanox-image-2`，不等待内置 `image_gen`，不使用 SVG。此前工具不可用的记录仅为历史失败停点，已被本次用户授权替代。按 [角色图片创作流程.md](../../../../core/角色图片创作流程.md) 提交一张异步图片任务，记录任务 ID，已有任务只查询。

最终交付是真实生成图派生的透明 PNG。接口没有原生透明背景参数：提交时把背景改为纯平 `#FF00FF` 色键、无阴影或渐变，下载后用本机图像工具去背景；若实际已有有效 alpha 则直接保留。保留原始生成 PNG，再检查透明图与 128px／64px 预览。生成、背景处理和视觉验收各自按实际结果记录。


- 目标文件：`game/docs/sources/characters/jugg/art/concept/jugg-idle-v1-clean.png`（初版对照图仍保留为 `jugg-idle-v1.png`）
- 设计状态：Concept / 已生成待审阅
- 运行 ID：`jugg`
- 生成工具状态：已通过 Lanox Image2（模型 `lanox-image-2`，`3:4`、`2k`、`n=1`）完成真实任务 `imgtask_20261011550878452981`。源图和初版去色键图保留；经本地阈值清理的非破坏版本 `jugg-idle-v1-clean.png` 为当前选定图，PNG 已生成并完成原图、透明度与缩小预览检查。

## Prompt

```text
Use case: stylized-concept
Asset type: a single game character concept image for a small readable action-survivor character roster
Primary request: Create one full-body idle character illustration of **剑圣 / Yurnero / Juggernaut**, a powerful orc blademaster. This is a fresh, original hand-painted cartoon interpretation of the classic DotA1 / Warcraft III orc blademaster archetype; preserve green orc skin, a clearly visible face and lower tusks, a high topknot, a long single-edged sword and a back-mounted war banner, without copying any existing game asset.
Scene/backdrop: genuinely transparent background with no floor, no shadow plane, no environment, and no decorative particles; keep only the isolated character cutout.
Subject: a green-skinned orc warrior with a clearly visible expressive face and lower tusks, a tied high topknot, a strong compact athletic build, wrapped forearms, layered leather-and-cloth armor, a warm red-orange waist sash and cloth strips, sturdy boots, and a large long curved single-edged blade held forward and slightly downward in a ready stance. A compact red war banner is mounted on a narrow pole behind one shoulder; show both the pole and cloth clearly without hiding the head or sword. The tusks, topknot, sword and back banner must read clearly at thumbnail size and leave room for future leap-slash, landing and spinning-blade animation silhouettes.
Style/medium: refined 2D hand-painted cartoon game art with Kingdom Rush-like small-character readability, crisp dark contour lines, expressive but controlled shapes, exaggerated heroic proportions, a few grouped light-and-shadow planes, clean separated forms and polished miniature detail. Repaint all details from scratch; do not trace or reuse any existing asset.
Composition/framing: centered single character, complete head-to-toe silhouette, all sword and back-banner parts visible, slight three-quarter view from a mildly elevated angle, head toward the upper portion and feet toward the lower portion, blade angled across the body without clipping, a small even transparent margin around the outer silhouette including the sword tip, topknot, banner pole and cloth. Keep the idle pose grounded and alert: knees slightly bent, torso leaning subtly forward, shoulders square, sword hand leading, free hand balanced behind.
Lighting/mood: soft warm key light from upper left, restrained cool fill, readable edge highlights on the brow, tusks, bracers, blade and banner; confident, battle-ready, approachable rather than grim.
Color palette: saturated moss and emerald greens for skin, charcoal and iron gray for armor and bracers, muted tan leather, deep red-orange sash and banner, silver steel blade with a narrow cool highlight; high contrast between skin, leather, cloth and weapon.
Materials/textures: hand-painted brush texture kept clean at small size; matte leather and woven sash/banner cloth, restrained worn metal fittings, polished but battle-used steel, minimal controlled nicks and folds.
Text (verbatim): none.
Constraints: transparent RGBA output; preserve the full silhouette, complete sword and complete back-mounted war banner; keep the face and tusks visible; one character only; no cropped limbs, no hidden feet, no extra weapons, no companion, no background, no ground shadow, no frame, no border, no UI, no logo, no watermark, no lettering.
Avoid: photorealism, 3D render look, sci-fi robot parts, guns, firearms, modern clothing, excessive gore, extreme perspective distortion, tiny unreadable details, duplicate limbs, extra fingers, multiple characters, action blur, particle effects, opaque background, checkerboard pattern baked into the image.
```

## 输出与验收建议

- 实际生成规格：Lanox Image2 `3:4`、`2k`、`n=1`，源图尺寸 1707×2560 RGB；透明图和预览统一为 RGBA PNG。
- 生成后保留 `jugg-idle-v1-source.png` 与初版 `jugg-idle-v1.png`；当前选定的非破坏清理图为 `jugg-idle-v1-clean.png`，不覆盖前两者。
- 已检查原图、透明图和清理图：头到脚完整，长曲刃与背部战旗完整可见，绿皮兽人、可见脸部、獠牙、高发髻和红布带辨识明确；清理版使用本地色键阈值处理，画布边缘无残留 alpha 灰点。
- 已生成并查看 `jugg-idle-v1-clean-128.png` 与 `jugg-idle-v1-clean-64.png`；缩小后深色轮廓、绿色皮肤、长刀和背部战旗仍可辨识。PNG 仍为 Concept，尚未接入当前游戏。
