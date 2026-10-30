#!/usr/bin/env python3
"""Check static DotA1 frame delivery; real-entry and visual verification remain required."""

from __future__ import annotations

import hashlib
import json
import math
import re
import struct
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "game/static/dotarogue"
MANIFEST = ROOT / "game/docs/sources/characters/dota1/model-frames-manifest.json"
HERO_IDS = {"rover", "bulwark", "conductor", "scavenger", "jugg", "sf", "kael", "luna", "tb"}
POSES = {"idle-a", "idle-alt", "walk-a", "walk-b", "dash", "attack-windup", "attack", "attack-release", "skill"}
SIDES = {"", "side-"}


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def match(pattern: str, source: str, label: str) -> re.Match:
    result = re.search(pattern, source, re.S)
    require(result is not None, f"cannot read {label}; update this check with the delivery contract")
    return result


def strings(source: str) -> list[str]:
    return re.findall(r"'([^']*)'", source)


def section(source: str, start: str, end: str) -> str:
    return match(re.escape(start) + r"(.*?)" + re.escape(end), source, start).group(1)


def expand(template: str, values: dict[str, str | int]) -> str:
    for key, value in values.items():
        template = template.replace("${" + key + "}", str(value))
    require("${" not in template, f"unhandled mapping expression: {template}")
    return template


def asset_path(reference: str) -> str:
    url = urlsplit(reference)
    require(not url.scheme and not url.netloc and url.path.startswith("./assets/characters/"),
            f"frame must use a relative static asset path: {reference}")
    path = (SITE / url.path).resolve()
    require(path.is_relative_to(SITE.resolve()), f"frame escapes its owner: {reference}")
    return path.relative_to(ROOT).as_posix()


def frame_maps(game: str) -> tuple[set[str], set[str]]:
    """Expand current source templates and loops, including their actual pose keys."""
    mapped: dict[str, dict[str, str]] = {"HERO_POSE_ART": {}, "HERO_POSE_DOTA1_ART": {}}

    def add(target: str, key: str, reference: str) -> None:
        path = asset_path(reference)
        require(Path(path).stem == key, f"pose key and filename disagree: {key}: {path}")
        require(key not in mapped[target], f"duplicate pose key: {target}: {key}")
        mapped[target][key] = path

    for target, base in [("HERO_POSE_ART", "HERO_ART"), ("HERO_POSE_DOTA1_ART", "HERO_DOTA1_ART")]:
        declaration = section(game, f"const {base} =", "));")
        require("CHARACTERS.map" in declaration, f"{base} must include all playable heroes")
        idle = match(r"\[id,\s*`([^`]+)`\]", declaration, base + " idle template").group(1)
        # Normal SVGs append a version expression, which does not affect the local file.
        if target == "HERO_POSE_ART":
            require(".svg" in idle, "ordinary skin idle must retain SVG frames")
            idle = idle.split(".svg", 1)[0] + ".svg"
        for hero in HERO_IDS:
            add(target, hero + "-idle-a", expand(idle, {"id": hero}))

        declaration = section(game, f"const {target} =", "));\n")
        require(f"Object.keys({base}).flatMap" in declaration, f"{target} must cover its base hero map")
        pose_list = strings(match(r"flatMap\(id\s*=>\s*(\[.*?\])\.map", declaration, target + " poses").group(1))
        expected = {side + pose for side in SIDES for pose in POSES}
        if target == "HERO_POSE_ART":
            expected.remove("idle-a")
        require(set(pose_list) == expected and len(pose_list) == len(expected), f"incomplete {target} pose list")
        pair = match(r"\[`([^`]+)`,\s*`([^`]+)`\]", declaration, target + " pose template")
        for hero in HERO_IDS:
            for pose in pose_list:
                values = {"id": hero, "pose": pose}
                reference = pair.group(2)
                if target == "HERO_POSE_ART":
                    require(".svg" in reference, "ordinary pose template must retain SVG frames")
                    reference = reference.split(".svg", 1)[0] + ".svg"
                key = expand(pair.group(1), values)
                if key in mapped[target]:
                    require(pose == "idle-a" and mapped[target][key] == asset_path(expand(reference, values)), "conflicting idle mapping")
                else:
                    add(target, key, expand(reference, values))

    demon_loops = re.findall(
        r"for \(const pose of (\[.*?\])\) \{\s*for \(const side of (\[.*?\])\) "
        r"(HERO_POSE_DOTA1_ART|HERO_POSE_ART)\[`(tb-demon-[^`]+)`\] = `([^`]+)`;", game, re.S)
    require({loop[2] for loop in demon_loops} == set(mapped) and len(demon_loops) == 2, "both TB demon mappings are required")
    for pose_list, side_list, target, key, reference in demon_loops:
        require(set(strings(pose_list)) == POSES and set(strings(side_list)) == SIDES, "incomplete TB demon pose loop")
        for pose in strings(pose_list):
            for side in strings(side_list):
                values = {"pose": pose, "side": side}
                add(target, expand(key, values), expand(reference, values))

    rage = section(game, "for (const [poses, root, extension] of ", "const LUNA_GLAIVE_BLADE")
    roots = re.findall(r"\[(HERO_POSE_ART|HERO_POSE_DOTA1_ART),\s*'([^']+)',\s*'([^']+)'\]", rage)
    require(len(roots) == 2 and {item[0] for item in roots} == set(mapped), "both alchemist skin roots are required")
    require(set(strings(match(r"for \(const side of (\[.*?\])\)", rage, "alchemist sides").group(1))) == SIDES, "incomplete alchemist sides")
    pose_list = strings(match(r"for \(const pose of (\[.*?\])\)", rage, "rage poses").group(1))
    require(set(pose_list) == POSES and len(pose_list) == 9, "incomplete rage pose loop")
    directions = strings(match(r"for \(const direction of (\[.*?\])\)", rage, "morph directions").group(1))
    require(set(directions) == {"in", "out"} and len(directions) == 2, "both morph directions are required")
    require(re.search(r"for \(let frame = 0; frame < 3; frame\+\+\)", rage) is not None, "morph must cover three frames per direction")
    rage_pair = match(r"poses\[`(scavenger-rage-[^`]+)`\] = `([^`]+)`", rage, "rage frame template")
    morph_pair = match(r"poses\[`(scavenger-\$\{side\}morph-[^`]+)`\] = `([^`]+)`", rage, "morph frame template")
    for target, root, extension in roots:
        require(extension == ("png" if target == "HERO_POSE_DOTA1_ART" else "svg"), f"wrong alchemist format for {target}")
        for side in SIDES:
            values = {"root": root, "extension": extension, "side": side}
            for pose in pose_list:
                context = {**values, "pose": pose}
                add(target, expand(rage_pair.group(1), context), expand(rage_pair.group(2), context))
            for direction in directions:
                for frame in range(3):
                    context = {**values, "direction": direction, "frame": frame}
                    add(target, expand(morph_pair.group(1), context), expand(morph_pair.group(2), context))
    return set(mapped["HERO_POSE_DOTA1_ART"].values()), set(mapped["HERO_POSE_ART"].values())


