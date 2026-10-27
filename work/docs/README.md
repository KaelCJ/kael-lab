# Work · 工作与人机协作空间

本目录保存工作方向的协作说明；正式页面与专属资源位于 `../static/`。根 `index.html` 是全站首页，先提供工作、休闲、生活三个方向，进入工作后再从 `work/static/` 继续浏览。所有页面是公开静态内容，沿用根目录的安全、能力状态和 GitHub Pages 边界。

## 正式入口

| 内容 | 入口 |
| --- | --- |
| 工作首页、方法叙事与轻量入口 | [index.html](../static/index.html) |
| 工作方法预览 | [start.html](../static/start.html) |
| Kael · 人机协作 | [kael/index.html](../static/kael/index.html) |
| Meepo · Agent 产品实践 | [meepo/index.html](../static/meepo/index.html) |
| Jugg / Nest · 工程与知识 | [nest/index.html](../static/nest/index.html) |
| Lanox · 品牌与产品方向 | [lanox/index.html](../static/lanox/index.html) |
| 帮助中心与六类角色帮助 | [help/index.html](../static/help/index.html) |
| Workspace Assistant 概念演示 | [workspace-assistant.html](../static/workspace-assistant.html) |
| 游戏选择（独立方向） | [游戏选择](../../game/static/index.html) |

正式 HTML、CSS、JavaScript 按所有者归档；工作页面位于 `work/static/`，工作专属资源由 `work/static/css/` 与 `work/static/js/` 所有。不变更现有浏览器 LocalStorage 的键。页面路径变化不改变同源存储的归属。

## 工作方法预览

`work/static/start.html` 面向不熟悉技术的首次访问者，围绕“人和 Agent 可替换、同一个工作项可接手、方法与事实随项延续”讲解公开协作方法。页面用合成 `W-DEMO-024` 展示查重、建立、形成方案、交接、执行、验证与结果回写，并说明工作项如何成为看板汇总与知识沉淀的事实基础；它是工作分区内的独立方法预览。工作首页先讲清楚“为什么做”和三条原则，再用轻量入口连接四个主题空间、帮助中心、方法预览与休闲方向。

样式由 `work/static/css/start.css` 单独拥有，使用本地展示排版；正文和交互标签沿用前端规则的文本角色尺度，不改变原站主题。页面不加载 JavaScript、统计或外部资源，示例以原生 `details` 展开，关闭 JavaScript 后仍能完整阅读。人/Agent 可替换、同一工作项接手、方法引用与结果回写均为公开方法和固定 `Concept` 演示，不是实际 Agent 运行、检查报告或跨工具自动交接能力证明；图形直接以 HTML／SVG 表达，没有外部素材。

页面把工作项表达为最小可追踪事实单元：个人、项目、组织、企业看板是同一事实源的不同观察视图，不维护第二份状态；知识库只接收有来源、经人确认、经过场景验证并写清适用边界的可复用结论。真实聚合、权限、跨项目看板和知识库服务仍属于 Concept／Roadmap，不是本页当前能力。

预览 `http://localhost:4173/work/static/start.html`；同时验证项目子路径 `/kael-lab/work/static/start.html`。检查桌面和手机上的首屏、全部正文、四个展开步骤、键盘焦点、锚点、继续了解区域、控制台和资源请求，并在禁用 JavaScript 后重新走完案例。页面只有一个浅色展示主题，无模型连接、任务输入、登录、加载或执行成功状态。运行根目录静态路径检查；浏览器证据放入 `.playwright-mcp/`，其他本机验证日志放入 `.tmp/<任务或用途>/`，不提交本机证据。

## 根入口与旧地址边界

根目录的 HTML 只保留 `index.html` 作为全站入口；休闲选择页位于 `game/static/index.html`，工作分区规范入口位于 `work/static/index.html`。工作页面和专属资源统一归档在 `work/static/`，不再从根目录或旧目录提供业务 HTML；不保留旧链接、跳转页或兼容目录。

- 根首页当前使用 `shared/static/css/home.css` 与 `shared/static/js/home.js`，不依赖统计、服务端或运行时构建；它把工作链接到 `work/static/`，把休闲链接到 `game/static/index.html`，生活只显示建设中主题。
- `game/static/index.html` 的返回首页链接回到根首页；工作页内的游戏入口使用 `../../game/static/index.html`。`shared/static/404.html` 是可直接访问的失败说明页；子目录位置不构成 GitHub Pages 根级自定义 404 接线。
- 使用相对路径，兼容站点根部署与 GitHub Pages 项目子路径；根首页和本目录页面都必须在禁用 JavaScript 时保持正文与主要入口可读。不要重新建立已删除的旧兼容目录。


## 修改与验证

1. 在 `work/static/` 修改正式工作页面，不在根目录恢复旧业务页或非根兼容层。
2. 保留页面内部相对关系；工作首页引用 `css/styles.css`，帮助页使用 `../css/help/…`、`../js/help/…`，工作首页访问游戏用 `../../game/static/index.html`。共享资源从工作首页用 `../../shared/static/…`，四生态及帮助页用 `../../../shared/static/…`；解析规则见 [共享目录约定](../../shared/docs/README.md)。
3. 从仓库根目录运行静态路径检查和回归测试：

```bash
python -B -X utf8 scripts/check_static_paths.py
```

```bash
python -B -X utf8 -m unittest discover -s scripts -p "test_*.py"
```

4. 迁移后重新实际检查桌面／手机的正式页面、键盘操作、控制台与禁用 JavaScript 的内容；从根首页进入工作和休闲入口，核对生活建设说明、返回导航与游戏选择入口。还要模拟项目子路径，不以本机根路径通过代替。

DotA 英雄与装备资料属于 `../../game/docs/dota/`，不在工作空间维护。未验证的能力仍按 Current／Concept／Roadmap 分开表述。
