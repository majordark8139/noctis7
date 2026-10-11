import { LyricLine, Track, WordTimestamp } from '../types';

export class TagParser {
  /**
   * Parse an LRC or word-level LRC text string into structured LyricLine[]
   */
  public static parseLrcText(text: string): LyricLine[] {
    const lines = text.split(/\r?\n/);
    const result: LyricLine[] = [];

    const timeRegex = /\[(\d{1,2}):(\d{2})(?:\.(\d{2,3}))?\]/g;
    const wordTimeRegex = /<(\d{1,2}):(\d{2})(?:\.(\d{2,3}))?>/g;

    for (const rawLine of lines) {
      const trimmed = rawLine.trim();
      if (!trimmed) continue;

      // Skip metadata tags like [ar:Artist], [ti:Title], [al:Album]
      if (/^\[(ar|ti|al|by|offset|length|re|ve):/i.test(trimmed)) {
        continue;
      }

      timeRegex.lastIndex = 0;
      const matches: { time: number; matchEnd: number }[] = [];
      let m;
      while ((m = timeRegex.exec(trimmed)) !== null) {
        const mins = parseInt(m[1], 10);
        const secs = parseInt(m[2], 10);
        const msStr = m[3] || '0';
        const ms = msStr.length === 2 ? parseInt(msStr, 10) * 10 : parseInt(msStr, 10);
        const totalSecs = mins * 60 + secs + ms / 1000;
        matches.push({ time: totalSecs, matchEnd: timeRegex.lastIndex });
      }

      if (matches.length === 0) continue;

      const lastMatchEnd = matches[matches.length - 1].matchEnd;
      let textContent = trimmed.slice(lastMatchEnd).trim();

      // Check for word-by-word karaoke timestamps like <00:14.20>Word
      let words: WordTimestamp[] | undefined = undefined;
      if (textContent.includes('<')) {
        const wordTokens: WordTimestamp[] = [];
        wordTimeRegex.lastIndex = 0;
        const wordMatches: { time: number; index: number; length: number }[] = [];
        let wm;
        while ((wm = wordTimeRegex.exec(textContent)) !== null) {
          const wMins = parseInt(wm[1], 10);
          const wSecs = parseInt(wm[2], 10);
          const wMsStr = wm[3] || '0';
          const wMs = wMsStr.length === 2 ? parseInt(wMsStr, 10) * 10 : parseInt(wMsStr, 10);
          wordMatches.push({
            time: wMins * 60 + wSecs + wMs / 1000,
            index: wm.index,
            length: wm[0].length,
          });
        }

        if (wordMatches.length > 0) {
          for (let i = 0; i < wordMatches.length; i++) {
            const startIdx = wordMatches[i].index + wordMatches[i].length;
            const endIdx = i < wordMatches.length - 1 ? wordMatches[i + 1].index : textContent.length;
            const word = textContent.slice(startIdx, endIdx).trim();
            const startTime = wordMatches[i].time;
            const endTime = i < wordMatches.length - 1 ? wordMatches[i + 1].time : startTime + 0.6;
            if (word) {
              wordTokens.push({ word, start: startTime, end: endTime });
            }
          }
          if (wordTokens.length > 0) {
            words = wordTokens;
          }
        }
        // Clean tags from pure text content
        textContent = textContent.replace(/<[^>]+>/g, '').trim();
      }

      for (const match of matches) {
        result.push({
          time: match.time,
          text: textContent,
          words,
        });
      }
    }

    result.sort((a, b) => a.time - b.time);
    return result;
  }

  /**
   * Parse audio file metadata from ArrayBuffer (ID3v2 for MP3, FLAC Vorbis comments, WAV chunks)
   */
  public static async parseAudioFile(file: File): Promise<Partial<Track>> {
    const filename = file.name;
    const ext = filename.split('.').pop()?.toUpperCase() || 'MP3';
    const baseName = filename.replace(/\.[^/.]+$/, '');

    let format: Track['format'] = 'MP3';
    let lossless = false;
    let hiRes = false;
    let bitDepth = 16;
    let sampleRate = 44100;

    if (ext === 'FLAC') {
      format = 'FLAC';
      lossless = true;
      hiRes = true;
      bitDepth = 24;
      sampleRate = 96000;
    } else if (ext === 'WAV') {
      format = 'WAV';
      lossless = true;
    } else if (ext === 'ALAC' || ext === 'M4A') {
      format = ext === 'ALAC' ? 'ALAC' : 'M4A';
      lossless = ext === 'ALAC';
    } else if (ext === 'OGG') {
      format = 'OGG';
    } else if (ext === 'APE') {
      format = 'APE';
      lossless = true;
    }

    const titleGuess = baseName.includes(' - ') ? baseName.split(' - ')[1] : baseName;
    const artistGuess = baseName.includes(' - ') ? baseName.split(' - ')[0] : 'Unknown Artist';

    const trackData: Partial<Track> = {
      title: titleGuess,
      artist: artistGuess,
      album: 'Unknown Album',
      duration: 180,
      format,
      lossless,
      hiRes,
      bitDepth,
      sampleRate,
      audioUrl: URL.createObjectURL(file),
      audioFile: file,
      playCount: 0,
      isFavorite: false,
    };

    try {
      // Read first 256KB for ID3 / Vorbis headers
      const buffer = await file.slice(0, 256 * 1024).arrayBuffer();
      const view = new DataView(buffer);

      // Check ID3v2 header
      if (buffer.byteLength >= 10 && view.getUint8(0) === 0x49 && view.getUint8(1) === 0x44 && view.getUint8(2) === 0x33) {
        const id3Data = this.parseID3v2(view, buffer);
        if (id3Data.title) trackData.title = id3Data.title;
        if (id3Data.artist) trackData.artist = id3Data.artist;
        if (id3Data.album) trackData.album = id3Data.album;
        if (id3Data.year) trackData.year = id3Data.year;
        if (id3Data.genre) trackData.genre = id3Data.genre;
        if (id3Data.coverArt) trackData.coverArt = id3Data.coverArt;
        if (id3Data.lyrics) {
          trackData.lyrics = this.parseLrcText(id3Data.lyrics);
          trackData.syncedLyrics = trackData.lyrics.length > 0;
        }
      }
    } catch {
      // Fallback to name guesses on parser exception
    }

    // Attempt to extract exact duration from HTMLAudioElement metadata
    try {
      const tempAudio = new Audio();
      tempAudio.src = trackData.audioUrl!;
      await new Promise<void>((resolve) => {
        tempAudio.addEventListener('loadedmetadata', () => {
          if (tempAudio.duration && isFinite(tempAudio.duration)) {
            trackData.duration = Math.round(tempAudio.duration);
          }
          resolve();
        });
        tempAudio.addEventListener('error', () => resolve());
        setTimeout(resolve, 800);
      });
    } catch {
      // Keep default duration
    }

    return trackData;
  }

  private static parseID3v2(view: DataView, buffer: ArrayBuffer) {
    const result: {
      title?: string;
      artist?: string;
      album?: string;
      year?: number;
      genre?: string;
      coverArt?: string;
      lyrics?: string;
    } = {};

    let pos = 10;
    const max = Math.min(buffer.byteLength, 128 * 1024);

    while (pos < max - 10) {
      const frameId = String.fromCharCode(
        view.getUint8(pos),
        view.getUint8(pos + 1),
        view.getUint8(pos + 2),
        view.getUint8(pos + 3)
      );

      if (!/^[A-Z0-9]{4}$/.test(frameId)) break;

      const size = view.getUint32(pos + 4);
      if (size <= 0 || pos + 10 + size > buffer.byteLength) break;

      const frameData = new Uint8Array(buffer, pos + 10, size);

      if (frameId === 'TIT2') {
        result.title = this.decodeText(frameData);
      } else if (frameId === 'TPE1') {
        result.artist = this.decodeText(frameData);
      } else if (frameId === 'TALB') {
        result.album = this.decodeText(frameData);
      } else if (frameId === 'TYER' || frameId === 'TDRC') {
        const yr = parseInt(this.decodeText(frameData), 10);
        if (!isNaN(yr)) result.year = yr;
      } else if (frameId === 'TCON') {
        result.genre = this.decodeText(frameData);
      } else if (frameId === 'USLT' || frameId === 'SYLT') {
        result.lyrics = this.decodeText(frameData);
      } else if (frameId === 'APIC') {
        // Extract album cover picture
        try {
          const mimeEnd = frameData.indexOf(0, 1);
          if (mimeEnd > 1) {
            const mime = new TextDecoder().decode(frameData.slice(1, mimeEnd)) || 'image/jpeg';
            // Skip picture type byte and description
            let imgStart = mimeEnd + 2;
            while (imgStart < frameData.length && frameData[imgStart] !== 0) imgStart++;
            imgStart++;
            const imgBytes = frameData.slice(imgStart);
            const blob = new Blob([imgBytes], { type: mime });
            result.coverArt = URL.createObjectURL(blob);
          }
        } catch {
          // ignore art parse error
        }
      }

      pos += 10 + size;
    }

    return result;
  }

  private static decodeText(bytes: Uint8Array): string {
    if (bytes.length <= 1) return '';
    const encoding = bytes[0];
    const textBytes = bytes.slice(1);
    try {
      if (encoding === 1 || encoding === 2) {
        return new TextDecoder('utf-16').decode(textBytes).replace(/\0/g, '').trim();
      }
      return new TextDecoder('utf-8').decode(textBytes).replace(/\0/g, '').trim();
    } catch {
      return '';
    }
  }
}
