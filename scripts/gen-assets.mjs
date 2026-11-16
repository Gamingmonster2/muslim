#!/usr/bin/env node
/**
 * يولّد أيقونات PWA وغلاف OpenGraph بدون أي اعتماديات (PNG عبر zlib المدمج).
 * المخرجات: public/icons/*.png, public/apple-touch-icon.png, public/images/og-cover.png
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");

/* ----------------------------- PNG encoder ----------------------------- */
const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(8 + data.length + 4);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "ascii");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, "ascii"), data])), 8 + data.length);
  return out;
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* --------------------------- أدوات الرسم --------------------------- */
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function createBuffer(width, height) {
  return Buffer.alloc(width * height * 4, 0);
}

function setPixel(buf, width, x, y, r, g, b, a) {
  if (x < 0 || y < 0 || x >= width || y >= buf.length / 4 / width) return;
  const i = (y * width + x) * 4;
  const alpha = a / 255;
  const inv = 1 - alpha;
  buf[i] = clamp(Math.round(r * alpha + buf[i] * inv), 0, 255);
  buf[i + 1] = clamp(Math.round(g * alpha + buf[i + 1] * inv), 0, 255);
  buf[i + 2] = clamp(Math.round(b * alpha + buf[i + 2] * inv), 0, 255);
  buf[i + 3] = clamp(Math.round(a + buf[i + 3] * inv), 0, 255);
}

function hex(color) {
  const c = color.replace("#", "");
  return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
}

function fillGradient(buf, width, height, from, to) {
  const a = hex(from);
  const b = hex(to);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const t = (x / width + y / height) / 2;
      setPixel(buf, width, x, y, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, 255);
    }
  }
}

function roundedMask(buf, width, height, radius) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const left = x < radius ? radius - x : 0;
      const right = x >= width - radius ? x - (width - radius) + 1 : 0;
      const top = y < radius ? radius - y : 0;
      const bottom = y >= height - radius ? y - (height - radius) + 1 : 0;
      const dx = Math.max(left, right);
      const dy = Math.max(top, bottom);
      const corner = Math.sqrt(dx * dx + dy * dy);
      if (corner > radius) buf[(y * width + x) * 4 + 3] = 0;
    }
  }
}

function drawStar(buf, width, cx, cy, radius, color) {
  const [r, g, b] = hex(color);
  const diamond = radius * 1.4;
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y++) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x++) {
      const dx = x - cx;
      const dy = y - cy;
      const inSquare = Math.abs(dx) <= radius && Math.abs(dy) <= radius;
      const inDiamond = Math.abs(dx) + Math.abs(dy) <= diamond;
      if (inSquare || inDiamond) setPixel(buf, width, x, y, r, g, b, 255);
    }
  }
}

function drawCrescent(buf, width, cx, cy, radius, offset, color) {
  const [r, g, b] = hex(color);
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y++) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x++) {
      const d1 = (x - cx) * (x - cx) + (y - cy) * (y - cy);
      const d2 = (x - (cx + offset)) * (x - (cx + offset)) + (y - cy) * (y - cy);
      if (d1 <= radius * radius && d2 > radius * radius) {
        setPixel(buf, width, x, y, r, g, b, 255);
      }
    }
  }
}

/* --------------------------- رسم الأيقونة --------------------------- */
function drawAppIcon(width, { rounded = true, safe = false } = {}) {
  const buf = createBuffer(width, width);
  fillGradient(buf, width, width, "#0f6b4f", "#0b3d2e");
  if (rounded) roundedMask(buf, width, width, Math.round(width * 0.22));

  const scale = width / 512;
  const pad = safe ? width * 0.12 : width * 0.05;

  // نجمة ذهبية صغيرة أعلى
  drawStar(buf, width, width / 2, width * 0.3, width * 0.13, "#d9b64a");
  // هلال أبيض
  const crescentR = (width - pad * 2) * 0.34;
  drawCrescent(buf, width, width / 2, width * 0.52, crescentR, crescentR * 0.5, "#ffffff");
  // قاعدة كتاب ذهبية
  const [gr, gg, gb] = hex("#d9b64a");
  const baseY0 = width * 0.7;
  const baseY1 = width * 0.78;
  for (let y = baseY0; y < baseY1; y++) {
    for (let x = width * 0.28; x < width * 0.72; x++) {
      const ny = (y - baseY0) / (baseY1 - baseY0);
      const inset = Math.sin(ny * Math.PI) * width * 0.03;
      if (x > width * 0.28 + inset && x < width * 0.72 - inset) {
        setPixel(buf, width, x, y, gr, gg, gb, 255);
      }
    }
  }
  return encodePng(width, width, buf);
}

/* --------------------------- غلاف OpenGraph --------------------------- */
function drawOgCover() {
  const width = 1200;
  const height = 630;
  const buf = createBuffer(width, height);
  fillGradient(buf, width, height, "#0b3d2e", "#0f6b4f");
  // زخرفة نقاط
  for (let y = 0; y < height; y += 40) {
    for (let x = 0; x < width; x += 40) {
      const [r, g, b] = hex("#ffffff");
      setPixel(buf, width, x, y, r, g, b, 10);
    }
  }
  const cx = width / 2;
  const cy = height / 2;
  drawStar(buf, width, cx, cy - 80, 90, "#d9b64a");
  drawCrescent(buf, width, cx, cy, 190, 95, "#ffffff");
  const [gr, gg, gb] = hex("#d9b64a");
  for (let y = 480; y < 510; y++) {
    for (let x = 420; x < 780; x++) {
      setPixel(buf, width, x, y, gr, gg, gb, 255);
    }
  }
  return encodePng(width, height, buf);
}

function main() {
  fs.mkdirSync(path.join(PUBLIC, "icons"), { recursive: true });
  fs.mkdirSync(path.join(PUBLIC, "images"), { recursive: true });

  const targets = [
    ["icons/icon-192.png", () => drawAppIcon(192)],
    ["icons/icon-512.png", () => drawAppIcon(512)],
    ["icons/icon-maskable-512.png", () => drawAppIcon(512, { rounded: false, safe: true })],
    ["apple-touch-icon.png", () => drawAppIcon(180, { rounded: false })],
    ["images/og-cover.png", drawOgCover],
  ];

  for (const [file, fn] of targets) {
    const buffer = fn();
    const out = path.join(PUBLIC, file);
    fs.writeFileSync(out, buffer);
    console.log(`✓ ${file} (${Math.round(buffer.length / 1024)} KB)`);
  }
}

main();
