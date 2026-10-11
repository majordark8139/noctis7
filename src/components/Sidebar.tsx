import React from 'react';
import {
  ChevronLeft,
  Search,
  Home,
  Music2,
  Disc,
  User,
  Folder,
  ListMusic,
  Activity,
  Sparkles,
  Settings,
  Heart,
} from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onOpenSettings: () => void;
  onOpenCommandPalette: () => void;
  accentColor: string;
  avatarUrl?: string;
  favoritesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenSettings,
  onOpenCommandPalette,
  accentColor,
  avatarUrl,
  favoritesCount,
}) => {
  const navItems = [
    { id: 'home' as ViewMode, icon: Home, label: 'Home' },
    { id: 'songs' as ViewMode, icon: Music2, label: 'Songs' },
    { id: 'albums' as ViewMode, icon: Disc, label: 'Albums' },
    { id: 'artists' as ViewMode, icon: User, label: 'Artists' },
    { id: 'folders' as ViewMode, icon: Folder, label: 'Folders' },
    { id: 'playlists' as ViewMode, icon: ListMusic, label: 'Playlists' },
    { id: 'visualizer' as ViewMode, icon: Activity, label: 'Visualizer & EQ' },
    { id: 'radio' as ViewMode, icon: Sparkles, label: 'Track Radio' },
  ];

  return (
    <aside className="w-12 h-full bg-[#111317] border-r border-white/[0.06] flex flex-col items-center py-2 select-none shrink-0 z-40">
      {/* Top: Back and Search */}
      <div className="flex flex-col items-center gap-1.5 mb-2">
        <button
          onClick={() => onSelectView('home')}
          className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          title="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={onOpenCommandPalette}
          className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          title="Search (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      <div className="w-6 h-[1px] bg-white/[0.08] mb-2" />

      {/* Main Navigation Icons */}
      <nav className="flex-1 flex flex-col items-center gap-1.5 w-full">
        {navItems.map((item) => {
          const isActive = currentView === item.id || (item.id === 'artists' && currentView === 'artist_detail');
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isActive
                  ? 'text-white shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.06]'
              }`}
              style={isActive ? { backgroundColor: accentColor || '#e11d48' } : undefined}
              title={item.label}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}

        <button
          onClick={onOpenSettings}
          className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors mt-1"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </nav>

      {/* Bottom Icons: Favorites & Avatar */}
      <div className="flex flex-col items-center gap-2 mt-auto pt-2 border-t border-white/[0.06]">
        <button
          onClick={() => onSelectView('playlists')}
          className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-rose-400 hover:bg-white/[0.06] transition-colors relative"
          title={`Favorites (${favoritesCount})`}
        >
          <Heart className="w-4 h-4 fill-rose-500/20 text-rose-500" />
        </button>

        <button
          onClick={() => onSelectView('artist_detail')}
          className="w-7 h-7 rounded-full overflow-hidden border border-white/20 hover:border-white/60 transition-colors"
          title="Now Playing Artist / Profile"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-xs text-neutral-300">
              BM
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
