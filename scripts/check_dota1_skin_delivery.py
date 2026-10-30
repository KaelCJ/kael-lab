#!/usr/bin/env python3
"""Check the formal and local-study DotA1 skin delivery boundaries."""

from __future__ import annotations

import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
GAME = ROOT / "game/static/dotarogue/js/game.js"
HEROES = ROOT / "game/static/dotarogue/js/heroes.js"
FORMAL_ROOT = ROOT / "game/static/dotarogue/assets/characters/dota1"
STUDY_ADAPTER = ROOT / ".tmp/characters-model-study-20261029/game-study/serve.py"


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    raise SystemExit(1)


def main() -> int:
    game = GAME.read_text(encoding="utf-8")
    heroes = HEROES.read_text(encoding="utf-8")

    if "/.tmp/" in game or "../.tmp/" in game:
        fail("formal game.js references local .tmp research files")
    if "HERO_DOTA1_ART" not in game or "HERO_POSE_DOTA1_ART" not in game:
        fail("formal game.js has no DotA1 pose maps")

    hero_ids = re.findall(r"\bid:\s*'([a-z0-9-]+)'", heroes)
    expected = [hero_id for hero_id in hero_ids if hero_id in {
        "rover", "bulwark", "conductor", "scavenger", "jugg", "sf", "kael", "luna", "tb"
    }]
    if len(expected) != 9:
        fail(f"expected 9 playable hero ids, found {len(expected)}")

    missing = []
    for hero_id in expected:
        if not (FORMAL_ROOT / hero_id / f"{hero_id}-idle-a.svg").is_file():
            missing.append(hero_id)
    if missing:
        fail("formal DotA1 idle SVG missing: " + ", ".join(missing))

    formal_svg_count = sum(1 for path in FORMAL_ROOT.rglob("*.svg"))
    if formal_svg_count < 181:
        fail(f"formal DotA1 SVG count unexpectedly low: {formal_svg_count}")

    if not STUDY_ADAPTER.is_file():
        fail("local model-study adapter is missing")
    adapter = STUDY_ADAPTER.read_text(encoding="utf-8")
    for marker in ("FRAME_ROOT", "SF_ROOT", "RAGE_ROOT", "HERO_DOTA1_ART"):
        if marker not in adapter:
            fail(f"model-study adapter missing {marker}")

    print(f"PASS: formal DotA1 mapping has 9 playable heroes and {formal_svg_count} SVG files")
    print("PASS: formal game.js contains no local .tmp model paths")
    print("PASS: model-study adapter remains a separate local response layer")
    return 0


if __name__ == "__main__":
    sys.exit(main())
