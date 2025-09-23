\version "2.24.4" 

\include "layout.ly"
\include "../spem.ly"
\include "../spem words.ly"

\score {

  <<
    % \new StaffGroup = choirStaff <<
      \override Score.BarNumber.break-visibility = ##(#f #t #t)
      \override Score.BarNumber.font-size = #1

      <<
        \new Voice {
          \clef "mensural-c1"  
          \notesIASoprano
        }
        \addlyrics { \wordsIASoprano }
      >>
      <<
        \new Voice {
          \clef "mensural-c2"  
          \notesIAAlto
        }
        \addlyrics \wordsIAAlto
      >>
      <<
        \new Voice {
          \clef "mensural-c3"  
          \notesIATenor
        }
        \addlyrics \wordsIATenor
      >>
      <<
        \new Voice {
          \clef "mensural-f"
          \notesIABaritone
        }
        \addlyrics \wordsIABaritone
      >>
      <<
        \new Voice {
          \clef "mensural-f"
          \notesIABass
        }
        \addlyrics \wordsIABass
      >>
    >>
  % >>
  \layout {
    \override Staff.Accidental.alteration-glyph-name-alist = #standard-alteration-glyph-name-alist
  }
}