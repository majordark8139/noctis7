import React from 'react';
import { Minus, Square, X, Music, Search } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCommandPalette: () => void;
  accentColor: string;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenCommandPalette,
  accentColor,
}) => {
  const [isMaximized, setIsMaximized] = React.useState(false);

  const getElectronIpc = () => {
    try {
      const win = window as unknown as {
        require?: (mod: string) => { ipcRenderer: { send: (ch: string) => void } };
      };
      if (typeof window !== 'undefined' && win.require) {
        return win.require('electron').ipcRenderer;
      }
    } catch {
      // Not running in Electron
    }
    return null;
  };

  const handleMinimize = () => {
    const ipc = getElectronIpc();
    if (ipc) {
      ipc.send('window-minimize');
      return;
    }
    const root = document.getElementById('root');
    if (root) {
      root.classList.add('scale-95', 'opacity-70', 'transition-all');
      setTimeout(() => {
        root.classList.remove('scale-95', 'opacity-70');
      }, 400);
    }
  };

  const handleMaximize = () => {
    const ipc = getElectronIpc();
    if (ipc) {
      ipc.send('window-maximize');
      setIsMaximized(!isMaximized);
      return;
    }
    setIsMaximized(!isMaximized);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleClose = () => {
    const ipc = getElectronIpc();
    if (ipc) {
      ipc.send('window-close');
      return;
    }
    if (confirm('Exit Noctis Music Player?')) {
      window.location.reload();
    }
  };

  return (
    <header className="h-9 w-full bg-[#0d0e11] text-neutral-300 flex items-center justify-between px-3 select-none border-b border-white/[0.06] z-50 shrink-0">
      {/* Left: Noctis Brand Mark */}
      <div className="flex items-center gap-2">
        <div
          className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold shadow-sm"
          style={{ backgroundColor: accentColor || '#e11d48' }}
        >
          <Music className="w-3 h-3 fill-current" />
        </div>
        <span className="text-xs font-semibold tracking-wide text-neutral-100">Noctis</span>
      </div>

      {/* Center: Integrated Search Bar */}
      <div className="flex-1 max-w-md mx-6">
        <div
          onClick={onOpenCommandPalette}
          className="relative flex items-center w-full h-6 px-2.5 rounded-md bg-neutral-900/90 border border-white/[0.08] hover:border-white/20 transition-colors cursor-pointer group"
        >
          <Search className="w-3 h-3 text-neutral-400 group-hover:text-neutral-200 transition-colors mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tracks, artists, albums... (Ctrl+K)"
            className="w-full bg-transparent text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          />
          <kbd className="hidden sm:inline-block text-[10px] text-neutral-500 bg-neutral-800 px-1.5 py-0.2 rounded border border-white/[0.05]">
            Ctrl+K
          </kbd>
        </div>
      </div>

      {/* Right: Window Controls matching Noctis frameless window */}
      <div className="flex items-center gap-1 -mr-1">
        <button
          onClick={handleMinimize}
          className="w-8 h-7 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 rounded transition-colors"
          title="Minimize"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleMaximize}
          className="w-8 h-7 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 rounded transition-colors"
          title={isMaximized ? 'Restore' : 'Maximize'}
        >
          <Square className="w-3 h-3" />
        </button>
        <button
          onClick={handleClose}
          className="w-8 h-7 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-red-600 rounded transition-colors"
          title="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
