import React from 'react';
import { Search, Music, Disc, User, Settings, ArrowRight } from 'lucide-react';
import { Track, Album, Artist, ViewMode } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: Track[];
  albums: Album[];
  artist: Artist;
  onSelectTrack: (track: Track) => void;
  onSelectView: (view: ViewMode) => void;
  onOpenSettings: () => void;
  accentColor: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  tracks,
  albums,
  artist,
  onSelectTrack,
  onSelectView,
  onOpenSettings,
  accentColor,
}) => {
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredTracks = tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.artist.toLowerCase().includes(query.toLowerCase()) ||
      t.album.toLowerCase().includes(query.toLowerCase())
  );

  const filteredAlbums = albums.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.artist.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#16181d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-neutral-200"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-white/[0.06]">
          <Search className="w-4 h-4 text-neutral-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, albums, artists, or navigation commands..."
            className="w-full bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none"
          />
          <kbd className="text-[10px] text-neutral-500 bg-neutral-800 px-1.5 py-0.5 rounded border border-white/5">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3 text-xs">
          {/* Quick Navigation Commands */}
          {!query && (
            <div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-3 block mb-1">
                Navigation
              </span>
              <div className="space-y-0.5">
                {[
                  { label: 'Songs Library', view: 'songs' as ViewMode, icon: Music },
                  { label: 'Artist Overview (Bruno Mars)', view: 'artist_detail' as ViewMode, icon: User },
                  { label: 'Albums Grid', view: 'albums' as ViewMode, icon: Disc },
                  { label: 'Cover Flow 3D', view: 'coverflow' as ViewMode, icon: ArrowRight },
                  { label: 'Lyrics (Apple Music Style)', view: 'lyrics' as ViewMode, icon: ArrowRight },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        onSelectView(item.view);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.06] text-neutral-300 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-neutral-400" />
                        <span>{item.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                    </button>
                  );
                })}
                <button
                  onClick={() => {
                    onOpenSettings();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.06] text-neutral-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-4 h-4 text-neutral-400" />
                    <span>Open Settings & Appearance</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                </button>
              </div>
            </div>
          )}

          {/* Tracks Matching */}
          {filteredTracks.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-3 block mb-1">
                Songs ({filteredTracks.length})
              </span>
              <div className="space-y-0.5">
                {filteredTracks.slice(0, 6).map((track) => (
                  <button
                    key={track.id}
                    onClick={() => {
                      onSelectTrack(track);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-white/[0.06] text-neutral-300 hover:text-white transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded bg-neutral-800 overflow-hidden shrink-0">
                        <img src={track.coverArt} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold truncate text-white">{track.title}</span>
                        <span className="text-[10px] text-neutral-400 truncate">{track.artist}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {track.format} {track.hiRes ? '24/96' : ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Albums Matching */}
          {filteredAlbums.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-3 block mb-1">
                Albums ({filteredAlbums.length})
              </span>
              <div className="space-y-0.5">
                {filteredAlbums.map((album) => (
                  <button
                    key={album.id}
                    onClick={() => {
                      if (album.tracks[0]) onSelectTrack(album.tracks[0]);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-white/[0.06] text-neutral-300 hover:text-white transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded bg-neutral-800 overflow-hidden shrink-0">
                        <img src={album.coverArt} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold truncate text-white">{album.title}</span>
                        <span className="text-[10px] text-neutral-400 truncate">{album.artist}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-neutral-500">{album.year}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
