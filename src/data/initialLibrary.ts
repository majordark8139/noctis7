import { Album, Artist, Track } from '../types';

// High-fidelity graphic representation of "The Romantic" cover art matching Screenshot 1, 2, 3
export const THE_ROMANTIC_COVER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="%23f8f9fa"/>
      <stop offset="100%" stop-color="%23e9ecef"/>
    </radialGradient>
  </defs>
  <rect width="500" height="500" fill="%23ffffff" rx="16"/>
  <!-- Ornate Chain Border with Red Roses -->
  <rect x="28" y="28" width="444" height="444" fill="none" stroke="%231a1a1a" stroke-width="4" stroke-dasharray="8,6"/>
  <rect x="36" y="36" width="428" height="428" fill="none" stroke="%231a1a1a" stroke-width="2"/>
  <!-- Corner Roses -->
  <g fill="%23e11d48">
    <!-- Top-left -->
    <circle cx="50" cy="50" r="18"/>
    <circle cx="70" cy="45" r="14"/>
    <circle cx="45" cy="70" r="14"/>
    <!-- Top-right -->
    <circle cx="450" cy="50" r="18"/>
    <circle cx="430" cy="45" r="14"/>
    <circle cx="455" cy="70" r="14"/>
    <!-- Bottom-left -->
    <circle cx="50" cy="450" r="18"/>
    <circle cx="70" cy="455" r="14"/>
    <circle cx="45" cy="430" r="14"/>
    <!-- Bottom-right -->
    <circle cx="450" cy="450" r="18"/>
    <circle cx="430" cy="455" r="14"/>
    <circle cx="455" cy="430" r="14"/>
  </g>
  <!-- Green Leaves -->
  <g fill="%2315803d">
    <polygon points="30,30 20,45 35,40"/>
    <polygon points="470,30 480,45 465,40"/>
    <polygon points="30,470 20,455 35,460"/>
    <polygon points="470,470 480,455 465,460"/>
  </g>
  <!-- Title: THE ROMANTIC -->
  <text x="70" y="110" font-family="serif" font-size="28" font-weight="900" fill="%23111" transform="rotate(-25 70 110)" letter-spacing="3">THE</text>
  <text x="75" y="145" font-family="serif" font-size="34" font-weight="900" fill="%23111" transform="rotate(-25 75 145)" letter-spacing="4">ROMANTIC</text>
  <!-- Center Portrait Ring -->
  <circle cx="250" cy="255" r="130" fill="url(%23bgGlow)" stroke="%23111" stroke-width="3"/>
  <circle cx="250" cy="255" r="122" fill="none" stroke="%23111" stroke-width="1.5" stroke-dasharray="4,4"/>
  <!-- Bruno Mars Stylized Portrait -->
  <g fill="%23111" stroke="%23111">
    <!-- Afro Hair -->
    <ellipse cx="250" cy="205" rx="72" ry="58"/>
    <circle cx="205" cy="210" r="30"/>
    <circle cx="295" cy="210" r="30"/>
    <circle cx="250" cy="170" r="35"/>
    <!-- Bandana -->
    <path d="M 195 230 Q 250 220 305 230 L 302 245 Q 250 235 198 245 Z" fill="%23ffffff" stroke="%23111" stroke-width="2"/>
    <path d="M 205 233 L 295 233" stroke="%23111" stroke-width="1" stroke-dasharray="2,2"/>
    <!-- Face -->
    <path d="M 206 242 Q 250 240 294 242 L 285 305 Q 250 330 215 305 Z" fill="%23fcd34d" stroke="%23111" stroke-width="2"/>
    <!-- Mustache & Goatee -->
    <path d="M 235 292 Q 250 288 265 292 Q 250 297 235 292 Z" fill="%23111"/>
    <circle cx="250" cy="310" r="4" fill="%23111"/>
    <!-- Eyes -->
    <ellipse cx="230" cy="262" rx="7" ry="4" fill="%23111"/>
    <ellipse cx="270" cy="262" rx="7" ry="4" fill="%23111"/>
    <!-- Nose -->
    <path d="M 248 266 L 245 280 L 255 280 Z" fill="none" stroke="%23111" stroke-width="2"/>
    <!-- Jacket Collar -->
    <path d="M 215 320 L 180 375 L 320 375 L 285 320 Z" fill="%23111"/>
    <path d="M 250 325 L 250 375" stroke="%23ffffff" stroke-width="3"/>
  </g>
  <!-- Bottom Artist Signature -->
  <text x="250" y="420" font-family="sans-serif" font-size="28" font-weight="900" fill="%23111" text-anchor="middle" letter-spacing="6">BRUNO MARS</text>
