"""Build static, editable hero pose SVGs from the six layered runtime sources.

Run from the repository root with ``python game/characters/build_pose_frames.py``.
The source ``*-hero.svg`` files are never changed. Static frames contain no SVG
animation elements so the game clock alone controls their timing and pause state.
"""

from __future__ import annotations

import copy
import re
import xml.etree.ElementTree as ET
from pathlib import Path


SVG = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG)
HERE = Path(__file__).resolve().parent
POSES = ("idle-alt", "walk-a", "walk-b", "attack", "skill", "dash")
OUTPUT_POSES = ("idle-a", *POSES, "attack-windup", "attack-release")
HEROES = ("rover", "bulwark", "conductor", "scavenger", "jugg", "sf")


def element(root: ET.Element, identity: str) -> ET.Element:
    matches = [node for node in root.iter() if node.get("id") == identity]
    if len(matches) != 1:
        raise ValueError(f"Expected one {identity}, found {len(matches)}")
    return matches[0]


def clean_animations(root: ET.Element) -> None:
    for parent in root.iter():
        for child in list(parent):
            if child.tag.rsplit("}", 1)[-1].startswith("animate"):
                parent.remove(child)


def split_pair(path: ET.Element) -> tuple[ET.Element, ET.Element]:
    """Separate a left/right two-subpath detail without changing its geometry."""
    data = path.get("d", "")
    if data.count("M") == 2:
        cut = data.index("M", 1)
        parts = data[:cut], data[cut:]
    else:
        if data.startswith("m"):
            commands = data[1:].split("m")
            relative_first = True
        else:
            commands = data.split("m")
            relative_first = False
        if len(commands) != 2 or (not relative_first and not commands[0].startswith("M")):
            raise ValueError(f"Cannot split paired leg detail: {data}")
        first = [float(value) for value in re.findall(r"-?\d+(?:\.\d+)?", commands[0])]
        second = [float(value) for value in re.findall(r"-?\d+(?:\.\d+)?", commands[1])]
        if len(first) != 4 or len(second) != 4:
            raise ValueError(f"Cannot split paired leg detail: {data}")
        x1, y1, x2, y2 = first
        dx1, dy1, dx2, dy2 = second
        if relative_first:
            parts = (
                f"M{x1:g} {y1:g}l{x2:g} {y2:g}",
                f"M{x1 + x2 + dx1:g} {y1 + y2 + dy1:g}l{dx2:g} {dy2:g}",
            )
        else:
            parts = (
                f"M{x1:g} {y1:g} {x2:g} {y2:g}",
                f"M{x2 + dx1:g} {y2 + dy1:g}l{dx2:g} {dy2:g}",
            )
    left, right = copy.deepcopy(path), copy.deepcopy(path)
    left.set("d", parts[0])
    right.set("d", parts[1])
    return left, right


def split_legs(root: ET.Element, hero: str) -> tuple[ET.Element, ET.Element] | None:
    if hero == "sf":
        return None  # The shadow body floats; it has no planted feet.

    parent = element(root, "legs" if hero == "jugg" else "hero-body")
    paths = [node for node in parent if node.tag == f"{{{SVG}}}path"]
    if hero == "jugg":
        assignment = "LRLRLRLRLRPLRLRP"
        expected = 16
        first = 0
    elif hero == "rover":
        assignment = "..LRLRPP"
        expected = 8
        first = 2
    elif hero == "conductor":
        assignment = "LRLRLRPPP"
        expected = 9
        first = 0
    else:
        assignment = "LRLRPP"
        expected = 6
        first = 0
    if len(paths) < expected:
        raise ValueError(f"{hero}: expected at least {expected} leg paths")

    # Preserve the source paint order outside the leg block. Every derived frame
    # receives two editable limb groups, each containing its boot and highlights.
    first_node = paths[first]
    insert_at = list(parent).index(first_node)
    left = ET.Element(f"{{{SVG}}}g", {"id": "pose-left-leg"})
    right = ET.Element(f"{{{SVG}}}g", {"id": "pose-right-leg"})
    for index, side in enumerate(assignment):
        if side == ".":
            continue
        source = paths[index]
        if side == "P":
            a, b = split_pair(source)
            left.append(a)
            right.append(b)
        else:
            (left if side == "L" else right).append(copy.deepcopy(source))
        parent.remove(source)
    parent.insert(insert_at, left)
    parent.insert(insert_at + 1, right)
    return left, right


