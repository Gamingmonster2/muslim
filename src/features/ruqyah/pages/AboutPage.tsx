import { Link } from "react-router-dom";
import { Icon } from "../../../components/Icon";
import { toArabicDigits } from "../../../core/format";
import { useInstallPrompt } from "../../../core/useInstallPrompt";
import { quranSource } from "../data/quran";
import { ruqyahSections } from "../data/sections";
import { duas } from "../data/duas";

export function AboutPage() {
  const { canInstall, installed, install } = useInstallPrompt();

  return (
    <div className="page">
      <header className="page__head">
        <p className="eyebrow">عن التطبيق</p>
        <h1 className="page__title">الرقية الشرعية</h1>
        <p className="page__desc">
          تطبيق بسيط وسريع للاستماع إلى الرقية الشرعية وقراءة آياتها وأدعيتها، يعمل دون اتصال
          بعد أول زيارة.
        </p>
      </header>

      <section className="card aboutcard">
        <h2 className="aboutcard__title">ثبّت التطبيق على جهازك</h2>
        <p className="aboutcard__text">
          {installed
            ? "التطبيق مثبّت بالفعل. يمكنك فتحه من أيقونته على الشاشة الرئيسية."
            : "أضف التطبيق إلى الشاشة الرئيسية ليُفتح كتطبيق مستقل، ويعمل أسرع وبدون شريط المتصفح."}
        </p>
        {installed ? (
          <span className="btn btn--primary is-disabled">
            <Icon name="check" size={18} /> مثبّت
          </span>
        ) : canInstall ? (
          <button type="button" className="btn btn--primary" onClick={() => void install()}>
            <Icon name="install" size={18} /> تثبيت التطبيق
          </button>
        ) : (
          <p className="aboutcard__hint">
            على الهاتف: افتح قائمة المتصفح ثم اختر «إضافة إلى الشاشة الرئيسية».
          </p>
        )}
      </section>

      <section className="card aboutcard">
        <h2 className="aboutcard__title">المحتوى</h2>
        <ul className="facts">
          <li>
            <span className="facts__label">أقسام نص الرقية</span>
            <span className="facts__value">{toArabicDigits(ruqyahSections.length)}</span>
          </li>
          <li>
            <span className="facts__label">أدعية الشفاء</span>
            <span className="facts__value">{toArabicDigits(duas.length)}</span>
          </li>
          <li>
            <span className="facts__label">القارئان</span>
            <span className="facts__value">سعود الفايز · عصام العويد</span>
          </li>
        </ul>
      </section>

      <section className="card aboutcard">
        <h2 className="aboutcard__title">المصادر</h2>
        <ul className="sources">
          <li>
            <span className="sources__label">الصوت</span>
            <a
              className="sources__link"
              href="https://www.tvquran.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              tvQuran <Icon name="external" size={14} />
            </a>
          </li>
          <li>
            <span className="sources__label">نص القرآن</span>
            <span className="sources__value">{quranSource}</span>
          </li>
          <li>
            <span className="sources__label">الأدعية</span>
            <span className="sources__value">الصحيحان والسنن — مع ذكر المرجع لكل دعاء</span>
          </li>
        </ul>
      </section>

      <section className="card aboutcard">
        <h2 className="aboutcard__title">الخصوصية</h2>
        <ul className="ticklist">
          <li>لا يوجد حساب ولا تسجيل دخول.</li>
          <li>لا نجمع بيانات شخصية ولا نتتبّع الاستخدام.</li>
          <li>تُحفظ مواضع الاستماع والتقدّم داخل جهازك فقط.</li>
          <li>الصوت يُبثّ من مصدره مباشرة عبر اتصال آمن.</li>
        </ul>
      </section>

      <section className="card aboutcard card--warm">
        <h2 className="aboutcard__title">تنبيه</h2>
        <p className="aboutcard__text">
          الرقية الشرعية سبب من أسباب الشفاء، ولا تُغني عن مراجعة الطبيب المختص عند الحاجة.
          احرص على الأخذ بالأسباب مع التوكل على الله.
        </p>
        <Link to="/text" className="btn btn--ghost">
          <Icon name="book" size={17} /> اقرأ نص الرقية
        </Link>
      </section>

      <p className="page__footnote">
        نسخة ٠٫١ — صُنع بإتقان لخدمة المسلمين. هذا العمل صدقة جارية.
      </p>
    </div>
  );
}
