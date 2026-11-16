import { useEffect, useRef, useState } from "react";
import { Icon } from "../../../components/Icon";
import { Toast } from "../../../components/Toast";
import { duas } from "../data/duas";

export function DuasPage() {
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast("تم نسخ الدعاء");
    } catch {
      setToast("تعذّر النسخ من المتصفح");
    }
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="page">
      <header className="page__head">
        <p className="eyebrow">بعد الرقية</p>
        <h1 className="page__title">أدعية الشفاء</h1>
        <p className="page__desc">
          أدعية ثابتة عن النبي ﷺ تُقال مع الرقية أو بعدها، ومعها اليقين بأن الشفاء بيد الله وحده.
        </p>
      </header>

      <div className="duas">
        {duas.map((dua) => (
          <article key={dua.id} className="dua">
            <div className="dua__head">
              <h2 className="dua__title">{dua.title}</h2>
              {dua.repeat ? <span className="badge">{dua.repeat}</span> : null}
            </div>
            <p className="dua__text">{dua.text}</p>
            <div className="dua__foot">
              <span className="dua__source">{dua.source}</span>
              <button
                type="button"
                className="chip chip--small"
                onClick={() => void copy(dua.text)}
                aria-label={`نسخ ${dua.title}`}
              >
                <Icon name="copy" size={16} />
                نسخ
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="note">
        <h2 className="note__title">تنبيه مهم</h2>
        <p>
          الرقية الشرعية سببٌ من أسباب الشفاء، ولا تُغني عن مراجعة الطبيب عند الحاجة. احرص على
          الأخذ بالأسباب مع التوكل على الله.
        </p>
      </div>

      <Toast message={toast} />
    </div>
  );
}