def append_path(group: ET.Element, data: str, *, stroke: str, width: int) -> None:
    ET.SubElement(
        group,
        f"{{{SVG}}}path",
        {
            "d": data,
            "fill": "none",
            "stroke": stroke,
            "stroke-width": str(width),
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
        },
    )


def group_paths(parent: ET.Element, prefixes: tuple[str, ...], identity: str) -> ET.Element:
    """Move selected existing paths into a joint group in derived frames only."""
    paths = [node for node in parent if node.tag == f"{{{SVG}}}path"]
    selected = []
    for prefix in prefixes:
        matches = [node for node in paths if node.get("d", "").startswith(prefix)]
        if len(matches) != 1:
            raise ValueError(f"Expected one {identity} path beginning {prefix!r}")
        selected.append(matches[0])
    index = min(list(parent).index(node) for node in selected)
    group = ET.Element(f"{{{SVG}}}g", {"id": identity})
    for node in paths:
        if node in selected:
            parent.remove(node)
            group.append(node)
    parent.insert(index, group)
    return group


def prepare_parts(root: ET.Element, hero: str) -> dict[str, ET.Element]:
    body = element(root, "hero-body")
    parts: dict[str, ET.Element] = {}
    if hero == "rover":
        # The rifle is held with both hands. Move the sleeves, bracers, hands,
        # and stock through the same recoil transform while retaining the
        # source's paint order around the face and coat.
        parts["left-arm"] = group_paths(
            body,
            ("M67 145", "M43 158", "M45 167", "M31 211", "M33 227"),
            "pose-rifle-left-arm",
        )
        parts["right-arm"] = group_paths(
            body,
            ("M167 143", "M175 150", "M177 158", "M191 211", "M192 231"),
            "pose-rifle-right-arm",
        )
        weapon = element(root, "hero-weapon")
        children = list(body)
        index = children.index(weapon)
        hands = children[index + 1:index + 5]
        if len(hands) != 4 or any(node.tag != f"{{{SVG}}}path" for node in hands):
            raise ValueError("Rover rifle must be followed by four hand paths")
        holder = ET.Element(f"{{{SVG}}}g", {"id": "pose-rifle-hold"})
        for node in [weapon, *hands]:
            body.remove(node)
            holder.append(node)
        body.insert(index, holder)
        parts["arm"] = holder
    elif hero == "bulwark":
        arm = group_paths(
            body,
            ("M184 140", "M181 153", "M190 202", "m187 216", "M195 248"),
            "pose-swing-arm",
        )
        blade = ET.SubElement(arm, f"{{{SVG}}}g", {"id": "pose-melee-weapon"})
        ET.SubElement(blade, f"{{{SVG}}}path", {
            "d": "M207 250l12 -4 8 15-13 14-18-5z",
            "fill": "#916842", "stroke": "#3c3032", "stroke-width": "5",
        })
        ET.SubElement(blade, f"{{{SVG}}}path", {
            "d": "M216 250l30 -30-8 39-21 11z",
            "fill": "#eadbb4", "stroke": "#755c49", "stroke-width": "5",
            "stroke-linejoin": "round",
        })
        append_path(blade, "M221 255l18 -26", stroke="#fff3d4", width=3)
        parts["arm"] = arm
    elif hero == "conductor":
        parts["arm"] = group_paths(
            body,
            ("M175 131", "m182 188", "m180 219", "m181 181", "m190 189"),
            "pose-hammer-arm",
        )
        parts["cast-arm"] = group_paths(
            body,
            ("M72 132", "m40 195", "m30 222", "m27 256", "m20 279"),
            "pose-cast-arm",
        )
    elif hero == "scavenger":
        arm = group_paths(
            body,
            ("M183 144", "M181 157", "M190 204", "m187 218", "M194 250"),
            "pose-swing-arm",
        )
        club = ET.SubElement(arm, f"{{{SVG}}}g", {"id": "pose-melee-weapon"})
        append_path(club, "M210 263l22 27", stroke="#293b3d", width=11)
        append_path(club, "M210 263l22 27", stroke="#bd9158", width=5)
        ET.SubElement(club, f"{{{SVG}}}path", {
            "d": "M221 280l21 -8 11 20-16 18-23-13z",
            "fill": "#8ca1a0", "stroke": "#263b40", "stroke-width": "5",
            "stroke-linejoin": "round",
        })
        append_path(club, "M225 289l17 -4", stroke="#e4ecce", width=3)
        parts["arm"] = arm
    elif hero == "sf":
        # The original has paired arm subpaths. Split them into two manipulable
        # groups so the basic soul shot and the requiem channel pose differ.
        paths = [node for node in body if node.tag == f"{{{SVG}}}path"]
        shoulders = paths[8:11]
        if len(shoulders) != 3 or not shoulders[2].get("d", "").startswith("m43 166"):
            raise ValueError("Shadow arm source order changed")
        weapon = element(root, "hero-weapon")
        claws = list(weapon)
        if len(claws) != 3:
            raise ValueError("Shadow claw source order changed")
        left = ET.Element(f"{{{SVG}}}g", {"id": "pose-left-arm"})
        right = ET.Element(f"{{{SVG}}}g", {"id": "pose-right-arm"})
        left.append(copy.deepcopy(shoulders[0]))
        right.append(copy.deepcopy(shoulders[1]))
        for group, data in ((left, "M43 166l-23 18 15 20 23-13"),
                            (right, "M213 166l23 18-15 20-23-13")):
            forearm = copy.deepcopy(shoulders[2])
            forearm.set("d", data)
            group.append(forearm)
        left.append(copy.deepcopy(claws[0]))
        right.append(copy.deepcopy(claws[1]))
        for group, data in ((left, "M26 223l-16 16 20-3-5 14 16-19"),
                            (right, "M230 223l16 16-20-3 5 14-16-19")):
            detail = copy.deepcopy(claws[2])
            detail.set("d", data)
            group.append(detail)
        for node in shoulders:
            body.remove(node)
        for node in claws:
            weapon.remove(node)
        weapon.extend([left, right])
        parts["left-arm"] = left
        parts["right-arm"] = right
    return parts


