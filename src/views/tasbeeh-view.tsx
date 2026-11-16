"use client";

import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/shared/container";
import { RippleButton } from "@/components/ui/ripple-button";
import { readStorage, writeStorage, STORAGE_KEYS } from "@/lib/storage";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, RotateCcw, Save } from "lucide-react";

const PHRASE_KEYS = [
  "subhan",
  "hamd",
  "takbir",
  "tahlil",
  "subhanWaBihamdih",
] as const;

const TARGETS = [33, 99, 100] as const;

export function TasbeehView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState<number | null>(33);
  const [phrase, setPhrase] = useState<(typeof PHRASE_KEYS)[number]>("subhan");
  const [dailyTotal, setDailyTotal] = useState(0);
  const [justDone, setJustDone] = useState(false);

  useEffect(() => {
    const state = readStorage<{ dailyTotal?: number }>(STORAGE_KEYS.tasbeeh, {});
    setDailyTotal(state.dailyTotal ?? 0);
  }, []);

  const phrases = dict.tasbeeh.phrases;

  const tap = () => {
    setCount((value) => {
      const next = value + 1;
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(15);
      }
      if (target && next >= target) {
        setJustDone(true);
        setTimeout(() => setJustDone(false), 2600);
      }
      return next;
    });
  };

  const reset = () => setCount(0);

  const save = () => {
    const next = dailyTotal + count;
    setDailyTotal(next);
    writeStorage(STORAGE_KEYS.tasbeeh, { dailyTotal: next });
    setCount(0);
  };

  const progress = useMemo(() => {
    if (!target) return 0;
    return Math.min(100, (count / target) * 100);
  }, [count, target]);

  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="py-10">
      <Container className="max-w-xl">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">
            {dict.tasbeeh.title}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {dict.tasbeeh.description}
          </p>
        </div>

        {/* اختيار الذكر */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {PHRASE_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setPhrase(key);
                setCount(0);
              }}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                phrase === key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/70 bg-card text-foreground hover:bg-muted"
              )}
            >
              {phrases[key]}
            </button>
          ))}
        </div>

        {/* الحلقة والعداد */}
        <div className="relative mx-auto mt-10 flex size-64 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="var(--muted)"
              strokeWidth="10"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-200"
            />
          </svg>
          <div className="relative flex flex-col items-center">
            <span className="font-quran text-2xl font-bold text-muted-foreground">
              {phrases[phrase]}
            </span>
            <span className="mt-1 text-6xl font-bold tabular-nums text-foreground">
              {count}
            </span>
            <span className="mt-1 text-sm font-medium text-muted-foreground">
              {target ? `${dict.tasbeeh.target}: ${target}` : dict.tasbeeh.presets.free}
            </span>
          </div>
        </div>

        {justDone && (
          <p className="mt-4 text-center text-sm font-bold text-primary">
            {dict.tasbeeh.complete}
          </p>
        )}

        {/* زر التسبيح */}
        <div className="mt-8 flex justify-center">
          <RippleButton
            onClick={tap}
            rippleColor="color-mix(in oklch, var(--primary) 40%, transparent)"
            className="flex size-32 select-none items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-deep text-primary-foreground shadow-2xl shadow-primary/30 transition-transform active:scale-95"
            aria-label={dict.tasbeeh.tapHint}
          >
            <span className="font-quran text-lg font-bold leading-tight text-center">
              {phrases[phrase]}
            </span>
          </RippleButton>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">{dict.tasbeeh.tapHint}</p>

        {/* الأهداف والأزرار */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">{dict.tasbeeh.aim}:</span>
          <button
            type="button"
            onClick={() => setTarget(null)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-bold transition-colors",
              target === null ? "border-primary bg-primary text-primary-foreground" : "border-border/70 bg-card text-foreground hover:bg-muted"
            )}
          >
            {dict.tasbeeh.presets.free}
          </button>
          {TARGETS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setTarget(value);
                setCount(0);
              }}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-bold transition-colors",
                target === value ? "border-primary bg-primary text-primary-foreground" : "border-border/70 bg-card text-foreground hover:bg-muted"
              )}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border/70 bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <RotateCcw className="size-4" />
            {dict.tasbeeh.reset}
          </button>
          <button
            type="button"
            onClick={save}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Save className="size-4" />
            {dict.tasbeeh.save}
          </button>
        </div>

        <p className="mt-6 text-center text-sm font-semibold text-muted-foreground">
          {dict.tasbeeh.dailyTotal}: <span className="tabular-nums text-foreground">{dailyTotal}</span>
        </p>

        <div className="mt-8 rounded-2xl border border-border/60 bg-muted/30 p-5">
          <p className="text-sm leading-loose text-muted-foreground">{dict.tasbeeh.hadith}</p>
        </div>

        <div className="mt-4 rounded-2xl border border-border/60 bg-card p-5">
          <p className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            {dict.tasbeeh.info}
          </p>
        </div>
      </Container>
    </div>
  );
}
