import { LibraryIndex } from "@/components/library/library-index";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { getLibraryItems } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { buildBreadcrumbSchema, buildCollectionPageSchema } from "@/lib/schema";
import type { Locale } from "@/lib/types";

export function LibraryView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const items = getLibraryItems();

  return (
    <div className="py-10">
      <JsonLd
        data={[
          buildCollectionPageSchema(locale, {
            name: dict.library.title,
            path: "/library",
            description: dict.library.description,
          }),
          buildBreadcrumbSchema(locale, [
            { name: dict.nav.home, path: "/" },
            { name: dict.library.title, path: "/library" },
          ]),
        ]}
      />
      <Container>
        <SectionHeading
          eyebrow={dict.brand.tagline}
          title={dict.library.title}
          description={dict.library.description}
          align="center"
          as="h1"
        />
        <div className="mt-10">
          <LibraryIndex locale={locale} items={items} />
        </div>
      </Container>
    </div>
  );
}