def pose(root: ET.Element, hero: str, name: str) -> None:
    output_name = name
    windup = name == "attack-windup"
    release = name == "attack-release"
    if name.startswith("attack-"):
        name = "attack"
    is_jugg = hero == "jugg"
    scale = 2 if is_jugg else 1
    cx = 253 if is_jugg else 128
    body_pivot = 500 if is_jugg else 350
    motion = element(root, "hero-motion")
    body = element(root, "hero-body")
    weapon = element(root, "hero-weapon")
    accessory = element(root, "hero-accessory")
    legs = split_legs(root, hero)
    parts = prepare_parts(root, hero)

    body_angles = {"idle-alt": -1.5, "walk-a": -4, "walk-b": 4,
                   "attack": -4, "skill": 3, "dash": 9}
    b = body_angles[name]
    if hero == "bulwark" and name == "attack":
        b = -3
    elif hero == "sf" and name == "attack":
        b = -8
    elif hero in {"bulwark", "sf"} and name == "skill":
        b = 8
    if hero == "bulwark" and name == "skill":
        b = 3
    if hero in {"rover", "bulwark", "conductor", "scavenger"} and name == "dash":
        b = 0
    if hero == "rover" and name == "walk-b":
        b = -1
    lift = {"idle-alt": -2, "walk-a": -3, "walk-b": -3,
            "attack": -2, "skill": -4, "dash": -3}[name] * scale
    if is_jugg and release:
        lift -= 12  # Keep the long sword tip inside its original canvas.
    shift = -5 * scale if name == "dash" else 0
    if is_jugg and windup:
        shift = -32
    elif is_jugg and name == "skill":
        shift = -20
    elif hero == "conductor" and name == "dash":
        shift = 0
    motion.set("transform", f"translate({shift} {lift})")
    body.set("transform", f"rotate({b:g} {cx} {body_pivot})")

    if legs:
        left, right = legs
        leg_angles = {
            "idle-alt": (-1.5, 1.5),
            "walk-a": (11, -10),
            "walk-b": (-10, 11),
            "attack": (-6, 7),
            "skill": (5, -5),
            "dash": (20, -18),
        }
        a, z = leg_angles[name]
        if hero == "conductor" and name in {"walk-a", "walk-b"}:
            a *= .2
            z *= .2
        elif hero == "conductor" and name == "attack":
            a = z = 0
        elif hero == "conductor" and name == "dash":
            a *= .5
            z *= .5
        hip_y = 500 if is_jugg else 261
        left.set("transform", f"rotate({a:g} {cx - 12 * scale} {hip_y})")
        right.set("transform", f"rotate({z:g} {cx + 12 * scale} {hip_y})")

    # These are part-specific movements. The character stays upright while a
    # weapon or silhouette cue moves far enough to read at 82–94 game units.
    swing = {
        "rover": (118, 228, (-2, 11, -11, -29, -38, 6)),
        "bulwark": (128, 205, (3, 10, -10, 14, -14, -12)),
        "conductor": (181, 135, (-4, 17, -17, 0, 0, 10)),
        "scavenger": (204, 199, (4, -16, 16, 0, -12, 8)),
        "sf": (128, 188, (-3, 12, -12, 0, 0, 2)),
        "jugg": (151, 458, (-3, 8, -8, -70, -24, -5)),
    }
    wx, wy, angles = swing[hero]
    w = angles[POSES.index(name)]
    if windup:
        w = {"rover": -43, "bulwark": -17, "conductor": 0,
             "scavenger": 3, "jugg": -90, "sf": 0}[hero]
    elif release:
        w = {"rover": -38, "bulwark": 24, "conductor": -36,
             "scavenger": 24, "jugg": 32, "sf": 28}[hero]
    if is_jugg:
        arm = element(root, "right-arm")
        arm_angle = {"idle-alt": -2, "walk-a": 9, "walk-b": -9,
                     "attack": 36, "skill": -14, "dash": -10}[name]
        if windup:
            arm_angle = -15
        elif release:
            arm_angle = 50
        arm.set("transform", f"rotate({arm_angle:g} 158 331)")
        # The sword and the overlaid grip fingers are siblings of hero-body
        # in the source. Give them the body's and sword arm's exact transforms:
        # an extra wrist rotation would pull the fingers off the handle.
        weapon.set(
            "transform",
            f"rotate({b:g} 253 500) rotate({arm_angle:g} 158 331)",
        )
        banner = element(root, "banner")
        banner.set("transform", f"rotate({-arm_angle / 8:g} 334 100)")
    else:
        if hero == "rover":
            recoil = {"idle-alt": -1, "walk-a": -4, "walk-b": -8,
                      "attack": 0, "skill": 22, "dash": 0}[name]
            if windup:
                recoil = -14
            elif release:
                recoil = -5
            arm_transform = f"rotate({recoil:g} 128 171)"
            for part in (parts["left-arm"], parts["right-arm"], parts["arm"]):
                part.set("transform", arm_transform)
        elif hero == "conductor":
            raise_angle = {"idle-alt": -3, "walk-a": 10, "walk-b": -10,
                           "attack": 12, "skill": -20, "dash": -13}[name]
            cast_angle = {"idle-alt": 0, "walk-a": -5, "walk-b": 5,
                          "attack": -55, "skill": -68, "dash": -18}[name]
            if windup:
                raise_angle = -12
                cast_angle = -28
            elif release:
                raise_angle = 20
                cast_angle = -68
            parts["arm"].set("transform", f"rotate({raise_angle:g} 180 151)")
            parts["cast-arm"].set("transform", f"rotate({cast_angle:g} 72 132)")
            if name in {"attack", "skill"}:
                for spark in body:
                    if spark.tag == f"{{{SVG}}}path" and spark.get("d", "").startswith("m19 256"):
                        spark.set("opacity", ".12")
                append_path(parts["cast-arm"], "M18 261l-12 -14 7 19-9 5", stroke="#d9f8ff", width=5)
            # hero-weapon and pose-hammer-arm are both children of hero-body.
            # One shoulder transform keeps hammer, wrist, and armor connected.
            weapon.set("transform", f"rotate({raise_angle:g} 180 151)")
            accessory.set(
                "transform",
                "translate(-15 12)" if name == "skill" else "translate(0 12)" if name == "attack"
                else f"rotate({raise_angle:g} 180 151)",
            )
        elif hero == "scavenger":
            arm_angle = {"idle-alt": 0, "walk-a": -6, "walk-b": 6,
                         "attack": 42, "skill": -4, "dash": 2}[name]
            if windup:
                arm_angle = 6
            elif release:
                arm_angle = 54
            parts["arm"].set("transform", f"rotate({arm_angle:g} 184 154)")
            # The flask is a skill prop. In basic attacks the right fist holds
            # the club built into pose-swing-arm; do not leave a second prop
            # floating beside the same hand.
            weapon.set("opacity", "0" if name == "attack" else "1")
            element(root, "pose-melee-weapon").set(
                "opacity", "1" if name == "attack" else "0"
            )
            if name == "skill":
                weapon.set("transform", f"rotate({arm_angle:g} 184 154)")
            element(root, "chemical-tank").set(
                "transform", f"rotate({-w / 3:g} 174 181)"
            )
            accessory.set("transform", f"rotate({-w / 2:g} 128 199)")
        elif hero == "bulwark":
            arm_angle = {"idle-alt": 0, "walk-a": -5, "walk-b": 5,
                         "attack": 42, "skill": 2, "dash": 2}[name]
            if windup:
                arm_angle = 5
            elif release:
                arm_angle = 53
            parts["arm"].set("transform", f"rotate({arm_angle:g} 184 151)")
            quill_angle = 0 if name == "skill" or name == "walk-b" else w
            weapon.set("transform", f"rotate({quill_angle:g} {wx} {wy})")
            accessory.set("transform", f"rotate({-w / 2:g} 128 205)")
        elif hero == "sf":
            left_angle, right_angle = {
                "idle-alt": (-2, 2), "walk-a": (3, -3), "walk-b": (-5, 5),
                "attack": (-40, 40), "skill": (-27, 27), "dash": (-14, 14),
            }[name]
            if windup:
                left_angle, right_angle = -10, 10
            elif release:
                left_angle, right_angle = -20, 20
            parts["left-arm"].set("transform", f"rotate({left_angle:g} 88 139)")
            parts["right-arm"].set("transform", f"rotate({right_angle:g} 168 139)")
            accessory.set("transform", f"rotate({-w / 2:g} 128 145)")
        else:
            weapon.set("transform", f"rotate({w:g} {wx} {wy})")

    # A single static impact accent belongs in the event frame, not in the
    # idle loop. It also identifies distant gunfire, thunder and alchemy.
    if output_name == "attack" and hero == "rover":
        append_path(weapon, "M245 177l9 -7m-8 8 9 1m-10 0 4 9", stroke="#ffe49a", width=5)
    elif name == "skill" and hero == "rover":
        append_path(weapon, "M242 177l8 -14M242 177l8 0M242 177l8 14", stroke="#ffe39a", width=6)
    elif output_name == "attack" and hero == "bulwark":
        append_path(weapon, "M46 183l-20 -24M95 163l-9 -25M204 185l22 -23", stroke="#f2c06d", width=6)
    elif name == "skill" and hero == "bulwark":
        append_path(weapon, "M45 215l-28 -8M60 177l-24 -26M112 158l-5 -28M172 161l12 -27M208 192l28 -22M215 227l27 0", stroke="#f7d084", width=6)
    elif name == "skill" and hero == "conductor":
        append_path(accessory, "M229 42l10 -13-4 19 13-8", stroke="#efffff", width=5)
        append_path(accessory, "M174 68l-18 -19 5 24-17-7M206 65l22 -24-6 27 17-9", stroke="#9cefff", width=6)
    elif output_name == "attack" and hero == "conductor":
        append_path(accessory, "M208 83l19 -12-7 18", stroke="#e4faff", width=5)
    elif output_name == "attack" and hero == "scavenger":
        append_path(element(root, "pose-melee-weapon"), "M225 279q22 -14 27-6", stroke="#e0eabf", width=6)
        append_path(element(root, "pose-melee-weapon"), "M222 285l17 -8", stroke="#fff0b6", width=7)
    elif name == "skill" and hero == "scavenger":
        append_path(weapon, "M222 196l13 -6-7 13 12 2", stroke="#bfff72", width=5)
        append_path(weapon, "M188 180q18 -22 34 0M191 213q14 14 28 2", stroke="#c5ff90", width=6)
    elif output_name == "attack" and hero == "sf":
        for group, x in ((parts["left-arm"], 31), (parts["right-arm"], 225)):
            ET.SubElement(group, f"{{{SVG}}}circle", {
                "cx": str(x), "cy": "204", "r": "12", "fill": "url(#sfSoul)",
            })
    elif name == "skill" and hero == "sf":
        append_path(accessory, "M30 169l-16 -17 2 26M225 169l17 -17-2 26M108 184l-12 8 17 0m35-8 12 8-17 0", stroke="#ffba6d", width=6)
        ET.SubElement(
            accessory, f"{{{SVG}}}circle",
            {"cx": "132", "cy": "192", "r": "23", "fill": "none", "stroke": "#ffad65", "stroke-width": "5"},
        )
    elif output_name == "attack" and hero == "jugg":
        append_path(weapon, "M174 469Q275 550 407 593", stroke="#f5f2c9", width=8)
    elif name == "skill" and hero == "jugg":
        append_path(motion, "M89 330Q49 435 108 521M388 300Q456 410 397 516", stroke="#f0bd73", width=11)
        append_path(motion, "M106 355Q70 430 126 499M373 328Q421 409 382 487", stroke="#fff0b3", width=5)

    if name == "dash":
        color = {
            "rover": "#8ee3dc", "bulwark": "#eab779", "conductor": "#b6eeff",
            "scavenger": "#b6eb83", "jugg": "#e89a65", "sf": "#dc648a",
        }[hero]
        streaks = ET.Element(f"{{{SVG}}}g", {"id": "pose-speed-trails"})
        if is_jugg:
            append_path(streaks, "M34 292h103M18 397h89M39 523h66", stroke=color, width=8)
        else:
            append_path(streaks, "M12 144h47M5 208h41M15 279h36", stroke=color, width=5)
        motion.insert(0, streaks)

    # Keep the same transparent canvas and descriptive metadata on every pose.
    title = root.find(f"{{{SVG}}}title")
    desc = root.find(f"{{{SVG}}}desc")
    if title is not None:
        title.text = f"{hero} · {output_name} pose"
    if desc is not None:
        desc.text = "Editable static SVG action frame; no autonomous SVG animation."
    if name.startswith("walk") and hero == "sf":
        # Floating flames read as lateral momentum without inventing feet.
        body.set("transform", f"rotate({b:g} 128 345) skewX({-b / 2:g})")


