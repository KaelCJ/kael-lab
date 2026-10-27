from pathlib import Path
import tempfile
import unittest

import check_static_paths as paths


class StaticPathTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)

    def write(self, name, text=""):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
        return path

    def test_pages_imports_and_script_relative_assets(self):
        self.write("game/static/index.html", '<a href="dotarogue/index.html?mode=1#title">Game</a>')
        self.write("game/static/dotarogue/index.html", '<link href="css/game.css?v=1" rel="stylesheet"><script type="module" src="js/game.js?v=1"></script>')
        self.write("game/static/dotarogue/css/game.css", 'body { background: url("../assets/icon.svg"); }')
        self.write("game/static/dotarogue/js/game.js", 'import { hero } from "./heroes.js?v=1"; const art = new URL("../assets/icon.svg", import.meta.url);')
        self.write("game/static/dotarogue/js/heroes.js", "export const hero = {};")
        self.write("game/static/dotarogue/assets/icon.svg", "<svg/>")
        errors, pages, count = paths.inspect_paths(self.root)
        self.assertEqual(errors, [])
        self.assertEqual(pages, 2)
        self.assertEqual(count, 6)

    def test_old_script_relative_depth_is_rejected(self):
        self.write("game/art/icon.svg", "<svg/>")
        self.write("game/static/dotarogue/js/game.js", 'const art = new URL("../../game/art/icon.svg", import.meta.url);')
        errors, _, _ = paths.inspect_paths(self.root)
        self.assertEqual(len(errors), 1)
        self.assertIn("../../game/art/icon.svg", errors[0])

    def test_multiline_dynamic_and_reexport_imports(self):
        self.write("game/static/dotarogue/js/game.js", 'import {\n first,\n second\n} from "./shared.js";\nexport { first } from "./shared.js";\nimport("./lazy.js");')
        self.write("game/static/dotarogue/js/shared.js")
        self.write("game/static/dotarogue/js/lazy.js")
        errors, _, count = paths.inspect_paths(self.root)
        self.assertEqual(errors, [])
        self.assertEqual(count, 3)

    def test_external_data_and_fragment_urls_are_skipped(self):
        self.write("index.html", '<a href="#intro">Intro</a><a href="https://example.test/path">External</a><img src="data:image/png;base64,abc"><script src="//cdn.example.test/app.js"></script>')
        self.assertEqual(paths.inspect_paths(self.root), ([], 1, 0))

    def test_missing_page_and_css_import_are_reported(self):
        self.write("index.html", '<a href="missing.html">Missing</a>')
        self.write("shared/static/css/styles.css", '@import "./missing.css";')
        errors, _, count = paths.inspect_paths(self.root)
        self.assertEqual(len(errors), 2)
        self.assertEqual(count, 2)

    def test_encoded_relative_paths_and_escape_boundary(self):
        source = self.write("game/static/dotarogue/index.html")
        target = self.write("game/static/dotarogue/assets/hero image.svg")
        self.assertEqual(paths.local_target(self.root, source, "assets/hero%20image.svg?v=1"), target.resolve())
        with self.assertRaises(ValueError):
            paths.local_target(self.root, source, "../../../../outside.svg")

    def test_work_pages_and_root_entry_are_checked(self):
        self.write("index.html", '<a href="work/static/index.html">Work</a>')
        self.write("work/static/index.html", '<a href="help/index.html">Help</a>')
        self.write("work/static/help/index.html", '<script src="../js/help/app.js"></script>')
        self.write("work/static/js/help/app.js")
        self.assertEqual(paths.inspect_paths(self.root), ([], 3, 3))
        (self.root / "work/static/js/help/app.js").unlink()
        errors, pages, _ = paths.inspect_paths(self.root)
        self.assertEqual(pages, 3)
        self.assertTrue(any("work/static/help/index.html" in error for error in errors))

    def test_local_scratch_pages_are_not_published_pages(self):
        self.write("index.html", "<p>Public</p>")
        self.write(".tmp/preview.html", '<script src="missing.js"></script>')
        self.write(".playwright-mcp/test.html", '<script src="missing.js"></script>')
        self.assertEqual(paths.inspect_paths(self.root), ([], 1, 0))


if __name__ == "__main__":
    unittest.main()
