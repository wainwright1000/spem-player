# Issue #89: False Relations — Progress Notes

> **Status:** Shimmer implementation in progress on branch `issue-89`. Neutral colour approach being evaluated. Not ready for PR.  
> **Last worked on:** 2026-05-06

---

## What is a false relation

Two notes with the **same letter name** but **different accidentals** sounding simultaneously (or in close proximity) across different voices — e.g. F♮ in one part against F♯ in another.

Same-part clashes (e.g. both in Alto 1) are ignored because those are voice-leading matters, not inter-voice false relations.

---

## What was built

### 1. Data structures (`src/ts/lily.ts`)

- `activeNotes` - `Map<number, ActiveNote[]>` - All notes sounding at each 1/16-bar position
- `falseRelations` - `FalseRelation[]` - Detected false-relation intervals
- `noteToPitchClass()` - `(Note) => number` - 0-11 chromatic pitch class
- `detectFalseRelations()` - `() => void` - Populates `falseRelations` from `activeNotes`

#### `FalseRelation` shape

```typescript
{
  from: number;   // start bar position
  to: number;     // end bar position
  pair: [
    { c, p, notename, accidental },  // first voice
    { c, p, notename, accidental }   // second voice
  ];
}
```

#### `detectFalseRelations()` algorithm

1. Iterates every 1/16-bar position in `activeNotes` (sorted).
2. For each position, compares all pairs of active notes.
3. If `notename` matches, `accidental` differs, and they are from **different parts** (`!(c===c && p===p)`), it's a false relation.
4. Uses a `pairKey()` helper to deduplicate by voice pair.
5. **Merges consecutive positions** for the same pair into a single interval (`from`…`to`).
6. When a pair stops clashing, the accumulated interval is pushed to `falseRelations`.

#### `activeNotes` construction
- Built inside `processLilypond()` as notes are parsed.
- Each note is pushed into every 1/16-bar position in `[noteStart, noteEnd)`.
- Step size: `0.0625` (1/16 bar).

---

### 2. Canvas rendering (`src/ts/MusicCanvas.ts`)

- Added `falseRelationPulses: number[]` array, initialised to zeros.
- In `draw()`:
  1. Computes a pulse value for each `falseRelations[i]` using `easeOutCubic`.
  2. Draws a **fading radial-gradient circle** on **both voices** in the pair.
  3. Circle is centred horizontally on the midpoint of the false-relation interval (`(fr.from + fr.to) / 2`).
  4. Circle is centred vertically on each voice part's line.

**Pulse timing:**
- `pulseDuration = (fr.to - fr.from) * 1.2` — no more 1-bar minimum. The pulse lasts only slightly longer than the false relation itself, so brief clashes give brief flashes.
- **Fade-out curve:** `easeOutCubic(t, 1.0, -1.0, pulseDuration)` — starts at full intensity (1.0) the moment the FR begins and decays to zero. This mirrors the jarring musical effect: immediate visual punch, then a quick tail-off.

**Visual styling (theme-aware):**

| Property | Dark mode | Light mode |
|----------|-----------|------------|
| Saturation | 100% | 100% |
| Centre lightness | `90 * pulse` | `50 * pulse` |
| Centre alpha | `pulse * 0.85` (max 0.9) | `pulse * 0.85` (max 0.9) |
| Mid-stop alpha (25% radius) | `centre * 0.4` | `centre * 0.4` |
| Edge alpha | 0 | 0 |
| Radius | `partHeight * 4 * pulse` | `partHeight * 4 * pulse` |

The gradient uses **three stops** for a steeper falloff — a hot opaque core that drops off quickly to a soft transparent edge.

---

### 3. Tests (`src/test/lily.test.ts`)

6 tests added:

- `noteToPitchClass maps natural notes correctly` - C=0, D=2, E=4, F=5, G=7, A=9, B=11
- `noteToPitchClass maps accidentals correctly` - `is` +1, `es` −1, `isis` +2, `eses` −2, wrap-around
- `detectFalseRelations finds false relations` - F♮ vs F♯ across two choirs → 1 hit
- `detectFalseRelations ignores same-part clashes` - Two F's in same part → 0 hits
- `detectFalseRelations ignores different letters` - E vs F (semitone, different letter) → 0 hits
- `detectFalseRelations merges consecutive positions` - Two adjacent 1/16 positions for same pair → single interval `1.0` to `1.125`

---

## Complete false-relation inventory (60 total)

