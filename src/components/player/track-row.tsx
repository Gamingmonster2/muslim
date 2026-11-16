"use client";

import { useAudio } from "@/components/player/audio-provider";
import { formatClock } from "@/lib/format";
import { getDictionary } from "@/lib/i18n";
import type { Locale, PlayerContext, Track } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Download, Heart, Pause, Play } from "lucide-react";
import { toast } from "sonner";

export function TrackRow({
  track,
  queue,
  index,
  context,
  locale,
  showIndex = false,
  className,
}: {
  track: Track;
  queue: Track[];
  index: number;
  context: PlayerContext;
  locale: Locale;
  showIndex?: boolean;
  className?: string;
}) {
  const dict = getDictionary(locale);
  const { current, isPlaying, playQueue, toggle, isFavorite, toggleFavorite } = useAudio();

  const active = current?.url === track.url;
  const playingThis = active && isPlaying;

  const handlePlay = () => {
    if (active) {
      toggle();
      return;
    }
    playQueue(queue, index, context);
  };

  const handleFavorite = () => {
    toggleFavorite(track);
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
        active
          ? "border-primary/30 bg-primary/5"
          : "border-transparent hover:border-border/70 hover:bg-muted/50",
        className
      )}
    >
      <button
        type="button"
        onClick={handlePlay}
        aria-label={playingThis ? dict.actions.pause : dict.actions.play}
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors",
          active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border/80 bg-card text-foreground group-hover:border-primary/40 group-hover:text-primary"
        )}
      >
        {playingThis ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4 translate-x-px rtl:-translate-x-px" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-semibold",
            active ? "text-primary" : "text-foreground"
          )}
        >
          {showIndex && (
            <span className="me-2 inline-block min-w-5 text-xs font-bold text-muted-foreground">
              {index + 1}.
            </span>
          )}
          {track.title[locale]}
        </p>
        {active && (
          <p className="mt-0.5 truncate text-[11px] font-medium text-primary/80">
            {dict.player.nowPlaying}
          </p>
        )}
      </div>

      <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
        {formatClock(track.duration, dict.player.unknownDuration)}
      </span>

      <div className="flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          onClick={handleFavorite}
          aria-label={isFavorite(track.id) ? dict.actions.unfavorite : dict.actions.favorite}
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-full transition-colors",
            isFavorite(track.id)
              ? "text-rose-500 hover:bg-rose-500/10"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Heart
            className="size-4"
            fill={isFavorite(track.id) ? "currentColor" : "none"}
          />
        </button>
        <a
          href={track.url}
          download
          target="_blank"
          rel="noreferrer noopener"
          aria-label={dict.actions.download}
          className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={() => toast.success(dict.player.downloadTrack)}
        >
          <Download className="size-4" />
        </a>
      </div>
    </div>
  );
}

export function ShareTrackButton({ track, locale }: { track: Track; locale: Locale }) {
  const dict = getDictionary(locale);
  const share = async () => {
    const data = {
      title: track.title[locale],
      url: track.sourceUrl ?? track.url,
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        /* المستخدم ألغى */
      }
    }
    try {
      await navigator.clipboard.writeText(data.url);
      toast.success(dict.actions.copied);
    } catch {
      toast.error(dict.errors.generic);
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 text-xs font-semibold text-foreground hover:bg-muted"
    >
      {dict.actions.share}
    </button>
  );
}
