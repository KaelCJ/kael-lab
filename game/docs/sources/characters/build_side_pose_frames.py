"""Build nine static right-facing poses from each editable side SVG.

Run from the repository root: python3 game/docs/sources/characters/build_side_pose_frames.py
Inputs stay in docs; output defaults to the public static asset directory.
"""

from pathlib import Path
from shutil import copyfile
import argparse
import xml.etree.ElementTree as ET


SVG = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG)
HERE = Path(__file__).resolve().parent
GAME_ROOT = HERE.parents[2]
OUTPUT_ROOT = GAME_ROOT / "static" / "dotarogue" / "assets" / "characters"
HEROES = ("rover", "bulwark", "conductor", "scavenger", "jugg", "sf", "luna", "kael")
POSES = (
    "idle-a", "idle-alt", "walk-a", "walk-b", "dash",
    "attack-windup", "attack", "attack-release", "skill",
)

ARM_ANGLES = {
    "rover": (38, 4, 13),
    "bulwark": (32, -5, 25),
    "conductor": (-29, -8, -5),
    "scavenger": (32, 17, 26),
    "jugg": (28, 12, 24),
    "sf": (30, -5, 26),
    "luna": (18, -32, -12),
    "kael": (28, -8, 24),
}
FOREARM_ANGLES = {
    "rover": (10, 19, 4),
    "bulwark": (10, 10, 7),
    "conductor": (-24, 5, 0),
    "scavenger": (10, 21, 7),
    "jugg": (10, 26, 8),
    "sf": (10, 10, 7),
    "luna": (8, -18, -5),
    "kael": (8, 7, 5),
}


def node(root: ET.Element, identity: str) -> ET.Element:
    matches = [item for item in root.iter() if item.get("id") == identity]
    if len(matches) != 1:
        raise ValueError(f"Expected one {identity}, found {len(matches)}")
    return matches[0]


def transform(root: ET.Element, identity: str, value: str) -> None:
    node(root, identity).set("transform", value)


def remove_group(root: ET.Element, identity: str) -> None:
    matches = []
    for parent in root.iter():
        for child in list(parent):
            if child.get("id") == identity:
                matches.append((parent, child))
    if len(matches) != 1:
        raise ValueError(f"Expected one {identity}, found {len(matches)}")
    matches[0][0].remove(matches[0][1])


def effect(root: ET.Element, hero: str, pose: str) -> None:
    if pose not in ("attack", "skill"):
        return
    group = node(root, "side-weapon")
    color = {
        "rover": "#ffe8a2", "bulwark": "#ffdfa1", "conductor": "#a9f3ff",
        "scavenger": "#bdf58a", "jugg": "#fff4ce", "sf": "#ffb17b", "luna": "#e6f5ff", "kael": "#ffd06e",
    }[hero]
    points = {
        "rover": "M230 207l8-9m-7 15 10-1m-9 8 8 7",
        "bulwark": "M226 202l10-16m-4 29 9-7",
        "conductor": "M220 65l-9-20m25 18 10-17",
        "scavenger": "M230 279l10-15m-5 28 9 5",
        "jugg": "M98 298q45-24 86-34",
        "sf": "M220 226q8-23 18-20m-6 55q15 12 10 22",
        "luna": "M257 134q25 12 27 38m-29-31q16 10 18 26",
        "kael": "M229 245l12-13m-9 21 15-2",
    }[hero]
    ET.SubElement(group, f"{{{SVG}}}path", {
        "d": points, "fill": "none", "stroke": color,
        "stroke-width": "5" if pose == "attack" else "7",
        "stroke-linecap": "round", "stroke-linejoin": "round",
    })
    if hero == "luna" and pose == "skill":
        ET.SubElement(group, f"{{{SVG}}}circle", {
            "cx": "238", "cy": "182", "r": "57", "fill": "none",
            "stroke": "#d3efff", "stroke-width": "4", "opacity": ".82",
        })


