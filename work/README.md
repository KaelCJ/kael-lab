# Work · 工作与人机协作空间

本目录聚合 Kael Lab 的工作方向。正式内容只维护在这里；根地址仍进入工作首页，没有新增“工作／游戏总门户”。所有页面是公开静态内容，沿用根目录的安全、能力状态和 GitHub Pages 边界。

## 正式入口

| 内容 | 入口 |
| --- | --- |
| 工作首页、四生态导航与 Evidence Lab | [index.html](index.html) |
| 面向首次访问者的独立新首页预览 | [start.html](start.html) |
| Kael · 人机协作 | [kael/index.html](kael/index.html) |
| Meepo · Agent 产品实践 | [meepo/index.html](meepo/index.html) |
| Jugg / Nest · 工程与知识 | [nest/index.html](nest/index.html) |
| Lanox · 品牌与产品方向 | [lanox/index.html](lanox/index.html) |
| 帮助中心与六类角色帮助 | [help/index.html](help/index.html) |
| Workspace Assistant 概念演示 | [workspace-assistant.html](workspace-assistant.html) |
| 游戏选择（独立方向） | [../games.html](../games.html) |

正式 CSS／JS 继续位于根目录 `static/`；不在 `work/` 复制第二套资源，也不变更现有浏览器 LocalStorage 的键。页面路径变化不改变同源存储的归属。

## 独立新首页

`start.html` 面向不熟悉技术的首次访问者，围绕“人和 Agent 可替换、同一个工作项可接手、方法与事实随项延续”讲解公开协作方法。页面用合成 `W-DEMO-024` 展示查重、建立、形成方案、交接、执行、验证与结果回写，并说明工作项如何成为看板汇总与知识沉淀的事实基础；它是单独的首页预览，根首页跳转和原 `index.html` 继续保留，现有页面与导航不改指向。新页不接入旧工作首页或完整流程帮助；“继续了解”区域的四个主题入口暂留，供本轮 review。

样式由 `static/css/work/start.css` 单独拥有，使用本地展示排版；正文和交互标签沿用前端规则的文本角色尺度，不改变原站主题。页面不加载 JavaScript、统计或外部资源，示例以原生 `details` 展开，关闭 JavaScript 后仍能完整阅读。人/Agent 可替换、同一工作项接手、方法引用与结果回写均为公开方法和固定 `Concept` 演示，不是实际 Agent 运行、检查报告或跨工具自动交接能力证明；图形直接以 HTML／SVG 表达，没有外部素材。

页面把工作项表达为最小可追踪事实单元：个人、项目、组织、企业看板是同一事实源的不同观察视图，不维护第二份状态；知识库只接收有来源、经人确认、经过场景验证并写清适用边界的可复用结论。真实聚合、权限、跨项目看板和知识库服务仍属于 Concept／Roadmap，不是本页当前能力。

预览 `http://localhost:4173/work/start.html`；同时验证项目子路径 `/kael-lab/work/start.html`。检查桌面和手机上的首屏、全部正文、四个展开步骤、键盘焦点、锚点、继续了解区域、控制台和资源请求，并在禁用 JavaScript 后重新走完案例。页面只有一个浅色展示主题，无模型连接、任务输入、登录、加载或执行成功状态。运行根目录静态路径检查；浏览器证据放入 `.playwright-mcp/`，其他本机验证日志放入根 `.logs/`，不提交本机证据。

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
