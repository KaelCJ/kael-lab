# Kael Lab

人与 Agent 共同工作的公开 AI Center、方法体系与交互实验场。

首版采用零依赖纯静态实现：

- `index.html`：AI Center 总看板、人机协作方法和公开实验入口。
- `styles.css`：AI Center 首页响应式视觉系统。
- `app.js`：能力地图与“证据和判断”交互实验。
- `workspace-assistant.html`：Workspace Assistant 多角色、多场景产品 Concept Mock。
- `workspace-assistant.css`、`workspace-assistant.js`：Mock 的独立样式和浏览器内状态机。
- `404.html`：静态托管失败页。

## 本地预览

在仓库根目录运行任意静态服务器，例如：

```bash
python -m http.server 8080
```

然后访问 `http://localhost:8080/`。

## 公开边界

- 本仓库只保存公开派生内容，不镜像任何内部知识库或项目文档。
- 页面明确区分 `Public Method`、`Concept Mock` 和 `Demo Data`。
- Workspace Assistant 只使用脱敏模拟数据，不连接真实工作区、模型、Codex 或 API。
- 首版没有服务端、账号、统计、评论、私密 API Key 或第三方 CDN。
- 浏览器实验成绩只保存在访问者当前设备的 LocalStorage 中。

## License

首版暂未授予通用开源或内容再许可；仓库公开可见不等于内容获得额外许可。
