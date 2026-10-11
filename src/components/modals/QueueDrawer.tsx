import React from 'react';
import { X, Play, Trash2, Music } from 'lucide-react';
import { Track } from '../../types';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  queue: Track[];
  currentTrack: Track | null;
  onPlayTrack: (track: Track) => void;
  onRemoveFromQueue: (index: number) => void;
  onClearQueue: () => void;
  accentColor: string;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  isOpen,
  onClose,
  queue,
  currentTrack,
  onPlayTrack,
  onRemoveFromQueue,
  onClearQueue,
  accentColor,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 bg-[#16181d] border-l border-white/10 shadow-2xl flex flex-col select-none text-neutral-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4" style={{ color: accentColor || '#e11d48' }} />
          <h3 className="text-sm font-bold text-white">Play Queue ({queue.length})</h3>
        </div>
        <div className="flex items-center gap-1">
          {queue.length > 0 && (
            <button
              onClick={onClearQueue}
              className="text-neutral-400 hover:text-white p-1 rounded"
              title="Clear Queue"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Now Playing section in queue */}
      {currentTrack && (
        <div className="p-3 bg-neutral-900/60 border-b border-white/[0.06]">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            Now Playing
          </span>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-md bg-neutral-800 overflow-hidden shrink-0 border border-white/5">
              <img src={currentTrack.coverArt} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate">{currentTrack.title}</span>
              <span className="text-[11px] text-neutral-400 truncate">{currentTrack.artist}</span>
            </div>
          </div>
        </div>
      )}

      {/* Up Next List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 block mb-1">
          Up Next
        </span>
        {queue.length === 0 ? (
          <div className="text-center py-12 text-xs text-neutral-500">
            Queue is empty. Click any song to add.
          </div>
        ) : (
          queue.map((track, idx) => (
            <div
              key={`${track.id}-${idx}`}
              onDoubleClick={() => onPlayTrack(track)}
              className="group flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-md bg-neutral-800 overflow-hidden shrink-0 border border-white/5">
                  <img src={track.coverArt} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-neutral-200 truncate group-hover:text-white">
                    {track.title}
                  </span>
                  <span className="text-[10px] text-neutral-400 truncate">{track.artist}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onPlayTrack(track)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white bg-rose-600 hover:scale-105"
                  style={{ backgroundColor: accentColor || '#e11d48' }}
                >
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </button>
                <button
                  onClick={() => onRemoveFromQueue(idx)}
                  className="w-6 h-6 rounded flex items-center justify-center text-neutral-400 hover:text-rose-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
