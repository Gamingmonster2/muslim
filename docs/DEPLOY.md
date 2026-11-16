# دليل النشر على Cloudflare Pages

هذا الدليل يشرح خطوة بخطوة كيف يُنشر التطبيق على Cloudflare Pages ثم يُربط بالنطاق المخصّص.

---

## ١) المتطلبات

- حساب [Cloudflare](https://dash.cloudflare.com/sign-up) مجاني.
- المستودع على GitHub: `Gamingmonster2/muslim`.
- النطاق (إن أردت الربط)، ويُفضّل أن يكون مُدارًا من Cloudflare.

## ٢) إنشاء مشروع Pages وربطه بالمستودع

1. من لوحة Cloudflare: **Workers & Pages** ← **Create application** ← **Pages** ← **Connect to Git**.
2. امنح Cloudflare صلاحية الوصول إلى مستودع `muslim` (قد يطلب تثبيت GitHub App على حسابك).
3. اختر المستودع والفرع: `main`.
4. أدخل إعدادات البناء:

| الإعداد | القيمة |
| --- | --- |
| Framework preset | `None` |
| Build command | `npm ci --include=dev && npm run build` |
| Build output directory | `dist` |
| Root directory | `/` (اتركه فارغًا) |

5. أضف متغيّر بيئة (Environment variables ← Production):

```
NODE_VERSION = 24
```

> **لماذا `--include=dev`؟** لأن Cloudflare قد يضبط `NODE_ENV=production` فيتجاهل حزم التطوير مثل Vite وTypeScript، فيفشل البناء. هذا الأمر يضمن تثبيتها.

6. اضغط **Save and Deploy**. سيبدأ البناء، وبعد ١–٢ دقيقة يظهر رابط مثل:
   `https://ruqyah-shariyyah.pages.dev`

## ٣) النشر التلقائي

بعد الربط، أي `git push` إلى الفرع `main` يعيد البناء والنشر تلقائيًا. لا حاجة لأي خطوة يدوية.

## ٤) ربط النطاق المخصّص

1. في مشروع Pages ← **Custom domains** ← **Set up a custom domain**.
2. أدخل النطاق كما تريده، مثال:
   - `example.com` (الجذر)، أو
   - `ruqyah.example.com` (نطاق فرعي).
3. Cloudflare يعرض سجل DNS المطلوب:
   - للنطاق الفرعي: `CNAME` يشير إلى `<اسم-المشروع>.pages.dev`.
   - للجذر: سجلات `A`/`AAAA` التي تعرضها Cloudflare (أو CNAME مع `Flattening`).
4. أضف السجل في DNS (داخل Cloudflare: **DNS ← Records**).
5. انتظر حالة **Active**، وتُصدر الشهادة (SSL/TLS) تلقائيًا.

### إذا كان النطاق مُسجّلًا خارج Cloudflare

- الأفضل: تغيير **Nameservers** للنطاق إلى خوادم Cloudflare (يعرضها لك عند إضافة الموقع: **Add a site**).
- بديل: إضافة سجل `CNAME` عند مزوّد النطاق يشير إلى `<project>.pages.dev` (يدعم الشهادات تلقائيًا، لكن الربط على الجذر قد يحتاج مزوّدًا يدعم `CNAME Flattening`).

## ٥) التحقق بعد النشر

- افتح الرابط وتأكد من:
  - ظهور الواجهة العربية RTL واتجاه صحيح.
  - تشغيل الصوت من زر التشغيل.
  - فتح صفحة النص (تأكد أن **SPA fallback** يعمل بفضل `_redirects`).
  - تثبيت PWA من المتصفح (أيقونة التثبيت في الرأس).
- اختبر على الهاتف (أهم شيء).

## ٦) ملاحظات فنية

- **الصوت** يُبثّ من `download.tvquran.com` مباشرة عبر HTTPS. لا حاجة لإعداد CORS لأنه يُشغّل عبر عنصر `<audio>` (وليس `fetch`).
- **الصور** والخطوط والأيقونات محلية داخل `dist` فلا تعتمد على أطراف خارجية.
- **الروابط المباشرة** مثل `/text` تعمل بفضل `public/_redirects`.
- **الكاش**: الأصول المُجزّأة (hashed) تُخزّن سنة كاملة عبر `public/_headers`، أما `sw.js` فلا يُخزّن.
- عند تحديث الواجهة لاحقًا: ارفع رقم `VERSION` في `public/sw.js` لضمان تحديث الكاش عند المستخدمين.

## ٧) استكشاف الأخطاء

| المشكلة | الحل |
| --- | --- |
| فشل البناء: `vite: not found` | تأكد من `npm ci --include=dev` |
| فشل البناء: إصدار Node قديم | أضف `NODE_VERSION=24` |
| صفحة فرعية تعطي 404 عند التحديث | تأكد من وجود `public/_redirects` في `dist` |
| النطاق لا يتفعّل | تحقق من سجلات DNS وأن النطاق على نفس حساب Cloudflare |
| الصوت لا يعمل | افتح الرابط على HTTPS، وتأكد أن مصدر الصوت لم يتغيّر |

---

## ٨) الرفع المباشر (بديل بلا GitHub)

```bash
npm run build
npx wrangler pages deploy dist --project-name ruqyah-shariyyah
```

سيطلب wrangler تسجيل الدخول عبر المتصفح أول مرة.