def check_rendering(game: str, display: dict) -> None:
    profiles = json.loads(match(r"const DOTA1_MODEL_DISPLAY = (\{.*?\});", game, "model display profiles").group(1))
    require(set(profiles) == HERO_IDS | {"tb-demon", "scavenger-rage"}, "expected eleven model display profiles")
    require(set(display) == set(profiles), "manifest and source profile keys differ")
    for form, profile in profiles.items():
        for field in ("height", "bottomRatio"):
            value = profile[field]
            require(isinstance(value, (int, float)) and math.isfinite(value), f"invalid {form}.{field}")
            require(math.isclose(value, display[form][field], rel_tol=1e-12), f"display profile drift: {form}.{field}")
        require(profile["height"] > 0 and 0 <= profile["bottomRatio"] < 1, f"invalid display bounds: {form}")
    guard = match(r"const modelProfile = (.*?)\? DOTA1_MODEL_DISPLAY\[artId\] : null;", game, "PNG profile guard").group(1)
    expected = "selectedSkin === 'dota1' && image.currentSrc.includes('/assets/characters/dota1/') && /\\.png(?:\\?|$)/.test(image.currentSrc)"
    require(re.sub(r"\s+", "", guard) == re.sub(r"\s+", "", expected), "model display must guard formal PNGs and the skin; SVG fallback keeps its own scale")
    require("visibleHeight = modelProfile ? modelProfile.height :" in game and "bottom = modelProfile ? height * modelProfile.bottomRatio :" in game, "missing ordinary fallback height or baseline")
    require(re.search(r"const footImage = selectedSkin !== ['\"]dota1['\"] &&", game) is not None, "DotA1 model frames must not splice SVG walking legs")
    for name in ("drawModelBladeTipTrail", "drawWeaponSwing", "drawShadowAttack", "drawHeroAttack"):
        require(re.search(r"function " + name + r"\(fx\) \{\s*if \(selectedSkin !== 'dota1'", game) is not None, f"{name} must preserve the ordinary skin")
    require("skin === 'dota1' ? HERO_POSE_DOTA1_ART : HERO_POSE_ART" in game, "skin pose selection missing")
    require("heroPoseImages[`pixel:${id}`], artImages[`pixel:${id}`]" in game, "ordinary missing-frame fallback missing")
    for skin, expected_map in [("pixel", "HERO_ART"), ("dota1", "HERO_DOTA1_ART")]:
        consumer = match(r"\b" + skin + r": \{([^\n]+)\}", game, skin + " skin consumer").group(1)
        require("..." + expected_map in consumer, f"{skin} no longer consumes {expected_map}")
        if skin == "pixel":
            require("HERO_DOTA1_ART" not in consumer, "ordinary skin must not consume the DotA1 frame map")


