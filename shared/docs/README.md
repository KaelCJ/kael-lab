# 正式静态资源与共享目录

Kael Lab 的正式文件按工作、游戏、生活和共享所有权组织，随站点直接发布到 GitHub Pages，不需要构建、服务端或私密配置。`shared/static/` 只承载跨页面使用的机制、首页资源与共享图标；`shared/docs/` 记录其职责、消费者和路径契约。

## 所有权与页面入口

- 根目录只保留全站首页 `index.html`，样式与脚本为 `shared/static/css/home.css`、`shared/static/js/home.js`。
- 工作页面及专属 CSS／JavaScript 位于 `work/static/`，说明位于 `work/docs/`。
- 游戏选择页为 `game/static/index.html`，样式为 `game/static/css/games.css`；《DotaRogue》的页面、样式、脚本和运行素材位于 `game/static/dotarogue/`，设计与公开参考位于 `game/docs/`。
- 生活方向暂时只有 `life/docs/`，没有真实内容和入口前不建立空的 `life/static/`。
- 四生态共用资源为 `shared/static/css/ecosystem.css`、`shared/static/js/ecosystem.js`；统计脚本为 `shared/static/js/analytics.js`，图标为 `shared/static/assets/favicon.svg`。消费者见 [共享资源](shared-resources.md) 与 [共享 JavaScript](js-resources.md)。
- `shared/static/404.html` 是物理可访问的失败说明页；子目录位置不构成 GitHub Pages 根级自定义 404 接线。
- 不保留旧页面、旧链接、跳转脚本或兼容目录；不回建根部 `static/`、`css/`、`js/`，不依赖服务器重写规则。

## 路径规则

1. HTML 的链接与资源 URL 相对页面目录。工作首页引用专属资源用 `css/…`、`js/…`，帮助页用 `../css/help/…`、`../js/help/…`。工作首页引用共享资源用 `../../shared/static/…`，四生态及帮助页用 `../../../shared/static/…`。
2. 游戏选择页引用共享资源用 `../../shared/static/…`，进入游戏用 `dotarogue/index.html`。游戏页面引用自己的资源用 `css/…`、`js/…`、`assets/…`，引用共享资源用 `../../../shared/static/…`。
3. ES 模块的 `./…` 导入相对脚本文件；`new URL(…, import.meta.url)` 也相对模块位置。风、火模块在 `game/static/dotarogue/js/effects/`，对应纹理用 `../../assets/art/…`。
4. 直接赋给 DOM／Image 的相对 `src`，以及基于 `location.href` 的 iframe 与链接，仍相对页面，不能因为脚本位置改变就统一追加 `../`。CSS 的 `url(…)` 相对 CSS 文件。
5. 保留相对 URL，兼容站点根部署和 GitHub Pages 项目子路径。迁移目录时保留内部模块关系与版本查询串，同步源码链接、动态图片、音频、特效和 iframe。

## 验证与本机产物

从仓库根目录运行：

```bash
python -B -X utf8 scripts/check_static_paths.py
```

检查覆盖正式页面的本地链接与资源、CSS 的 URL／导入、JS 字面量模块导入与脚本相对 URL；动态拼接、实际渲染、浏览器存储及交互仍需从新物理入口在真实浏览器中检查。桌面和移动布局、键盘、控制台、无 JavaScript 基础可读性及项目子路径都属于迁移复验范围。

本机截图、试验脚本和验证报告使用 `.tmp/<任务或用途>/` 或 `.playwright-mcp/<任务>/`，不提交、不覆盖旧证据；资源整理与卫生检查见根 [README](../../README.md)。历史验证记录只证明当时构建，不代表新路径已通过。
