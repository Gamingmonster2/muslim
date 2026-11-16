#!/usr/bin/env node
/**
 * يفحص صحة روابط الصوت (HTTP 200 + نوع صوتي).
 * افتراضياً: يفحص كل تسجيلات الرقية + عيّنة من مسارات المكتبة.
 * --full: يفحص كل مسارات المكتبة أيضاً.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FULL = process.argv.includes("--full");

const UA = "muslim.com.ly content validator";

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

async function head(url) {
  try {
    const res = await fetch(url, { method: "HEAD", headers: { "User-Agent": UA } });
    const type = res.headers.get("content-type") || "";
    return { ok: res.ok && /audio|octet-stream/.test(type), status: res.status, type };
  } catch {
    return { ok: false, status: 0, type: "" };
  }
}

async function runWithConcurrency(items, worker, limit = 6) {
  const results = [];
  let cursor = 0;
  async function next() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  }
  const threads = Array.from({ length: Math.min(limit, items.length) }, next);
  await Promise.all(threads);
  return results;
}

async function main() {
  const scholars = readJson("src/content/generated/scholars.json").scholars ?? [];
  const library = readJson("src/content/generated/library.json").items ?? [];

  const scholarTracks = scholars.flatMap((s) => s.tracks);
  const libraryTracks = library.flatMap((item) =>
    FULL
      ? item.tracks
      : item.tracks.filter((_, index) => index === 0 || index === item.tracks.length - 1)
  );

  const items = [
    ...scholarTracks.map((t) => ({ label: t.titleAr ?? t.title?.ar, url: t.url })),
    ...libraryTracks.map((t) => ({ label: t.title?.ar, url: t.url })),
  ];

  console.log(`فحص ${items.length} رابطاً صوتياً…`);
  const results = await runWithConcurrency(items, async (item) => ({
    ...item,
    ...(await head(item.url)),
  }));

  const failed = results.filter((r) => !r.ok);
  for (const f of failed.slice(0, 40)) {
    console.log(`✗ [${f.status}] ${f.label} — ${f.url}`);
  }
  console.log(
    `\n✓ سليم: ${results.length - failed.length} · ✗ فاشل: ${failed.length}`
  );
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error("✗ خطأ:", err.message);
  process.exit(1);
});
