# Shared JavaScript resources

这里记录 Kael Lab 跨页面共用、没有页面业务状态的 JavaScript 资源及其当前契约。

## `analytics.js` · `site-analytics.v1`

- **所有者**：站点根目录；源码为 `js/analytics.js`。
- **职责**：初始化浏览器内 `dataLayer`，排队 Google Analytics 4 的 `js` 与 `config` 事件，并异步加载 `gtag.js`。Measurement ID 为 `G-FVG65R5M0D`。
- **不负责**：页面业务状态、界面内容、登录、Cookie 同意流程、服务端数据或任何站点功能。统计脚本加载失败时，页面仍应可读和可操作。
- **当前消费者**：根目录的 `index.html`、`games.html`、`workspace-assistant.html`、`404.html`；`kael/`、`meepo/`、`nest/`、`lanox/` 四个生态页；`help/` 下七个帮助页；`game/index.html` 与 `game/equipment.html`。
- **接入方式**：每个当前可发布 HTML 在 `<head>` 的第一个子节点引用一次相对路径：根目录用 `js/analytics.js`，一级子目录用 `../js/analytics.js`。不向同一页面添加第二个 Google 代码。
- **变更门槛**：修改文件路径、Measurement ID 或初始化协议时，必须同步全部消费者并重新检查真实页面、静态资源路径、控制台错误和 Google Analytics 4 Realtime 数据；`artifacts/` 下的预览 HTML 不属于当前消费者。

