"""Build original, static Terrorblade SVG poses. Run from any directory with Python."""
from pathlib import Path
import argparse
from datetime import datetime, timezone
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parent
GAME_ROOT = ROOT.parents[3]
OUTPUT_ROOT = GAME_ROOT / "static" / "dotarogue" / "assets" / "characters"
POSES = ("idle-a", "idle-alt", "walk-a", "walk-b", "dash", "attack-windup", "attack", "attack-release", "skill")
INK = "#101825"
FEL = "#9cec57"


def path(d, fill, stroke=INK, width=5, extra=""):
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{width}" {extra}/>'


def group(name, content, transform=""):
    return f'<g id="{name}" transform="{transform}">{content}</g>'


def line(d, color=FEL, width=5):
    return path(d, "none", color, width)


def glaive(x, y, angle, scale=1):
    # Two opposing hooked crescent blades surround a short central grip.
    s = path("M-8-9C-43-28-34-72 1-91C-18-67-13-44 12-28L21-12Z", "url(#metal)")
    s += path("M8 9C43 28 34 72-1 91C18 67 13 44-12 28L-21 12Z", "url(#metal)")
    s += line("M-2-80C-19-60-14-40 9-24M2 80C19 60 14 40-9 24", "#effbd7", 3)
    s += path("M-17-14L0-24 18-13 18 13 0 24-18 13Z", "#496948", "#152c2e", 4)
    s += path("M-5-14H5V14H-5Z", "#b9a975", "#192c32", 3)
    s += line("M-5-8H5M-5 0H5M-5 8H5", "#edf1ba", 2)
    return f'<g transform="translate({x} {y}) rotate({angle}) scale({scale})">{s}</g>'


def arm(name, shoulder, elbow, hand, demon=False, angle=0, back=False):
    sx, sy = shoulder
    ex, ey = elbow
    hx, hy = hand
    skin = "#434c6a" if back else ("#4a5372" if demon else "#9b85ae")
    s = line(f"M{sx} {sy}L{ex} {ey}L{hx} {hy}", INK, 36 if demon else 26)
    s += line(f"M{sx} {sy}L{ex} {ey}L{hx} {hy}", skin, 28 if demon else 18)
    s += line(f"M{sx-2} {sy-4}L{ex-2} {ey-4}", "#94a0bb" if demon else "#c6abd0", 4)
    s += line(f"M{sx} {sy+3}L{ex+4} {ey-4}L{hx-6} {hy-5}", FEL, 4)
    s += path(f"M{ex-9} {ey-5}L{ex+11} {ey-6}L{hx+10} {hy-6}L{hx-7} {hy+9}Z", "#263c3e", "#111d2a", 4)
    if demon:
        s += path(f"M{hx-12} {hy-8}L{hx+9} {hy-10}L{hx+20} {hy+1}L{hx+15} {hy+16}L{hx+6} {hy+7}L{hx+4} {hy+23}L{hx-3} {hy+11}L{hx-10} {hy+21}L{hx-14} {hy+4}Z", "#646f8d")
        s += line(f"M{hx+14} {hy+3}L{hx+17} {hy+13}M{hx+2} {hy+10}L{hx+3} {hy+19}M{hx-8} {hy+9}L{hx-9} {hy+17}", "#e2e4c0", 3)
    else:
        s += glaive(hx, hy, angle, .72 if back else .88)
        s += path(f"M{hx-9} {hy-6}Q{hx} {hy-13} {hx+9} {hy-5}L{hx+9} {hy+7}Q{hx} {hy+14} {hx-9} {hy+5}Z", skin, "#3b3457", 3)
        s += line(f"M{hx-4} {hy-5}V{hy+5}M{hx+2} {hy-5}V{hy+6}", "#665375", 2)
    return group(name, s)


