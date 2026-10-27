"""Build the original transparent smoke texture; offline only (requires Pillow)."""
from math import cos, exp, sin
from pathlib import Path
import argparse

from PIL import Image


HERE = Path(__file__).resolve().parent
OUTPUT_ROOT = HERE.parents[4] / "static" / "dotarogue" / "assets" / "art" / "effects"
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--output-root", type=Path, default=OUTPUT_ROOT,
                    help="Effect asset root; writes fire/png/smoke.png.")
args = parser.parse_args()

SIZE = 128
image = Image.new("RGBA", (SIZE, SIZE))
pixels = image.load()
for y in range(SIZE):
    for x in range(SIZE):
        nx, ny = (x - 63.5) / 57, (y - 63.5) / 57
        angle = sin(nx * 7 + ny * 3) + cos(ny * 8 - nx * 2)
        radius = (nx * nx + ny * ny) ** .5
        envelope = max(0, 1 - radius) ** 1.7
        billow = .62 + .18 * sin(nx * 10 + sin(ny * 7)) + .12 * cos(ny * 13 - nx * 4)
        alpha = round(210 * envelope * max(.12, billow))
        shade = round(145 + 13 * angle + 12 * exp(-radius * radius * 3))
        pixels[x, y] = (shade, shade + 1, shade - 2, alpha)

output = args.output_root.resolve() / "fire" / "png" / "smoke.png"
output.parent.mkdir(parents=True, exist_ok=True)
image.save(output, optimize=True)
print(f"Generated {output.name}: {SIZE} x {SIZE} RGBA")
