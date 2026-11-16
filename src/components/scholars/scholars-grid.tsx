"use client";

import { useState } from "react";
import { ScholarCard } from "@/components/scholars/scholar-card";
import { getDictionary } from "@/lib/i18n";
import type { Locale, Scholar } from "@/lib/types";
import { Search } from "lucide-react";

export function ScholarsGrid({
  locale,
  scholars,
}: {
  locale: Locale;
  scholars: Scholar[];
}) {
  const dict = getDictionary(locale);
  const [query, setQuery] = useState("");

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? scholars.filter((scholar) =>
        `${scholar.name.ar} ${scholar.name.en}`.toLowerCase().includes(normalized)
      )
    : scholars;

  return (
    <div>
      <div className="relative mx-auto mb-8 max-w-md">
        <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={dict.scholars.searchPlaceholder}
          className="h-11 w-full rounded-full border border-border/70 bg-card ps-10 pe-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          {dict.scholars.noResults}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((scholar) => (
            <ScholarCard key={scholar.id} scholar={scholar} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