def build(hero: str) -> None:
    directory = HERE / hero / "art" / "runtime"
    source = directory / f"{hero}-hero.svg"
    if not source.is_file():
        raise FileNotFoundError(source)
    source_bytes = source.read_bytes()
    for name in OUTPUT_POSES:
        root = ET.fromstring(source_bytes)
        if root.get("viewBox") != ("0 0 512 768" if hero == "jugg" else "0 0 256 384"):
            raise ValueError(f"Unexpected {hero} viewBox")
        clean_animations(root)
        if name == "idle-a":
            title = root.find(f"{{{SVG}}}title")
            desc = root.find(f"{{{SVG}}}desc")
            if title is not None:
                title.text = f"{hero} · idle pose"
            if desc is not None:
                desc.text = "Editable static SVG idle frame; no autonomous SVG animation."
        else:
            pose(root, hero, name)
        ET.indent(root, space="  ")
        output = directory / f"{hero}-{name}.svg"
        output.write_text(
            ET.tostring(root, encoding="unicode", xml_declaration=False) + "\n",
            encoding="utf-8",
        )
        check = ET.parse(output).getroot()
        if any(node.tag.rsplit("}", 1)[-1].startswith("animate") for node in check.iter()):
            raise ValueError(f"Animation remains in {output}")
        print(output.relative_to(HERE.parent.parent))
    if source.read_bytes() != source_bytes:
        raise RuntimeError(f"Source changed during generation: {source}")


if __name__ == "__main__":
    for hero_id in HEROES:
        build(hero_id)
