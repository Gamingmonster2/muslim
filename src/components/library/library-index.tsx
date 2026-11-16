"use client";

import { useMemo, useState } from "react";
import { LibraryCard } from "@/components/library/library-card";
import { getDictionary } from "@/lib/i18n";
import type { LibraryItemSummary, Locale } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

type Tab = "all" | "mushaf" | "hadith";
type Sort = "downloads" | "duration" | "newest";

export function LibraryIndex({
  locale,
  items,
}: {
  locale: Locale;
  items: LibraryItemSummary[];
}) {
  const dict = getDictionary(locale);
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("downloads");

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: dict.library.tabs.all },
    { key: "mushaf", label: dict.library.tabs.mushaf },
    { key: "hadith", label: dict.library.tabs.hadith },
  ];

  const sorts: { key: Sort; label: string }[] = [
    { key: "downloads", label: dict.library.sort.downloads },
    { key: "duration", label: dict.library.sort.duration },
    { key: "newest", label: dict.library.sort.newest },
  ];

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let result = items.filter((item) => tab === "all" || item.category === tab);
    if (normalized) {
      result = result.filter((item) =>
        `${item.title.ar} ${item.title.en} ${item.creator.ar} ${item.creator.en}`
          .toLowerCase()
          .includes(normalized)
      );
    }
    if (sort === "downloads") result.sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0));
    if (sort === "duration") result.sort((a, b) => b.totalMinutes - a.totalMinutes);
    if (sort === "newest") result.sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0));
    return result;
  }, [items, tab, query, sort]);

  return (
    <div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-border/60 bg-card/60 p-1.5 sm:w-fit sm:self-center">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={cn(
                "rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors",
                tab === item.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={dict.library.searchPlaceholder}
              className="h-10 w-full rounded-full border border-border/70 bg-card ps-10 pe-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {sorts.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setSort(item.key)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  sort === item.key
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/70 bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-sm text-muted-foreground">
          {dict.library.noResults}
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <LibraryCard key={item.id} item={item} locale={locale} />
          ))}
        </div>
      )}

      <p className="mt-10 text-center text-xs leading-relaxed text-muted-foreground/80">
        {dict.library.sourceNote}
        <br />
        {dict.library.credits}
      </p>
    </div>
  );
}
