# Bugs, Hacks, and Technical Debt Register

This document is the canonical register of all known bugs, hacks, todos, and architectural debt in the Spem Player codebase. It is populated during Phase 1 (Discovery) and updated through Phase 2 (Assessment), Phase 3 (Specification), and Phase 4 (Implementation Planning).

Process document: `TECH_DEBT.md`

## Item Count

- Total items: 32
- Completed: 1
- Open: 31

## Items

### TODO-UI-001

- **Type**: TODO
- **Area**: UI
- **Status**: assessed
- **Priority**: P2
- **Difficulty**: M
- **Source file**: `index.ts`
- **Source line**: 44
- **First seen**: 2024-04-19 (fcbf6163)
- **Raw text**: "TODO: click on score should send you to bar.  And part?"
- **Description**: The score is already clickable (scoreClicked exists in MusicScore.ts) but only sets the bar, not the part. Clicking on a specific staff or voice part could also select that part.
- **PD required**: ask-mark
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Requires mapping click Y-coordinate to voice part within the SVG. Mark may have a preference for whether part selection from score clicks is desirable.

### TODO-UI-002

- **Type**: TODO
- **Area**: UI
- **Status**: assessed
- **Priority**: P3
- **Difficulty**: XS
- **Source file**: `index.ts`
- **Source line**: 45
- **First seen**: 2024-04-19 (fcbf6163)
- **Raw text**: "TODO: Change dark mode to moon/sun icons"
- **Description**: Replace the current dark mode toggle icon with moon/sun icons for clearer visual affordance.
- **PD required**: none
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Pure design task. SVG assets needed.

### TODO-UI-003

- **Type**: TODO
- **Area**: UI
- **Status**: assessed
- **Priority**: P2
- **Difficulty**: L
- **Source file**: `index.ts`
- **Source line**: 46
- **First seen**: 2024-04-19 (fcbf6163)
- **Raw text**: "TODO: Visual effect for false relations"
- **Description**: Highlight false relations (specific dissonant harmonic intervals) in the score or canvas with a visual effect. Requires detecting false relations from the parsed note data.
- **PD required**: ask-mark
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Needs music theory domain knowledge to implement detection correctly. Ask Mark for definition of false relations in this context.

### TODO-UI-004

- **Type**: TODO
- **Area**: UI
- **Status**: assessed
- **Priority**: P3
- **Difficulty**: XS
- **Source file**: `index.ts`
- **Source line**: 47
- **First seen**: 2024-04-19 (fcbf6163)
- **Raw text**: "TODO: Better font/graphic for Spem Player title"
- **Description**: Improve the title graphic or font used for "Spem Player" in the header.
- **PD required**: none
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Pure design task.

### BUG-SCORE-001

- **Type**: BUG
- **Area**: SCORE
- **Status**: assessed
- **Priority**: P2
- **Difficulty**: XS
- **Source file**: `index.ts`
- **Source line**: 48
- **First seen**: 2024-04-19 (fcbf6163)
- **Raw text**: "BUG: can scroll up and down a tiny bit in score"
- **Description**: The music-score element allows slight vertical scrolling. Likely caused by the SVG container or flex layout not constraining overflow precisely after the splitter sets the height.
- **PD required**: repro
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: The comment notes this disappears after manual height adjustment, suggesting flex: 1 initialisation is involved.

### BUG-SCORE-002

- **Type**: BUG
- **Area**: SCORE
- **Status**: assessed
- **Priority**: P2
- **Difficulty**: S
- **Source file**: `index.ts`
- **Source line**: 49
- **First seen**: 2024-04-19 (fcbf6163)
- **Raw text**: "BUG: [Violation] Forced reflow while executing JavaScript took 36ms  (this doesn't happen when you have already manually adjusted the height of the score - something to do with the flex: 1 after the reload?)"
- **Description**: During initial load, JavaScript forces a layout recalculation costing 36ms. The comment indicates this is related to flex layout initialisation and does not occur after manual height adjustment. Likely caused by reading layout properties (offsetHeight, getBoundingClientRect) before the DOM has settled, or by setting styles that trigger synchronous layout.
- **PD required**: repro
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Use Chrome DevTools Performance tab or add console.time markers to identify the exact line causing the forced reflow.

### TODO-BUILD-001

