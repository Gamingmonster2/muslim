"use client";

import { useEffect, useState } from "react";
import { PlayAllButton } from "@/components/player/play-buttons";
import { TrackRow } from "@/components/player/track-row";
import { getLibraryTracksPath } from "@/lib/content";
import { formatMinutesHuman } from "@/lib/format";
import { getDictionary, libraryPath } from "@/lib/i18n";
import type { LibraryCategory, Locale, PlayerContext, Track } from "@/lib/types";
import { Loader2, Search } from "lucide-react";

interface LibraryFile {
  id: string;
  title: { ar: string; en: string };
  creator: { ar: string; en: string };
  cover: string | null;
  sourceUrl: string;
  tracks: Track[];
}

export function TrackListLoader({
  itemId,
  category,
  locale,
}: {
  itemId: string;
  category: LibraryCategory;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const [data, setData] = useState<LibraryFile | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(getLibraryTracksPath(itemId))
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((json: LibraryFile) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [itemId]);

  const context: PlayerContext = {
    title: data?.title ?? { ar: "", en: "" },
    cover: data?.cover ?? null,
    href: libraryPath(locale, itemId),
    kind: category === "mushaf" ? "mushaf" : "hadith",
  };

  if (error) {
    return (
      <p className="rounded-2xl border border-destructive/25 bg-destructive/5 p-5 text-center text-sm text-destructive">
        {dict.errors.audioFailed}
      </p>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        {dict.library.loadingTracks}
      </div>
    );
  }

  const normalized = query.trim().toLowerCase();
  const tracks = normalized
    ? data.tracks.filter((track) =>
        `${track.title.ar} ${track.title.en}`.toLowerCase().includes(normalized)
      )
    : data.tracks;

  const totalSeconds = data.tracks.reduce((sum, track) => sum + (track.duration ?? 0), 0);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="font-bold text-foreground">
            {data.tracks.length} {dict.library.tracksCount}
          </span>
          <span>·</span>
          <span>{formatMinutesHuman(Math.round(totalSeconds / 60), locale)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={dict.actions.search}
              className="h-9 w-40 rounded-full border border-border/70 bg-card ps-9 pe-3 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 sm:w-48"
            />
          </div>
          <PlayAllButton tracks={data.tracks} context={context} locale={locale} />
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        {tracks.map((track, index) => (
          <TrackRow
            key={track.id}
            track={track}
            queue={data.tracks}
            index={data.tracks.findIndex((t) => t.id === track.id)}
            context={context}
            locale={locale}
            showIndex={track.surahIndex != null}
          />
        ))}
      </div>
    </div>
  );
}
