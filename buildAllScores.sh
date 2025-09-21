#!/bin/bash

echo "$(date): Building all scores..."

for ly in "src/lilypond/Hugh Keyte"/**/Choir*.ly; do
  echo "$(date): Building score for "$ly""
  ./buildScore.sh "$ly"
done