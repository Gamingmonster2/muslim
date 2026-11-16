#!/usr/bin/env node
/**
 * يجلب تسجيلات الرقية الشرعية وصور الشيوخ ونُبَذهم من tvquran.com
 * المخرجات:
 *   - src/content/generated/scholars.json
 *   - public/images/scholars/<id>.jpg
 *
 * التشغيل: npm run content:tvquran
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_JSON = path.join(ROOT, "src", "content", "generated", "scholars.json");
const OUT_IMG_DIR = path.join(ROOT, "public", "images", "scholars");
const DATA_DIR = path.join(__dirname, "data");

const BASE = "https://www.tvquran.com";
const CATEGORY_SLUG = encodeURIComponent("الرقية الشرعية");
const CATEGORY_URL = `${BASE}/ar/selections/category/6/${CATEGORY_SLUG}`;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url, { retries = 3 } = {}) {
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, "Accept-Language": "ar,en;q=0.8" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return await res.text();
    } catch (err) {
      lastErr = err;
      await sleep(600 * attempt);
    }
  }
  throw lastErr;
}

async function fetchBuffer(url, { retries = 2 } = {}) {
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      const ct = res.headers.get("content-type") || "";
      return { buffer: Buffer.from(await res.arrayBuffer()), contentType: ct };
    } catch (err) {
      lastErr = err;
      await sleep(600 * attempt);
    }
  }
  throw lastErr;
}

async function head(url) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": UA },
    });
    return {
      ok: res.ok,
      status: res.status,
      contentType: res.headers.get("content-type") || "",
      contentLength: Number(res.headers.get("content-length") || 0),
      acceptRanges: res.headers.get("accept-ranges") || "",
    };
  } catch {
    return { ok: false, status: 0, contentType: "", contentLength: 0, acceptRanges: "" };
  }
}

/** مدة MP3 تقديرية: يقرأ أول 1MB ويحلل إطار MPEG (Xing إن وُجد). */
async function estimateMp3Duration(url, contentLength) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Range: "bytes=0-1048575" },
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    let offset = 0;
    if (buf.length > 10 && buf.toString("latin1", 0, 3) === "ID3") {
      const size =
        ((buf[6] & 0x7f) << 21) |
        ((buf[7] & 0x7f) << 14) |
        ((buf[8] & 0x7f) << 7) |
        (buf[9] & 0x7f);
      offset = 10 + size;
    }
    const bitratesV1L3 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];
    const bitratesV2L3 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
    const sampleRatesV1 = [44100, 48000, 32000];
    const sampleRatesV2 = [22050, 24000, 16000];
    let frameStart = -1;
    for (let i = offset; i < buf.length - 4; i++) {
      if (buf[i] === 0xff && (buf[i + 1] & 0xe0) === 0xe0) {
        frameStart = i;
        break;
      }
    }
    if (frameStart < 0) return null;
    const b1 = buf[frameStart + 1];
    const b2 = buf[frameStart + 2];
    const versionBits = (b1 >> 3) & 0x3; // 3 = MPEG1, 2 = MPEG2
    const layerBits = (b1 >> 1) & 0x3; // 1 = Layer III
    if (layerBits !== 1 || (versionBits !== 3 && versionBits !== 2)) return null;
    const isV1 = versionBits === 3;
    const bitrateIndex = (b2 >> 4) & 0xf;
    const sampleRateIndex = (b2 >> 2) & 0x3;
    const bitrate = (isV1 ? bitratesV1L3 : bitratesV2L3)[bitrateIndex] || 128;
    const sampleRate = (isV1 ? sampleRatesV1 : sampleRatesV2)[sampleRateIndex] || 44100;

    // Xing / Info header (VBR)
    const sideInfo = isV1 ? 32 : 17;
    const xingOffset = frameStart + 4 + sideInfo;
    const tag = buf.toString("latin1", xingOffset, xingOffset + 4);
    if ((tag === "Xing" || tag === "Info") && xingOffset + 12 <= buf.length) {
      const flags = buf.readUInt32BE(xingOffset + 4);
      if (flags & 0x1) {
        const frames = buf.readUInt32BE(xingOffset + 8);
        if (frames > 0) return Math.round((frames * (isV1 ? 1152 : 576)) / sampleRate);
      }
    }
    if (contentLength > 0) {
      const audioBytes = contentLength - frameStart;
      return Math.round((audioBytes * 8) / (bitrate * 1000));
    }
    return null;
  } catch {
    return null;
  }
}

