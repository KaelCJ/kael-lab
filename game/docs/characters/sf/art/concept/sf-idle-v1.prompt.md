# 影魔 · sf-idle-v1 出图提示词

## 当前已授权的生成方式

使用现有本机 Lanox key 调用 Lanox Image2，模型 `lanox-image-2`，不等待内置 `image_gen`，不使用 SVG。此前工具不可用的记录仅为历史失败停点，已被本次用户授权替代。按 [角色图片创作流程.md](../../../../core/角色图片创作流程.md) 提交一张异步图片任务，记录任务 ID，已有任务只查询。

最终交付是真实生成图派生的透明 PNG。接口没有原生透明背景参数：提交时把背景改为纯平 `#FF00FF` 色键、无阴影或渐变，下载后用本机图像工具去背景；若实际已有有效 alpha 则直接保留。保留原始生成 PNG，再检查透明图与 128px／64px 预览。生成、背景处理和视觉验收各自按实际结果记录。


> 目标文件：`game/docs/sources/characters/sf/art/concept/sf-idle-v1.png`
> 生成状态：Lanox Image2 retry2 已成功；原始图已下载，透明 PNG 使用本地色键去除并已完成 128px／64px 预览检查。

## Reusable generation prompt

Use case: stylized-concept
Asset type: full-body game character concept PNG for a small readable action-survival game

Primary request: Create one original full-body idle character illustration of 影魔, the Shadow Fiend / Nevermore archetype, as a polished small game character concept. Use the dark flame lord silhouette associated with a classic DotA1-style fire elemental as loose public reference only; redraw every detail from scratch and do not copy any existing game asset.

Scene/backdrop: genuinely transparent background with clean alpha around the character; no environment, floor, glow plate, card frame, or cast shadow outside the character. Leave a small even margin around the complete silhouette.

Subject: a single intimidating shadow-fire elemental humanoid, broad shoulders, compact powerful torso, long hooked claws, angular horn-like flame crown, dark charcoal-black body that dissolves into black flame and drifting soul-smoke below the waist, dark red fissures under the surface, a clearly visible ember-red soul core in the chest, and several restrained burning soul wisps around the shoulders and claw hands. The character must read as a fire lord / soul collector rather than a robot, armored soldier, demon animal, or human wizard. The lower body gradually becomes black flame and smoky soul vapor; keep the full silhouette readable.

Pose and camera: complete head-to-toe idle stance, centered alone, slightly elevated three-quarter view, head above and lower body below, torso turned subtly three quarters, both hands and all claws visible, chest core facing the viewer, feet / flame base fully inside the canvas. Calm threatening idle posture with arms slightly open as if gathering souls; no attack lunge and no cropped body parts. Keep the character upright for later game use.

Style/medium: refined 2D hand-painted cartoon illustration with a clear deep-dark outline, Kingdom Rush-like small game character readability, exaggerated but forceful proportions, crisp silhouette, selective highlights, and a few grouped shadow planes. Use painterly brush texture inside shapes but keep edges clean enough to remain legible at 128px and 64px. Original fantasy game art; no photorealism, no 3D render, no pixel-art grid.

Lighting/mood: controlled rim light from the soul fire, subtle red-orange internal glow from cracks and chest core, cool violet-black shadow masses, dramatic but economical contrast. The glow must stay attached to the character and preserve transparent pixels outside it.

Color palette: charcoal black, near-black violet, deep plum, muted ember red, restrained crimson-orange soul fire, tiny warm gold highlights only where needed. Keep the majority of the silhouette dark with red fissures and soul-fire accents as recognition points.

Materials/textures: scorched elemental surface, cracked obsidian-like shadow flesh, soft smoke and flame transitions, sharp claw tips, small floating soul embers. No metallic armor plates, no firearm, no sword, no shield, no cape that hides the hands, and no extra props.

Identity anchors: visible chest soul core for 收魂, long claw hands, shoulder soul flames, and outward-pointing soul wisps that can later support 魂之挽歌. Preserve a distinctive threatening silhouette at thumbnail scale.

Composition: one character only, centered, full body, all weapons / natural weapons visible, no duplicate limbs, no cropped flames, no cut-off smoke, no side characters, no collage, no turnaround sheet, no action strip.

Text (verbatim): "" (no text in the image)

Constraints: transparent PNG output; complete silhouette and all claw hands visible; original redraw; suitable as a Concept asset and not a claim of current game implementation; no logo, no UI, no border, no card frame, no watermark, no signature.

Avoid: copied DotA / Warcraft / Kingdom Rush assets, recognizable existing character model, sci-fi robot features, mechanical joints, guns, modern clothing, armor-heavy knight design, skull mask, animal head, extra characters, background scenery, opaque white background, checkerboard painted into the image, text, lettering, symbols, watermark, cropped head, cropped feet, missing hands, excessive bloom, noisy micro-detail, muddy silhouette, flat generic black blob, pixel art, photorealism, 3D CGI.

## Output review checklist

- Confirm PNG has real transparent alpha outside the character, not a painted checkerboard or solid background.
- Confirm the head, chest core, both claw hands, full lower black-flame body, and every soul wisp intended as part of the silhouette are inside the canvas.
- Confirm the character reads as 影魔 / Shadow Fiend archetype: black flame elemental, red fissures, chest soul core, claws, soul fire; not a robot or generic armored demon.
- Inspect the original-size image, then create temporary 128px and 64px previews for readability review. Keep the final source at the requested project path and do not replace it with the previews.



