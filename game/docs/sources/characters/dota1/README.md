# DotA1 可选角色皮肤来源与运行帧

本目录维护 DotaRogue 可选「DotA1 皮肤」的来源、制作记录和运行资源清单。2026-10-30 按用户要求恢复已认可的模型派生皮肤：最终采用的 **210 张 PNG** 已从研究产物中按原字节复制到 `game/static/dotarogue/assets/characters/dota1/<英雄 ID>/`，共 **20,434,568 字节**。正式消费者为 `game/static/dotarogue/js/game.js`；运行资源、显示尺度与脚点由[模型帧清单](model-frames-manifest.json)登记，普通皮肤继续保留。

## 当前模型派生资源（2026-10-30）

| 正式目录 | PNG 数量 | 采用内容 |
| --- | ---: | --- |
| `rover`、`bulwark`、`conductor`、`jugg`、`kael`、`luna` | 各 18 | 已认可的 Warcraft III 模型派生正／侧姿态。 |
| `sf` | 18 | Snake Akuma 的 Nevermore 社区重制模型派生帧，不能称为已核实的 DotA1 原始模型。 |
| `tb` | 36 | 同一 EvilIllidan 源模型的普通与 Alternate 恶魔形态，各 18 张。 |
| `scavenger` | 48 | 共同画幅的普通 18、狂暴 18、变入／还原 12 张；旧研究的 18 张普通帧保留为历史，不作为本次正式输入。 |

普通形态沿用 `idle-a`、`idle-alt`、`walk-a`、`walk-b`、`dash`、`attack-windup`、`attack`、`attack-release`、`skill` 九键和 `side-` 前缀。清单逐帧记录正式相对路径、SHA-256、尺寸、字节、形态与来源分组，并登记 11 份形态显示参数。仅复制最终 PNG，没有重新渲染、压缩或覆盖既有 SVG；模型、纹理、查看器、候选帧和中间产物未复制到正式运行目录。来源模型、转换与采样细节见[模型制作记录](model-study-20261029.md)。

用户于 **2026-10-30** 明确确认“我已确认可公开使用，会补充许可来源”。本次接入依据该确认；具体许可来源尚待用户补充，Agent 未独立核验到相应授权条款。该状态已如实记入清单，不能把公开可下载、社区审核状态或本清单当作许可证明，也不改变原权利人的权利。

正式皮肤应直接消费上述静态 PNG 与对应显示参数，运行时不依赖 `.tmp`、本机端口或 HTTP 响应替换。研究服务的历史截图不证明正式交付已经通过；本轮源码接线、真实入口、变身与手机视口验证以[游戏 README](../../../../README.md)记录的实际范围为准。资源完整性由 `scripts/check_dota1_skin_delivery.py` 检查，不能只以旧 SVG 文件仍存在作为皮肤恢复的证明。

## 2026-10-28 自绘 SVG 造型与原型（历史）

以下保留此前自绘 SVG 的制作、来源与验证记录，不代表当前采用的模型 PNG 来自这些 SVG 或由其生成器重建。2026-10-28 首版只有配色和少量头部细节，随后曾重画九英雄形体；当时保留前六英雄的经典轮廓并补充体积与材质，后三英雄恢复普通版完整姿态几何并调整经典配色。该批 SVG 为项目自绘，未导出官方模型、贴图或动画；其历史声明不能套用于上述模型派生 PNG。

身份回源[英雄资料](../../../dota/英雄.md)，新绘路径与普通姿态的色调处理由 [geometry.py](geometry.py) 维护。