def main() -> int:
    game = (SITE / "js/game.js").read_text(encoding="utf-8")
    heroes = (SITE / "js/heroes.js").read_text(encoding="utf-8")
    playable = section(heroes, "export const CHARACTERS =", "\n];")
    require(set(re.findall(r"\bid:\s*'([a-z0-9-]+)'", playable)) == HERO_IDS, "playable hero set changed; update the frame delivery contract")
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    model_paths, ordinary_paths = frame_maps(game)
    assets = manifest["assets"]
    require(len(model_paths) == 210 and len(assets) == 210, "expected 210 static model frames")
    require(manifest["assetCount"] == len(assets) and manifest["totalBytes"] == sum(asset["bytes"] for asset in assets), "manifest totals differ from recorded assets")
    recorded = {asset["path"] for asset in assets}
    require(len(recorded) == len(assets) and recorded == model_paths, "manifest and actual expanded model mappings differ")
    actual = {path.relative_to(ROOT).as_posix() for path in (SITE / "assets/characters/dota1").rglob("*.png")}
    require(actual == model_paths, "formal PNG files and mapped frame set differ")
    for asset in assets:
        require(asset["path"].endswith(".png"), f"model frame is not PNG: {asset['path']}")
        data = (ROOT / asset["path"]).read_bytes()
        require(data[:8] == b"\x89PNG\r\n\x1a\n" and data[12:16] == b"IHDR", f"invalid PNG header: {asset['path']}")
        require(len(data) == asset["bytes"] and hashlib.sha256(data).hexdigest() == asset["sha256"], f"model bytes changed: {asset['path']}")
        require(struct.unpack(">II", data[16:24]) == (asset["width"], asset["height"]), f"model dimensions changed: {asset['path']}")
        stem = Path(asset["path"]).stem
        profile = next((key for key in sorted(manifest["display"], key=len, reverse=True) if stem.startswith(key + "-")), None)
        require(profile == asset["displayProfile"], f"wrong display profile for {asset['path']}")
        require(manifest["display"][profile]["frame"] == [asset["width"], asset["height"]], f"profile frame size differs: {asset['path']}")
    require(len(ordinary_paths) == 210 and not ordinary_paths & model_paths, "ordinary skin frame set changed")
    for path in ordinary_paths | {"game/static/dotarogue/assets/characters/luna/luna-glaive.svg"}:
        require(path.endswith(".svg") and ET.parse(ROOT / path).getroot().tag.endswith("svg"), f"ordinary SVG unavailable: {path}")
    check_rendering(game, manifest["display"])
    for path in SITE.rglob("*"):
        if path.suffix not in {".js", ".html", ".css", ".svg"}:
            continue
        source = path.read_text(encoding="utf-8")
        require(not re.search(r"\.tmp[/\\]|\.playwright-mcp[/\\]|\.logs[/\\]|https?://(?:127\.0\.0\.1|localhost)(?=[:/])", source), f"temporary or local-service dependency in {path.relative_to(ROOT)}")
    print("PASS: 210 formal PNGs match manifest hashes, dimensions and expanded hero/TB/alchemist mappings.")
    print("PASS: 11 display profiles, PNG-only scaling, 210 ordinary SVG frames and visual skin guards are present.")
    print("PASS: delivered text resources have no temporary-directory or localhost-service dependency.")
    print("Static delivery checks only; real-entry gameplay, loading and visual verification remain required.")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (OSError, ValueError, KeyError, TypeError, struct.error, ET.ParseError) as error:
        print(f"FAIL: {error}", file=sys.stderr)
        sys.exit(1)