Detected from the Hugh Keyte edition of *Spem in alium*.

### Bars 1–30

| Bars | Voice 1 | Voice 2 | Type |
|------|---------|---------|------|
| 8.75–9.00 | Choir 1 Part 3 (C♯) | Choir 2 Part 2 (C) | Inter-choir |
| 12.25–12.375 | Choir 1 Part 2 (F♯) | Choir 2 Part 4 (F) | Inter-choir |
| 16.75–17.00 | Choir 1 Part 4 (C) | Choir 3 Part 3 (C♯) | Inter-choir |
| 16.875–17.00 | Choir 1 Part 1 (C) | Choir 3 Part 3 (C♯) | Inter-choir |
| 20.25–20.375 | Choir 2 Part 1 (F) | Choir 4 Part 2 (F♯) | Inter-choir |
| 20.25–20.4375 | Choir 3 Part 4 (F) | Choir 4 Part 2 (F♯) | Inter-choir |
| 22.75–22.8125 | Choir 1 Part 3 (F) | Choir 4 Part 1 (F♯) | Inter-choir |
| 22.75–22.9375 | Choir 3 Part 4 (F) | Choir 4 Part 1 (F♯) | Inter-choir |
| 22.875–23.00 | Choir 1 Part 2 (F) | Choir 4 Part 1 (F♯) | Inter-choir |
| 26.75–26.875 | Choir 5 Part 1 (B) | Choir 5 Part 3 (B♭) | Intra-choir |
| 37.75–37.875 | Choir 3 Part 2 (F♯) | Choir 3 Part 4 (F) | Intra-choir |

### Bars 60–90 (densest cluster: bar 86)

| Bars | Voice 1 | Voice 2 | Type |
|------|---------|---------|------|
| 64.625–64.6875 | Choir 3 Part 4 (F) | Choir 4 Part 2 (F♯) | Inter-choir |
| 64.625–64.6875 | Choir 4 Part 1 (F) | Choir 4 Part 2 (F♯) | Intra-choir |
| 64.75–64.8125 | Choir 4 Part 1 (F) | Choir 4 Part 2 (F♯) | Intra-choir |
| 64.75–64.9375 | Choir 3 Part 4 (F) | Choir 4 Part 2 (F♯) | Inter-choir |
| 83.625–83.6875 | Choir 1 Part 1 (C♯) | Choir 2 Part 2 (C) | Inter-choir |
| 83.875–84.00 | Choir 2 Part 1 (C♯) | Choir 2 Part 4 (C) | Intra-choir |
| 85.75–85.875 | Choir 2 Part 2 (F♯) | Choir 2 Part 5 (F) | Intra-choir |
| **86.375–86.4375** | Choir 2 Part 1 (B) | Choir 3 Part 3 (B♭) | Inter-choir |
| **86.375–86.50** | Choir 3 Part 3 (B♭) | Choir 5 Part 2 (B) | Inter-choir |
| **86.375–86.50** | Choir 3 Part 3 (B♭) | Choir 7 Part 5 (B) | Inter-choir |
| **86.375–86.50** | Choir 3 Part 3 (B♭) | Choir 8 Part 3 (B) | Inter-choir |
| **86.625–86.6875** | Choir 1 Part 1 (F) | Choir 2 Part 3 (F♯) | Inter-choir |
| **86.625–86.6875** | Choir 1 Part 1 (F) | Choir 2 Part 5 (F♯) | Inter-choir |
| **86.625–86.75** | Choir 1 Part 5 (F) | Choir 2 Part 3 (F♯) | Inter-choir |
| **86.625–86.75** | Choir 2 Part 3 (F♯) | Choir 5 Part 3 (F) | Inter-choir |
| **86.625–86.8125** | Choir 1 Part 5 (F) | Choir 2 Part 5 (F♯) | Inter-choir |
| **86.625–86.8125** | Choir 2 Part 5 (F♯) | Choir 5 Part 3 (F) | Inter-choir |
| **86.75–86.8125** | Choir 1 Part 2 (F♯) | Choir 5 Part 3 (F) | Inter-choir |
| **86.75–86.8125** | Choir 2 Part 5 (F♯) | Choir 4 Part 3 (F) | Inter-choir |
| **86.75–86.875** | Choir 1 Part 2 (F♯) | Choir 4 Part 3 (F) | Inter-choir |
| **86.75–86.9375** | Choir 1 Part 2 (F♯) | Choir 1 Part 5 (F) | Intra-choir |
| **86.875–86.9375** | Choir 1 Part 2 (F♯) | Choir 3 Part 4 (F) | Inter-choir |
| **86.875–86.9375** | Choir 1 Part 5 (F) | Choir 5 Part 2 (F♯) | Inter-choir |
| **86.875–86.9375** | Choir 3 Part 4 (F) | Choir 5 Part 2 (F♯) | Inter-choir |

