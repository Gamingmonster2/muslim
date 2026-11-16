/**
 * أداة فحص بصري/تقني تعمل على Edge/Chrome عبر بروتوكول CDP.
 * تفتح الصفحة، تحاكي هاتفًا، تلتقط لقطات للوضعين النهاري والليلي،
 * وتجمع أخطاء الكونسول وقياسات التجاوز الأفقي.
 *
 * التشغيل: node scripts/qa.mjs [url] [name]
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const EDGE_CANDIDATES = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
];

const url = process.argv[2] ?? "http://localhost:4173/";
const name = process.argv[3] ?? "page";
const outDir = resolve(root, "../shots");
const edge = EDGE_CANDIDATES.find((candidate) => existsSync(candidate));

if (!edge) {
  console.error("لم يُعثر على متصفح Edge/Chrome.");
  process.exit(1);
}

const port = 9400 + Math.floor(Math.random() * 400);
const profile = join(tmpdir(), `ruqyah-qa-${Date.now()}`);
const browser = spawn(
  edge,
  [
    "--headless",
    `--remote-debugging-port=${port}`,
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-color-profile=srgb",
    "--forced-colors=none",
    "--disable-features=WebContentsForceDark,AutoDarkMode",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore", windowsHide: true }
);

const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));

async function waitForDevtools() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {
      /* لم يجهز بعد */
    }
    await sleep(200);
  }
  throw new Error("تعذّر الاتصال بـ devtools");
}

class Cdp {
  constructor(socketUrl) {
    this.ws = new WebSocket(socketUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
    this.ready = new Promise((resolveReady, rejectReady) => {
      this.ws.addEventListener("open", () => resolveReady());
      this.ws.addEventListener("error", () => rejectReady(new Error("فشل اتصال WebSocket")));
    });
    this.ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve: resolveSend, reject: rejectSend } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) rejectSend(new Error(message.error.message));
        else resolveSend(message.result);
        return;
      }
      this.events.push(message);
    });
  }

  async send(method, params = {}) {
    await this.ready;
    const id = this.nextId++;
    const promise = new Promise((resolveSend, rejectSend) => {
      this.pending.set(id, { resolve: resolveSend, reject: rejectSend });
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          rejectSend(new Error(`مهلة ${method}`));
        }
      }, 20000);
    });
    this.ws.send(JSON.stringify({ id, method, params }));
    return promise;
  }

  close() {
    try {
      this.ws.close();
    } catch {
      /* تجاهل */
    }
  }
}

async function evaluate(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return result.result?.value;
}

const METRICS_SCRIPT = `(() => {
  const doc = document.documentElement;
  const pick = (selector) => {
    const el = document.querySelector(selector);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  };
  const style = (selector) => {
    const el = document.querySelector(selector);
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { bg: cs.backgroundColor, color: cs.color, border: cs.borderTopColor };
  };
  return {
    viewport: { w: innerWidth, h: innerHeight, dpr: devicePixelRatio },
    scroll: { w: doc.scrollWidth, h: doc.scrollHeight, overflowX: doc.scrollWidth - innerWidth },
    theme: doc.dataset.theme,
    dir: doc.dir,
    lang: doc.lang,
    title: document.title,
    h1: document.querySelector('h1')?.textContent?.trim() ?? null,
    colors: {
      body: style('body'),
      card: style('.sheikh'),
      hero: style('.hero__arch'),
      tabbar: style('.tabbar__inner'),
      varBg: getComputedStyle(doc).getPropertyValue('--bg').trim(),
      varGold: getComputedStyle(doc).getPropertyValue('--gold').trim(),
      colorScheme: getComputedStyle(doc).colorScheme,
      forcedDark: matchMedia('(forced-colors: active)').matches,
      prefersDark: matchMedia('(prefers-color-scheme: dark)').matches,
    },
    shell: pick('.shell'),
    header: pick('.header'),
    brand: pick('.brand'),
    hero: pick('.hero__arch'),
    sheikhGrid: pick('.sheikhs__grid'),
    player: pick('.player'),
    ring: pick('.ring'),
    tabbar: pick('.tabbar'),
    fontsReady: document.fonts ? document.fonts.status : 'n/a',
    ayahCount: document.querySelectorAll('.ayah').length,
    sectionCount: document.querySelectorAll('.section').length,
    imagesBroken: [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src),
  };
})()`;

async function main() {
  await mkdir(outDir, { recursive: true });
  await waitForDevtools();

  const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json());
  const pageTarget = targets.find((target) => target.type === "page");
  if (!pageTarget) throw new Error("لا توجد صفحة مستهدفة");

  const cdp = new Cdp(pageTarget.webSocketDebuggerUrl);
  const consoleMessages = [];
  const errors = [];

  await cdp.send("Runtime.enable");
  await cdp.send("Page.enable");
  await cdp.send("Log.enable");
  cdp.ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method === "Runtime.consoleAPICalled") {
      const text = (message.params.args ?? [])
        .map((arg) => arg.value ?? arg.description ?? "")
        .join(" ");
      consoleMessages.push({ type: message.params.type, text });
      if (message.params.type === "error") errors.push(text);
    }
    if (message.method === "Runtime.exceptionThrown") {
      errors.push(message.params.exceptionDetails?.exception?.description ?? "استثناء");
    }
    if (message.method === "Log.entryAdded" && message.params.entry.level === "error") {
      errors.push(message.params.entry.text);
    }
  });

  const results = {};

  for (const theme of ["light", "dark"]) {
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await cdp.send("Emulation.setEmulatedMedia", {
      features: [
        { name: "prefers-color-scheme", value: theme },
        { name: "forced-colors", value: "none" },
        { name: "prefers-reduced-motion", value: "no-preference" },
      ],
    });
    // تعطيل الوضع الداكن التلقائي للمتصفح حتى لا يشوّه الألوان
    try {
      await cdp.send("Emulation.setAutoDarkModeOverride", { enabled: false });
    } catch {
      /* غير مدعوم */
    }
    await cdp.send("Emulation.setDefaultBackgroundColorOverride", {
      color:
        theme === "dark"
          ? { r: 8, g: 17, b: 15, a: 1 }
          : { r: 246, g: 241, b: 231, a: 1 },
    });
    await cdp.send("Page.navigate", { url });
    await sleep(2600);

    const metrics = await evaluate(cdp, METRICS_SCRIPT);

    // نوسّع مقاس العرض إلى طول الصفحة كي تلتقط اللقطة كاملة
    // (captureBeyondViewport ينتج صورة سوداء في بعض نسخ المتصفح)
    const layout = await cdp.send("Page.getLayoutMetrics");
    const content = layout.cssContentSize ?? layout.contentSize;
    const fullHeight = Math.min(Math.ceil(content.height), 6400);
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: fullHeight,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await sleep(700);

    const shot = await cdp.send("Page.captureScreenshot", { format: "png" });
    await writeFile(join(outDir, `${name}-${theme}.png`), Buffer.from(shot.data, "base64"));
    results[theme] = metrics;

    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
  }

  results.console = consoleMessages.slice(0, 40);
  results.errors = errors.slice(0, 20);

  await writeFile(join(outDir, `${name}-report.json`), JSON.stringify(results, null, 2), "utf8");
  console.log(JSON.stringify(results, null, 2));

  cdp.close();
}

main()
  .catch((error) => {
    console.error("QA_FAILED:", error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    try {
      browser.kill();
    } catch {
      /* تجاهل */
    }
  });
