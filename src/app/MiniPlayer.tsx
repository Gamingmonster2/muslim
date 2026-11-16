import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { audioEngine } from "../core/audio/engine";
import { useAudio } from "../core/audio/useAudio";

/** شريط تشغيل مصغّر يظهر في بقية الصفحات حتى يبقى التحكّم متاحًا. */
export function MiniPlayer() {
  const audio = useAudio();
  const location = useLocation();
  const navigate = useNavigate();

  if (!audio.track || location.pathname === "/") return null;

  const progress =
    audio.duration > 0 ? Math.min(100, (audio.currentTime / audio.duration) * 100) : 0;

  return (
    <div className="mini">
      <span className="mini__progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </span>

      <button
        type="button"
        className="mini__info"
        onClick={() => navigate("/")}
        aria-label="فتح المشغّل الكامل"
      >
        {audio.track.image ? (
          <img className="mini__art" src={audio.track.image} alt="" width={40} height={40} />
        ) : null}
        <span className="mini__text">
          <strong>{audio.track.title}</strong>
          <small>{audio.track.sheikhName}</small>
        </span>
      </button>

      <button
        type="button"
        className="mini__toggle"
        onClick={() => void audioEngine.toggle()}
        aria-label={audio.playing ? "إيقاف مؤقت" : "تشغيل"}
      >
        <Icon name={audio.playing ? "pause" : "play"} size={20} />
      </button>
    </div>
  );
}
