import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../../components/Icon";
import { useAudio } from "../../../core/audio/useAudio";
import { Player } from "../components/Player";
import { SheikhPicker, chooseSheikh } from "../components/SheikhPicker";
import { getSheikh, sheikhs, type Sheikh } from "../data/sheikhs";

export function HomePage() {
  const audio = useAudio();
  const [selectedId, setSelectedId] = useState<string>(
    () => audio.track?.sheikhId ?? sheikhs[0]?.id ?? "saud"
  );

  useEffect(() => {
    if (audio.track && audio.track.sheikhId !== selectedId) {
      setSelectedId(audio.track.sheikhId);
    }
    // نحدّث الاختيار فقط عند تبديل المقطع
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio.track?.id]);

  const selectedSheikh: Sheikh = getSheikh(selectedId) ?? sheikhs[0]!;
  const fallbackTrack = selectedSheikh.tracks[0] ?? null;
  const playingSheikhId = audio.playing && audio.track ? audio.track.sheikhId : null;

  const handleSelect = (sheikh: Sheikh) => {
    setSelectedId(sheikh.id);
    chooseSheikh(sheikh, audio.playing);
  };

  return (
    <div className="page page--home">
      <section className="hero">
        <div className="hero__arch">
          <span className="hero__ornament" aria-hidden="true">
            <svg viewBox="0 0 120 16" width="120" height="16">
              <path d="M2 8h40M78 8h40" stroke="currentColor" strokeWidth="1" opacity=".55" />
              <path d="M60 2l5.5 6L60 14l-5.5-6Z" fill="none" stroke="currentColor" strokeWidth="1.1" />
            </svg>
          </span>
          <p className="hero__bism">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
          <h1 className="hero__title">الرقية الشرعية</h1>
          <p className="hero__verse">
            ﴿ وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ ﴾
          </p>
          <p className="hero__note">
            {audio.track
              ? `آخر استماع: ${audio.track.sheikhName}`
              : "استمع بخشوع، وردّد الآيات والأدعية بيقين"}
          </p>
        </div>
      </section>

      <SheikhPicker
        selectedId={selectedId}
        playingSheikhId={playingSheikhId}
        onSelect={handleSelect}
      />

      <Player fallbackTrack={fallbackTrack} />

      <nav className="quicklinks" aria-label="روابط سريعة">
        <Link to="/text" className="quicklink">
          <span className="quicklink__icon">
            <Icon name="book" size={21} />
          </span>
          <span className="quicklink__text">
            <strong>نص الرقية الشرعية</strong>
            <small>الآيات كاملة مرتّبة للقراءة</small>
          </span>
          <Icon name="arrowLeft" size={18} className="quicklink__arrow" />
        </Link>

        <Link to="/duas" className="quicklink">
          <span className="quicklink__icon">
            <Icon name="sparkles" size={21} />
          </span>
          <span className="quicklink__text">
            <strong>أدعية الشفاء</strong>
            <small>أدعية ثابتة عن النبي ﷺ</small>
          </span>
          <Icon name="arrowLeft" size={18} className="quicklink__arrow" />
        </Link>
      </nav>

      <figure className="quote">
        <blockquote>«مَا أَنْزَلَ اللَّهُ دَاءً إِلَّا أَنْزَلَ لَهُ شِفَاءً»</blockquote>
        <figcaption>رواه البخاري</figcaption>
      </figure>

      <p className="page__footnote">
        هذا التطبيق صدقة جارية — لا تنسَ الدعاء لمن ساهم فيه.
      </p>
    </div>
  );
}
