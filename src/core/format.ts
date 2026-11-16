const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** يحوّل الأرقام الإنجليزية إلى أرقام عربية (هندية). */
export function toArabicDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (digit) => ARABIC_DIGITS[Number(digit)] ?? digit);
}

/** تنسيق المدة بصيغة m:ss بالأرقام العربية. */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "٠:٠٠";
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return toArabicDigits(`${minutes}:${String(rest).padStart(2, "0")}`);
}

/** إزالة التشكيل للمقارنة والبحث. */
export function stripTashkeel(text: string): string {
  return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");
}
