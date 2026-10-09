# Kael Lab

人与 Agent 共同工作的公开 AI Center，以及独立的网页游戏空间。两个方向共用一个可由 GitHub Pages 直接发布的静态仓库。

## 方向与入口

| 方向 | 公开入口 | 仓库内上下文 |
| --- | --- | --- |
| 人机协作 / AI Center | `index.html`，再进入 Kael、Meepo、Jugg/Nest、Lanox、帮助中心与 Workspace Assistant | 本 README 与根目录 `AGENTS.md` |
| 网页游戏 | `games.html` 游戏选择页；首款《星核幸存者》在 `game/index.html` | `game/README.md` 与 `game/AGENTS.md` |

README 记录可从当前文件核对的实现与入口；AGENTS 记录后续 Agent 的稳定工作边界。它们是回源导航，不代替当前代码、页面或运行验证。

AI Center 采用零依赖纯静态实现：

- `index.html`、`styles.css`、`app.js`：Kael、Meepo、Jugg/Nest、Lanox 四生态首页，六类角色帮助入口、协作方法和 Evidence Lab。
- `ecosystem.css`、`ecosystem.js`：四个产品空间共享的 Lanox 视觉语言、架构/演讲双视图、三主题、Inspector 与键盘翻页。
- `kael/`：人机协作总循环、工作项上下文、任务内增益与跨任务判断升级。
- `meepo/`：组合根、产品 Agent、公共 Framework 与 Nest 候选能力的当前模块视图。
- `nest/`：Jugg/Nest 业务伴生治理、五类支撑、六层资产与知识产品候选核心。
- `help/`：自包含同源帮助包；包含帮助中心、产品需求、架构方案、研发实施、测试证据、完整流程与领导看板六个独立交互页，并保留工作项、Nest 知识库和 Codex Workbench 快速指引。
- `lanox/`：不含内部实现上下文的 Lanox 公共品牌、六层架构与产品方向。
- `workspace-assistant.html`：Workspace Assistant 多角色、多场景产品 Concept Mock。
- `workspace-assistant.css`、`workspace-assistant.js`：Mock 的独立样式和浏览器内状态机。
- `games.html`、`games.css`：游戏选择页；给以后新增的游戏保留独立入口。
- `game/`：首款原创网页生存肉鸽《星核幸存者》，支持桌面和手机横竖屏游玩。实现、玩法和验证入口见 `game/README.md`。
- `favicon.svg`：站点与游戏共享的公开矢量图标。
- `404.html`：静态托管失败页。

## 本地预览

在仓库根目录运行任意静态服务器，例如：

```bash
python -m http.server 4173
```

然后访问 `http://localhost:4173/` 查看 AI Center，或访问 `http://localhost:4173/games.html` 选择游戏。

## 公开边界

- 本仓库只保存公开派生内容，不镜像任何内部知识库或项目文档。
- 页面明确区分 `Public Method`、`Concept Mock` 和 `Demo Data`。
- 四个产品空间进一步区分 `Current`、`Building`、`Candidate` 与 `Direction`，架构节点和演讲分镜都是公开静态表达。
- Workspace Assistant 只使用脱敏模拟数据，不连接真实工作区、模型、Codex 或 API。
- 帮助页中的人物、工作项、进度、贡献、运行和测试记录全部是固定演示数据，不代表真实组织状态或人员绩效。
- 首版没有服务端、账号、统计、评论、私密 API Key 或第三方 CDN。
- 浏览器实验成绩只保存在访问者当前设备的 LocalStorage 中。
- 游戏使用原创名称、视觉和内容，借鉴生存肉鸽玩法；不是《土豆兄弟》或其 DLC 的官方移植。游戏设置与记录保存在当前浏览器的 LocalStorage 中。

## License

首版暂未授予通用开源或内容再许可；仓库公开可见不等于内容获得额外许可。
