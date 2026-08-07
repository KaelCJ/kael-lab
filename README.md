# Kael Lab

人与 Agent 共同工作的公开方法、工程实践与交互实验场。

首版采用零依赖纯静态实现：

- `index.html`：站点内容与语义结构。
- `styles.css`：响应式视觉系统。
- `app.js`：Meepo 概念操作台与“证据和判断”交互实验。
- `404.html`：静态托管失败页。

## 本地预览

在仓库根目录运行任意静态服务器，例如：

```bash
python -m http.server 8080
```

然后访问 `http://localhost:8080/`。

## 公开边界

- 本仓库只保存公开派生内容，不镜像任何内部知识库或项目文档。
- Meepo 区域明确区分 `Current`、`Concept` 和 `Roadmap`。
- 首版没有服务端、账号、统计、评论、私密 API Key 或第三方 CDN。
- 浏览器实验成绩只保存在访问者当前设备的 LocalStorage 中。

## License

首版暂未授予通用开源或内容再许可；仓库公开可见不等于内容获得额外许可。
