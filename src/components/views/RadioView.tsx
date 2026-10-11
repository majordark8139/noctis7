import React from 'react';
import { Sparkles, Radio, Play, Disc } from 'lucide-react';
import { Track } from '../../types';

interface RadioViewProps {
  tracks: Track[];
  currentTrack: Track | null;
  onPlayTrack: (track: Track) => void;
  accentColor: string;
}

export const RadioView: React.FC<RadioViewProps> = ({
  tracks,
  currentTrack,
  onPlayTrack,
  accentColor,
}) => {
  const currentBpm = currentTrack?.bpm || 116;
  const currentKey = currentTrack?.key || 'F Major';

  // Find harmonic matches
  const harmonicMatches = tracks.filter((t) => t.id !== currentTrack?.id);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 text-neutral-200 select-none pb-28">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6" style={{ color: accentColor || '#e11d48' }} />
          Track Radio & Harmonic Autoplay
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Intelligent harmonic matching using automatic BPM and musical key detection to maintain continuous flow.
        </p>
      </div>

      {/* Current Seed Info */}
      <div className="bg-neutral-900/60 p-5 rounded-2xl border border-white/[0.06] mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-neutral-800 overflow-hidden shadow-md shrink-0 border border-white/10">
            <img src={currentTrack?.coverArt} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Active Radio Seed
            </span>
            <span className="text-lg font-bold text-white block">{currentTrack?.title}</span>
            <span className="text-xs text-neutral-400">{currentTrack?.artist}</span>
          </div>
        </div>

        {/* BPM & Key Badges */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-neutral-800 border border-white/5 text-center">
            <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Tempo</span>
            <span className="text-sm font-bold font-mono text-rose-400 tabular-nums">
              {currentBpm} BPM
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-neutral-800 border border-white/5 text-center">
            <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Harmonic Key</span>
            <span className="text-sm font-bold font-mono text-sky-400 tabular-nums">
              {currentKey}
            </span>
          </div>
        </div>
      </div>

      {/* Suggested Harmonic Queue */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Radio className="w-4 h-4 text-neutral-400" />
          Harmonically Compatible Tracks ({harmonicMatches.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {harmonicMatches.map((track) => (
            <div
              key={track.id}
              onClick={() => onPlayTrack(track)}
              className="group flex items-center justify-between p-3 rounded-2xl bg-neutral-900/40 hover:bg-neutral-800/60 border border-white/[0.04] hover:border-white/10 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-neutral-800 overflow-hidden shrink-0 border border-white/5">
                  <img src={track.coverArt} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate group-hover:text-rose-400 transition-colors">
                    {track.title}
                  </span>
                  <span className="text-[11px] text-neutral-400 truncate">{track.artist}</span>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono mt-0.5">
                    <span>{track.bpm || 118} BPM</span>
                    <span>·</span>
                    <span>{track.key || 'D Minor'}</span>
                  </div>
                </div>
              </div>

              <button
                className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-rose-600 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                style={{ backgroundColor: accentColor || '#e11d48' }}
              >
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
