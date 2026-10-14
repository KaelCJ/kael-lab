"""Read-only checks for local artifacts that must not enter the static site."""

import argparse
from pathlib import Path, PurePosixPath
import re
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[1]
IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".bmp", ".tif", ".tiff", ".svg", ".ico"}
LOCAL_DIRECTORIES = {".tmp", ".playwright-mcp", "artifacts"}
SCRATCH_NAME = re.compile(r"^(?:\.?tmp|temp)(?:[-_.]|$)", re.IGNORECASE)


def root_problem(name, is_directory=False):
    if is_directory and name in {".tmp", ".playwright-mcp"}:
        return None
    if name == "artifacts":
        return "legacy output location; use .tmp/artifacts/"
    if name in {"css", "js"}:
        return f"legacy resource location; use static/{name}/"
    if name in {"kael", "meepo", "nest", "lanox", "help", "workspace-assistant.html"}:
        return f"retired root work entry; use work/{name}"
    if SCRATCH_NAME.match(name):
        return "scratch output outside .tmp/"
    if not is_directory and name != "favicon.svg" and Path(name).suffix.lower() in IMAGE_SUFFIXES:
        return "loose root image; place assets in their owning module"
    return None


def is_local_artifact(name):
    path = PurePosixPath(name)
    return (
        path.parts[0] in LOCAL_DIRECTORIES
        or "__pycache__" in path.parts
        or path.suffix.lower() in {".pyc", ".pyo", ".pyd"}
        or (len(path.parts) == 1 and root_problem(name) is not None)
        or bool(SCRATCH_NAME.match(path.parts[0]))
    )


def git_files(root, *arguments):
    result = subprocess.run(
        ["git", "-C", str(root), "ls-files", "-z", *arguments],
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    return set(result.stdout.decode("utf-8", errors="surrogateescape").split("\0")) - {""}


def inspect_workspace(root):
    tracked = git_files(root)
    ignored_tracked = git_files(root, "-ci", "--exclude-standard")
    errors = []
    for entry in sorted(root.iterdir()):
        problem = root_problem(entry.name, entry.is_dir())
        if problem:
            errors.append(f"{entry.name}: {problem}")
    tracked_artifacts = {name for name in tracked if is_local_artifact(name)}
    errors.extend(f"{name}: local artifact is tracked by Git" for name in sorted(tracked_artifacts))
    warnings = sorted(ignored_tracked - tracked_artifacts)
    return errors, warnings


def main(argv=None, root=ROOT):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--strict", action="store_true", help="also fail on other tracked files matching ignore rules")
    args = parser.parse_args(argv)
    try:
        errors, warnings = inspect_workspace(root)
    except (OSError, subprocess.CalledProcessError) as error:
        print(f"ERROR: cannot inspect workspace: {error}", file=sys.stderr)
        return 2

    for error in errors:
        print(f"ERROR: {error}")
    if warnings:
        print(f"WARN: {len(warnings)} other tracked files match ignore rules; confirm ownership before untracking:")
        for name in warnings:
            print(f"  {name}")
    if errors or (args.strict and warnings):
        print(f"FAIL: {len(errors)} artifact issues, {len(warnings)} ownership warnings. No files or index entries changed.")
        return 1
    print(f"PASS: no root clutter or tracked local artifacts; {len(warnings)} ownership warnings. Read-only check.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