def legs(side, pose, demon):
    step = {"walk-a": 12, "walk-b": -12, "dash": 18}.get(pose, 0)
    if side:
        left, right = 171-step, 221+step
    else:
        left, right = 160-step, 223+step
    s = path(f"M167 255L194 259L{left+14} 318L{left+10} 346L{left-13} 350L{left-20} 339L{left-9} 306Z", "#2d314f")
    s += path(f"M190 261L219 256L{right+2} 307L{right+13} 339L{right+17} 351L{right-15} 351L{right-23} 337L{right-23} 310Z", "#414260")
    if demon:
        s += path(f"M{left-18} 329L{left+10} 331L{left+14} 350L{left+3} 354L{left-4} 346L{left-13} 354L{left-25} 353Z", "#657188")
        s += path(f"M{right-23} 332L{right+11} 330L{right+27} 353L{right+11} 354L{right+4} 347L{right-3} 354L{right-19} 354Z", "#818a9c")
        s += line(f"M{left-9} 279L{left+2} 298L{left-10} 316M{right-9} 279L{right-1} 298L{right+3} 316", FEL, 4)
    else:
        s += path(f"M{left-15} 311L{left+15} 316L{left+10} 340L{left+15} 352L{left-21} 354L{left-26} 345Z", "#323e44")
        s += path(f"M{right-25} 316L{right+3} 308L{right+12} 338L{right+25} 350L{right+19} 354L{right-14} 353Z", "#405254")
        s += line(f"M{left-12} 319L{left+10} 324M{right-19} 323L{right+4} 317", "#c6bc82", 4)
        s += path("M166 244L216 244L225 288L196 275L171 291Z", "#52406c", "#1d2539", 4)
        s += line("M177 254L178 278M205 253L214 273", "#806990", 3)
    return group("legs", s)


def wings(side, pose):
    spread = {"idle-alt": .96, "walk-a": .94, "walk-b": 1.02, "dash": .82, "attack-windup": .87, "attack": 1.04, "attack-release": .96, "skill": 1.05}.get(pose, 1)
    s = ""
    if side:
        s += path("M181 175C148 117 97 67 51 45L47 107L24 170L73 161L93 220L124 205L151 255Z", "#2b344e", "#111d2a", 6)
        s += path("M191 182C180 124 150 78 115 42L105 103L68 153L112 156L122 208L151 197L174 248Z", "url(#wing)", "#142332", 6)
        s += line("M190 180L115 42M183 179L105 103L68 153M180 183L112 156L122 208M178 185L151 197L174 248", "#79919a", 4)
        s += line("M168 154L122 97L106 142M160 168L137 160L146 183", "#75b65a", 3)
    else:
        for flip in (False, True):
            wing = path("M175 174C138 109 85 64 28 38L38 100L14 171Q45 150 70 153Q70 193 81 223Q100 199 122 201Q130 244 149 264L182 219Z", "url(#wing)", "#111d2a", 6)
            wing += line("M175 174L28 38M169 170L38 100L14 171M166 173L70 153L81 223M172 181L122 201L149 264", "#7c8f9b", 4)
            wing += line("M140 146L63 96L69 133M147 161L100 161L108 186M159 189L146 211", "#72ac59", 3)
            s += f'<g transform="{"translate(384 0) scale(-1 1)" if flip else ""}">{wing}</g>'
    return group("wings", s, f"translate(192 174) scale({spread}) translate(-192 -174)")


