"use client";

import Link from "next/link";
import { PlayButtonBig } from "@/components/player/play-buttons";
import { DefaultArt } from "@/components/shared/default-art";
import { getDictionary, libraryPath } from "@/lib/i18n";
import type { LibraryItemSummary, Locale, PlayerContext } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BookOpen, Mic2 } from "lucide-react";

export function LibraryCard({
  item,
  locale,
  className,
}: {
  item: LibraryItemSummary;
  locale: Locale;
  className?: string;
}) {
  const dict = getDictionary(locale);
  const href = libraryPath(locale, item.id);
  const isMushaf = item.category === "mushaf";

  const context: PlayerContext = {
    title: item.title,
    cover: item.cover,
    href,
    kind: isMushaf ? "mushaf" : "hadith",
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5",
        className
      )}
    >
      <Link href={href} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {item.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.cover}
              alt={item.title[locale]}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <DefaultArt label={item.creator[locale]} />
          )}
          <span className="absolute top-2.5 start-2.5 inline-flex items-center gap-1 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-bold text-foreground shadow-sm backdrop-blur">
            {isMushaf ? <Mic2 className="size-3" /> : <BookOpen className="size-3" />}
            {isMushaf ? dict.library.tabs.mushaf : dict.library.tabs.hadith}
          </span>
        </div>
        <div className="p-3">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-tight text-foreground">
            {item.title[locale]}
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {item.trackCount} {dict.library.tracksCount}
            {" · "}
            {item.totalMinutes >= 60
              ? `${Math.round(item.totalMinutes / 60)} ${dict.library.hours}`
              : `${item.totalMinutes} ${dict.library.minutes}`}
          </p>
        </div>
      </Link>
      {item.firstTrack && (
        <div className="absolute bottom-14 end-3">
          <PlayButtonBig
            tracks={[item.firstTrack]}
            context={context}
            locale={locale}
            className="size-11"
          />
        </div>
      )}
    </div>
  );
}
