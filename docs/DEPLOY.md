# دليل النشر على Cloudflare Pages

ينشر المشروع على **Cloudflare Pages** (موقع ثابت) مربوط بمستودع GitHub `Gamingmonster2/muslim`، ثم يُربط بالنطاق `muslim.com.ly`.

## 1) ادفع الكود إلى GitHub

```bash
git push origin main
```

## 2) أنشئ مشروع Pages

1. ادخل [لوحة Cloudflare](https://dash.cloudflare.com) ← **Workers & Pages** ← **Create** ← **Pages** ← **Connect to Git**.
2. اختر الحساب ثم المستودع `Gamingmonster2/muslim`.
3. إعدادات البناء:
   - **Framework preset:** Next.js (Static HTML Export)
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Node.js version:** `22` (متغير `NODE_VERSION=22` إن طُلب)
4. اضغط **Save and Deploy**.

> البناء يولّد تلقائياً: كل الصفحات الثابتة + `sitemap.xml` + `robots.txt` + `sw.js` (سكربت الخدمة) عبر `prebuild` و`postbuild`.

## 3) اربط النطاق المخصص

1. داخل المشروع ← **Custom domains** ← **Set up a custom domain**.
2. أضف `muslim.com.ly` ثم `www.muslim.com.ly`.
3. اتبع تعليمات Cloudflare لإضافة سجل CNAME (`www` → `<project>.pages.dev`) وتأكد أن النطاق مُفعَّل بوكسي Cloudflare (البرتقالي).
4. فعّل **Always Use HTTPS**.

## 4) كل نشر تالٍ تلقائي

أي `git push` إلى `main` يعيد البناء والنشر تلقائياً من Cloudflare.

## تحديث المحتوى (الشيوخ/المكتبة)

المحتوى مضمّن في المستودع كملفات JSON (لضمان سرعة وثبات الموقع دون الاعتماد على مصادر خارجية وقت التشغيل):

```bash
npm run content:tvquran   # يحدّث شيوخ الرقية من tvquran
npm run content:archive   # يحدّث المكتبة من archive.org
npm run content:validate  # يفحص صحة كل روابط الصوت
git add -A && git commit -m "تحديث المحتوى" && git push
```

يمكن أتمتة ذلك لاحقاً بـ GitHub Actions (تشغيل أسبوعي وفتح Pull Request).

## ملفات مساندة مستخدمة تلقائياً

- `public/_headers` — قواعد التخزين المؤقت والأمان.
- `public/manifest.webmanifest` — تثبيت PWA.
- `public/icons/*.png` و`public/apple-touch-icon.png` — أيقونات التطبيق (مولَّدة بـ`npm run gen:assets`).

## ملاحظة أمنية

الموقع ثابت بلا خادم؛ كل التفضيلات تُحفظ على جهاز المستخدم فقط. لا بيانات شخصية ولا تتبّع.