def head(side, demon):
    if side:
        s = path("M176 75Q142 80 141 111L149 164L181 186L202 154L187 101Z", "#182336")
        s += path("M177 87L135 102L113 77L159 86Z", "#9f8baf", "#322b46", 4)
        s += path("M169 76C139 74 126 40 137 23C112 38 114 85 153 99Z", "url(#horn)")
        s += path("M189 77C175 45 185 26 209 17C190 19 165 39 174 79Z", "url(#horn)", INK, 4)
        s += path("M174 83Q202 76 215 99L216 117L231 131L218 137L213 154L195 168L176 156L164 119Z", "url(#skin)")
        s += path("M168 95Q191 76 210 101L206 85Q184 65 163 85L150 112Z", "#152234", INK, 4)
        s += path("M177 111L215 109L219 121L176 127Z", "#102628", "#0c171f", 3)
        s += line("M189 117L214 115", FEL, 3)
        s += line("M210 145L219 142", "#433953", 3)
        s += path("M185 159L195 167L209 153L201 178L188 170Z", "#152234", "none", 0)
        if demon:
            s += path("M219 129L236 134L221 139Z", "#93a1a8", INK, 3)
            s += line("M199 134L202 151", FEL, 4)
    else:
        s = path("M158 89Q191 57 226 88L239 143L229 185L208 165L166 173L143 147Z", "#172237")
        s += path("M160 105L117 81L130 115L160 129M224 105L267 81L253 115L224 129", "#9c89b1", "#3b3452", 4)
        s += line("M132 97L154 115M252 97L229 115", "#d1accb", 3)
        s += path("M167 92C123 90 119 52 136 24C103 44 104 97 150 112Z", "url(#horn)")
        s += path("M219 92C263 90 267 52 250 24C283 44 282 97 236 112Z", "url(#horn)")
        s += line("M134 39Q122 78 158 96M252 39Q264 78 228 96", "#a1ad9b", 3)
        s += path("M159 94Q192 76 225 96L226 132L215 160L194 174L171 160L157 131Z", "url(#skin)")
        s += path("M158 112L153 99Q154 73 184 78L193 93L207 80Q234 89 232 108L223 117L217 100L201 102L188 96L169 104L168 117Z", "#142234", INK, 3)
        s += path("M160 114L193 119L225 114L223 132L193 134L161 132Z", "#12292a", "#0a1920", 4)
        s += line("M167 123L184 127M202 127L218 123", FEL, 3)
        s += path("M190 134L187 146L198 148", "none", "#605474", 3)
        s += line("M182 156Q193 160 205 154", "#463c58", 3)
        s += path("M186 165L193 169L202 164L195 184Z", "#122132", "none", 0)
        if demon:
            s += path("M174 149L180 158L183 150M204 151L209 157L214 148", "#e1e7c8", "none", 0)
            s += line("M165 138L173 145M222 137L215 144", FEL, 4)
    if demon:
        if side:
            s += path("M180 84L195 97L204 86L208 104L179 109Z", "#40566c", INK, 3)
        else:
            s += path("M173 91L191 102L210 90L207 111L192 117L176 109Z", "#455f74", INK, 3)
            s += line("M178 144L184 151M208 145L202 153", "#94b884", 3)
    return group("head", s, "translate(0 -7)" if demon else "")


def torso(side, demon):
    if side:
        s = path("M177 156Q157 162 155 183L163 221L177 258L216 255L228 211L215 174L203 160Z", "url(#skin)")
        s += path("M203 173L222 192L216 218L193 228L181 217L188 189Z", "#737292" if not demon else "#4b6074", "#39394f", 3)
        s += line("M190 173L207 190L194 202L211 213M179 185L175 213L188 237", FEL, 5)
        s += path("M170 244L214 242L220 261L173 265Z", "#243936", INK, 4)
        s += line("M177 250L211 248", "#bdb779", 4)
    else:
        s = path("M161 155Q193 164 222 155L247 177L233 212L215 252L173 252L151 211L139 178Z", "url(#skin)")
        s += path("M155 178L176 174L191 187L191 210L164 206Z", "#b39abe" if not demon else "#657a91", "#58516e", 3)
        s += path("M196 187L211 175L235 180L224 207L196 210Z", "#8c7c9f" if not demon else "#4d6078", "#4b465f", 3)
        s += line("M166 174L174 188L165 197L180 202M219 174L209 188L220 197L205 202M180 216L185 230L180 241M207 216L202 230L208 241", FEL, 5)
        s += line("M190 220H198M190 231H198", "#5d5670", 3)
        s += path("M165 245L219 245L226 263L163 263Z", "#213932", INK, 4)
        s += line("M170 252H216", "#b8b677", 4)
        s += path("M192 245L204 254L194 266L182 255Z", "#b3b980", "#384735", 3)
    if demon:
        s += path("M163 162L150 139L170 149L180 169M215 165L236 137L229 172", "#4c6471", INK, 4)
    return group("torso", s, "translate(192 0) scale(1.1 1) translate(-192 0)" if demon else "")