function cleanText(html) {
  return String(html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n\n")
    .trim();
}

function num(text) {
  const digits = String(text || "").replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function parseArticle($, el) {
  const $el = $(el);
  const idAttr = $el.attr("id") || "";
  const playercellId = (idAttr.match(/playercell-(\d+)/) || [])[1] || null;

  const title = $el.find("h3").first().text().trim();
  const scholarLink = $el.find('h4 a[href*="/ar/scholar/"]').first();
  const scholarHref = scholarLink.attr("href") || "";
  const scholarMatch = scholarHref.match(/\/ar\/scholar\/(\d+)\/profile\/(.+)$/);
  const scholarId = scholarMatch ? scholarMatch[1] : null;
  const scholarSlug = scholarMatch ? scholarMatch[2] : null;
  const scholarName = scholarLink.text().trim();

  const selectionUrl =
    $el.find(".share-box").attr("data-url") ||
    ($el.find(".report-problem").attr("href") || "").replace(/\/report-problem$/, "");
  const selectionId = (selectionUrl.match(/\/ar\/selection\/(\d+)/) || [])[1] || null;

  const shareTitle = $el.find(".share-box").attr("data-title") || title;

  const mp3 = $el.find('a[href*="download.tvquran.com"]').first().attr("href") || null;

  const stats = $el.find(".listitem-action .font-eng");
  const listens = stats.length > 0 ? num($(stats[0]).text()) : 0;
  const likes = stats.length > 1 ? num($(stats[1]).text()) : 0;

  let image = $el.find("img").first().attr("src") || null;
  if (image && image.startsWith("//")) image = `https:${image}`;
  if (image && image.includes("author_default")) image = null;

  return {
    playercellId,
    selectionId,
    title: shareTitle || title,
    scholarId,
    scholarSlug,
    scholarName,
    mp3: mp3 ? (mp3.startsWith("//") ? `https:${mp3}` : mp3) : null,
    listens,
    likes,
    image,
    sourceUrl: selectionId ? `${BASE}/ar/selection/${selectionId}` : null,
  };
}

async function scrapeCategory() {
  // ترتيب الصفحة عشوائي في بعض الحالات، لذا نجمع عدة عروض (views) لضمان تغطية كل التسجيلات.
  const VIEWS = ["most_listened", "likes", "new", "random", ""];
  const bySelection = new Map();

  for (const view of VIEWS) {
    let added = 0;
    for (let page = 1; page <= 4; page++) {
      const params = new URLSearchParams();
      if (view) params.set("view", view);
      params.set("sort", "desc");
      params.set("page", String(page));
      const url = `${CATEGORY_URL}?${params.toString()}`;
      let html;
      try {
        html = await fetchText(url);
      } catch (err) {
        console.warn(`  ! فشل تحميل ${view || "default"} صفحة ${page}: ${err.message}`);
        break;
      }
      const $ = cheerio.load(html);
      const articles = $("article.l-box").toArray();
      if (!articles.length) break;
      for (const el of articles) {
        const entry = parseArticle($, el);
        if (entry.selectionId && entry.scholarId && entry.mp3 && !bySelection.has(entry.selectionId)) {
          bySelection.set(entry.selectionId, entry);
          added++;
        }
      }
      if (articles.length < 20) break;
      await sleep(500);
    }
    console.log(`  عرض «${view || "default"}»: +${added} (الإجمالي ${bySelection.size})`);
    await sleep(400);
  }

  return [...bySelection.values()];
}

async function scrapeScholar(scholarId, scholarSlug, fallbackImage) {
  const url = `${BASE}/ar/scholar/${scholarId}/profile/${scholarSlug}`;
  const html = await fetchText(url);
  const $ = cheerio.load(html);
  const bioHtml = $("#scholarBiography").html() || "";
  const bioAr = cleanText(bioHtml);
  let image = $(".sheikh-details img").first().attr("src") || fallbackImage;
  if (image && image.startsWith("//")) image = `https:${image}`;
  if (image && image.includes("author_default")) image = null;
  const stats = $(".sheikh-infobox-foot .font-eng");
  const recordings = stats.length > 0 ? num($(stats[0]).text()) : 0;
  const listens = stats.length > 1 ? num($(stats[1]).text()) : 0;
  const likes = stats.length > 2 ? num($(stats[2]).text()) : 0;
  return { bioAr, image, recordings, listens, likes };
}

function loadJsonSafe(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

async function main() {
  console.log("═".repeat(60));
  console.log(" جلب محتوى الرقية الشرعية من tvquran.com");
  console.log("═".repeat(60));

  const scholarsEn = loadJsonSafe(path.join(DATA_DIR, "scholars-en.json"));
  const titlesEn = loadJsonSafe(path.join(DATA_DIR, "titles-en.json"));
  const bios = loadJsonSafe(path.join(DATA_DIR, "scholar-bios.json"));

  console.log("\n▸ كشط تصنيف الرقية الشرعية...");
  const entries = await scrapeCategory();
  console.log(`▸ إجمالي التسجيلات: ${entries.length}`);

  if (!entries.length) {
    console.error("✗ لم يتم العثور على أي تسجيل — تحقق من اتصال الشبكة أو بنية الموقع.");
    process.exit(1);
  }

  // تجميع حسب الشيخ
  const byScholar = new Map();
  for (const e of entries) {
    if (!byScholar.has(e.scholarId)) {
      byScholar.set(e.scholarId, {
        id: e.scholarId,
        slug: e.scholarSlug,
        nameAr: e.scholarName,
        imageUrl: e.image,
        tracks: [],
      });
    }
    const s = byScholar.get(e.scholarId);
    if (!s.imageUrl && e.image) s.imageUrl = e.image;
    s.tracks.push(e);
  }

  // ترتيب الأبحاث: المميزون أولاً ثم الأكثر استماعاً
  const FEATURED = ["212", "121"];
  const scholarList = [...byScholar.values()].sort((a, b) => {
    const ai = FEATURED.indexOf(a.id);
    const bi = FEATURED.indexOf(b.id);
    if (ai !== -1 || bi !== -1) {
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    }
    const la = a.tracks.reduce((sum, t) => sum + t.listens, 0);
    const lb = b.tracks.reduce((sum, t) => sum + t.listens, 0);
    return lb - la;
  });

  fs.mkdirSync(OUT_IMG_DIR, { recursive: true });

  console.log(`\n▸ معالجة ${scholarList.length} شيخاً (نبذة + صورة + إحصاءات)...`);
  const result = [];
  for (let i = 0; i < scholarList.length; i++) {
    const s = scholarList[i];
    process.stdout.write(`  [${i + 1}/${scholarList.length}] ${s.nameAr} ... `);

    let profile = { bioAr: "", image: s.imageUrl, recordings: 0, listens: 0, likes: 0 };
    try {
      profile = await scrapeScholar(s.id, s.slug, s.imageUrl);
    } catch (err) {
      console.warn(`تعذر جلب الملف (${err.message}).`);
    }

    // تنزيل الصورة
    let imagePath = null;
    const imageUrl = profile.image || s.imageUrl;
    if (imageUrl) {
      try {
        const { buffer, contentType } = await fetchBuffer(imageUrl);
        if (contentType.startsWith("image/")) {
          const ext = contentType.includes("png") ? "png" : "jpg";
          const file = `${s.id}.${ext}`;
          fs.writeFileSync(path.join(OUT_IMG_DIR, file), buffer);
          imagePath = `/images/scholars/${file}`;
        }
      } catch (err) {
        console.warn(`(صورة فاشلة: ${err.message})`);
      }
    }

    const manualBio = bios[s.id] || {};
    const nameEn =
      scholarsEn[s.id] ||
      scholarsEn[s.nameAr] ||
      s.nameAr;

    const tracks = [];
    for (const t of s.tracks) {
      const meta = await head(t.mp3);
      let duration = null;
      if (meta.ok && meta.contentLength) {
        duration = await estimateMp3Duration(t.mp3, meta.contentLength);
      }
      await sleep(120);
      tracks.push({
        id: `tvq-${t.selectionId}`,
        selectionId: t.selectionId,
        titleAr: manualBio.trackTitles?.[t.selectionId]?.ar || t.title,
        titleEn:
          titlesEn[t.title] ||
          manualBio.trackTitles?.[t.selectionId]?.en ||
          "Ruqyah",
        url: t.mp3,
        duration,
        sizeBytes: meta.contentLength || null,
        valid: meta.ok && meta.contentType.includes("audio"),
        listens: t.listens,
        likes: t.likes,
        sourceUrl: t.sourceUrl,
      });
    }

    const validTracks = tracks.filter((t) => t.valid);
    if (!validTracks.length) {
      console.log("تخطّي (لا صوت صالح)");
      continue;
    }

    result.push({
      id: s.id,
      slug: s.slug,
      name: { ar: s.nameAr, en: nameEn },
      bio: {
        ar: manualBio.ar || profile.bioAr || null,
        en: manualBio.en || null,
      },
      image: imagePath,
      stats: {
        recordings: profile.recordings || validTracks.length,
        listens: profile.listens || validTracks.reduce((a, t) => a + t.listens, 0),
        likes: profile.likes || validTracks.reduce((a, t) => a + t.likes, 0),
      },
      featured: FEATURED.includes(s.id),
      tracks: validTracks.sort((a, b) => b.listens - a.listens),
    });
    console.log(`✓ ${validTracks.length} تسجيل`);
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    source: BASE,
    featuredOrder: FEATURED,
    scholars: result,
  };
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2), "utf8");

  const totalTracks = result.reduce((a, s) => a + s.tracks.length, 0);
  console.log("\n" + "═".repeat(60));
  console.log(`✓ تم: ${result.length} شيخاً، ${totalTracks} تسجيل`);
  console.log(`✓ ${path.relative(ROOT, OUT_JSON)}`);
  console.log(`✓ ${path.relative(ROOT, OUT_IMG_DIR)}`);
}

main().catch((err) => {
  console.error("✗ خطأ:", err);
  process.exit(1);
});
