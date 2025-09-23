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
          \notesIIASoprano
        }
        \addlyrics { \wordsIIASoprano }
      >>
      <<
        \new Voice {
          \clef "mensural-c2"  
          \notesIIAAlto
        }
        \addlyrics \wordsIIAAlto
      >>
      <<
        \new Voice {
          \clef "mensural-c3"  
          \notesIIATenor
        }
        \addlyrics \wordsIIATenor
      >>
      <<
        \new Voice {
          \clef "mensural-f"
          \notesIIABaritone
        }
        \addlyrics \wordsIIABaritone
      >>
      <<
        \new Voice {
          \clef "mensural-f"
          \notesIIABass
        }
        \addlyrics \wordsIIABass
      >>
    >>
  \layout {
    \override Staff.Accidental.alteration-glyph-name-alist = #standard-alteration-glyph-name-alist
  }
}