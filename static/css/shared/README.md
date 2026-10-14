# Shared site resources

这里记录并承载 Kael Lab 多个公开页面共同消费、且不携带具体页面业务状态的静态资源。资源物理文件分别位于 `static/css/shared/` 和 `static/js/shared/`。

## 当前资源

- `static/css/shared/ecosystem.css`：Kael、Meepo、Jugg / Nest、Lanox 四个生态页共用的视觉主题、布局和交互状态样式。
- `static/js/shared/ecosystem.js`：上述四个生态页共用的主题切换、Inspector、演讲视图和键盘翻页机制。

页面自己的内容和状态仍保留在所属页面或项目目录；页面私有样式和脚本在 `static/css/<owner>/`、`static/js/<owner>/` 下按所有权归档。这里不放未来尚无真实消费者的抽象层。

修改本目录后，应从以下真实入口检查资源路径和页面行为：

- `work/kael/index.html`
- `work/meepo/index.html`
- `work/nest/index.html`
- `work/lanox/index.html`
