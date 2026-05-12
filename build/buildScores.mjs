#!/usr/bin/env node
/* eslint-env node */
// Copyright (c) 2024-2026 Mark Wainwright
// SPDX-License-Identifier: MIT

import { execSync } from "child_process";
import { globSync } from "fs";
import { basename } from "path";

const defaults = {
  version: "Hugh Keyte",
  notation: "modern",
};

function parseArgs() {
  const args = process.argv.slice(2);
  const options = { ...defaults };
  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const eqIndex = key.indexOf("=");
      if (eqIndex >= 0) {
        options[key.slice(0, eqIndex)] = key.slice(eqIndex + 1);
      } else if (i + 1 < args.length && !args[i + 1].startsWith("--")) {
        options[key] = args[i + 1];
        i++;
      } else {
        options[key] = true;
      }
    }
    i++;
  }
  return options;
}

const options = parseArgs();

const version = options.version || defaults.version;
const notation = options.notation || defaults.notation;
const choir = options.choir;

const lyDir = `src/lilypond/${version}/${notation}`;
const pattern = choir
  ? `${lyDir}/Choir ${choir}.ly`
  : `${lyDir}/Choir*.ly`;

const files = globSync(pattern);

if (files.length === 0) {
  console.error(`No LilyPond files found matching: ${pattern}`);
  process.exit(1);
}

for (const ly of files.sort()) {
  const choirName = basename(ly, ".ly");
  const svg = `src/scores/${version}/${notation}/${choirName}.svg`;

  console.log(`\nBuilding ${choirName} (edition: ${version}, notation: ${notation})...`);
  execSync(`lilypond --svg -o "src/scores/${version}/${notation}/" "${ly}"`, {
    stdio: "inherit",
  });

  console.log(`Post-processing ${svg}...`);
  execSync(`python3 build/postprocessSvg.py "${svg}"`);
}

console.log("\nDone.");
