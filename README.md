# Kael Lab

人与 Agent 共同工作的公开 AI Center、方法体系与交互实验场。

站点采用零依赖纯静态实现：

- `index.html`、`styles.css`、`app.js`：Kael、Meepo、Jugg/Nest、Lanox 四生态首页，三类帮助入口、协作方法和 Evidence Lab。
- `ecosystem.css`、`ecosystem.js`：四个产品空间共享的 Lanox 视觉语言、架构/演讲双视图、三主题、Inspector 与键盘翻页。
- `kael/`：人机协作总循环、工作项上下文、任务内增益与跨任务判断升级。
- `meepo/`：组合根、产品 Agent、公共 Framework 与 Nest 候选能力的当前模块视图。
- `nest/`：Jugg/Nest 业务伴生治理、五类支撑、六层资产与知识产品候选核心。
- `help/`：人机协作、Nest 知识库、Codex Workbench 的自包含同源帮助包。
- `lanox/`：不含内部实现上下文的 Lanox 公共品牌、六层架构与产品方向。
- `workspace-assistant.html`：Workspace Assistant 多角色、多场景产品 Concept Mock。
- `workspace-assistant.css`、`workspace-assistant.js`：Mock 的独立样式和浏览器内状态机。
- `404.html`：静态托管失败页。

## 本地预览

在仓库根目录运行任意静态服务器，例如：

```bash
python -m http.server 4173
```

然后访问 `http://localhost:4173/`。

## 公开边界

- 本仓库只保存公开派生内容，不镜像任何内部知识库或项目文档。
- 页面明确区分 `Public Method`、`Concept Mock` 和 `Demo Data`。
- 四个产品空间进一步区分 `Current`、`Building`、`Candidate` 与 `Direction`，架构节点和演讲分镜都是公开静态表达。
- Workspace Assistant 只使用脱敏模拟数据，不连接真实工作区、模型、Codex 或 API。
- 首版没有服务端、账号、统计、评论、私密 API Key 或第三方 CDN。
- 浏览器实验成绩只保存在访问者当前设备的 LocalStorage 中。

## License

首版暂未授予通用开源或内容再许可；仓库公开可见不等于内容获得额外许可。
