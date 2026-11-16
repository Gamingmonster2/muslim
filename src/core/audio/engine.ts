/**
 * محرّك صوت واحد لكل التطبيق.
 *
 * سبب وجوده: في النسخة القديمة كان لكل شيخ iframe مستقل، فيبقى الصوت يعمل
 * في الإطار المخفي ويشغّل صوتان معًا. هنا يوجد عنصر <audio> واحد فقط،
 * ومن ثمّ يستحيل تقنيًا تشغيل صوتين في نفس الوقت.
 */

import { readNumber, writeNumber } from "../storage";
import type { AudioSnapshot, RepeatMode, Track } from "./types";

const POSITION_PREFIX = "ruqyah:pos:";
const LAST_TRACK_KEY = "ruqyah:last-track";
const RATE_KEY = "ruqyah:rate";
const VOLUME_KEY = "ruqyah:volume";
const REPEAT_KEY = "ruqyah:repeat";
const SAVE_EVERY_MS = 3000;
const RATES = [0.75, 1, 1.25, 1.5] as const;

const initialSnapshot: AudioSnapshot = {
  track: null,
  playing: false,
  waiting: false,
  currentTime: 0,
  duration: 0,
  buffered: 0,
  volume: 1,
  muted: false,
  rate: 1,
  repeat: "off",
  sleepEndsAt: null,
  error: null,
};

type Listener = () => void;

class AudioEngine {
  private audio: HTMLAudioElement | null = null;
  private snapshot: AudioSnapshot = initialSnapshot;
  private listeners = new Set<Listener>();
  private playlist: Track[] = [];
  private sleepTimer: number | null = null;
  private lastSavedAt = 0;
  private pendingResume = 0;

