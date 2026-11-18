import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { HeartHandshake, LockKeyhole, MessageCircleQuestion, Scale, Sparkles } from "lucide-react";

export function AboutView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  const values = dict.about.values.map((value, index) => ({
    ...value,
    icon: [Sparkles, Scale, HeartHandshake, LockKeyhole][index] ?? Sparkles,
  }));

  return (
    <div className="py-10">
      <Container className="max-w-4xl">
        <SectionHeading eyebrow={dict.brand.name} title={dict.about.title} align="center" as="h1" />
        <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
          {dict.about.lead}
        </p>

        <div className="mt-10 space-y-6">
          <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-xl font-bold text-foreground">
              {dict.about.storyTitle}
            </h2>
            <p className="mt-3 leading-loose text-muted-foreground">{dict.about.story}</p>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
                  <Icon className="size-6 text-primary" />
                  <h3 className="mt-3 font-display text-base font-bold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-xl font-bold text-foreground">
              {dict.about.sourcesTitle}
            </h2>
            <p className="mt-3 leading-loose text-muted-foreground">{dict.about.sources}</p>
          </section>

          <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
              <LockKeyhole className="size-5 text-primary" />
              {dict.about.privacyTitle}
            </h2>
            <p className="mt-3 leading-loose text-muted-foreground">{dict.about.privacy}</p>
          </section>

          <section className="rounded-3xl border border-amber-500/25 bg-amber-500/5 p-6 shadow-sm sm:p-8">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
              <MessageCircleQuestion className="size-5 text-amber-600" />
              {dict.about.disclaimerTitle}
            </h2>
            <p className="mt-3 leading-loose text-muted-foreground">{dict.about.disclaimer}</p>
          </section>

          <section className="rounded-3xl border border-border/60 bg-card p-6 text-center shadow-sm sm:p-8">
            <h2 className="font-display text-xl font-bold text-foreground">
              {dict.about.contactTitle}
            </h2>
            <p className="mt-3 leading-loose text-muted-foreground">{dict.about.contact}</p>
          </section>
        </div>
      </Container>
    </div>
  );
}
