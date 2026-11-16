"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { BrandLockup } from "@/components/brand/logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { InstallButton } from "@/components/pwa/install-button";
import { getDictionary, localePath } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SiteHeader({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  const nav = useMemo(
    () => [
      { href: "/", label: dict.nav.home },
      { href: "/ruqyah", label: dict.nav.ruqyah },
      { href: "/scholars", label: dict.nav.scholars },
      { href: "/adhkar", label: dict.nav.adhkar },
      { href: "/tasbeeh", label: dict.nav.tasbeeh },
      { href: "/library", label: dict.nav.library },
    ],
    [dict]
  );

  const isActive = (href: string) => {
    const target = localePath(locale, href);
    if (href === "/") return pathname === target || pathname === `${target}/`;
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href={localePath(locale, "/")}
          className="flex items-center transition-opacity hover:opacity-90"
          aria-label={dict.brand.name}
        >
          <BrandLockup
            name={dict.brand.name}
            tagline={dict.brand.tagline}
            size={38}
          />
        </Link>

        <nav
          className="hidden items-center gap-1 rounded-full border border-border/60 bg-card/50 p-1 lg:flex"
          aria-label={dict.a11y.mainNav}
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={localePath(locale, item.href)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                isActive(item.href)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <LocaleSwitcher locale={locale} />
          <ThemeToggle locale={locale} />
          <div className="hidden sm:block">
            <InstallButton locale={locale} />
          </div>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-full border border-border/70 bg-card/60 text-foreground lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? dict.actions.close : dict.nav.home}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/98 px-4 pb-4 pt-2 shadow-lg lg:hidden">
          <nav className="grid grid-cols-2 gap-2" aria-label={dict.a11y.mainNav}>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={localePath(locale, item.href)}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors",
                  isActive(item.href)
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border/70 bg-card/60 text-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={localePath(locale, "/about")}
              onClick={() => setOpen(false)}
              className="rounded-xl border border-border/70 bg-card/60 px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
            >
              {dict.nav.about}
            </Link>
          </nav>
          <div className="mt-3">
            <InstallButton locale={locale} variant="default" className="w-full justify-center py-2.5" />
          </div>
        </div>
      )}
    </header>
  );
}
