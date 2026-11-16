export interface Track {
  /** معرّف فريد للمقطع */
  id: string;
  /** عنوان المقطع */
  title: string;
  /** معرّف الشيخ */
  sheikhId: string;
  /** اسم الشيخ كما يظهر في المشغّل */
  sheikhName: string;
  /** رابط الصوت المباشر */
  src: string;
  /** صورة اختيارية */
  image?: string;
}

export type RepeatMode = "off" | "one" | "all";

export interface AudioSnapshot {
  track: Track | null;
  playing: boolean;
  waiting: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  muted: boolean;
  rate: number;
  repeat: RepeatMode;
  /** الطابع الزمني لنهاية مؤقت النوم (ms) أو null */
  sleepEndsAt: number | null;
  error: string | null;
}