- **Type**: TODO
- **Area**: BUILD
- **Status**: assessed
- **Priority**: P3
- **Difficulty**: L
- **Source file**: `index.ts`
- **Source line**: 50
- **First seen**: 2024-04-24 (ce3d97f7)
- **Raw text**: `TODO: build: minimse SVGs using <use> and <defs> elements`
- **Description**: Post-process the LilyPond-generated SVGs to deduplicate repeated elements (clefs, noteheads, etc.) using SVG `<use>` and `<defs>`, reducing file size and network transfer.
- **PD required**: spike
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Requires understanding LilyPond SVG output structure. May be complex due to LilyPond's use of transforms and unique IDs.

### TODO-BUILD-002

- **Type**: TODO
- **Area**: BUILD
- **Status**: assessed
- **Priority**: P2
- **Difficulty**: M
- **Source file**: `index.ts`
- **Source line**: 51
- **First seen**: 2024-04-24 (ce3d97f7)
- **Raw text**: "TODO: build: generate SVG from lilypond as part of build process"
- **Description**: Integrate LilyPond SVG generation into the Vite build pipeline so `npm run build` automatically regenerates scores from source, rather than requiring a separate manual step.
- **PD required**: none
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: LilyPond must be available at build time. On Windows, the sed command in buildScore.sh uses macOS syntax and needs cross-platform handling.

### TODO-UI-005

- **Type**: TODO
- **Area**: UI
- **Status**: assessed
- **Priority**: P2
- **Difficulty**: XS
- **Source file**: `index.ts`
- **Source line**: 52
- **First seen**: 2024-04-19 (fcbf6163)
- **Raw text**: "TODO: CMD-B to type in bar number"
- **Description**: Add a keyboard shortcut (Cmd/Ctrl+B) that opens a prompt or input field allowing the user to type a bar number and jump directly to it.
- **PD required**: none
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Similar to existing keyboard shortcuts in index.ts. Should respect focus guards (not active when input focused).

### TODO-UI-006

- **Type**: TODO
- **Area**: UI
- **Status**: assessed
- **Priority**: P2
- **Difficulty**: M
- **Source file**: `index.ts`
- **Source line**: 53
- **First seen**: 2024-04-19 (fcbf6163)
- **Raw text**: "TODO: highlight part on score?"
- **Description**: When a specific voice part is selected (e.g., Soprano), highlight that part's staff or notes in the displayed SVG score.
- **PD required**: ask-mark
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Requires identifying part-specific SVG elements. Mark may have a preference for highlight style (colour, opacity, underline).

### TODO-UI-007

- **Type**: TODO
- **Area**: UI
- **Status**: assessed
- **Priority**: P3
- **Difficulty**: M
- **Source file**: `index.ts`
- **Source line**: 54
- **First seen**: 2024-04-19 (e1d8a72f)
- **Raw text**: "TODO: Add lyrics to footer"
- **Description**: Display the lyrics (Latin text of Spem in alium) in the footer area, synchronised with the current bar or scrollable.
- **PD required**: ask-mark
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Source of lyrics unknown (may be in LilyPond source, separate file, or needs to be added). Ask Mark for lyric source and desired display format.

### BUG-CANVAS-001

- **Type**: BUG
- **Area**: CANVAS
- **Status**: assessed
- **Priority**: P1
- **Difficulty**: S
- **Source file**: `index.ts`
- **Source line**: 55
- **First seen**: 2025-09-11 (e7ec6425)
- **Raw text**: "BUG: loop() never finishes after playing to the end of spem"
- **Description**: The MusicCanvas animation loop (play() -> requestAnimationFrame(loop)) continues firing after audio playback reaches the end of the piece. This suggests the audio ended event either does not set playing=false promptly, or there is a race condition where draw() or another callback re-triggers the loop.
- **PD required**: test-gap
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Check MusicControls audio ended listener and ensure it propagates playing=false to MusicCanvas before the next animation frame fires.

### TODO-UI-008

- **Type**: TODO
- **Area**: UI
- **Status**: done
- **Priority**: unassigned
- **Difficulty**: unassigned
- **Source file**: `index.ts`
- **Source line**: 56
- **First seen**: 2026-04-29 (37e3ba12)
- **Raw text**: "TODO: Add the space bar as a play/pause toggle (but only if not focused on an input field, and not if composing text for chinese characters)"
- **Description**: Space bar handler added to keyboardTapped() with guards for input/select/textarea focus and e.isComposing.
- **PD required**: none
- **Recommended fix**: Already implemented in index.ts; tests added in src/test/keyboard.test.ts.
- **Test plan**: 4 tests covering body focus toggle and blocked input focus.
- **Dependencies**: None.
- **Notes**: Full suite passed (37 tests). See session_notes.md for details.

