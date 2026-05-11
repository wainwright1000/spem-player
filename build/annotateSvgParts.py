#!/usr/bin/env python3
"""Post-process LilyPond-generated SVGs to add data-part attributes.

Parses \\pointAndClickOn anchor tags to determine which voice part each
graphical element belongs to, adds data-part="N" attributes, and removes
the anchor wrappers.
"""

import argparse
import re
import xml.dom.minidom as minidom
from urllib.parse import unquote

DEFAULT_SPEM_PATH = "src/lilypond/Hugh Keyte/spem.ly"
PART_INDICES = {
    "Soprano": 0,
    "Alto": 1,
    "Tenor": 2,
    "Baritone": 3,
    "Bass": 4,
}


def parse_spem_ly(path: str) -> list[tuple[int, int, int]]:
    """Parse spem.ly and return a list of (start_line, end_line, part_index)."""
    with open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    variables: list[tuple[int, str, str]] = []
    var_pattern = re.compile(
        r"^(notes(?:I{1,3}|IV)[AB](Soprano|Alto|Tenor|Baritone|Bass))\s*=\s*\\relative"
    )

    for i, line in enumerate(lines, start=1):
        match = var_pattern.match(line)
        if match:
            variables.append((i, match.group(1), match.group(2)))

    part_map: list[tuple[int, int, int]] = []
    for idx, (start, _var_name, part_name) in enumerate(variables):
        end = variables[idx + 1][0] if idx + 1 < len(variables) else len(lines) + 1
        part_map.append((start, end, PART_INDICES[part_name]))

    return part_map


def find_part_index(line_number: int, part_map: list[tuple[int, int, int]]) -> int | None:
    for start, end, part_index in part_map:
        if start <= line_number < end:
            return part_index
    return None


def annotate_svg(svg_path: str, spem_ly_path: str) -> None:
    part_map = parse_spem_ly(spem_ly_path)
    doc = minidom.parse(svg_path)

    a_elems = list(doc.getElementsByTagName("a"))
    href_attr = "href"
    xlink_ns = "http://www.w3.org/1999/xlink"

    for a_elem in a_elems:
        href = a_elem.getAttributeNS(xlink_ns, href_attr)
        if not href:
            continue

        href = unquote(href)

        # Only process anchors pointing to spem.ly (not spem words.ly)
        if "spem.ly:" in href and "spem words.ly" not in href and "spem%20words.ly" not in href:
            match = re.search(r":(\d+):\d+:\d+$", href)
            if match:
                line_number = int(match.group(1))
                part_index = find_part_index(line_number, part_map)
                if part_index is not None:
                    for child in a_elem.childNodes:
                        if (
                            child.nodeType == child.ELEMENT_NODE
                            and child.tagName == "g"
                            and "data-part" not in child.attributes.keys()
                        ):
                            child.setAttribute("data-part", str(part_index))

        # Unwrap anchor: move children to parent, then remove anchor
        parent = a_elem.parentNode
        if parent is not None:
            for child in list(a_elem.childNodes):
                parent.insertBefore(child, a_elem)
            parent.removeChild(a_elem)

    with open(svg_path, "w", encoding="utf-8") as f:
        doc.documentElement.writexml(f)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Add data-part attributes to SVG elements from LilyPond anchor tags."
    )
    parser.add_argument("svg", help="Path to the SVG file to annotate")
    parser.add_argument(
        "--spem",
        default=DEFAULT_SPEM_PATH,
        help=f"Path to spem.ly (default: {DEFAULT_SPEM_PATH})",
    )
    args = parser.parse_args()
    annotate_svg(args.svg, args.spem)


if __name__ == "__main__":
    main()
