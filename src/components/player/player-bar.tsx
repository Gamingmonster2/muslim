"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/components/player/audio-provider";
import { TrackRow } from "@/components/player/track-row";
import { Logo } from "@/components/brand/logo";
import { formatClock } from "@/lib/format";
import { getDictionary } from "@/lib/i18n";
import type { Locale, PlayerContext } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Download,
  Heart,
  ListMusic,
  Moon,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";

const RATES = [0.75, 1, 1.25, 1.5, 2];

export function PlayerBar({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const audio = useAudio();
  const [expanded, setExpanded] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showSleep, setShowSleep] = useState(false);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const current = audio.current;

  // قفل تمرير الصفحة عند فتح المشغل الموسّع
  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
      if (event.key === " " || event.code === "Space") {
        event.preventDefault();
        audio.toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded, audio]);

  if (!current) return null;

  const progress = audio.duration > 0 ? (audio.currentTime / audio.duration) * 100 : 0;
  const ctx: PlayerContext = audio.context ?? { title: current.title };
  const cover = ctx.cover ?? null;

  const cycleSpeed = () => {
    const index = RATES.indexOf(audio.rate);
    const next = RATES[(index + 1) % RATES.length];
    audio.setRate(next);
  };

  const toggleRepeat = () => audio.cycleRepeat();
  const repeatIcon =
    audio.repeat === "one" ? (
      <Repeat1 className="size-[18px]" />
    ) : (
      <Repeat className="size-[18px]" />
    );

  return (
    <>
      {/* الشريط المصغّر */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom,0px))] z-40 px-3 lg:bottom-4">
        <div className="pointer-events-auto mx-auto w-full max-w-3xl">
          <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-xl shadow-black/5 backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-muted">
              <div
                className="h-full bg-primary transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center gap-3 p-2 ps-3">
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted"
                aria-label={dict.actions.expand}
              >
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt="" className="size-full object-cover" />
                ) : (
                  <Logo size={44} className="rounded-none" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="min-w-0 flex-1 text-start"
              >
                <p className="truncate text-sm font-bold text-foreground">
                  {current.title[locale]}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {ctx.title[locale]}
                </p>
              </button>

              <button
                type="button"
                onClick={audio.toggle}
                aria-label={audio.isPlaying ? dict.actions.pause : dict.actions.play}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform active:scale-95"
              >
                {audio.isPlaying ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4 translate-x-px rtl:-translate-x-px" />
                )}
              </button>

              <button
                type="button"
                onClick={audio.next}
                aria-label={dict.actions.next}
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
              >
                <SkipForward className="size-[18px]" />
              </button>

              <button
                type="button"
                onClick={() => setExpanded(true)}
                aria-label={dict.actions.expand}
                className="hidden size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
              >
                <ChevronDown className="size-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* المشغّل الموسّع */}
      {expanded && (
        <div
          className="fixed inset-0 z-[70] flex flex-col bg-background"
          role="dialog"
          aria-modal="true"
          aria-label={dict.player.nowPlaying}
        >
          <div className="relative flex items-center justify-between border-b border-border/60 px-3 py-2.5">
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={dict.actions.minimize}
            >
              <ChevronDown className="size-5" />
            </button>
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {dict.player.nowPlaying}
            </span>
            <button
              type="button"
              onClick={() => setShowQueue((value) => !value)}
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-full transition-colors",
                showQueue ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              aria-label={dict.player.trackList}
            >
              <ListMusic className="size-4" />
            </button>
          </div>

          <div ref={bodyRef} className="flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-md flex-col px-6 pb-28 pt-6">
              {/* الغلاف */}
              <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/15 via-muted to-gold/20 shadow-2xl shadow-black/10">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover}
                    alt=""
                    className="size-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <Logo size={120} className="rounded-3xl" />
                  </div>
                )}
              </div>

              {/* العنوان */}
              <div className="mt-6 text-center">
                <h2 className="font-display text-xl font-bold leading-snug text-foreground">
                  {current.title[locale]}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{ctx.title[locale]}</p>
              </div>

              {/* شريط التقدم */}
              <div className="mt-6" dir="ltr">
                <input
                  type="range"
                  min={0}
                  max={audio.duration || 0}
                  step={0.5}
                  value={audio.currentTime}
                  onChange={(event) => audio.seek(Number(event.target.value))}
                  className="audio-range w-full"
                  aria-label={dict.a11y.seek}
                />
                <div className="mt-1 flex items-center justify-between text-[11px] font-medium tabular-nums text-muted-foreground">
                  <span>{formatClock(audio.currentTime, dict.player.unknownDuration)}</span>
                  <span>{formatClock(audio.duration, dict.player.unknownDuration)}</span>
                </div>
              </div>

              {/* أدوات التحكم الرئيسية */}
              <div className="mt-4 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={audio.toggleShuffle}
                  aria-label={dict.actions.shuffle}
                  className={cn(
                    "inline-flex size-10 items-center justify-center rounded-full transition-colors",
                    audio.shuffle ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Shuffle className="size-[18px]" />
                </button>
                <button
                  type="button"
                  onClick={audio.prev}
                  aria-label={dict.actions.previous}
                  className="inline-flex size-12 items-center justify-center rounded-full text-foreground hover:bg-muted"
                >
                  <SkipBack className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={audio.toggle}
                  aria-label={audio.isPlaying ? dict.actions.pause : dict.actions.play}
                  className="inline-flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/25 transition-transform active:scale-95"
                >
                  {audio.isPlaying ? (
                    <Pause className="size-6" />
                  ) : (
                    <Play className="size-6 translate-x-0.5 rtl:-translate-x-0.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={audio.next}
                  aria-label={dict.actions.next}
                  className="inline-flex size-12 items-center justify-center rounded-full text-foreground hover:bg-muted"
                >
                  <SkipForward className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={toggleRepeat}
                  aria-label={dict.actions.repeat}
                  className={cn(
                    "inline-flex size-10 items-center justify-center rounded-full transition-colors",
                    audio.repeat !== "off" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {audio.repeat !== "off" ? (
                    repeatIcon
                  ) : (
                    <Repeat className="size-[18px]" />
                  )}
                </button>
              </div>

              {/* أدوات ثانوية */}
              <div className="mt-6 grid grid-cols-3 items-center gap-3">
                <button
                  type="button"
                  onClick={() => audio.toggleFavorite(current)}
                  aria-label={dict.actions.favorite}
                  className={cn(
                    "inline-flex h-10 items-center justify-center gap-1.5 rounded-full border text-xs font-semibold transition-colors",
                    audio.isFavorite(current.id)
                      ? "border-rose-500/30 bg-rose-500/10 text-rose-500"
                      : "border-border/80 bg-card text-foreground hover:bg-muted"
                  )}
                >
                  <Heart
                    className="size-4"
                    fill={audio.isFavorite(current.id) ? "currentColor" : "none"}
                  />
                  <span className="hidden sm:inline">
                    {audio.isFavorite(current.id) ? dict.actions.unfavorite : dict.actions.favorite}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={cycleSpeed}
                  aria-label={dict.player.speedLabel}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-border/80 bg-card text-xs font-bold text-foreground transition-colors hover:bg-muted"
                >
                  {audio.rate}×
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSleep((value) => !value)}
                    aria-label={dict.actions.sleepTimer}
                    className={cn(
                      "inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full border text-xs font-semibold transition-colors",
                      audio.sleep.mode !== "off"
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border/80 bg-card text-foreground hover:bg-muted"
                    )}
                  >
                    <Moon className="size-4" />
                    <span>
                      {audio.sleep.mode === "off"
                        ? dict.actions.sleepTimer
                        : audio.sleepRemaining != null
                          ? formatClock(audio.sleepRemaining)
                          : dict.player.sleepEnd}
                    </span>
                  </button>
                  {showSleep && (
                    <div className="absolute bottom-12 end-0 z-10 w-44 rounded-xl border border-border/70 bg-popover p-1.5 shadow-xl">
                      {[15, 30, 45, 60].map((minutes) => (
                        <button
                          key={minutes}
                          type="button"
                          onClick={() => {
                            audio.setSleepMinutes(minutes);
                            setShowSleep(false);
                          }}
                          className="block w-full rounded-lg px-3 py-2 text-start text-sm font-medium text-foreground hover:bg-muted"
                        >
                          {minutes} {dict.player.minutesShort}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          audio.setSleepToEnd();
                          setShowSleep(false);
                        }}
                        className="block w-full rounded-lg px-3 py-2 text-start text-sm font-medium text-foreground hover:bg-muted"
                      >
                        {dict.player.sleepEnd}
                      </button>
                      {audio.sleep.mode !== "off" && (
                        <button
                          type="button"
                          onClick={() => {
                            audio.clearSleep();
                            setShowSleep(false);
                          }}
                          className="block w-full rounded-lg px-3 py-2 text-start text-sm font-medium text-muted-foreground hover:bg-muted"
                        >
                          {dict.player.sleepOff}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* مستوى الصوت */}
              <div className="mt-5 flex items-center gap-3" dir="ltr">
                <button
                  type="button"
                  onClick={audio.toggleMute}
                  aria-label={audio.muted ? dict.actions.unmute : dict.actions.mute}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className={audio.muted ? "size-4" : "hidden"} />
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={audio.muted ? 0 : audio.volume}
                  onChange={(event) => audio.setVolume(Number(event.target.value))}
                  className="audio-range flex-1"
                  aria-label={dict.player.volume}
                />
                <span className="w-8 text-end text-[11px] font-semibold tabular-nums text-muted-foreground">
                  {Math.round((audio.muted ? 0 : audio.volume) * 100)}%
                </span>
              </div>

              {/* روابط */}
              <div className="mt-6 flex items-center justify-center gap-2">
                <a
                  href={current.url}
                  download
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  <Download className="size-4" />
                  {dict.player.downloadTrack}
                </a>
                {current.sourceUrl && (
                  <a
                    href={current.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    {dict.actions.source}
                  </a>
                )}
              </div>
            </div>

            {/* قائمة التشغيل */}
            {showQueue && (
              <div className="border-t border-border/60 bg-muted/20">
                <div className="mx-auto w-full max-w-2xl px-4 py-4">
                  <h3 className="mb-3 text-sm font-bold text-foreground">
                    {dict.player.trackList}{" "}
                    <span className="font-normal text-muted-foreground">
                      ({audio.queue.length})
                    </span>
                  </h3>
                  <div className="space-y-1.5">
                    {audio.queue.map((track, index) => (
                      <TrackRow
                        key={`${track.id}-${index}`}
                        track={track}
                        queue={audio.queue}
                        index={index}
                        context={ctx}
                        locale={locale}
                        showIndex
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
