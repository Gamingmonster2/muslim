import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ScholarsGrid } from "@/components/scholars/scholars-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { getScholars } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { buildBreadcrumbSchema, buildCollectionPageSchema } from "@/lib/schema";
import type { Locale } from "@/lib/types";

export function ScholarsView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const scholars = getScholars();

  return (
    <div className="py-10">
      <JsonLd
        data={[
          buildCollectionPageSchema(locale, {
            name: dict.scholars.title,
            path: "/scholars",
            description: dict.scholars.description,
          }),
          buildBreadcrumbSchema(locale, [
            { name: dict.nav.home, path: "/" },
            { name: dict.scholars.title, path: "/scholars" },
          ]),
        ]}
      />
      <Container>
        <SectionHeading
          eyebrow={dict.brand.tagline}
          title={dict.scholars.title}
          description={dict.scholars.description}
          align="center"
          as="h1"
        />
        <div className="mt-10">
          <ScholarsGrid locale={locale} scholars={scholars} />
        </div>
      </Container>
    </div>
  );
}
