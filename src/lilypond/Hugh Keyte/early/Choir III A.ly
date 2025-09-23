\version "2.24.4" 

\include "layout.ly"
\include "../spem.ly"
\include "../spem words.ly"

\score {

  <<
      \override Score.BarNumber.break-visibility = ##(#f #t #t)
      \override Score.BarNumber.font-size = #1
      <<
        \new Voice {
          \clef "mensural-c1"  
          \notesIIIASoprano
        }
        \addlyrics { \wordsIIIASoprano }
      >>
      <<
        \new Voice {
          \clef "mensural-c2"  
          \notesIIIAAlto
        }
        \addlyrics \wordsIIIAAlto
      >>
      <<
        \new Voice {
          \clef "mensural-c3"  
          \notesIIIATenor
        }
        \addlyrics \wordsIIIATenor
      >>
      <<
        \new Voice {
          \clef "mensural-f"
          \notesIIIABaritone
        }
        \addlyrics \wordsIIIABaritone
      >>
      <<
        \new Voice {
          \clef "mensural-f"
          \notesIIIABass
        }
        \addlyrics \wordsIIIABass
      >>
    >>
  \layout {
    \override Staff.Accidental.alteration-glyph-name-alist = #standard-alteration-glyph-name-alist
  }
}