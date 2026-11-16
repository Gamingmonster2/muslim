#!/usr/bin/env node
/**
 * يبني مكتبة صوتية منتقاة من archive.org (مصاحف كاملة + شروح حديث)
 * المخرجات:
 *   - src/content/generated/library.json
 *   - public/images/library/<id>.jpg
 *
 * التشغيل: npm run content:archive
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_JSON = path.join(ROOT, "src", "content", "generated", "library.json");
const OUT_IMG_DIR = path.join(ROOT, "public", "images", "library");
const CURATION = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "curation.json"), "utf8")
);

const UA = "muslim.com.ly content bot (+https://muslim.com.ly)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SURAH_AR = [
  "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
  "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه",
  "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
  "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر",
  "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
  "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
  "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
  "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
  "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
  "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
  "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
  "المسد", "الإخلاص", "الفلق", "الناس",
];

const SURAH_EN = [
  "Al-Fatihah", "Al-Baqarah", "Aal-Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
  "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha",
  "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum",
  "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
  "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
  "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah",
  "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij",
  "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa",
  "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad",
  "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat",
  "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr",
  "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas",
];

async function fetchJson(url, retries = 3) {
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
      await sleep(700 * attempt);
    }
  }
  throw lastErr;
}

async function downloadImage(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get("content-type") || "";
  if (!ct.startsWith("image/")) throw new Error(`content-type ${ct}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buffer);
  return buffer.length;
}

function stripHtml(value) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const text = String(raw)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|li)>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
  if (!text || text.length < 3) return null;
  return text.length > 420 ? `${text.slice(0, 417).trimEnd()}…` : text;
}

const MP3_PREFERENCE = [
  /^vbr mp3$/i,
  /^128kbps mp3$/i,
  /^256kbps mp3$/i,
  /^64kbps mp3$/i,
  /mp3/i,
];

function scoreMp3(format) {
  for (let i = 0; i < MP3_PREFERENCE.length; i++) {
    if (MP3_PREFERENCE[i].test(format || "")) return 100 - i;
  }
  return -1;
}

function groupTrackKey(file) {
  // المفتاح هو اسم الملف بعد إزالة الامتداد ولواحق الجودة، لأن حقل track غير موثوق
  // (بعض العناصر تعطي القيمة 1 لكل الملفات).
  return String(file.name || "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[_-](64|96|128|160|192|256|320)\s*kbps?$/i, "")
    .replace(/[_-](64|96|128|160|192|256|320)k$/i, "")
    .toLowerCase();
}

/** يحوّل حقل المدة من archive.org إلى ثوانٍ (يدعم "16:16" و"1:02:33" و"2662.46"). */
function parseLength(value) {
  if (value == null) return null;
  const text = String(value).trim();
  if (!text) return null;
  if (text.includes(":")) {
    const parts = text.split(":").map((p) => Number(p) || 0);
    if (parts.some((p) => Number.isNaN(p))) return null;
    if (parts.length === 2) return Math.round(parts[0] * 60 + parts[1]);
    if (parts.length === 3) return Math.round(parts[0] * 3600 + parts[1] * 60 + parts[2]);
    return null;
  }
  const n = Number(text);
  return Number.isFinite(n) ? Math.round(n) : null;
}

function naturalCompare(a, b) {
  return String(a).localeCompare(String(b), "en", { numeric: true, sensitivity: "base" });
}

function buildTracks(metadata, category) {
  const files = Array.isArray(metadata.files) ? metadata.files : [];
  const mp3Files = files.filter(
    (f) => /\.mp3$/i.test(f.name || "") && scoreMp3(f.format) >= 0
  );
  if (!mp3Files.length) return [];

  const groups = new Map();
  for (const file of mp3Files) {
    const key = groupTrackKey(file);
    const current = groups.get(key);
    if (!current || scoreMp3(file.format) > scoreMp3(current.format)) {
      groups.set(key, file);
    }
  }

  const isMushaf = category === "mushaf";

  const entries = [...groups.entries()].map(([key, file]) => {
    const trackNum = Number((String(file.track || "").split("/")[0] || "").replace(/\D/g, ""));
    const surahIndex = trackNum >= 1 && trackNum <= 114 ? trackNum : null;
    const rawName = String(file.name || "");
    const nameDigits = (rawName.match(/^0*(\d{1,3})/) || [])[1];
    const digitsIndex = nameDigits ? Number(nameDigits) : null;
    const idx = isMushaf
      ? digitsIndex && digitsIndex >= 1 && digitsIndex <= 114
        ? digitsIndex
        : surahIndex
      : null;
    const fallbackTitle = rawName.replace(/\.mp3$/i, "").replace(/[_-]+/g, " ").trim();
    return {
      key,
      file,
      index: idx,
      fileTitle: file.title || null,
      fallbackTitle,
      duration: parseLength(file.length),
    };
  });

  entries.sort((a, b) => {
    if (a.index && b.index) return a.index - b.index;
    if (a.index) return -1;
    if (b.index) return 1;
    return naturalCompare(a.fallbackTitle, b.fallbackTitle);
  });

  return entries.map((entry, i) => {
    const idx = entry.index;
    const audioUrl = `https://archive.org/download/${metadata.identifier}/${encodeURIComponent(entry.file.name)}`;
    const arabicTitle = idx ? SURAH_AR[idx - 1] : entry.fileTitle || entry.fallbackTitle || `الملف ${i + 1}`;
    const englishTitle = idx ? SURAH_EN[idx - 1] : entry.fileTitle || entry.fallbackTitle || `Track ${i + 1}`;
    return {
      id: `${metadata.identifier}-${entry.key}`,
      title: { ar: arabicTitle, en: englishTitle },
      url: audioUrl,
      duration: entry.duration,
      sizeBytes: entry.file.size ? Number(entry.file.size) : null,
      surahIndex: idx || null,
    };
  });
}

