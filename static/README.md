# 正式静态资源

本目录随 Kael Lab 一起发布到 GitHub Pages，不需要构建、服务端或私密配置。它不是临时文件目录；本机截图、试验脚本和验证报告继续使用 `.tmp/` 或 `.playwright-mcp/`，不提交。

## 所有权与页面入口

- `css/`：站点样式及 `game/`、`help/`、`shared/` 下各所有者的样式。
- `js/`：站点脚本及对应的游戏、帮助和共享模块。
- CSS／JS 内部的模块划分沿用原结构，不平铺到一个目录。
- 工作方向 HTML 集中在 `work/`（首页、四生态、帮助、Workspace Assistant）；游戏页面保留在 `game/`。根 `games.html` 不动，只有根首页保留兼容页；旧生态／帮助／助手入口已移除，业务内容只维护新位置。不创建 `pages/`。
- `js/redirect.js`、`css/redirect.css` 仅供根首页使用的轻量跳转与无脚本链接样式；兼容页不加载统计或完整业务脚本。
- 游戏图片、角色源图、运行帧和设计资料仍由 `game/` 管理；本次没有搬迁素材或改变其使用许可。

## 路径规则

1. 页面引用相对页面所在目录：根页面用 `static/css/…`、`static/js/…`；`work/`、`game/` 的一级页面用 `../static/…`；`work/help/` 和四生态页面用 `../../static/…`。不回建根目录 `css/`、`js/`，不依赖服务器重写规则。
2. ES 模块之间的 `./…` 导入相对脚本文件；整体迁移时保留目录内部关系和版本查询串。
3. `new URL(…, import.meta.url)` 相对模块位置。风、火模块现在位于 `static/js/game/effects/`，定位仍在 `game/art/` 的纹理需使用 `../../../../game/art/…`。
4. 直接赋给 DOM／Image 的相对 `src`，以及基于 `location.href` 的 iframe 和链接，仍相对页面；不能因为 JS 加深一层就给它们一律追加 `../`。
5. 保留相对 URL，兼容 GitHub Pages 的项目子路径。正式页面使用 `work/`、`game/` 下的物理地址；除根首页外，不为已经取消的旧工作路径再建兼容目录。

## 验证

从仓库根目录运行：

```bash
python -B -X utf8 scripts/check_static_paths.py
```

检查覆盖正式页面的本地链接与资源、CSS 的 URL／导入、JS 字面量模块导入与脚本相对 URL；动态拼接、实际渲染、浏览器存储及用户交互仍需真实浏览器验证。检查方法和本机产物规则见根 README；共享资源的消费者见 `css/shared/README.md` 与 `js/README.md`。
