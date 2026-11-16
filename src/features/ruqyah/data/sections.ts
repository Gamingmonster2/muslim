export interface RuqyahSection {
  id: string;
  title: string;
  /** الموضع كما يُعرض (مثال: البقرة ٢٥٥) */
  position: string;
  /** مراجع الآيات "سورة:آية" */
  refs: string[];
  /** عدد مرات التكرار إن ورد */
  repeat?: number;
  hint?: string;
}

const range = (surah: number, from: number, to: number): string[] =>
  Array.from({ length: to - from + 1 }, (_, index) => `${surah}:${from + index}`);

export const ruqyahSections: RuqyahSection[] = [
  {
    id: "fatiha",
    title: "سورة الفاتحة",
    position: "الفاتحة ١ – ٧",
    refs: range(1, 1, 7),
    hint: "أمّ الكتاب والشفاء",
  },
  {
    id: "baqarah-open",
    title: "افتتاح سورة البقرة",
    position: "البقرة ١ – ٥",
    refs: range(2, 1, 5),
  },
  {
    id: "kursi",
    title: "آية الكرسي",
    position: "البقرة ٢٥٥",
    refs: ["2:255"],
    hint: "أعظم آية في القرآن",
  },
  {
    id: "sihr",
    title: "آية السحر",
    position: "البقرة ١٠٢",
    refs: ["2:102"],
  },
  {
    id: "tawhid",
    title: "آيات التوحيد",
    position: "البقرة ١٦٣ – ١٦٤",
    refs: ["2:163", "2:164"],
  },
  {
    id: "baqarah-end",
    title: "خواتيم سورة البقرة",
    position: "البقرة ٢٨٥ – ٢٨٦",
    refs: ["2:285", "2:286"],
  },
  {
    id: "imran",
    title: "شهادة الله وملائكته",
    position: "آل عمران ١٨ – ١٩",
    refs: ["3:18", "3:19"],
  },
  {
    id: "araf",
    title: "دعاء أهل الأعراف",
    position: "الأعراف ٥٤ – ٥٦",
    refs: ["7:54", "7:55", "7:56"],
  },
  {
    id: "yunus",
    title: "إبطال السحر",
    position: "يونس ٨١ – ٨٢",
    refs: ["10:81", "10:82"],
  },
  {
    id: "isra",
    title: "القرآن شفاء ورحمة",
    position: "الإسراء ٨٢",
    refs: ["17:82"],
  },
  {
    id: "taha",
    title: "إبطال سحر التخييل",
    position: "طه ٦٩",
    refs: ["20:69"],
  },
  {
    id: "muminun",
    title: "آيات الخلق والبعث",
    position: "المؤمنون ١١٥ – ١١٨",
    refs: ["23:115", "23:116", "23:117", "23:118"],
  },
  {
    id: "saffat",
    title: "آيات إهلاك الشياطين",
    position: "الصافات ١ – ١٠",
    refs: range(37, 1, 10),
  },
  {
    id: "ahqaf",
    title: "استماع الجنّ للقرآن",
    position: "الأحقاف ٢٩ – ٣٢",
    refs: ["46:29", "46:30", "46:31", "46:32"],
  },
  {
    id: "rahman",
    title: "آية السلامة من الجن",
    position: "الرحمن ٣٣ – ٣٦",
    refs: ["55:33", "55:34", "55:35", "55:36"],
  },
  {
    id: "hashr",
    title: "أسماء الله الحسنى",
    position: "الحشر ٢١ – ٢٤",
    refs: ["59:21", "59:22", "59:23", "59:24"],
  },
  {
    id: "qalam",
    title: "آية الحفظ من العين",
    position: "القلم ٥١ – ٥٢",
    refs: ["68:51", "68:52"],
  },
  {
    id: "jinn",
    title: "سورة الجن",
    position: "الجن ١ – ٩",
    refs: range(72, 1, 9),
  },
  {
    id: "muawwidhat",
    title: "المعوذتان والإخلاص",
    position: "الإخلاص والفلق والناس",
    refs: [...range(112, 1, 4), ...range(113, 1, 5), ...range(114, 1, 6)],
    repeat: 3,
    hint: "تُقرأ ثلاث مرات",
  },
];

export function getSectionIndex(id: string): number {
  return ruqyahSections.findIndex((section) => section.id === id);
}
