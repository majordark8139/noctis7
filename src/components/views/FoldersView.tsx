import React from 'react';
import { Folder, FolderOpen, Music, Play } from 'lucide-react';
import { Track } from '../../types';

interface FoldersViewProps {
  tracks: Track[];
  onPlayTrack: (track: Track) => void;
  accentColor: string;
}

export const FoldersView: React.FC<FoldersViewProps> = ({
  tracks,
  onPlayTrack,
  accentColor,
}) => {
  // Group tracks by virtual folder (album)
  const folders = React.useMemo(() => {
    const map = new Map<string, Track[]>();
    tracks.forEach((t) => {
      const folderName = `C:\\Music\\${t.artist}\\${t.album}`;
      if (!map.has(folderName)) map.set(folderName, []);
      map.get(folderName)!.push(t);
    });
    return Array.from(map.entries());
  }, [tracks]);

  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(
    new Set(folders.map(([name]) => name))
  );

  const toggleFolder = (name: string) => {
    const next = new Set(expandedFolders);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setExpandedFolders(next);
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 text-neutral-200 select-none pb-28">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Folder className="w-6 h-6" style={{ color: accentColor || '#e11d48' }} />
          Local Folder Navigation
        </h1>
        <span className="text-xs text-neutral-400 mt-0.5 block">
          Hierarchical disk directory structure for local audio files.
        </span>
      </div>

      <div className="space-y-4">
        {folders.map(([folderName, folderTracks]) => {
          const isExpanded = expandedFolders.has(folderName);

          return (
            <div
              key={folderName}
              className="bg-neutral-900/40 rounded-2xl border border-white/[0.06] overflow-hidden"
            >
              {/* Folder header */}
              <div
                onClick={() => toggleFolder(folderName)}
                className="flex items-center justify-between px-4 py-3 bg-neutral-950/40 cursor-pointer hover:bg-neutral-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <FolderOpen className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Folder className="w-4 h-4 text-amber-400" />
                  )}
                  <span className="text-xs font-mono font-semibold text-neutral-200">
                    {folderName}
                  </span>
                </div>
                <span className="text-xs text-neutral-500 font-mono">
                  {folderTracks.length} files
                </span>
              </div>

              {/* Tracks in folder */}
              {isExpanded && (
                <div className="divide-y divide-white/[0.03] p-2 space-y-1">
                  {folderTracks.map((t) => (
                    <div
                      key={t.id}
                      onDoubleClick={() => onPlayTrack(t)}
                      className="group flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Music className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span className="font-semibold text-neutral-200 truncate group-hover:text-white">
                          {t.title}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          ({t.format})
                        </span>
                      </div>
                      <button
                        onClick={() => onPlayTrack(t)}
                        className="opacity-0 group-hover:opacity-100 text-white p-1 hover:scale-110"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
