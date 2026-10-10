# Shared site resources

这里仅放 Kael Lab 多个公开页面共同消费、且不携带具体页面业务状态的静态资源。

## 当前资源

- `ecosystem.css`：Kael、Meepo、Jugg / Nest、Lanox 四个生态页共用的视觉主题、布局和交互状态样式。
- `ecosystem.js`：上述四个生态页共用的主题切换、Inspector、演讲视图和键盘翻页机制。

页面自己的内容、状态、样式和脚本仍保留在所属页面或项目目录；这里不放未来尚无真实消费者的抽象层。

修改本目录后，应从以下真实入口检查资源路径和页面行为：

- `kael/index.html`
- `meepo/index.html`
- `nest/index.html`
- `lanox/index.html`
- `index.html`
- `games.html`
- `game/index.html`
