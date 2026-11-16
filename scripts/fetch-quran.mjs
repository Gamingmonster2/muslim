/**
 * يجلب نص الآيات من واجهة برمجة معتمدة (Al Quran Cloud - نسخة عثمانية)
 * ويولّد ملف بيانات محلياً حتى لا يعتمد التطبيق على الشبكة في عرض النص.
 *
 * التشغيل: node scripts/fetch-quran.mjs
 */
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../src/features/ruqyah/data/quran-uthmani.json");

/** النطاقات المطلوبة في الرقية الشرعية: سورة -> [من, إلى] */
const RANGES = {
  1: [[1, 7]],
  2: [[1, 5], [102, 102], [163, 164], [255, 255], [285, 286]],
  3: [[18, 19]],
  7: [[54, 56]],
  10: [[81, 82]],
  17: [[82, 82]],
  20: [[69, 69]],
  23: [[115, 118]],
  37: [[1, 10]],
  46: [[29, 32]],
  55: [[33, 36]],
  59: [[21, 24]],
  68: [[51, 52]],
  72: [[1, 9]],
  112: [[1, 4]],
  113: [[1, 5]],
  114: [[1, 6]],
};

const API = "https://api.alquran.cloud/v1";

const needed = new Map(); // "s:a" -> true
for (const [s, ranges] of Object.entries(RANGES)) {
  for (const [from, to] of ranges) {
    for (let a = from; a <= to; a++) needed.set(`${s}:${a}`, true);
  }
}

async function getJson(url, attempt = 1) {
  try {
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
    return await res.json();
  } catch (err) {
    if (attempt >= 4) throw err;
    await new Promise((r) => setTimeout(r, 700 * attempt));
    return getJson(url, attempt + 1);
  }
}

const surahIds = [...new Set(Object.keys(RANGES).map(Number))];
const surahs = {};
const ayahs = {};

for (const id of surahIds) {
  const { data } = await getJson(`${API}/surah/${id}/quran-uthmani`);
  surahs[id] = { name: data.name, englishName: data.englishName, ayahCount: data.numberOfAyahs };
  for (const a of data.ayahs) {
    const key = `${id}:${a.numberInSurah}`;
    if (!needed.has(key)) continue;
    // إزالة البسملة المكرّرة في أول آية عند وجودها (تُعرض منفصلة في الواجهة)
    let text = a.text;
    if (a.numberInSurah === 1 && id !== 1 && id !== 9) {
      text = text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/u, "").replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ\s*/u, "");
    }
    ayahs[key] = text;
  }
  process.stdout.write(`✓ سورة ${surahs[id].name} (${id}) — ${surahs[id].ayahCount} آية\n`);
}

const missing = [...needed.keys()].filter((k) => !ayahs[k]);
if (missing.length) {
  console.error("آيات ناقصة:", missing);
  process.exit(1);
}

await mkdir(dirname(outPath), { recursive: true });
await writeFile(
  outPath,
  JSON.stringify(
    {
      source: "Al Quran Cloud — quran-uthmani (نص عثماني معتمد)",
      edition: "quran-uthmani",
      generatedAt: new Date().toISOString(),
      surahs,
      ayahs,
    },
    null,
    1
  ) + "\n",
  "utf8"
);
console.log(`\n✅ تم توليد ${Object.keys(ayahs).length} آية في ${outPath}`);