</svg>`;

export const SILK_SONIC_COVER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <rect width="500" height="500" fill="%23c2a679"/>
  <rect x="20" y="20" width="460" height="460" fill="none" stroke="%23452c16" stroke-width="3"/>
  <text x="250" y="110" font-family="serif" font-size="22" font-weight="bold" fill="%23452c16" text-anchor="middle" letter-spacing="4">AN EVENING WITH</text>
  <text x="250" y="180" font-family="serif" font-size="52" font-weight="900" fill="%233b1e08" text-anchor="middle" letter-spacing="6">Silk Sonic</text>
  <circle cx="250" cy="300" r="100" fill="%23452c16" opacity="0.15"/>
  <ellipse cx="200" cy="290" rx="40" ry="50" fill="%233b1e08"/>
  <ellipse cx="300" cy="290" rx="40" ry="50" fill="%233b1e08"/>
  <text x="250" y="420" font-family="sans-serif" font-size="16" font-weight="bold" fill="%23452c16" text-anchor="middle" letter-spacing="3">BRUNO MARS %26 ANDERSON .PAAK</text>
</svg>`;

export const MAGIC_COVER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <rect width="500" height="500" fill="%2318181b"/>
  <rect x="180" y="40" width="140" height="420" fill="%23991b1b"/>
  <circle cx="250" cy="180" r="70" fill="%23eab308"/>
  <text x="250" y="130" font-family="sans-serif" font-size="16" font-weight="900" fill="%23ffffff" text-anchor="middle" letter-spacing="3">BRUNO MARS</text>
  <text x="250" y="240" font-family="sans-serif" font-size="44" font-weight="900" fill="%23ffffff" text-anchor="middle" letter-spacing="2">XXIV</text>
  <text x="250" y="290" font-family="serif" font-size="32" font-weight="bold" fill="%23eab308" text-anchor="middle" letter-spacing="6">Magic</text>
</svg>`;

export const JUKEBOX_COVER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <rect width="500" height="500" fill="%23e7dfd5"/>
  <text x="250" y="100" font-family="sans-serif" font-size="42" font-weight="900" fill="%23991b1b" text-anchor="middle" letter-spacing="4">BRUNO MARS</text>
  <text x="250" y="140" font-family="sans-serif" font-size="20" font-weight="bold" fill="%2318181b" text-anchor="middle" letter-spacing="3">UNORTHODOX JUKEBOX</text>
  <rect x="150" y="180" width="200" height="240" fill="%2327272a" rx="12"/>
  <circle cx="250" cy="270" r="60" fill="%23fbbf24"/>
  <circle cx="250" cy="270" r="20" fill="%2318181b"/>
</svg>`;

export const DOO_WOPS_COVER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <rect width="500" height="500" fill="%23eab308"/>
  <path d="M 200 480 Q 250 250 400 120" stroke="%23ffffff" stroke-width="40" fill="none"/>
  <text x="320" y="280" font-family="sans-serif" font-size="26" font-weight="900" fill="%23451a03">BRUNO MARS</text>
  <text x="320" y="315" font-family="sans-serif" font-size="14" font-weight="bold" fill="%2378350f">doo-wops %26 hooligans</text>
</svg>`;

export const LATEST_RELEASE_COVER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <rect width="500" height="500" fill="%2393c5fd"/>
  <!-- Cowboy Hat Bruno Mars with Guitar -->
  <circle cx="250" cy="200" r="90" fill="%23ffffff"/>
  <ellipse cx="250" cy="140" rx="110" ry="30" fill="%23ffffff" stroke="%23111" stroke-width="3"/>
  <circle cx="250" cy="190" r="45" fill="%23fcd34d"/>
  <path d="M 160 300 L 340 380 L 320 420 L 140 340 Z" fill="%23b45309" stroke="%23111" stroke-width="3"/>
  <text x="340" y="90" font-family="cursive, serif" font-size="34" font-weight="bold" fill="%23dc2626">Lo Arriesgo</text>
  <text x="380" y="130" font-family="cursive, serif" font-size="44" font-weight="bold" fill="%23dc2626">Todo</text>
  <text x="360" y="440" font-family="sans-serif" font-size="24" font-weight="900" fill="%23dc2626">BRUNO MARS</text>
</svg>`;

