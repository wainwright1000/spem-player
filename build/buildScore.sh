#!/bin/bash
# Copyright (c) 2024 Mark Wainwright
# SPDX-License-Identifier: MIT
set -euo pipefail

if [ $# -eq 0 ] || [ ! -f "$1" ]; then
  echo "Usage: $0 <lilypond-file>" >&2
  exit 1
fi

command -v lilypond >/dev/null 2>&1 || {
  echo "Error: lilypond not found on PATH" >&2
  exit 1
}

ly="$1"
basely="$(basename -- "$ly")"
dir="$(dirname "$ly")"
edition="$(echo "$dir" | cut -d'/' -f3)"
type="$(echo "$dir" | cut -d'/' -f4)"
choir="${basely%.*}"
svg="src/scores/$edition/$type/${choir}.svg"

echo "$(date): Generating score for $choir (edition: $edition, type: $type)..."
lilypond --svg -o "src/scores/$edition/$type/" "$ly"

echo "$(date): Annotating SVG parts for '$svg'"
python3 build/annotateSvgParts.py "$svg"

echo "$(date): Removing height= and width= from header of '$svg'"
sed -E '1s/ height="[0-9.]+[a-zA-Z]*"//g; 1s/ width="[0-9.]+[a-zA-Z]*"//g' "$svg" > "$svg.tmp" && mv "$svg.tmp" "$svg"
