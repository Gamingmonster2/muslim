import { Hero } from "@/components/home/hero";
import { LibraryCard } from "@/components/library/library-card";
import { ScholarCard } from "@/components/scholars/scholar-card";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  getFeaturedScholar,
  getLibraryItems,
  getScholars,
  getSiteStats,
} from "@/lib/content";
import { getDictionary, adhkarPath, localePath } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { BookOpen, HeartPulse, MoonStar, Sparkles } from "lucide-react";

export function HomeView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const featured = getFeaturedScholar();
  const scholars = getScholars().filter((scholar) => scholar.id !== featured.id);
  const library = getLibraryItems();
  const stats = getSiteStats();

  const tools = [
    {
      href: adhkarPath(locale, "morning"),
      icon: MoonStar,
      title: dict.home.toolAdhkarTitle,
      desc: dict.home.toolAdhkarDesc,
      tint: "text-amber-600 bg-amber-500/10",
    },
    {
      href: localePath(locale, "/tasbeeh"),
      icon: Sparkles,
      title: dict.home.toolTasbeehTitle,
      desc: dict.home.toolTasbeehDesc,
      tint: "text-emerald-600 bg-emerald-500/10",
    },
    {
      href: adhkarPath(locale, "healing"),
      icon: HeartPulse,
      title: dict.home.toolSelfRuqyahTitle,
      desc: dict.home.toolSelfRuqyahDesc,
      tint: "text-sky-600 bg-sky-500/10",
    },
    {
      href: localePath(locale, "/library"),
      icon: BookOpen,
      title: dict.home.toolLibraryTitle,
      desc: dict.home.toolLibraryDesc,
      tint: "text-primary bg-primary/10",
    },
  ];

  const how = [
    { step: "١", title: dict.home.howStep1Title, desc: dict.home.howStep1Desc },
    { step: "٢", title: dict.home.howStep2Title, desc: dict.home.howStep2Desc },
    { step: "٣", title: dict.home.howStep3Title, desc: dict.home.howStep3Desc },
  ];

  return (
    <div>
      <Hero locale={locale} stats={stats} featured={featured} />

      {/* شيوخ آخرون */}
      <Container className="py-12 sm:py-16">
        <SectionHeading
          eyebrow={dict.brand.tagline}
          title={dict.home.otherScholarsTitle}
          description={dict.home.otherScholarsDescription}
          action={dict.actions.viewAll}
          actionHref={localePath(locale, "/scholars")}
        />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {scholars.slice(0, 8).map((scholar) => (
            <ScholarCard key={scholar.id} scholar={scholar} locale={locale} />
          ))}
        </div>
      </Container>

      {/* أدوات العبادة */}
      <section className="border-y border-border/50 bg-muted/30">
        <Container className="py-12 sm:py-16">
          <SectionHeading
            eyebrow="✦"
            title={dict.home.toolsTitle}
            description={dict.home.toolsDescription}
            align="center"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <a
                  key={tool.href}
                  href={tool.href}
                  className="group rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
                >
                  <span
                    className={`inline-flex size-11 items-center justify-center rounded-xl ${tool.tint}`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{tool.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {tool.desc}
                  </p>
                </a>
              );
            })}
          </div>
        </Container>
      </section>

      {/* من المكتبة */}
      <Container className="py-12 sm:py-16">
        <SectionHeading
          eyebrow={dict.brand.name}
          title={dict.home.libraryTitle}
          description={dict.home.libraryDescription}
          action={dict.actions.browse}
          actionHref={localePath(locale, "/library")}
        />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {library.slice(0, 8).map((item) => (
            <LibraryCard key={item.id} item={item} locale={locale} />
          ))}
        </div>
      </Container>

      {/* كيف تستمع */}
      <section className="border-t border-border/50 bg-muted/20">
        <Container className="py-12 sm:py-16">
          <SectionHeading
            eyebrow="✦"
            title={dict.home.howTitle}
            align="center"
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {how.map((item, index) => (
              <div
                key={item.title}
                className="relative rounded-2xl border border-border/60 bg-card p-6 text-center shadow-sm"
              >
                <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-bold text-primary">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-base font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* صدقة جارية */}
      <Container className="py-12">
        <div className="overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-primary via-emerald-deep to-primary p-8 text-primary-foreground sm:p-10">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-bold sm:text-2xl">
                {dict.home.sadaqahTitle}
              </h2>
              <p className="mt-2 max-w-2xl leading-relaxed text-white/85">
                {dict.home.sadaqahDescription}
              </p>
            </div>
            <a
              href={localePath(locale, "/about")}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-gold-foreground transition-transform hover:scale-105"
            >
              {dict.nav.about}
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
