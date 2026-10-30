# 《守望轮回谷》游廊装备图标

本目录登记封神之刃（`godsealBlade`）、灾星之戒（`calamityRing`）、圣洁斗篷（`holyCape`）、冰龙之喉（`iceDragonMaw`）、犼妖之灵（`radianceHeart`）、陨星魔典（`meteorGrimoire`）、狂月之光（`shineMadmoon`）、守夜大剑（`bladeOfVigil`）、阿哈利姆法戒（`ringAghanim`）、碧玉匕首（`jasperDaggers`）、祛魔之槌（`demagickingMaul`）、戮尽斗篷（`cloakOfCarnage`）、暗影灾劫（`shadowDisaster`）、浩劫之锤（`havocHammer`）、极寒核心（`eyeOfFrost`）、新月弓（`crescentBow`）、抹灭法球（`obliteratingOrb`）、神珍（`pinOfTheSea`）、否决挂饰（`nullifier`）、巫祭短剑（`paladinSword`）、三恒照世（`yashaKayaSange`）、万物破除者（`eliminatorOfInfinite`）、地球核心（`earthCore`）、莫比乌斯吊坠（`mobiusPendant`）与幽冥渗透者短剑（`netherInfiltratorShortSword`）的原图来源。用户指定运行界面直接采用对应 Dota 2 游廊图标；2026-10-29 至 2026-10-30 已从《守望轮回谷》公开工坊内容取得并解码二十五张成品纹理，完成中文名称、物品定义与纹理文件的对应核验。运行文件归 `game/static/dotarogue/assets/art/dota2-arcade/equipment/<id>.png`，本目录不重复保存运行图片。

## 来源与版本

