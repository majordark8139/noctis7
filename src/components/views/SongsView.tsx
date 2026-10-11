import React from 'react';
import {
  Play,
  Heart,
  Upload,
  FolderPlus,
  ArrowUpDown,
  Music2,
  MoreHorizontal,
} from 'lucide-react';
import { Track } from '../../types';

interface SongsViewProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  accentColor: string;
  onPlayTrack: (track: Track) => void;
  onToggleFavorite: (trackId: string) => void;
  onImportFiles: (files: FileList | File[]) => void;
}

export const SongsView: React.FC<SongsViewProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  accentColor,
  onPlayTrack,
  onToggleFavorite,
  onImportFiles,
}) => {
  const [sortField, setSortField] = React.useState<'title' | 'artist' | 'album' | 'duration'>('title');
  const [sortAsc, setSortAsc] = React.useState(true);
  const [isDragging, setIsDragging] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const folderInputRef = React.useRef<HTMLInputElement | null>(null);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const sortedTracks = [...tracks].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'title') cmp = a.title.localeCompare(b.title);
    else if (sortField === 'artist') cmp = a.artist.localeCompare(b.artist);
    else if (sortField === 'album') cmp = a.album.localeCompare(b.album);
    else if (sortField === 'duration') cmp = a.duration - b.duration;
    return sortAsc ? cmp : -cmp;
  });

  const handleSort = (field: 'title' | 'artist' | 'album' | 'duration') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImportFiles(e.dataTransfer.files);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`flex-1 overflow-y-auto px-8 py-6 text-neutral-200 select-none pb-28 relative ${
        isDragging ? 'bg-rose-950/20' : ''
      }`}
    >
      {/* Dropzone overlay */}
      {isDragging && (
        <div className="absolute inset-4 z-40 border-2 border-dashed border-rose-500 rounded-2xl bg-black/80 flex flex-col items-center justify-center pointer-events-none">
          <Upload className="w-12 h-12 text-rose-500 mb-3 animate-bounce" />
          <span className="text-lg font-bold text-white">Drop music files or folders here</span>
          <span className="text-xs text-neutral-400 mt-1">
            FLAC, ALAC, WAV, AIFF, APE, MP3, AAC, OGG, Opus, M4A & companion .LRC files
          </span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Music2 className="w-6 h-6" style={{ color: accentColor || '#e11d48' }} />
            Songs Library
          </h1>
          <span className="text-xs text-neutral-400 mt-0.5 block">
            {tracks.length} tracks · Lossless bit-perfect decoding
          </span>
        </div>

        {/* Import Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors border border-white/5"
          >
            <Upload className="w-3.5 h-3.5" />
            Add Files
          </button>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="audio/*,.flac,.wav,.alac,.aiff,.ape,.mp3,.aac,.ogg,.opus,.m4a,.lrc"
            onChange={(e) => e.target.files && onImportFiles(e.target.files)}
            className="hidden"
          />

          <button
            onClick={() => folderInputRef.current?.click()}
            className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors border border-white/5"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            Add Folder
          </button>
          <input
            type="file"
            ref={folderInputRef}
            // @ts-expect-error webkitdirectory standard on modern and legacy browsers
            webkitdirectory=""
            directory=""
            multiple
            onChange={(e) => e.target.files && onImportFiles(e.target.files)}
            className="hidden"
          />
        </div>
      </div>

      {/* High-Density Songs Table */}
      <div className="w-full bg-neutral-900/40 rounded-2xl border border-white/[0.06] overflow-hidden">
        {/* Table Column Header */}
        <div className="grid grid-cols-12 gap-3 px-4 py-2.5 text-[11px] font-bold text-neutral-500 uppercase tracking-wider border-b border-white/[0.06] bg-neutral-950/40">
          <div className="col-span-1 text-center">#</div>
          <div
            onClick={() => handleSort('title')}
            className="col-span-4 flex items-center gap-1 cursor-pointer hover:text-white"
          >
            Title <ArrowUpDown className="w-3 h-3" />
          </div>
          <div
            onClick={() => handleSort('artist')}
            className="col-span-3 flex items-center gap-1 cursor-pointer hover:text-white"
          >
            Artist <ArrowUpDown className="w-3 h-3" />
          </div>
          <div
            onClick={() => handleSort('album')}
            className="col-span-2 hidden md:flex items-center gap-1 cursor-pointer hover:text-white"
          >
            Album <ArrowUpDown className="w-3 h-3" />
          </div>
          <div className="col-span-1 hidden lg:block text-center">Format</div>
          <div
            onClick={() => handleSort('duration')}
            className="col-span-1 flex items-center justify-end gap-1 cursor-pointer hover:text-white text-right"
          >
            Time <ArrowUpDown className="w-3 h-3" />
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/[0.03]">
          {sortedTracks.map((track, idx) => {
            const isCurrent = currentTrack?.id === track.id;

            return (
              <div
                key={track.id}
                onDoubleClick={() => onPlayTrack(track)}
                className={`group grid grid-cols-12 gap-3 px-4 py-2.5 items-center text-xs transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-white/[0.08] text-white font-medium'
                    : 'hover:bg-white/[0.04] text-neutral-300'
                }`}
              >
                {/* Column: # / Play indicator */}
                <div className="col-span-1 text-center font-mono tabular-nums text-neutral-500">
                  {isCurrent && isPlaying ? (
                    <span style={{ color: accentColor || '#e11d48' }}>▶</span>
                  ) : (
                    <span className="group-hover:hidden">{idx + 1}</span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayTrack(track);
                    }}
                    className="hidden group-hover:inline-block text-white hover:scale-110"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>

                {/* Column: Title + Cover */}
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-md bg-neutral-800 overflow-hidden shrink-0 border border-white/5">
                    <img src={track.coverArt} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span
                      className={`truncate font-semibold ${
                        isCurrent ? 'text-white' : 'text-neutral-200'
                      }`}
                    >
                      {track.title}
                    </span>
                    {track.syncedLyrics && (
                      <span className="text-[9px] text-neutral-500 uppercase tracking-wider">
                        Lyrics
                      </span>
                    )}
                  </div>
                </div>

                {/* Column: Artist */}
                <div className="col-span-3 truncate text-neutral-300">{track.artist}</div>

                {/* Column: Album */}
                <div className="col-span-2 hidden md:block truncate text-neutral-400">
                  {track.album}
                </div>

                {/* Column: Format & Hi-Res Badge */}
                <div className="col-span-1 hidden lg:flex items-center justify-center">
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      track.hiRes
                        ? 'bg-rose-500/20 text-rose-400 font-bold'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {track.format} {track.hiRes ? '24/96' : ''}
                  </span>
                </div>

                {/* Column: Duration & Like */}
                <div className="col-span-1 flex items-center justify-end gap-2 text-neutral-400 font-mono tabular-nums">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(track.id);
                    }}
                    className="hover:text-rose-500 text-neutral-500 transition-colors"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        track.isFavorite ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                  </button>
                  <span>{formatDuration(track.duration)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
