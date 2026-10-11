# Noctis Music Player — Windows 7 Native Desktop & GitHub Actions Build

A source-accurate desktop port of **heartached/Noctis** optimized specifically for modest Windows 7 hardware (Intel Core i3-4005U, Intel HD Graphics 4400, 4GB DDR3 RAM, HDD) with an integrated **GitHub Actions CI/CD Workflow** (`.github/workflows/build-windows.yml`) that compiles standalone Windows 7 executables/installers automatically in the cloud.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural plan directly reflects your hardware targets and automated build workflow:
> - **GitHub Actions Cloud Compilation**: The repository includes a production-ready `.github/workflows/build-windows.yml`. When pushed to GitHub, GitHub's cloud runners automatically compile, bundle, and package standalone Windows 7 release executables (`.exe` installer and portable `.zip`) without taxing your local machine.
> - **Hardware Budget Target (i3-4005U / HD 4400 / 4GB RAM / HDD)**:
>   - CPU budget: < 35-50% CPU during playback and visualization via `requestAnimationFrame` render throttling and lightweight Web Audio analysis.
>   - RAM budget: Strict memory capping (< 250MB RAM footprint) by releasing decoded audio buffers, lazy-loading album art blobs, and avoiding redundant in-memory caching.
>   - HDD friendly: Memory-buffered sequential streaming for large lossless files (FLAC/WAV) to eliminate mechanical hard drive thrashing and disk stutter.
>   - GPU acceleration: Leverages Intel HD 4400 hardware compositing (`translate3d`, `will-change: transform`, 2D hardware Canvas) while avoiding heavy 4K shaders that would exceed the 64MB base VRAM allocation.
> - **Exact Noctis Visuals**: 100% faithful to the official Noctis Avalonia release and screenshots: custom titlebar with minimize/maximize/close, artist hero discography (Bruno Mars view), Apple Music style word-by-word synced karaoke lyrics, 3D Cover Flow, and the 13-page settings suite.

---

## 1. Hardware Optimization & Resource Budget

| Subsystem | Target (i3-4005U + HD 4400 + 4GB) | Optimization Architecture |
| :--- | :--- | :--- |
| **CPU Utilization** | $\le 40\text{–}50\%$ | Visualizers render at 30–60fps dynamic throttling; FFT size capped at 128/256 bins for the analyser node; zero synchronous blocking loops during local tag parsing. |
| **GPU / VRAM** | HD 4400 (64MB dedicated) | Composited CSS3 3D transforms (`translateZ(0)`); image assets scaled to display resolution before GPU upload to prevent VRAM overflow. |
| **RAM Footprint** | $\le 250\text{MB}$ total | Single active `AudioBuffer` for playback; artwork thumbnails compressed in memory; garbage-collection friendly typed arrays. |
| **Disk I/O (HDD)** | Zero disk thrashing | Sequential chunk reading via `FileReader`; metadata scanning runs asynchronously with yielding pauses (`setTimeout(0)`) so the mechanical drive never freezes the UI. |

---

## 2. GitHub Actions CI/CD Windows 7 Compilation

To build standalone Windows 7 executables without local compilation strain:
- A GitHub Actions workflow (`.github/workflows/build-windows.yml`) runs on standard GitHub hosted runners (`windows-latest`).
- It packages the application into a standalone Windows 7 compatible executable using an Electron/desktop wrapper targeting Win7 x64/ia32.
- Automatically publishes release assets:
  - `Noctis-Setup-Win7-x64.exe` (NSIS installer)
  - `Noctis-Win7-Portable-x64.zip` (Portable standalone folder, no install required)

---

## 3. Core Features & View Hierarchy (Matching Screenshots)

1. **Custom Frameless Titlebar**:
   - Noctis logo & wordmark, universal search (`Ctrl+K`), Minimize `—`, Maximize/Restore `□`, Close `✕`.
2. **Left Navigation Rail**:
   - Back `‹`, Search `🔍`, Home `⌂`, Songs `♫`, Albums `💽`, Artists `👤` (active red pill indicator), Folders `📁`, Playlists `≡`, Visualizer & EQ `〰️`, Radio `✨`, Settings `⚙️`, Favorites `❤️`.
3. **Artist Discography Page (Screenshot 1)**:
   - Hero banner with artist image, genre tag, follower count, Play/Shuffle pill buttons.
   - Sub-tabs: Overview, Albums, Singles & EPs, Songs, Similar Artists.
   - Top Songs ranking (1 to 5), metrics strip, Latest Release card, and About bio with social links.
4. **Apple Music Style Synced Lyrics (Screenshot 2)**:
   - High-res cover art, `Hi-Res Lossless` audio badge, scrubber with progress, and floating controls pill.
   - Right pane: word-by-word synced karaoke lines with active line glow and dynamic ambient backdrop blur.
5. **Cover Flow 3D (Screenshot 3)**:
   - 3D perspective album showcase supporting **Carousel**, **Cascade**, and **Collage** modes with Now Playing / Up Next cards.
6. **13-Page Settings Dialog (Screenshot 4)**:
   - Theme options: Dark, Gray, Midnight, Light, Ink, Smoke, Custom.
   - 28-color accent picker + "Accent follows album art" toggle + Liquid Glass options.
7. **Sound Engine**:
   - Lossless audio playback: FLAC, ALAC, WAV, AIFF, APE, MP3, AAC, OGG, Opus, M4A.
   - 10-band parametric EQ with per-track presets.
   - ReplayGain & Sound Check volume leveling; gapless playback and crossfade.
   - Bars, Mirror, Wave visualizers & Spectrogram.

---

## 4. Technical Architecture & File Organization

```
┌────────────────────────────────────────────────────────────────────────┐
│ Noctis Windows 7 Desktop Shell [♫ Noctis]                 [—] [□] [✕]  │
├──────┬─────────────────────────────────────────────────────────────────┤
│ Rail │ Main Workspace:                                                 │
│ [‹]  │  • Artist Hero View (Top Songs, Stats, Latest Release, Albums)  │
│ [🔍] │  • Apple Music Synced Karaoke Lyrics (Word-by-word + Ambient)   │
│ [⌂]  │  • Cover Flow 3D Engine (Carousel, Cascade, Collage)            │
│ [♫]  │  • Songs Table / Albums Grid / Folders Tree / Track Radio       │
│ [💽] │  • Settings Modal (13 Searchable Category Pages)                │
│ [👤] │                                                                 │
│ [📁] │ ┌─────────────────────────────────────────────────────────────┐ │
│ [≡]  │ │ Floating Player Bar Pill: [⏮][▶][⏭] [Art|Title] [...] [🔊]   │ │
│ [〰️] │ └─────────────────────────────────────────────────────────────┘ │
└──────┴─────────────────────────────────────────────────────────────────┘
```
