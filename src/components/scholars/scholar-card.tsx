"use client";

import Link from "next/link";
import { PlayButtonBig } from "@/components/player/play-buttons";
import { DefaultArt } from "@/components/shared/default-art";
import { formatNumber } from "@/lib/format";
import { getDictionary, scholarPath } from "@/lib/i18n";
import type { Locale, PlayerContext, Scholar } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Headphones } from "lucide-react";

const RUQYAH_LABEL = { ar: "الرقية الشرعية", en: "Ruqyah" };

export function ScholarCard({
  scholar,
  locale,
  className,
}: {
  scholar: Scholar;
  locale: Locale;
  className?: string;
}) {
  const dict = getDictionary(locale);
  const href = scholarPath(locale, scholar.id);
  const context: PlayerContext = {
    title: scholar.name,
    subtitle: RUQYAH_LABEL,
    cover: scholar.image,
    href,
    kind: "ruqyah",
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
          {scholar.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={scholar.image}
              alt={scholar.name[locale]}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <DefaultArt label={scholar.name[locale]} />
          )}
          {scholar.featured && (
            <span className="absolute top-2.5 start-2.5 inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-gold-foreground shadow-sm">
              ✦ {dict.home.featuredBadge}
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="truncate font-display text-base font-bold text-foreground">
            {scholar.name[locale]}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Headphones className="size-3" />
            {formatNumber(scholar.stats.listens, locale)} {dict.scholars.listeners}
          </p>
        </div>
      </Link>
      <div className="absolute bottom-16 end-3">
        <PlayButtonBig tracks={scholar.tracks} context={context} locale={locale} />
      </div>
    </div>
  );
}
