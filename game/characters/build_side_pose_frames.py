"""Build nine static right-facing poses from each editable side SVG.

Run from the repository root: python game/characters/build_side_pose_frames.py
"""

from pathlib import Path
import xml.etree.ElementTree as ET


SVG = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG)
HERE = Path(__file__).resolve().parent
HEROES = ("rover", "bulwark", "conductor", "scavenger", "jugg", "sf")
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
}
FOREARM_ANGLES = {
    "rover": (10, 19, 4),
    "bulwark": (10, 10, 7),
    "conductor": (-24, 5, 0),
    "scavenger": (10, 21, 7),
    "jugg": (10, 26, 8),
    "sf": (10, 10, 7),
}


def node(root: ET.Element, identity: str) -> ET.Element:
    matches = [item for item in root.iter() if item.get("id") == identity]
    if len(matches) != 1:
        raise ValueError(f"Expected one {identity}, found {len(matches)}")
    return matches[0]


def transform(root: ET.Element, identity: str, value: str) -> None:
    node(root, identity).set("transform", value)


def effect(root: ET.Element, hero: str, pose: str) -> None:
    if pose not in ("attack", "skill"):
        return
    group = node(root, "side-weapon")
    color = {
        "rover": "#ffe8a2", "bulwark": "#ffdfa1", "conductor": "#a9f3ff",
        "scavenger": "#bdf58a", "jugg": "#fff4ce", "sf": "#ffb17b",
    }[hero]
    points = {
        "rover": "M230 207l8-9m-7 15 10-1m-9 8 8 7",
        "bulwark": "M226 202l10-16m-4 29 9-7",
        "conductor": "M220 65l-9-20m25 18 10-17",
        "scavenger": "M230 279l10-15m-5 28 9 5",
        "jugg": "M98 298q45-24 86-34",
        "sf": "M220 226q8-23 18-20m-6 55q15 12 10 22",
    }[hero]
    ET.SubElement(group, f"{{{SVG}}}path", {
        "d": points, "fill": "none", "stroke": color,
        "stroke-width": "5" if pose == "attack" else "7",
        "stroke-linecap": "round", "stroke-linejoin": "round",
    })


def pose(root: ET.Element, hero: str, name: str) -> None:
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


def build(hero: str) -> None:
    directory = HERE / hero / "art" / "runtime"
    source = directory / f"{hero}-side.svg"
    raw = source.read_bytes()
    for name in POSES:
        root = ET.fromstring(raw)
        pose(root, hero, name)
        ET.indent(root, space="  ")
        output = directory / f"{hero}-side-{name}.svg"
        output.write_text(ET.tostring(root, encoding="unicode") + "\n", encoding="utf-8")
        print(output.relative_to(HERE.parent.parent))
    if source.read_bytes() != raw:
        raise RuntimeError(f"Source changed during generation: {source}")


if __name__ == "__main__":
    for hero_id in HEROES:
        build(hero_id)
