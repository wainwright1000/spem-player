#!/bin/bash
# Copyright (c) 2024 Mark Wainwright
# SPDX-License-Identifier: MIT
set -euo pipefail

echo "$(date): Building all scores..."

for ly in "src/lilypond/Hugh Keyte"/Choir*.ly; do
  echo "$(date): Building score for $ly"
  ./build/buildScore.sh "$ly"
done
