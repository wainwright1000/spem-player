"""Tests for scripts/verify_headers.py."""

from pathlib import Path

import verify_headers


class TestHasHeader:
    def test_all_lines_present_with_range(self, tmp_path: Path):
        f = tmp_path / "file.ts"
        f.write_text("# Copyright (c) 2024-2026\n# SPDX-License-Identifier: MIT\n", encoding="utf-8")
        assert verify_headers.has_header(f) is True

    def test_all_lines_present_with_current_year(self, tmp_path: Path):
        f = tmp_path / "file.ts"
        f.write_text("# Copyright (c) 2026\n# SPDX-License-Identifier: MIT\n", encoding="utf-8")
        assert verify_headers.has_header(f) is True

    def test_stale_year_fails(self, tmp_path: Path):
        f = tmp_path / "file.ts"
        f.write_text("# Copyright (c) 2024\n# SPDX-License-Identifier: MIT\n", encoding="utf-8")
        assert verify_headers.has_header(f) is False

    def test_missing_line(self, tmp_path: Path):
        f = tmp_path / "file.ts"
        f.write_text("# Copyright (c) 2026\n", encoding="utf-8")
        assert verify_headers.has_header(f) is False

    def test_unreadable_file(self, tmp_path: Path):
        f = tmp_path / "file.ts"
        f.write_bytes(b"\xff\xfe")
        assert verify_headers.has_header(f) is False


class TestHasValidYear:
    def test_range_ending_in_current_year(self):
        assert verify_headers.has_valid_year("// Copyright (c) 2024-2026\n") is True

    def test_single_current_year(self):
        assert verify_headers.has_valid_year("// Copyright (c) 2026\n") is True

    def test_stale_single_year(self):
        assert verify_headers.has_valid_year("// Copyright (c) 2024\n") is False

    def test_stale_range(self):
        assert verify_headers.has_valid_year("// Copyright (c) 2024-2025\n") is False

    def test_no_copyright_line(self):
        assert verify_headers.has_valid_year("// SPDX-License-Identifier: MIT\n") is False


class TestGetCoreFiles:
    def test_finds_ts_matches(self, tmp_path: Path, monkeypatch):
        monkeypatch.setattr(verify_headers, "REPO_ROOT", tmp_path)
        (tmp_path / "index.ts").write_text("// header\n", encoding="utf-8")
        result = verify_headers.get_core_files()
        assert any("index.ts" in str(p) for p in result)

    def test_finds_mjs_matches(self, tmp_path: Path, monkeypatch):
        monkeypatch.setattr(verify_headers, "REPO_ROOT", tmp_path)
        build = tmp_path / "build"
        build.mkdir()
        (build / "test.mjs").write_text("// header\n", encoding="utf-8")
        result = verify_headers.get_core_files()
        assert any("test.mjs" in str(p) for p in result)

    def test_finds_py_matches(self, tmp_path: Path, monkeypatch):
        monkeypatch.setattr(verify_headers, "REPO_ROOT", tmp_path)
        build = tmp_path / "build"
        build.mkdir()
        (build / "test.py").write_text("# header\n", encoding="utf-8")
        result = verify_headers.get_core_files()
        assert any("test.py" in str(p) for p in result)


class TestGetSkipFiles:
    def test_finds_existing(self, tmp_path: Path, monkeypatch):
        monkeypatch.setattr(verify_headers, "REPO_ROOT", tmp_path)
        bundle = tmp_path / "src/ohmjs/ly-grammar.ohm-bundle.js"
        bundle.parent.mkdir(parents=True)
        bundle.write_text("// generated\n", encoding="utf-8")
        result = verify_headers.get_skip_files()
        assert bundle in result

    def test_missing_file_ignored(self, tmp_path: Path, monkeypatch):
        monkeypatch.setattr(verify_headers, "REPO_ROOT", tmp_path)
        result = verify_headers.get_skip_files()
        assert result == []


class TestMain:
    def test_passes(self, tmp_path: Path, monkeypatch, capsys):
        import sys
        monkeypatch.setattr(sys, "argv", ["prog"])
        monkeypatch.setattr(verify_headers, "REPO_ROOT", tmp_path)
        core = tmp_path / "src/ts"
        core.mkdir(parents=True)
        (core / "test.ts").write_text(
            "// Copyright (c) 2024-2026\n// SPDX-License-Identifier: MIT\n", encoding="utf-8"
        )
        result = verify_headers.main()
        assert result == 0
        captured = capsys.readouterr()
        assert "PASSED" in captured.out

    def test_fails_missing_header(self, tmp_path: Path, monkeypatch, capsys):
        import sys
        monkeypatch.setattr(sys, "argv", ["prog"])
        monkeypatch.setattr(verify_headers, "REPO_ROOT", tmp_path)
        core = tmp_path / "src/ts"
        core.mkdir(parents=True)
        (core / "test.ts").write_text("// no header\n", encoding="utf-8")
        result = verify_headers.main()
        assert result == 1
        captured = capsys.readouterr()
        assert "FAILED" in captured.out

    def test_fails_stale_header(self, tmp_path: Path, monkeypatch, capsys):
        import sys
        monkeypatch.setattr(sys, "argv", ["prog"])
        monkeypatch.setattr(verify_headers, "REPO_ROOT", tmp_path)
        core = tmp_path / "src/ts"
        core.mkdir(parents=True)
        (core / "test.ts").write_text(
            "// Copyright (c) 2024\n// SPDX-License-Identifier: MIT\n", encoding="utf-8"
        )
        result = verify_headers.main()
        assert result == 1
        captured = capsys.readouterr()
        assert "stale header" in captured.out

    def test_fails_unexpected_header(self, tmp_path: Path, monkeypatch, capsys):
        import sys
        monkeypatch.setattr(sys, "argv", ["prog"])
        monkeypatch.setattr(verify_headers, "REPO_ROOT", tmp_path)
        skip = tmp_path / "src/ohmjs"
        skip.mkdir(parents=True)
        (skip / "ly-grammar.ohm-bundle.js").write_text(
            "// Copyright (c) 2024-2026\n// SPDX-License-Identifier: MIT\n", encoding="utf-8"
        )
        result = verify_headers.main()
        assert result == 1
        captured = capsys.readouterr()
        assert "Unexpected header" in captured.out
