import { Icon } from "../../../components/Icon";
import { audioEngine } from "../../../core/audio/engine";
import type { Sheikh } from "../data/sheikhs";
import { sheikhs } from "../data/sheikhs";

interface SheikhPickerProps {
  selectedId: string;
  playingSheikhId: string | null;
  onSelect: (sheikh: Sheikh) => void;
}

export function SheikhPicker({ selectedId, playingSheikhId, onSelect }: SheikhPickerProps) {
  return (
    <section className="sheikhs" aria-labelledby="sheikhs-title">
      <div className="section-head">
        <h2 id="sheikhs-title" className="section-title">
          اختر القارئ
        </h2>
        <span className="section-note">صوتان موثوقان</span>
      </div>

      <div className="sheikhs__grid">
        {sheikhs.map((sheikh) => {
          const isActive = sheikh.id === selectedId;
          const isPlaying = sheikh.id === playingSheikhId;
          return (
            <button
              key={sheikh.id}
              type="button"
              className={`sheikh ${isActive ? "is-active" : ""}`}
              onClick={() => onSelect(sheikh)}
              aria-pressed={isActive}
            >
              <span className="sheikh__avatar">
                <img src={sheikh.image} alt="" width={76} height={76} loading="lazy" decoding="async" />
                {isActive ? (
                  <span className="sheikh__badge" aria-hidden="true">
                    <Icon name="check" size={13} />
                  </span>
                ) : null}
              </span>
              <span className="sheikh__name">{sheikh.name}</span>
              <span className="sheikh__role">{sheikh.role}</span>
              {isPlaying ? (
                <span className="sheikh__playing" aria-label="قيد التشغيل">
                  <span className="equalizer is-on" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/** يعيد تشغيل الشيخ المطلوب: يستمر التشغيل إن كان جاريًا، وإلا يُحمَّل فقط. */
export function chooseSheikh(sheikh: Sheikh, isPlaying: boolean): void {
  const track = sheikh.tracks[0];
  if (!track) return;
  if (isPlaying) {
    void audioEngine.play(track);
  } else {
    audioEngine.select(track);
  }
}
