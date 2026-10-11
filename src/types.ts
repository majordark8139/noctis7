export type ViewMode =
  | 'home'
  | 'songs'
  | 'albums'
  | 'artists'
  | 'artist_detail'
  | 'folders'
  | 'playlists'
  | 'lyrics'
  | 'coverflow'
  | 'visualizer'
  | 'radio';

export type CoverFlowLayout = 'collage' | 'carousel' | 'cascade';

export type PhysicalMediaStyle = 'standard' | 'vinyl' | 'cd' | 'cassette';

export type VisualizerMode = 'bars' | 'mirror' | 'wave' | 'spectrogram';

export type ThemeName = 'Dark' | 'Gray' | 'Midnight' | 'Light' | 'Ink' | 'Smoke' | 'Custom';

export interface WordTimestamp {
  word: string;
  start: number; // in seconds
  end: number;
}

export interface LyricLine {
  time: number; // in seconds
  text: string;
  words?: WordTimestamp[];
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  year?: number;
  genre?: string;
  trackNumber?: number;
  coverArt?: string;
  audioUrl?: string; // audio source URL or blob URL
  audioFile?: File;
  lossless: boolean;
  hiRes: boolean;
  format: 'FLAC' | 'ALAC' | 'WAV' | 'AIFF' | 'APE' | 'MP3' | 'AAC' | 'OGG' | 'Opus' | 'M4A';
  bitDepth?: number; // e.g. 16 or 24
  sampleRate?: number; // e.g. 44100 or 96000
  bitrate?: number; // kbps
  lyrics?: LyricLine[];
  syncedLyrics?: boolean;
  isFavorite?: boolean;
  playCount: number;
  bpm?: number;
  key?: string;
  replayGain?: number; // in dB
  eqPreset?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  year: number;
  coverArt: string;
  tracks: Track[];
  type: 'album' | 'single' | 'ep';
  genre: string;
  hiRes: boolean;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  fansCount: string;
  photoUrl: string;
  bio: string;
  origin: string;
  born: string;
  genres: string[];
  socialLinks: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
    soundcloud?: string;
    instagram?: string;
    twitter?: string;
    web?: string;
  };
  albums: Album[];
  topSongs: Track[];
  latestRelease?: {
    title: string;
    type: string;
    date: string;
    songCount: number;
    duration: string;
    coverArt: string;
    track: Track;
  };
  stats: {
    releases: number;
    songs: number;
    totalLength: string;
    mostPlayed: string;
    inLibrarySince: string;
  };
}

export interface Playlist {
  id: string;
  name: string;
  trackIds: string[];
  isSmart?: boolean;
  coverArt?: string;
}

export interface EqualizerBand {
  freq: number; // e.g. 32, 64, 125, etc.
  gain: number; // -12 to +12 dB
}

export interface EqualizerPreset {
  name: string;
  gains: number[]; // 10 values
}

export interface SettingsState {
  theme: ThemeName;
  accentColor: string; // e.g. #e11d48
  accentFollowsAlbumArt: boolean;
  liquidGlass: boolean;
  hardwareThrottling: boolean; // optimized for i3-4005U / HD 4400
  crossfadeDuration: number; // seconds
  gaplessPlayback: boolean;
  replayGainEnabled: boolean;
  mediaStyle: PhysicalMediaStyle;
  coverFlowLayout: CoverFlowLayout;
  visualizerMode: VisualizerMode;
  visualizerFps: number; // 30 or 60
  autoPlayRadio: boolean;
}
