import React from 'react';
import {
  X,
  Search,
  Settings as SettingsIcon,
  Palette,
  PlayCircle,
  MessageSquare,
  Keyboard,
  Volume2,
  Folder,
  Wrench,
  User,
  Share2,
  Puzzle,
  BarChart2,
  Info,
  Check,
  Cpu,
} from 'lucide-react';
import { SettingsState, ThemeName } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsState;
  onUpdateSettings: (newSettings: Partial<SettingsState>) => void;
}

export const PRESET_ACCENT_COLORS = [
  '#f43f5e', // Rose / Red (Noctis default)
  '#ef4444', // Red
  '#f97316', // Orange
  '#fb7185', // Coral
  '#ec4899', // Pink
  '#d946ef', // Fuchsia
  '#a855f7', // Purple
  '#8b5cf6', // Violet
  '#6366f1', // Indigo
  '#3b82f6', // Blue
  '#0ea5e9', // Sky
  '#06b6d4', // Cyan
  '#14b8a6', // Teal
  '#10b981', // Emerald
  '#22c55e', // Green
  '#84cc16', // Lime
  '#eab308', // Yellow
  '#f59e0b', // Amber
  '#ea580c', // Rust
  '#991b1b', // Maroon
  '#e11d48', // Crimson (Screenshot Ink)
  '#be123c', // Deep Rose
  '#78350f', // Warm Brown
  '#71717a', // Zinc
  '#64748b', // Slate
  '#475569', // Dark Slate
  '#94a3b8', // Light Slate
  '#e2e8f0', // Crisp White
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [activeCategory, setActiveCategory] = React.useState('Appearance');
  const [searchQuery, setSearchQuery] = React.useState('');

  if (!isOpen) return null;

  const categories = [
    { section: 'App', items: [
      { id: 'General', label: 'General', icon: SettingsIcon },
      { id: 'Appearance', label: 'Appearance', icon: Palette },
      { id: 'Player', label: 'Player', icon: PlayCircle },
      { id: 'Lyrics', label: 'Lyrics', icon: MessageSquare },
      { id: 'Shortcuts', label: 'Shortcuts', icon: Keyboard },
    ]},
    { section: 'Playback', items: [
      { id: 'Audio', label: 'Audio', icon: Volume2 },
    ]},
    { section: 'Library', items: [
      { id: 'Library', label: 'Library', icon: Folder },
      { id: 'Advanced', label: 'Advanced', icon: Wrench },
    ]},
    { section: 'Connect', items: [
      { id: 'Account & Devices', label: 'Account & Devices', icon: User },
      { id: 'Integrations', label: 'Integrations', icon: Share2 },
      { id: 'Plugins', label: 'Plugins', icon: Puzzle },
    ]},
    { section: 'More', items: [
      { id: 'Statistics', label: 'Statistics', icon: BarChart2 },
      { id: 'About', label: 'About', icon: Info },
    ]},
  ];

  const themes: { name: ThemeName; previewBg: string; previewFg: string }[] = [
    { name: 'Dark', previewBg: '#0f1115', previewFg: '#3b82f6' },
    { name: 'Gray', previewBg: '#1f242d', previewFg: '#94a3b8' },
    { name: 'Midnight', previewBg: '#0a0d1a', previewFg: '#6366f1' },
    { name: 'Light', previewBg: '#f8fafc', previewFg: '#0284c7' },
    { name: 'Ink', previewBg: '#08090b', previewFg: '#e11d48' },
    { name: 'Smoke', previewBg: '#17191e', previewFg: '#38bdf8' },
    { name: 'Custom', previewBg: '#1c1917', previewFg: settings.accentColor },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-4xl h-[620px] bg-[#16181d] border border-white/10 rounded-2xl shadow-2xl flex overflow-hidden text-neutral-200">
        {/* Left Categories Sidebar (Screenshot 4) */}
        <div className="w-56 bg-[#111317] border-r border-white/[0.06] flex flex-col p-3 shrink-0">
          {/* Search Box */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search settings"
              className="w-full h-8 pl-8 pr-2 text-xs bg-neutral-900 border border-white/10 rounded-lg text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Navigation Categories */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            {categories.map((group) => (
              <div key={group.section}>
                <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider px-2 block mb-1">
                  {group.section}
                </span>
                <div className="space-y-0.5">
                  {group.items.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    const Icon = cat.icon;

                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg font-medium transition-all text-left ${
                          isActive
                            ? 'text-white shadow-sm'
                            : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
                        }`}
                        style={
                          isActive
                            ? { backgroundColor: settings.accentColor || '#e11d48' }
                            : undefined
                        }
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Settings Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#16181d]">
          {/* Top Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-xl font-bold text-white">{activeCategory}</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                {activeCategory === 'Appearance'
                  ? 'Themes, accent colour, glass, text animation and artwork.'
                  : `Configure your ${activeCategory.toLowerCase()} options.`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Settings Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeCategory === 'Appearance' && (
              <>
                {/* 1. Theme Selection Grid (Screenshot 4) */}
                <div className="bg-neutral-900/60 p-4 rounded-xl border border-white/[0.06]">
                  <span className="text-xs font-semibold text-neutral-300 block mb-3">
                    Choose how Noctis looks on your device.
                  </span>
                  <div className="grid grid-cols-4 gap-3">
                    {themes.map((th) => {
                      const isSelected = settings.theme === th.name;

                      return (
                        <div
                          key={th.name}
                          onClick={() => onUpdateSettings({ theme: th.name })}
                          className={`flex flex-col items-center p-2.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-rose-500 bg-white/5'
                              : 'border-white/10 hover:border-white/20 bg-neutral-950/40'
                          }`}
                          style={isSelected ? { borderColor: settings.accentColor || '#e11d48' } : undefined}
                        >
                          <div
                            className="w-full h-11 rounded-lg border border-white/10 mb-2 flex flex-col p-1.5 justify-between"
                            style={{ backgroundColor: th.previewBg }}
                          >
                            <div className="w-4 h-1 rounded" style={{ backgroundColor: th.previewFg }} />
                            <div className="w-full h-1 bg-white/10 rounded" />
                          </div>
                          <span className="text-xs font-semibold text-neutral-200">
                            {th.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Accent Color Palette (Screenshot 4) */}
                <div className="bg-neutral-900/60 p-4 rounded-xl border border-white/[0.06]">
                  <div className="mb-3">
                    <span className="text-sm font-bold text-white block">Accent Color</span>
                    <span className="text-xs text-neutral-400">
                      Pick a preset or open the picker for any custom color.
                    </span>
                  </div>

                  <div className="grid grid-cols-7 sm:grid-cols-10 gap-2.5 mb-4">
                    {PRESET_ACCENT_COLORS.map((color) => {
                      const isChosen = settings.accentColor === color;

                      return (
                        <button
                          key={color}
                          onClick={() => onUpdateSettings({ accentColor: color })}
                          className={`w-7 h-7 rounded-full transition-transform active:scale-90 flex items-center justify-center relative shadow-sm ${
                            isChosen ? 'scale-110 ring-2 ring-white' : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                        >
                          {isChosen && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Toggle: Accent follows album art */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Accent follows album art
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        Recolour the accent from the playing cover. Your chosen accent returns when nothing is playing.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.accentFollowsAlbumArt}
                        onChange={(e) =>
                          onUpdateSettings({ accentFollowsAlbumArt: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600" />
                    </label>
                  </div>
                </div>

                {/* 3. Liquid Glass & Performance Mode */}
                <div className="bg-neutral-900/60 p-4 rounded-xl border border-white/[0.06] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Liquid Glass Mode
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        Translucent frosted acrylic blur backdrop with specular reflections.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.liquidGlass}
                        onChange={(e) => onUpdateSettings({ liquidGlass: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600" />
                    </label>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    <div>
                      <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-sky-400" />
                        Windows 7 & Low-Spec Optimization
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        Limits spectrum FFT and throttles render loops to keep CPU below 40% on i3-4005U / HD 4400.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.hardwareThrottling}
                        onChange={(e) =>
                          onUpdateSettings({ hardwareThrottling: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600" />
                    </label>
                  </div>
                </div>
              </>
            )}

            {activeCategory === 'Audio' && (
              <div className="bg-neutral-900/60 p-4 rounded-xl border border-white/[0.06] space-y-4">
                <span className="text-sm font-bold text-white block">Audio Processing</span>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-neutral-200 block">
                      Crossfade Transitions
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Duration: {settings.crossfadeDuration}s
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={settings.crossfadeDuration}
                    onChange={(e) =>
                      onUpdateSettings({ crossfadeDuration: parseInt(e.target.value, 10) })
                    }
                    className="accent-rose-500 w-32 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  <div>
                    <span className="text-xs font-semibold text-neutral-200 block">
                      ReplayGain Volume Leveling
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Normalizes loudness across tracks to avoid sudden volume spikes.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.replayGainEnabled}
                    onChange={(e) =>
                      onUpdateSettings({ replayGainEnabled: e.target.checked })
                    }
                    className="accent-rose-500 w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeCategory === 'About' && (
              <div className="bg-neutral-900/60 p-4 rounded-xl border border-white/[0.06] space-y-3 text-xs text-neutral-300">
                <h3 className="text-sm font-bold text-white">Noctis Music Player</h3>
                <p>
                  Official Windows 7 desktop port of heartached/Noctis. Developed with lossless Web Audio processing,
                  Apple Music style word-by-word synced karaoke lyrics, 10-band parametric equalizer, and Cover Flow 3D.
                </p>
                <div className="p-3 bg-neutral-950 rounded-lg font-mono text-[11px] text-neutral-400 space-y-1">
                  <div>Version: 1.2.0 (Windows 7 Native Compatible)</div>
                  <div>Engine: Web Audio API + HTML5 Canvas</div>
                  <div>Target Specs: i3-4005U / Intel HD 4400 / 4GB RAM</div>
                  <div>Build CI/CD: .github/workflows/build-windows.yml</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
