import { notFound } from "next/navigation";
import { PlayAllButton } from "@/components/player/play-buttons";
import { TrackRow } from "@/components/player/track-row";
import { ScholarCard } from "@/components/scholars/scholar-card";
import { JsonLd } from "@/components/seo/json-ld";
import { DefaultArt } from "@/components/shared/default-art";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { formatNumber } from "@/lib/format";
import { getRelatedScholars, getScholar } from "@/lib/content";
import { getDictionary, localePath, scholarPath } from "@/lib/i18n";
import { buildBreadcrumbSchema, buildPersonSchema } from "@/lib/schema";
import type { Locale, PlayerContext } from "@/lib/types";
import { Headphones, Heart, Mic2 } from "lucide-react";

const RUQYAH_LABEL = { ar: "الرقية الشرعية", en: "Ruqyah" };

export function ScholarDetailView({ locale, id }: { locale: Locale; id: string }) {
  const dict = getDictionary(locale);
  const scholar = getScholar(id);
  if (!scholar) notFound();

  const related = getRelatedScholars(scholar.id, 4);
  const context: PlayerContext = {
    title: scholar.name,
    subtitle: RUQYAH_LABEL,
    cover: scholar.image,
    href: scholarPath(locale, scholar.id),
    kind: "ruqyah",
  };

  return (
    <div className="pb-10">
      <JsonLd
        data={[
          buildPersonSchema(scholar, locale),
          buildBreadcrumbSchema(locale, [
            { name: dict.nav.home, path: "/" },
            { name: dict.nav.scholars, path: "/scholars" },
            { name: scholar.name[locale], path: `/scholars/${scholar.id}` },
          ]),
        ]}
      />
      {/* الغلاف */}
      <div className="relative overflow-hidden border-b border-border/50 bg-muted/30">
        <div className="pointer-events-none absolute -top-24 start-1/3 size-96 rounded-full bg-primary/10 blur-3xl" />
        <Container className="relative py-10">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="size-32 shrink-0 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xl sm:size-40">
              {scholar.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={scholar.image}
                  alt={scholar.name[locale]}
                  className="size-full object-cover"
                />
              ) : (
                <DefaultArt label={scholar.name[locale]} />
              )}
            </div>
            <div className="text-center sm:text-start">
              <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                {scholar.name[locale]}
              </h1>
              <p className="mt-2 text-sm font-semibold text-gold">
                {dict.scholars.ruqyahRecordings}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-semibold text-foreground">
                  <Mic2 className="size-3.5 text-primary" />
                  {scholar.stats.recordings} {dict.scholars.recordings}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-semibold text-foreground">
                  <Headphones className="size-3.5 text-primary" />
                  {formatNumber(scholar.stats.listens, locale)} {dict.scholars.listeners}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-semibold text-foreground">
                  <Heart className="size-3.5 text-primary" />
                  {formatNumber(scholar.stats.likes, locale)} {dict.scholars.likes}
                </span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* النبذة */}
            {(scholar.bio.ar || scholar.bio.en) && (
              <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
                <h2 className="font-display text-lg font-bold text-foreground">
                  {dict.scholars.aboutScholar}
                </h2>
                <p className="mt-3 leading-loose text-muted-foreground">
                  {scholar.bio[locale] ?? scholar.bio.ar}
                </p>
              </section>
            )}

            {/* التسجيلات */}
            <section className="mt-6 rounded-3xl border border-border/60 bg-card shadow-sm">
              <div className="flex items-center justify-between p-5 pb-3">
                <h2 className="font-display text-lg font-bold text-foreground">
                  {dict.scholars.ruqyahRecordings}
                </h2>
                <PlayAllButton tracks={scholar.tracks} context={context} locale={locale} />
              </div>
              <div className="border-t border-border/50 px-3 py-2.5">
                {scholar.tracks.map((track, index) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    queue={scholar.tracks}
                    index={index}
                    context={context}
                    locale={locale}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* قد يعجبك */}
          <aside>
            <h2 className="font-display text-lg font-bold text-foreground">
              {dict.scholars.relatedTitle}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {dict.scholars.relatedDescription}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-1">
              {related.map((item) => (
                <ScholarCard key={item.id} scholar={item} locale={locale} />
              ))}
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
