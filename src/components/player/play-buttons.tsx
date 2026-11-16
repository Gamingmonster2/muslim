"use client";

import { useAudio } from "@/components/player/audio-provider";
import { getDictionary } from "@/lib/i18n";
import type { Locale, PlayerContext, Track } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Loader2, Pause, Play } from "lucide-react";

export function PlayAllButton({
  tracks,
  context,
  locale,
  label,
  className,
  variant = "primary",
}: {
  tracks: Track[];
  context: PlayerContext;
  locale: Locale;
  label?: string;
  className?: string;
  variant?: "primary" | "outline";
}) {
  const dict = getDictionary(locale);
  const { playQueue, current, isPlaying, toggle } = useAudio();

  const isThisQueue = Boolean(
    current && tracks.some((track) => track.url === current.url)
  );

  const handleClick = () => {
    if (isThisQueue) {
      toggle();
      return;
    }
    playQueue(tracks, 0, context);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold transition-all active:translate-y-px",
        variant === "primary"
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
          : "border border-border/80 bg-card text-foreground hover:bg-muted",
        className
      )}
    >
      {isThisQueue && isPlaying ? (
        <Pause className="size-4" />
      ) : (
        <Play className="size-4 ps-0.5" />
      )}
      <span>{isThisQueue && isPlaying ? dict.actions.pause : label ?? dict.actions.playAll}</span>
    </button>
  );
}

export function PlayButtonBig({
  tracks,
  context,
  locale,
  className,
}: {
  tracks: Track[];
  context: PlayerContext;
  locale: Locale;
  className?: string;
}) {
  const dict = getDictionary(locale);
  const { playQueue, current, isPlaying, isLoading, toggle } = useAudio();
  const isThis = Boolean(current && tracks.some((track) => track.url === current.url));

  return (
    <button
      type="button"
      onClick={() => (isThis ? toggle() : playQueue(tracks, 0, context))}
      aria-label={isThis && isPlaying ? dict.actions.pause : dict.actions.play}
      className={cn(
        "relative inline-flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/25 transition-transform hover:scale-105 active:scale-95",
        className
      )}
    >
      <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />
      {isLoading && isThis ? (
        <Loader2 className="size-6 animate-spin" />
      ) : isThis && isPlaying ? (
        <Pause className="size-6" />
      ) : (
        <Play className="size-6 translate-x-0.5 rtl:-translate-x-0.5" />
      )}
    </button>
  );
}
