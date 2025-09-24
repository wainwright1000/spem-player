export default {
  "parts": ["Soprano", "Alto", "Tenor", "Baritone", "Bass"],
  "scores": ["modern", "early"],
  "audio_prefix": "/audio/",
  "svg_prefix": "/svg/",
  
  "recording": ["ALC", "CotE"],
  "recording_label": ["Andrew Leslie Cooper", "Choir of the Earth"],
  "choirs": [
    ["I A", "I B", "II A", "II B", "III A", "III B", "IV A", "IV B"],
    ["1", "2", "3", "4", "5", "6", "7", "8"]
  ],
  "intro_beats": [2, 4],
  "barno": [
    [0, 1,      65,  75,   78,      86,  94,  107,     120,  121,  122,   137,     138,   139], // ALC
    [0, 1,  40,  65,  81, 102, 109, 120, 128,   133, 137, 138, 139]  // CotE
  ],
  "bartime": [
    [0, 2.2, 234.3, 274.0, 284, 312.5, 342.2,  387.8, 437.4, 441.2, 445.8, 500.8, 505, 512], // ALC
    [0, 4.2,   155,   252, 313.9, 395, 421.7, 464.9, 495.8, 515.1, 530, 534.5, 540]   // CotE
  ]
}