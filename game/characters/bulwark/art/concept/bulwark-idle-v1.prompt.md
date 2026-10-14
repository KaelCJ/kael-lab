# 刚背兽 · 第一张待机概念图出图提示词

## 当前已授权的生成方式

使用现有本机 Lanox key 调用 Lanox Image2，模型 `lanox-image-2`，不等待内置 `image_gen`，不使用 SVG。此前工具不可用的记录仅为历史失败停点，已被本次用户授权替代。按 [角色图片创作流程.md](../../../../core/角色图片创作流程.md) 提交一张异步图片任务，记录任务 ID，已有任务只查询。

最终交付是真实生成图派生的透明 PNG。接口没有原生透明背景参数：提交时把背景改为纯平 `#FF00FF` 色键、无阴影或渐变，下载后用本机图像工具去背景；若实际已有有效 alpha 则直接保留。保留原始生成 PNG，再检查透明图与 128px／64px 预览。生成、背景处理和视觉验收各自按实际结果记录。


> 状态：Concept / 首图已生成、待用户审阅；真实任务 ID `imgtask_20261011271800193698`。

## 目标与回源

- 角色：刚背兽；Rigwarl / Bristleback；运行 ID `bulwark`。
- 身份：中立（野猪人）／野猪人战士（设计候选），按 [英雄.md](../../../../dota/英雄.md) 回源。
- 第一阶段：精致 2D 手绘卡通小角色，参考 Kingdom Rush 的小尺寸辨识与表现，覆盖此前先画 32×32 像素 SVG 的方案。
- 交付：单独角色、完整全身、待机姿态、真正透明背景 PNG；作为美术 Concept 供用户审阅。
- 已保存：原图 `bulwark-idle-v1-source.png`，初次透明图 `bulwark-idle-v1.png`；所选审阅版为 `bulwark-idle-v1-clean.png`，均与本提示词同目录且保留所有版本。

## 实际提交提示词

[bulwark-idle-v1.lanox-prompt.txt](bulwark-idle-v1.lanox-prompt.txt) 保存本次实际发送的完整文本，背景已转换为纯平 `#FF00FF` 色键，SHA-256 为 `4b5b44ac40404039d28a4096ded55229f9a1773a2d899489a87efebfd0404bd4`。真实调用采用 `lanox-image-2`、3:4、2k、n=1，最终透明度由本地去背景实现。

## 美术目标提示词（提交时转换背景）

```text
Use case: stylized-concept
Asset type: one full-body idle character concept PNG for a small 2D fantasy survival game; a standalone character asset for art review, not a sprite sheet.
Primary request: Create a freshly drawn interpretation of 刚背兽, Rigwarl / Bristleback, grounded in the recognizable DotA 1 quillboar warrior archetype.
Scene/backdrop: genuinely transparent background with an alpha channel, no scenery, no floor, no pedestal, no background color and no painted checkerboard.
Subject: one powerful, stocky anthropomorphic wild boar warrior. A recognizable boar snout, prominent curved ivory tusks, small animal ears, thick muscular forearms, stout legs and broad heavy shoulders. The defining feature is a massive thick back covered in dense natural bristles and projecting quills, forming a bold, clearly separated spiny outer silhouette. The quills grow from the back; they are not metal armor, a carried shield or a mechanical attachment. This back must visually support rear damage resistance and an eventual active quill spray.
Style/medium: refined 2D hand-painted fantasy cartoon, with the clarity and lively small-character proportions associated with Kingdom Rush. Clear dark outlines, exaggerated but powerful body proportions, restrained grouped highlights and shadows, clean shape separation, polished readable forms rather than tiny noisy details. Create new artwork; do not crop, trace or reuse existing game assets.
Composition/framing: one centered character, slightly top-down three-quarter view. Turn the torso enough to show most of the broad quilled back, while turning the head so the boar face and tusks remain recognizable. Head stays above the torso and both feet remain below. A stable, relaxed but battle-ready idle stance, both feet planted and arms resting naturally. Keep the entire body, all tusks, quill tips, hands and feet inside the frame, with a small transparent margin around the outer silhouette. No close-up or pure rear view.
Color/materials: natural earthy boar hide and fur, darker bristles, ivory tusks and sparing worn leather details. Separate face, limbs and quill masses using a few readable color and value groups; avoid full plate armor that hides the creature identity.
Equipment: do not invent an extra hand-held weapon for this first concept. The boar anatomy and natural back quills carry the combat identity. Do not import the old science-fiction rotary blade or any robotic equipment.
Small-size readability: prioritize the combined silhouette of boar face, heavy body and thick spiny back. Tusks and major quill groups must remain distinguishable at 128px and 64px. Keep fine texture subordinate to the large shapes.
Text: none.
Constraints: exactly one character; full body; all anatomy complete; true transparent PNG; no text, UI, watermark, logo, labels, frame, action sheet or collage. Preserve the DotA 1 quillboar identity while freshly drawing every visual detail.
Avoid: science-fiction robot, ordinary pig, generic porcupine, orc, minotaur, slender human knight, full metal armor, hidden face, clipped tusks or quills, extra limbs, duplicated character, glowing effects, flying quills, attack pose, dense photorealistic fur, pixel art, 3D render, opaque background or fake transparency.
```

## 生成与验收状态

历史准备阶段：2026-10-11 首轮未提供内置 `image_gen`，当时没有发起图片调用或创建 PNG。该停点已被用户明确授权的 Lanox Image2 路线替代。

当前实际状态：真实任务 `imgtask_20261011271800193698` 已完成并下载；只创建一项并持续查询同一任务，没有重复创建或使用程序绘制角色替代。原图为 RGB、1707×2560；请求的 aspect_ratio 为 3:4，服务实际返回画布约为 2:3，原始画面未裁切。

本地处理：先对 #FF00FF 色键使用 soft matte 和 despill，保存初次透明图；像素检查发现画布边角有少量灰色半透明残留。随后仅将原图中 `min(R,B)-G >= 128` 的强洋红背景像素 alpha 清零，另存 clean 版。清除了 45,382 个背景残留像素，原先不透明的角色像素未改。所选图 alpha=0 的像素为 2,085,138，部分透明为 14,873，不透明为 2,269,909；四条画布边界均完全透明。

已用 view_image 查看原始图、初次透明图、clean 版和各自 128px／64px 预览。野猪脸、獠牙、粗壮兽躯与厚背刚毛可辨，手脚与主要尖端完整，无文字或水印。64px 下细毛、眼睛、皮带等合并；视角俯视感较弱，少数尖端有极细的偏黄绿／暗色边线。原图、透明图及缩小图检查不代表已完成真实游戏接入验证。

所选 PNG：[bulwark-idle-v1-clean.png](bulwark-idle-v1-clean.png)；预览：[128px](bulwark-idle-v1-clean-128.png)、[64px](bulwark-idle-v1-clean-64.png)。图片仍为 Concept，待用户审阅；动作、声音及技能实现未在本轮推进。

本次使用已获授权的现有 Lanox API 路线，不再等待内置 image_gen 或重复询问 API 许可。
