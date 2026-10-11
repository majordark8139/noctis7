import React from 'react';
import {
  Play,
  Shuffle,
  Star,
  MoreHorizontal,
  Heart,
  Globe,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { Artist, Track, Album } from '../../types';

interface ArtistViewProps {
  artist: Artist;
  currentTrack: Track | null;
  isPlaying: boolean;
  accentColor: string;
  onPlayTrack: (track: Track) => void;
  onPlayAlbum: (album: Album) => void;
  onToggleFavoriteTrack: (trackId: string) => void;
  onSelectAlbum: (album: Album) => void;
}

export const ArtistView: React.FC<ArtistViewProps> = ({
  artist,
  currentTrack,
  isPlaying,
  accentColor,
  onPlayTrack,
  onPlayAlbum,
  onToggleFavoriteTrack,
  onSelectAlbum,
}) => {
  const [activeSubTab, setActiveSubTab] = React.useState<
    'Overview' | 'Albums' | 'Singles & EPs' | 'Songs' | 'Similar Artists'
  >('Overview');
  const [isBioExpanded, setIsBioExpanded] = React.useState(false);
  const [isStarred, setIsStarred] = React.useState(true);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex-1 overflow-y-auto text-neutral-200 select-none pb-28">
      {/* 1. Artist Hero Banner (Matching Screenshot 1) */}
      <div className="relative w-full min-h-[300px] flex items-end px-8 pt-8 pb-6 overflow-hidden">
        {/* Background Artist Photo with smooth vignette fade */}
        <div className="absolute inset-0 z-0">
          <img
            src={artist.photoUrl}
            alt={artist.name}
            className="w-full h-full object-cover object-right-top opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0e11] via-[#0d0e11]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e11] via-transparent to-transparent" />
        </div>

        {/* Hero Content Left */}
        <div className="relative z-10 flex flex-col max-w-xl">
          <span className="text-xs font-semibold text-neutral-400 tracking-wider uppercase mb-1">
            {artist.genre}
          </span>
          <h1 className="text-5xl font-black tracking-tight text-white mb-2 drop-shadow-md">
            {artist.name}
          </h1>
          <span className="text-xs text-neutral-300 font-medium mb-5">
            {artist.fansCount}
          </span>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => artist.topSongs[0] && onPlayTrack(artist.topSongs[0])}
              className="px-6 py-2 rounded-full text-white font-semibold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              style={{ backgroundColor: accentColor || '#e11d48' }}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Play
            </button>

            <button
              onClick={() => {
                const randomTrack =
                  artist.topSongs[Math.floor(Math.random() * artist.topSongs.length)];
                if (randomTrack) onPlayTrack(randomTrack);
              }}
              className="px-5 py-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700/80 border border-white/10 text-white font-semibold text-xs flex items-center gap-2 transition-all active:scale-95"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Shuffle
            </button>

            <button
              onClick={() => setIsStarred(!isStarred)}
              className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-colors ${
                isStarred
                  ? 'text-amber-400 bg-amber-400/10'
                  : 'text-neutral-400 hover:text-white bg-neutral-800/80'
              }`}
              title="Add to Favorites"
            >
              <Star className={`w-4 h-4 ${isStarred ? 'fill-current' : ''}`} />
            </button>

            <button
              className="w-8 h-8 rounded-full border border-white/10 bg-neutral-800/80 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
              title="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex items-center gap-6 px-8 border-b border-white/[0.06] text-xs font-semibold text-neutral-400 mb-6">
        {(['Overview', 'Albums', 'Singles & EPs', 'Songs', 'Similar Artists'] as const).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`py-3 transition-colors relative ${
                activeSubTab === tab ? 'text-white' : 'hover:text-neutral-200'
              }`}
            >
              {tab}
              {activeSubTab === tab && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: accentColor || '#e11d48' }}
                />
              )}
            </button>
          )
        )}
      </div>

      {/* 3. Main Content Columns (Top Songs, Latest Release, About Artist) */}
      <div className="px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Left Column: Top Songs (cols 1-6) */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-neutral-100">Top Songs</h2>
            <button
              onClick={() => setActiveSubTab('Songs')}
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              See all
            </button>
          </div>

          <div className="flex flex-col space-y-1">
            {artist.topSongs.map((track, index) => {
              const isCurrent = currentTrack?.id === track.id;

              return (
                <div
                  key={track.id}
                  onDoubleClick={() => onPlayTrack(track)}
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-white/[0.08] text-white'
                      : 'hover:bg-white/[0.04] text-neutral-300'
                  }`}
                >
                  {/* Left: Index + Cover Art + Title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-4 text-xs font-bold text-neutral-500 text-center font-mono tabular-nums">
                      {isCurrent && isPlaying ? (
                        <span style={{ color: accentColor || '#e11d48' }}>▶</span>
                      ) : (
                        index + 1
                      )}
                    </span>

                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-800 shrink-0 shadow-sm border border-white/5">
                      {track.coverArt ? (
                        <img
                          src={track.coverArt}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500">
                          ♫
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlayTrack(track);
                        }}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                      >
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </button>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold truncate ${
                            isCurrent ? 'text-white font-bold' : 'text-neutral-200'
                          }`}
                        >
                          {track.title}
                        </span>
                        {track.title === '777' && (
                          <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-neutral-700 text-neutral-300">
                            E
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-500">{track.year || 2026}</span>
                    </div>
                  </div>

                  {/* Right: Heart + Duration + More */}
                  <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono tabular-nums">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavoriteTrack(track.id);
                      }}
                      className="text-neutral-500 hover:text-rose-500 transition-colors"
                      title={track.isFavorite ? 'Unlike' : 'Like'}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          track.isFavorite ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                    <span>{formatDuration(track.duration)}</span>
                    <button className="text-neutral-500 hover:text-neutral-200 transition-colors">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats Bar Strip (Screenshot 1) */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-neutral-900/60 rounded-xl border border-white/[0.05] text-center">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-100 font-mono tabular-nums">
                {artist.stats.releases}
              </span>
              <span className="text-[10px] text-neutral-500">Releases</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-100 font-mono tabular-nums">
                {artist.stats.songs}
              </span>
              <span className="text-[10px] text-neutral-500">Songs</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-100 font-mono tabular-nums">
                {artist.stats.totalLength}
              </span>
              <span className="text-[10px] text-neutral-500">Total length</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-100 truncate">
                {artist.stats.mostPlayed}
              </span>
              <span className="text-[10px] text-neutral-500">Most played</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-100 truncate">
                {artist.stats.inLibrarySince}
              </span>
              <span className="text-[10px] text-neutral-500">In library since</span>
            </div>
          </div>
        </div>

        {/* Middle Column: Latest Release Card (cols 7-9) */}
        <div className="lg:col-span-3 flex flex-col">
          <h2 className="text-base font-bold text-neutral-100 mb-3">Latest Release</h2>
          {artist.latestRelease && (
            <div className="bg-neutral-900/60 p-4 rounded-2xl border border-white/[0.06] flex flex-col items-start gap-3">
              <div className="w-full aspect-square rounded-xl overflow-hidden shadow-md bg-neutral-800">
                <img
                  src={artist.latestRelease.coverArt}
                  alt={artist.latestRelease.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-neutral-400">
                  {artist.latestRelease.date}
                </span>
                <span className="text-sm font-bold text-white mt-0.5">
                  {artist.latestRelease.title}
                </span>
                <span className="text-xs text-neutral-400 mt-0.5">
                  {artist.latestRelease.type} · {artist.latestRelease.songCount} song ·{' '}
                  {artist.latestRelease.duration}
                </span>
              </div>
              <button
                onClick={() => onPlayTrack(artist.latestRelease!.track)}
                className="mt-1 px-4 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3 h-3 fill-current" />
                Play
              </button>
            </div>
          )}
        </div>

        {/* Right Column: About Artist Card (cols 10-12) */}
        <div className="lg:col-span-3 flex flex-col">
          <h2 className="text-base font-bold text-neutral-100 mb-3">About {artist.name}</h2>
          <div className="bg-neutral-900/60 p-4 rounded-2xl border border-white/[0.06] flex flex-col text-xs text-neutral-300">
            <p className="line-clamp-4 leading-relaxed mb-2 text-neutral-300">
              {artist.bio}
            </p>
            <button
              onClick={() => alert(artist.bio)}
              className="text-rose-400 hover:text-rose-300 text-left font-medium mb-4"
            >
              Read more
            </button>

            <div className="space-y-2 border-t border-white/[0.06] pt-3 text-[11px]">
              <div>
                <span className="text-neutral-500 block uppercase tracking-wider text-[10px]">
                  FROM
                </span>
                <span className="text-neutral-200 font-medium">{artist.origin}</span>
              </div>
              <div>
                <span className="text-neutral-500 block uppercase tracking-wider text-[10px]">
                  BORN
                </span>
                <span className="text-neutral-200 font-medium">{artist.born}</span>
              </div>
              <div>
                <span className="text-neutral-500 block uppercase tracking-wider text-[10px]">
                  GENRE
                </span>
                <span className="text-neutral-200 font-medium">
                  {artist.genres.join(' · ')}
                </span>
              </div>
            </div>

            {/* Social / Streaming Links */}
            <div className="mt-4 pt-3 border-t border-white/[0.06]">
              <span className="text-neutral-500 block uppercase tracking-wider text-[10px] mb-2">
                Links
              </span>
              <div className="flex items-center gap-2 text-neutral-400">
                <a
                  href={artist.socialLinks.spotify}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center hover:text-white transition-colors"
                  title="Spotify"
                >
                  <Globe className="w-3.5 h-3.5" />
                </a>
                <a
                  href={artist.socialLinks.appleMusic}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center hover:text-white transition-colors"
                  title="Apple Music"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href={artist.socialLinks.web}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center hover:text-white transition-colors"
                  title="Official Website"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Albums Shelf */}
      <div className="px-8 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-neutral-100">Albums</h2>
          <button
            onClick={() => setActiveSubTab('Albums')}
            className="text-xs text-neutral-400 hover:text-white transition-colors"
          >
            See all
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {artist.albums.map((album) => (
            <div
              key={album.id}
              onClick={() => onSelectAlbum(album)}
              className="group bg-neutral-900/40 p-3 rounded-2xl border border-white/[0.04] hover:border-white/10 hover:bg-neutral-900/80 transition-all cursor-pointer flex flex-col"
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
                  className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
                  style={{ backgroundColor: accentColor || '#e11d48' }}
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
              <span className="text-xs font-bold text-white truncate">{album.title}</span>
              <span className="text-[11px] text-neutral-400 mt-0.5">{album.year}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
