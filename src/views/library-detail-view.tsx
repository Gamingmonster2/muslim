import { notFound } from "next/navigation";
import { TrackListLoader } from "@/components/library/track-list-loader";
import { PlayAllButton } from "@/components/player/play-buttons";
import { DefaultArt } from "@/components/shared/default-art";
import { Container } from "@/components/shared/container";
import { getLibraryItem } from "@/lib/content";
import { formatMinutesHuman } from "@/lib/format";
import { getDictionary, libraryPath } from "@/lib/i18n";
import type { Locale, PlayerContext } from "@/lib/types";
import { CalendarDays, Download, Layers, Timer } from "lucide-react";

export function LibraryDetailView({ locale, id }: { locale: Locale; id: string }) {
  const dict = getDictionary(locale);
  const item = getLibraryItem(id);
  if (!item) notFound();

  const context: PlayerContext = {
    title: item.title,
    cover: item.cover,
    href: libraryPath(locale, item.id),
    kind: item.category === "mushaf" ? "mushaf" : "hadith",
  };

  const meta = [
    { icon: Layers, label: dict.library.totalTracks, value: `${item.trackCount} ${dict.library.tracksCount}` },
    { icon: Timer, label: dict.library.totalDuration, value: formatMinutesHuman(item.totalMinutes, locale) },
    { icon: CalendarDays, label: dict.library.year, value: item.year ?? "—" },
    { icon: Download, label: dict.library.downloads, value: item.downloads ? String(item.downloads) : "—" },
  ];

  return (
    <div className="pb-10">
      <Container className="py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xl">
              <div className="aspect-square">
                {item.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.cover}
                    alt={item.title[locale]}
                    className="size-full object-cover"
                  />
                ) : (
                  <DefaultArt label={item.creator[locale]} />
                )}
              </div>
              <div className="p-5">
                {item.firstTrack && (
                  <PlayAllButton
                    tracks={[item.firstTrack]}
                    context={context}
                    locale={locale}
                    label={dict.library.listenNow}
                    className="w-full justify-center"
                  />
                )}
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-border/80 bg-card text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  {dict.library.openSource}
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/8 px-3 py-1 text-[11px] font-bold text-gold">
              {item.category === "mushaf" ? dict.library.tabs.mushaf : dict.library.tabs.hadith}
            </span>
            <h1 className="mt-3 font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              {item.title[locale]}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{item.creator[locale]}</p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {meta.map((entry) => {
                const Icon = entry.icon;
                return (
                  <div key={entry.label} className="rounded-2xl border border-border/60 bg-card p-3">
                    <Icon className="size-4 text-primary" />
                    <div className="mt-1.5 text-sm font-bold text-foreground">{entry.value}</div>
                    <div className="text-[11px] text-muted-foreground">{entry.label}</div>
                  </div>
                );
              })}
            </div>

            {item.description.ar && (
              <div className="mt-5 rounded-2xl border border-border/60 bg-card p-5">
                <h2 className="text-sm font-bold text-foreground">{dict.library.detailsTitle}</h2>
                <p className="mt-2 text-sm leading-loose text-muted-foreground">
                  {item.description.ar}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 font-display text-xl font-bold text-foreground">
            {dict.library.tracksTitle}
          </h2>
          <TrackListLoader itemId={item.id} category={item.category} locale={locale} />
        </div>
      </Container>
    </div>
  );
}
