import { Fragment, useEffect, useRef, useState } from "react";
import { Icon } from "../../../components/Icon";
import { Toast } from "../../../components/Toast";
import { toArabicDigits } from "../../../core/format";
import { readJSON, writeJSON } from "../../../core/storage";
import { getAyah, getSurahName } from "../data/quran";
import { ruqyahSections, type RuqyahSection } from "../data/sections";

const READ_KEY = "ruqyah:read-sections";

function AyahList({ refs }: { refs: string[] }) {
  let lastSurah = -1;

  return (
    <div className="ayat">
      {refs.map((ref) => {
        const [surahId, ayahNumber] = ref.split(":").map(Number);
        const newSurah = surahId !== lastSurah;
        lastSurah = surahId;
        return (
          <Fragment key={ref}>
            {newSurah ? <p className="ayat__surah">{getSurahName(surahId)}</p> : null}
            <p className="ayah">
              <span className="ayah__text">{getAyah(ref)}</span>
              <span className="ayah__num" aria-label={`الآية ${ayahNumber}`}>
                {toArabicDigits(ayahNumber)}
              </span>
            </p>
          </Fragment>
        );
      })}
    </div>
  );
}

function sectionAsText(section: RuqyahSection): string {
  const body = section.refs
    .map((ref) => {
      const [, ayah] = ref.split(":").map(Number);
      return `${getAyah(ref)} ﴿${toArabicDigits(ayah)}﴾`;
    })
    .join("\n");
  return `${section.title}\n${body}`;
}

export function TextPage() {
  const [readSections, setReadSections] = useState<string[]>(() =>
    readJSON<string[]>(READ_KEY, [])
  );
  const [openId, setOpenId] = useState<string | null>(ruqyahSections[0]?.id ?? null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    writeJSON(READ_KEY, readSections);
  }, [readSections]);

  useEffect(() => {
    return () => {
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  };

  const toggleRead = (id: string) => {
    setReadSections((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const copySection = async (section: RuqyahSection) => {
    try {
      await navigator.clipboard.writeText(sectionAsText(section));
      showToast("تم نسخ الآيات");
    } catch {
      showToast("تعذّر النسخ من المتصفح");
    }
  };

  const total = ruqyahSections.length;
  const done = readSections.filter((id) => ruqyahSections.some((s) => s.id === id)).length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="page">
      <header className="page__head">
        <p className="eyebrow">اقرأ مع الاستماع</p>
        <h1 className="page__title">نص الرقية الشرعية</h1>
        <p className="page__desc">
          آيات مرتّبة تُقرأ بتأنٍّ وخشوع، وكرّر ما ورد تكراره، ثم ادعُ الله بيقين.
        </p>
      </header>

      <section className="progresscard" aria-label="تقدّم القراءة">
        <div className="progresscard__row">
          <span>
            أتممت <strong>{toArabicDigits(done)}</strong> من {toArabicDigits(total)} قسمًا
          </span>
          <span className="progresscard__percent">{toArabicDigits(percent)}٪</span>
        </div>
        <div className="progresscard__bar">
          <span style={{ width: `${percent}%` }} />
        </div>
        {done > 0 ? (
          <button
            type="button"
            className="progresscard__reset"
            onClick={() => setReadSections([])}
          >
            إعادة تعيين التقدّم
          </button>
        ) : null}
      </section>

      <div className="sections">
        {ruqyahSections.map((section, index) => {
          const isOpen = openId === section.id;
          const isRead = readSections.includes(section.id);

          return (
            <article
              key={section.id}
              className={`section ${isOpen ? "is-open" : ""} ${isRead ? "is-read" : ""}`}
            >
              <h2 className="section__heading">
                <button
                  type="button"
                  className="section__head"
                  onClick={() => setOpenId(isOpen ? null : section.id)}
                  aria-expanded={isOpen}
                >
                  <span className="section__num">{toArabicDigits(index + 1)}</span>
                  <span className="section__meta">
                    <strong>{section.title}</strong>
                    <small>
                      {section.position}
                      {section.repeat ? ` · تُقرأ ${toArabicDigits(section.repeat)} مرات` : ""}
                    </small>
                  </span>
                  {isRead ? (
                    <span className="section__done" aria-label="تمّت القراءة">
                      <Icon name="check" size={14} />
                    </span>
                  ) : null}
                  <Icon name="chevronDown" size={18} className="section__chev" />
                </button>
              </h2>

              {isOpen ? (
                <div className="section__body">
                  {section.hint ? <p className="section__hint">{section.hint}</p> : null}
                  <AyahList refs={section.refs} />
                  <div className="section__actions">
                    <button
                      type="button"
                      className={`btn btn--ghost ${isRead ? "is-done" : ""}`}
                      onClick={() => toggleRead(section.id)}
                    >
                      <Icon name="check" size={16} />
                      {isRead ? "تمّت القراءة" : "علّم كتمّت"}
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => void copySection(section)}
                    >
                      <Icon name="copy" size={16} />
                      نسخ
                    </button>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <p className="page__footnote">
        النص مولّد من نسخة قرآنية موثّقة (نص عثماني) عبر Al Quran Cloud، ولا يُغني عن المصحف
        المطبوع عند الحاجة.
      </p>

      <Toast message={toast} />
    </div>
  );
}
