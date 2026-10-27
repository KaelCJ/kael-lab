# Kael Lab

Kael Lab 是一个关于“在 AI 时代，把日常过得更好”的公开静态站点。当前根首页的视觉与叙事已获确认，后续内容围绕它持续发展。工作、休闲、生活是三个并列方向：工作记录人机协作与工程方法，休闲从网页游戏开始，生活从衣、食、住、行四份日常起步清单开始，饮食价格、育儿和装修专题继续整理。

## 方向与入口

| 方向 | 公开入口 | 仓库内上下文 |
| --- | --- | --- |
| 全站首页 | `index.html`：AI 时代下的日常入口，提供工作、休闲、生活三个方向 | 本 README、根目录 `AGENTS.md` 与工作项 `RKymfAuJSzwmwawJmTKU` |
| 人机协作 / 工作 | `work/static/index.html`，再进入 `work/static/` 下的 Kael、Meepo、Jugg/Nest、Lanox、帮助中心与 Workspace Assistant | `work/docs/README.md` 与根目录 `AGENTS.md` |
| 网页游戏 | `game/static/index.html` 游戏选择页；首款《DotaRogue》在 `game/static/dotarogue/index.html` | `game/README.md` 与 `game/AGENTS.md` |
| 生活 | `life/static/index.html`：衣、食、住、行生活手帖与起步清单 | `life/docs/README.md` |

README 记录可从当前文件核对的实现与入口；AGENTS 记录后续 Agent 的稳定工作边界。它们是回源导航，不代替当前代码、页面或运行验证。

站点采用可由 GitHub Pages 直接发布的纯静态实现；页面功能不依赖运行时构建，统计脚本独立加载：

- `index.html`、`shared/static/css/home.css`、`shared/static/js/home.js`：全站首页，围绕“人的需要先于工具”组织工作、休闲、生活三个方向；三个方向均链接到各自当前页面，生活卡片和 `#life` 段进入生活手帖。首页不加载统计脚本，不连接服务端或外部 API；正文和三个方向在禁用 JavaScript 时仍可阅读。
- `work/static/index.html`、`work/static/css/styles.css`：工作方向首页，使用根首页已确认的深绿叙事作为入口，保留三条协作原则，并以轻量入口连接 Kael、Meepo、Jugg/Nest、Lanox、帮助中心与方法预览；页面不依赖工作台脚本。
- `work/static/start.html`、`work/static/css/start.css`：工作分区内的独立方法预览，以“人 A＋Agent X → 同一工作项与适用方法 → 人 B＋Agent Y”说明可替换参与者如何接手、读取当前依据并回写结果，并说明工作项如何成为个人／项目／组织／企业看板与知识沉淀的事实基础；不加载 JavaScript、统计或外部资源。页面为公开方法与固定 Concept 演示，真实看板聚合、权限和知识库边界见 `work/docs/README.md`。
- `shared/static/css/ecosystem.css`、`shared/static/js/ecosystem.js`：四个产品空间共享的 Lanox 视觉语言、架构/演讲双视图、三主题、Inspector 与键盘翻页；共享资源的消费者和边界见 `shared/docs/shared-resources.md`。
- `shared/static/js/analytics.js`：全站共用的 Google Analytics 4 加载器；原有实际内容页沿用各自统计引用，Measurement ID 为 `G-FVG65R5M0D`。全站首页当前不加载统计；当前契约见 `shared/docs/js-resources.md`。
- `work/static/kael/`：人机协作总循环、工作项上下文、任务内增益与跨任务判断升级。
- `work/static/meepo/`：组合根、产品 Agent、公共 Framework 与 Nest 候选能力的当前模块视图。
- `work/static/nest/`：Jugg/Nest 业务伴生治理、五类支撑、六层资产与知识产品候选核心。
- `work/static/help/`：自包含同源帮助包；包含帮助中心、产品需求、架构方案、研发实施、测试证据、完整流程与领导看板六个独立交互页，并保留工作项、Nest 知识库和 Codex Workbench 快速指引。
- `work/static/lanox/`：不含内部实现上下文的 Lanox 公共品牌、六层架构与产品方向。
- `work/static/workspace-assistant.html`：Workspace Assistant 多角色、多场景产品 Concept Mock。
- `work/static/css/workspace-assistant.css`、`work/static/js/workspace-assistant.js`：Mock 的独立样式和浏览器内状态机。
- `game/static/index.html`、`game/static/css/games.css`：游戏选择页；给以后新增的游戏保留独立入口。
- `life/static/index.html`、`life/static/css/life.css`、`life/static/js/life.js`：生活方向独立首页，延续米白网格、深绿和珊瑚橙的视觉，以衣、食、住、行四主题进入四份原创日常起步清单。原生 `details` 和复选框承载阅读与勾选，JavaScript 增强完成计数、当前浏览器的本机记忆与重置；不加载统计、外部 API 或第三方依赖。家庭陪伴、价格记录、育儿与装修专题属于后续整理，不代表已提供相关服务。
- `game/`：首款受 Dota 启发的网页生存肉鸽《DotaRogue》，支持桌面和手机横竖屏游玩；`game/static/dotarogue/equipment.html` 提供49件装备／28配方的图鉴，含23件三级成品、六类羁绊与成员；游戏有待用储备和双目标自动合成，装备与英雄成长的表现已接入，实际验证范围见游戏README。狂战斧、红杖与分身斧保留三级攻击形态和角色装备外观。页面、脚本、样式和运行素材位于 `game/static/dotarogue/`，设计与公开参考归入 `game/docs/`。实现、玩法和验证入口见 `game/README.md`。
- `shared/static/assets/favicon.svg`：站点与游戏共享的公开矢量图标，页面通过相对路径显式引用。
- `shared/static/404.html`：可直接访问的静态失败说明页；位于子目录，不宣称 GitHub Pages 自动把它作为根级自定义 404。

