"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function ThemeToggle({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="rounded-full text-muted-foreground hover:text-foreground"
      aria-label={dict.theme.toggle}
      title={isDark ? dict.theme.light : dict.theme.dark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span className="relative flex size-4 items-center justify-center">
        <Sun
          className={
            "absolute size-4 transition-all duration-300 " +
            (isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100")
          }
        />
        <Moon
          className={
            "absolute size-4 transition-all duration-300 " +
            (isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0")
          }
        />
      </span>
    </Button>
  );
}
