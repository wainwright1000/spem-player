# Issue #89: False Relations — Progress Notes

> **Status:** Implementation complete on branch `issue-89`. Paused pending visual tuning / PR.  
> **Last worked on:** 2026-04-29

---

## What is a false relation?

Two notes with the **same letter name** but **different accidentals** sounding simultaneously (or in close proximity) across different voices — e.g. F♮ in one part against F♯ in another.

Same-part clashes (e.g. both in Alto 1) are ignored because those are voice-leading matters, not inter-voice false relations.

---

## What was built

### 1. Data structures (`src/ts/lily.ts`)

| Export | Type | Purpose |
|--------|------|---------|
| `activeNotes` | `Map<number, ActiveNote[]>` | All notes sounding at each 1/16-bar position |
| `falseRelations` | `FalseRelation[]` | Detected false-relation intervals |
| `noteToPitchClass()` | `(Note) => number` | 0-11 chromatic pitch class |
| `detectFalseRelations()` | `() => void` | Populates `falseRelations` from `activeNotes` |

**`FalseRelation` shape:**
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

**`detectFalseRelations()` algorithm:**
1. Iterates every 1/16-bar position in `activeNotes` (sorted).
2. For each position, compares all pairs of active notes.
3. If `notename` matches, `accidental` differs, and they are from **different parts** (`!(c===c && p===p)`), it's a false relation.
4. Uses a `pairKey()` helper to deduplicate by voice pair.
5. **Merges consecutive positions** for the same pair into a single interval (`from`…`to`).
6. When a pair stops clashing, the accumulated interval is pushed to `falseRelations`.

**`activeNotes` construction:**
- Built inside `processLilypond()` as notes are parsed.
- Each note is pushed into every 1/16-bar position in `[noteStart, noteEnd)`.
- Step size: `0.0625` (1/16 bar).

### 2. Canvas rendering (`src/ts/MusicCanvas.ts`)

- Added `falseRelationPulses: number[]` array, initialised to zeros.
- In `draw()`:
  1. Computes a pulse value for each `falseRelations[i]` using `easeOutCubic` over the interval duration.
  2. Draws a **fading circle** at the midpoint of the false-relation interval.
  3. Circle is positioned at `(cx, cy)` where `cy` is centred on the first voice part of the pair.
  4. Style: `hsla(${choirHue}, 90%, 85%, ${pulse * 0.7})`.
  5. Radius: `this.partHeight * 4 * pulse`.

### 3. Tests (`src/test/lily.test.ts`)

6 new tests added:

| Test | What it checks |
|------|----------------|
| `noteToPitchClass maps natural notes correctly` | C=0, D=2, E=4, F=5, G=7, A=9, B=11 |
| `noteToPitchClass maps accidentals correctly` | `is` +1, `es` −1, `isis` +2, `eses` −2, wrap-around |
| `detectFalseRelations finds false relations` | F♮ vs F♯ across two choirs → 1 hit |
| `detectFalseRelations ignores same-part clashes` | Two F's in same part → 0 hits |
| `detectFalseRelations ignores different letters` | E vs F (semitone, different letter) → 0 hits |
| `detectFalseRelations merges consecutive positions` | Two adjacent 1/16 positions for same pair → single interval `1.0` to `1.125` |

---

## Branch status

- Branch: `issue-89`
- Ahead of `dev` by 1 commit: `408564b Initial version of false relation detection`
- No merge conflicts with `dev` at time of writing.

---

## Open questions / next steps

1. **Visual tuning:** The circles are quite large (`partHeight * 4`) and may overlap heavily in dense passages. Need to test on real score data.
2. **Colour / opacity:** Current `hsla(..., 90%, 85%, ...)` is very light. May need stronger contrast, especially in light mode.
3. **Performance:** `draw()` now iterates `falseRelations.length` every frame. With many intervals this could add up. If profiling shows a hit, consider:
   - Only checking intervals whose `from`/`to` bracket `this.bar`.
   - Using a time-indexed lookup instead of linear scan.
4. **Pair midpoint positioning:** The circle is placed at the midpoint of the interval and at the y-position of the first voice. Should it instead span both voices? Or show two smaller circles?
5. **PR readiness:** Once visual tuning is done, branch can be PR'd to `dev`.

---

## Related code locations

| File | Lines | Content |
|------|-------|---------|
| `src/ts/lily.ts` | ~12-22 | `activeNotes`, `FalseRelation`, `falseRelations` exports |
| `src/ts/lily.ts` | ~47-120 | `noteToPitchClass`, `pairKey`, `detectFalseRelations` |
| `src/ts/lily.ts` | ~269-318 | `activeNotes` construction inside `processLilypond()` |
| `src/ts/MusicCanvas.ts` | ~17 | `falseRelationPulses` property |
| `src/ts/MusicCanvas.ts` | ~96 | `falseRelationPulses` initialisation |
| `src/ts/MusicCanvas.ts` | ~196-213 | Pulse computation loop |
| `src/ts/MusicCanvas.ts` | ~317-334 | Circle drawing loop |
| `src/test/lily.test.ts` | ~66-129 | 6 false-relation tests |
