"""Check local page resources, module imports, and script-relative asset URLs."""

import argparse
from html.parser import HTMLParser
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
PAGE_DIRECTORIES = ("work", "game")
CSS_REFERENCE = re.compile(r"url\(\s*['\"]?([^\s)'\"]+)|@import\s+['\"]([^'\"]+)")
MODULE_REFERENCE = re.compile(
    r"(?:\bimport\s+(?:[^;\"']*?\s+from\s+)?|\bexport\s+[^;\"']*?\s+from\s+|\bimport\s*\(\s*)['\"]([^'\"]+)['\"]"
)
MODULE_URL = re.compile(r"new\s+URL\(\s*['\"]([^'\"]+)['\"]\s*,\s*import\.meta\.url\s*\)")


class PageReferences(HTMLParser):
    def __init__(self):
        super().__init__()
        self.references = []

    def handle_starttag(self, tag, attributes):
        for name, value in attributes:
            if value and ((name == "href" and tag in {"a", "link"}) or (name == "src" and tag in {"script", "img", "iframe", "source", "audio", "video"})):
                self.references.append(value)


def local_target(root, source, reference):
    url = urlsplit(reference)
    if url.scheme or url.netloc or not url.path:
        return None
    path = unquote(url.path)
    target = root / path.lstrip("/") if path.startswith("/") else source.parent / path
    target = target.resolve()
    if not target.is_relative_to(root.resolve()):
        raise ValueError("path escapes the site root")
    return target


def page_files(root):
    pages = list(root.glob("*.html"))
    for name in PAGE_DIRECTORIES:
        directory = root / name
        if directory.is_dir():
            pages.extend(directory.rglob("*.html"))
    return sorted(pages)


def inspect_paths(root):
    errors = []
    checked = 0
    pages = page_files(root)
    sources = [(page, "html") for page in pages]
    sources.extend((path, "css") for path in (root / "static/css").rglob("*.css"))
    sources.extend((path, "js") for path in (root / "static/js").rglob("*.js"))
    for source, kind in sources:
        text = source.read_text(encoding="utf-8-sig")
        if kind == "html":
            parser = PageReferences()
            parser.feed(text)
            references = parser.references
        elif kind == "css":
            references = [first or second for first, second in CSS_REFERENCE.findall(text)]
        else:
            references = MODULE_REFERENCE.findall(text) + MODULE_URL.findall(text)
        for reference in references:
            try:
                target = local_target(root, source, reference)
                if target is None:
                    continue
                checked += 1
                if not target.exists():
                    errors.append(f"{source.relative_to(root).as_posix()}: missing {reference}")
            except ValueError as error:
                errors.append(f"{source.relative_to(root).as_posix()}: {reference}: {error}")
    return errors, len(pages), checked


def main():
    argparse.ArgumentParser(description=__doc__).parse_args()
    try:
        errors, pages, references = inspect_paths(ROOT)
    except (OSError, UnicodeError) as error:
        print(f"ERROR: cannot inspect static resources: {error}", file=sys.stderr)
        return 2
    for error in errors:
        print(f"ERROR: {error}")
    if errors:
        print(f"FAIL: {len(errors)} broken local references.")
        return 1
    print(f"PASS: {pages} HTML pages, {references} local references. Dynamic resource loading still needs browser verification.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
