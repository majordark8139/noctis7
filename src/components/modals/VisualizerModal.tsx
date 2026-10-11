import React from 'react';
import { X, Activity, BarChart2, Radio, Waves } from 'lucide-react';
import { AudioEngine } from '../../services/audioEngine';
import { VisualizerMode } from '../../types';

interface VisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
  mode: VisualizerMode;
  onSelectMode: (mode: VisualizerMode) => void;
  isThrottled: boolean;
}

export const VisualizerModal: React.FC<VisualizerModalProps> = ({
  isOpen,
  onClose,
  accentColor,
  mode,
  onSelectMode,
  isThrottled,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const engine = AudioEngine.getInstance();
    const bufferLength = 128;
    const freqData = new Uint8Array(bufferLength);
    const timeData = new Uint8Array(bufferLength);

    let animationFrameId: number;
    let lastTime = 0;
    const targetFps = isThrottled ? 30 : 60;
    const frameInterval = 1000 / targetFps;

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);

      if (time - lastTime < frameInterval) return;
      lastTime = time;

      const width = canvas.width;
      const height = canvas.height;

      engine.getFrequencyData(freqData);
      engine.getTimeDomainData(timeData);

      // Dark translucent clear for persistence/decay trail
      ctx.fillStyle = 'rgba(13, 14, 17, 0.25)';
      ctx.fillRect(0, 0, width, height);

      const color = accentColor || '#e11d48';

      if (mode === 'bars') {
        const barWidth = (width / bufferLength) * 2.2;
        let x = 0;

        for (let i = 0; i < bufferLength / 2; i++) {
          const barHeight = (freqData[i] / 255) * height * 0.85;

          const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
          grad.addColorStop(0, color);
          grad.addColorStop(1, '#ffffff');

          ctx.fillStyle = grad;
          ctx.fillRect(x, height - barHeight, barWidth - 1.5, barHeight);
          x += barWidth;
        }
      } else if (mode === 'mirror') {
        const barWidth = (width / bufferLength) * 2.2;
        let x = 0;

        for (let i = 0; i < bufferLength / 2; i++) {
          const barHeight = (freqData[i] / 255) * (height / 2) * 0.8;
          ctx.fillStyle = color;
          // Top reflection
          ctx.fillRect(x, height / 2 - barHeight, barWidth - 1.5, barHeight);
          // Bottom mirror
          ctx.fillRect(x, height / 2, barWidth - 1.5, barHeight * 0.7);
          x += barWidth;
        }
      } else if (mode === 'wave') {
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = color;
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = timeData[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.stroke();
      } else if (mode === 'spectrogram') {
        // Shift old columns left
        const imgData = ctx.getImageData(1, 0, width - 1, height);
        ctx.putImageData(imgData, 0, 0);

        // Draw new column at right edge
        for (let i = 0; i < bufferLength / 2; i++) {
          const intensity = freqData[i] / 255;
          const y = height - (i / (bufferLength / 2)) * height;
          ctx.fillStyle = `rgba(225, 29, 72, ${intensity})`;
          ctx.fillRect(width - 2, y, 2, height / (bufferLength / 2));
        }
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, mode, accentColor, isThrottled]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-3xl bg-[#16181d] border border-white/10 rounded-2xl shadow-2xl p-6 text-neutral-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" style={{ color: accentColor || '#e11d48' }} />
            <div>
              <h2 className="text-lg font-bold text-white">Audio Visualizer & Spectrogram</h2>
              <p className="text-xs text-neutral-400">
                Real-time frequency domain visualization {isThrottled ? '(30fps Low-CPU mode)' : '(60fps)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-2 py-3 border-b border-white/[0.06] text-xs">
          {[
            { id: 'bars' as VisualizerMode, label: 'Bars', icon: BarChart2 },
            { id: 'mirror' as VisualizerMode, label: 'Mirror', icon: Radio },
            { id: 'wave' as VisualizerMode, label: 'Waveform', icon: Waves },
            { id: 'spectrogram' as VisualizerMode, label: 'Spectrogram', icon: Activity },
          ].map((item) => {
            const isActive = mode === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onSelectMode(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'text-white shadow-sm'
                    : 'bg-neutral-800/60 text-neutral-400 hover:text-neutral-200'
                }`}
                style={isActive ? { backgroundColor: accentColor || '#e11d48' } : undefined}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Canvas Display */}
        <div className="w-full h-80 bg-[#0d0e11] rounded-xl my-4 overflow-hidden border border-white/[0.05] relative flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={720}
            height={320}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};
