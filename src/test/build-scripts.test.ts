// @vitest-environment node

import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function readBuildFile(filename: string): string {
  return readFileSync(resolve(__dirname, "../../build", filename), "utf-8");
}

describe("Build script correctness (#191 #192)", () => {
  it("buildScore.sh uses LF line endings only", () => {
    const content = readBuildFile("buildScore.sh");
    expect(content).not.toContain("\r\n");
  });

  it("buildAllScores.sh uses LF line endings only", () => {
    const content = readBuildFile("buildAllScores.sh");
    expect(content).not.toContain("\r\n");
  });

  it("buildScore.sh has strict error handling", () => {
    const content = readBuildFile("buildScore.sh");
    expect(content).toMatch(/set\s+-euo\s+pipefail/);
  });

  it("buildAllScores.sh has strict error handling", () => {
    const content = readBuildFile("buildAllScores.sh");
    expect(content).toMatch(/set\s+-euo\s+pipefail/);
  });

  it("buildScore.sh validates its argument", () => {
    const content = readBuildFile("buildScore.sh");
    expect(content).toMatch(/\$#\s+-eq\s+0/);
  });

  it("buildScore.sh checks lilypond is available", () => {
    const content = readBuildFile("buildScore.sh");
    expect(content).toMatch(/command\s+-v\s+lilypond/);
  });

  it(".gitattributes enforces LF for shell scripts", () => {
    const path = resolve(__dirname, "../../.gitattributes");
    expect(existsSync(path)).toBe(true);
    const content = readFileSync(path, "utf-8");
    expect(content).toMatch(/\*\.sh\s+text\s+eol=lf/);
  });
});
