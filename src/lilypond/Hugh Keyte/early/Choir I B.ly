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
          \notesIBSoprano
        }
        \addlyrics { \wordsIBSoprano }
      >>
      <<
        \new Voice {
          \clef "mensural-c2"  
          \notesIBAlto
        }
        \addlyrics \wordsIBAlto
      >>
      <<
        \new Voice {
          \clef "mensural-c3"  
          \notesIBTenor
        }
        \addlyrics \wordsIBTenor
      >>
      <<
        \new Voice {
          \clef "mensural-f"
          \notesIBBaritone
        }
        \addlyrics \wordsIBBaritone
      >>
      <<
        \new Voice {
          \clef "mensural-f"
          \notesIBBass
        }
        \addlyrics \wordsIBBass
      >>
    >>
  \layout {
    \override Staff.Accidental.alteration-glyph-name-alist = #standard-alteration-glyph-name-alist
  }
}