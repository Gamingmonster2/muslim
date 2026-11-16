/**
 * يولّد أيقونات PWA (PNG) من الأيقونة المتجهية.
 * التشغيل: npm run icons
 */
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const source = resolve(root, "public/icons/icon.svg");
const svg = await readFile(source);

const targets = [
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
  { file: "maskable-512.png", size: 512 },
  { file: "apple-touch-icon.png", size: 180 },
];

for (const { file, size } of targets) {
  const out = resolve(root, "public/icons", file);
  await sharp(svg, { density: 384 })
    .resize(size, size, { fit: "contain", background: "#082c26" })
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`✓ ${file} (${size}×${size})`);
}