  /* ------------------------------ الاشتراك ------------------------------ */

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): AudioSnapshot => this.snapshot;

  private emit(): void {
    for (const listener of this.listeners) listener();
  }

  private patch(partial: Partial<AudioSnapshot>): void {
    const next: AudioSnapshot = { ...this.snapshot, ...partial };
    let changed = false;
    for (const key of Object.keys(partial) as (keyof AudioSnapshot)[]) {
      if (next[key] !== this.snapshot[key]) {
        changed = true;
        break;
      }
    }
    if (!changed) return;
    this.snapshot = next;
    this.emit();
  }

  /* ------------------------------ العنصر ------------------------------ */

  private el(): HTMLAudioElement {
    if (this.audio) return this.audio;

    const audio = new Audio();
    audio.preload = "metadata";
    audio.crossOrigin = null;

    audio.addEventListener("play", () => this.patch({ playing: true, error: null }));
    audio.addEventListener("pause", () => this.patch({ playing: false }));
    audio.addEventListener("waiting", () => this.patch({ waiting: true }));
    audio.addEventListener("playing", () => this.patch({ waiting: false }));
    audio.addEventListener("canplay", () => this.patch({ waiting: false }));
    audio.addEventListener("loadedmetadata", () => {
      this.patch({ duration: audio.duration || 0 });
      if (this.pendingResume > 0 && Number.isFinite(audio.duration)) {
        const max = Math.max(0, audio.duration - 2);
        audio.currentTime = Math.min(this.pendingResume, max);
        this.pendingResume = 0;
      }
    });
    audio.addEventListener("durationchange", () => this.patch({ duration: audio.duration || 0 }));
    audio.addEventListener("timeupdate", () => this.onTimeUpdate(audio));
    audio.addEventListener("progress", () => {
      const { buffered } = audio;
      const end = buffered.length ? buffered.end(buffered.length - 1) : 0;
      this.patch({ buffered: end });
    });
    audio.addEventListener("volumechange", () =>
      this.patch({ volume: audio.volume, muted: audio.muted })
    );
    audio.addEventListener("ratechange", () => this.patch({ rate: audio.playbackRate }));
    audio.addEventListener("ended", () => this.onEnded());
    audio.addEventListener("error", () => {
      this.patch({
        playing: false,
        waiting: false,
        error: "تعذّر تحميل الصوت. تحقّق من الاتصال بالإنترنت ثم أعد المحاولة.",
      });
    });

    this.audio = audio;
    return audio;
  }

  private onTimeUpdate(audio: HTMLAudioElement): void {
    this.patch({ currentTime: audio.currentTime, duration: audio.duration || 0 });

    const now = Date.now();
    if (now - this.lastSavedAt > SAVE_EVERY_MS && this.snapshot.track) {
      this.lastSavedAt = now;
      writeNumber(POSITION_PREFIX + this.snapshot.track.id, Math.floor(audio.currentTime));
    }
  }

  /* ------------------------------ التشغيل ------------------------------ */

  setPlaylist(tracks: Track[]): void {
    this.playlist = tracks;
  }

  /** يستعيد آخر مقطع وموضعه (بدون تشغيل تلقائي). */
  restore(): void {
    const lastId = (() => {
      try {
        return localStorage.getItem(LAST_TRACK_KEY);
      } catch {
        return null;
      }
    })();
    if (!lastId) return;
    const track = this.playlist.find((item) => item.id === lastId);
    if (!track) return;

    const savedRate = readNumber(RATE_KEY, 1);
    const savedVolume = readNumber(VOLUME_KEY, 1);
    const repeatRaw = (() => {
      try {
        return localStorage.getItem(REPEAT_KEY);
      } catch {
        return null;
      }
    })();
    const repeat: RepeatMode =
      repeatRaw === "one" || repeatRaw === "all" ? repeatRaw : "off";

    this.load(track, { seekTo: readNumber(POSITION_PREFIX + track.id, 0) });
    this.el().playbackRate = savedRate;
    this.el().volume = savedVolume;
    this.patch({ rate: savedRate, volume: savedVolume, repeat });
  }

  private load(track: Track, options: { seekTo?: number } = {}): void {
    if (this.snapshot.track?.id === track.id) return;

    this.savePositionNow();
    this.pendingResume = options.seekTo ?? readNumber(POSITION_PREFIX + track.id, 0);
    const audio = this.el();
    audio.src = track.src;
    audio.load();
    this.patch({
      track,
      currentTime: this.pendingResume,
      duration: 0,
      buffered: 0,
      error: null,
      waiting: true,
    });
    try {
      localStorage.setItem(LAST_TRACK_KEY, track.id);
    } catch {
      /* تجاهل */
    }
    this.updateMediaSession(track);
  }

  /** يشغّل مقطعًا (وقد يكون المقطع الحالي نفسه). */
  async play(track: Track): Promise<void> {
    this.load(track);
    await this.safePlay();
  }

  /** يحمّل مقطعًا دون تشغيل (لعرضه في المشغّل). */
  select(track: Track): void {
    this.load(track);
  }

  async toggle(): Promise<void> {
    if (!this.snapshot.track) return;
    if (this.snapshot.playing) {
      this.pause();
      return;
    }
    await this.safePlay();
  }

  private async safePlay(): Promise<void> {
    try {
      await this.el().play();
    } catch {
      this.patch({
        playing: false,
        waiting: false,
        error: "لم يبدأ التشغيل. اضغط زر التشغيل مرة أخرى.",
      });
    }
  }

  pause(): void {
    this.el().pause();
    this.savePositionNow();
  }

  seek(seconds: number): void {
    const audio = this.el();
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const target = Math.min(Math.max(seconds, 0), duration || Number.MAX_SAFE_INTEGER);
    audio.currentTime = target;
    this.patch({ currentTime: target });
  }

  skip(deltaSeconds: number): void {
    this.seek(this.snapshot.currentTime + deltaSeconds);
  }

  setRate(rate: number): void {
    this.el().playbackRate = rate;
    this.patch({ rate });
    writeNumber(RATE_KEY, rate);
  }

  cycleRate(): void {
    const index = RATES.indexOf(this.snapshot.rate as (typeof RATES)[number]);
    const next = RATES[(index + 1) % RATES.length] ?? 1;
    this.setRate(next);
  }

  setVolume(volume: number): void {
    const clamped = Math.min(1, Math.max(0, volume));
    const audio = this.el();
    audio.volume = clamped;
    audio.muted = clamped === 0;
    this.patch({ volume: clamped, muted: clamped === 0 });
    writeNumber(VOLUME_KEY, clamped);
  }

  toggleMute(): void {
    const audio = this.el();
    audio.muted = !audio.muted;
    this.patch({ muted: audio.muted });
  }

  cycleRepeat(): void {
    const order: RepeatMode[] = ["off", "one", "all"];
    const index = order.indexOf(this.snapshot.repeat);
    const next = order[(index + 1) % order.length] ?? "off";
    this.patch({ repeat: next });
    try {
      localStorage.setItem(REPEAT_KEY, next);
    } catch {
      /* تجاهل */
    }
  }

  /* --------------------------- مؤقت النوم --------------------------- */

  setSleepTimer(minutes: number | null): void {
    if (this.sleepTimer !== null) {
      window.clearInterval(this.sleepTimer);
      this.sleepTimer = null;
    }
    if (minutes === null || minutes <= 0) {
      this.patch({ sleepEndsAt: null });
      return;
    }
    const endsAt = Date.now() + minutes * 60_000;
    this.patch({ sleepEndsAt: endsAt });
    this.sleepTimer = window.setInterval(() => {
      if (Date.now() >= endsAt) {
        this.pause();
        this.setSleepTimer(null);
      }
    }, 1000);
  }

  /* ----------------------------- أحداث ----------------------------- */

  private onEnded(): void {
    const { repeat } = this.snapshot;
    const audio = this.el();

    if (repeat === "one") {
      audio.currentTime = 0;
      void this.safePlay();
      return;
    }

    if (repeat === "all" && this.playlist.length > 1) {
      const currentIndex = this.playlist.findIndex(
        (item) => item.id === this.snapshot.track?.id
      );
      const next = this.playlist[(currentIndex + 1) % this.playlist.length];
      if (next) {
        void this.play(next);
        return;
      }
    }

    this.patch({ playing: false });
    this.savePositionNow();
  }

  private savePositionNow(): void {
    if (!this.snapshot.track) return;
    writeNumber(POSITION_PREFIX + this.snapshot.track.id, Math.floor(this.snapshot.currentTime));
  }

  private updateMediaSession(track: Track): void {
    const nav = navigator as Navigator & {
      mediaSession?: {
        metadata: MediaMetadata | null;
        playbackState: MediaSessionPlaybackState;
        setActionHandler: (
          action: MediaSessionAction,
          handler: ((details: MediaSessionActionDetails) => void) | null
        ) => void;
      };
    };
    if (!nav.mediaSession || typeof MediaMetadata === "undefined") return;

    try {
      nav.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.sheikhName,
        album: "الرقية الشرعية",
        artwork: track.image ? [{ src: track.image, sizes: "512x512", type: "image/jpeg" }] : [],
      });
      nav.mediaSession.setActionHandler("play", () => void this.safePlay());
      nav.mediaSession.setActionHandler("pause", () => this.pause());
      nav.mediaSession.setActionHandler("seekbackward", () => this.skip(-10));
      nav.mediaSession.setActionHandler("seekforward", () => this.skip(10));
      nav.mediaSession.setActionHandler("seekto", (details) => {
        if (typeof details.seekTime === "number") this.seek(details.seekTime);
      });
    } catch {
      /* بعض المتصفحات لا تدعم واجهة الوسائط */
    }
  }
}

export const audioEngine = new AudioEngine();

export const PLAYBACK_RATES = RATES;
