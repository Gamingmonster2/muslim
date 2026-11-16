"use client";

import { usePathname } from "next/navigation";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { PlayerBar } from "@/components/player/player-bar";
import { getDictionary, localeFromPathname } from "@/lib/i18n";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const locale = localeFromPathname(pathname);
  const dict = getDictionary(locale);

  return (
    <Providers locale={locale}>
      <a href="#main" className="skip-link">
        {dict.a11y.skipToContent}
      </a>
      <SiteHeader locale={locale} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter locale={locale} />
      <MobileNav locale={locale} />
      <PlayerBar locale={locale} />
    </Providers>
  );
}