### BUG-UI-001

- **Type**: BUG
- **Area**: UI
- **Status**: assessed
- **Priority**: P3
- **Difficulty**: XS
- **Source file**: `src/scss/style.scss`
- **Source line**: 279
- **Raw text**: "BUG: looks ugly when Bar wraps to next line"
- **Description**: The footer uses flex-wrap: wrap. On narrow viewports the Bar label and input in music-controls wrap to a second line, breaking the intended single-row footer layout.
- **PD required**: repro
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Cosmetic only. Affects mobile or very narrow desktop windows.

### HACK-LILY-001

- **Type**: HACK
- **Area**: LILY
- **Status**: assessed
- **Priority**: P2
- **Difficulty**: XS
- **Source file**: `src/ts/lily.ts`
- **Source line**: 123
- **First seen**: 2024-04-23 (48d1ecfa)
- **Raw text**: "HACK: we're ignoring the denominator altogether.  Let's hope it's not there"
- **Description**: The fraction parser in the Ohm grammar only extracts the numerator, ignoring any denominator. This works for current LilyPond input but will silently produce wrong durations if a true fraction like "3/4" appears.
- **PD required**: none
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Requires updating both the Ohm grammar (ly-grammar.ohm) and the fraction semantic action in lily.ts.

### TODO-CONFIG-001

- **Type**: TODO
- **Area**: CONFIG
- **Status**: assessed
- **Priority**: P2
- **Difficulty**: S
- **Source file**: `src/ts/common.ts`
- **Source line**: 63
- **First seen**: 2024-05-08 (1dc3fc50)
- **Raw text**: "TODO: Need to use config to load the hues for each choir"
- **Description**: Choir colour hues are currently loaded from CSS custom properties (`--color-c1` to `--color-c8`). The comment suggests moving hue definitions into `config.ts` so they are centralised and theming is data-driven.
- **PD required**: none
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Would decouple colour logic from CSS and make dynamic theme changes easier.

### HACK-CONFIG-001

- **Type**: HACK
- **Area**: CONFIG
- **Status**: assessed
- **Priority**: P2
- **Difficulty**: S
- **Source file**: `src/ts/common.ts`
- **Source line**: 78
- **First seen**: 2024-05-08 (d3d89a81)
- **Raw text**: "HACK: needs to be time of a 64th note"
- **Description**: `HDSQTIME = 0.05` is a magic constant representing the duration of a 64th note (hemidemisemiquaver) in seconds. It is used for rounding in `toNum()`. It should be derived from the tempo configuration rather than hard-coded, so it remains correct if tempo changes.
- **PD required**: none
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Used in bar/time quantisation. Incorrect value could cause subtle sync drift.

### HACK-CONFIG-002

- **Type**: HACK
- **Area**: CONFIG
- **Status**: assessed
- **Priority**: P2
- **Difficulty**: XS
- **Source file**: `src/ts/common.ts`
- **Source line**: 56
- **First seen**: 2024-05-09 (74c07308)
- **Raw text**: `console.log("ARGH")`
- **Description**: When CSS custom properties are not available (e.g., in jsdom tests or before stylesheet loads), `colors()` logs "ARGH" and returns default colours. This debug statement pollutes test output and browser consoles. It should be removed or replaced with a proper warning.
- **PD required**: none
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Visible in every test run that instantiates MusicScore or MusicCanvas (dozens of "ARGH" lines).

### BUG-CONFIG-001

- **Type**: BUG
- **Area**: CONFIG
- **Status**: assessed
- **Priority**: P1
- **Difficulty**: S
- **Source file**: `src/ts/common.ts`
- **Source line**: 86
- **First seen**: 2025-09-16 (edb3624c)
- **Raw text**: (documented in AGENTS.md) "The `getBarFromTime` / `getTimeFromBar` tempo calculation may fail at boundaries if `bartime`/`barno` arrays are out of sync."
- **Description**: Both getBarFromTime and getTimeFromBar use interval-based linear interpolation. At exact boundary values (where t equals a bartime entry or b equals a barno entry), the strict inequality checks can miss the correct segment and return the fallback value 0. Additionally, there is no bounds checking for array length mismatch or accessing index+1 beyond the array.
- **PD required**: test-gap
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: No inline comment in source; issue surfaced in AGENTS.md. Validate boundary behaviour for t=0, t=end, b=0, b=139.

