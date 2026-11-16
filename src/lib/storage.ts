/**
 * أدوات تخزين محلية آمنة (تعمل فقط في المتصفح).
 * جميع مفاتيح المنصة تبدأ بـ lyd:
 */
const PREFIX = "lyd:";

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* التخزين ممتلئ أو محظور — تجاهل بهدوء */
  }
}

export function removeStorage(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* تجاهل */
  }
}

export const STORAGE_KEYS = {
  playerSettings: "player:settings",
  lastPlayed: "player:last",
  favorites: "player:favorites",
  adhkarProgress: "adhkar:progress",
  tasbeeh: "tasbeeh:state",
  installDismissed: "pwa:install-dismissed",
} as const;
