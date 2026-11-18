import { getDictionary, localePath } from "./i18n";
import { site } from "./site";
import type { LibraryItemSummary, Locale, Scholar } from "./types";

const abs = (path: string) => `${site.url}${path}`;

export function buildWebsiteSchema(locale: Locale) {
  const dict = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: abs(localePath(locale, "/")),
    name: dict.brand.name,
    alternateName: dict.brand.latin,
    description: dict.meta.siteDescription,
    inLanguage: locale === "ar" ? "ar" : "en",
    publisher: { "@id": `${site.url}/#organization` },
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: "اسمع دينك",
    alternateName: "ListenYourDeen",
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: abs("/icons/icon-512.png"),
      width: 512,
      height: 512,
    },
    description:
      "منصة إسلامية صوتية للرقية الشرعية والأذكار ومكتبة منتقاة من تلاوات القرآن الكريم وشروح السنة النبوية.",
  };
}

export function buildScholarsItemList(scholars: Scholar[], locale: Locale) {
  const dict = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: dict.scholars.title,
    url: abs(localePath(locale, "/scholars")),
    numberOfItems: scholars.length,
    itemListElement: scholars.map((scholar, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: scholar.name[locale],
      url: abs(localePath(locale, `/scholars/${scholar.id}`)),
    })),
  };
}

export function buildPersonSchema(scholar: Scholar, locale: Locale) {
  const dict = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${abs(localePath(locale, `/scholars/${scholar.id}`))}#person`,
    name: scholar.name[locale],
    alternateName: scholar.name[locale === "ar" ? "en" : "ar"],
    url: abs(localePath(locale, `/scholars/${scholar.id}`)),
    image: scholar.image ? abs(scholar.image) : undefined,
    description: scholar.bio[locale] ?? scholar.bio.ar ?? undefined,
    jobTitle: locale === "ar" ? "قارئ القرآن الكريم" : "Qur'an reciter",
    knowsAbout: [dict.ruqyah.title],
  };
}

export function buildAudioSchema(item: LibraryItemSummary, locale: Locale) {
  const dict = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "AudioObject",
    name: item.title[locale],
    url: abs(localePath(locale, `/library/${item.id}`)),
    description: item.description[locale] ?? item.description.ar ?? undefined,
    inLanguage: locale === "ar" ? "ar" : "en",
    contentUrl: item.firstTrack?.url,
    thumbnailUrl: item.cover ? abs(item.cover) : undefined,
    duration: item.totalMinutes ? `PT${item.totalMinutes}M` : undefined,
    encodingFormat: "audio/mpeg",
    isPartOf: {
      "@type": "CollectionPage",
      name: dict.library.title,
      url: abs(localePath(locale, "/library")),
    },
  };
}

export function buildCollectionPageSchema(
  locale: Locale,
  opts: { name: string; path: string; description: string }
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: abs(localePath(locale, opts.path)),
    inLanguage: locale === "ar" ? "ar" : "en",
  };
}

export function buildBreadcrumbSchema(
  locale: Locale,
  crumbs: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: abs(localePath(locale, crumb.path)),
    })),
  };
}
