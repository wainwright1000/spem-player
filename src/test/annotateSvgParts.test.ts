import { execSync } from "child_process";
import { mkdtempSync, copyFileSync, readFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

describe("annotateSvgParts build script", () => {
  const tmpDir = mkdtempSync(join(tmpdir(), "spem-annotate-test-"));
  const svgSource = "src/scores/Hugh Keyte/modern/Choir I A.svg";
  const spemSource = "src/lilypond/Hugh Keyte/spem.ly";
  const tmpSvg = join(tmpDir, "Choir I A.svg");
  const tmpSpem = join(tmpDir, "spem.ly");

  beforeAll(() => {
    copyFileSync(svgSource, tmpSvg);
    copyFileSync(spemSource, tmpSpem);
  });

  afterAll(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it("removes all anchor tags and adds data-part attributes", () => {
    execSync(
      `python3 build/annotateSvgParts.py "${tmpSvg}" --spem "${tmpSpem}"`,
      { cwd: process.cwd(), encoding: "utf-8" }
    );

    const output = readFileSync(tmpSvg, "utf-8");

    // No anchor tags should remain
    expect(output).not.toMatch(/<a\s/);
    expect(output).not.toMatch(/<\/a>/);

    // Should contain data-part attributes for Soprano (part 0)
    expect(output).toMatch(/data-part="0"/);

    // Should contain data-part attributes for multiple parts
    expect(output).toMatch(/data-part="4"/);
  });
});
