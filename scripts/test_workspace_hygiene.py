import contextlib
import io
from pathlib import Path
import subprocess
import tempfile
import unittest

import check_workspace_hygiene as hygiene


class WorkspaceHygieneTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.git("init", "--quiet")
        self.write(".gitignore", "/.tmp/\n/.playwright-mcp/\n/artifacts/\n/.workspace-assistant/\n/tmp-*\n**/__pycache__/\n")

    def git(self, *arguments):
        return subprocess.run(
            ["git", "-C", str(self.root), *arguments],
            check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
        ).stdout

    def write(self, relative, content="test"):
        path = self.root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return path

    def test_real_assets_and_local_outputs_are_allowed(self):
        for name in ("shared/static/assets/favicon.svg", "game/art/hero.png", ".tmp/screenshots/test.png", ".playwright-mcp/run/report.json"):
            self.write(name)
        self.git("add", "shared/static/assets/favicon.svg", "game/art/hero.png")
        self.assertEqual(hygiene.inspect_workspace(self.root), ([], []))

    def test_old_root_resource_directories_are_rejected(self):
        self.write("css/styles.css")
        self.write("js/app.js")
        self.write("static/css/styles.css")
        self.write("static/js/app.js")
        errors, _ = hygiene.inspect_workspace(self.root)
        self.assertEqual(len(errors), 3)
        self.assertTrue(any("retired shared static directory" in error for error in errors))
        self.assertTrue(sum("legacy resource location" in error for error in errors) == 2)

    def test_retired_root_work_entries_are_rejected(self):
        for name in ("kael", "meepo", "nest", "lanox", "help"):
            self.write(name + "/index.html")
        self.write("work/" + name + "/index.html")
        self.write("workspace-assistant.html")
        self.write("work/workspace-assistant.html")
        self.write("index.html")
        self.write("games.html")
        self.write("404.html")
        errors, _ = hygiene.inspect_workspace(self.root)
        self.assertEqual(len(errors), 8)
        self.assertTrue(any("retired root work entry; use work/static/" in error for error in errors))
        self.assertTrue(any("retired root page; use game/static/index.html" in error for error in errors))
        self.assertTrue(any("retired root page; use shared/static/404.html" in error for error in errors))
        self.assertTrue(all("retired root" in error for error in errors))

    def test_ignored_root_screenshot_is_still_reported(self):
        self.write("tmp-shot.png")
        errors, warnings = hygiene.inspect_workspace(self.root)
        self.assertTrue(any("tmp-shot.png" in error for error in errors))
        self.assertEqual(warnings, [])

    def test_root_images_and_legacy_directories_are_reported(self):
        self.write("luna-runtime.PNG")
        self.write("temp-foot-game.png")
        self.write(".tmp-render.js")
        self.write("tmp-variants/pose.svg")
        self.write("artifacts/screenshot.png")
        errors, _ = hygiene.inspect_workspace(self.root)
        for name in ("luna-runtime.PNG", "temp-foot-game.png", ".tmp-render.js", "tmp-variants", "artifacts"):
            self.assertTrue(any(error.startswith(name + ":") for error in errors))

    def test_force_added_local_outputs_fail_even_when_ignored(self):
        names = (".tmp/report.json", ".playwright-mcp/screenshot.png", "artifacts/old.png", "game/__pycache__/module.pyc")
        for name in names:
            self.write(name)
        self.git("add", "--force", "--", *names)
        errors, warnings = hygiene.inspect_workspace(self.root)
        for name in names:
            self.assertIn(f"{name}: local artifact is tracked by Git", errors)
        self.assertEqual(warnings, [])

    def test_missing_but_tracked_artifact_still_fails(self):
        image = self.write("old.png")
        self.git("add", "old.png")
        image.unlink()
        errors, _ = hygiene.inspect_workspace(self.root)
        self.assertIn("old.png: local artifact is tracked by Git", errors)

    def test_other_tracked_ignored_files_warn_without_changing_index(self):
        name = ".workspace-assistant/work-item.md"
        self.write(name)
        self.git("add", "--force", name)
        before = self.git("ls-files", "--stage", "-z")
        errors, warnings = hygiene.inspect_workspace(self.root)
        self.assertEqual(errors, [])
        self.assertEqual(warnings, [name])
        with contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(hygiene.main([], root=self.root), 0)
            self.assertEqual(hygiene.main(["--strict"], root=self.root), 1)
        self.assertEqual(self.git("ls-files", "--stage", "-z"), before)
        self.assertTrue((self.root / name).is_file())

    def test_unicode_and_spaces_are_preserved(self):
        name = ".tmp/截图 证据.png"
        self.write(name)
        self.git("add", "--force", name)
        errors, _ = hygiene.inspect_workspace(self.root)
        self.assertIn(f"{name}: local artifact is tracked by Git", errors)

    def test_non_repository_fails_closed(self):
        directory = self.root.parent / (self.root.name + "-not-a-repository")
        with contextlib.redirect_stderr(io.StringIO()):
            self.assertEqual(hygiene.main([], root=directory), 2)


if __name__ == "__main__":
    unittest.main()
