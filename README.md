# Spem Player

<img src="SpemPlayer.png" alt="Spem Player screenshot" align="right" width="400" />

Are you about to perform Thomas Tallis's 40-part motet, _Spem in alium_? Worried about your entry on the "staircase of doom"? This player helps singers practice their parts with accentuated recordings of each of the 40 voices.

**Live site:** [www.spemplayer.net](https://www.spemplayer.net)

## Recordings

Two accentuated recordings are available:

- **Andrew Leslie Cooper** — solo vocal synthesis of all 40 parts
- **Choir of the Earth** — sung by a global virtual choir ([choirofthearth.com](https://www.choirofthearth.com))

Toggle between recordings using the button in the top-right corner.

## Features

### Score View

- Displays SVG sheet music generated from LilyPond sources
- Auto-scrolls during playback
- Highlights the current bar
- Switch between **modern** and **early** notation clefs

### Canvas Overview

- Visual map of all 8 choirs by 5 parts across all 140 bars
- Colour-coded by choir (HSL palette)
- Pulse animation shows active notes during playback
- Click or tap any bar to jump directly to that position

### Audio Controls

- Play / pause with progress tracking
- Select any choir (I–VIII) and part (Soprano, Alto, Tenor, Baritone, Bass)
- Jump to any bar (0–139)
- Bar 0 is an intro bar with a shortened beat count

### Keyboard Shortcuts

- `1`–`8`: select choir
- `S`: soprano
- `A`: alto
- `T`: tenor
- `R`: baritone
- `B`: bass
- `X`: all voice parts
- `←` / `→`: select bar
- `V`: toggle between recordings
- `M`: toggle modern / early notation
- `D`: toggle dark / light mode
- `Enter` or `Space`: start or stop playback
- `?`: show help panel

Shortcuts are ignored when focus is on an input field or `<select>` element.

### Display

- **Dark / light mode** toggle (top-right moon / sun icon)
- Responsive layout for desktop and mobile
- Splitter between score and canvas allows resizing

## For Developers

- `BUILD.md` — development setup, build commands, and deployment
- `TESTING.md` — running and writing tests
- `CONTRIBUTING.md` — contribution process, code style, and board workflow
- `WORKFLOW.md` — ticket lifecycle and best practices
- `AGENTS.md` — architecture overview and conventions

## Licence

MIT. See `LICENSE`.
