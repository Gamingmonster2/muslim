import { LibraryIndex } from "@/components/library/library-index";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { getLibraryItems } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function LibraryView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const items = getLibraryItems();

  return (
    <div className="py-10">
      <Container>
        <SectionHeading
          eyebrow={dict.brand.tagline}
          title={dict.library.title}
          description={dict.library.description}
          align="center"
        />
        <div className="mt-10">
          <LibraryIndex locale={locale} items={items} />
        </div>
      </Container>
    </div>
  );
}
