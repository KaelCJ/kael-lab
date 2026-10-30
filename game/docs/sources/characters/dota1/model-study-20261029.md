# 其他英雄模型制作研究 · 2026-10-29

本轮按已确认的[角色图片创作流程](../../../core/角色图片创作流程.md)，完成影魔之外八名英雄的本地模型研究接入，另为灵魂守卫导出恶魔形态：九个形态，每形态正／侧各九张，共 **162 张透明 PNG**。影魔沿用前轮已确认的 18 张社区模型派生帧，不计入本轮 162 张。

这是**本地研究版的制作与验证记录**。正式 `game/static/dotarogue/` 的角色资源和接线未因本轮研究替换；正式 DotA1 SVG 的来源与消费者仍见[本目录 README](README.md)。本地服务在读取当前正式源码后，仅在响应中替换图片地址、图片显示参数及相关视觉适配，普通皮肤继续可选。

## 来源与使用边界

八个主源来自 Hive Workshop 公开 Warcraft III SD CASC 资源端点，实际响应可重定向到其 CDN。本轮请求 `game=wc3&context=sd`，下载文件的实际 magic 为 `MDLX`、版本为 **1800**；SD 请求不等于旧版 800 格式，也不能据此认定这些字节就是某一历史 DotA1 地图中的原文件。

本轮没有确认这些 Warcraft III 模型、纹理及派生图片的公开再分发条件。原模型、原纹理、转换模型、派生纹理及 PNG 仅保留在本机研究目录；本正式文档只保存公开来源、映射、哈希、制作参数与限制，不复制第三方素材。公开可下载与研究用途均不作为再分发许可证明。

