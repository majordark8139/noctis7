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
  Upload,
  Edit3,
  Download,
  Check,
} from 'lucide-react';
import { Track } from '../../types';
import { TagParser } from '../../services/tagParser';

interface LyricsViewProps {
  currentTrack: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  accentColor: string;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onOpenQueue: () => void;
  onUpdateLyrics: (trackId: string, lrcText: string) => void;
}

export const LyricsView: React.FC<LyricsViewProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  accentColor,
  onTogglePlay,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onOpenQueue,
  onUpdateLyrics,
}) => {
  const activeLineRef = React.useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editLrcText, setEditLrcText] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const lyrics = currentTrack.lyrics || [];

  // Determine active lyric line index based on currentTime
  const activeIndex = React.useMemo(() => {
    if (!lyrics || lyrics.length === 0) return -1;
    let idx = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        idx = i;
      } else {
        break;
      }
    }
    return idx;
  }, [lyrics, currentTime]);

  // Smooth scroll active line to center
  React.useEffect(() => {
    if (activeLineRef.current && scrollContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  const formatTime = (secs: number) => {
    if (!isFinite(secs) || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleImportLrcFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          onUpdateLyrics(currentTrack.id, text);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExportLrc = () => {
    if (!lyrics || lyrics.length === 0) return;
    const lrcLines = lyrics.map((l) => {
      const m = Math.floor(l.time / 60);
      const s = Math.floor(l.time % 60);
      const ms = Math.floor((l.time % 1) * 100);
      return `[${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}.${ms < 10 ? '0' : ''}${ms}] ${l.text}`;
    });
    const blob = new Blob([lrcLines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTrack.artist} - ${currentTrack.title}.lrc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveEdit = () => {
    onUpdateLyrics(currentTrack.id, editLrcText);
    setIsEditing(false);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative flex-1 h-full w-full overflow-hidden select-none flex">
      {/* Dynamic Ambient Blurred Backdrop tinted with album colors */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full blur-[140px] opacity-25"
          style={{ backgroundColor: accentColor || '#e11d48' }}
        />
        <div className="absolute top-1/3 right-1/4 w-2/3 h-2/3 rounded-full blur-[160px] opacity-15 bg-blue-600" />
        <div className="absolute inset-0 bg-[#0d0e11]/90 backdrop-blur-2xl" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center px-8 lg:px-14 py-8 gap-10">
        {/* Left Column: Cover Art, Metadata, Scrubber, Transport Mini-Dock (Screenshot 2) */}
        <div className="w-full md:w-[420px] shrink-0 flex flex-col items-center md:items-start">
          {/* Giant Square Album Artwork with rounded corners */}
          <div className="w-64 sm:w-80 md:w-full aspect-square rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 border border-white/10 mb-6">
            {currentTrack.coverArt ? (
              <img
                src={currentTrack.coverArt}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-neutral-600">
                ♫
              </div>
            )}
          </div>

          {/* Track Metadata */}
          <div className="w-full flex flex-col items-center md:items-start text-center md:text-left mb-4">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight truncate max-w-full">
              {currentTrack.title}
            </h1>
            <span
              className="text-base font-semibold mt-1 truncate max-w-full"
              style={{ color: accentColor || '#e11d48' }}
            >
              {currentTrack.artist}
            </span>
            <span className="text-xs text-neutral-400 mt-0.5 truncate max-w-full">
              {currentTrack.album}
            </span>

            {/* Format & Hi-Res Badge */}
            <div className="flex items-center gap-2 mt-2 text-[11px] text-neutral-400 font-medium">
              <span>{currentTrack.genre || 'Pop'}</span>
              <span>·</span>
              <span>{currentTrack.year || 2026}</span>
              <span>·</span>
              <span>{currentTrack.trackNumber ? `${currentTrack.trackNumber} tracks` : 'Lossless'}</span>
              <span>·</span>
              <span className="flex items-center gap-1 font-semibold text-neutral-300">
                <span className="text-rose-500">∿</span> Hi-Res Lossless
              </span>
            </div>
          </div>

          {/* Scrubber Slider */}
          <div className="w-full mb-4">
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                onSeek(pos * duration);
              }}
              className="w-full h-1.5 bg-neutral-800 rounded-full cursor-pointer relative overflow-hidden group"
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: accentColor || '#e11d48',
                }}
              />
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 tabular-nums mt-1.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Floating Mini Controls Pill (Screenshot 2) */}
          <div className="flex items-center gap-2 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-full px-4 py-1.5 shadow-xl">
            <button
              onClick={onPrevious}
              className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
              title="Previous"
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
              className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
              title="Next"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>

            <div className="w-[1px] h-4 bg-white/10 mx-1" />

            <button
              className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
              title="More"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            <button
              className="w-7 h-7 rounded-full flex items-center justify-center text-white"
              style={{ color: accentColor || '#e11d48' }}
              title="Lyrics Active"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
            </button>

            <button
              onClick={onOpenQueue}
              className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
              title="Queue"
            >
              <ListMusic className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onToggleMute}
              className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
              title="Mute"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Quick Lyrics Import/Export Tool strip */}
          <div className="flex items-center gap-2 mt-4 text-[11px] text-neutral-400">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 hover:text-white transition-colors px-2.5 py-1 rounded bg-white/5 border border-white/5"
              title="Import .lrc file"
            >
              <Upload className="w-3 h-3" /> Import .LRC
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".lrc,.txt,.ttml"
              onChange={handleImportLrcFile}
              className="hidden"
            />

            <button
              onClick={handleExportLrc}
              className="flex items-center gap-1 hover:text-white transition-colors px-2.5 py-1 rounded bg-white/5 border border-white/5"
              title="Export .lrc file"
            >
              <Download className="w-3 h-3" /> Export .LRC
            </button>

            <button
              onClick={() => {
                setEditLrcText(
                  lyrics
                    .map((l) => `[${formatTime(l.time)}] ${l.text}`)
                    .join('\n')
                );
                setIsEditing(!isEditing);
              }}
              className="flex items-center gap-1 hover:text-white transition-colors px-2.5 py-1 rounded bg-white/5 border border-white/5"
            >
              <Edit3 className="w-3 h-3" /> {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Right Column: Apple Music Style Word-by-Word Synced Karaoke Lyrics (Screenshot 2) */}
        <div
          ref={scrollContainerRef}
          className="flex-1 h-full overflow-y-auto px-4 lg:px-8 py-12 flex flex-col space-y-6 scroll-smooth"
        >
          {isEditing ? (
            <div className="flex-1 flex flex-col gap-3">
              <span className="text-xs font-semibold text-neutral-300">
                Edit LRC Lyrics for {currentTrack.title}
              </span>
              <textarea
                value={editLrcText}
                onChange={(e) => setEditLrcText(e.target.value)}
                className="w-full flex-1 min-h-[350px] bg-neutral-900 border border-white/10 rounded-xl p-4 text-xs font-mono text-neutral-200 focus:outline-none focus:border-rose-500"
                placeholder="[00:14.20] Lyric line..."
              />
              <button
                onClick={handleSaveEdit}
                className="self-start px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold text-xs flex items-center gap-2"
                style={{ backgroundColor: accentColor || '#e11d48' }}
              >
                <Check className="w-4 h-4" /> Save Lyrics
              </button>
            </div>
          ) : lyrics.length > 0 ? (
            lyrics.map((line, idx) => {
              const isActive = idx === activeIndex;
              const isPast = idx < activeIndex;

              return (
                <div
                  key={idx}
                  ref={isActive ? activeLineRef : null}
                  onClick={() => onSeek(line.time)}
                  className={`transition-all duration-300 cursor-pointer py-1 ${
                    isActive
                      ? 'scale-100 opacity-100 font-extrabold text-white text-2xl lg:text-3xl'
                      : 'opacity-40 hover:opacity-80 text-xl lg:text-2xl font-bold text-neutral-300 blur-[0.6px]'
                  }`}
                >
                  {/* Word-by-word karaoke highlight if word timestamps exist */}
                  {isActive && line.words && line.words.length > 0 ? (
                    <div className="flex flex-wrap gap-x-2 gap-y-1">
                      {line.words.map((w, wIdx) => {
                        const isWordSung = currentTime >= w.start;
                        const isWordActive =
                          currentTime >= w.start && currentTime <= w.end;

                        return (
                          <span
                            key={wIdx}
                            className={`transition-all duration-150 ${
                              isWordActive
                                ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] scale-105 inline-block'
                                : isWordSung
                                ? 'text-white'
                                : 'text-neutral-400/80'
                            }`}
                          >
                            {w.word}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <span>{line.text}</span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-neutral-400">
              <span className="text-lg font-semibold text-neutral-300 mb-2">
                No embedded lyrics found
              </span>
              <p className="text-xs text-neutral-500 max-w-sm mb-4">
                Click &quot;Import .LRC&quot; to load companion lyrics or drop a .lrc file named
                &quot;{currentTrack.title}.lrc&quot;.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-full bg-neutral-800 text-white text-xs font-semibold"
              >
                Upload .LRC
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
