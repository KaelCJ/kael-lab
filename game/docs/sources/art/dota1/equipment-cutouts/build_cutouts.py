"""Extract existing icon pixels with reviewed object masks; no runtime dependency."""
import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[5]
SOURCE = ROOT / "game/static/dotarogue/assets/art/dota1/equipment"
DESTINATION = SOURCE.parent / "equipment-cutouts"


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def extract(source, shape):
    image = Image.open(source).convert("RGBA")
    factor = 4
    mask = Image.new("L", (image.width * factor, image.height * factor))
    drawing = ImageDraw.Draw(mask)
    for points, fill in [(shape["outline"], 255)] + [(hole, 0) for hole in shape["holes"]]:
        drawing.polygon([(round(x * factor), round(y * factor)) for x, y in points], fill=fill)
    mask = mask.resize(image.size, Image.Resampling.LANCZOS)
    # Remove antialias ringing and the source icon's rectangular frame.
    mask = mask.point(lambda alpha: 0 if alpha < 4 else alpha)
    interior = Image.new("L", image.size)
    ImageDraw.Draw(interior).rectangle((4, 4, image.width - 5, image.height - 5), fill=255)
    image.putalpha(ImageChops.multiply(image.getchannel("A"), ImageChops.multiply(mask, interior)))
    bounds = image.getbbox()
    if not bounds:
        raise ValueError(f"Empty cutout: {source.name}")
    crop = image.crop(bounds)
    centered = Image.new("RGBA", image.size)
    centered.paste(crop, ((image.width - crop.width) // 2, (image.height - crop.height) // 2))
    return centered, bounds


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-root", type=Path, default=DESTINATION)
    args = parser.parse_args()
    output = args.output_root.resolve()
    output.mkdir(parents=True, exist_ok=True)
    masks = json.loads((HERE / "masks.json").read_text(encoding="utf-8"))
    entries = []
    for item_id, shape in masks.items():
        source = SOURCE / f"{item_id}.png"
        target = output / source.name
        image, bounds = extract(source, shape)
        image.save(target, optimize=True)
        entries.append({"id": item_id, "source": source.relative_to(ROOT).as_posix(),
                        "sourceSha256": sha256(source), "sourceBounds": list(bounds),
                        "output": (DESTINATION / target.name).relative_to(ROOT).as_posix(),
                        "outputSha256": sha256(target), "size": list(image.size)})
    manifest = {"method": "Reviewed object polygons with antialiased alpha; original RGB pixels centered without scaling.",
                "sourceManifest": "game/docs/sources/art/dota1/manifest.json", "items": entries}
    manifest_path = HERE / "manifest.json" if output == DESTINATION else output / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Extracted {len(entries)} equipment cutouts.")


if __name__ == "__main__":
    main()
