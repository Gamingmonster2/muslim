/**
 * نص الرقية الشرعية: الآيات مرتّبة، ونصها يُقرأ من ملف موثّق
 * مولّد من واجهة Al Quran Cloud (نسخة عثمانية) — انظر scripts/fetch-quran.mjs
 */
import quranRaw from "./quran-uthmani.json";

interface SurahMeta {
  name: string;
  englishName: string;
  ayahCount: number;
}

interface QuranFile {
  source: string;
  edition: string;
  generatedAt: string;
  surahs: Record<string, SurahMeta>;
  ayahs: Record<string, string>;
}

const quran = quranRaw as unknown as QuranFile;

export const quranSource = quran.source;
export const quranEdition = quran.edition;

/** نص آية بالمعرّف "سورة:آية". */
export function getAyah(ref: string): string {
  return quran.ayahs[ref] ?? "";
}

/** اسم السورة بدون كلمة «سُورَةُ» وبلا تشكيل زائد. */
export function getSurahName(id: number): string {
  const meta = quran.surahs[String(id)];
  if (!meta) return "";
  return meta.name.replace(/^سُورَةُ\s*/u, "").trim();
}

/** يوجد نص لكل الآيات المطلوبة؟ (فحص وقت التحميل) */
export function missingAyahs(refs: string[]): string[] {
  return refs.filter((ref) => !quran.ayahs[ref]);
}
