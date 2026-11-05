# Warcraft III／DotA1 参考音频来源

当前运行文件位于 `game/static/dotarogue/assets/audio/dota1/`；逐文件来源、固定版本、哈希、时长和消费者由 [sources.json](sources.json) 维护，播放契约见[声音系统](../../../core/声音系统.md)。浏览器只读取站内文件。

## 刚背兽原音（2026-11-05）

从既有刚毛音效的同一来源 `ZephyrVentum/Warcraft3-Soundboard` 固定提交 `09106ddd8f35bcdb03b8281a4920289db7f57506` 选择六个短录音。源目录为 `app/src/main/res/raw/`，源码 `app/src/main/java/ventum/zephyr/wc3soundboard/neutral/BristlbackObject.kt` 将它们与已有刚毛命中音归入同一个 Bristleback 单位音组；`app/src/main/res/values/strings.xml` 将其标注为猪哼声，没有可翻译成中文的完整句子。

| 原文件 | 运行文件 | 本作事件 |
| --- | --- | --- |
| `bristlebackwhat1.mp3`、`bristlebackwhat2.mp3` | `bristleback-what1.mp3`、`bristleback-what2.mp3` | 选择英雄 |
| `bristlebackyes1.mp3`、`bristlebackyes2.mp3` | `bristleback-yes1.mp3`、`bristleback-yes2.mp3` | 开战、胜利 |
| `bristlebackyesattack1.mp3`、`bristlebackyesattack2.mp3` | `bristleback-attack1.mp3`、`bristleback-attack2.mp3` | 成功主动技能、精英击杀 |

六文件共 36,945 字节，每段约 0.44–0.73 秒。运行文件仅重命名，字节与固定提交的 Git blob 一致；未变调、裁切或重新编码。已解码为 22050Hz 单声道 PCM，六段均有非零信号且没有削波。文件核验不等同人耳听测。

## DotA 刚背兽音组对应

公开编辑器数据重建版 [OpenDotA 6.83d · Ver_01](https://github.com/ifshuaishuai/OpenDotA-6.83d/releases/tag/Ver_01) 的 `war3map.w3u` 中，英雄对象 `H008`（基于 `Hapm`）为 `unam=Bristleback`、`upro=Rigwarl`，`umdl=units\creeps\RazorMane\RazorMane`、`usnd=RazorMane`。地图文件 SHA-256 为 `2cbf5400edff93d274b2343756f8a79938fc07a7cca24c24f60f066f4b915c5d`，与发布附件的 digest 一致；本轮只读解包单位元数据，没有执行地图脚本。

Warcraft III 原始 [UnitAckSounds.slk](https://cdn.hiveworkshop.com/assets/wc3/war3.w3mod/ui/soundinfo/unitacksounds.slk)（495,275字节，SHA-256 `9d2f9211686116e8d840fd22b0948c70e112254f5b13a76f4b895f85fb498dd6`）明确把 `RazorManeWhat`、`RazorManeYes`、`RazorManeYesAttack` 映射到 `Units/Creeps/BristleBack/` 下对应的 `BristlebackWhat*`、`BristlebackYes*`、`BristlebackYesAttack*` 文件；它们与 `Bristleback` 组三组文件完全相同，基础 Pitch 均为1。因此不能因为音组名不同，就将这批文件误判为其他单位的声音。

经典WAV版的 [UnitAckSounds.slk](https://xgm.guru/files/100/192737/comments/353339/UnitAckSounds.slk?cache-tag=1498324420) 由2017年社区问答提供 `war3.mpq` 导出表，完整282,760字节，SHA-256 `aa6842e8c665364fca11e1080674bc74e6ed054e043ba0724f83e50a252a3376`；表格609–612行同样将 `RazorMane` 的选择、攻击、行动与就绪音映射到 `Units\Creeps\BristleBack\` 下对应WAV，与 `Bristleback` 组逐项一致。

两版原表分别记录经典MPQ的WAV和当前CASC的FLAC路径，声板提供MP3版本；本轮确认音组与文件身份，不宣称MP3与游戏FLAC／经典WAV容器逐字节一致。公开地图为编辑器数据重建版，不称官方原始地图逐字节提取。事件在本作中的映射仍属于改编。

每个事件在对应两段间依次轮换，重开重置；只预取当前事件的一对样本。低生命、失败和录音不可用时不朗读原创短句，保留其他战斗音效。三语言界面使用相同原录音。

## 来源与权利边界

- [来源应用](https://github.com/ZephyrVentum/Warcraft3-Soundboard/tree/09106ddd8f35bcdb03b8281a4920289db7f57506) 将资源描述为 Warcraft III 游戏声音；原始声音权利仍归 Blizzard Entertainment。
- 应用代码的 MPL-2.0 不作为游戏录音的开放媒体许可；本记录不新增或声称获得开放媒体授权。公开可访问与再许可分开记录。
- 上述证据连接了 DotA 刚背兽的 `RazorMane` 配置和共用的 `Bristleback` 原音组；声音文件来自社区声板，不称地图直接提取包。本作技能与胜利事件映射属于改编，不声称原地图有完全相同的事件。
- 其余十六条经典英雄录音及四个音效沿用清单中的来源和对应边界。