### Bars 95–135

| Bars | Voice 1 | Voice 2 | Type |
|------|---------|---------|------|
| 98.875–99.00 | Choir 3 Part 2 (C) | Choir 4 Part 1 (C♯) | Inter-choir |
| 98.875–99.00 | Choir 3 Part 3 (C) | Choir 4 Part 1 (C♯) | Inter-choir |
| 104.875–104.9375 | Choir 1 Part 1 (C♯) | Choir 2 Part 3 (C) | Inter-choir |
| 109.875–110.00 | Choir 1 Part 3 (C♯) | Choir 5 Part 3 (C) | Inter-choir |
| 109.875–110.00 | Choir 2 Part 1 (C♯) | Choir 5 Part 3 (C) | Inter-choir |
| 109.875–110.00 | Choir 2 Part 4 (C♯) | Choir 5 Part 3 (C) | Inter-choir |
| 109.875–110.00 | Choir 3 Part 3 (C♯) | Choir 5 Part 3 (C) | Inter-choir |
| 109.875–110.00 | Choir 4 Part 5 (C♯) | Choir 5 Part 3 (C) | Inter-choir |
| 109.875–110.00 | Choir 5 Part 3 (C) | Choir 6 Part 1 (C♯) | Inter-choir |
| 117.75–117.875 | Choir 2 Part 3 (F) | Choir 3 Part 2 (F♯) | Inter-choir |
| 119.25–119.50 | Choir 2 Part 2 (B♭) | Choir 2 Part 5 (B) | Intra-choir |
| 130.625–130.6875 | Choir 2 Part 5 (F) | Choir 4 Part 1 (F♯) | Inter-choir |
| 130.625–130.6875 | Choir 2 Part 5 (F) | Choir 5 Part 1 (F♯) | Inter-choir |
| 130.625–130.75 | Choir 3 Part 4 (F) | Choir 4 Part 1 (F♯) | Inter-choir |
| 130.625–130.75 | Choir 3 Part 4 (F) | Choir 5 Part 1 (F♯) | Inter-choir |
| 130.625–130.75 | Choir 4 Part 1 (F♯) | Choir 8 Part 4 (F) | Inter-choir |
| 130.625–130.75 | Choir 5 Part 1 (F♯) | Choir 8 Part 4 (F) | Inter-choir |
| 130.625–130.8125 | Choir 2 Part 1 (F) | Choir 4 Part 1 (F♯) | Inter-choir |
| 130.625–130.8125 | Choir 2 Part 1 (F) | Choir 5 Part 1 (F♯) | Inter-choir |
| 130.625–130.8125 | Choir 4 Part 1 (F♯) | Choir 7 Part 5 (F) | Inter-choir |
| 130.75–130.8125 | Choir 2 Part 1 (F) | Choir 2 Part 2 (F♯) | Intra-choir |
| 130.625–130.9375 | Choir 5 Part 1 (F♯) | Choir 7 Part 5 (F) | Inter-choir |
| 130.75–130.9375 | Choir 2 Part 2 (F♯) | Choir 7 Part 5 (F) | Inter-choir |
| 130.875–130.9375 | Choir 4 Part 4 (F♯) | Choir 7 Part 5 (F) | Inter-choir |
| 130.875–130.9375 | Choir 7 Part 4 (F♯) | Choir 7 Part 5 (F) | Intra-choir |

---

## Observations

- **Bar 86** is the densest cluster — 15 separate false relations in a single bar, mostly F/F♯ and B/B♭ clashes across choirs 1–5. Because each FR is very brief (mostly 1/16 to 1/8 bar), the canvas will show rapid-fire flashes rather than sustained circles.
- **Bar 130.6+** is the second densest — 12 false relations, again mostly F/F♯.
- By pitch type:
  - **F vs F♯**: 34 occurrences
  - **C vs C♯**: 13 occurrences
  - **B vs B♭**: 6 occurrences
- **Intra-choir** false relations (same choir, different parts): 9 total. The rest are **inter-choir**.

