import type { Track } from "../../../core/audio/types";

export interface Sheikh {
  id: string;
  name: string;
  role: string;
  image: string;
  tracks: Track[];
}

const SAUD_IMAGE = "/images/sheikhs/saud.jpg";
const ESSAM_IMAGE = "/images/sheikhs/essam.jpg";

/**
 * المصادر: مشغّل tvQuran — روابط صوتية مباشرة (تم التحقّق من عملها).
 * وضع المشغّل الواحد يضمن عدم تشغيل صوتين في وقت واحد.
 */
export const sheikhs: Sheikh[] = [
  {
    id: "saud",
    name: "سعود الفايز",
    role: "قارئ القرآن الكريم",
    image: SAUD_IMAGE,
    tracks: [
      {
        id: "saud-ruqyah",
        title: "الرقية الشرعية الكاملة",
        sheikhId: "saud",
        sheikhName: "سعود الفايز",
        src: "https://download.tvquran.com/download/selections/121/590dc67a93663.mp3",
        image: SAUD_IMAGE,
      },
    ],
  },
  {
    id: "essam",
    name: "عصام العويد",
    role: "داعية — وزارة الشؤون الإسلامية",
    image: ESSAM_IMAGE,
    tracks: [
      {
        id: "essam-ruqyah",
        title: "الرقية الشرعية الكاملة",
        sheikhId: "essam",
        sheikhName: "عصام العويد",
        src: "https://download.tvquran.com/download/selections/212/590e6f2fb3102.mp3",
        image: ESSAM_IMAGE,
      },
    ],
  },
];

export const allTracks: Track[] = sheikhs.flatMap((sheikh) => sheikh.tracks);

export function getSheikh(id: string | undefined): Sheikh | undefined {
  return sheikhs.find((sheikh) => sheikh.id === id);
}

export function getTrackBySheikhId(sheikhId: string): Track | undefined {
  return getSheikh(sheikhId)?.tracks[0];
}