- [Steam 创意工坊来源](https://steamcommunity.com/sharedfiles/filedetails/?id=3164617180)，Workshop ID `3164617180`，Dota 2 App／Workshop Depot ID `570`；核验时条目标题为 `Watcher of Samsara:VG-Fast Match`，作者栏列有 QWERTY、Ninja、EOM Studio。
- 本次取得的内容 manifest 为 `5777761988453206175`；PublishedFile 记录的 revision change number 为 `71`、更新时间为 `2026-10-09 08:40:24 UTC`。这些信息只标识本次取得的版本，不保证后续工坊内容保持相同。
- manifest 列出的工坊包为 `3164617180.vpk`，大小 `672878863` 字节。通过匿名 Steam 会话取得公开内容信息，按 SteamPipe chunk 读取 VPK 目录及所需文件；未下载整个工坊包。下载 chunk 在解密后核对 SHA-1，提取文件按 VPK 目录核对 CRC32。
- 本轮只保留下述二十五件未封印成品的图标。封印版有独立纹理，不以封印版代替成品，也不以其他 Dota 装备图片代替。

## 名称与纹理映射

中文名称来自工坊包的 `localization/schinese/item/*.txt`，定义及 `AbilityTextureName` 以包内 `scripts/npc/npc_items_custom.txt` 与对应物品脚本记录为准；表中二十五项名称均按包内定义与本作 ID 完成对应核对，封神之刃与灾星之戒的英文本地化分别为 `APOTHEOSIS BLADE★` 与 `RING OF DISASTER★`。

| 本作 ID | 工坊中文名称 | 工坊物品 ID | AbilityTextureName | 工坊纹理文件 |
| --- | --- | --- | --- | --- |
| `godsealBlade` | 封神之刃★ | `item_apotheosis_blade` | `item_apotheosis_blade` | `panorama/images/items/apotheosis_blade_png.vtex_c` |
| `calamityRing` | 灾星之戒★ | `item_ring_of_disaster` | `item_ring_of_disaster` | `panorama/images/items/ring_of_disaster_png.vtex_c` |
| `holyCape` | 圣洁斗篷 | `item_holy_cape` | `item_holy_cape` | `panorama/images/items/holy_cape_png.vtex_c` |
| `iceDragonMaw` | 冰龙之喉 | `item_ice_dragon_maw` | `item_ice_dragon_maw` | `panorama/images/items/ice_dragon_maw_png.vtex_c` |
| `radianceHeart` | 犼妖之灵 | `item_radiance_heart` | `item_radiance_heart` | `panorama/images/items/radiance_heart_png.vtex_c` |
| `meteorGrimoire` | 陨星魔典 | `item_meteor_grimoire` | `item_meteor_grimoire` | `panorama/images/items/meteor_grimoire_png.vtex_c` |
| `shineMadmoon` | 狂月之光 | `item_shine_of_the_madmoon` | `item_shine_of_the_madmoon` | `panorama/images/items/shine_of_the_madmoon_png.vtex_c` |
| `bladeOfVigil` | 守夜大剑 | `item_blade_of_the_vigil` | `item_blade_of_the_vigil` | `panorama/images/items/blade_of_the_vigil_png.vtex_c` |
| `ringAghanim` | 阿哈利姆法戒 | `item_ring_of_aghanim` | `item_ring_of_aghanim` | `panorama/images/items/ring_of_aghanim_png.vtex_c` |
| `jasperDaggers` | 碧玉匕首★★★ | `item_jasper_daggers` | `item_jasper_daggers` | `panorama/images/items/jasper_daggers_png.vtex_c` |
| `demagickingMaul` | 祛魔之槌★★★ | `item_demagicking_maul` | `item_demagicking_maul` | `panorama/images/items/demagicking_maul_png.vtex_c` |
| `cloakOfCarnage` | 戮尽斗篷★★★ | `item_cloak_of_endless_carnage` | `item_cloak_of_endless_carnage` | `panorama/images/items/cloak_of_endless_carnage_png.vtex_c` |
| `shadowDisaster` | 暗影灾劫★★★ | `item_havoc_hammer_custom` | `item_shadow_disaster` | `panorama/images/items/shadow_disaster_png.vtex_c` |
| `eyeOfFrost` | 极寒核心 | `item_eye_of_frost` | `item_eye_of_frost` | `panorama/images/items/eye_of_frost_png.vtex_c` |
| `crescentBow` | 新月弓 | `item_crescent_bow` | `item_crescent_bow` | `panorama/images/items/crescent_bow_png.vtex_c` |
| `obliteratingOrb` | 抹灭法球★★ | `item_obliterating_orb` | `item_obliterating_orb` | `panorama/images/items/obliterating_orb_png.vtex_c` |
| `pinOfTheSea` | 神珍★★★ | `item_pin_of_the_sea_custom` | `item_pin_of_the_sea` | `panorama/images/items/pin_of_the_sea_png.vtex_c` |
| `nullifier` | 否决挂饰★★★ | `item_nullifier_custom` | `item_nullifier` | `panorama/images/items/nullifier_png.vtex_c` |
| `paladinSword` | 巫祭短剑★★★ | `item_paladin_sword_custom` | `item_poison_sword` | `panorama/images/items/poison_sword_png.vtex_c` |
| `havocHammer` | 浩劫巨锤 | `item_havoc_hammer_neutral_custom` | `item_havoc_hammer` | `panorama/images/items/havoc_hammer_png.vtex_c` |
| `yashaKayaSange` | 三恒照世★★ | `item_yasha_and_kaya_and_sange` | `item_yasha_and_kaya_and_sange` | `panorama/images/items/yasha_and_kaya_and_sange_png.vtex_c` |
| `eliminatorOfInfinite` | 万物破除者★★★★ | `item_eliminator_of_infinite` | `item_eliminator_of_infinite` | `panorama/images/items/eliminator_of_infinite_png.vtex_c` |
| `earthCore` | 地球核心★★★★ | `item_earth_core` | `item_earth_core` | `panorama/images/items/earth_core_png.vtex_c` |
| `mobiusPendant` | 莫比乌斯吊坠★★★★ | `item_mobius_pendant` | `item_mobius_pendant` | `panorama/images/items/mobius_pendant_png.vtex_c` |
| `netherInfiltratorShortSword` | 幽冥渗透者短剑★★★★ | `item_nether_infiltrator_short_sword` | `item_nether_infiltrator_short_sword` | `panorama/images/items/nether_infiltrator_short_sword_png.vtex_c` |

上述二十五件在本作 Lv.1～Lv.3 与各自成长阶段均复用同一图标；本作成长规则由游戏设计文档与源码定义，不将工坊星级机制移植为本作的数值证明。

## 解码与文件核验

二十五张 PNG 均保留原图内容并以 RGBA 运行；显示区域为 `86×62`、`86×64`、`88×64` 或个别原图的 `88×65`，均未缩放到统一尺寸。解码参照 [ValveResourceFormat 的 Texture 实现](https://github.com/ValveResourceFormat/ValveResourceFormat/blob/master/ValveResourceFormat/Resource/ResourceTypes/Texture.cs)及其 [VTexFormat](https://github.com/ValveResourceFormat/ValveResourceFormat/blob/master/ValveResourceFormat/Resource/Enums/VTexFormat.cs)／[VTexExtraData](https://github.com/ValveResourceFormat/ValveResourceFormat/blob/master/ValveResourceFormat/Resource/Enums/VTexExtraData.cs)定义，使用 Pillow `11.3.0` 导出 PNG。

- 封神之刃：VTEX 格式 `BGRA8888`（值 `28`），存储与显示尺寸均为 `88×64`，1 个 mip；将原像素通道顺序转换为 RGBA。
- 圣洁斗篷、陨星魔典：VTEX 格式 `BGRA8888`（值 `28`），存储与显示尺寸均为 `88×64`，1 个 mip；将原像素通道顺序转换为 RGBA。
- 冰龙之喉、犼妖之灵：VTEX 格式 `DXT5`（值 `2`），存储尺寸为 `128×64`，按文件自带显示区域导出 `88×64`。
- 灾星之戒：VTEX 格式 `DXT5`（值 `2`），存储尺寸 `128×64`，1 个 mip；按文件自带显示区域导出 `88×64`，去除编译填充。另以独立 BC3 块解码核对，导出区域的 `22528` 个 RGBA 通道字节与 Pillow 结果完全一致。
- 第二批六张图标：极寒核心 `86×64`、新月弓 `88×64`、抹灭法球 `88×64`、神珍 `88×64`、否决挂饰 `86×62`、巫祭短剑 `88×64`；均按 VTEX 自带显示区域导出，其中抹灭法球为 `DXT5`，其余为 `BGRA8888`。
- 本轮新增十张图标：碧玉匕首 `88×64`、祛魔之槌 `88×64`、戮尽斗篷 `88×64`、暗影灾劫 `88×64`、浩劫之锤 `88×64`、三恒照世 `88×64`、万物破除者 `88×64`、地球核心 `88×64`、莫比乌斯吊坠 `88×64`、幽冥渗透者短剑 `88×64`；均按 VTEX 自带显示区域导出，碧玉匕首、戮尽斗篷、暗影灾劫、三恒照世、万物破除者、地球核心、莫比乌斯吊坠与幽冥渗透者短剑为 `DXT5`，祛魔之槌与浩劫之锤为 `BGRA8888`。
- 没有缩放、重采样、调色、加边框或重画。二十五张导出图均已实际查看；浏览器接入、布局与游戏流程的验证另见[游戏 README](../../../../README.md)。

| 文件 | SHA-256 |
| --- | --- |
| `godsealBlade.png` | `fdf04acef4afc2b76e88ba99383b01c710298f713c0194ec6ff8f0d8e8247cc7` |
| `calamityRing.png` | `cd3dc949d0b881ae8f1e18b0fc7c4748b3656309c9e8bcb3bdc1d66b15ffdef7` |
| `holyCape.png` | `1048f6de27b0b7677aa51b7f76650b432c20e19be6b4e19d2086c44fd2b1d1b7` |
| `iceDragonMaw.png` | `bd7c4e9dd53741b4a3a90065697155e1796b2652a00337a5f2683cd97b692a33` |
| `radianceHeart.png` | `7fd25a06e2d82dcd3a28bed82580772f36aff2a925d2fed1c555245c641a7d5d` |
| `meteorGrimoire.png` | `c39da7483cc7f6938d40e6ea7bcb66670e58af38e6c0627d042ff89a5d16132c` |
| `shineMadmoon.png` | `f12e8e5a6975eb01ea349d765a0ea0ddd9e9a5564a67b1201b35c7cc3af957cf` |
| `bladeOfVigil.png` | `7c8fd7fadf5e932912ac51c63f098199a53883b2024ccb5a98c5cc4bbd0601ff` |
| `ringAghanim.png` | `fe6487d6ba737a6f76a8fc04c2cb738cb8c465fccac78c4eb2f77f462b7f0aa6` |
| `jasperDaggers.png` | `c76c807d96ab7caf05c1bcacc1bee0b39d2ba93d83b1edabbef711e13e448585` |
| `demagickingMaul.png` | `64797d6475111fcfbeb24bd4afc95ee2119b29e9954b3448909d5b382b9543e1` |
| `cloakOfCarnage.png` | `5c50b5292f624dea284e0f9efa4713d6002e1aace190da43cda332498e0ed91d` |
| `shadowDisaster.png` | `420183c0f5b83921432da6909d7c32e571799e6076551c670a0104e756f928ff` |
| `eyeOfFrost.png` | `814a798d69063a2bce35fc0438f684638c78d22f65bda6ae78e1f1b36366f24c` |
| `crescentBow.png` | `5e82ef438c2c3741e19a2c09814c881503bd65181389f4da78b3c7a3118e0e89` |
| `obliteratingOrb.png` | `9eb6cfdda712a7774aaebc9d3bd93e9ec7bd3c51448a0552c6aff3dfb471debc` |
| `pinOfTheSea.png` | `37297743e0f8b497e595b11f736fd40da7ec2510772751d52a851180201a2a4b` |
| `nullifier.png` | `ade437b651e6e672518701609381e0a0d407456443d999101a588c0a2a736339` |
| `paladinSword.png` | `dd277ef243439b398f8b1c38d8778817e2416b9dbe1ed3714e6ea74148e8a93c` |
| `havocHammer.png` | `7c22bd7d9bea05adf39eb88767bc50cfd1e22a541a2af8faa0a90deb41ac3098` |
| `yashaKayaSange.png` | `fb5dfbf7ac11c7fa0e5ec9bdd7bb72cd1c5f95074e09e4df8ee808a46315b952` |
| `eliminatorOfInfinite.png` | `c6aca0d98393c4df96ad9e53d30216fd12eae9c4931f8d5f66e2f1b061161bc0` |
| `earthCore.png` | `143527c7bbb4b695ec3ca4e8cc5f2599e443afe5cbb9e933b3c919201269d82b` |
| `mobiusPendant.png` | `6add61af0536699e5b56548eef3622b9589592ab793269811d32ef7a4baf679f` |
| `netherInfiltratorShortSword.png` | `f94d5dc1416dd3f740c62ac4dd39908a801d85f9dcc55dcdfd6345915c0c2dfb` |
| 原始 `apotheosis_blade_png.vtex_c` | `a0eb90b70b54b8f84f8dee398a15a0a72fb9fb8cdf5e33768f94182e74178ebe` |
| 原始 `ring_of_disaster_png.vtex_c` | `469786f6c99f43a94279a5b9e2a8be56f5b25e45db742d3d4258d62ed0220e3c` |
| 原始 `holy_cape_png.vtex_c` | `865ab2e4191c7fe8e9c4d82230f2760da483b15832e6c1440954bca0650145cb` |
| 原始 `ice_dragon_maw_png.vtex_c` | `d838d108266c7dcdd3fc3ee8d9eb9a33a4f75ca1aae397753f988d15a3163c23` |
| 原始 `radiance_heart_png.vtex_c` | `0b1aae8f28836526bdc8b8e0643c7607132d7e35eb036b3b94530f2218f88d72` |
| 原始 `meteor_grimoire_png.vtex_c` | `3b20c486ff35e3257c1bef14472d4a9524977566b1387b0562f51d3f643d70d8` |
| 原始 `shine_of_the_madmoon_png.vtex_c` | `cfe1d87b8f5c8017e0e50541a14b384b746adeab0604da99d1e05dd89f3328b2` |
| 原始 `blade_of_the_vigil_png.vtex_c` | `a8af1552813007d9c225b2515451ee0b34d2331b30e464c6083b39df2f09e8d3` |
| 原始 `ring_of_aghanim_png.vtex_c` | `6c6c5d16606e6690a4e28702e3ae4785b3807ba495acd32a72bf13ba892585df` |
| 原始 `jasper_daggers_png.vtex_c` | `7a3b5fcc881cd2ceb3ba4ee0a26bd99d9e2f2e4a25676810fe54bcba24d922f9` |
| 原始 `demagicking_maul_png.vtex_c` | `7b946bc743373a2d48b21c07344335fefca039bad3c5fd1dd7463b7f9f564162` |
| 原始 `cloak_of_endless_carnage_png.vtex_c` | `5b35d58e3aa19b4753600b98e04c58509452acf760c026b28c4757339d23bcd0` |
| 原始 `shadow_disaster_png.vtex_c` | `9237993089eb75d5325c2b1f0345abcd9f4542378a63c50c2b748fa3939cde1d` |
| 原始 `eye_of_frost_png.vtex_c` | `ac328f848f60ca944f18312fe0c064586b034fdc3d50af4699f9f7ce200cfa5f` |
| 原始 `crescent_bow_png.vtex_c` | `bf07a91ebcfe7d5d885c3669bb0035a5392c3afd5c77eacedca6c7ca1a836bbd` |
| 原始 `obliterating_orb_png.vtex_c` | `cbdda50cc1fd74ef87d38db8a414ec273bfb9d4ec9c7feb8c48742eca9328560` |
| 原始 `pin_of_the_sea_png.vtex_c` | `e9932e06e553f5b516b133ec212b93c41edffbcf1d9b7a056bbddc67856453ac` |
| 原始 `nullifier_png.vtex_c` | `c7bcd2b4b73ec2c75e042a794e9252bc521638455b6592bcd2a2396d7e897252` |
| 原始 `poison_sword_png.vtex_c` | `5ada0bcb6b0a935565aa44d45405f3a3b4b1f201f0d5bda0f2b325e8404f3c33` |
| 原始 `havoc_hammer_png.vtex_c` | `7cb34a01e636839b753c94e09408d9063def9173a963ec4bb3faeeeecc6d1a70` |
| 原始 `yasha_and_kaya_and_sange_png.vtex_c` | `0afdb8937e34419c392d7d4927631814d3d4bc035aaf982b67ff3fb896092c27` |
| 原始 `eliminator_of_infinite_png.vtex_c` | `8a6f71842bf43ee96f5a434cb2b8736b27dfa1ad6f7a36ca23b6e84877c1c706` |
| 原始 `earth_core_png.vtex_c` | `ba7409e3f1d5e6fbac42f1ff9007646a1da1796e0bb10df7e49a9c54ee76bd7b` |
| 原始 `mobius_pendant_png.vtex_c` | `408122843658ac7808039baaf4cbc84774b6af51d61cdede60cc37cabb16b15d` |
| 原始 `nether_infiltrator_short_sword_png.vtex_c` | `d9c38c01263e07b1cfa319f8175d5036250c9b7f33d2b6cf6456b63bca915aa7` |

用于区分 PNG 编码差异的 RGBA 像素 SHA-256：封神之刃为 `c42eaa76154b5e178501ba66a8eedd12462d815cd5e3a2fd0707dab13ea3fc9f`，灾星之戒为 `61f5b7d6a194811995de99cb97e56ca03c8759380314509605e8f929589f025e`。

## 权利状态

这是第三方工坊／游戏原素材，相关权利仍归原权利人；本仓库不主张图片所有权。工坊页面与包内本轮核验文件未提供可确认的独立开放许可证，未据此确认额外再分发授权；公开下载及用户指定使用都不改变原权利状态。来源记录和 PNG 解码不赋予他人新的许可，也不将本仓库代码许可扩展到这些图片。核验时 Steam 页面还显示社区移除与游戏兼容性提示，因此本记录也不保证该工坊条目之后仍可下载或正常游玩。

## 运行边界

装备名称、配方、成长和战斗效果是 DotaRogue 的改编规则。此记录证明本次原图取得、身份对应、转换与文件核验；它不替代页面实际加载、自然获取、三合一升阶或长局的验证。
