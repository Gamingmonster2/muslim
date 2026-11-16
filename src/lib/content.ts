import scholarsRaw from "@/content/generated/scholars.json";
import libraryRaw from "@/content/generated/library.json";
import { adhkarCategories } from "@/content/adhkar";
import type {
  AdhkarCategory,
  LibraryCategory,
  LibraryItemSummary,
  Scholar,
  Track,
} from "./types";

interface RawTrack {
  id: string;
  selectionId?: string;
  titleAr?: string;
  titleEn?: string;
  title?: { ar: string; en: string };
  url: string;
  duration: number | null;
  sizeBytes?: number | null;
  valid?: boolean;
  listens?: number;
  likes?: number;
  sourceUrl?: string | null;
  surahIndex?: number | null;
}

interface RawScholar {
  id: string;
  slug: string;
  name: { ar: string; en: string };
  bio: { ar: string | null; en: string | null };
  image: string | null;
  stats: { recordings: number; listens: number; likes: number };
  featured: boolean;
  tracks: RawTrack[];
}

interface RawLibraryItem {
  id: string;
  category: LibraryCategory;
  kind: string;
  title: { ar: string; en: string };
  creator: { ar: string; en: string };
  description: { ar: string | null; en: string | null };
  cover: string | null;
  trackCount: number;
  totalMinutes: number;
  year: string | null;
  downloads: number | null;
  sourceUrl: string;
  firstTrack: RawTrack | null;
  tracks: RawTrack[];
}

const rawScholars = (scholarsRaw as unknown as { scholars: RawScholar[] }).scholars;
const rawLibrary = (libraryRaw as unknown as { items: RawLibraryItem[] }).items;

function normalizeTrack(track: RawTrack): Track {
  return {
    id: track.id,
    title: track.title ?? { ar: track.titleAr ?? "", en: track.titleEn ?? "" },
    url: track.url,
    duration: track.duration ?? null,
    sizeBytes: track.sizeBytes ?? null,
    surahIndex: track.surahIndex ?? null,
    source: "archive",
    sourceUrl: track.sourceUrl ?? null,
  };
}

export const scholars: Scholar[] = rawScholars
  .map((scholar) => ({
    id: scholar.id,
    slug: scholar.slug,
    name: scholar.name,
    bio: scholar.bio,
    image: scholar.image,
    stats: scholar.stats,
    featured: scholar.featured,
    tracks: scholar.tracks
      .filter((track) => track.valid !== false)
      .map((track) => ({
        ...normalizeTrack(track),
        source: "tvquran" as const,
      })),
  }))
  .filter((scholar) => scholar.tracks.length > 0);

scholars.sort((a, b) => {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  return b.stats.listens - a.stats.listens;
});

export function getScholars(): Scholar[] {
  return scholars;
}

export function getFeaturedScholar(): Scholar {
  return scholars.find((scholar) => scholar.featured) ?? scholars[0];
}

export function getScholar(idOrSlug: string): Scholar | undefined {
  return scholars.find(
    (scholar) => scholar.id === idOrSlug || scholar.slug === idOrSlug
  );
}

export function getFeaturedTracks(): Track[] {
  return getFeaturedScholar().tracks;
}

export function getRuqyahTracks(limit?: number): Track[] {
  const tracks: Track[] = [];
  for (const scholar of scholars) {
    for (const track of scholar.tracks) {
      tracks.push(track);
      if (limit && tracks.length >= limit) return tracks;
    }
  }
  return tracks;
}

export function getRelatedScholars(currentId: string, limit = 4): Scholar[] {
  const others = scholars.filter((scholar) => scholar.id !== currentId);
  const withBio = others.filter((scholar) => Boolean(scholar.bio.ar));
  return [...withBio, ...others]
    .filter((scholar, index, arr) => arr.findIndex((s) => s.id === scholar.id) === index)
    .slice(0, limit);
}

export const libraryItems: LibraryItemSummary[] = rawLibrary.map((item) => ({
  id: item.id,
  category: item.category,
  kind: item.kind,
  title: item.title,
  creator: item.creator,
  description: item.description,
  cover: item.cover,
  trackCount: item.trackCount,
  totalMinutes: item.totalMinutes,
  year: item.year,
  downloads: item.downloads,
  sourceUrl: item.sourceUrl,
  firstTrack: item.firstTrack ? normalizeTrack(item.firstTrack) : null,
}));

export function getLibraryItems(category?: LibraryCategory): LibraryItemSummary[] {
  return category
    ? libraryItems.filter((item) => item.category === category)
    : libraryItems;
}

export function getLibraryItem(id: string): LibraryItemSummary | undefined {
  return libraryItems.find((item) => item.id === id);
}

export function getLibraryTracksPath(id: string): string {
  return `/data/library/${id}.json`;
}

export function getAdhkarCategories(): AdhkarCategory[] {
  return adhkarCategories;
}

export function getAdhkarCategory(id: string): AdhkarCategory | undefined {
  return adhkarCategories.find((category) => category.id === id);
}

export function getAdhkarTotalItems(): number {
  return adhkarCategories.reduce((sum, category) => sum + category.items.length, 0);
}

export function getSiteStats() {
  const ruqyahTracks = scholars.reduce((sum, scholar) => sum + scholar.tracks.length, 0);
  const mushafs = libraryItems.filter((item) => item.category === "mushaf");
  const hadith = libraryItems.filter((item) => item.category === "hadith");
  const tracks = libraryItems.reduce((sum, item) => sum + item.trackCount, 0);
  const listeningHours = libraryItems.reduce((sum, item) => sum + item.totalMinutes, 0) / 60;
  return {
    scholars: scholars.length,
    ruqyahTracks,
    mushafs: mushafs.length,
    hadith: hadith.length,
    libraryItems: libraryItems.length,
    tracks: tracks + ruqyahTracks,
    listeningHours: Math.round(listeningHours),
  };
}

export const playerSlugToTrack = new Map<string, Track>();
for (const scholar of scholars) {
  for (const track of scholar.tracks) playerSlugToTrack.set(track.id, track);
}
