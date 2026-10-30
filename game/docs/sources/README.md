# 素材来源与离线生成

本目录保存《DotaRogue》的公开素材来源清单、可编辑输入、Concept 图片、实际提交文本和离线生成器。设计正文、提示词 Markdown 与审阅说明仍归 [角色资料](../characters/README.md)；浏览器直接加载的文件统一位于 `game/static/dotarogue/assets/`，生成器不是浏览器运行依赖。

| 位置 | 用途 |
| --- | --- |
| `characters/<id>/art/source/` | 原有八名英雄的前视 `*-hero.svg` 与右向侧身 `*-side.svg`，共 16 份可编辑生成输入。 |
| `characters/<id>/art/concept/`、`art/comparison/`、`art/review/` | 原图、透明处理、对照和已保留的静态审阅图；不作为战斗动作帧。 |
| `characters/<id>/manifest.json` | 角色来源、素材路径与制作状态；文件路径相对于该 manifest。 |
| `art/dota1/manifest.json`、`audio/dota1/sources.json`、`art/pixel/enemy-expansion-sources.json` | 正式静态文件的来源、用途和 SHA-256；`pathBase` 明确标注仓库根目录基准。 |
| [art/dota2-arcade/](art/dota2-arcade/) | 《守望轮回谷》25 件成品游廊原图的核验记录；运行 PNG 位于 `game/static/dotarogue/assets/art/dota2-arcade/equipment/`，此处登记来源、名称映射、解码尺寸、哈希与权利状态。 |
| [art/dota1/equipment-cutouts/](art/dota1/equipment-cutouts/README.md) | 22 种经典装备本体的原图蒙版、离线抠图生成器、来源与产物哈希；正式透明 PNG 位于静态素材目录。 |
| [守望轮回谷-红杖成长参考.md](守望轮回谷-红杖成长参考.md) | 公开历史页面与本作红杖／法术装备成长的抽象边界；不作为当前数值或原作完整规则证明。 |
| [migration-manifest.json](migration-manifest.json) | 2026-10-27 来源目录迁移前后的逐文件映射与校验值。 |
| [characters/dota1/model-study-20261029.md](characters/dota1/model-study-20261029.md) | 影魔之外八英雄及 TB 恶魔形态的本地模型研究记录；只保留公开安全的来源与制作事实，模型、纹理及 PNG 研究产物不属于正式运行资源。 |

六名早期角色 manifest 中的 `character`、`skillIcons`、`activeEffect` 保留旧 Concept 命名，`audio.voiceDir`／`skillDir` 保留计划目录；它们不表示已有对应文件或当前运行消费者。当前角色帧以 `assets.runtime` 为准，声音来源与事件以[声音系统](../core/声音系统.md)为准。灵魂守卫四张全身图和 36 张帧由 `characters/tb/build_art.py` 的路径几何生成，正式文件全部归静态目录。

## 输入与输出

从仓库根目录运行以下命令。脚本通过自身文件位置定位默认输出，从其他目录以脚本的完整地址运行也得到同一正式目录。

```sh
python3 game/docs/sources/characters/build_pose_frames.py
python3 game/docs/sources/characters/build_side_pose_frames.py
python3 game/docs/sources/characters/tb/build_art.py
python3 game/docs/sources/art/effects/fire/build_textures.py
python3 game/docs/sources/art/effects/wind/build_textures.py
```

前两个生成器从 16 份 `art/source/` 输入生成各英雄的九张前视或侧身静态帧；前视生成器也生成 Kael 头像。它们同时把相应输入复制到静态目录，作为公开预览快照；修改时编辑本目录的输入，再重新生成。`game/static/dotarogue/assets/characters/<id>/` 中的 `*-hero.svg`、`*-side.svg` 是发布副本，不是另一套编辑源。

| 生成器 | 默认输出根目录与相对子路径 | 可选参数 |
| --- | --- | --- |
| `build_pose_frames.py`、`build_side_pose_frames.py` | `game/static/dotarogue/assets/characters/`，追加 `<id>/` | `--hero kael` 等可只生成一名英雄；`--output-root <目录>` 改为指定角色输出根目录。 |
| `tb/build_art.py` | 同一角色输出根目录，追加 `tb/`，生成 41 张 SVG | `--output-root <目录>`；`--review` 可额外生成审阅 PNG，默认写入新的 `.tmp/tb-art-review/<时间>/`；`--review-dir <目录>` 显式指定审阅位置。 |
| `fire/build_textures.py` | `game/static/dotarogue/assets/art/effects/`，追加 `fire/png/smoke.png` | `--output-root <目录>` 指定特效素材根目录。 |
| `wind/build_textures.py` | 同一特效素材根目录，追加 `wind/png/dust.png` | `--output-root <目录>` 指定特效素材根目录。 |

SVG 生成器只需 Python 标准库；烟、尘纹理需要 Pillow。灵魂守卫可选审阅额外需要 CairoSVG 与 Pillow。已有的审阅 PNG 保留在本目录，新审阅默认写入 `.tmp/`，避免覆盖既有证据。

## 本次迁移与验证边界

本次逐文件核对剩余 271 份来源文件：其中 68 份其他来源文件与 16 份可编辑 SVG 输入迁移至本目录，共 84 份。全部 203 份角色运行 SVG 与正式静态目录逐张 SHA-256 相同；其中这 16 份保留为生成输入，其余 187 份重复输出合并至正式目录。唯一内容均保留，映射中的 `sha256` 为调整生成器与清单文字前的值，`currentSha256` 为迁移收尾后的文件值。

本次只进行生成器语法、路径与现有资源校验，未执行生成器或重新生成素材；旧制作记录中的生成、拼版和浏览器结论仍保留其原有时间与覆盖范围。当前页面验收回源 [游戏 README](../../README.md)。

正式保留项为本目录来源资料、16 份编辑输入与静态目录发布文件。本次本机校验及修复脚本保留在 `.tmp/game-source-layout-20261027/`，不提交；没有清理或覆盖其他任务证据。
