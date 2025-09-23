\version "2.24.4"

leadMark = \markup {
  \with-color #red
  \path #0.5 #'((moveto 0 0)(lineto 0 1)
     (lineto 1 1))
}

ficta = { 
  \once \set suggestAccidentals = ##t 
}

\header {
  title = "Spem in alium nunquam habui"
  composer = "Thomas Tallis (c. 1505-1585)"
  edition = "VERSION A 2020 © Hugh Keyte 2020"
  tagline = \markup { \fill-line { \fromproperty #'header:edition } }
}


emphasize = {
  \override Lyrics.LyricText.font-series = #'bold
  \override Lyrics.LyricText.color = #red
}

normal = {
  \revert Lyrics.LyricText.color
  \revert Lyrics.LyricText.font-series
}
