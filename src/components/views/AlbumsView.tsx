import React from 'react';
import { Play, Disc } from 'lucide-react';
import { Album } from '../../types';

interface AlbumsViewProps {
  albums: Album[];
  accentColor: string;
  onSelectAlbum: (album: Album) => void;
  onPlayAlbum: (album: Album) => void;
}

export const AlbumsView: React.FC<AlbumsViewProps> = ({
  albums,
  accentColor,
  onSelectAlbum,
  onPlayAlbum,
}) => {
  const [filterType, setFilterType] = React.useState<'all' | 'album' | 'single' | 'ep'>('all');

  const filteredAlbums =
    filterType === 'all' ? albums : albums.filter((a) => a.type === filterType);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 text-neutral-200 select-none pb-28">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Disc className="w-6 h-6" style={{ color: accentColor || '#e11d48' }} />
            Albums & Releases
          </h1>
          <span className="text-xs text-neutral-400 mt-0.5 block">
            {albums.length} releases in your library
          </span>
        </div>

        {/* Filter split into Albums, Singles and EPs */}
        <div className="flex items-center gap-1 bg-neutral-900/60 p-1 rounded-xl border border-white/[0.06] text-xs">
          {(
            [
              { id: 'all', label: 'All Releases' },
              { id: 'album', label: 'Albums' },
              { id: 'single', label: 'Singles' },
              { id: 'ep', label: 'EPs' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterType === tab.id
                  ? 'text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              style={
                filterType === tab.id
                  ? { backgroundColor: accentColor || '#e11d48' }
                  : undefined
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredAlbums.map((album) => (
          <div
            key={album.id}
            onClick={() => onSelectAlbum(album)}
            className="group bg-neutral-900/40 p-3.5 rounded-2xl border border-white/[0.04] hover:border-white/10 hover:bg-neutral-900/80 transition-all cursor-pointer flex flex-col"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-800 mb-3 shadow-md">
              <img
                src={album.coverArt}
                alt={album.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayAlbum(album);
                }}
                className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
                style={{ backgroundColor: accentColor || '#e11d48' }}
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
            </div>
            <span className="text-sm font-bold text-white truncate">{album.title}</span>
            <span className="text-xs text-neutral-400 mt-0.5 truncate">{album.artist}</span>
            <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2 pt-2 border-t border-white/[0.04]">
              <span>{album.year}</span>
              <span className="capitalize">{album.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
