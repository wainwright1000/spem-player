"""Verify copyright headers are present in source files and absent in generated files."""

import re
import sys
from datetime import datetime
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent

CORE_PATTERNS = [
    "src/ts/*.ts",
    "build/*.mjs",
    "build/*.py",
    "index.ts",
]

SKIP_PATTERNS = [
    "src/ohmjs/ly-grammar.ohm-bundle.js",
    "src/ohmjs/ly-grammar.ohm-bundle.d.ts",
]

REQUIRED_LINES = [
    "Copyright (c)",
    "SPDX-License-Identifier: MIT",
]

COPYRIGHT_RE = re.compile(r"Copyright \(c\) (?:\d{4}-)?(\d{4})")


def get_core_files():
    """Return list of files that should have headers."""
    files = []
    for pattern in CORE_PATTERNS:
        files.extend(REPO_ROOT.glob(pattern))
    return [f for f in files if f.is_file()]


def get_skip_files():
    """Return list of files that should NOT have headers."""
    files = []
    for pattern in SKIP_PATTERNS:
        path = REPO_ROOT / pattern
        if path.exists():
            files.append(path)
    return files


def has_header(path):
    """Check if file contains all required header lines and a valid year."""
    try:
        content = path.read_text(encoding="utf-8")
    except Exception:
        return False

    if not all(line in content for line in REQUIRED_LINES):
        return False

    return has_valid_year(content)


def has_valid_year(content):
    """Check that the copyright line contains the current year or a range ending in it."""
    current_year = datetime.now().year
    for line in content.splitlines():
        if "Copyright (c)" in line:
            match = COPYRIGHT_RE.search(line)
            if match:
                latest_year = int(match.group(1))
                return latest_year == current_year
            return False
    return False


def main():
    errors = []
    core_files = get_core_files()
    skip_files = get_skip_files()

    for path in core_files:
        if not has_header(path):
            errors.append(f"Missing or stale header: {path.relative_to(REPO_ROOT)}")

    for path in skip_files:
        if has_header(path):
            errors.append(f"Unexpected header: {path.relative_to(REPO_ROOT)}")

    if errors:
        print("Header verification FAILED")
        for e in errors:
            print(f"  {e}")
        return 1
    else:
        print("Header verification PASSED")
        return 0


if __name__ == "__main__":
    sys.exit(main())
