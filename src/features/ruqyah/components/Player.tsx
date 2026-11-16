import { useEffect, useRef, useState } from "react";
import { Icon } from "../../../components/Icon";
import { audioEngine } from "../../../core/audio/engine";
import type { Track } from "../../../core/audio/types";
import { useAudio } from "../../../core/audio/useAudio";
import { formatTime, toArabicDigits } from "../../../core/format";

const RING_RADIUS = 62;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const SLEEP_OPTIONS = [5, 10, 15, 30, 45, 60] as const;

interface PlayerProps {
  /** يُعرض عندما لا يوجد مقطع محمّل بعد */
  fallbackTrack: Track | null;
}

export function Player({ fallbackTrack }: PlayerProps) {
  const audio = useAudio();
  const [dragValue, setDragValue] = useState<number | null>(null);
  const [sleepOpen, setSleepOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const sleepRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (audio.sleepEndsAt === null) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [audio.sleepEndsAt]);

  useEffect(() => {
    if (!sleepOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (sleepRef.current && !sleepRef.current.contains(event.target as Node)) {
        setSleepOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [sleepOpen]);

  const displayTrack = audio.track ?? fallbackTrack;
  if (!displayTrack) return null;

  const isCurrent = audio.track?.id === displayTrack.id;
  const isPlaying = isCurrent && audio.playing;
  const isLoading = isCurrent && audio.waiting;
  const duration = isCurrent ? audio.duration : 0;
  const position = dragValue ?? (isCurrent ? audio.currentTime : 0);
  const progress = duration > 0 ? Math.min(1, position / duration) : 0;
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);
  const sleepRemaining =
    audio.sleepEndsAt !== null ? Math.max(0, Math.ceil((audio.sleepEndsAt - now) / 60_000)) : null;

  const repeatLabel =
    audio.repeat === "one"
      ? "التكرار: نفس المقطع"
      : audio.repeat === "all"
        ? "التكرار: كل المقاطع"
        : "التكرار: متوقف";

  const handleMain = () => {
    if (!isCurrent) {
      void audioEngine.play(displayTrack);
      return;
    }
    void audioEngine.toggle();
  };

  return (
    <section className="player card" aria-label="مشغّل الرقية">
      <div className="player__head">
        <div className="player__meta">
          <p className="eyebrow">{isCurrent ? "جارٍ الاستماع إلى" : "جاهز للتشغيل"}</p>
          <h2 className="player__title">{displayTrack.title}</h2>
          <p className="player__sheikh">{displayTrack.sheikhName}</p>
        </div>
        <div className={`equalizer ${isPlaying ? "is-on" : ""}`} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>

      <div className="player__stage">
        <button
          type="button"
          className="round-btn"
          onClick={() => audioEngine.skip(-10)}
          aria-label="رجوع عشر ثوانٍ"
          title="رجوع ١٠ ثوانٍ"
        >
          <Icon name="back10" size={26} />
        </button>

        <div className="ring">
          <svg viewBox="0 0 140 140" className="ring__svg" aria-hidden="true">
            <circle className="ring__track" cx="70" cy="70" r={RING_RADIUS} />
            <circle
              className="ring__bar"
              cx="70"
              cy="70"
              r={RING_RADIUS}
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 70 70)"
            />
          </svg>
          <button
            type="button"
            className="ring__play"
            onClick={handleMain}
            aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل الرقية"}
          >
            {isLoading ? (
              <span className="spinner" aria-hidden="true" />
            ) : (
              <Icon name={isPlaying ? "pause" : "play"} size={34} />
            )}
          </button>
        </div>

        <button
          type="button"
          className="round-btn"
          onClick={() => audioEngine.skip(10)}
          aria-label="تقدّم عشر ثوانٍ"
          title="تقدّم ١٠ ثوانٍ"
        >
          <Icon name="forward10" size={26} />
        </button>
      </div>

      <div className="player__timeline">
        <div className="player__times">
          <span dir="ltr">{formatTime(position)}</span>
          <span dir="ltr">{formatTime(duration)}</span>
        </div>
        <input
          className="slider"
          type="range"
          min={0}
          max={duration > 0 ? duration : 1}
          step={1}
          value={position}
          style={{
            background: `linear-gradient(to right, var(--gold) ${Math.round(progress * 100)}%, var(--line-strong) ${Math.round(
              progress * 100
            )}%)`,
          }}
          onChange={(event) => {
            const value = Number(event.target.value);
            setDragValue(value);
            if (isCurrent) audioEngine.seek(value);
          }}
          onPointerUp={() => setDragValue(null)}
          onTouchEnd={() => setDragValue(null)}
          onKeyUp={() => setDragValue(null)}
          onBlur={() => setDragValue(null)}
          aria-label="موضع التشغيل"
          disabled={!isCurrent || duration === 0}
        />
      </div>

      <div className="player__extras">
        <button
          type="button"
          className={`chip ${audio.repeat !== "off" ? "is-on" : ""}`}
          onClick={() => audioEngine.cycleRepeat()}
          aria-label={repeatLabel}
          title={repeatLabel}
        >
          <Icon name={audio.repeat === "one" ? "repeatOne" : "repeat"} size={19} />
          <span>تكرار</span>
        </button>

        <button
          type="button"
          className="chip"
          onClick={() => audioEngine.cycleRate()}
          aria-label="سرعة القراءة"
          title="سرعة القراءة"
        >
          <Icon name="speed" size={19} />
          <span>{toArabicDigits(audio.rate)}×</span>
        </button>

        <div className="extras__sleep" ref={sleepRef}>
          <button
            type="button"
            className={`chip ${sleepRemaining !== null ? "is-on" : ""}`}
            onClick={() => setSleepOpen((value) => !value)}
            aria-label="مؤقت النوم"
            aria-expanded={sleepOpen}
            title="مؤقت النوم"
          >
            <Icon name="timer" size={19} />
            <span>{sleepRemaining !== null ? `${toArabicDigits(sleepRemaining)} د` : "مؤقت"}</span>
          </button>

          {sleepOpen ? (
            <div className="sleepmenu" role="dialog" aria-label="مؤقت النوم">
              <p className="sleepmenu__title">يتوقّف الصوت بعد</p>
              <div className="sleepmenu__grid">
                {SLEEP_OPTIONS.map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    onClick={() => {
                      audioEngine.setSleepTimer(minutes);
                      setSleepOpen(false);
                    }}
                  >
                    {toArabicDigits(minutes)} د
                  </button>
                ))}
              </div>
              {audio.sleepEndsAt !== null ? (
                <button
                  type="button"
                  className="sleepmenu__off"
                  onClick={() => {
                    audioEngine.setSleepTimer(null);
                    setSleepOpen(false);
                  }}
                >
                  إلغاء المؤقت
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="chip"
          onClick={() => audioEngine.toggleMute()}
          aria-label={audio.muted ? "إلغاء كتم الصوت" : "كتم الصوت"}
          title={audio.muted ? "إلغاء كتم الصوت" : "كتم الصوت"}
        >
          <Icon name={audio.muted ? "volumeMute" : "volume"} size={19} />
          <span>الصوت</span>
        </button>
      </div>

      {sleepRemaining !== null && isPlaying ? (
        <p className="player__hint">سيتوقّف الصوت تلقائيًا بعد {toArabicDigits(sleepRemaining)} دقيقة</p>
      ) : null}

      {isCurrent && audio.error ? (
        <p className="player__error" role="alert">
          {audio.error}
        </p>
      ) : null}
    </section>
  );
}
