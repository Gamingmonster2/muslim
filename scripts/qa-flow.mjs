/**
 * فحص وظيفي تفاعلي عبر CDP:
 * تبديل الشيخ، التشغيل، ظهور المشغّل المصغّر، فتح الأقسام، تبديل الوضع، التنقّل.
 *
 * التشغيل: node scripts/qa-flow.mjs [baseUrl]
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const EDGE_CANDIDATES = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
];
const edge = EDGE_CANDIDATES.find((candidate) => existsSync(candidate));
const base = process.argv[2] ?? "http://localhost:4173";
const port = 9800 + Math.floor(Math.random() * 100);
const profile = join(tmpdir(), `ruqyah-flow-${Date.now()}`);

const browser = spawn(
  edge,
  [
    "--headless",
    `--remote-debugging-port=${port}`,
    "--disable-gpu",
    "--hide-scrollbars",
    "--forced-colors=none",
    "--disable-features=WebContentsForceDark,AutoDarkMode",
    "--autoplay-policy=no-user-gesture-required",
    "--mute-audio",
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
      /* لم يجهز */
    }
    await sleep(200);
  }
  throw new Error("devtools غير متاح");
}

class Cdp {
  constructor(socketUrl) {
    this.ws = new WebSocket(socketUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.ready = new Promise((resolveReady) => this.ws.addEventListener("open", () => resolveReady()));
    this.ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const entry = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) entry.reject(new Error(message.error.message));
        else entry.resolve(message.result);
      }
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
}

const checks = [];
const check = (name, pass, detail = "") => {
  checks.push({ name, pass, detail });
  console.log(`${pass ? "✅" : "❌"} ${name}${detail ? ` — ${detail}` : ""}`);
};

