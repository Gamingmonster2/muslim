import type { Locale } from "./types";

const arabicNumber = new Intl.NumberFormat("ar-EG-u-nu-latn");

/** ينسّق رقماً حسب اللغة (أرقام لاتينية للوضوح في الواجهتين) */
export function formatNumber(value: number, locale: Locale = "ar"): string {
  if (!Number.isFinite(value)) return "0";
  return locale === "ar"
    ? arabicNumber.format(value)
    : new Intl.NumberFormat("en-US").format(value);
}

/** 754 -> 12:34 · 3675 -> 1:01:15 */
export function formatClock(
  seconds: number | null | undefined,
  fallback = "--:--"
): string {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return fallback;
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** مدة مقروءة: 5400 -> «1 س 30 د» / "1h 30m" */
export function formatDurationHuman(
  seconds: number | null | undefined,
  locale: Locale = "ar"
): string {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) {
    return locale === "ar" ? "غير محدد" : "N/A";
  }
  const totalMinutes = Math.round(seconds / 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (locale === "ar") {
    if (h > 0 && m > 0) return `${h} س ${m} د`;
    if (h > 0) return `${h} س`;
    return `${m} د`;
  }
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

/** دقائق -> مدة مقروءة */
export function formatMinutesHuman(
  minutes: number | null | undefined,
  locale: Locale = "ar"
): string {
  if (!minutes) return locale === "ar" ? "غير محدد" : "N/A";
  return formatDurationHuman(minutes * 60, locale);
}

/** نسبة مئوية آمنة */
export function clampPercent(value: number, max: number): number {
  if (!max || max <= 0) return 0;
  return Math.min(100, Math.max(0, (value / max) * 100));
}
