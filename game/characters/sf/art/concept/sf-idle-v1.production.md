# 影魔 · sf-idle-v1 制作记录

## 任务

- 状态：`saved`（第三次用户明确授权的 retry2 成功；前两次服务失败后未再自动创建）
- 首次 task_id：`imgtask_20261011225431348990`（`model_service_unavailable`）
- retry1 task_id：`imgtask_20261011588413452715`（`model_service_unavailable`）
- retry2 task_id：`imgtask_20261011223704532685`（成功）
- 模型：`lanox-image-2`
- 参数：`aspect_ratio=3:4`、`resolution=2k`、`n=1`
- 幂等：retry2 使用稳定幂等键；没有再创建后续任务

## 产物与 alpha

- 原始 Lanox PNG：`game/characters/sf/art/concept/sf-idle-v1-source.png`
- 透明成品 PNG：`game/characters/sf/art/concept/sf-idle-v1.png`
- 128px 预览：`game/characters/sf/art/concept/sf-idle-v1-128.png`（实际尺寸 85×128）
- 64px 预览：`game/characters/sf/art/concept/sf-idle-v1-64.png`（实际尺寸 43×64）
- 本地 alpha 方式：从纯色键原图重新处理，使用 `auto-key=corners`、soft matte、透明阈值 48、完全不透明阈值 112、despill；没有把 SVG 或程序绘图当作角色图。
- 最终透明图尺寸：1707×2560；alpha 统计为透明 2,515,400、半透明 472,399、不透明 1,382,121；非透明包围盒 `[135,48,1601,2509]`；四角 alpha 均为 0；可见像素中无色键洋红残留。

## 已查看结果

- 原始图：单独一名完整全身待机的黑紫／暗红魂焰元素，纯色键背景；头部、胸口魂核、双手长爪、肩部魂焰和下半身黑焰均在画布内。
- 透明图：去除背景后轮廓完整，无文字、UI、水印或额外角色；影魔身份清楚，读作火焰领主／收魂者而非科幻机器人。自然武器是双手爪焰，未要求额外刀剑。
- 128px 预览：保留火焰冠、胸口亮核、双侧爪焰和黑焰下身，缩小后仍可辨。
- 64px 预览：细节合并但整体威胁剪影、胸口亮点和双侧火焰仍可辨；预览边缘低 alpha 噪声已清零。

## 边界

本记录中的 PNG 首图仍是 Concept，未作为当前运行图直接接入；角色的 SVG 源图、9 张静态动作帧、基础攻击和技能姿态已在当前游戏接入。后续多方向动作、台词和音效另行继续。本记录不包含凭据、响应原文或内部服务路径。
