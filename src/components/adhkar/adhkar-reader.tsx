"use client";

import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/shared/container";
import { readStorage, writeStorage, STORAGE_KEYS } from "@/lib/storage";
import { getDictionary } from "@/lib/i18n";
import type { AdhkarCategory, Locale } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, RotateCcw } from "lucide-react";

export function AdhkarReader({
  category,
  locale,
}: {
  category: AdhkarCategory;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const storageKey = `${STORAGE_KEYS.adhkarProgress}:${category.id}`;
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    setCounts(readStorage<Record<string, number>>(storageKey, {}));
  }, [storageKey]);

  const totalTarget = useMemo(
    () => category.items.reduce((sum, item) => sum + item.count, 0),
    [category]
  );
  const currentTotal = useMemo(
    () =>
      category.items.reduce((sum, item) => sum + Math.min(counts[item.id] ?? 0, item.count), 0),
    [category, counts]
  );
  const progress = totalTarget > 0 ? Math.round((currentTotal / totalTarget) * 100) : 0;
  const allDone = currentTotal >= totalTarget;

  const tap = (itemId: string, count: number) => {
    setCounts((prev) => {
      const current = prev[itemId] ?? 0;
      if (current >= count) return prev;
      const next = { ...prev, [itemId]: current + 1 };
      writeStorage(storageKey, next);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(12);
      }
      return next;
    });
  };

  const resetAll = () => {
    setCounts({});
    writeStorage(storageKey, {});
  };

  return (
    <div className="pb-10">
      {/* رأس ثابت مع شريط تقدم */}
      <div className="sticky top-16 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <Container className="py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate font-display text-lg font-bold text-foreground">
                {category.title[locale]}
              </h1>
              <p className="text-xs text-muted-foreground">
                {currentTotal} / {totalTarget}
              </p>
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <RotateCcw className="size-3.5" />
              {dict.adhkar.reset}
            </button>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Container>
      </div>

      <Container className="py-6">
        <p className="mb-6 text-center text-sm text-muted-foreground">
          {dict.adhkar.tapHint}
        </p>

        {allDone && (
          <div className="mb-6 rounded-2xl border border-primary/25 bg-primary/8 p-5 text-center">
            <p className="font-display text-lg font-bold text-primary">
              {dict.adhkar.allDone}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{dict.adhkar.allDoneDesc}</p>
            <button
              type="button"
              onClick={resetAll}
              className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {dict.adhkar.startOver}
            </button>
          </div>
        )}

        <div className="space-y-4">
          {category.items.map((item, index) => {
            const done = (counts[item.id] ?? 0) >= item.count;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => tap(item.id, item.count)}
                className={cn(
                  "block w-full rounded-3xl border p-5 text-start shadow-sm transition-all",
                  done
                    ? "border-primary/25 bg-primary/5"
                    : "border-border/60 bg-card hover:border-primary/25 hover:shadow-md"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-quran text-xl leading-loose text-foreground sm:text-2xl">
                      {item.text}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                        {item.reference?.[locale] ?? ""}
                      </span>
                      {item.count > 1 && (
                        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                          {item.count}×
                        </span>
                      )}
                    </div>
                    <details className="mt-3 group/detail">
                      <summary className="cursor-pointer list-none text-xs font-semibold text-muted-foreground hover:text-foreground">
                        {dict.adhkar.translation}
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {item.translation}
                      </p>
                    </details>
                  </div>
                  <div className="flex shrink-0 flex-col items-center gap-1">
                    <span
                      className={cn(
                        "flex size-11 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                        done
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border/70 bg-card text-foreground"
                      )}
                    >
                      {done ? (
                        <Check className="size-5" />
                      ) : (
                        `${counts[item.id] ?? 0}/${item.count}`
                      )}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