| 英雄 | 经典原型与本轮重绘 |
| --- | --- |
| 矮人火枪手 `rover` | Rifleman。保留蓝兜帽、长白须与双手长枪尺寸，重画短躯干、低腰、短腿和宽靴，形成矮壮体型；蓝布明暗、胡须束和木托材质保留。 |
| 刚背兽 `bulwark` | Quillboar。保留低头厚背、猪吻獠牙与扇形背刺，补肩背和腹面的体积。 |
| 众神之王 `conductor` | Mountain King 天神下凡形态。保留巨盔、宽肩、长须、低腰与短粗腿；加宽方锤，重画接近锤头体积的大弧斧，独立侧视柄拳使双持在战斗尺寸可辨。 |
| 炼金术士 `scavenger` | Goblin Alchemist。保留青蓝食人魔与绿地精双人结构，补圆腹与四肢体积、药桶和装备材质。 |
| 剑圣 `jugg` | 兽族 Blademaster。保留绿皮、发髻、背旗和长刀轮廓，补胸肩肌肉与装备明暗。 |
| 影魔 `sf` | 染黑的 Firelord。重画宽黑胸肩、短弯颈、前探头部、浅色长弯爪、少量头火与无腿烟焰下身，减少白眼、细腰和灰色甲片感。 |
| 召唤师 `kael` | Kael'thas / Blood Mage。保留普通版完整姿态、原有表情、金发尖耳和分层长袍几何，按用户 2026-10-28 纠正改为白色外袍、紫色内衬和金色饰边，并统一水平适配以容纳伸手姿态；三球继续由 Canvas 单独绘制，DotA1 增大球与轨道以提高可读性，普通版红金配色及三球尺寸保留。 |
| 月之骑士 `luna` | Huntress。恢复普通版饱满骑手、跨坐与鞍具接触、四足黑豹的完整几何，仅调整配色与轮廓色。手持和飞行月刃均复用普通版一致几何。 |
| 灵魂守卫 `tb` | Illidan / Demon Hunter。恢复普通版身体比例、肩甲、绿纹、双刃及普通／恶魔双形态的完整姿态，仅调整配色与轮廓色。 |

## 历史自绘 SVG 资源与可编辑源

2026-10-28 当时的浏览器消费 `game/static/dotarogue/assets/characters/dota1/<英雄 ID>/`：九英雄前视、右向侧身各九帧，合计 162 张；TB 恶魔形态另有 18 张；Luna 独立飞行月刃一张，总计 **181 张透明 SVG**。动作仍为 `idle-a`、`idle-alt`、`walk-a`、`walk-b`、`dash`、`attack-windup`、`attack`、`attack-release`、`skill`。文件名、尺寸和 `viewBox` 沿用当时消费者契约，包括月刃的 `-48 -48 96 96` 零中心坐标。既有 SVG、源图与生成器继续保留；Luna 独立飞行月刃仍是单独的运行武器素材，不计入 210 张模型 PNG。

[art/source/](art/source/) 保存 **20 张分层源 SVG**：九英雄前／侧各一张，另有 TB 恶魔前／侧。每张保留头、躯干、腿、手臂、武器、骑手、坐骑或翅膀的对应分组。它们是当前生成结果的可编辑待机源图，不被战斗 Canvas 当动作帧读取。前六英雄的新路径及后三英雄的普通姿态处理由 `geometry.py` 维护；手工修改导出 SVG 不会自动反向写回生成输入。

生成器对前六英雄读取普通帧的画布、`viewBox` 和命名动作变换，再施加到新路径；较宽的武器与肩臂通过视口适配组避开裁切。对 `kael`、`luna`、`tb` 及 TB 恶魔形态，生成器深拷贝普通帧的完整子节点，处理配色与轮廓色，保留原有几何、动作与分层。Kael 全部前／侧姿态另统一做水平画布适配，避免伸手动作裁切，纵向脚点与所有命名姿态变换保持不变；Luna 独立月刃同样复用普通输入几何。各输出沿用普通帧的画布与脚点约定。普通皮肤 203 张 SVG 保持原字节，不写入、不改色、不删改。皮肤不改变碰撞、数值、技能、音效或对局状态。

全部材质、轮廓和明暗直接写入路径、`fill`、`stroke` 与渐变；没有有色底板、外链图片、嵌入第三方位图、CSS 整图滤镜、脚本或自主 SVG 动画。

## 公开视觉参考与权利边界

本轮查看 Blizzard 经典 Warcraft III 单位资料和动画，仅提炼形体、比例、武器与材质方向：

