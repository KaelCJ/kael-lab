# Work · 工作与人机协作空间

本目录聚合 Kael Lab 的工作方向。正式内容只维护在这里；根地址仍进入工作首页，没有新增“工作／游戏总门户”。所有页面是公开静态内容，沿用根目录的安全、能力状态和 GitHub Pages 边界。

## 正式入口

| 内容 | 入口 |
| --- | --- |
| 工作首页、四生态导航与 Evidence Lab | [index.html](index.html) |
| Kael · 人机协作 | [kael/index.html](kael/index.html) |
| Meepo · Agent 产品实践 | [meepo/index.html](meepo/index.html) |
| Jugg / Nest · 工程与知识 | [nest/index.html](nest/index.html) |
| Lanox · 品牌与产品方向 | [lanox/index.html](lanox/index.html) |
| 帮助中心与六类角色帮助 | [help/index.html](help/index.html) |
| Workspace Assistant 概念演示 | [workspace-assistant.html](workspace-assistant.html) |
| 游戏选择（独立方向） | [../games.html](../games.html) |

正式 CSS／JS 继续位于根目录 `static/`；不在 `work/` 复制第二套资源，也不变更现有浏览器 LocalStorage 的键。页面路径变化不改变同源存储的归属。

## 根入口与旧地址边界

根目录业务入口只保留 `index.html` 与 `games.html`。用户明确不再保留其他旧地址；外层四生态目录、`help/` 和 `workspace-assistant.html` 已移除，直接使用本目录的正式入口。

- 根 `index.html` 支持 JavaScript 时通过 `../static/js/redirect.js` 转入工作首页，保留查询参数和锚点；不会把 query 中的 URL 用作跳转目标。
- 没有 JavaScript 或跳转脚本未加载时，根首页保留标题、说明、可键盘访问的新地址链接；无脚本链接只保证到达工作首页，不自动携带旧 query／hash。
- 根首页声明 canonical、`noindex, follow`，不加载统计或完整业务脚本；正常内容页沿用原有统计。
- `games.html` 保持现有游戏选择页，它的返回首页链接继续经根入口进入工作首页。`404.html` 属于部署辅助文件，不是业务兼容页。
- 使用相对路径，兼容站点根部署与 GitHub Pages 项目子路径，不依赖服务端重定向或构建。不要重新建立已删除的旧兼容目录。

## 修改与验证

1. 在本目录修改正式页面，不在根目录恢复旧业务页或非根兼容层。
2. 保留页面内部相对关系；二级页面引用共享资源时使用 `../../static/…`，工作首页访问游戏用 `../games.html`。
3. 从仓库根目录运行静态路径检查和回归测试：

```bash
python -B -X utf8 scripts/check_static_paths.py
```

```bash
python -B -X utf8 -m unittest discover -s scripts -p "test_*.py"
```

```bash
node --test scripts/test_redirect.js
```

4. 实际检查桌面／手机的正式页面、键盘操作、控制台与禁用 JavaScript 的内容；从根首页进入并核对 query／hash，直接访问帮助 topic，并检查返回导航与游戏选择入口。还要模拟项目子路径，不以本机根路径通过代替。

DotA 英雄与装备资料属于 `../game/dota/`，不在工作空间维护。未验证的能力仍按 Current／Concept／Roadmap 分开表述。
