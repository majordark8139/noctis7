import React from 'react';
import { X, RotateCcw, Check } from 'lucide-react';
import { EQ_FREQUENCIES, EQ_PRESETS } from '../../services/audioEngine';

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  gains: number[];
  onGainChange: (index: number, gain: number) => void;
  onApplyPreset: (gains: number[]) => void;
  accentColor: string;
  currentTrackTitle?: string;
  onSaveTrackPreset?: (presetName: string) => void;
}

export const EqualizerModal: React.FC<EqualizerModalProps> = ({
  isOpen,
  onClose,
  gains,
  onGainChange,
  onApplyPreset,
  accentColor,
  currentTrackTitle,
  onSaveTrackPreset,
}) => {
  const [selectedPreset, setSelectedPreset] = React.useState('Flat');
  const [savePerTrack, setSavePerTrack] = React.useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (name: string) => {
    setSelectedPreset(name);
    const p = EQ_PRESETS.find((x) => x.name === name);
    if (p) {
      onApplyPreset(p.gains);
    }
  };

  const handleReset = () => {
    handleSelectPreset('Flat');
  };

  const formatFreq = (f: number) => {
    if (f >= 1000) return `${f / 1000}k`;
    return `${f}`;
  };

  // Generate SVG curve points
  const svgWidth = 460;
  const svgHeight = 90;
  const points = gains.map((gain, idx) => {
    const x = (idx / (gains.length - 1)) * (svgWidth - 40) + 20;
    // -12dB maps to height, +12dB maps to 0
    const y = svgHeight / 2 - (gain / 12) * (svgHeight / 2 - 10);
    return `${x},${y}`;
  });
  const pathD = `M ${points.join(' L ')}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-2xl bg-[#16181d] border border-white/10 rounded-2xl shadow-2xl p-6 text-neutral-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-lg font-bold text-white">10-Band Parametric Equalizer</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Precision frequency shaping with lossless 64-bit float processing.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Presets Bar */}
        <div className="flex flex-wrap items-center gap-1.5 py-4 border-b border-white/[0.06]">
          <span className="text-xs font-semibold text-neutral-400 mr-2">Presets:</span>
          {EQ_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleSelectPreset(preset.name)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                selectedPreset === preset.name
                  ? 'text-white shadow-sm'
                  : 'bg-neutral-800/60 text-neutral-400 hover:text-neutral-200'
              }`}
              style={
                selectedPreset === preset.name
                  ? { backgroundColor: accentColor || '#e11d48' }
                  : undefined
              }
            >
              {preset.name}
            </button>
          ))}
          <button
            onClick={handleReset}
            className="ml-auto text-xs text-neutral-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-neutral-800/60"
            title="Reset to Flat"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>

        {/* Graphic EQ Visual Curve */}
        <div className="w-full h-24 bg-neutral-900/80 rounded-xl my-4 p-2 relative flex items-center justify-center border border-white/[0.05] overflow-hidden">
          <div className="absolute inset-x-0 h-[1px] bg-white/10 top-1/2 -translate-y-1/2" />
          <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            <path
              d={pathD}
              fill="none"
              stroke={accentColor || '#e11d48'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {gains.map((gain, idx) => {
              const x = (idx / (gains.length - 1)) * (svgWidth - 40) + 20;
              const y = svgHeight / 2 - (gain / 12) * (svgHeight / 2 - 10);
              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#ffffff"
                  stroke={accentColor || '#e11d48'}
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>

        {/* 10 Vertical Band Sliders */}
        <div className="grid grid-cols-10 gap-2 py-2">
          {EQ_FREQUENCIES.map((freq, idx) => {
            const gain = gains[idx] || 0;

            return (
              <div key={freq} className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-mono text-neutral-300 tabular-nums">
                  {gain > 0 ? `+${gain}` : gain}
                </span>

                <div className="h-32 flex items-center justify-center py-2">
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={gain}
                    onChange={(e) => onGainChange(idx, parseInt(e.target.value, 10))}
                    className="w-28 -rotate-90 accent-rose-600 cursor-pointer h-1.5 bg-neutral-700 rounded"
                    style={{ accentColor: accentColor || '#e11d48' }}
                  />
                </div>

                <span className="text-[10px] font-mono font-medium text-neutral-400">
                  {formatFreq(freq)}Hz
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer: Per-Track Option */}
        {currentTrackTitle && (
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/[0.06] text-xs text-neutral-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={savePerTrack}
                onChange={(e) => {
                  setSavePerTrack(e.target.checked);
                  if (e.target.checked && onSaveTrackPreset) {
                    onSaveTrackPreset(selectedPreset);
                  }
                }}
                className="w-4 h-4 accent-rose-600 rounded"
              />
              <span>Remember this EQ preset for &quot;{currentTrackTitle}&quot;</span>
            </label>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-white font-semibold text-xs flex items-center gap-1 shadow-sm"
              style={{ backgroundColor: accentColor || '#e11d48' }}
            >
              <Check className="w-3.5 h-3.5" /> Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