- [Rifleman](https://classic.battle.net/war3/human/units/rifleman.shtml)
- [Mountain King](https://classic.battle.net/war3/human/units/mountainking.shtml)
- [Blademaster](https://classic.battle.net/war3/orc/units/blademaster.shtml)
- [Blood Mage](https://classic.battle.net/war3/human/units/bloodmage.shtml)
- [Goblin Alchemist](https://classic.battle.net/war3/neutral/goblinalchemist.shtml)
- [Firelord](https://classic.battle.net/war3/neutral/firelord.shtml)
- [Huntress](https://classic.battle.net/war3/nightelf/units/huntress.shtml)
- [Demon Hunter](https://classic.battle.net/war3/nightelf/units/demonhunter.shtml)

这些公开页面和动画的权利归原权利人；本轮仅将它们用于本机观察，未把对应 GIF、模型、贴图或第三方参考图放入正式运行资源。仅本机核对所用参考保留在忽略的 `.tmp/dota1-redesign-20261028/references/`；运行 SVG 来自本目录新绘路径与本项目普通姿态资源，不请求这些参考网址。普通角色既有自绘资源的制作记录仍由各英雄来源包维护。

## 重生成与验证边界

在仓库根目录执行：

```sh
python3 -B game/docs/sources/characters/dota1/build_skin.py
```

生成器以脚本位置确定仓库和默认输出，结果不依赖调用时的工作目录。`--output-root` 指定 181 张运行帧目录，`--source-root` 指定 20 张源图目录，`--manifest` 指定清单位置。三个参数可同时指向本机临时目录进行复现。[manifest.json](manifest.json) 记录生成器输入、20 源图和 181 普通输入／重绘输出的 SHA-256。

历史构建 `forms2`（页面 `20261028-forms2`、角色资源 `20261028-dota1-forms2`）的 2026-10-28 静态验收曾渲染全部 181 个正式 SVG，并查看前／侧浅深底拼版和全部 180 姿态的动作拼版。扩大视口检查曾发现部分宽武器／爪臂触边，已用保留纵向脚点的适配组修正；独立月刃保持零中心，宙斯握锤手随原武器动作组运动。最终渲染的各帧均非空、四角透明、未触画布边缘，画布尺寸与普通资源相同。最终拼版和检查产物为 `.tmp/dota1-redesign-20261028/source-contact-v4.png`、`source-contact-light-v4.png`、`actions-all-v4.png` 等，本机保留、不提交；这些结论不自动覆盖本轮精修资源。

静态图像、XML／边界和哈希检查不能替代真实游戏验收。标题／暂停切换、战斗动作、月刃、变身、手机视口和浏览器错误的实际覆盖范围由游戏 README 与本轮验证记录维护。

历史精修构建 `20261028-polish1`（资源 `20261028-dota1-polish1`）已独立重生成核对 181 个运行 SVG 与 20 个源 SVG，逐字节一致；全部渲染非空、透明、不触边，扩大视口后无画布外内容。Kael 初次复用普通姿态时发现的伸手裁切已通过统一水平适配修复，初次失败与最终通过证据分别保留。该构建的 203 个普通 SVG 未变，180 个姿态内原有命名变换未变。其浏览器短流程与限制见[精修验证记录](../../../../../.logs/actual-test/dota1-polish-20261028/report.md)，不把静态全帧检查表述为全部动作的实战覆盖，也不自动覆盖后续白袍版本。

此前白袍构建 `20261028-kael-white2`（资源 `20261028-dota1-kael-white1`）将 DotA1 Kael 的 18 张运行帧与两张分层源图改为白袍、紫色内衬、金色饰边；保留普通版几何、表情及既有水平适配。Canvas 的 DotA1 三球基础半径由 3.5 增至 4.8，轨道半径由横20／纵5 增至横24／纵7，普通皮肤保持原值。三球仍按原游戏时间和前后分层绘制，未加入静态战斗帧。最新静态与浏览器验证覆盖范围见[游戏 README](../../../../README.md)。

此前比例构建为 `20261028-proportions1`，角色资源为 `20261028-dota1-proportions1`。本轮重画火枪与宙斯的短躯干／低腰／短腿，保留完整头须与武器尺寸、原画布和脚底；相对前版可见高度约缩短20%／22%。影魔抬头、降低中央肩线、外移肩刺并补可见颈段。正式变化限定三英雄54运行帧、6分层源图及生成输入／清单，普通203张、其他DotA1的127张及其余14源图保持字节不变。181运行图与20源图独立重生成逐字节一致，54帧与已审渲染的绘制树一致，原命名变换及画布保留；透明、扩展画布裁切检查通过。本轮实际从选择页进入三英雄第1波，在桌面及手机横竖视口核对移动与技能代表状态，验证范围和限制见[游戏 README](../../../../README.md)及[本轮验证](../../../../../.logs/actual-test/dota-proportions-20261028/report.md)。

保留项为正式 181 张 SVG、20 张分层源 SVG、本目录两份 Python 源码、README 和清单。此前临时阶段图、参考动画、渲染脚本与检查报告保留在 `.tmp/dota1-redesign-20261028/`；本轮备份、精修变体、前后对照与独立渲染保留在 `.tmp/dota1-polish-20261028/`、`.tmp/dota1-polish-audit-20261028/` 等本机目录。浏览器证据归 `.playwright-mcp/dota1-polish-20261028/`，日志归 `.logs/actual-test/dota1-polish-20261028/`。这些本机产物不提交，本轮未删除旧版证据、普通皮肤或其他任务产物。

本轮比例修正的备份、片段、渲染、复现和交付对比保留在 `.tmp/dota-proportions-20261028/`；实际浏览器截图位于 `.playwright-mcp/dota-proportions-20261028/`，日志位于 `.logs/actual-test/dota-proportions-20261028/`。这些本机产物不提交，本轮未删除旧证据或其他任务产物。

## 锤斧与影魔参考重画（历史：2026-10-28）

该历史构建页面为 `20261028-reference1`，角色资源为 `20261028-dota1-reference1`。仅更新宙斯／影魔36运行帧、4分层源图及生成输入／清单；普通203张、其余DotA1的145张及其余16源图不变。宙斯大弧斧、侧视柄拳与方锤共同撑开轮廓，保持此前短躯干与短腿；影魔从整体黑色魂体重画，头颈、宽肩、长浅爪与烟焰连续相接。随后按实战小尺寸复测继续压低灰绿面和橙色胸甲线，去除手臂内侧的护甲分面，让头火、长爪与黑色烟焰剪影成为主要识别点。

实际查看上述Blizzard山丘／Firelord动画，补看[DotAWiki实战图历史页](https://www.dotawiki.de/index.php?title=Datei:NevermoreUlti.jpg&oldid=27320)所载v6.64图和[较晚v6.87c实战图](https://wc3.3dn.ru/_pu/5/35519970.jpg)。官方Firelord用于身体结构、长臂及元素下身，DotA1截图用于黑色主体、亮爪与头火观察。v6.64主体被英雄及技能线部分遮挡，v6.87c作者是否使用自定义皮肤未独立证实，都不作精确比例或版本一致证明。未采用Hive自制皮肤或Dota2模型；第三方参考仅供本机观察，不导入运行资源。

独立审计确认181运行SVG与20源SVG重生成逐字节一致；36帧画布、原命名组及动作变换保留，透明角与扩展画布检查通过，全部36帧和86高拼版已看。真实入口两英雄第1波、三视口代表状态与限制见[本轮报告](../../../../../.logs/actual-test/dota-reference-redraw-20261028/report.md)。静态完整帧集通过不表示每个动作已自然实战触发。

参考、备份、片段、试绘、复现和交付图保留在 `.tmp/dota-reference-redraw-20261028/`，浏览器原图归 `.playwright-mcp/dota-reference-redraw-20261028/`，日志归 `.logs/actual-test/dota-reference-redraw-20261028/`。这些本机产物不提交，未删除旧证据或其他任务产物。