---

## Changelog

### 2026-05-03

- Removed stale TODO from `index.ts`.
- Added static white hotspot circles to `MusicCanvas.draw()`.
  - Radius: `partHeight / 2` (diameter equals part line height).
  - Colour: `rgba(255, 255, 255, 0.4)`.
  - Drawn after voice lines and before FR pulse circles so hotspots are always visible and pulses overlay on top.
- Added canvas test: `draw() renders false-relation hotspot circles when falseRelations are populated`.

### 2026-05-06

- Merged `dev` into `issue-89` (15 commits).
- Implemented **phase-offset opacity breathing shimmer** (Option 3) for FR hotspots.
  - Added `shimmerPhases` array with randomised per-FR phase offsets.
  - Added continuous `requestAnimationFrame` shimmer loop that runs when playback is paused.
  - Hotspots oscillate between alpha values via `Math.sin(shimmerTime * speed + phase)`.
- Replaced static white hotspots with **neutral greyscale radial-gradient circles**.
  - Saturation: 0% (hue-independent).
  - Lightness: 90% in dark mode, 30% in light mode.
  - Gradient: three-stop radial (centre alpha → mid alpha × 0.4 → transparent edge).
- Extracted all FR visual tuning constants to `static readonly` fields on `MusicCanvas`:
  - `FR_PULSE_*` constants for playback pulse timing, radius, colour, and gradient.
  - `FR_HOTSPOT_*` constants for shimmer speed, alpha range, radius, lightness, and gradient.
- Made playback pulse circles use the **same neutral colour as hotspots** (previously used the first voice's choir hue).
- Fixed `defaultColors.choir` in `common.ts` to include all 8 hues, resolving `undefined` values in test environments.

## Future work

- **Visibility on highlighted parts.** Neutral greyscale hotspots are clearly visible against dull voice lines but can be camouflaged against bright, saturated highlighted parts. Options: increase hotspot alpha range, use a contrasting outline, or darken/lighten the hotspot further when the underlying part is selected.
- **Shimmer speed tuning.** Current speed is 6 rad/s. Slower speeds may feel calmer; faster speeds may feel more urgent.
- **Alternative effects.** The other three options (wandering radial highlight, rotating sheen, animated dash stroke) remain available if the breathing approach proves unsatisfactory.

## Branch status

- Branch: `issue-89`
- Merged `dev` into `issue-89` on 2026-05-06.
- All tests pass (102/102).
- Core FR detection and pulse effects are functional.
- Shimmer hotspots implemented but still under visual evaluation.

---

## Related code locations

| File | Lines | Content |
|------|-------|---------|
| `src/ts/lily.ts` | ~12-22 | `activeNotes`, `FalseRelation`, `falseRelations` exports |
| `src/ts/lily.ts` | ~47-120 | `noteToPitchClass`, `pairKey`, `detectFalseRelations` |
| `src/ts/lily.ts` | ~269-355 | `activeNotes` construction inside `processLilypond()` |
| `src/ts/lily.ts` | ~12-22 | `activeNotes`, `FalseRelation`, `falseRelations` exports |
| `src/ts/lily.ts` | ~47-120 | `noteToPitchClass`, `pairKey`, `detectFalseRelations` |
| `src/ts/lily.ts` | ~269-355 | `activeNotes` construction inside `processLilypond()` |
| `src/ts/MusicCanvas.ts` | ~27-32 | `falseRelationPulses`, `shimmerPhases`, `shimmerLoopId` properties |
| `src/ts/MusicCanvas.ts` | ~37-72 | FR visual tuning constants (`FR_PULSE_*`, `FR_HOTSPOT_*`) |
| `src/ts/MusicCanvas.ts` | ~89-97 | `#startShimmerLoop()` method |
| `src/ts/MusicCanvas.ts` | ~174-175 | `falseRelationPulses` and `shimmerPhases` initialisation |
| `src/ts/MusicCanvas.ts` | ~296-309 | FR pulse computation |
| `src/ts/MusicCanvas.ts` | ~437-482 | FR hotspot circles (shimmer, neutral greyscale) |
| `src/ts/MusicCanvas.ts` | ~484-531 | FR pulse circles (neutral greyscale, radial gradient) |
| `src/test/lily.test.ts` | ~66-129 | 6 false-relation tests |
| `src/test/canvas.test.ts` | ~60-68 | FR shimmer phase and render tests |
