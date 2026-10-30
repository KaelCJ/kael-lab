# 经典装备本体抠图

2026-10-29 按用户确认的方向，从已有经典装备图标提取装备本体，供角色周围的成品展示使用。正式输出为 `game/static/dotarogue/assets/art/dota1/equipment-cutouts/` 下的 22 张 64×64 透明 PNG；商店、HUD、暂停与图鉴继续使用原有方形图标。后续按用户反馈将运行绘制尺寸整体缩小一档，素材本身尺寸与像素不变。

## 来源与处理

输入逐件来自相邻 `equipment/` 运行目录的已有 PNG，原图来源、映射及第三方权利状态继承[原始图标清单](../README.md)与[原始 manifest](../manifest.json)。这些派生文件仍是第三方美术的抠图，不标为本仓库原创，也不改变原素材的许可状态；本次没有引入新的外部图片。

`masks.json` 保存原图坐标中的逐件外轮廓与内部空洞。`build_cutouts.py` 用四倍采样生成抗锯齿 alpha，去掉方形边框和背景，再将本体居中到透明画布；RGB 保留源图像素，不调色、不缩放、不生成或重绘装备。源图原本切出画面的部分保持切边，不补画未出现的结构；魔龙之心保留原图的粉色发光形体。源图、输出路径、边界及 SHA-256 见本目录 `manifest.json`。

蝴蝶使用原图中的绿色武器，分身斧使用原图中的蓝色斧头。陨星锤的来源图是 Inferno 陨石，没有可抠出的锤体，因此不在本批 22 张中，继续保留原 Canvas 锤体。

## 重生成与消费

需要 Python 3 与 Pillow。路径由脚本位置解析，不依赖执行目录：

```sh
python3 -B -X utf8 game/docs/sources/art/dota1/equipment-cutouts/build_cutouts.py
```

`--output-root <目录>` 可输出到独立审阅目录；正式输出默认归静态素材目录，清单保存在本来源目录，浏览器不需要 Python 或运行时构建。

`js/effects/equipment-evolution.js` 按装备 ID 缓存加载图片，供游戏角色的前后层和工作台 iframe 共用；分身斧派生飞弹也复用同图。普通／DotA1 角色皮肤及工作台像素／初版使用相同抠图，现有位置、动作时钟与前景裁剪继续生效。高阶主体保持原图，武器及宝物以小幅错开的同源副本区分；分身斧沿用原有数量，鞋类沿用脚边位置。加载中或缺图时回退原 Canvas 造型。

素材检查、工作台观察与自然获取的实战验收分开记录，以[游戏 README](../../../../../README.md)为准。本轮临时蒙版草稿、接触表与重生成对照保留在 `.tmp/equipment-cutouts-20261029/`，浏览器截图保留在 `.playwright-mcp/equipment-cutouts-20261029/`，检查和验证记录归 `.logs/actual-test/equipment-cutouts-20261029/`；均不提交，不清理其他任务产物。
