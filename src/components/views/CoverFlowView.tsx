import React from 'react';
import { LayoutGrid, Layers, GalleryHorizontalEnd, ArrowUpDown } from 'lucide-react';
import { Album, CoverFlowLayout, Track } from '../../types';

interface CoverFlowViewProps {
  albums: Album[];
  currentTrack: Track | null;
  accentColor: string;
  layout: CoverFlowLayout;
  onSelectLayout: (layout: CoverFlowLayout) => void;
  onPlayTrack: (track: Track) => void;
  onSelectAlbum: (album: Album) => void;
}

export const CoverFlowView: React.FC<CoverFlowViewProps> = ({
  albums,
  currentTrack,
  accentColor,
  layout,
  onSelectLayout,
  onPlayTrack,
  onSelectAlbum,
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // Sync selected index with currentTrack album
  React.useEffect(() => {
    if (currentTrack) {
      const idx = albums.findIndex((a) => a.title === currentTrack.album);
      if (idx !== -1) {
        setSelectedIndex(idx);
      }
    }
  }, [currentTrack, albums]);

  const activeAlbum = albums[selectedIndex] || albums[0];
  const nextTrack = activeAlbum?.tracks[1] || albums[(selectedIndex + 1) % albums.length]?.tracks[0];

  return (
    <div className="relative flex-1 h-full w-full overflow-hidden select-none flex flex-col">
      {/* Dynamic Ambient Blurred Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-20 filter blur-[120px] bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: `url(${activeAlbum?.coverArt})` }}
        />
        <div className="absolute inset-0 bg-[#0d0e11]/85 backdrop-blur-3xl" />
      </div>

      {/* Top Controls Bar (Sort, Layout Switchers) */}
      <div className="relative z-20 flex items-center justify-end gap-2 px-8 py-4">
        <button
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors border border-white/5"
          title="Sort Albums"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onSelectLayout('collage')}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border border-white/5 ${
            layout === 'collage'
              ? 'text-white'
              : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'
          }`}
          style={layout === 'collage' ? { backgroundColor: accentColor || '#e11d48' } : undefined}
          title="Collage Layout (Screenshot 3)"
        >
          <Layers className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onSelectLayout('carousel')}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border border-white/5 ${
            layout === 'carousel'
              ? 'text-white'
              : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'
          }`}
          style={layout === 'carousel' ? { backgroundColor: accentColor || '#e11d48' } : undefined}
          title="Carousel Layout"
        >
          <GalleryHorizontalEnd className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onSelectLayout('cascade')}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border border-white/5 ${
            layout === 'cascade'
              ? 'text-white'
              : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'
          }`}
          style={layout === 'cascade' ? { backgroundColor: accentColor || '#e11d48' } : undefined}
          title="Cascade Layout"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main 3D Cover Flow Stage */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center px-8 lg:px-16 gap-12">
        {/* 3D Perspective Area */}
        <div className="relative w-72 sm:w-96 md:w-[480px] h-[360px] md:h-[440px] flex items-center justify-center [perspective:1200px]">
          {albums.map((album, idx) => {
            const isCenter = idx === selectedIndex;
            const offset = idx - selectedIndex;

            // Different layout transforms
            let transformStyle = '';
            let zIndex = 10 - Math.abs(offset);
            let opacity = 1;

            if (layout === 'collage') {
              // Floating tilted multi-angle cards matching Screenshot 3
              if (isCenter) {
                transformStyle = 'translate3d(0, 0, 80px) rotate(0deg) scale(1.05)';
                zIndex = 30;
              } else if (offset === -1 || (offset === albums.length - 1 && selectedIndex === 0)) {
                transformStyle = 'translate3d(-180px, -70px, -40px) rotate(-18deg) scale(0.85)';
              } else if (offset === 1) {
                transformStyle = 'translate3d(160px, -90px, -30px) rotate(14deg) scale(0.88)';
              } else if (offset === -2) {
                transformStyle = 'translate3d(-150px, 140px, -60px) rotate(8deg) scale(0.82)';
              } else {
                transformStyle = 'translate3d(180px, 140px, -80px) rotate(-12deg) scale(0.8)';
              }
            } else if (layout === 'carousel') {
              // Standard 3D Cover Flow carousel
              const rotate = isCenter ? 0 : offset < 0 ? 55 : -55;
              const translateX = offset * 110;
              const translateZ = isCenter ? 100 : -120;
              transformStyle = `translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotate}deg)`;
            } else {
              // Cascade layout
              const translateX = offset * 60;
              const translateY = offset * 25;
              transformStyle = `translate3d(${translateX}px, ${translateY}px, ${-Math.abs(offset) * 40}px)`;
            }

            return (
              <div
                key={album.id}
                onClick={() => {
                  setSelectedIndex(idx);
                  if (album.tracks[0]) onPlayTrack(album.tracks[0]);
                }}
                className="absolute w-56 sm:w-64 md:w-80 aspect-square rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-all duration-500 ease-out border border-white/10 group"
                style={{
                  transform: transformStyle,
                  zIndex,
                  opacity,
                }}
              >
                <img
                  src={album.coverArt}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:brightness-110 transition-all"
                />
              </div>
            );
          })}
        </div>

        {/* Center / Right Metadata Box matching Screenshot 3 */}
        <div className="flex flex-col text-left max-w-sm">
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
            NOW PLAYING
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight truncate">
            {currentTrack?.title || activeAlbum.title}
          </h2>
          <span
            className="text-base font-semibold mt-1"
            style={{ color: accentColor || '#e11d48' }}
          >
            {currentTrack?.artist || activeAlbum.artist}
          </span>
          <span className="text-xs text-neutral-400 mt-0.5">
            {currentTrack?.album || activeAlbum.title}
          </span>

          {nextTrack && (
            <div className="mt-8 pt-4 border-t border-white/10 flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
                UP NEXT
              </span>
              <span className="text-xs font-semibold text-neutral-200">
                {nextTrack.title} · {nextTrack.artist}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