def character(side, demon, pose):
    s = wings(side, pose) if demon else ""
    s += legs(side, pose, demon)
    # Separately authored side anatomy; hands and blades stay joined in each pose.
    if side:
        back = ((169, 182), (149, 212), (150, 244))
        front = ((211, 179), (234, 208), (248, 244))
        angles = (22, -14)
        if pose == "idle-alt": back, front, angles = ((169,182),(146,210),(147,242)), ((211,179),(237,205),(251,242)), (26,-10)
        if pose == "walk-a": back, front, angles = ((169,182),(151,213),(132,243)), ((211,179),(239,211),(265,230)), (10,5)
        if pose == "walk-b": back, front, angles = ((169,182),(180,218),(183,247)), ((211,179),(218,215),(216,243)), (25,-22)
        if pose == "dash": back, front, angles = ((169,182),(143,205),(119,228)), ((211,179),(230,211),(244,242)), (38,-36)
        if pose == "attack-windup": back, front, angles = ((169,182),(146,180),(151,150)), ((211,179),(193,201),(170,218)), (-36,25)
        if pose == "attack": back, front, angles = ((169,182),(200,192),(230,198)), ((211,179),(249,177),(284,174)), (70,70)
        if pose == "attack-release": back, front, angles = ((169,182),(193,209),(222,227)), ((211,179),(245,207),(269,223)), (48,42)
        if pose == "skill": back, front, angles = ((169,182),(152,156),(147,125)), ((211,179),(238,155),(255,125)), (-34,24)
    else:
        back = ((148,178),(124,209),(107,246))
        front = ((236,178),(260,209),(277,246))
        angles = (-16, 16)
        if pose == "idle-alt": back, front, angles = ((148,178),(121,207),(104,242)), ((236,178),(263,207),(280,242)), (-19,19)
        if pose == "walk-a": back, front, angles = ((148,178),(124,202),(103,231)), ((236,178),(255,215),(265,253)), (-25,10)
        if pose == "walk-b": back, front, angles = ((148,178),(129,215),(119,253)), ((236,178),(260,202),(281,231)), (-10,25)
        if pose == "dash": back, front, angles = ((148,178),(122,193),(102,212)), ((236,178),(263,193),(283,212)), (-38,38)
        if pose == "attack-windup": back, front, angles = ((148,178),(121,179),(110,151)), ((236,178),(257,182),(280,176)), (-35,42)
        if pose == "attack": back, front, angles = ((148,178),(161,217),(196,240)), ((236,178),(221,210),(174,229)), (-64,64)
        if pose == "attack-release": back, front, angles = ((148,178),(131,217),(128,255)), ((236,178),(251,217),(256,255)), (-42,42)
        if pose == "skill": back, front, angles = ((148,178),(122,146),(113,117)), ((236,178),(262,146),(271,117)), (-25,25)
    if demon and pose in ("attack", "attack-windup", "skill"):
        if side:
            front = ((211,179),(249,182),(284,184)) if pose=="attack" else front
        else:
            back, front = ((148,178),(124,191),(110,205)), ((236,178),(260,191),(274,205))
    s += arm("far-arm", *back, demon=demon, angle=angles[0], back=True)
    s += torso(side, demon)
    s += head(side, demon)
    s += arm("near-arm", *front, demon=demon, angle=angles[1])
    if demon and pose in ("attack-windup", "attack", "skill"):
        hx, hy = front[2]
        s += group("hand-fel", path(f"M{hx-14} {hy}L{hx-5} {hy-22}L{hx+2} {hy-11}L{hx+13} {hy-27}L{hx+19} {hy-2}L{hx+11} {hy+11}L{hx-6} {hy+12}Z", "#75c953", "#bff492", 3) + path(f"M{hx} {hy+6}L{hx+5} {hy-10}L{hx+10} {hy+5}Z", "#effdc7", "none", 0))
    return group("hero-body", s)


