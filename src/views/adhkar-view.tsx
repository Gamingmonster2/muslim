import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { getAdhkarCategories } from "@/lib/content";
import { getDictionary, adhkarPath } from "@/lib/i18n";
import { buildBreadcrumbSchema, buildCollectionPageSchema } from "@/lib/schema";
import type { Locale } from "@/lib/types";
import { BedDouble, Heart, HeartPulse, Moon, Sun, Sunrise } from "lucide-react";

const ICONS = {
  sun: Sun,
  moon: Moon,
  bed: BedDouble,
  sunrise: Sunrise,
  heart: Heart,
  "heart-pulse": HeartPulse,
} as const;

const ACCENTS: Record<string, string> = {
  amber: "text-amber-600 bg-amber-500/10",
  indigo: "text-indigo-600 bg-indigo-500/10",
  violet: "text-violet-600 bg-violet-500/10",
  rose: "text-rose-600 bg-rose-500/10",
  emerald: "text-emerald-600 bg-emerald-500/10",
  sky: "text-sky-600 bg-sky-500/10",
};

export function AdhkarView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const categories = getAdhkarCategories();

  return (
    <div className="py-10">
      <JsonLd
        data={[
          buildCollectionPageSchema(locale, {
            name: dict.adhkar.title,
            path: "/adhkar",
            description: dict.adhkar.description,
          }),
          buildBreadcrumbSchema(locale, [
            { name: dict.nav.home, path: "/" },
            { name: dict.adhkar.title, path: "/adhkar" },
          ]),
        ]}
      />
      <Container>
        <SectionHeading
          eyebrow={dict.brand.tagline}
          title={dict.adhkar.categoriesTitle}
          description={dict.adhkar.categoriesDescription}
          align="center"
          as="h1"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = ICONS[category.icon] ?? Heart;
            return (
              <a
                key={category.id}
                href={adhkarPath(locale, category.id)}
                className="group flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
              >
                <span
                  className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${ACCENTS[category.accent] ?? "text-primary bg-primary/10"}`}
                >
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-display text-base font-bold text-foreground">
                      {category.title[locale]}
                    </span>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                      {category.items.length}
                    </span>
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                    {category.description[locale]}
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