## 目录约定

| 所有者 | 正式静态文件 | 说明、设计与公开参考 |
| --- | --- | --- |
| 工作 | `work/static/`：工作首页、四生态、帮助和助手等 14 个页面及专属 CSS／JavaScript | `work/docs/` |
| 游戏 | `game/static/index.html` 选择页、`game/static/dotarogue/` 游戏页面、CSS／JavaScript 和运行素材 | `game/docs/`；游戏总入口说明与局部规则保留在 `game/README.md`、`game/AGENTS.md` |
| 生活 | `life/static/index.html`、专属 CSS／JavaScript：生活手帖与四主题清单 | `life/docs/` |
| 共享 | `shared/static/`：首页资源、图标、统计、四生态共享机制及失败说明页 | `shared/docs/` |

- 根目录的 HTML 只保留全站入口 `index.html`；不保留旧页面、旧链接、跳转页或兼容目录。所有入口使用物理 HTML 地址与相对资源路径，兼容站点根部署及 GitHub Pages 项目子路径。
- 资源首先归属真实消费者；只有稳定且由多个页面共同消费的机制才进入 `shared/`。路径解析规则和消费者见 [shared/docs/README.md](shared/docs/README.md)。
- `docs/` 不承载浏览器运行依赖；角色运行帧、图片、音频与纹理归所属游戏的 `static/`。游戏公开设计源、来源许可、Concept／对照图与离线生成器归 `game/docs/sources/`；角色生成器默认直接输出正式运行目录，可用 `--output-root` 指定独立审阅输出，不在文档域复制运行帧。
- `.agents/`、`.claude/`、`.codex/`、`.workspace-assistant/` 和 `.idea/` 属于协作工具或开发环境，不属于站点交付资源。
- `.playwright-mcp/` 保存浏览器工具生成的本机验证证据；`.tmp/` 集中保存其他临时截图、试验脚本、变体、抓取原文及历史产物。两者均不提交；旧 `artifacts/` 已迁入 `.tmp/artifacts/`，不再向根目录写入 `tmp-*`、`temp-*` 或散落图片。
- `scripts/` 保存可复用的本地维护检查，不参与页面运行，不要求 GitHub Pages 执行 Python 或构建。
- `game/docs/dota/` 的 DotA 英雄与装备参考属于游戏设计回源，不是当前运行资源或已实现能力清单。

