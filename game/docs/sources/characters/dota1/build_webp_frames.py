#!/usr/bin/env python3
"""Encode accepted DotA1 PNG frames as pixel-identical lossless WebP files."""

from __future__ import annotations

import argparse
import hashlib
import io
import json
from pathlib import Path

from PIL import Image, features

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]
SOURCE_ROOT = ROOT / 'game/static/dotarogue/assets/characters/dota1'
SOURCE_MANIFEST = HERE / 'model-frames-manifest.json'


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def resolve_argument(path: Path) -> Path:
    return (path if path.is_absolute() else HERE / path).resolve()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output-root', type=Path, default=SOURCE_ROOT,
                        help='Frame output directory; relative paths resolve beside this script.')
    parser.add_argument('--manifest', type=Path, default=HERE / 'webp-frames-manifest.json',
                        help='Manifest destination; relative paths resolve beside this script.')
    args = parser.parse_args()
    output_root = resolve_argument(args.output_root)
    manifest_path = resolve_argument(args.manifest)
    source_manifest_bytes = SOURCE_MANIFEST.read_bytes()
    source_manifest = json.loads(source_manifest_bytes.decode('utf-8'))
    entries = []
    source_total = 0
    for asset in source_manifest['assets']:
        source = ROOT / asset['path']
        relative = source.relative_to(SOURCE_ROOT)
        source_bytes = source.read_bytes()
        if sha256(source_bytes) != asset['sha256'] or len(source_bytes) != asset['bytes']:
            raise ValueError(f'Accepted PNG differs from its source manifest: {asset["path"]}')
        with Image.open(io.BytesIO(source_bytes)) as original:
            image = original.convert('RGBA')
        if image.size != (asset['width'], asset['height']):
            raise ValueError(f'Accepted PNG dimensions differ: {asset["path"]}')
        encoded = io.BytesIO()
        image.save(encoded, format='WEBP', lossless=True, quality=100, method=6, exact=True)
        webp_bytes = encoded.getvalue()
        with Image.open(io.BytesIO(webp_bytes)) as result:
            decoded = result.convert('RGBA')
        rgba = image.tobytes()
        if decoded.size != image.size or decoded.tobytes() != rgba:
            raise ValueError(f'WebP changed decoded RGBA pixels: {asset["path"]}')
        target = output_root / relative.with_suffix('.webp')
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(webp_bytes)
        entries.append({
            'path': Path(asset['path']).with_suffix('.webp').as_posix(),
            'sourcePath': asset['path'],
            'sha256': sha256(webp_bytes),
            'sourceSha256': asset['sha256'],
            'bytes': len(webp_bytes),
            'sourceBytes': len(source_bytes),
            'width': image.width,
            'height': image.height,
            'decodedRGBAEqual': True,
            'decodedRGBASha256': sha256(rgba),
            **{key: asset[key] for key in ['hero', 'form', 'view', 'pose', 'displayProfile', 'sourceGroup']},
        })
        source_total += len(source_bytes)
    if len(entries) != source_manifest['assetCount'] or source_total != source_manifest['totalBytes']:
        raise ValueError('Source frame count or total bytes differ from the accepted manifest')
    manifest = {
        'schemaVersion': 1,
        'purpose': 'Pixel-identical lossless WebP runtime derivatives; accepted PNG files remain unchanged.',
        'sourceManifest': SOURCE_MANIFEST.relative_to(ROOT).as_posix(),
        'sourceManifestSha256': sha256(source_manifest_bytes),
        'rights': 'Inherited from the accepted PNG source manifest; conversion grants no additional rights.',
        'generator': Path(__file__).resolve().relative_to(ROOT).as_posix(),
        'generatorSha256': sha256(Path(__file__).read_bytes()),
        'encoder': {'pillow': Image.__version__, 'libwebp': features.version('webp'),
                    'lossless': True, 'quality': 100, 'method': 6, 'exact': True},
        'assetCount': len(entries),
        'sourceTotalBytes': source_total,
        'totalBytes': sum(entry['bytes'] for entry in entries),
        'assets': entries,
    }
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Encoded {len(entries)} RGBA-identical WebP frames: {source_total:,} -> {manifest["totalBytes"]:,} bytes.')


if __name__ == '__main__':
    main()