export const ARTIST_BANNER_PHOTO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="photoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="%23111317" stop-opacity="1"/>
      <stop offset="40%" stop-color="%231a1d24" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="%232b2f3a" stop-opacity="0.2"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="%23111317"/>
  <!-- Monochromatic Vintage Artist Portrait -->
  <g transform="translate(420, 40)">
    <circle cx="180" cy="180" r="160" fill="%23d1d5db"/>
    <ellipse cx="180" cy="120" rx="90" ry="70" fill="%23111827"/>
    <ellipse cx="180" cy="170" rx="60" ry="70" fill="%239ca3af"/>
    <!-- Bandana / Cap -->
    <path d="M 120 150 Q 180 140 240 150 L 235 170 Q 180 160 125 170 Z" fill="%23ffffff"/>
    <!-- Sunglasses & Mustache -->
    <rect x="145" y="175" width="30" height="15" rx="4" fill="%23111827"/>
    <rect x="185" y="175" width="30" height="15" rx="4" fill="%23111827"/>
    <path d="M 160 215 Q 180 210 200 215 Z" stroke="%23111827" stroke-width="4"/>
    <!-- Leather Jacket / Collar -->
    <path d="M 100 280 L 180 240 L 260 280 L 290 480 L 70 480 Z" fill="%231f2937"/>
    <path d="M 150 260 L 180 340 L 210 260" stroke="%23ffffff" stroke-width="3" fill="none"/>
  </g>
  <!-- Fade Gradient Overlay into Dark Background -->
  <rect width="800" height="600" fill="url(%23photoGrad)"/>