### HACK-CANVAS-001

- **Type**: HACK
- **Area**: CANVAS
- **Status**: assessed
- **Priority**: P2
- **Difficulty**: M
- **Source file**: `src/ts/MusicCanvas.ts`
- **Source line**: 17
- **First seen**: 2024-05-06 (5eabce67)
- **Raw text**: "HACK: bad name and data type"
- **Description**: `dict: Dictionary[][]` has a vague name and an opaque nested-array type. It stores note data indexed by quantised bar position, but the type signature does not make this clear.
- **PD required**: none
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: HACK-CANVAS-003
- **Notes**: Refactoring this is easier if processLilypond() returns a structured object rather than mutating a global.

### HACK-CANVAS-002

- **Type**: HACK
- **Area**: CANVAS
- **Status**: assessed
- **Priority**: P2
- **Difficulty**: M
- **Source file**: `src/ts/MusicCanvas.ts`
- **Source line**: 18
- **First seen**: 2024-05-06 (5eabce67)
- **Raw text**: "HACK: bad data type"
- **Description**: `ranges: Range[][][]` is a deeply nested array type representing singing ranges per choir per part. The triple-nested array is hard to reason about and lacks semantic naming.
- **PD required**: none
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: HACK-CANVAS-003
- **Notes**: Same structural issue as HACK-CANVAS-001. Both should be refactored together.

### HACK-CANVAS-003

- **Type**: HACK
- **Area**: CANVAS
- **Status**: assessed
- **Priority**: P2
- **Difficulty**: M
- **Source file**: `src/ts/MusicCanvas.ts`
- **Source line**: 68
- **First seen**: 2024-05-10 (39877893)
- **Raw text**: "HACK: can't these just be returned from processLilypond()?"
- **Description**: `processLilypond()` mutates global variables `dict` and `ranges` instead of returning them as a structured result. This makes the function impure, harder to test, and creates hidden coupling between lily.ts and MusicCanvas.
- **PD required**: none
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Refactoring this unlocks fixes for HACK-CANVAS-001 and HACK-CANVAS-002.

### HACK-CANVAS-004

- **Type**: HACK
- **Area**: CANVAS
- **Status**: assessed
- **Priority**: P3
- **Difficulty**: XS
- **Source file**: `src/ts/MusicCanvas.ts`
- **Source line**: 163
- **First seen**: 2024-05-10 (9abaa133)
- **Raw text**: "HACK: throttle"
- **Description**: The draw() loop uses a crude throttle (`secondsPassed < 0.01 return`) to limit frame rate. requestAnimationFrame already fires at display refresh rate; the throttle adds unnecessary complexity and can cause frame drops.
- **PD required**: none
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Either remove the throttle entirely and let requestAnimationFrame handle timing, or replace with proper delta-time based animation.

### BUG-CANVAS-002

- **Type**: BUG
- **Area**: CANVAS
- **Status**: assessed
- **Priority**: P2
- **Difficulty**: XS
- **Source file**: `src/ts/MusicCanvas.ts`
- **Source line**: 285
- **First seen**: 2024-05-06 (5eabce67)
- **Raw text**: "BUG: what happens if you click in the canvas padding?"
- **Description**: Clicks within the 5px canvas padding area produce incorrect position calculations in getMousePos(). If offsetY < canvasPadding, y becomes negative, which can yield invalid part values. The bar calculation also does not account for horizontal padding.
- **PD required**: test-gap
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Edge case. Normal user clicks are likely inside the drawable area, but touch events or mis-clicks could hit the padding.

### TODO-CANVAS-001

- **Type**: TODO
- **Area**: CANVAS
- **Status**: assessed
- **Priority**: P3
- **Difficulty**: XS
- **Source file**: `src/ts/MusicCanvas.ts`
- **Source line**: 304
- **First seen**: 2024-05-06 (5eabce67)
- **Raw text**: "TODO: combine canvasClicked and Hovered?"
- **Description**: `canvasClicked` and `canvasHovered` share logic (`getMousePos`, `moveToPosition`). They could be refactored into a single handler or a shared helper to reduce duplication.
- **PD required**: none
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Straightforward refactoring. Ensure event-specific behaviour (fireEvent vs setAttribute) is preserved.

