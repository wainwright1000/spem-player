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
          \notesIIIBSoprano
        }
        \addlyrics { \wordsIIIBSoprano }
      >>
      <<
        \new Voice {
          \clef "mensural-c2"  
          \notesIIIBAlto
        }
        \addlyrics \wordsIIIBAlto
      >>
      <<
        \new Voice {
          \clef "mensural-c3"  
          \notesIIIBTenor
        }
        \addlyrics \wordsIIIBTenor
      >>
      <<
        \new Voice {
          \clef "mensural-f"
          \notesIIIBBaritone
        }
        \addlyrics \wordsIIIBBaritone
      >>
      <<
        \new Voice {
          \clef "mensural-f"
          \notesIIIBBass
        }
        \addlyrics \wordsIIIBBass
      >>
    >>
  \layout {
    \override Staff.Accidental.alteration-glyph-name-alist = #standard-alteration-glyph-name-alist
  }
}