</svg>`;

// The exact lyrics for "Risk It All" matching Screenshot 2 word-by-word
export const RISK_IT_ALL_LYRICS = [
  {
    time: 0,
    text: "You could set the bar",
    words: [
      { word: "You", start: 0.1, end: 0.6 },
      { word: "could", start: 0.7, end: 1.2 },
      { word: "set", start: 1.3, end: 1.8 },
      { word: "the", start: 1.9, end: 2.2 },
      { word: "bar", start: 2.3, end: 3.2 },
    ],
  },
  {
    time: 4,
    text: "Beyond the stars",
    words: [
      { word: "Beyond", start: 4.1, end: 5.2 },
      { word: "the", start: 5.3, end: 5.6 },
      { word: "stars", start: 5.7, end: 7.2 },
    ],
  },
  {
    time: 8,
    text: "I'll do anything, anything you ask me to",
    words: [
      { word: "I'll", start: 8.0, end: 8.5 },
      { word: "do", start: 8.6, end: 9.0 },
      { word: "anything,", start: 9.1, end: 10.2 },
      { word: "anything", start: 10.3, end: 11.4 },
      { word: "you", start: 11.5, end: 11.8 },
      { word: "ask", start: 11.9, end: 12.4 },
      { word: "me", start: 12.5, end: 12.8 },
      { word: "to", start: 12.9, end: 13.8 },
    ],
  },
  {
    time: 14,
    text: "Say you want the moon, watch me learn to fly",
    words: [
      { word: "Say", start: 14.1, end: 14.6 },
      { word: "you", start: 14.7, end: 15.0 },
      { word: "want", start: 15.1, end: 15.6 },
      { word: "the", start: 15.7, end: 16.0 },
      { word: "moon,", start: 16.1, end: 17.2 },
      { word: "watch", start: 17.3, end: 17.8 },
      { word: "me", start: 17.9, end: 18.2 },
      { word: "learn", start: 18.3, end: 19.0 },
      { word: "to", start: 19.1, end: 19.4 },
      { word: "fly", start: 19.5, end: 20.8 },
    ],
  },
  {
    time: 21,
    text: "Ain't a mountain you could point to I wouldn't climb",
    words: [
      { word: "Ain't", start: 21.0, end: 21.5 },
      { word: "a", start: 21.6, end: 21.8 },
      { word: "mountain", start: 21.9, end: 22.8 },
      { word: "you", start: 22.9, end: 23.2 },
      { word: "could", start: 23.3, end: 23.7 },
      { word: "point", start: 23.8, end: 24.3 },
      { word: "to", start: 24.4, end: 24.7 },
      { word: "I", start: 24.8, end: 25.0 },
      { word: "wouldn't", start: 25.1, end: 25.8 },
      { word: "climb", start: 25.9, end: 27.2 },
    ],
  },
  {
    time: 28,
    text: "It's crazy, but it's true, there's nothing I won't do",
    words: [
      { word: "It's", start: 28.0, end: 28.4 },
      { word: "crazy,", start: 28.5, end: 29.4 },
      { word: "but", start: 29.5, end: 29.8 },
      { word: "it's", start: 29.9, end: 30.2 },
      { word: "true,", start: 30.3, end: 31.2 },
      { word: "there's", start: 31.3, end: 31.8 },
      { word: "nothing", start: 31.9, end: 32.7 },
      { word: "I", start: 32.8, end: 33.1 },
      { word: "won't", start: 33.2, end: 33.7 },
      { word: "do", start: 33.8, end: 35.0 },
    ],
  },
  {
    time: 36,
    text: "I'd risk it all for you",
    words: [
      { word: "I'd", start: 36.1, end: 36.8 },
      { word: "risk", start: 36.9, end: 37.6 },
      { word: "it", start: 37.7, end: 38.0 },
      { word: "all", start: 38.1, end: 39.2 },
      { word: "for", start: 39.3, end: 39.7 },
      { word: "you", start: 39.8, end: 41.5 },
    ],
  },
  {
    time: 42,
    text: "To hold your hand and call you mine",
    words: [
      { word: "To", start: 42.0, end: 42.4 },
      { word: "hold", start: 42.5, end: 43.2 },
      { word: "your", start: 43.3, end: 43.7 },
      { word: "hand", start: 43.8, end: 44.7 },
      { word: "and", start: 44.8, end: 45.1 },
      { word: "call", start: 45.2, end: 45.9 },
      { word: "you", start: 46.0, end: 46.4 },
      { word: "mine", start: 46.5, end: 48.2 },
    ],
  },
  {
    time: 49,
    text: "I'm tryna be your man",
    words: [
      { word: "I'm", start: 49.0, end: 49.5 },
      { word: "tryna", start: 49.6, end: 50.4 },
      { word: "be", start: 50.5, end: 50.9 },
      { word: "your", start: 51.0, end: 51.4 },
      { word: "man", start: 51.5, end: 53.5 },
    ],
  },
];

// Initial tracks
export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-risk-it-all',
    title: 'Risk It All',
    artist: 'Bruno Mars',
    album: 'The Romantic',
    duration: 156, // 2:36 matching Screenshot 2
    year: 2026,
    genre: 'Pop · Funk · R&B',
    trackNumber: 1,
    coverArt: THE_ROMANTIC_COVER,
    lossless: true,
    hiRes: true,
    format: 'FLAC',
    bitDepth: 24,
    sampleRate: 96000,
    bitrate: 2840,
    bpm: 114,
    key: 'F Major',
    playCount: 142,
    isFavorite: true,
    lyrics: RISK_IT_ALL_LYRICS,
    syncedLyrics: true,
  },
  {
    id: 'track-on-my-soul',
    title: 'On My Soul',
    artist: 'Bruno Mars',
    album: 'The Romantic',
    duration: 174, // 2:54 matching Screenshot 1 Top Song #1
    year: 2026,
    genre: 'Pop · Funk · R&B',
    trackNumber: 2,
    coverArt: THE_ROMANTIC_COVER,
    lossless: true,
    hiRes: true,
    format: 'FLAC',
    bitDepth: 24,
    sampleRate: 96000,
    bitrate: 2910,
    bpm: 118,
    key: 'D Minor',
    playCount: 388,
    isFavorite: true,
    lyrics: [
      { time: 0, text: "Swear on my soul, you're the one that I've been waiting for" },
      { time: 6, text: "Can't let you go, never lock that door" },
      { time: 14, text: "Every beat in my chest got your name on the rhythm" },
      { time: 22, text: "Giving all of my love, it's a blessing we're living" },
    ],
    syncedLyrics: true,
  },
  {
    id: 'track-777',
    title: '777',
    artist: 'Silk Sonic',
    album: 'An Evening With Silk Sonic',
    duration: 165, // 2:45 matching Screenshot 1 Top Song #2
    year: 2021,
    genre: 'R&B · Funk · Soul',
    trackNumber: 4,
    coverArt: SILK_SONIC_COVER,
    lossless: true,
    hiRes: true,
    format: 'FLAC',
    bitDepth: 24,
    sampleRate: 96000,
    bitrate: 2950,
    bpm: 124,
    key: 'C Major',
    playCount: 295,
    isFavorite: false,
    lyrics: [
      { time: 0, text: "Spin that wheel, let the chips fall down" },
      { time: 7, text: "Triple sevens in this Vegas town" },
      { time: 15, text: "Pocket full of gold and my drink is ice cold" },
    ],
    syncedLyrics: true,
  },
  {
    id: 'track-dance-with-me',
    title: 'Dance With Me',
    artist: 'Bruno Mars',
    album: 'The Romantic',
    duration: 219, // 3:39 matching Screenshot 1 Top Song #3
    year: 2026,
    genre: 'Pop · Funk · R&B',
    trackNumber: 3,
    coverArt: THE_ROMANTIC_COVER,
    lossless: true,
    hiRes: true,
    format: 'FLAC',
    bitDepth: 24,
    sampleRate: 96000,
    bitrate: 2780,
    bpm: 120,
    key: 'Bb Major',
    playCount: 260,
    isFavorite: true,
    lyrics: [
      { time: 0, text: "Put your high heels on, we're taking the floor" },
      { time: 8, text: "Ain't nobody leaving till the lights come home" },
    ],
    syncedLyrics: true,
  },
  {
    id: 'track-god-was-showing-off',
    title: 'God Was Showing Off',
    artist: 'Bruno Mars',
    album: 'The Romantic',
    duration: 211, // 3:31 matching Screenshot 1 Top Song #4
    year: 2026,
    genre: 'Pop · Funk · R&B',
    trackNumber: 4,
    coverArt: THE_ROMANTIC_COVER,
    lossless: true,
    hiRes: true,
    format: 'FLAC',
    bitDepth: 24,
    sampleRate: 96000,
    bitrate: 2890,
    bpm: 108,
    key: 'G Major',
    playCount: 215,
    isFavorite: false,
    lyrics: [
      { time: 0, text: "When He made you, girl, God was showing off" },
      { time: 10, text: "Perfection in every little step you walk" },
    ],
    syncedLyrics: true,
  },
  {
    id: 'track-something-serious',
    title: 'Something Serious',
    artist: 'Bruno Mars',
    album: 'The Romantic',
    duration: 166, // 2:46 matching Screenshot 1 Top Song #5
    year: 2026,
    genre: 'Pop · Funk · R&B',
    trackNumber: 5,
    coverArt: THE_ROMANTIC_COVER,
    lossless: true,
    hiRes: true,
    format: 'FLAC',
    bitDepth: 24,
    sampleRate: 96000,
    bitrate: 2750,
    bpm: 112,
    key: 'E Minor',
    playCount: 180,
    isFavorite: false,
    lyrics: [
      { time: 0, text: "We started casual now it's something serious" },
      { time: 9, text: "Looking in your eyes got me delirious" },
    ],
    syncedLyrics: true,
  },
  {
    id: 'track-cha-cha-cha',
    title: 'Cha Cha Cha',
    artist: 'Bruno Mars',
    album: 'The Romantic',
    duration: 195, // Up Next in Screenshot 3
    year: 2026,
    genre: 'Pop · Latin Funk',
    trackNumber: 6,
    coverArt: THE_ROMANTIC_COVER,
    lossless: true,
    hiRes: true,
    format: 'FLAC',
    bitDepth: 24,
    sampleRate: 96000,
    bitrate: 2900,
    bpm: 122,
    key: 'A Minor',
    playCount: 120,
    isFavorite: false,
    lyrics: [
      { time: 0, text: "One two step and we do the cha cha cha" },
      { time: 8, text: "Under the Havana stars, wherever we are" },
    ],
    syncedLyrics: true,
  },
  {
    id: 'track-lo-arriesgo-todo',
    title: 'Lo Arriesgo Todo',
    artist: 'Bruno Mars',
    album: 'Lo Arriesgo Todo - Single',
    duration: 204, // 3:24 matching Screenshot 1 Latest Release
    year: 2026,
    genre: 'Latin Pop · Bolero',
    trackNumber: 1,
    coverArt: LATEST_RELEASE_COVER,
    lossless: true,
    hiRes: true,
    format: 'FLAC',
    bitDepth: 24,
    sampleRate: 96000,
    bitrate: 2880,
    bpm: 98,
    key: 'F# Minor',
    playCount: 412,
    isFavorite: true,
    lyrics: [
      { time: 0, text: "Por tu amor yo lo arriesgo todo" },
      { time: 8, text: "No me importa el dolor ni el modo" },
    ],
    syncedLyrics: true,
  },
];

export const INITIAL_ALBUMS: Album[] = [
  {
    id: 'album-the-romantic',
    title: 'The Romantic',
    artist: 'Bruno Mars',
    year: 2026,
    coverArt: THE_ROMANTIC_COVER,
    type: 'album',
    genre: 'Pop · Funk · R&B',
    hiRes: true,
    tracks: INITIAL_TRACKS.filter((t) => t.album === 'The Romantic'),
  },
  {
    id: 'album-lo-arriesgo-todo',
    title: 'Lo Arriesgo Todo - Single',
    artist: 'Bruno Mars',
    year: 2026,
    coverArt: LATEST_RELEASE_COVER,
    type: 'single',
    genre: 'Latin Pop',
    hiRes: true,
    tracks: INITIAL_TRACKS.filter((t) => t.album === 'Lo Arriesgo Todo - Single'),
  },
  {
    id: 'album-silk-sonic',
    title: 'An Evening with Silk Sonic',
    artist: 'Silk Sonic',
    year: 2021,
    coverArt: SILK_SONIC_COVER,
    type: 'album',
    genre: 'R&B · Soul',
    hiRes: true,
    tracks: INITIAL_TRACKS.filter((t) => t.album === 'An Evening With Silk Sonic'),
  },
  {
    id: 'album-24k-magic',
    title: '24K Magic',
    artist: 'Bruno Mars',
    year: 2016,
    coverArt: MAGIC_COVER,
    type: 'album',
    genre: 'Funk · R&B',
    hiRes: true,
    tracks: [],
  },
  {
    id: 'album-unorthodox-jukebox',
    title: 'Unorthodox Jukebox',
    artist: 'Bruno Mars',
    year: 2012,
    coverArt: JUKEBOX_COVER,
    type: 'album',
    genre: 'Pop · Reggae',
    hiRes: false,
    tracks: [],
  },
  {
    id: 'album-doo-wops',
    title: 'Doo-Wops & Hooligans',
    artist: 'Bruno Mars',
    year: 2010,
    coverArt: DOO_WOPS_COVER,
    type: 'album',
    genre: 'Pop · Soul',
    hiRes: false,
    tracks: [],
  },
];

export const BRUNO_MARS_ARTIST: Artist = {
  id: 'artist-bruno-mars',
  name: 'Bruno Mars',
  genre: 'POP',
  fansCount: '12,788,106 fans',
  photoUrl: ARTIST_BANNER_PHOTO,
  bio: 'Peter Gene Hernandez, known professionally as Bruno Mars, is an American singer-songwriter, record producer and dancer. Regarded as a pop icon, he is known for his three-octave tenor vocal range, live performances, retro showmanship, and musical versatility. He is accompanied by his band, the Hooligans, who play a variety of instruments and serve as backup dancers.',
  origin: 'Honolulu, United States',
  born: 'October 8, 1985',
  genres: ['Pop', 'Funk', 'R&B', 'Contemporary r&b'],
  socialLinks: {
    spotify: 'https://open.spotify.com/artist/0du5cEVh5yTK9QJze8zA0C',
    appleMusic: 'https://music.apple.com/artist/bruno-mars/278873078',
    youtube: 'https://youtube.com',
    soundcloud: 'https://soundcloud.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    web: 'https://brunomars.com',
  },
  albums: INITIAL_ALBUMS,
  topSongs: INITIAL_TRACKS.slice(0, 5),
  latestRelease: {
    title: 'Lo Arriesgo Todo - Single',
    type: 'Single · 2026',
    date: 'May 8, 2026',
    songCount: 1,
    duration: '3:24',
    coverArt: LATEST_RELEASE_COVER,
    track: INITIAL_TRACKS[7],
  },
  stats: {
    releases: 37,
    songs: 167,
    totalLength: '10h 36m',
    mostPlayed: 'On My Soul',
    inLibrarySince: 'September 2026',
  },
};
