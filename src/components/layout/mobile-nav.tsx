"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Headphones, Home, MoonStar, Sparkles } from "lucide-react";
import { getDictionary, localePath } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", key: "home", icon: Home },
  { href: "/ruqyah", key: "ruqyah", icon: Headphones },
  { href: "/adhkar", key: "adhkar", icon: MoonStar },
  { href: "/tasbeeh", key: "tasbeeh", icon: Sparkles },
  { href: "/library", key: "library", icon: BookOpen },
] as const;

export function MobileNav({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pathname = usePathname() || "/";

  return (
    <nav
      className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 backdrop-blur-xl lg:hidden"
      aria-label={dict.a11y.mainNav}
    >
      <div className="mx-auto flex h-[var(--bottom-nav-height)] max-w-md items-stretch justify-around px-1">
        {items.map((item) => {
          const href = localePath(locale, item.href);
          const active =
            item.href === "/"
              ? pathname === href || pathname === `${href}/`
              : pathname === href || pathname.startsWith(`${href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[10px] font-bold transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full transition-colors",
                  active ? "bg-primary/12" : ""
                )}
              >
                <Icon className="size-[18px]" strokeWidth={active ? 2.4 : 1.9} />
              </span>
              <span className="truncate">{dict.nav[item.key]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
