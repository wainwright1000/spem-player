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
          \notesIVASoprano
        }
        \addlyrics { \wordsIVASoprano }
      >>
      <<
        \new Voice {
          \clef "mensural-c2"  
          \notesIVAAlto
        }
        \addlyrics \wordsIVAAlto
      >>
      <<
        \new Voice {
          \clef "mensural-c3"  
          \notesIVATenor
        }
        \addlyrics \wordsIVATenor
      >>
      <<
        \new Voice {
          \clef "mensural-f"
          \notesIVABaritone
        }
        \addlyrics \wordsIVABaritone
      >>
      <<
        \new Voice {
          \clef "mensural-f"
          \notesIVABass
        }
        \addlyrics \wordsIVABass
      >>
    >>
  \layout {
    \override Staff.Accidental.alteration-glyph-name-alist = #standard-alteration-glyph-name-alist
  }
}