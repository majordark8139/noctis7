import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  MessageSquare,
  ListMusic,
  MoreHorizontal,
  Shuffle,
  Repeat,
  Sparkles,
} from 'lucide-react';
import { Track } from '../types';

interface PlayerBarProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  accentColor: string;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
  onOpenLyrics: () => void;
  onOpenQueue: () => void;
  onOpenCoverFlow: () => void;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  accentColor,
  isShuffle,
  repeatMode,
  onTogglePlay,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onCycleRepeat,
  onOpenLyrics,
  onOpenQueue,
  onOpenCoverFlow,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = React.useState(false);

  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    if (!isFinite(secs) || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 select-none">
      <div className="flex items-center gap-3 bg-[#16181d]/90 backdrop-blur-2xl border border-white/10 rounded-full px-4 py-2 shadow-2xl text-neutral-200 transition-all hover:border-white/20">
        {/* Left: Transport Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleShuffle}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
              isShuffle ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
            style={isShuffle ? { color: accentColor || '#e11d48' } : undefined}
            title={isShuffle ? 'Shuffle On' : 'Shuffle Off'}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onPrevious}
            className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Previous Track"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform active:scale-95 shadow-md"
            style={{ backgroundColor: accentColor || '#e11d48' }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={onNext}
            className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Next Track"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={onCycleRepeat}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
              repeatMode !== 'off' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
            style={repeatMode !== 'off' ? { color: accentColor || '#e11d48' } : undefined}
            title={`Repeat: ${repeatMode}`}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Album Artwork & Track Info (Click to open Lyrics / Now Playing) */}
        <div
          onClick={onOpenLyrics}
          className="flex items-center gap-2.5 px-2 py-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer group max-w-xs"
          title="Click to view Apple Music synced lyrics"
        >
          <div className="w-8 h-8 rounded-md overflow-hidden bg-neutral-800 shrink-0 shadow-sm border border-white/10">
            {currentTrack.coverArt ? (
              <img
                src={currentTrack.coverArt}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">
                ♫
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-xs font-semibold text-neutral-100 truncate group-hover:text-white transition-colors">
              {currentTrack.title}
            </span>
            <span className="text-[11px] text-neutral-400 truncate group-hover:text-neutral-300">
              {currentTrack.artist}
            </span>
          </div>
        </div>

        {/* Mini Scrubber in Floating Bar */}
        <div className="hidden md:flex items-center gap-2 text-[10px] text-neutral-400 font-mono tabular-nums w-40">
          <span>{formatTime(currentTime)}</span>
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              onSeek(pos * duration);
            }}
            className="flex-1 h-1.5 bg-neutral-700/80 rounded-full cursor-pointer relative overflow-hidden group/bar"
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: accentColor || '#e11d48',
              }}
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 border-l border-white/10 pl-2">
          <button
            onClick={onOpenCoverFlow}
            className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Cover Flow 3D"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenLyrics}
            className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Lyrics (Apple Music Style)"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenQueue}
            className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Play Queue"
          >
            <ListMusic className="w-3.5 h-3.5" />
          </button>

          {/* Volume with expand popover */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              onClick={onToggleMute}
              className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>

            {showVolumeSlider && (
              <div className="absolute bottom-9 right-0 bg-[#1e2026] p-2 rounded-xl shadow-xl border border-white/10 flex items-center gap-2 w-28">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer h-1 bg-neutral-700 rounded"
                />
                <span className="text-[10px] font-mono text-neutral-300 tabular-nums">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
