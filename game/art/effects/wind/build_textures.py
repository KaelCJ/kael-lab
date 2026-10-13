"""Rebuild the original wind dust sprite; requires Pillow, not used at runtime."""

from math import exp, hypot
from pathlib import Path
from random import Random

from PIL import Image, ImageFilter


def main():
    size = 128
    rng = Random(197)
    noise = Image.new("L", (16, 16))
    noise.putdata([rng.randrange(65, 256) for _ in range(256)])
    noise = noise.resize((size, size), Image.Resampling.BICUBIC)
    lobes = [(0, 0, 0.42, 1)] + [
        (rng.uniform(-0.42, 0.42), rng.uniform(-0.32, 0.32),
         rng.uniform(0.17, 0.32), rng.uniform(0.35, 0.7))
        for _ in range(7)
    ]
    pixels = []
    for y in range(size):
        for x in range(size):
            nx, ny = (x + 0.5) / size * 2 - 1, (y + 0.5) / size * 2 - 1
            density = sum(weight * exp(-((nx - cx) ** 2 + (ny - cy) ** 2) / radius ** 2)
                          for cx, cy, radius, weight in lobes)
            feather = max(0, min(1, (0.94 - hypot(nx, ny)) * 7))
            alpha = min(205, round(density * (0.62 + noise.getpixel((x, y)) / 510) * 180 * feather))
            pixels.append((213, 207, 177, alpha))
    image = Image.new("RGBA", (size, size))
    image.putdata(pixels)
    image = image.filter(ImageFilter.GaussianBlur(0.7))
    target = Path(__file__).resolve().parent / "png" / "dust.png"
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, optimize=True)
    print(f"Created {target.name}: {size} x {size} RGBA")


if __name__ == "__main__":
    main()