function formatDuration(seconds) {
  const total = Math.round(seconds / 60);
  return total;
}

async function main() {
  console.log("═".repeat(60));
  console.log(" بناء مكتبة archive.org المنتقاة");
  console.log("═".repeat(60));

  fs.mkdirSync(OUT_IMG_DIR, { recursive: true });
  const items = [];

  for (let i = 0; i < CURATION.items.length; i++) {
    const cur = CURATION.items[i];
    process.stdout.write(`  [${i + 1}/${CURATION.items.length}] ${cur.id} ... `);
    try {
      const data = await fetchJson(`https://archive.org/metadata/${cur.id}`);
      const metadata = data.metadata || {};
      const tracks = buildTracks({ ...metadata, files: data.files }, cur.category);
      if (tracks.length < 1) {
        console.log("تخطّي (لا MP3)");
        continue;
      }

      let cover = null;
      const coverFile = `${cur.id}.jpg`;
      try {
        const size = await downloadImage(
          `https://archive.org/services/img/${cur.id}`,
          path.join(OUT_IMG_DIR, coverFile)
        );
        if (size > 1024) cover = `/images/library/${coverFile}`;
      } catch {
        /* لا غلاف */
      }

      const totalDuration = tracks.reduce((sum, t) => sum + (t.duration || 0), 0);
      const creatorAr = cur.creatorAr || metadata.creator || "غير معروف";
      const creatorEn = cur.creatorEn || creatorAr;

      items.push({
        id: cur.id,
        category: cur.category,
        kind: cur.kind || "recitation",
        title: {
          ar: `${cur.titleAr} — ${creatorAr}`,
          en: `${cur.titleEn} — ${creatorEn}`,
        },
        creator: { ar: creatorAr, en: creatorEn },
        description: {
          ar: stripHtml(metadata.description),
          en: null,
        },
        cover,
        trackCount: tracks.length,
        totalMinutes: formatDuration(totalDuration),
        year: metadata.year || metadata.publicdate?.slice(0, 4) || null,
        downloads: metadata.downloads ? Number(metadata.downloads) : null,
        sourceUrl: `https://archive.org/details/${cur.id}`,
        firstTrack: tracks[0] || null,
        tracks,
      });
      console.log(`✓ ${tracks.length} مساراً (${formatDuration(totalDuration)} د)`);
    } catch (err) {
      console.log(`✗ ${err.message}`);
    }
    await sleep(350);
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    source: "https://archive.org",
    items,
  };
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2), "utf8");

  // ملفات المسارات للاستخدام في المتصفح (تحميل كسول عند فتح عنصر)
  const OUT_DATA_DIR = path.join(ROOT, "public", "data", "library");
  fs.mkdirSync(OUT_DATA_DIR, { recursive: true });
  for (const item of items) {
    const file = path.join(OUT_DATA_DIR, `${item.id}.json`);
    fs.writeFileSync(
      file,
      JSON.stringify(
        {
          id: item.id,
          title: item.title,
          creator: item.creator,
          cover: item.cover,
          sourceUrl: item.sourceUrl,
          tracks: item.tracks.map((t) => ({
            id: t.id,
            title: t.title,
            url: t.url,
            duration: t.duration,
            surahIndex: t.surahIndex,
          })),
        },
        null,
        2
      ),
      "utf8"
    );
  }

  const totalTracks = items.reduce((a, b) => a + b.trackCount, 0);
  console.log("\n" + "═".repeat(60));
  console.log(`✓ ${items.length} عنصراً، ${totalTracks} مساراً`);
  console.log(`✓ ${path.relative(ROOT, OUT_JSON)}`);
  console.log(`✓ public/data/library/ (${items.length} ملفاً)`);
}

main().catch((err) => {
  console.error("✗ خطأ:", err);
  process.exit(1);
});