### 素材与验证产物的收尾

1. **正式素材**放在所属游戏或模块的素材目录，核对来源、许可与真实消费者后正常提交；不全局忽略 PNG 等图片类型。共享图标放在 `shared/static/assets/`，不向根目录新增散落图片。
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

2026-10-27 目录迁移后，静态检查通过 21 个 HTML／305 处本地引用，18 项 Python 回归通过；工作区检查通过，保留 34 条既有所有权提醒。从新入口检查了全部页面的桌面和手机默认布局、键盘焦点、游戏短局、图鉴、三种特效及工作台 iframe，并实际走通 `/kael-lab/` 项目子路径导航。阻断脚本执行后，首页、工作、方法、游戏选择及基础说明仍可阅读；这未覆盖浏览器原生禁用 JavaScript 后的 `noscript` 状态。七个抽查旧入口均返回 404。

本轮浏览器控制台保留了无法归因的 `Object` 错误日志，不能宣称控制台全零；未覆盖真实手机硬件、所有主题与交互组合、完整游戏长局、声音听感和素材生成器重跑。当前验证事实和本机证据登记在首页工作项 `RKymfAuJSzwmwawJmTKU`。后续入口或资源变化仍须从新物理入口重验，历史构建的通过记录不能代替当前路径、动态素材和 iframe 的检查。

## 本地预览

在仓库根目录运行任意静态服务器，例如：

```bash
python -m http.server 4173
```

然后访问 `http://localhost:4173/index.html` 查看全站首页，或访问 `http://localhost:4173/work/static/index.html` 查看工作空间、`http://localhost:4173/game/static/index.html` 选择游戏、`http://localhost:4173/life/static/index.html` 查看生活手帖。根首页的三个方向与导航在禁用 JavaScript 时仍可阅读；生活页的四份清单可通过原生展开控件阅读并勾选，计数、保存与重置由 JavaScript 增强。生活页的完整验证方法见 [life/docs/README.md](life/docs/README.md)。

桌面工具的浏览器预览可使用 `.claude/launch.json` 中的 `kael-lab-static`：同样只运行 Python 静态服务器，使用线程服务器与 128 的连接队列承接游戏素材的并行请求。默认端口 4187；端口占用时接受工具分配的 `PORT`，不停止其他已有服务。此配置不参与 GitHub Pages 发布。

部署后可在 Google Analytics 4 的 Realtime 页面验证公开 URL 的访问；本地静态服务器只用于检查公共脚本的相对路径和页面不依赖统计脚本也能加载。

## 公开边界

- 本仓库只保存公开派生内容，不镜像任何内部知识库或项目文档。
- 页面明确区分 `Public Method`、`Concept Mock` 和 `Demo Data`。
- 四个产品空间进一步区分 `Current`、`Building`、`Candidate` 与 `Direction`，架构节点和演讲分镜都是公开静态表达。
- Workspace Assistant 只使用脱敏模拟数据，不连接真实工作区、模型、Codex 或 API。
- 帮助页中的人物、工作项、进度、贡献、运行和测试记录全部是固定演示数据，不代表真实组织状态或人员绩效。
- 站点没有服务端、账号、评论或私密 API Key；页面通过 `shared/static/js/analytics.js` 统一加载 Google Analytics 4，因此会请求 Google 的第三方统计脚本。
- 游戏选择页、游戏标题页和结果页已移除爱发电及“支持开发”入口；游戏可直接免费游玩。
- 浏览器实验成绩只保存在访问者当前设备的 LocalStorage 中。
- 游戏借鉴生存肉鸽玩法，角色视觉以 Warcraft III／DotA1 原型为参考；当前运行图由本仓库重新绘制，不是相关作品的官方移植。游戏设置与记录保存在当前浏览器的 LocalStorage 中。

## License

首版暂未授予通用开源或内容再许可；仓库公开可见不等于内容获得额外许可。
