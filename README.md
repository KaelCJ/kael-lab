# Kael Lab

人与 Agent 共同工作的公开 AI Center，以及独立的网页游戏空间。两个方向共用一个可由 GitHub Pages 直接发布的静态仓库。

## 方向与入口

| 方向 | 公开入口 | 仓库内上下文 |
| --- | --- | --- |
| 人机协作 / AI Center | `work/index.html`，再进入 `work/` 下的 Kael、Meepo、Jugg/Nest、Lanox、帮助中心与 Workspace Assistant；根 `index.html` 保留兼容入口 | `work/README.md` 与根目录 `AGENTS.md` |
| 网页游戏 | `games.html` 游戏选择页；首款《DotaRogue》在 `game/index.html` | `game/README.md` 与 `game/AGENTS.md` |

README 记录可从当前文件核对的实现与入口；AGENTS 记录后续 Agent 的稳定工作边界。它们是回源导航，不代替当前代码、页面或运行验证。

AI Center 采用可由 GitHub Pages 直接发布的纯静态实现；页面功能不依赖运行时构建，统计脚本独立加载：

- `work/index.html`、`static/css/styles.css`、`static/js/app.js`：Kael、Meepo、Jugg/Nest、Lanox 四生态首页，六类角色帮助入口、协作方法和 Evidence Lab。
- `work/start.html`、`static/css/work/start.css`：面向首次访问者的独立新首页预览，以“人 A＋Agent X → 同一工作项与适用方法 → 人 B＋Agent Y”说明可替换参与者如何接手、读取当前依据并回写结果，并说明工作项如何成为个人／项目／组织／企业看板与知识沉淀的事实基础；不加载 JavaScript、统计或外部资源。页面为公开方法与固定 Concept 演示，真实看板聚合、权限和知识库边界见 `work/README.md`；原首页和默认跳转保持原有入口。
- `static/css/shared/ecosystem.css`、`static/js/shared/ecosystem.js`：四个产品空间共享的 Lanox 视觉语言、架构/演讲双视图、三主题、Inspector 与键盘翻页；共享资源的消费者和边界见 `static/css/shared/README.md`。
- `static/js/analytics.js`：全站共用的 Google Analytics 4 加载器；原有实际内容页沿用各自统计引用，Measurement ID 为 `G-FVG65R5M0D`。根首页兼容页不加载统计，避免跳转前后重复统计；当前契约见 `static/js/README.md`。
- `work/kael/`：人机协作总循环、工作项上下文、任务内增益与跨任务判断升级。
- `work/meepo/`：组合根、产品 Agent、公共 Framework 与 Nest 候选能力的当前模块视图。
- `work/nest/`：Jugg/Nest 业务伴生治理、五类支撑、六层资产与知识产品候选核心。
- `work/help/`：自包含同源帮助包；包含帮助中心、产品需求、架构方案、研发实施、测试证据、完整流程与领导看板六个独立交互页，并保留工作项、Nest 知识库和 Codex Workbench 快速指引。
- `work/lanox/`：不含内部实现上下文的 Lanox 公共品牌、六层架构与产品方向。
- `work/workspace-assistant.html`：Workspace Assistant 多角色、多场景产品 Concept Mock。
- `static/css/workspace-assistant.css`、`static/js/workspace-assistant.js`：Mock 的独立样式和浏览器内状态机。
- `games.html`、`static/css/games.css`：游戏选择页；给以后新增的游戏保留独立入口。
- `game/`：首款受 Dota 启发的网页生存肉鸽《DotaRogue》，支持桌面和手机横竖屏游玩；`game/equipment.html` 提供当前 46 件装备的三阶段合成图鉴，狂战斧、红杖与分身斧已有三级攻击形态和角色装备外观。页面、素材和设计资料在 `game/`，样式和脚本分别在 `static/css/game/`、`static/js/game/`。实现、玩法和验证入口见 `game/README.md`。
- `favicon.svg`：站点与游戏共享的公开矢量图标，保留根路径以兼容浏览器默认图标请求。
- `404.html`：静态托管失败页。

## 目录约定

- `work/` 聚合工作方向的 14 个正式页面（含独立新首页预览）；`game/` 管理当前游戏与相关资料；`games.html` 保留根目录，本轮不改其内容或行为。
- 根目录业务入口只保留 `index.html` 与 `games.html`：前者轻量跳转到 `work/index.html`，后者保留游戏选择页。外层 `kael/`、`meepo/`、`nest/`、`lanox/`、`help/` 和 `workspace-assistant.html` 已移除，不再兼容这些旧地址；正式内容只在 `work/`。`404.html` 等部署辅助文件保留。根首页跳转保留 query／hash，禁用 JavaScript 时保留访问链接。
- `static/` 是随站点发布的正式资源目录，与不提交的 `.tmp/` 分开；HTML 按业务域放在 `work/`、`game/`，不建立空的 `static/pages/`。
- `static/css/`、`static/js/` 按站点、共享、帮助和游戏所有权归档前端资源；只有稳定且有多个真实消费者的机制才进入 `shared` 子目录。详细路径规则见 [static/README.md](static/README.md)。
- `work/`、`game/` 分别维护所属 HTML、素材与设计资料；对应 CSS/JavaScript 在 `static/css/`、`static/js/` 下按所有权归档。
- `.agents/`、`.claude/`、`.codex/`、`.workspace-assistant/` 和 `.idea/` 属于协作工具或开发环境，不属于站点交付资源。
- `.playwright-mcp/` 保存浏览器工具生成的本机验证证据；`.tmp/` 集中保存其他临时截图、试验脚本、变体、抓取原文及历史产物。两者均不提交；旧 `artifacts/` 已迁入 `.tmp/artifacts/`，不再向根目录写入 `tmp-*`、`temp-*` 或散落图片。
- `scripts/` 保存可复用的本地维护检查，不参与页面运行，不要求 GitHub Pages 执行 Python 或构建。
- `game/dota/` 保存 DotA 英雄与装备参考资料，属于游戏回源，不是当前运行资源或已实现能力清单。原根目录 `dota/` 已迁入此处。

