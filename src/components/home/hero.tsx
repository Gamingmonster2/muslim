"use client";

import Link from "next/link";
import { useAudio } from "@/components/player/audio-provider";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import { BlurFade } from "@/components/ui/blur-fade";
import { HexagonPattern } from "@/components/ui/hexagon-pattern";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { WordRotate } from "@/components/ui/word-rotate";
import { Container } from "@/components/shared/container";
import { PlayButtonBig } from "@/components/player/play-buttons";
import { formatNumber } from "@/lib/format";
import { getDictionary, scholarPath } from "@/lib/i18n";
import type { Locale, PlayerContext, Scholar } from "@/lib/types";
import { Headphones, LibraryBig, Mic2, Users } from "lucide-react";

const RUQYAH_LABEL = { ar: "الرقية الشرعية", en: "Ruqyah" };

export function Hero({
  locale,
  stats,
  featured,
}: {
  locale: Locale;
  stats: {
    scholars: number;
    ruqyahTracks: number;
    mushafs: number;
    tracks: number;
  };
  featured: Scholar;
}) {
  const dict = getDictionary(locale);
  const { playQueue } = useAudio();

  const featuredContext: PlayerContext = {
    title: featured.name,
    subtitle: RUQYAH_LABEL,
    cover: featured.image,
    href: scholarPath(locale, featured.id),
    kind: "ruqyah",
  };

  const statItems = [
    { value: stats.scholars, label: dict.home.statsScholars, icon: Users },
    { value: stats.ruqyahTracks, label: dict.home.statsRuqyah, icon: Headphones },
    { value: stats.mushafs, label: dict.home.statsMushafs, icon: Mic2 },
    { value: stats.tracks, label: dict.home.statsTracks, icon: LibraryBig },
  ];

  return (
    <section className="relative overflow-hidden">
      <HexagonPattern
        radius={34}
        gap={4}
        className="absolute inset-0 fill-primary/25 stroke-primary/12 opacity-30 dark:opacity-20"
      />
      <div className="pointer-events-none absolute -top-24 -end-24 size-96 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -start-24 size-96 rounded-full bg-primary/15 blur-3xl" />

      <Container className="relative py-14 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <BlurFade delay={0.05}>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/8 px-3.5 py-1.5 text-xs font-bold text-gold">
                <span aria-hidden>✦</span>
                {dict.home.heroBadge}
              </span>
            </BlurFade>

            <BlurFade delay={0.12}>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.15] text-foreground sm:text-5xl lg:text-[3.4rem]">
                {dict.home.heroTitle}{" "}
                <span className="relative inline-block">
                  <span className="text-gradient-emerald">{dict.home.heroTitleAccent}</span>
                  <span className="absolute -bottom-1 start-0 h-1 w-full rounded-full bg-gradient-to-r from-primary/50 to-gold/50" />
                </span>
              </h1>
            </BlurFade>

            <BlurFade delay={0.18}>
              <div className="mt-4 flex items-center gap-2 text-2xl font-bold text-primary sm:text-3xl">
                <span className="text-muted-foreground">·</span>
                <WordRotate
                  words={dict.home.heroRotating}
                  className="text-gradient-emerald"
                />
              </div>
            </BlurFade>

            <BlurFade delay={0.24}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {dict.home.heroDescription}
              </p>
            </BlurFade>

            <BlurFade delay={0.3}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <ShimmerButton
                  onClick={() => playQueue(featured.tracks, 0, featuredContext)}
                  background="linear-gradient(120deg, var(--primary), color-mix(in oklch, var(--primary) 70%, var(--gold)))"
                  shimmerColor="#ffffff"
                  className="h-12 rounded-full px-6 text-sm font-bold"
                >
                  <Headphones className="size-4" />
                  <span className="ms-2">{dict.home.heroPrimary}</span>
                </ShimmerButton>
                <Link
                  href={scholarPath(locale, featured.id)}
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-border/80 bg-card/70 px-5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
                >
                  {dict.home.heroSecondary}
                </Link>
              </div>
            </BlurFade>

            <BlurFade delay={0.36}>
              <dl className="mt-10 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
                {statItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-border/60 bg-card/70 p-3 text-center shadow-sm"
                    >
                      <Icon className="mx-auto size-4 text-primary" />
                      <dd className="mt-1.5 text-xl font-bold tabular-nums text-foreground">
                        <NumberTicker value={item.value} />
                      </dd>
                      <dt className="mt-0.5 text-[11px] font-medium text-muted-foreground">
                        {item.label}
                      </dt>
                    </div>
                  );
                })}
              </dl>
            </BlurFade>
          </div>

          {/* بطاقة الشيخ المميز */}
          <BlurFade delay={0.2}>
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary/20 via-transparent to-gold/25 blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-card shadow-2xl shadow-black/10">
                <div className="relative aspect-[4/5] overflow-hidden">
                  {featured.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featured.image}
                      alt={featured.name[locale]}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/15 to-gold/15">
                      <span className="font-quran text-4xl text-primary/60">
                        {featured.name[locale].charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold text-gold-foreground">
                      ✦ {dict.home.featuredBadge}
                    </span>
                    <h2 className="mt-2 font-display text-xl font-bold leading-tight">
                      {featured.name[locale]}
                    </h2>
                    <p className="mt-1 text-sm text-white/80">{dict.home.featuredTitle}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4">
                  <div className="text-xs text-muted-foreground">
                    <span className="block font-semibold text-foreground">
                      {dict.home.featuredListeners}
                    </span>
                    {formatNumber(featured.stats.listens, locale)}
                  </div>
                  <PlayButtonBig
                    tracks={featured.tracks}
                    context={featuredContext}
                    locale={locale}
                  />
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </Container>
    </section>
  );
}
