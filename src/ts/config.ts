export default {
  "parts": ["Soprano", "Alto", "Tenor", "Baritone", "Bass"],
  "scores": ["modern", "early"],
  "audio_prefix": "/audio/",
  "svg_prefix": "/svg/",
  
  // Andrew Leslie Cooper

  // "audio_prefix": "/audio/ALC/",
  // "intro_beats": 2,
  // "barno":   [0, 1,      65,    75,  78,    86,    94, 107,   120,   122, 137,   138, 139],
  // "bartime": [0, 2.5, 234.5, 274.2, 284, 312.8, 342.4, 388, 437.6, 446.1, 501, 506.4, 512],

  // Choir of the Earth

  // "audio_prefix": "/audio/CotE/",
  // "intro_beats": 4,
  // "barno":   [0,   1,  40,  65,    81, 102,   109,   120, 128,   133,   137, 138,   139], 
  // "bartime": [0, 4.2, 155, 252, 313.9, 395, 421.7, 464.9, 495.8, 515.1, 530, 534.5, 540],

  "version": ["ALC", "CotE"],
  "version_label": ["Andrew Leslie Cooper", "Choir of the Earth"],
  "choirs": [
    ["IA", "IB", "IIA", "IIB", "IIIA", "IIIB", "IVA", "IVB"],
    ["1", "2", "3", "4", "5", "6", "7", "8"]
  ],
  "intro_beats": [2, 4],
  "barno": [
    [0, 1,  65,  75,  78,  86,  94, 107, 120,   122, 137, 138, 139], // ALC
    [0, 1,  40,  65,  81, 102, 109, 120, 128,   133, 137, 138, 139]  // CotE
  ],
  "bartime": [
    [0, 2.5, 234.5, 274.2, 284, 312.8, 342.4,   388, 437.6, 446.1, 501, 506.4, 512], // ALC
    [0, 4.2,   155,   252, 313.9, 395, 421.7, 464.9, 495.8, 515.1, 530, 534.5, 540]   // CotE
  ]
}