import type { Metadata } from "next";
import { site } from "./site";
import { getDictionary, localePath } from "./i18n";
import type { Locale } from "./types";

export function buildMetadata(
  locale: Locale,
  opts: {
    title: string;
    description: string;
    path?: string;
    noIndex?: boolean;
  }
): Metadata {
  const dict = getDictionary(locale);
  const path = opts.path ?? "/";
  const canonical = localePath(locale, path);
  const arPath = localePath("ar", path);
  const enPath = localePath("en", path);

  return {
    metadataBase: new URL(site.url),
    title: opts.title,
    description: opts.description,
    alternates: { canonical, languages: { ar: arPath, en: enPath } },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_AR" : "en_US",
      url: canonical,
      siteName: dict.brand.name,
      title: opts.title,
      description: opts.description,
      images: [site.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [site.ogImage],
    },
    robots: opts.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
