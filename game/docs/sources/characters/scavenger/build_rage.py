#!/usr/bin/env python3
"""Derive Alchemist's public SVG rage poses without rewriting ordinary art.

The existing project-drawn front/side rigs supply all nine action poses. This
adds purple ogre anatomy, a raised shoulder/elbow stance and a lit blade, then
samples the same treatment at three phases for entering and leaving rage.
No third-party model, texture or model-derived image is read by this generator.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import json
from pathlib import Path
import sys
import xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[4]
BASE = REPO / "game/static/dotarogue/assets/characters"
sys.path.insert(0, str(HERE.parent))
import build_pose_frames as front

NS = "http://www.w3.org/2000/svg"
ET.register_namespace("", NS)
POSES = ("idle-a", "idle-alt", "walk-a", "walk-b", "dash",
         "attack-windup", "attack", "attack-release", "skill")
PURPLE = ("#cba1d5", "#954baf", "#4d2b66")
SKIN = {
    "#8c9a70": PURPLE[0], "#59654e": PURPLE[1], "#303d3d": PURPLE[2],
    "#b1ad72": PURPLE[0], "#797c56": PURPLE[1], "#4d5b46": PURPLE[2],
    "#334846": "#472c60", "#70805e": "#a166b5", "#a1ab76": "#c590d0",
    "#647453": "#92529f", "#a2ad73": "#cb94d2", "#657453": "#92529f",
    "#a1ad75": "#ca91d0", "#819161": "#ae70be", "#829162": "#b77bc4",
    "#66684b": "#814897", "#747b55": "#9452a5", "#85875b": "#b276c2",
    "#919162": "#b97ec7", "#c7b881": "#dfb1e6", "#747955": "#9452a5",
    "#777a50": "#9b60b1", "#88905f": "#b67bc8", "#85885d": "#ad70bc",
    "#69744e": "#8c4d9d", "#8d9162": "#b97dc8", "#9d9870": "#c995d4",
    "#a4a074": "#c58ad0", "#d7cf91": "#e4bce9",
    "#83b3bd": "#b271c8", "#bfd6d3": "#e2c0ec", "#477b91": "#70418c",
    "#bcd4d2": "#dfb9e7", "#c5d9d3": "#dfb9e7", "#78a7b4": "#ab69bd",
    "#a4c6ca": "#d5a0df", "#a7cbd0": "#d8a3e1", "#659dad": "#9351ac",
    "#c5dfda": "#edc7f1", "#476f85": "#73438d", "#54879f": "#7e4398",
    "#8cb9c1": "#b879ce", "#bdd5d3": "#e6c2ed", "#acd0d2": "#dda8e4",
    "#70a3b3": "#a161b8", "#c7ded7": "#eac6ef", "#d6dfc9": "#edcced",
    "#80b0bd": "#b777cd", "#b2d4d3": "#dfb4e9", "#cadcce": "#e6c0ed",
}


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def public_path(path: Path) -> str:
    return path.relative_to(REPO).as_posix() if path.is_relative_to(REPO) else path.name


def node(root: ET.Element, identity: str) -> ET.Element:
    return front.element(root, identity)


def blend(a: str, b: str, amount: float) -> str:
    values = [round(int(a[i:i+2], 16) * (1-amount) + int(b[i:i+2], 16) * amount)
              for i in (1, 3, 5)]
    return "#" + "".join(f"{value:02x}" for value in values)


def path(parent: ET.Element, data: str, fill: str = "none", stroke: str = "#4d2c65",
         width: float = 3, opacity: float = 1) -> ET.Element:
    return ET.SubElement(parent, f"{{{NS}}}path", {
        "d": data, "fill": fill, "stroke": stroke, "stroke-width": f"{width:g}",
        "stroke-linejoin": "round", "stroke-linecap": "round", "opacity": f"{opacity:g}"})


def articulate(element: ET.Element, movement: str) -> None:
    element.set("transform", (element.get("transform", "") + " " + movement).strip())


def rage(source: ET.Element, *, classic: bool, side: bool, amount: float) -> ET.Element:
    root = copy.deepcopy(source)
    front.clean_animations(root)
    if amount == 0:
        return root
    if not side and not any(e.get("id") == "pose-swing-arm" for e in root.iter()):
        front.split_legs(root, "scavenger")
        front.prepare_parts(root, "scavenger")
    for element in root.iter():
        for key in ("fill", "stroke", "stop-color"):
            color = element.get(key, "").lower()
            if color in SKIN:
                element.set(key, blend(color, SKIN[color], amount))
        if classic and element.get("id") == "d1-skin":
            for stop, color in zip(element, PURPLE):
                stop.set("stop-color", blend(stop.get("stop-color"), color, amount))
    strength = f"{amount:g}"
    if side:
        # Shoulder and bent elbow move as one connected chain. Feet retain the
        # original leg poses; the torso settles into them instead of scaling.
        articulate(node(root, "side-body"), f"translate({-2*amount:g} {3*amount:g})")
        articulate(node(root, "side-head"), f"translate({4*amount:g} {2*amount:g})")
        articulate(node(root, "side-far-arm"), f"rotate({-12*amount:g} 103 168)")
        articulate(node(root, "side-rig"), f"translate({-5*amount:g} {-4*amount:g}) rotate({5*amount:g} 174 165)")
        articulate(node(root, "side-forearm"), f"rotate({8*amount:g} 204 207)")
        muscles = ET.SubElement(node(root, "side-body"), f"{{{NS}}}g", {"id": "rage-muscles", "opacity": strength})
        path(muscles, "M115 179Q137 156 163 173L178 197Q151 180 127 201L115 218L104 203Z", "#c68ad4", "none")
        path(muscles, "M121 208Q122 235 140 245M143 176Q160 178 168 189", stroke="#edc7ef", width=3)
        blade = node(root, "side-weapon")
        if classic:
            path(blade, "M227 247L240 281", stroke="#b28b5b", width=8)
            path(blade, "M232 275Q248 259 265 270L261 293Q247 305 231 290Z", "#cbd9b0", "#3c4955", 4)
            edge = "M245 270Q258 267 263 273L259 291Q251 299 240 294"
        else:
            edge = "M244 272Q260 267 267 274L263 297Q251 306 238 300"
    else:
        body = node(root, "hero-body")
        arm = node(root, "pose-swing-arm")
        articulate(arm, f"translate({-5*amount:g} {-7*amount:g}) rotate({8*amount:g} 184 154)")
        if not classic:
            # Keep the flask on the goblin's kit; the ogre's combat hand keeps
            # its blade in every rage pose, including waiting and walking.
            node(root, "hero-weapon").set("opacity", f"{1-amount:g}")
            node(root, "pose-melee-weapon").set("opacity", strength)
        muscles = ET.Element(f"{{{NS}}}g", {"id": "rage-muscles", "opacity": strength})
        body.insert(list(body).index(arm), muscles)
        if classic:
            path(muscles, "M79 181Q102 162 126 184L132 205Q103 188 85 209L76 225L69 207Z", "#c58ad4", "none")
            path(muscles, "M136 185Q159 172 179 193L184 213Q164 198 140 211Z", "#ae70c6", "none")
            path(muscles, "M83 215Q87 234 104 241M99 187Q111 184 120 190", stroke="#ecc5ed", width=3)
        else:
            path(muscles, "M69 155Q83 139 102 151L115 175Q91 162 79 184L67 193L61 174Z", "#c18bd0", "none")
            path(muscles, "M140 161Q160 144 179 163L182 184Q163 171 145 185Z", "#ae70c3", "none")
            path(muscles, "M75 163Q88 153 99 160M149 169Q161 160 173 170", stroke="#e5b8e9", width=3)
        blade = node(root, "pose-melee-weapon")
        if classic:
            edge = "M243 218Q253 229 248 250L237 257"
        else:
            edge = "M239 275L250 291L237 306L219 296"
    # A narrow edge follows the actual weapon group. It is material on the
    # blade, not an independently rotating slash or a detached aura.
    glow = ET.SubElement(blade, f"{{{NS}}}g", {"id": "rage-blade", "opacity": strength})
    path(glow, edge, stroke="#7de8a0", width=7, opacity=.5)
    path(glow, edge, stroke="#edffc1", width=3)
    # One view-level horizontal fit for the whole action set, pivoted at the
    # original centre. Vertical canvas coordinates and the sole anchor stay.
    children = [child for child in root if child.tag not in {f"{{{NS}}}{tag}" for tag in ("title", "desc", "defs")}]
    fit = ET.SubElement(root, f"{{{NS}}}g", {"id": "rage-frame", "transform": f"translate(128 0) scale({1-.07*amount:g} 1) translate(-128 0)"})
    for child in children:
        root.remove(child)
        fit.append(child)
    return root


def write(root: ET.Element, target: Path, name: str) -> None:
    root.find(f"{{{NS}}}title").text = f"Alchemist · {name}"
    root.find(f"{{{NS}}}desc").text = "Project-drawn chemical rage: the goblin rider stays green; the ogre changes purple, braces its shoulders and carries a lit blade. Static SVG pose with the ordinary canvas and foot coordinates."
    target.parent.mkdir(parents=True, exist_ok=True)
    ET.indent(root, space="  ")
    target.write_text(ET.tostring(root, encoding="unicode") + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-root", type=Path, default=BASE)
    parser.add_argument("--source-root", type=Path, default=HERE / "art/source")
    parser.add_argument("--manifest", type=Path, default=HERE / "rage-manifest.json")
    args = parser.parse_args()
    output = args.output_root.resolve()
    inputs, files, sources = {}, [], []
    for skin in ("pixel", "dota1"):
        relative = Path("scavenger") if skin == "pixel" else Path("dota1/scavenger")
        for side in (False, True):
            prefix = "scavenger-" + ("side-" if side else "")
            for pose in POSES:
                source = BASE / relative / f"{prefix}{pose}.svg"
                inputs[public_path(source)] = sha(source)
                ordinary = ET.parse(source).getroot()
                result = rage(ordinary, classic=skin == "dota1", side=side, amount=1)
                name = "scavenger-rage-" + ("side-" if side else "") + pose
                target = output / relative / f"{name}.svg"
                write(result, target, f"{skin} · {name}")
                files.append({"skin": skin, "path": public_path(target), "sha256": sha(target)})
                if pose == "idle-a":
                    editable = args.source_root.resolve() / f"{skin}-{name}-source.svg"
                    write(copy.deepcopy(result), editable, f"editable {skin} · rage {'side' if side else 'front'}")
                    sources.append({"skin": skin, "path": public_path(editable), "sha256": sha(editable)})
                    for direction in ("in", "out"):
                        for stage in range(3):
                            amount = stage / 2 if direction == "in" else 1 - stage / 2
                            transition = rage(ordinary, classic=skin == "dota1", side=side, amount=amount)
                            name = f"{prefix}morph-{direction}-{stage}"
                            target = output / relative / f"{name}.svg"
                            write(transition, target, f"{skin} · {name}")
                            files.append({"skin": skin, "path": public_path(target), "sha256": sha(target)})
    manifest = {"schemaVersion": 1, "kind": "project-drawn Alchemist chemical rage SVG poses", "runtimeCount": len(files),
                "reference": "Warcraft III / DotA1 Goblin Alchemist normal and Chemical Rage anatomy; visual reference only, no official files included.",
                "rights": "Derived only from existing project-drawn SVG art; no model, texture or model-derived PNG is loaded or embedded.",
                "canvas": {"width": 256, "height": 384, "viewBox": "0 0 256 384", "footCoordinates": "unchanged; runtime bottom remains 16"},
                "generatorInputs": [{"path": public_path(path), "sha256": sha(path)} for path in (Path(__file__), Path(front.__file__))],
                "inputs": [{"path": name, "sha256": digest} for name, digest in inputs.items()], "editableSources": sources, "files": files}
    args.manifest.resolve().parent.mkdir(parents=True, exist_ok=True)
    args.manifest.resolve().write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if any(sha(REPO / name) != digest for name, digest in inputs.items()):
        raise RuntimeError("Ordinary input changed during generation")
    print(f"Generated {len(files)} rage/transition frames and {len(sources)} editable source SVGs; ordinary inputs unchanged.")


if __name__ == "__main__":
    main()