def pose(root: ET.Element, hero: str, name: str) -> None:
    if hero == "luna":
        # The panther supplies locomotion; Luna's legs stay in their stirrups.
        if name in ("walk-a", "walk-b", "dash"):
            sign = 1 if name != "walk-b" else -1
            stride = 4 if name != "dash" else 7
            legs = node(root, "side-panther-legs")
            for index, limb in enumerate(list(legs)[:4]):
                direction = sign if index % 2 == 0 else -sign
                limb.set("transform", f"translate({direction * stride} {-2 if direction > 0 else 0})")
            transform(root, "side-motion", "translate(0 -3)")
        elif name == "idle-alt":
            transform(root, "side-panther-head", "translate(0 -2)")
        if name in ("attack-windup", "attack", "attack-release"):
            stage = ("attack-windup", "attack", "attack-release").index(name)
            transform(root, "side-rig", f"rotate({ARM_ANGLES[hero][stage]} 178 138)")
            transform(root, "side-forearm", f"rotate({FOREARM_ANGLES[hero][stage]} 202 178)")
        elif name == "skill":
            transform(root, "side-rig", "rotate(-17 178 138)")
            transform(root, "side-forearm", "rotate(-8 202 178)")
        effect(root, hero, name)
        root.find(f"{{{SVG}}}title").text = f"luna · black-panther mounted right-facing {name}"
        root.find(f"{{{SVG}}}desc").text = "Static mounted pose: the black panther moves on four legs while Luna sits in the saddle and wields a moon glaive."
        return
    if name == "idle-alt":
        transform(root, "side-body", "translate(0 -2)")
        transform(root, "side-head", "translate(0 -1)")
        transform(root, "side-rig", "rotate(-3 170 164)")
        transform(root, "side-forearm", "rotate(3 204 207)")
    elif name in ("walk-a", "walk-b"):
        sign = 1 if name == "walk-a" else -1
        transform(root, "side-far-leg", f"translate({-7 * sign} {-2 if sign < 0 else 0}) rotate({-7 * sign} 102 273)")
        transform(root, "side-near-leg", f"translate({8 * sign} {-3 if sign > 0 else 0}) rotate({7 * sign} 148 278)")
        transform(root, "side-body", f"translate({sign} -3)")
        transform(root, "side-head", f"translate({sign} -2)")
        transform(root, "side-far-arm", f"rotate({8 * sign} 102 170)")
        shoulder = -4 if hero == "conductor" else 6 * sign
        elbow = 0 if hero == "conductor" else -5 * sign
        transform(root, "side-rig", f"rotate({shoulder} 170 164)")
        transform(root, "side-forearm", f"rotate({elbow} 204 207)")
    elif name == "dash":
        for identity in ("side-back", "side-far-leg", "side-far-arm", "side-body", "side-near-leg", "side-head"):
            transform(root, identity, "translate(0 -6)")
        transform(root, "side-rig", "translate(0 -6) rotate(8 170 164)")
        transform(root, "side-forearm", "rotate(-7 204 207)")
    elif name in ("attack-windup", "attack", "attack-release"):
        stage = ("attack-windup", "attack", "attack-release").index(name)
        shoulder = ARM_ANGLES[hero][stage]
        elbow = FOREARM_ANGLES[hero][stage]
        transform(root, "side-rig", f"rotate({shoulder} 170 164)")
        transform(root, "side-forearm", f"rotate({elbow} 204 207)")
        transform(root, "side-body", ("rotate(-3 132 207)", "rotate(3 132 207)", "rotate(1 132 207)")[stage])
        transform(root, "side-head", ("translate(-2 -1)", "translate(3 -2)", "translate(1 0)")[stage])
        transform(root, "side-near-leg", ("translate(-2 0)", "translate(3 -2)", "translate(1 0)")[stage])
    elif name == "skill":
        shoulder, elbow = (-25, -29) if hero == "conductor" else (25, 5)
        transform(root, "side-rig", f"rotate({shoulder} 170 164)")
        transform(root, "side-forearm", f"rotate({elbow} 204 207)")
        transform(root, "side-body", "translate(0 -3) rotate(-2 132 207)")
        transform(root, "side-head", "translate(2 -4)")
    effect(root, hero, name)
    title = root.find(f"{{{SVG}}}title")
    desc = root.find(f"{{{SVG}}}desc")
    if title is not None:
        title.text = f"{hero} · right-facing {name}"
    if desc is not None:
        desc.text = "Static side pose with independent head and staggered legs; hand and weapon articulate from shoulder and elbow."


def build(hero: str, output_root: Path = OUTPUT_ROOT) -> None:
    directory = output_root / hero
    directory.mkdir(parents=True, exist_ok=True)
    source = HERE / hero / "art" / "source" / f"{hero}-side.svg"
    raw = source.read_bytes()
    copyfile(source, directory / source.name)
    for name in POSES:
        root = ET.fromstring(raw)
        if hero == "kael":
            remove_group(root, "kael-orbs")
        pose(root, hero, name)
        ET.indent(root, space="  ")
        output = directory / f"{hero}-side-{name}.svg"
        output.write_text(ET.tostring(root, encoding="unicode") + "\n", encoding="utf-8")
        print(f"{hero}/{output.name}")
    if source.read_bytes() != raw:
        raise RuntimeError(f"Source changed during generation: {source}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-root", type=Path, default=OUTPUT_ROOT,
                        help="Character output directory; defaults to game/static/dotarogue/assets/characters.")
    parser.add_argument("--hero", choices=HEROES, help="Generate only this hero.")
    args = parser.parse_args()
    for hero_id in (args.hero,) if args.hero else HEROES:
        build(hero_id, args.output_root.resolve())