async function main() {
  await waitForDevtools();
  const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json());
  const target = targets.find((item) => item.type === "page");
  const cdp = new Cdp(target.webSocketDebuggerUrl);
  const consoleErrors = [];

  await cdp.send("Runtime.enable");
  await cdp.send("Page.enable");
  await cdp.send("Network.enable");
  const mediaRequests = [];
  cdp.ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method === "Runtime.exceptionThrown") {
      consoleErrors.push(message.params.exceptionDetails?.exception?.description ?? "استثناء");
    }
    if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
      consoleErrors.push((message.params.args ?? []).map((arg) => arg.value ?? "").join(" "));
    }
    if (message.method === "Network.requestWillBeSent") {
      const requestUrl = message.params.request?.url ?? "";
      if (requestUrl.includes("tvquran") || /\.mp3/.test(requestUrl)) {
        mediaRequests.push(requestUrl);
      }
    }
  });

  const evaluate = async (expression) => {
    const result = await cdp.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result?.value;
  };

  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-color-scheme", value: "light" },
      { name: "forced-colors", value: "none" },
    ],
  });

  // 1) الصفحة الرئيسية
  await cdp.send("Page.navigate", { url: `${base}/` });
  await sleep(2500);

  const home = await evaluate(`(() => ({
    h1: document.querySelector('.hero__title')?.textContent?.trim(),
    sheikhCards: document.querySelectorAll('.sheikh').length,
    activeSheikh: document.querySelector('.sheikh.is-active .sheikh__name')?.textContent?.trim(),
    playerSheikh: document.querySelector('.player__sheikh')?.textContent?.trim(),
    theme: document.documentElement.dataset.theme,
  }))()`);
  check("الصفحة الرئيسية تعمل", home?.h1 === "الرقية الشرعية", JSON.stringify(home));
  check("بطاقتا الشيخين موجودتان", home?.sheikhCards === 2);
  check("القارئ الافتراضي سعود الفايز", home?.playerSheikh === "سعود الفايز", home?.playerSheikh);

  // 2) تبديل الشيخ
  await evaluate(`document.querySelectorAll('.sheikh')[1].click()`);
  await sleep(900);
  const afterSwitch = await evaluate(`(() => ({
    playerSheikh: document.querySelector('.player__sheikh')?.textContent?.trim(),
    title: document.querySelector('.player__title')?.textContent?.trim(),
    active: document.querySelector('.sheikh.is-active .sheikh__name')?.textContent?.trim(),
  }))()`);
  check(
    "تبديل القارئ يعمل دون تشغيل مزدوج",
    afterSwitch?.playerSheikh === "عصام العويد",
    JSON.stringify(afterSwitch)
  );

  // 3) التشغيل
  await evaluate(`document.querySelector('.ring__play').click()`);
  await sleep(6000);
  const playing = await evaluate(`(() => ({
    label: document.querySelector('.ring__play')?.getAttribute('aria-label'),
    error: document.querySelector('.player__error')?.textContent?.trim() ?? null,
    equalizerOn: !!document.querySelector('.player .equalizer.is-on'),
    pauseIcon: !!document.querySelector('.ring__play svg rect'),
    audioElements: document.querySelectorAll('audio').length,
  }))()`);
  check(
    "زر التشغيل يتحول إلى إيقاف مؤقت",
    playing?.label === "إيقاف مؤقت" || playing?.pauseIcon === true,
    JSON.stringify(playing)
  );
  check("لا يوجد خطأ صوت", !playing?.error, playing?.error ?? "لا شيء");
  check(
    "تم طلب ملف الصوت من المصدر",
    mediaRequests.length > 0,
    mediaRequests[0]?.slice(0, 90) ?? "لا طلب"
  );

  // 4) التنقّل إلى صفحة النص
  await evaluate(`document.querySelectorAll('.tab')[1].click()`);
  await sleep(1500);
  const textPage = await evaluate(`(() => ({
    path: location.pathname,
    title: document.querySelector('.page__title')?.textContent?.trim(),
    sections: document.querySelectorAll('.section').length,
    ayahsOpen: document.querySelectorAll('.ayah').length,
    mini: !!document.querySelector('.mini'),
    miniTitle: document.querySelector('.mini__text strong')?.textContent?.trim() ?? null,
  }))()`);
  check("صفحة نص الرقية تفتح", textPage?.path === "/text" && textPage?.title === "نص الرقية الشرعية", JSON.stringify(textPage));
  check("عدد الأقسام 19", textPage?.sections === 19, String(textPage?.sections));
  check("القسم الأول مفتوح ويعرض 7 آيات", textPage?.ayahsOpen === 7, String(textPage?.ayahsOpen));
  check("المشغّل المصغّر يظهر خارج الرئيسية", textPage?.mini === true);

  // 5) فتح قسم آخر (أكورديون: يفتح واحدًا ويغلق السابق)
  await evaluate(`document.querySelectorAll('.section__head')[2].click()`);
  await sleep(600);
  const expanded = await evaluate(`(() => {
    const sections = [...document.querySelectorAll('.section')];
    return {
      openCount: sections.filter((item) => item.classList.contains('is-open')).length,
      thirdOpen: sections[2]?.classList.contains('is-open') ?? false,
      ayahs: document.querySelectorAll('.ayah').length,
    };
  })()`);
  check(
    "فتح قسم آخر يغلق السابق (أكورديون)",
    expanded?.openCount === 1 && expanded?.thirdOpen === true,
    JSON.stringify(expanded)
  );

  // 6) تعليم "تمّت القراءة"
  await evaluate(`[...document.querySelectorAll('.section')][2].querySelector('.btn').click()`);
  await sleep(400);
  const readState = await evaluate(`(() => ({
    isRead: [...document.querySelectorAll('.section')][2].classList.contains('is-read'),
    progressText: document.querySelector('.progresscard__row')?.textContent?.replace(/\\s+/g,' ').trim(),
    stored: localStorage.getItem('ruqyah:read-sections'),
  }))()`);
  check("تسجيل إتمام القراءة يعمل", readState?.isRead === true, readState?.progressText);
  check("التقدّم يُحفظ محليًا", (readState?.stored ?? "").includes("kursi") || (readState?.stored ?? "").includes("baqarah"), readState?.stored);

  // 7) الأدعية
  await evaluate(`document.querySelectorAll('.tab')[2].click()`);
  await sleep(800);
  const duas = await evaluate(`(() => ({
    title: document.querySelector('.page__title')?.textContent?.trim(),
    count: document.querySelectorAll('.dua').length,
  }))()`);
  check("صفحة الأدعية تعمل", duas?.title === "أدعية الشفاء" && duas?.count >= 8, JSON.stringify(duas));

  // 8) عن التطبيق
  await evaluate(`document.querySelectorAll('.tab')[3].click()`);
  await sleep(800);
  const about = await evaluate(`(() => ({
    title: document.querySelector('.page__title')?.textContent?.trim(),
    cards: document.querySelectorAll('.page .card').length,
    padded: [...document.querySelectorAll('.page .card')].every((card) => parseFloat(getComputedStyle(card).paddingTop) > 8),
  }))()`);
  check(
    "صفحة عن التطبيق تعمل",
    about?.title === "الرقية الشرعية" && about?.cards >= 4 && about?.padded === true,
    JSON.stringify(about)
  );

  // 9) تبديل الوضع
  await evaluate(`document.querySelector('.header__actions .icon-btn:last-child').click()`);
  await sleep(500);
  const themeAfter = await evaluate(`document.documentElement.dataset.theme`);
  check("تبديل الوضع يعمل", themeAfter === "dark", themeAfter);

  // 10) رابط مباشر لصفحة
  await cdp.send("Page.navigate", { url: `${base}/text` });
  await sleep(2000);
  const deepLink = await evaluate(`(() => ({
    path: location.pathname,
    hasContent: !!document.querySelector('.sections'),
  }))()`);
  check("الروابط المباشرة تعمل (SPA)", deepLink?.path === "/text" && deepLink?.hasContent === true, JSON.stringify(deepLink));

  check("لا توجد أخطاء كونسول", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));

  const failed = checks.filter((item) => !item.pass);
  console.log(`\n${checks.length - failed.length}/${checks.length} فحصًا ناجحًا`);
  if (failed.length) process.exitCode = 2;
}

main()
  .catch((error) => {
    console.error("FLOW_FAILED:", error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    try {
      browser.kill();
    } catch {
      /* تجاهل */
    }
  });
