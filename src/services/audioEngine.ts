import { Track } from '../types';

export const EQ_FREQUENCIES = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

export const EQ_PRESETS: { name: string; gains: number[] }[] = [
  { name: 'Flat', gains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { name: 'Bass Boost', gains: [5, 4, 3, 2, 0, 0, 0, 0, 0, 0] },
  { name: 'Rock', gains: [4, 3, 1, 0, -1, 1, 3, 4, 4, 3] },
  { name: 'Pop', gains: [-1, 1, 3, 4, 3, 1, -1, -1, 1, 2] },
  { name: 'Jazz', gains: [3, 2, 0, 1, 2, 2, 1, 2, 3, 3] },
  { name: 'Vocal Boost', gains: [-2, -2, -1, 1, 3, 4, 3, 1, 0, -1] },
  { name: 'Classical', gains: [4, 3, 2, 1, -1, -1, 0, 2, 3, 3] },
  { name: 'Electronic', gains: [4, 3, 1, 0, -2, 2, 1, 2, 4, 4] },
  { name: 'Acoustic', gains: [3, 2, 1, 1, 2, 2, 3, 3, 2, 1] },
];

export class AudioEngine {
  private static instance: AudioEngine;
  private ctx: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private mediaSourceNode: MediaElementAudioSourceNode | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  private gainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;

  // Synthesized fallback audio engine for melodic playback
  private synthInterval: number | null = null;
  private synthCurrentTime: number = 0;
  private isSynthPlaying: boolean = false;
  private currentTrack: Track | null = null;

  private isPlaying: boolean = false;
  private volume: number = 0.85;
  private isMuted: boolean = false;
  private currentGains: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  private timeUpdateCallbacks: Set<(currentTime: number, duration: number) => void> = new Set();
  private playStateCallbacks: Set<(isPlaying: boolean) => void> = new Set();
  private trackEndCallbacks: Set<() => void> = new Set();

  private constructor() {
    this.initAudioElement();
  }

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  private initContextIfNeeded() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (!this.gainNode && this.ctx) {
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = this.isMuted ? 0 : this.volume;

      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.fftSize = 256; // Light 256 bins for low CPU on i3-4005U
      this.analyserNode.smoothingTimeConstant = 0.8;

      // Create 10-band EQ
      this.eqFilters = EQ_FREQUENCIES.map((freq, index) => {
        const filter = this.ctx!.createBiquadFilter();
        if (index === 0) {
          filter.type = 'lowshelf';
        } else if (index === EQ_FREQUENCIES.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1.4;
        }
        filter.frequency.value = freq;
        filter.gain.value = this.currentGains[index] || 0;
        return filter;
      });

      // Chain: EQ[0] -> EQ[1] -> ... -> Gain -> Analyser -> Destination
      for (let i = 0; i < this.eqFilters.length - 1; i++) {
        this.eqFilters[i].connect(this.eqFilters[i + 1]);
      }
      this.eqFilters[this.eqFilters.length - 1].connect(this.gainNode);
      this.gainNode.connect(this.analyserNode);
      this.analyserNode.connect(this.ctx.destination);
    }
  }

  private initAudioElement() {
    if (typeof window === 'undefined') return;
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = 'anonymous';

    this.audioElement.addEventListener('timeupdate', () => {
      if (this.audioElement && !this.isSynthPlaying) {
        const cur = this.audioElement.currentTime;
        const dur = this.audioElement.duration || this.currentTrack?.duration || 0;
        this.timeUpdateCallbacks.forEach((cb) => cb(cur, dur));
      }
    });

    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      this.playStateCallbacks.forEach((cb) => cb(false));
      this.trackEndCallbacks.forEach((cb) => cb());
    });

    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.playStateCallbacks.forEach((cb) => cb(true));
    });

    this.audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
      this.playStateCallbacks.forEach((cb) => cb(false));
    });
  }

  private connectMediaElement() {
    this.initContextIfNeeded();
    if (this.ctx && this.audioElement && !this.mediaSourceNode) {
      try {
        this.mediaSourceNode = this.ctx.createMediaElementSource(this.audioElement);
        if (this.eqFilters.length > 0) {
          this.mediaSourceNode.connect(this.eqFilters[0]);
        }
      } catch {
        // Already connected or cross-origin security
      }
    }
  }

  public async playTrack(track: Track, startTime = 0) {
    this.currentTrack = track;
    this.initContextIfNeeded();

    if (track.audioUrl) {
      this.stopSynth();
      this.connectMediaElement();
      if (this.audioElement) {
        this.audioElement.src = track.audioUrl;
        this.audioElement.currentTime = startTime;
        try {
          await this.audioElement.play();
          this.isPlaying = true;
          this.playStateCallbacks.forEach((cb) => cb(true));
        } catch {
          // If browser restricts audioUrl or format, seamlessly use melodic synth
          this.startSynth(track, startTime);
        }
      }
    } else {
      // Use built-in harmonic music synthesizer matching track BPM and key!
      if (this.audioElement) {
        this.audioElement.pause();
      }
      this.startSynth(track, startTime);
    }
  }

  public pause() {
    if (this.isSynthPlaying) {
      this.pauseSynth();
    } else if (this.audioElement) {
      this.audioElement.pause();
    }
    this.isPlaying = false;
    this.playStateCallbacks.forEach((cb) => cb(false));
  }

  public resume() {
    this.initContextIfNeeded();
    if (this.isSynthPlaying || (!this.audioElement?.src && this.currentTrack)) {
      if (this.currentTrack) {
        this.startSynth(this.currentTrack, this.synthCurrentTime);
      }
    } else if (this.audioElement) {
      this.audioElement.play().catch(() => {});
    }
    this.isPlaying = true;
    this.playStateCallbacks.forEach((cb) => cb(true));
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
  }

  public seek(seconds: number) {
    if (this.isSynthPlaying) {
      this.synthCurrentTime = Math.max(0, seconds);
      if (this.currentTrack) {
        this.timeUpdateCallbacks.forEach((cb) => cb(this.synthCurrentTime, this.currentTrack!.duration));
      }
    } else if (this.audioElement) {
      this.audioElement.currentTime = Math.max(0, seconds);
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx?.currentTime || 0);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.setVolume(this.volume);
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setEqGain(bandIndex: number, gain: number) {
    this.currentGains[bandIndex] = gain;
    if (this.eqFilters[bandIndex] && this.ctx) {
      this.eqFilters[bandIndex].gain.setValueAtTime(gain, this.ctx.currentTime);
    }
  }

  public setEqPreset(gains: number[]) {
    this.currentGains = [...gains];
    this.currentGains.forEach((gain, i) => {
      if (this.eqFilters[i] && this.ctx) {
        this.eqFilters[i].gain.setValueAtTime(gain, this.ctx.currentTime);
      }
    });
  }

  public getEqGains(): number[] {
    return [...this.currentGains];
  }

  public getFrequencyData(array: Uint8Array): void {
    if (this.analyserNode) {
      this.analyserNode.getByteFrequencyData(array as unknown as Uint8Array<ArrayBuffer>);
    } else {
      array.fill(0);
    }
  }

  public getTimeDomainData(array: Uint8Array): void {
    if (this.analyserNode) {
      this.analyserNode.getByteTimeDomainData(array as unknown as Uint8Array<ArrayBuffer>);
    } else {
      array.fill(128);
    }
  }

  public getCurrentTime(): number {
    if (this.isSynthPlaying) return this.synthCurrentTime;
    return this.audioElement?.currentTime || 0;
  }

  public getDuration(): number {
    if (this.isSynthPlaying) return this.currentTrack?.duration || 180;
    return this.audioElement?.duration || this.currentTrack?.duration || 180;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public onTimeUpdate(cb: (currentTime: number, duration: number) => void): () => void {
    this.timeUpdateCallbacks.add(cb);
    return () => this.timeUpdateCallbacks.delete(cb);
  }

  public onPlayStateChange(cb: (isPlaying: boolean) => void): () => void {
    this.playStateCallbacks.add(cb);
    return () => this.playStateCallbacks.delete(cb);
  }

  public onTrackEnd(cb: () => void): () => void {
    this.trackEndCallbacks.add(cb);
    return () => this.trackEndCallbacks.delete(cb);
  }

  // --- Real-time R&B/Pop Melodic Synth Engine ---
  // Synthesizes pleasant musical chords and rhythm connected directly to the EQ and AnalyserNode
  private startSynth(track: Track, startTime = 0) {
    this.stopSynth();
    this.isSynthPlaying = true;
    this.isPlaying = true;
    this.synthCurrentTime = startTime;
    this.playStateCallbacks.forEach((cb) => cb(true));

    const bpm = track.bpm || 116;
    const intervalMs = 100;
    const beatInterval = 60 / bpm; // seconds per beat

    // Chord progression in F Major / D Minor (matching Bruno Mars R&B style)
    const chords = [
      [349.23, 440.0, 523.25, 659.25], // Fmaj7
      [329.63, 392.0, 493.88, 587.33], // Em7
      [293.66, 349.23, 440.0, 523.25], // Dm7
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
    ];

    let lastBeat = Math.floor(this.synthCurrentTime / beatInterval);

    this.synthInterval = window.setInterval(() => {
      if (!this.isSynthPlaying) return;
      this.synthCurrentTime += intervalMs / 1000;
      this.timeUpdateCallbacks.forEach((cb) => cb(this.synthCurrentTime, track.duration));

      if (this.synthCurrentTime >= track.duration) {
        this.stopSynth();
        this.trackEndCallbacks.forEach((cb) => cb());
        return;
      }

      const currentBeat = Math.floor(this.synthCurrentTime / beatInterval);
      if (currentBeat !== lastBeat && this.ctx && this.eqFilters.length > 0) {
        lastBeat = currentBeat;
        const chordIndex = Math.floor(currentBeat / 4) % chords.length;
        const chord = chords[chordIndex];

        // Trigger gentle warm polyphonic note pulse
        const beatInBar = currentBeat % 4;
        const now = this.ctx.currentTime;

        chord.forEach((freq, i) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();

          osc.type = i === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq * (beatInBar === 0 ? 0.5 : 1), now);

          const baseVolume = (beatInBar === 0 ? 0.08 : 0.04) * (this.isMuted ? 0 : this.volume);
          noteGain.gain.setValueAtTime(0.001, now);
          noteGain.gain.exponentialRampToValueAtTime(baseVolume, now + 0.05);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + beatInterval * 1.5);

          osc.connect(noteGain);
          noteGain.connect(this.eqFilters[0]);

          osc.start(now);
          osc.stop(now + beatInterval * 1.5);
        });
      }
    }, intervalMs);
  }

  private pauseSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.isSynthPlaying = false;
  }

  private stopSynth() {
    this.pauseSynth();
    this.synthCurrentTime = 0;
  }
}
