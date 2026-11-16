"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import type { Locale, PlayerContext as TrackContext, Track } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { readStorage, writeStorage, STORAGE_KEYS } from "@/lib/storage";

export type RepeatMode = "off" | "all" | "one";
export type SleepMode = "off" | "minutes" | "end";

export interface LastPlayed {
  track: Track;
  context: TrackContext | null;
  position: number;
  updatedAt: number;
}

export interface SleepTimer {
  mode: SleepMode;
  endsAt: number | null;
  minutes: number | null;
}

interface AudioContextValue {
  queue: Track[];
  index: number;
  current: Track | null;
  context: TrackContext | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  muted: boolean;
  rate: number;
  repeat: RepeatMode;
  shuffle: boolean;
  sleep: SleepTimer;
  sleepRemaining: number | null;
  favorites: string[];
  error: string | null;
  lastPlayed: LastPlayed | null;
  playQueue: (tracks: Track[], startIndex?: number, ctx?: TrackContext | null) => void;
  playTrack: (track: Track, ctx?: TrackContext | null) => void;
  toggle: () => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  skipBy: (seconds: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  setRate: (value: number) => void;
  cycleRepeat: () => void;
  toggleShuffle: () => void;
  setSleepMinutes: (minutes: number | null) => void;
  setSleepToEnd: () => void;
  clearSleep: () => void;
  toggleFavorite: (track: Track) => void;
  isFavorite: (trackId: string) => boolean;
  stop: () => void;
  resumeLast: () => void;
  retry: () => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

interface PlayerSettings {
  volume: number;
  muted: boolean;
  rate: number;
  repeat: RepeatMode;
  shuffle: boolean;
}

const DEFAULT_SETTINGS: PlayerSettings = {
  volume: 1,
  muted: false,
  rate: 1,
  repeat: "off",
  shuffle: false,
};

export function AudioProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldPlayRef = useRef(false);
  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const errorToastAtRef = useRef(0);

  const [queue, setQueue] = useState<Track[]>([]);
  const [index, setIndex] = useState(0);
  const [context, setContext] = useState<TrackContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [lastPlayed, setLastPlayed] = useState<LastPlayed | null>(null);
  const [sleep, setSleep] = useState<SleepTimer>({ mode: "off", endsAt: null, minutes: null });
  const [sleepRemaining, setSleepRemaining] = useState<number | null>(null);

  const [settings, setSettings] = useState<PlayerSettings>(DEFAULT_SETTINGS);
  const { volume, muted, rate, repeat, shuffle } = settings;

  const current = queue[index] ?? null;

  /* ------------------------------ التهيئة ------------------------------ */
  useEffect(() => {
    const savedSettings = readStorage<Partial<PlayerSettings>>(
      STORAGE_KEYS.playerSettings,
      {}
    );
    setSettings({ ...DEFAULT_SETTINGS, ...savedSettings });
    setFavorites(readStorage<string[]>(STORAGE_KEYS.favorites, []));
    setLastPlayed(readStorage<LastPlayed | null>(STORAGE_KEYS.lastPlayed, null));
  }, []);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.playerSettings, settings);
  }, [settings]);

  /* --------------------------- تحميل المقطع --------------------------- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!current) {
      audio.removeAttribute("src");
      audio.load();
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }
    setError(null);
    setIsLoading(true);
    setCurrentTime(0);
    setDuration(current.duration ?? 0);
    audio.src = current.url;
    audio.load();
    audio.volume = volume;
    audio.muted = muted;
    audio.playbackRate = rate;

    if (shouldPlayRef.current) {
      const playPromise = audio.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {
          setIsPlaying(false);
          setIsLoading(false);
        });
      }
    }
    // إعادة التعيين لا تعتمد على إعدادات الصوت حتى لا تُعاد التهيئة مع كل تغيير
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, attempt]);

  /* ------------------------- أحداث عنصر الصوت ------------------------- */
  const onTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
  }, []);

  const onLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const value = Number.isFinite(audio.duration) ? audio.duration : 0;
    setDuration(value || current?.duration || 0);
    setIsLoading(false);
  }, [current?.duration]);

  const onProgress = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.buffered.length) return;
    for (let i = 0; i < audio.buffered.length; i += 1) {
      if (
        audio.buffered.start(i) <= audio.currentTime &&
        audio.currentTime <= audio.buffered.end(i)
      ) {
        setBuffered(audio.buffered.end(i));
        return;
      }
    }
    setBuffered(audio.buffered.end(audio.buffered.length - 1));
  }, []);

  const handleNext = useCallback(
    (auto = false) => {
      if (!queue.length) return;
      if (auto && repeat === "one") {
        const audio = audioRef.current;
        if (audio) {
          audio.currentTime = 0;
          void audio.play();
        }
        return;
      }
      if (shuffle && queue.length > 1) {
        let nextIndex = index;
        while (nextIndex === index) {
          nextIndex = Math.floor(Math.random() * queue.length);
        }
        shouldPlayRef.current = true;
        setIndex(nextIndex);
        return;
      }
      const isLast = index >= queue.length - 1;
      if (isLast && auto && repeat === "off") {
        setIsPlaying(false);
        return;
      }
      shouldPlayRef.current = true;
      setIndex(isLast ? 0 : index + 1);
    },
    [index, queue.length, repeat, shuffle]
  );

  const handleEnded = useCallback(() => {
    if (sleep.mode === "end") {
      setIsPlaying(false);
      setSleep({ mode: "off", endsAt: null, minutes: null });
      return;
    }
    handleNext(true);
  }, [handleNext, sleep.mode]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setIsPlaying(false);
    setError(dict.player.error);
    const now = Date.now();
    if (now - errorToastAtRef.current > 8000) {
      errorToastAtRef.current = now;
      toast.error(dict.player.error, {
        action: { label: dict.actions.retry, onClick: () => setAttempt((n) => n + 1) },
      });
    }
  }, [dict.player.error, dict.actions.retry]);

  /* --------------------------- المدد والتخزين --------------------------- */
  useEffect(() => {
    if (!current) return;
    const interval = setInterval(() => {
      const audio = audioRef.current;
      if (!audio || audio.paused) return;
      const last: LastPlayed = {
        track: current,
        context,
        position: audio.currentTime,
        updatedAt: Date.now(),
      };
      setLastPlayed(last);
      writeStorage(STORAGE_KEYS.lastPlayed, last);
    }, 5000);
    return () => clearInterval(interval);
  }, [current, context]);

  /* ----------------------------- الإجراءات ----------------------------- */
  const playQueue = useCallback(
    (tracks: Track[], startIndex = 0, ctx: TrackContext | null = null) => {
      if (!tracks.length) return;
      const safeIndex = Math.min(Math.max(0, startIndex), tracks.length - 1);
      shouldPlayRef.current = true;
      setQueue(tracks);
      setIndex(safeIndex);
      setContext(ctx);
      setIsPlaying(true);
    },
    []
  );

  const playTrack = useCallback(
    (track: Track, ctx: TrackContext | null = null) => {
      playQueue([track], 0, ctx);
    },
    [playQueue]
  );

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    setSleep((prev) => (prev.mode === "off" ? prev : prev));
    void audio.play();
  }, [current]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  }, [current]);

  const next = useCallback(() => {
    shouldPlayRef.current = true;
    handleNext(false);
  }, [handleNext]);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 4) {
      audio.currentTime = 0;
      return;
    }
    shouldPlayRef.current = true;
    setIndex((value) => (value <= 0 ? queue.length - 1 : value - 1));
  }, [queue.length]);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const target = Math.max(0, Math.min(seconds, audio.duration || seconds));
    audio.currentTime = target;
    setCurrentTime(target);
  }, []);

  const skipBy = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    seek(audio.currentTime + seconds);
  }, [seek]);

  const setVolume = useCallback((value: number) => {
    const clamped = Math.min(1, Math.max(0, value));
    setSettings((prev) => ({ ...prev, volume: clamped, muted: clamped === 0 ? prev.muted : false }));
    const audio = audioRef.current;
    if (audio) {
      audio.volume = clamped;
      if (clamped > 0 && audio.muted) audio.muted = false;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setSettings((prev) => ({ ...prev, muted: !prev.muted }));
    const audio = audioRef.current;
    if (audio) audio.muted = !muted;
  }, [muted]);

  const setRate = useCallback((value: number) => {
    setSettings((prev) => ({ ...prev, rate: value }));
    const audio = audioRef.current;
    if (audio) audio.playbackRate = value;
  }, []);

  const cycleRepeat = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      repeat: prev.repeat === "off" ? "all" : prev.repeat === "all" ? "one" : "off",
    }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setSettings((prev) => ({ ...prev, shuffle: !prev.shuffle }));
  }, []);

  /* --------------------------- مؤقت النوم --------------------------- */
  const clearSleep = useCallback(() => {
    setSleep({ mode: "off", endsAt: null, minutes: null });
    setSleepRemaining(null);
    if (fadeTimerRef.current) {
      clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  }, []);

  const setSleepMinutes = useCallback(
    (minutes: number | null) => {
      if (!minutes) {
        clearSleep();
        return;
      }
      setSleep({
        mode: "minutes",
        endsAt: Date.now() + minutes * 60_000,
        minutes,
      });
    },
    [clearSleep]
  );

  const setSleepToEnd = useCallback(() => {
    setSleep({ mode: "end", endsAt: null, minutes: null });
    setSleepRemaining(null);
  }, []);

  useEffect(() => {
    if (sleep.mode !== "minutes" || !sleep.endsAt) {
      setSleepRemaining(null);
      return;
    }
    const tick = () => {
      const remaining = Math.max(0, Math.round((sleep.endsAt! - Date.now()) / 1000));
      setSleepRemaining(remaining);
      if (remaining > 0) return;
      // تلاشٍ تدريجي ثم إيقاف
      clearSleep();
      const audio = audioRef.current;
      if (!audio) return;
      const originalVolume = audio.volume;
      let step = 0;
      fadeTimerRef.current = setInterval(() => {
        step += 1;
        audio.volume = Math.max(0, originalVolume * (1 - step / 10));
        if (step >= 10) {
          if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
          fadeTimerRef.current = null;
          audio.pause();
          audio.volume = originalVolume;
        }
      }, 400);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [sleep, clearSleep]);

  /* --------------------------- المفضلة --------------------------- */
  const toggleFavorite = useCallback(
    (track: Track) => {
      setFavorites((prev) => {
        const exists = prev.includes(track.id);
        const nextValue = exists
          ? prev.filter((id) => id !== track.id)
          : [...prev, track.id];
        writeStorage(STORAGE_KEYS.favorites, nextValue);
        toast.success(
          exists ? dict.player.removedFromFavorites : dict.player.addedToFavorites
        );
        return nextValue;
      });
    },
    [dict.player.addedToFavorites, dict.player.removedFromFavorites]
  );

  const isFavorite = useCallback(
    (trackId: string) => favorites.includes(trackId),
    [favorites]
  );

  const stop = useCallback(() => {
    shouldPlayRef.current = false;
    setQueue([]);
    setIndex(0);
    setContext(null);
    setIsPlaying(false);
    clearSleep();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
  }, [clearSleep]);

  const resumeLast = useCallback(() => {
    if (!lastPlayed) return;
    shouldPlayRef.current = true;
    setQueue([lastPlayed.track]);
    setIndex(0);
    setContext(lastPlayed.context);
    setIsPlaying(true);
    const audio = audioRef.current;
    if (audio) {
      const startAt = lastPlayed.position;
      const handler = () => {
        audio.currentTime = startAt;
        audio.removeEventListener("loadedmetadata", handler);
      };
      audio.addEventListener("loadedmetadata", handler);
    }
  }, [lastPlayed]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  /* --------------------------- Media Session --------------------------- */
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    if (!current) {
      navigator.mediaSession.metadata = null;
      return;
    }
    const artwork: MediaImage[] = [];
    const cover = context?.cover ?? null;
    if (cover) {
      artwork.push({ src: cover, sizes: "512x512", type: "image/jpeg" });
    }
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: current.title[locale],
        artist: context?.title?.[locale] ?? dict.brand.name,
        album: dict.brand.name,
        artwork,
      });
    } catch {
      /* بعض المتصفحات لا تدعم artwork */
    }
  }, [current, context, locale, dict.brand.name]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    try {
      ms.setActionHandler("play", () => play());
      ms.setActionHandler("pause", () => pause());
      ms.setActionHandler("nexttrack", () => next());
      ms.setActionHandler("previoustrack", () => prev());
      ms.setActionHandler("seekbackward", (details) => skipBy(-(details.seekOffset || 10)));
      ms.setActionHandler("seekforward", (details) => skipBy(details.seekOffset || 10));
      ms.setActionHandler("seekto", (details) => {
        if (typeof details.seekTime === "number") seek(details.seekTime);
      });
    } catch {
      /* تجاهل */
    }
    return () => {
      try {
        ms.setActionHandler("play", null);
        ms.setActionHandler("pause", null);
        ms.setActionHandler("nexttrack", null);
        ms.setActionHandler("previoustrack", null);
        ms.setActionHandler("seekbackward", null);
        ms.setActionHandler("seekforward", null);
        ms.setActionHandler("seekto", null);
      } catch {
        /* تجاهل */
      }
    };
  }, [play, pause, next, prev, skipBy, seek]);

  /* --------------------------- قيمة السياق --------------------------- */
  const value = useMemo<AudioContextValue>(
    () => ({
      queue,
      index,
      current,
      context,
      isPlaying,
      isLoading,
      currentTime,
      duration,
      buffered,
      volume,
      muted,
      rate,
      repeat,
      shuffle,
      sleep,
      sleepRemaining,
      favorites,
      error,
      lastPlayed,
      playQueue,
      playTrack,
      toggle,
      play,
      pause,
      next,
      prev,
      seek,
      skipBy,
      setVolume,
      toggleMute,
      setRate,
      cycleRepeat,
      toggleShuffle,
      setSleepMinutes,
      setSleepToEnd,
      clearSleep,
      toggleFavorite,
      isFavorite,
      stop,
      resumeLast,
      retry,
    }),
    [
      queue,
      index,
      current,
      context,
      isPlaying,
      isLoading,
      currentTime,
      duration,
      buffered,
      volume,
      muted,
      rate,
      repeat,
      shuffle,
      sleep,
      sleepRemaining,
      favorites,
      error,
      lastPlayed,
      playQueue,
      playTrack,
      toggle,
      play,
      pause,
      next,
      prev,
      seek,
      skipBy,
      setVolume,
      toggleMute,
      setRate,
      cycleRepeat,
      toggleShuffle,
      setSleepMinutes,
      setSleepToEnd,
      clearSleep,
      toggleFavorite,
      isFavorite,
      stop,
      resumeLast,
      retry,
    ]
  );

  return (
    <AudioContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="metadata"
        className="hidden"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onProgress={onProgress}
        onEnded={handleEnded}
        onError={handleError}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onCanPlay={() => setIsLoading(false)}
      />
    </AudioContext.Provider>
  );
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
