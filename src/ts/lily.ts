import config from "./config";
import lyGrammar from '../ohmjs/ly-grammar.ohm-bundle';
import * as ohm from 'ohm-js';
import { Duration, BarLine, Note, Rest, Component } from "./music-classes";
import spem from '../lilypond/Hugh Keyte/spem.ly?raw'

// Make an dictionary of music positions (hemidemisemiquavers/128) to array of notes {choir, part, note}
export type Dictionary = {
  "c": number;
  "p": number;
  "n": Note;
};
export const dict: Dictionary[][] = [];

// a dictionary to hold the muic in the lilypond input file
export var scores: { [id: string]: Component[] } = {};

// -----------------------------------------------------
// Set up Lilypond parser
// -----------------------------------------------------

var semantics: ohm.Semantics = setupLilypondParser();

var lilypondVersion: string;

function romanise(num: number) {
  var lookup: { [index: string]: number } = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }, roman = '', i;
  for (i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}


function setupLilypondParser(): ohm.Semantics {

  var s = lyGrammar.createSemantics();

  // If lilypond input has no duration, use lastDuration; use lastNote if note name is missing
  var lastNote: Note, lastDuration: Duration;

  function getDuration(duration: ohm.Node) {
    var d = duration.parse()[0];
    if (d == undefined) {
      d = lastDuration;
    }
    else {
      lastDuration = d;
    }
    return d;
  }


  s.addOperation('parse', {
    Version(_, _2, v, _3) {
      lilypondVersion = v.sourceString;
      console.log("Lilypond: Version " + lilypondVersion);
    },
    Include(_, _2, filename, _3) {
      const f = filename.sourceString;
      console.log("Lilypond: Include " + f);
    },
    RelativeClause(variable, _, _2, _3, _4, music, _6) {
      const v = variable.parse();
      // const n = note.parse();
      if (v[0] != undefined) {
        scores[v[0]] = music.parse();
      }
      return scores[v];
    },
    Component(comp) {
      const c = comp.parse();
      return c;
    },
    command(_, _2) {
      // const command = _2.sourceString;
    },
    BarCheck(_, _2, _3) {
      // console.log("Bar check: " + _3.sourceString);
    },
    barline(_) {
      return new BarLine();
    },
    repeatedNote(duration, slur) {
      const d = duration.parse();
      const s = slur.sourceString.length == 0 ? null : slur.sourceString

      const note = new Note(lastNote.notename, lastNote.accidental, '', d, s);
      return note;
    },
    note(notename, accidental, octave, _, duration, _2, slur) {
      const n = notename.sourceString;
      const a = accidental.sourceString.length == 0 ? null : accidental.sourceString;
      const o = octave.sourceString.length == 0 ? null : octave.sourceString;
      var d = getDuration(duration);
      const s = slur.sourceString.length == 0 ? null : slur.sourceString

      lastNote = new Note(n, a, o, d, s);
      return lastNote;
    },
    rest(restname, duration) {
      const r = restname.sourceString;
      var d = getDuration(duration);
      const rest = new Rest(r, d);
      return rest;
    },
    duration(duration, dotted) {
      const d = duration.sourceString;
      const dot = dotted.sourceString;
      const ret = new Duration(d, dot, 1);
      return ret;
    },
    durationScaled(duration, _, multiplier) {
      const x = duration.parse();
      const m = multiplier.parse()[0];

      return new Duration(x.duration, x.dotted, m);
    },
    fraction(a, _, _2) {
      // HACK: we're ignoring the denominator altogether.  Let's hope it's not there
      return parseInt(a.sourceString);
    },
    variable(v) {
      return v.sourceString;
    },
    _iter(...children) {
      return children.map(c => c.parse());
    }
  });
  return s;
}

// Array of choir, part and 
export type Range = {
  from: number;
  to: number;
}
export var ranges: Range[][][] = [];
export var barCount: number = 0;

async function getFile(filename: string): Promise<string> {
  const promise = await fetch(filename);
  const text = await promise.text();
  return text;
}

// -----------------------------------------------------
// Process the lilypond input file, creating two data structures:
// dict[position] = [ {choir, part, note}, ... ]
// ranges[choir (0 to 7)][part (0 to 4)] = [ {from, to}, ... ]
// -----------------------------------------------------
export function processLilypond() {

  if (!semantics) {
    semantics = setupLilypondParser();
  }

  // Parse lilypond from the ohm grammar
  const result = lyGrammar.match(spem);
  if (!result.succeeded()) {
    console.error('Bad Lilypond ' + result.message);
  }

  semantics(result).parse();

  barCount = 0;
  for (let c = 0; c < config.choirs[0].length; c++) {
    const choir = config.choirs[0][c];
    ranges[c] = [];
    for (let p = 0; p < config.parts.length; p++) {
      const part = config.parts[p]; 
      ranges[c][p] = [];
      var key = "notes" + choir.replace(/ /g, '') + part;

      // get the lilypond for this choir and part
      var lilypond = scores[key];

      // console.log(lilypond.map(x => (typeof x == "undefined") ? "?" : x.toString()).join(" "));

      var from = undefined;

      var pos = 1; // in hemidemisemiquavers (64ths)
      const barsize = 128; // hemidemisemiquavers in a bar
      for (var comp of lilypond) {
        if (comp instanceof Note) {
          if (from == undefined) {
            from = pos;
          }

          if (dict[pos] == undefined) {
            dict[pos] = [];
          }
          dict[pos].push({ "c": c, "p": p, "n": comp });

          if (comp.duration != null) pos += comp.duration.sfths / barsize;
        }
        else if (comp instanceof Rest) {
          if (from != undefined) {
            ranges[c][p].push({ "from": from, "to": pos });
            from = undefined;
          }

          if (comp.duration != null) pos += comp.duration.sfths / barsize;
        }
      }

      if (from != undefined) {
        ranges[c][p].push({ "from": from, "to": pos });
        from = undefined;
      }

      if (pos > barCount) {
        barCount = pos;
      }
    }
  }
  barCount = Math.floor(barCount) - 1;
}

export const exportedForTesting = {
  semantics, romanise, setupLilypondParser, getFile
}

