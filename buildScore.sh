#!/bin/bash

ly="$1"
basely="$(basename -- "$ly")"
dir="$(dirname "$ly")"
edition="$(echo "$dir" | cut -d'/' -f3)"
type="$(echo "$dir" | cut -d'/' -f4)"
choir="${basely%.*}"
svg="src/scores/$edition/$type/${choir}.svg"

echo "$(date): Generating score for $choir (edition: $edition, type: $type)..." 
lilypond --svg -o "src/scores/$edition/$type/" "$ly"

echo "$(date): Removing height= and width= from header of '$svg'"
sed -i '' -E '1,1s/ height="[0-9.]+[a-zA-Z]*"//g; 1,1s/ width="[0-9.]+[a-zA-Z]*"//g' "$svg"