def svg(side=False, demon=False, pose="idle-a", portrait=False):
    skin1, skin2 = ("#647d98", "#263349") if demon else ("#c4a7cd", "#776185")
    defs = f'''<defs>
      <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1"><stop stop-color="{skin1}"/><stop offset="1" stop-color="{skin2}"/></linearGradient>
      <linearGradient id="horn" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b9b69a"/><stop offset=".45" stop-color="#64747b"/><stop offset="1" stop-color="#283440"/></linearGradient>
      <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eef6d3"/><stop offset=".45" stop-color="#8dbb98"/><stop offset=".6" stop-color="#3e736b"/><stop offset="1" stop-color="#92b5a1"/></linearGradient>
      <linearGradient id="wing" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#40546d"/><stop offset=".55" stop-color="#243b43"/><stop offset="1" stop-color="#192431"/></linearGradient>
    </defs>'''
    view = "72 12 240 260" if portrait else "0 0 384 384"
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="384" height="384" viewBox="{view}" fill="none">
<title>灵魂守卫 · {"大恶魔" if demon else "伊利丹原型"} · {"右向侧身" if side else "前视"} · {pose}</title>
<desc>Original project-drawn SVG. Fixed sole baseline 354. Static pose; no embedded animation, script, or external assets.</desc>
{defs}<g stroke-linecap="round" stroke-linejoin="round">{character(side,demon,pose)}</g>
</svg>
'''


def build_review(output: Path, review: Path):
    """Optional offline QA; requires CairoSVG and Pillow, never browser dependencies."""
    from io import BytesIO
    import cairosvg
    from PIL import Image, ImageDraw

    review.mkdir(parents=True, exist_ok=True)

    def render(name, size):
        data = cairosvg.svg2png(url=str(output / name), output_width=size, output_height=size)
        return Image.open(BytesIO(data)).convert("RGBA")

    for file in output.glob("*.svg"):
        if file.name == "tb-portrait.svg":
            continue
        bounds = render(file.name, 384).getchannel("A").getbbox()
        assert bounds and bounds[0] > 0 and bounds[1] > 0 and bounds[2] < 384 and bounds[3] < 384, (file.name, bounds)
    canvas = Image.new("RGB", (1188, 1456))
    draw = ImageDraw.Draw(canvas)
    for bg_index, bg in enumerate(("#eee5c8", "#17232b")):
        top = bg_index * 728
        draw.rectangle((0, top, 1188, top + 728), fill=bg)
        color = "#12202b" if bg_index == 0 else "#e8efd5"
        for row, prefix in enumerate(("tb", "tb-side", "tb-demon", "tb-demon-side")):
            height = 98 if row < 2 else 126
            y = top + row * 178 + 25
            draw.text((6, y - 18), f"{prefix}: {height}px", fill=color)
            for col, pose in enumerate(POSES):
                im = render(f"{prefix}-{pose}.svg", height)
                canvas.paste(im, (col * 132 + (132 - height) // 2, y), im)
                draw.text((col * 132 + 5, y + height + 3), pose, fill=color)
    canvas.save(review / "tb-poses-review.png")
    canvas = Image.new("RGB", (1024, 480), "#e6dec9")
    for i, prefix in enumerate(("tb", "tb-side", "tb-demon", "tb-demon-side")):
        for y, size in ((0, 256), (265, 128), (408, 64)):
            im = render(f"{prefix}-idle-a.svg", size)
            canvas.paste(im, (i * 256 + (256 - size) // 2, y), im)
    canvas.save(review / "tb-form-review.png")
    print("Rendered all poses at 98/126px on light and dark backgrounds; no full-body frame touches canvas edges.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-root", type=Path, default=OUTPUT_ROOT,
                        help="Character output directory; the generator writes its tb/ child.")
    parser.add_argument("--review", action="store_true", help="Render optional offline review sheets.")
    parser.add_argument("--review-dir", type=Path, help="Review output directory; defaults to a new .tmp directory.")
    args = parser.parse_args()
    output = args.output_root.resolve() / "tb"
    output.mkdir(parents=True, exist_ok=True)
    for demon in (False, True):
        prefix = "tb-demon" if demon else "tb"
        for side in (False, True):
            (output / f"{prefix}-{'side' if side else 'hero'}.svg").write_text(svg(side,demon), encoding="utf-8")
            for pose in POSES:
                (output / f"{prefix}-{'side-' if side else ''}{pose}.svg").write_text(svg(side,demon,pose), encoding="utf-8")
    (output / "tb-portrait.svg").write_text(svg(portrait=True), encoding="utf-8")
    for file in output.glob("*.svg"):
        root = ET.parse(file).getroot()
        assert not any(n.tag.split("}")[-1] in ("script", "animate", "animateTransform") for n in root.iter())
    print(f"Generated and XML-checked {len(list(output.glob('*.svg')))} static SVG files.")
    if args.review:
        stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
        review = args.review_dir.resolve() if args.review_dir else GAME_ROOT.parent / ".tmp" / "tb-art-review" / stamp
        build_review(output, review)


if __name__ == "__main__":
    main()
