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
          \notesIIBSoprano
        }
        \addlyrics { \wordsIIBSoprano }
      >>
      <<
        \new Voice {
          \clef "mensural-c2"  
          \notesIIBAlto
        }
        \addlyrics \wordsIIBAlto
      >>
      <<
        \new Voice {
          \clef "mensural-c3"  
          \notesIIBTenor
        }
        \addlyrics \wordsIIBTenor
      >>
      <<
        \new Voice {
          \clef "mensural-f"
          \notesIIBBaritone
        }
        \addlyrics \wordsIIBBaritone
      >>
      <<
        \new Voice {
          \clef "mensural-f"
          \notesIIBBass
        }
        \addlyrics \wordsIIBBass
      >>
    >>
  \layout {
    \override Staff.Accidental.alteration-glyph-name-alist = #standard-alteration-glyph-name-alist
  }
}