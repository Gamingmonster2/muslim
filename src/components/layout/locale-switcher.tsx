"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { getDictionary, otherLocale, switchLocalePath } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() || "/";
  const dict = getDictionary(locale);
  const target = otherLocale(locale);
  const href = switchLocalePath(pathname, target);

  return (
    <Link
      href={href}
      hrefLang={target}
      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border/70 bg-card/60 px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
      aria-label={dict.locale.switch}
      title={target === "en" ? dict.locale.english : dict.locale.arabic}
    >
      <Languages className="size-3.5 text-muted-foreground" />
      <span>{target === "en" ? "EN" : "ع"}</span>
    </Link>
  );
}
