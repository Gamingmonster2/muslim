export type Locale = "ar" | "en";

export interface Localized {
  ar: string;
  en: string;
}

export interface Track {
  id: string;
  title: Localized;
  url: string;
  duration?: number | null;
  sizeBytes?: number | null;
  surahIndex?: number | null;
  source?: "tvquran" | "archive";
  sourceUrl?: string | null;
}

export interface PlayerContext {
  title: Localized;
  subtitle?: Localized | null;
  cover?: string | null;
  href?: string | null;
  kind?: "ruqyah" | "mushaf" | "hadith" | "recitation";
}

export interface ScholarStats {
  recordings: number;
  listens: number;
  likes: number;
}

export interface Scholar {
  id: string;
  slug: string;
  name: Localized;
  bio: { ar: string | null; en: string | null };
  image: string | null;
  stats: ScholarStats;
  featured: boolean;
  tracks: Track[];
}

export type LibraryCategory = "mushaf" | "hadith";

export interface LibraryItemSummary {
  id: string;
  category: LibraryCategory;
  kind: string;
  title: Localized;
  creator: Localized;
  description: { ar: string | null; en: string | null };
  cover: string | null;
  trackCount: number;
  totalMinutes: number;
  year: string | null;
  downloads: number | null;
  sourceUrl: string;
  firstTrack: Track | null;
}

export interface LibraryItemFile {
  id: string;
  title: Localized;
  creator: Localized;
  cover: string | null;
  sourceUrl: string;
  tracks: Track[];
}

export interface AdhkarItem {
  id: string;
  text: string;
  translation: string;
  count: number;
  reference?: Localized;
}

export interface AdhkarCategory {
  id: string;
  title: Localized;
  description: Localized;
  icon: "sun" | "moon" | "bed" | "sunrise" | "heart" | "heart-pulse";
  accent: "amber" | "indigo" | "violet" | "rose" | "emerald" | "sky";
  items: AdhkarItem[];
}
