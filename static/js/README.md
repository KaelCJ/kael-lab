# Shared JavaScript resources

这里记录 Kael Lab 跨页面共用、没有页面业务状态的 JavaScript 资源及其当前契约。

## `analytics.js` · `site-analytics.v1`

- **所有者**：站点根目录；源码为 `static/js/analytics.js`。
- **职责**：初始化浏览器内 `dataLayer`，排队 Google Analytics 4 的 `js` 与 `config` 事件，并异步加载 `gtag.js`。Measurement ID 为 `G-FVG65R5M0D`。
- **不负责**：页面业务状态、界面内容、登录、Cookie 同意流程、服务端数据或任何站点功能。统计脚本加载失败时，页面仍应可读和可操作。
- **当前消费者**：根目录的 `games.html`、`404.html`；`work/index.html`、`work/workspace-assistant.html`；`work/kael/`、`work/meepo/`、`work/nest/`、`work/lanox/` 四个生态页；`work/help/` 下七个帮助页；`game/index.html`、`game/equipment.html` 与 `game/effects.html`。设计工作台不在本次统计接入范围。
- **接入方式**：消费者各引用一次相对路径：根目录用 `static/js/analytics.js`，一级目录用 `../static/js/analytics.js`，工作空间的二级页面用 `../../static/js/analytics.js`。不向同一页面添加第二个 Google 代码。根首页兼容页不加载统计，避免跳转前后重复统计。
- **变更门槛**：修改文件路径、Measurement ID 或初始化协议时，必须同步全部消费者并重新检查真实页面、静态资源路径、控制台错误和 Google Analytics 4 Realtime 数据；`.tmp/artifacts/` 下的本地预览 HTML 不属于当前消费者。