### 素材与验证产物的收尾

1. **正式素材**放在所属游戏或模块的素材目录，核对来源、许可与真实消费者后正常提交；不全局忽略 PNG 等图片类型。根目录只保留现有 `favicon.svg` 图标，不新增散落图片。
2. **需要长期公开保存的参考或证据**先筛选、确认公开边界，再归入对象目录并记录用途、来源和引用；不能只改名为“参考图”就把临时截图提交。
3. **本机临时产物**使用 `.tmp/<任务或用途>/`；浏览器工具证据保留在 `.playwright-mcp/<任务>/`。脚本应从自身位置或显式参数确定仓库与输出目录，不依赖当前工作目录；同一任务的多次验证使用不同文件或运行子目录，避免覆盖旧证据。
4. **任务结束时**核对新增产物、引用和 Git 跟踪状态，登记保留或待清理项。没有明确保留期限的历史证据不自动删除；删除仍需用户授权。忽略规则不会取消已有跟踪，也不是静态服务器的访问控制，不能据此存入私密内容。

暂存或提交前，在仓库根目录运行只读检查（也可从其他目录以脚本的绝对路径运行）：

```bash
python -B -X utf8 scripts/check_workspace_hygiene.py
```

检查根目录图片／临时文件、旧产物目录、根部旧 `css/`／`js/` 目录、已停用的外层工作入口及被 Git 跟踪的本机产物／Python 缓存；违规时以非零状态退出。其他“已跟踪但匹配忽略规则”的文件单独警告，不自动改索引或删除。本次未调整已有工作项和协作基座的跟踪边界；要把这类警告也视为失败，可加 `--strict`。这是显式检查入口，不自动安装 Git Hook，也不修改公共提交 Skill。

移动资源或修改引用后，再检查正式 HTML 的本地链接／资源、CSS 资源、JS 模块导入和字面量 `import.meta.url` 资源路径：

```bash
python -B -X utf8 scripts/check_static_paths.py
```

该检查不执行 JavaScript，也不枚举动态拼接的图片路径；仍需从真实页面检查桌面与移动布局、键盘、控制台、无 JavaScript 的可读性，以及游戏和特效的实际加载。

检查器的回归测试：

```bash
python -B -X utf8 -m unittest discover -s scripts -p "test_*.py"
```

根首页跳转另有 query／hash、项目子路径和固定同源目标回归检查：

```bash
node --test scripts/test_redirect.js
```

## 本地预览

在仓库根目录运行任意静态服务器，例如：

```bash
python -m http.server 4173
```

然后访问 `http://localhost:4173/work/` 查看工作空间，或访问 `http://localhost:4173/games.html` 选择游戏；访问根地址会进入工作空间，禁用 JavaScript 时点击兼容页链接继续。

桌面工具的浏览器预览可使用 `.claude/launch.json` 中的 `kael-lab-static`：同样只运行 Python 静态服务器，使用线程服务器与 128 的连接队列承接游戏素材的并行请求。默认端口 4187；端口占用时接受工具分配的 `PORT`，不停止其他已有服务。此配置不参与 GitHub Pages 发布。

部署后可在 Google Analytics 4 的 Realtime 页面验证公开 URL 的访问；本地静态服务器只用于检查公共脚本的相对路径和页面不依赖统计脚本也能加载。

## 公开边界

- 本仓库只保存公开派生内容，不镜像任何内部知识库或项目文档。
- 页面明确区分 `Public Method`、`Concept Mock` 和 `Demo Data`。
- 四个产品空间进一步区分 `Current`、`Building`、`Candidate` 与 `Direction`，架构节点和演讲分镜都是公开静态表达。
- Workspace Assistant 只使用脱敏模拟数据，不连接真实工作区、模型、Codex 或 API。
- 帮助页中的人物、工作项、进度、贡献、运行和测试记录全部是固定演示数据，不代表真实组织状态或人员绩效。
- 站点没有服务端、账号、评论或私密 API Key；页面通过 `static/js/analytics.js` 统一加载 Google Analytics 4，因此会请求 Google 的第三方统计脚本。
- 游戏选择页及游戏页面的“支持开发”入口跳转到外部爱发电主页 `https://afdian.com/a/kael-lab`；本站不处理支付、账号、订单或游戏内购买权益。从 `games.html` 进入游戏后可核对选择页、标题页与结果页的链接目标。
- 浏览器实验成绩只保存在访问者当前设备的 LocalStorage 中。
- 游戏借鉴生存肉鸽玩法，角色视觉以 Warcraft III／DotA1 原型为参考；当前运行图由本仓库重新绘制，不是相关作品的官方移植。游戏设置与记录保存在当前浏览器的 LocalStorage 中。

## License

首版暂未授予通用开源或内容再许可；仓库公开可见不等于内容获得额外许可。
