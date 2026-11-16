import { ar, type Dictionary } from "./ar";
import { en } from "./en";
import type { Locale } from "../types";

export const LOCALES = ["ar", "en"] as const;
export const DEFAULT_LOCALE: Locale = "ar";

export type { Dictionary };

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "ar" || value === "en";
}

export function getDictionary(locale: Locale): Dictionary {
  return locale === "en" ? en : ar;
}

export function getDir(locale: Locale): "rtl" | "ltr" {
  return locale === "en" ? "ltr" : "rtl";
}

export function getHtmlLang(locale: Locale): string {
  return locale === "en" ? "en" : "ar";
}

/**
 * يبني مساراً داخلياً حسب اللغة.
 * ar: /path  ·  en: /en/path
 */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  if (locale === "ar") return clean || "/";
  return `/en${clean}`;
}

/** اللغة الأخرى */
export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "ar" : "en";
}

/** يستخرج اللغة من مسار كامل (للاستخدام في عميل) */
export function localeFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") || pathname.startsWith("/en?")
    ? "en"
    : "ar";
}

/** يحوّل مساراً عربياً إلى مقابله الإنجليزي أو العكس */
export function switchLocalePath(pathname: string, target: Locale): string {
  const stripped =
    pathname === "/en"
      ? "/"
      : pathname.startsWith("/en/")
        ? pathname.slice(3)
        : pathname;
  return localePath(target, stripped || "/");
}

/** يبني رابط صفحة الشيخ */
export function scholarPath(locale: Locale, id: string): string {
  return localePath(locale, `/scholars/${id}`);
}

/** يبني رابط فئة أذكار */
export function adhkarPath(locale: Locale, id: string): string {
  return localePath(locale, `/adhkar/${id}`);
}

/** يبني رابط عنصر مكتبة */
export function libraryPath(locale: Locale, id: string): string {
  return localePath(locale, `/library/${encodeURIComponent(id)}`);
}
