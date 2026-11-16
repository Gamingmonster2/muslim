import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ScholarsGrid } from "@/components/scholars/scholars-grid";
import { getScholars } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function ScholarsView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const scholars = getScholars();

  return (
    <div className="py-10">
      <Container>
        <SectionHeading
          eyebrow={dict.brand.tagline}
          title={dict.scholars.title}
          description={dict.scholars.description}
          align="center"
        />
        <div className="mt-10">
          <ScholarsGrid locale={locale} scholars={scholars} />
        </div>
      </Container>
    </div>
  );
}
