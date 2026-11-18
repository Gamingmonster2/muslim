import { PlayAllButton } from "@/components/player/play-buttons";
import { TrackRow } from "@/components/player/track-row";
import { JsonLd } from "@/components/seo/json-ld";
import { DefaultArt } from "@/components/shared/default-art";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { formatNumber } from "@/lib/format";
import { getScholars } from "@/lib/content";
import { buildBreadcrumbSchema, buildCollectionPageSchema } from "@/lib/schema";
import { getDictionary, scholarPath } from "@/lib/i18n";
import type { Locale, PlayerContext } from "@/lib/types";
import { Headphones, Info, ShieldCheck } from "lucide-react";

const RUQYAH_LABEL = { ar: "الرقية الشرعية", en: "Ruqyah" };

export function RuqyahView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const scholars = getScholars();

  const notes = [dict.ruqyah.note1, dict.ruqyah.note2, dict.ruqyah.note3];

  return (
    <div className="py-10">
      <JsonLd
        data={[
          buildCollectionPageSchema(locale, {
            name: dict.ruqyah.title,
            path: "/ruqyah",
            description: dict.ruqyah.description,
          }),
          buildBreadcrumbSchema(locale, [
            { name: dict.nav.home, path: "/" },
            { name: dict.ruqyah.title, path: "/ruqyah" },
          ]),
        ]}
      />
      <Container>
        <SectionHeading
          eyebrow={dict.brand.tagline}
          title={dict.ruqyah.title}
          description={dict.ruqyah.description}
          align="center"
          as="h1"
        />

        {/* آداب الاستماع */}
        <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
          {notes.map((note, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                {index === 0 ? <Headphones className="size-4" /> : <ShieldCheck className="size-4" />}
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">{note}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-5 flex max-w-3xl items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/8 p-3 text-sm leading-relaxed text-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <span>{dict.ruqyah.disclaimer}</span>
        </div>

        {/* قائمة الشيوخ */}
        <div className="mt-10 space-y-8">
          {scholars.map((scholar) => {
            const context: PlayerContext = {
              title: scholar.name,
              subtitle: RUQYAH_LABEL,
              cover: scholar.image,
              href: scholarPath(locale, scholar.id),
              kind: "ruqyah",
            };
            return (
              <section
                key={scholar.id}
                className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm"
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-14 shrink-0 overflow-hidden rounded-full bg-muted">
                      {scholar.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={scholar.image}
                          alt={scholar.name[locale]}
                          loading="lazy"
                          className="size-full object-cover"
                        />
                      ) : (
                        <DefaultArt label={scholar.name[locale].charAt(0)} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground">
                        {scholar.name[locale]}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatNumber(scholar.stats.listens, locale)}{" "}
                        {dict.scholars.listeners}
                      </p>
                    </div>
                  </div>
                  <PlayAllButton tracks={scholar.tracks} context={context} locale={locale} />
                </div>
                <div className="border-t border-border/50 px-3 py-2.5 sm:px-4">
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
            );
          })}
        </div>
      </Container>
    </div>
  );
}
