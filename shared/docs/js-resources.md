# Shared JavaScript resources

这里记录 Kael Lab 跨页面共用、没有页面业务状态的 JavaScript 资源及其当前契约。

## `analytics.js` · `site-analytics.v1`

- **所有者**：共享模块；源码为 `shared/static/js/analytics.js`。
- **职责**：初始化浏览器内 `dataLayer`，排队 Google Analytics 4 的 `js` 与 `config` 事件，并异步加载 `gtag.js`。Measurement ID 为 `G-FVG65R5M0D`。
- **边界**：不维护页面业务状态、界面内容、登录、Cookie 同意流程或服务端数据。统计脚本加载失败时，页面仍应可读和可操作。
- **当前消费者**：`game/static/index.html`、`shared/static/404.html`；`work/static/index.html`、`work/static/workspace-assistant.html`；`work/static/kael/`、`work/static/meepo/`、`work/static/nest/`、`work/static/lanox/` 四生态页；`work/static/help/` 下七个帮助页；`game/static/dotarogue/index.html`、`equipment.html` 与 `effects.html`。根首页、工作方法预览和设计工作台不在当前统计接入范围。
- **接入方式**：消费者各引用一次相对路径。游戏选择页与工作一级页用 `../../shared/static/js/analytics.js`；游戏本体、工作四生态与帮助页用 `../../../shared/static/js/analytics.js`；共享失败页用 `js/analytics.js`。不向同一页面添加第二个 Google 代码。
- **变更门槛**：修改文件路径、Measurement ID 或初始化协议时，必须同步全部消费者，重新检查真实页面、静态资源路径、控制台和 Google Analytics 4 Realtime 数据；本机临时预览不属于当前消费者。迁移后的 Realtime 尚须实际核验，不能沿用旧路径记录作为通过证据。

`home.js` 和 `ecosystem.js` 的页面职责见 [共享资源](shared-resources.md)；页面私有脚本仍由 `work/static/js/` 或相应游戏的 `static/` 目录维护。