### HACK-UI-001

- **Type**: HACK
- **Area**: UI
- **Status**: assessed
- **Priority**: P2
- **Difficulty**: XS
- **Source file**: `src/ts/MusicControls.ts`
- **Source line**: 95
- **First seen**: 2024-05-10 (cd62154c)
- **Raw text**: "HACK : 138"
- **Description**: The bar input field has its max attribute hard-coded to 138. Config defines 140 bars (0-139), so the maximum should be 139 and derived from config to avoid drift.
- **PD required**: none
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Simple fix: use config to calculate max bar number dynamically.

### HACK-SCORE-001

- **Type**: HACK
- **Area**: SCORE
- **Status**: assessed
- **Priority**: P2
- **Difficulty**: XS
- **Source file**: `src/ts/MusicScore.ts`
- **Source line**: 30
- **First seen**: 2024-05-10 (634d4dfd)
- **Raw text**: "HACK: hard-coded!"
- **Description**: The highlight position indicator width is hard-coded to 7px. It should be calculated from the SVG viewBox or bar spacing so it scales correctly with different SVG sizes.
- **PD required**: none
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: (none)

### HACK-SCORE-002

- **Type**: HACK
- **Area**: SCORE
- **Status**: assessed
- **Priority**: P2
- **Difficulty**: XS
- **Source file**: `src/ts/MusicScore.ts`
- **Source line**: 31
- **First seen**: 2024-05-10 (634d4dfd)
- **Raw text**: "HACK: need to calc actual height of SVG"
- **Description**: The highlight position rectangle height is hard-coded to 200px. It should derive its height from the loaded SVG viewBox height.
- **PD required**: none
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: (none)

### HACK-SCORE-003

- **Type**: HACK
- **Area**: SCORE
- **Status**: assessed
- **Priority**: P2
- **Difficulty**: XS
- **Source file**: `src/ts/MusicScore.ts`
- **Source line**: 39
- **First seen**: 2024-05-10 (634d4dfd)
- **Raw text**: "HACK: need to calc actual height of SVG"
- **Description**: The highlight bar rectangle height is hard-coded to 200px. Same root cause as HACK-SCORE-002: should derive from SVG viewBox height.
- **PD required**: none
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: HACK-SCORE-002
- **Notes**: Fix both together.

### HACK-TEST-001

- **Type**: HACK
- **Area**: TEST
- **Status**: assessed
- **Priority**: P3
- **Difficulty**: XS
- **Source file**: `src/test/score.test.ts`
- **Source line**: 6
- **First seen**: 2024-05-24 (b209c71e)
- **Raw text**: "HACK: duplicated with controls.test.ts"
- **Description**: The `waitForEvent` helper function is duplicated between `score.test.ts` and `controls.test.ts`. It should be extracted to a shared test utility module.
- **PD required**: none
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: Also reduces test boilerplate for future tests that need event assertion.

### TODO-BUILD-003

- **Type**: TODO
- **Area**: BUILD
- **Status**: assessed
- **Priority**: P3
- **Difficulty**: XS
- **Source file**: `index.html`
- **Source line**: 124
- **First seen**: 2024-03-14 (a6c8e292)
- **Raw text**: "TODO: Needs auto-increasing version somehow"
- **Description**: The version string in index.html is hard-coded. It should be injected automatically from package.json during build to prevent version drift (already noted as BUILD-001).
- **PD required**: none
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: BUILD-001
- **Notes**: BUILD.md already suggests using a Vite `define` block with `process.env.npm_package_version`.

### BUILD-001

- **Type**: BUILD
- **Area**: BUILD
- **Status**: assessed
- **Priority**: P3
- **Difficulty**: XS
- **Source file**: `package.json` / `index.html`
- **Source line**: n/a
- **First seen**: 2024-03-14 (a6c8e292 for index.html version tag; package.json version added earlier)
- **Raw text**: (documented in AGENTS.md and BUILD.md) "package.json declares version 2.0.0; index.html displays 2.1.0"
- **Description**: Version number is manually maintained in two places (package.json and index.html) and has drifted (2.0.0 vs 2.1.0). Should be auto-injected during build.
- **PD required**: none
- **Recommended fix**: (pending Specification)
- **Test plan**: (pending Specification)
- **Dependencies**: (pending Specification)
- **Notes**: BUILD.md already suggests a Vite define block approach. Resolving this also closes TODO-BUILD-003.
