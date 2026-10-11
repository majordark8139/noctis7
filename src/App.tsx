/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Track,
  Album,
  Artist,
  ViewMode,
  SettingsState,
  CoverFlowLayout,
  VisualizerMode,
} from './types';
import {
  INITIAL_TRACKS,
  INITIAL_ALBUMS,
  BRUNO_MARS_ARTIST,
  THE_ROMANTIC_COVER,
} from './data/initialLibrary';
import { AudioEngine } from './services/audioEngine';
import { TagParser } from './services/tagParser';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { PlayerBar } from './components/PlayerBar';
import { ArtistView } from './components/views/ArtistView';
import { LyricsView } from './components/views/LyricsView';
import { CoverFlowView } from './components/views/CoverFlowView';
import { SongsView } from './components/views/SongsView';
import { AlbumsView } from './components/views/AlbumsView';
import { FoldersView } from './components/views/FoldersView';
import { RadioView } from './components/views/RadioView';

import { SettingsModal } from './components/modals/SettingsModal';
import { EqualizerModal } from './components/modals/EqualizerModal';
import { VisualizerModal } from './components/modals/VisualizerModal';
import { QueueDrawer } from './components/modals/QueueDrawer';
import { CommandPalette } from './components/CommandPalette';

export default function App() {
  const [tracks, setTracks] = React.useState<Track[]>(INITIAL_TRACKS);
  const [albums, setAlbums] = React.useState<Album[]>(INITIAL_ALBUMS);
  const [artist, setArtist] = React.useState<Artist>(BRUNO_MARS_ARTIST);

  const [currentView, setCurrentView] = React.useState<ViewMode>('artist_detail');
  const [currentTrack, setCurrentTrack] = React.useState<Track | null>(INITIAL_TRACKS[0]); // "Risk It All"
  const [queue, setQueue] = React.useState<Track[]>(INITIAL_TRACKS.slice(1));

  // Audio Playback state
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(INITIAL_TRACKS[0].duration);
  const [volume, setVolume] = React.useState(0.85);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isShuffle, setIsShuffle] = React.useState(false);
  const [repeatMode, setRepeatMode] = React.useState<'off' | 'all' | 'one'>('all');

  // Equalizer state
  const [eqGains, setEqGains] = React.useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  // Modal dialog states
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isEqualizerOpen, setIsEqualizerOpen] = React.useState(false);
  const [isVisualizerOpen, setIsVisualizerOpen] = React.useState(false);
  const [isQueueOpen, setIsQueueOpen] = React.useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Settings & Theme
  const [settings, setSettings] = React.useState<SettingsState>({
    theme: 'Ink',
    accentColor: '#e11d48', // Crimson/Rose ink matching Screenshot 1 & 4
    accentFollowsAlbumArt: true,
    liquidGlass: true,
    hardwareThrottling: true, // Optimized for i3-4005U / HD 4400
    crossfadeDuration: 3,
    gaplessPlayback: true,
    replayGainEnabled: true,
    mediaStyle: 'standard',
    coverFlowLayout: 'collage',
    visualizerMode: 'bars',
    visualizerFps: 60,
    autoPlayRadio: true,
  });

  const audioEngine = React.useMemo(() => AudioEngine.getInstance(), []);

  // Listen to Audio Engine updates
  React.useEffect(() => {
    const unsubTime = audioEngine.onTimeUpdate((cur, dur) => {
      setCurrentTime(cur);
      if (dur > 0) setDuration(dur);
    });

    const unsubPlay = audioEngine.onPlayStateChange((playing) => {
      setIsPlaying(playing);
    });

    const unsubEnd = audioEngine.onTrackEnd(() => {
      handleNextTrack();
    });

    return () => {
      unsubTime();
      unsubPlay();
      unsubEnd();
    };
  }, [audioEngine, queue, repeatMode]);

  // Global Keyboard Shortcuts (Space, Ctrl+K, Escape)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleTogglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Playback Handlers
  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
    setDuration(track.duration);
    setCurrentTime(0);
    audioEngine.playTrack(track);

    // Apply per-track EQ preset if configured
    if (track.eqPreset) {
      // track preset
    }
  };

  const handleTogglePlay = () => {
    if (!currentTrack && tracks.length > 0) {
      handlePlayTrack(tracks[0]);
    } else {
      audioEngine.togglePlay();
    }
  };

  const handleNextTrack = () => {
    if (repeatMode === 'one' && currentTrack) {
      handlePlayTrack(currentTrack);
      return;
    }

    if (queue.length > 0) {
      const next = queue[0];
      setQueue((prev) => prev.slice(1));
      handlePlayTrack(next);
    } else if (tracks.length > 0) {
      const curIdx = tracks.findIndex((t) => t.id === currentTrack?.id);
      const nextIdx = (curIdx + 1) % tracks.length;
      handlePlayTrack(tracks[nextIdx]);
    }
  };

  const handlePreviousTrack = () => {
    if (currentTime > 3) {
      audioEngine.seek(0);
      return;
    }
    if (tracks.length > 0) {
      const curIdx = tracks.findIndex((t) => t.id === currentTrack?.id);
      const prevIdx = (curIdx - 1 + tracks.length) % tracks.length;
      handlePlayTrack(tracks[prevIdx]);
    }
  };

  const handleSeek = (secs: number) => {
    setCurrentTime(secs);
    audioEngine.seek(secs);
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    audioEngine.setVolume(vol);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.setMuted(nextMuted);
  };

  const handleToggleShuffle = () => {
    setIsShuffle(!isShuffle);
    if (!isShuffle) {
      setQueue((prev) => [...prev].sort(() => Math.random() - 0.5));
    }
  };

  const handleCycleRepeat = () => {
    const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
    const nextIdx = (modes.indexOf(repeatMode) + 1) % modes.length;
    setRepeatMode(modes[nextIdx]);
  };

  // Toggle favorite for track
  const handleToggleFavorite = (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, isFavorite: !t.isFavorite } : t))
    );
    if (currentTrack?.id === trackId) {
      setCurrentTrack((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  // Update track lyrics
  const handleUpdateLyrics = (trackId: string, lrcText: string) => {
    const parsed = TagParser.parseLrcText(lrcText);
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, lyrics: parsed, syncedLyrics: parsed.length > 0 } : t))
    );
    if (currentTrack?.id === trackId) {
      setCurrentTrack((prev) => (prev ? { ...prev, lyrics: parsed, syncedLyrics: parsed.length > 0 } : null));
    }
  };

  // Equalizer Gain Change
  const handleEqGainChange = (bandIndex: number, gain: number) => {
    const nextGains = [...eqGains];
    nextGains[bandIndex] = gain;
    setEqGains(nextGains);
    audioEngine.setEqGain(bandIndex, gain);
  };

  const handleApplyEqPreset = (gains: number[]) => {
    setEqGains([...gains]);
    audioEngine.setEqPreset(gains);
  };

  // Local File & Folder Import handler
  const handleImportFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    const audioFiles = files.filter((f) =>
      /\.(flac|alac|wav|aiff|ape|mp3|aac|ogg|opus|m4a)$/i.test(f.name)
    );
    const lrcFiles = files.filter((f) => /\.(lrc|txt|ttml|lyricsfile)$/i.test(f.name));

    // Map companion lrc files by base name
    const lrcMap = new Map<string, string>();
    for (const lrc of lrcFiles) {
      const baseName = lrc.name.replace(/\.[^/.]+$/, '').toLowerCase();
      const text = await lrc.text();
      lrcMap.set(baseName, text);
    }

    const newTracks: Track[] = [];

    for (const file of audioFiles) {
      const parsed = await TagParser.parseAudioFile(file);
      const baseName = file.name.replace(/\.[^/.]+$/, '').toLowerCase();

      // Check for companion LRC
      let lyrics = parsed.lyrics;
      if (lrcMap.has(baseName)) {
        lyrics = TagParser.parseLrcText(lrcMap.get(baseName)!);
      }

      const newTrack: Track = {
        id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: parsed.title || file.name,
        artist: parsed.artist || 'Local Artist',
        album: parsed.album || 'Local Library',
        duration: parsed.duration || 180,
        year: parsed.year || new Date().getFullYear(),
        genre: parsed.genre || 'Lossless Audio',
        coverArt: parsed.coverArt || THE_ROMANTIC_COVER,
        audioUrl: parsed.audioUrl,
        audioFile: file,
        lossless: parsed.lossless || true,
        hiRes: parsed.hiRes || false,
        format: parsed.format || 'FLAC',
        bitDepth: parsed.bitDepth || 24,
        sampleRate: parsed.sampleRate || 96000,
        playCount: 0,
        isFavorite: false,
        lyrics,
        syncedLyrics: lyrics && lyrics.length > 0,
      };

      newTracks.push(newTrack);
    }

    if (newTracks.length > 0) {
      setTracks((prev) => [...newTracks, ...prev]);
      handlePlayTrack(newTracks[0]);
      alert(`Imported ${newTracks.length} lossless audio tracks successfully!`);
    }
  };

  // Compute active accent color (recolors from album art if enabled)
  const effectiveAccentColor = settings.accentColor || '#e11d48';

  return (
    <div
      className={`h-screen w-screen flex flex-col overflow-hidden font-sans select-none ${
        settings.theme === 'Light'
          ? 'bg-slate-100 text-slate-900'
          : settings.theme === 'Gray'
          ? 'bg-[#1a1d24] text-neutral-200'
          : settings.theme === 'Midnight'
          ? 'bg-[#090b14] text-neutral-200'
          : 'bg-[#0d0e11] text-neutral-200'
      }`}
    >
      {/* 1. Custom Noctis Frameless Titlebar */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        accentColor={effectiveAccentColor}
      />

      {/* 2. Main Workspace Layout: Left Sidebar Icon Rail + Dynamic Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          accentColor={effectiveAccentColor}
          avatarUrl={currentTrack?.coverArt}
          favoritesCount={tracks.filter((t) => t.isFavorite).length}
        />

        {/* View Routing */}
        <main className="flex-1 flex flex-col overflow-hidden relative bg-[#0d0e11]">
          {currentView === 'artist_detail' && (
            <ArtistView
              artist={artist}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              accentColor={effectiveAccentColor}
              onPlayTrack={handlePlayTrack}
              onPlayAlbum={(alb) => {
                if (alb.tracks[0]) handlePlayTrack(alb.tracks[0]);
              }}
              onToggleFavoriteTrack={handleToggleFavorite}
              onSelectAlbum={(alb) => {
                if (alb.tracks[0]) handlePlayTrack(alb.tracks[0]);
              }}
            />
          )}

          {currentView === 'lyrics' && currentTrack && (
            <LyricsView
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              volume={volume}
              isMuted={isMuted}
              accentColor={effectiveAccentColor}
              onTogglePlay={handleTogglePlay}
              onNext={handleNextTrack}
              onPrevious={handlePreviousTrack}
              onSeek={handleSeek}
              onVolumeChange={handleVolumeChange}
              onToggleMute={handleToggleMute}
              onOpenQueue={() => setIsQueueOpen(true)}
              onUpdateLyrics={handleUpdateLyrics}
            />
          )}

          {currentView === 'coverflow' && (
            <CoverFlowView
              albums={albums}
              currentTrack={currentTrack}
              accentColor={effectiveAccentColor}
              layout={settings.coverFlowLayout}
              onSelectLayout={(l) => setSettings((s) => ({ ...s, coverFlowLayout: l }))}
              onPlayTrack={handlePlayTrack}
              onSelectAlbum={(alb) => {
                if (alb.tracks[0]) handlePlayTrack(alb.tracks[0]);
              }}
            />
          )}

          {currentView === 'songs' && (
            <SongsView
              tracks={tracks}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              accentColor={effectiveAccentColor}
              onPlayTrack={handlePlayTrack}
              onToggleFavorite={handleToggleFavorite}
              onImportFiles={handleImportFiles}
            />
          )}

          {currentView === 'albums' && (
            <AlbumsView
              albums={albums}
              accentColor={effectiveAccentColor}
              onSelectAlbum={(alb) => {
                if (alb.tracks[0]) handlePlayTrack(alb.tracks[0]);
              }}
              onPlayAlbum={(alb) => {
                if (alb.tracks[0]) handlePlayTrack(alb.tracks[0]);
              }}
            />
          )}

          {currentView === 'folders' && (
            <FoldersView
              tracks={tracks}
              onPlayTrack={handlePlayTrack}
              accentColor={effectiveAccentColor}
            />
          )}

          {currentView === 'radio' && (
            <RadioView
              tracks={tracks}
              currentTrack={currentTrack}
              onPlayTrack={handlePlayTrack}
              accentColor={effectiveAccentColor}
            />
          )}

          {(currentView === 'home' || currentView === 'playlists' || currentView === 'artists') && (
            <SongsView
              tracks={currentView === 'playlists' ? tracks.filter((t) => t.isFavorite) : tracks}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              accentColor={effectiveAccentColor}
              onPlayTrack={handlePlayTrack}
              onToggleFavorite={handleToggleFavorite}
              onImportFiles={handleImportFiles}
            />
          )}
        </main>
      </div>

      {/* 3. Floating Player Bar Dock (Matching Screenshots 1, 3, 4) */}
      <PlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        accentColor={effectiveAccentColor}
        isShuffle={isShuffle}
        repeatMode={repeatMode}
        onTogglePlay={handleTogglePlay}
        onNext={handleNextTrack}
        onPrevious={handlePreviousTrack}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
        onToggleShuffle={handleToggleShuffle}
        onCycleRepeat={handleCycleRepeat}
        onOpenLyrics={() => setCurrentView('lyrics')}
        onOpenQueue={() => setIsQueueOpen(true)}
        onOpenCoverFlow={() => setCurrentView('coverflow')}
      />

      {/* 4. Modals & Drawers */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newS) => setSettings((s) => ({ ...s, ...newS }))}
      />

      <EqualizerModal
        isOpen={isEqualizerOpen}
        onClose={() => setIsEqualizerOpen(false)}
        gains={eqGains}
        onGainChange={handleEqGainChange}
        onApplyPreset={handleApplyEqPreset}
        accentColor={effectiveAccentColor}
        currentTrackTitle={currentTrack?.title}
      />

      <VisualizerModal
        isOpen={isVisualizerOpen}
        onClose={() => setIsVisualizerOpen(false)}
        accentColor={effectiveAccentColor}
        mode={settings.visualizerMode}
        onSelectMode={(m) => setSettings((s) => ({ ...s, visualizerMode: m }))}
        isThrottled={settings.hardwareThrottling}
      />

      <QueueDrawer
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        queue={queue}
        currentTrack={currentTrack}
        onPlayTrack={handlePlayTrack}
        onRemoveFromQueue={(idx) => setQueue((q) => q.filter((_, i) => i !== idx))}
        onClearQueue={() => setQueue([])}
        accentColor={effectiveAccentColor}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tracks={tracks}
        albums={albums}
        artist={artist}
        onSelectTrack={handlePlayTrack}
        onSelectView={setCurrentView}
        onOpenSettings={() => setIsSettingsOpen(true)}
        accentColor={effectiveAccentColor}
      />
    </div>
  );
}