| 游戏 ID／角色 | 主源 War3 路径与公开下载地址 | 本轮身份目标 |
| --- | --- | --- |
| `rover`／矮人火枪手 | [`units/Human/Rifleman/Rifleman.mdx`](https://www.hiveworkshop.com/casc-contents?path=units%2FHuman%2FRifleman%2FRifleman.mdx&game=wc3&context=sd) | 矮壮、短腿，完整头盔、白须和长火枪。 |
| `bulwark`／刚背兽 | [`Units/Creeps/BristleBack/BristleBack.mdx`](https://www.hiveworkshop.com/casc-contents?path=Units%2FCreeps%2FBristleBack%2FBristleBack.mdx&game=wc3&context=sd) | 前探猪嘴、獠牙、驼背、厚肩和完整背刺扇形。 |
| `conductor`／众神之王／山丘 | [`units/Human/HeroMountainKing/HeroMountainKing.mdx`](https://www.hiveworkshop.com/casc-contents?path=units%2FHuman%2FHeroMountainKing%2FHeroMountainKing.mdx&game=wc3&context=sd) | Alternate 石像山丘；短躯干、完整胡须、大锤与大斧双持。 |
| `scavenger`／炼金术士 | [`units/Creeps/HeroGoblinAlchemist/HeroGoblinAlchemist.mdx`](https://www.hiveworkshop.com/casc-contents?path=units%2FCreeps%2FHeroGoblinAlchemist%2FHeroGoblinAlchemist.mdx&game=wc3&context=sd) | 保留地精骑食人魔的完整双人结构、接触比例和药剂装具。 |
| `jugg`／剑圣 | [`units/Orc/HeroBladeMaster/HeroBladeMaster.mdx`](https://www.hiveworkshop.com/casc-contents?path=units%2FOrc%2FHeroBladeMaster%2FHeroBladeMaster.mdx&game=wc3&context=sd) | 绿皮兽人、长刀、背旗；使用源模型旋风动作。 |
| `kael`／召唤师 | [`Units/Human/HeroBloodElf/HeroBloodElf.mdx`](https://www.hiveworkshop.com/casc-contents?path=Units%2FHuman%2FHeroBloodElf%2FHeroBloodElf.mdx&game=wc3&context=sd) | 金发尖耳、白色分层长袍与金边；头顶三球由游戏绘制。 |
| `luna`／月之骑士 | [`units/nightelf/huntress/huntress.mdx`](https://www.hiveworkshop.com/casc-contents?path=units%2Fnightelf%2Fhuntress%2Fhuntress.mdx&game=wc3&context=sd) | 完整女骑手与四足黑豹，保留鞍位、尾巴和手持月刃。 |
| `tb`／灵魂守卫 | [`units/nightelf/evilillidan/illidanevil.mdx`](https://www.hiveworkshop.com/casc-contents?path=units%2Fnightelf%2Fevilillidan%2Fillidanevil.mdx&game=wc3&context=sd) | EvilIllidan 普通形态，保留角、翼、绿纹和双刃。 |

`tb-demon` 与 `tb` 使用同一 EvilIllidan 源文件的 Alternate 序列，不虚构一份独立恶魔原模型。RazorMane、RazorManeChief 和 HeroDemonHunter 只作备用对照；猜测路径返回的 404 未当作模型使用。Luna 使用 Huntress 原型，而非声称获得某个历史 DotA 地图的完整打包角色。

下表对应本轮主模型，哈希为 SHA-256。转换输出仍仅供本地研究；Kael 的白袍修改发生在独立派生纹理中，MDX 转换哈希不包含该 PNG。

| ID | 原文件 SHA-256（v1800） | 兼容输出 SHA-256（v1000） |
| --- | --- | --- |
| `rover` | `c61242624ea471c3aabda64b740c862c1786eadd505008178a69794465c1cb0b` | `f7affce2e5b546dafe924c1ec0835581bbb2954689e52b0705b50cdaeda924bd` |
| `bulwark` | `b20afcd3b8b51b70a87822cd3162c150cdc5317cd64248705398fd9060de8ea4` | `92b805da53fce15df92546699261807fb50ae6005c56b7a5e94a0e75c6ef41f0` |
| `conductor` | `b52747fc7cfd6b925d1733d9440e925a5a4726b7c2cb89c33d36b6b1e9ad0039` | `920dc2202f7d8f734783c1a086d8b450af9de90c7fb556691aa35d013e7fb302` |
| `scavenger` | `1e60341663d668a7c87d934385dd6acaab0d085d929e15bf9ddc8e81e10caf26` | `7e069611ac7fe120a98082ac319aadbd148b12b78c7fe1305409ea5a36f6e67d` |
| `jugg` | `0464bc7095533aad067439d9e47cda341209b70456f1e24906099ada8547a961` | `372302a29b2e53dc57380e0e90518430e2f1bf9fcce97b3bc80cdd03f94a9358` |
| `kael` | `3b65af85d46b872454fcb1139ab37716833aa623e7b4ff57a0dfa674727449ce` | `7d09c05914a9c01e4ca86c31e04c0efa3e514bc3966dcaf95f469b7075ec2a80` |
| `luna` | `ac026c20cd52ecc91864e8859560f2cf3ddcd4fd6264c3b2f13076a7e2afa197` | `2f90260d4bae587180a7812fd5a36145785ac16f4e1b8db8c73e548ce45c0c48` |
| `tb` | `5dbc1bd14ec1f1922c162c629b48c85a2ba121c3d38d771d74c1a4ec15ae96cd` | `e5fa43d9d5d1b70655d89807d84f37658e79d7c6df47348ab058088618ac3594` |

## 完整依赖与兼容转换

查看器沿用 npm `mdx-m3-viewer@5.12.0`。该版本直接读取本轮 v1800 的材质结构会失败，因此本轮执行结构转换到 v1000，没有只改 `VERS` 数字或丢弃材质后冒充完整模型。格式依据为 WhiteoutLib 固定提交 [`92887f9156cdaca8966b3b58e2625628aa0c2c30` 的 MDX 规范](https://github.com/FernandoS27/WhiteoutLib/blob/92887f9156cdaca8966b3b58e2625628aa0c2c30/docs/MDX_FILE_FORMAT_SPECIFICATION.md)及同提交解析实现。

- 材质补入旧读取器要求的 shader 字段；读取 SD SubTexture 的实际 texture ID，将 KMTF 纹理动画移到旧 Layer 字段，保留 opacity、emissive、fresnel 动画并重新计算结构长度。
- TB 灯光保留旧字段、节点变换和旧动画，省略查看器不支持的新阴影／衰减字段。刚背 camera 的 packed variant 解码为旧结构，保留位置、目标和旋转轨道；不把现代扩展字段误读为旧动画。
- `TEXS`、`GEOS`、`BONE`、`HELP`、`SEQS`、`GEOA`、粒子、事件、pivot 和碰撞等其余块按转换清单逐块保留。遇到未实现的现代加权蒙皮子流时拒绝转换，不猜测布局。
- 八个主模型加三个对照共 11 个转换输出，均通过该查看器的真实 parser、内存 save 和重新 parse。该检查说明结构可读；纹理、光照、相机和最终画面另外以 WebGL 导出与审图核对。

依赖按模型 TEXS 和实际事件表补齐，包含替换纹理、TeamColor、TeamGlow、粒子、ribbon 与 glow。本轮 `.blp` 路径实际常返回 `DDS ` 载荷，加载器按 magic 识别，并统一反斜线、大小写与 `.dds`／`.blp` 别名。依赖没有以“待机看不见”为由省略。

事件资源保留真实的三张 SLK 表、八个 spawn 模型和六张相关纹理；spawn 模型亦转换。Luna 的 `FPTXFPR02`／`FPTXFPL02` 在所取得的源表中没有对应行，查看器跳过它们，本轮没有伪造别名。查看器完整等待依赖加载后，采样时只禁用事件类型 **SPL、UBR、SND**，使脚印／地面 splat 与声音不烘焙进随角色移动的 PNG；PRE2、ribbon、模型自身效果及其他事件保持。查看器音频默认关闭，本轮没有制作或验证新角色声音。

## 可复现动作采样

所有形态使用固定种子 `143773`、`1000/60ms` 模拟步长和 `1400ms` 预热。每次采样清空 emitted objects，重设待机、推进预热，再进入目标序列并推进到固定相位；导出随机数仅用于离线渲染，不改游戏战斗随机数。动作按实际名称匹配，并将匹配后的索引和区间写进逐帧报告。

前／侧均使用九键：`idle-a`、`idle-alt`、`walk-a`、`walk-b`、`dash`、`attack-windup`、`attack`、`attack-release`、`skill`；侧身文件加 `side-`。对应相位依次为 `0.25、0.65、0.20、0.70、0.35、0.12、0.46、0.80、0.40`。前两个采待机，随后三个采行走，攻击三段取同一 Attack 序列，最后一个采技能。

| 形态 | 待机 | 行走 | 攻击 | 技能适配 |
| --- | --- | --- | --- | --- |
| `rover` | `Stand` 67–1400 | `Walk` 78100–78933 | `Attack` 13200–14067 | `Spell` 146033–147300 |
| `bulwark` | `Stand -1` 3333–5333 | `Walk` 30000–30667 | `Attack - 1` 36667–37800 | `Stand Hit` 43333–43833 |
| `conductor` | `Alternate Stand - 1` 65167–66667 | `Alternate Walk` 83333–84167 | `Alternate Attack -1` 79967–80967 | `Alternate Spell Slam` 90300–91200 |
| `scavenger` | `Stand` 333–1567 | `Walk 1` 9333–10333 | `attack one -1 NEW` 7167–8500 | `Attack two Spell - New` 16000–17333 |
| `jugg` | `Stand` 30500–31667 | `Walk` 28767–29500 | `Attack` 14333–15500 | `Attack Walk Stand Spin` 56667–57100 |
| `kael` | `Stand` 1500–3000 | `Walk` 9667–10600 | `Attack` 20000–21500 | `Spell` 26667–28167 |
| `luna` | `Stand` 333–1667 | `Walk` 3333–3967 | `Attack -1` 10000–11000 | `Spell` 150667–151667 |
| `tb` | `Stand` 167–1567 | `Walk` 27000–27867 | `Attack` 19100–20167 | `Spell` 41800–42567 |
| `tb-demon` | `Stand Alternate` 60800–61733 | `Walk Alternate` 62800–63567 | `Attack Alternate` 70567–71500 | `Spell Alternate` 71700–72633 |

区间单位为模型毫秒。当前主模型没有独立 Dash 动作，因此 `dash` 是 Walk 固定相位的本作适配。刚背没有 Spell，使用 `Stand Hit` 表达身体反应；剑圣使用 `Attack Walk Stand Spin`。这些适配没有新增或改变本作技能规则。山丘使用真实 Alternate 石像序列与源材质动画，未以整身染色假装 Avatar。TB 陆地 Walk 与 Alternate 分开选择，没有混用 Walk Swim 或备用模型索引。

相机为正交投影 `[-span,+span]`，near／far 为 `1／5000`，up 为 `[0,0,1]`，目标 `[0,0,targetZ]`；前视位置 `[800,0,650]`，侧视 `[0,-800,650]`。两种视角保持每形态相同 span 和 targetZ，具体值见下表。

## 共同画幅、显示尺度与脚点

先采完一个形态的 18 个姿态，计算全部 alpha 的联合边界，再统一裁切：横向以源画布中心对称，纵向按联合边界加入留白，目标联合可见高度约为画幅的 88%。所有姿态共享同一画幅、裁切、像素比例和原点，禁止逐帧 fit。源画布触边会记入错误；最终每形态报告均无此错误。

显示高度与整幅特效画布分开测量。`idleBodyPixels` 为正／侧 `idle-a` 中 alpha≥200 的可见高度较大值；它可能包含背旗等实心附件，不能当作人体净身高。`H = bodyTarget × frameHeight / idleBodyPixels` 是整张 PNG 的游戏绘制高度。`groundY` 是世界原点 `[0,0,0]` 投影到裁切图中的像素 y，`bottomRatio = 1 − groundY/frameHeight`；本地绘制使用 `bottom = H × bottomRatio`，使该投影脚点在未叠加游戏身体起伏前对齐角色原点。

| 形态 | span／targetZ | PNG宽×高 | bodyTarget／idleBodyPixels | 绘制高度H | groundY | bottomRatio |
| --- | --- | --- | --- | ---: | ---: | ---: |
| `rover` | 150／45 | 550×439 | 58／170 | 149.7765 | 296 | 0.325740319 |
| `bulwark` | 170／65 | 226×213 | 76／163 | 99.3129 | 171 | 0.197183099 |
| `conductor` | 190／75 | 318×279 | 62／146 | 118.4795 | 199 | 0.286738351 |
| `scavenger` | 240／95 | 288×322 | 92／243 | 121.9095 | 243 | 0.245341615 |
| `jugg` | 430／80 | 412×370 | 124／130 | 352.9231 | 297 | 0.197297297 |
| `kael` | 220／85 | 288×290 | 90／166 | 157.2289 | 203 | 0.300000000 |
| `luna` | 220／70 | 312×237 | 92／158 | 138.0000 | 182 | 0.232067511 |
| `tb` | 240／95 | 540×471 | 94／229 | 193.3362 | 340 | 0.278131635 |
| `tb-demon` | 300／125 | 446×362 | 120／208 | 208.8462 | 262 | 0.276243094 |

H 与 bodyTarget 使用游戏世界绘制单位，其余图像测量使用像素。剑圣的 352.9231 是包含原模型大旋风效果的整张图高度；124 的待机目标还包含高背旗，不等于把身体画成 353 高。Luna 的整组骑乘按原宽高比绘制，炼金完整保留地精和食人魔。TB 两形态分别定标，但都以各自同一世界脚点对齐。

队伍色：火枪与 TB 为 6，山丘与 Luna 为 1，刚背、炼金、剑圣为 0。Kael 配置为 0，解析器将其 TeamColor00 映射到白色 TeamColor21、TeamGlow00 映射到紫色 TeamGlow03；没有更改其他英雄的队伍纹理映射。

## 透明、白袍与特殊材质

每次保留查看器原透明 pass，同时在完全相同的冻结状态分别渲染黑底、白底。利用两底差估计覆盖率，并保留黑底加色亮度作为 alpha 下界，生成单 PNG；没有按黑色色键删除身体。该方法是对实时加色效果的近似，不能等同完整实时材质合成。最终 PNG 仍分别在浅／深底和游戏画面检查。

Kael 使用独立的 `kael-white-fullrobe-v1.png` 派生纹理：通过固定 UV 区域与 HSV 遮罩，把红衣和深色袍片映射成保留原明暗的暖白；保护金发、脸、手部、金色细节与所有 alpha 字节。原纹理没有被覆盖。源纹理 SHA-256 为 `9d69c6c5c251a188c8f550136a6dbd4752366f548867bc42f092435a5d457ca9`，所用白袍 PNG 为 `08994ac7329ecdedbfc018b446232773820905c48f848620fb83050f4b23345b`。白色脚光样片曾令袍摆过曝，最终换成紫色 glow 并复看。

模型的三个 DummyBall 附件是空锚点，没有自带可见三球几何或粒子。本轮保留游戏 Canvas 绘制的冰／雷／火三元素与前后分层，DotA1 轨道中心从 `y=-64` 提到 `y=-88` 适配新头部位置，普通版仍按原位。模型左右手的 PRE2 施法光继续保留，不能为避免三球重复而一起删掉。三球不在 162 张 PNG 内，须在实际游戏中验收。

TB 恶魔的纯黑身体来自源材质，不是缺图回退：转换保留 material 3/layer 0 到 TEXS[2] `Textures/Black32.blp` 的绑定，相关 geoset 有 411 顶点。该纹理实际为 32×32 DDS，RGB 全为 0、alpha 全为 255，SHA-256 为 `8d8ca745c4e084010c9be6a3e6fc4a01d15ef40b70ca5f5bfaf1cfe23bfb45ca`。因此深色背景上的内部细节有限；绿色效果和角翼、爪臂／腿剪影承担主要辨识。

## 本地接入与已经验证的范围

本地研究服务读取当前正式 `game.js`，通过精确匹配断言替换 DotA1 角色帧地址和 TB 恶魔帧地址，模型 PNG 使用上表尺度与脚点；影魔引用上轮研究帧。模型帧关闭旧 SVG 上／下身行走拼接，防止完整模型被二次裁开。其余玩法、地图、技能特效和普通图片仍由当前游戏代码消费。标题／暂停的普通皮肤与 DotA1 选项、旧设置回退沿用现有入口，未建立独立玩法分支。

验证分层记录如下，各层互不替代。

| 层次 | 本轮实际结果 | 不能由此推出的结论 |
| --- | --- | --- |
| 资源与结构全量 | 162 PNG 名称齐全，每形态 18 张同尺寸且匹配显示配置；RGBA、非空、四边至少 12px 透明留白。最终帧与对应时间戳原件逐字节一致，162 份最终报告 `errors` 为空。 | 不等于 162 张逐张视觉审美通过，或所有动作都自然实战触发。 |
| 独立视觉审阅 | 九形态的正／侧 `idle-a`、`attack`、`skill`，共 54 张代表帧在浅／深底实际看图；炼金与 Kael 更新后重看，山丘侧面攻击另单张检查。未见身体、主要武器、背刺、骑乘或翼尖被画幅截断。 | 其余 108 张没有逐张独立视觉通过证明；静态图不证明脚点连续性或特效叠加。 |
| 真实入口短流程 | 从游戏选择页进入其他八英雄的第 1 波，实际操作移动、Q、冲刺、暂停及普通↔DotA1 切换；暂停换肤前后可见属性与技能状态文本相同。TB 以自然 Q 进入恶魔形态，并观察计时结束回到普通形态。 | 不是每名英雄完成整波或长局；不代表每个动作、装备组合、旧存档及全部成长分支已覆盖。 |
| HTTP与哈希 | 本地服务 162 张 PNG 均 HTTP 200、`image/png` 且与磁盘字节一致；选择页、游戏页和当前动态脚本均 HTTP 200。168 条已登记原料哈希、11 个主／对照转换模型前后哈希及声明 byteExact 的块通过。 | 不代表公开部署、项目子路径或第三方许可已验证。 |
| 语法与仓库检查 | renderer、诊断与本地服务当前脚本 Node 语法通过；静态路径检查 24 页／323 引用通过；`git diff --check` 通过。卫生检查无根污染或已跟踪本机产物，保留 34 条既有所有权提醒。 | 静态路径扫描不能证明动态资源或真实交互；这些结果只对应检查当时的工作树。 |

剑圣自然 Q 的截图已显示原模型红色旋风与 Canvas 风暴范围同时存在，主体和长刀仍可见；卡尔自然抽到寒冰之墙后回响，白袍与头顶三个独立元素球可见；TB 已看到普通、黑色恶魔和计时结束后的普通形态及魔影。这些是本轮代表状态的画面观察，不是全部动作、全部地图背景或所有特效叠加的通过证明。

本地研究版的攻击反馈继续以模型 `attack-windup`→`attack`→`attack-release` 为主体。影魔保留用户已确认的三爪魂火；其他八英雄分别补枪口短闪、锤斧雷弧、三元素施法、银蓝月刃、刚背短爪痕、炼金和剑圣刀尖残迹、TB普通双刃及恶魔双爪。新增轨迹在 `BASE_ATTACK_STRIKE_TIME/.42`（当前约38.1%）之后出现，复用实际攻击时长、玩家位置和暂停时间；伤害、冷却、射程、弹道与碰撞规则不变。新增层仅在DotA1研究皮肤绘制，普通皮肤保持原表现；该增强只在4196本地响应中，不写入正式 `game.js`。

连续画面审阅纠正了两类问题：模型武器与旧Canvas武器重复，故研究皮肤跳过旧武器实体；火枪腰部旧枪焰与模型枪口形成双发射点，故替换旧muzzle并按模型前／侧枪口补短闪，保留模型原烟。炼金和剑圣最初按连续目标角度画大弧，与离散前／侧模型脱节，最终按攻击／收势PNG刀尖坐标、相同镜像／抬升／缩放画局部短残迹。刚背与TB保留各自短挥击，宙斯仍按远程雷击结算。新增反馈有减少动态效果分支，但本轮未实际切换系统偏好验证。

最终构建从选择页逐个进入九英雄第1波，保存连续战斗截图；TB自然Q变身及计时恢复均实际观察，影魔另行回归。每次暂停普通→DotA1切换的属性／技能文本一致，本地诊断均0错误；普通剑圣另进入战斗，原有武器绘制仍可见。独立看图确认火枪双发射点及炼金／剑圣悬空括号消失，主体未被新增轨迹盖住。月骑离手月刃清楚，但近手短线较淡；TB恶魔爪线与源模型绿烟较难区分，不能把这些截图当作所有方向精确衔接的证明。最终截图为本机 `attack-v4-*`，早期 `attack-v3-*` 保留为中间版本证据。

页面补验：桌面1280×720已看代表战斗；390×844月骑、844×390 TB使用实际对应尺寸的受控iframe，从选择页进入，实际点击屏幕技能／冲刺按钮、换肤并比较状态文本。iframe根元素宽度与scrollWidth分别为390／390、844／844，未见横向溢出；暂停时切换尺寸后可继续操作。这里使用键盘和指针，不属于手机硬件、真实触控摇杆或设备转屏测试。浏览器视口覆盖未可靠立即生效，因此没有用请求尺寸冒充实际测得尺寸。影魔另在实际390×844对局回归，仍使用此前帧。

受控禁脚本sandbox中基础说明可读，并实际点击“返回游戏列表”到达选择页；不等同浏览器原生关闭JavaScript。桌面游戏页控制台未捕获warn／error，各英雄本地诊断均为0条错误；禁脚本容器的预期脚本阻止不计作游戏应用错误。

**未覆盖**：真实手机／摇杆、全英雄全部动作自然触发、全部地图／主题、项目子路径、非空装备换肤守恒、商店、长局／后期波次及声音听感。桌面与受控视口的短流程不替代这些项目，也不引用旧版通过记录补齐。

## 证据回源与产物清点

正式文档只保留这份制作记录；本机研究文件不提交。以下为相对仓库根的本机证据位置，不能当作公开站点必然可访问的资源链接。

| 本机位置 | 用途与保留状态 |
| --- | --- |
| `.tmp/characters-model-study-20261029/assets/` | 原模型／纹理、备用候选、Kael 派生纹理与遮罩、逐文件来源 JSON、结构记录和转换清单；保留，不覆盖原字节。 |
| 同任务 `tools/`、`render/` | Python 下载／兼容转换／检查工具、固定查看器依赖、最终配置、162 帧与每次带时间戳的报告、原透明 pass 和未裁切图；保留用于复现。 |
| 同任务 `game-study/` | 本地响应覆盖服务、显示参数与诊断；本地研究接线，不是正式 runtime。 |
| 同任务 `review/independent-20261028T173647Z/` | 54 代表帧浅／深底联系图、输入哈希及独立观察记录；保留。 |
| `.logs/actual-test/characters-model-study-20261029/` | 渲染／HTTP日志、`actual-hero-flows.json` 和本轮验证记录；保留。结构最终检查回源 `final-check-20261028T175001Z/report.json`。 |
| `.playwright-mcp/characters-model-study-20261029/` | 真实浏览器截图；保留，由主验证记录标注实际覆盖状态。 |
| `.tmp/sf-local-study-20261028/` | 上轮影魔源、18 帧及研究证据继续保留；本轮复用其已确认结果。 |

转换清单为 `assets/converted/conversion-manifest.json`，动作与相机配置为 `render/heroes.json`；各形态最终 runId 由 `game-study/display.json` 的 `sourceReport` 指向，不使用研究中较早失败或过曝样片冒充最终输出。源来源回源 `four-model-sources.json`、`bulwark/sources.json`、`kael/sources.json`、`elf-model-sources.json` 和 `event-resource-sources.json`，Kael 派生回源其独立 JSON。

备用模型、仅红区白袍对照、早期失败加载与改光前样片目前均保留，供比较和追溯；未授权清理，不删除旧证据或其他任务产物。后续正式接入须另行核实素材条款、建立正式来源清单与本地静态资源路径，再用正式构建重新走真实入口。
