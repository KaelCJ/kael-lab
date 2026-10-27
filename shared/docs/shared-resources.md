# Shared site resources

这里记录 Kael Lab 多个公开页面共同消费、且不携带具体页面业务状态的机制。物理文件位于 `shared/static/`，页面私有样式与脚本保留在所属模块的 `static/` 中。

## 当前资源

- `shared/static/css/ecosystem.css`：Kael、Meepo、Jugg / Nest、Lanox 四生态页共用的视觉主题、布局和交互状态样式。
- `shared/static/js/ecosystem.js`：上述四生态页共用的主题切换、Inspector、演讲视图和键盘翻页机制。
- `shared/static/css/home.css`、`shared/static/js/home.js`：全站首页资源，消费者为根 `index.html`。
- `shared/static/assets/favicon.svg`：站点与游戏页面显式引用的共享图标。

统计脚本的协议与消费者见 [共享 JavaScript](js-resources.md)。页面自己的内容和状态仍由对应页面或项目目录拥有；这里不放尚无真实消费者的抽象层。

修改四生态共用机制后，从以下物理入口检查资源路径和页面行为，并覆盖桌面、手机、键盘、主题与无 JavaScript 基础可读性：

- `work/static/kael/index.html`
- `work/static/meepo/index.html`
- `work/static/nest/index.html`
- `work/static/lanox/index.html`

路径解析、项目子路径和迁移验证方法见 [目录契约](README.md)。
