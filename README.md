# Kael Lab

人与 Agent 共同工作的公开 AI Center，以及独立的网页游戏空间。两个方向共用一个可由 GitHub Pages 直接发布的静态仓库。

## 方向与入口

| 方向 | 公开入口 | 仓库内上下文 |
| --- | --- | --- |
| 人机协作 / AI Center | `index.html`，再进入 Kael、Meepo、Jugg/Nest、Lanox、帮助中心与 Workspace Assistant | 本 README 与根目录 `AGENTS.md` |
| 网页游戏 | `games.html` 游戏选择页；首款《星核幸存者》在 `game/index.html` | `game/README.md` 与 `game/AGENTS.md` |

README 记录可从当前文件核对的实现与入口；AGENTS 记录后续 Agent 的稳定工作边界。它们是回源导航，不代替当前代码、页面或运行验证。

AI Center 采用零依赖纯静态实现：

- `index.html`、`css/styles.css`、`js/app.js`：Kael、Meepo、Jugg/Nest、Lanox 四生态首页，六类角色帮助入口、协作方法和 Evidence Lab。
- `css/shared/ecosystem.css`、`js/shared/ecosystem.js`：四个产品空间共享的 Lanox 视觉语言、架构/演讲双视图、三主题、Inspector 与键盘翻页；共享资源的消费者和边界见 `css/shared/README.md`。
- `kael/`：人机协作总循环、工作项上下文、任务内增益与跨任务判断升级。
- `meepo/`：组合根、产品 Agent、公共 Framework 与 Nest 候选能力的当前模块视图。
- `nest/`：Jugg/Nest 业务伴生治理、五类支撑、六层资产与知识产品候选核心。
- `help/`：自包含同源帮助包；包含帮助中心、产品需求、架构方案、研发实施、测试证据、完整流程与领导看板六个独立交互页，并保留工作项、Nest 知识库和 Codex Workbench 快速指引。
- `lanox/`：不含内部实现上下文的 Lanox 公共品牌、六层架构与产品方向。
- `workspace-assistant.html`：Workspace Assistant 多角色、多场景产品 Concept Mock。
- `css/workspace-assistant.css`、`js/workspace-assistant.js`：Mock 的独立样式和浏览器内状态机。
- `games.html`、`css/games.css`：游戏选择页；给以后新增的游戏保留独立入口。
- `game/`：首款原创网页生存肉鸽《星核幸存者》，支持桌面和手机横竖屏游玩；页面、素材和设计资料在 `game/`，样式和脚本分别在 `css/game/`、`js/game/`。实现、玩法和验证入口见 `game/README.md`。
- `favicon.svg`：站点与游戏共享的公开矢量图标，保留根路径以兼容浏览器默认图标请求。
- `404.html`：静态托管失败页。

## 目录约定

- 根目录保留 HTML 物理入口和部署文件；页面地址不因资源整理改变。
- `css/`、`js/` 按站点、共享、帮助和游戏所有权归档前端资源；只有稳定且有多个真实消费者的机制才进入 `shared` 子目录。
- `help/`、`game/` 和各生态目录分别维护自己的 HTML、素材与设计资料；对应 CSS/JavaScript 在 `css/`、`js/` 下按所有权归档。
- `.agents/`、`.claude/`、`.codex/`、`.workspace-assistant/`、`.idea/` 和 `.playwright-mcp/` 属于协作工具、开发环境或生成的验证产物，不属于站点交付资源。
- `dota/` 是独立资料目录，不与当前页面资源耦合。

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
- 游戏页面的“支持开发”入口只跳转到外部爱发电主页；本站不处理支付、账号、订单或游戏内购买权益。
- 浏览器实验成绩只保存在访问者当前设备的 LocalStorage 中。
- 游戏借鉴生存肉鸽玩法，角色视觉以 Warcraft III／DotA1 原型为参考；当前运行图由本仓库重新绘制，不是相关作品的官方移植。游戏设置与记录保存在当前浏览器的 LocalStorage 中。

## License

首版暂未授予通用开源或内容再许可；仓库公开可见不等于内容获得额外许可。
