import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { getDictionary, localePath } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { site } from "@/lib/site";

export function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const year = new Date().getFullYear();

  const links = [
    { href: "/ruqyah", label: dict.nav.ruqyah },
    { href: "/scholars", label: dict.nav.scholars },
    { href: "/adhkar", label: dict.nav.adhkar },
    { href: "/tasbeeh", label: dict.nav.tasbeeh },
    { href: "/library", label: dict.nav.library },
    { href: "/about", label: dict.nav.about },
  ];

  return (
    <footer className="mt-16 border-t border-border/60 bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <Logo size={40} />
              <div>
                <div className="font-display text-lg font-bold text-foreground">
                  {dict.brand.name}
                </div>
                <div className="text-[11px] font-medium text-muted-foreground">
                  {dict.brand.latin} · {dict.brand.tagline}
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {dict.footer.description}
            </p>
            <div className="mt-5 rounded-xl border border-gold/25 bg-gold/5 p-3 text-sm leading-relaxed text-foreground">
              <span className="font-semibold">{dict.home.sadaqahTitle}: </span>
              {dict.footer.sadaqah}
            </div>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-sm font-bold text-foreground">{dict.footer.quickLinks}</h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground md:grid-cols-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localePath(locale, link.href)}
                    className="transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h2 className="text-sm font-bold text-foreground">{dict.footer.resourcesTitle}</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href={site.sources.tvquran}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
                >
                  {dict.footer.resource1}
                </a>
              </li>
              <li>
                <a
                  href={site.sources.archive}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
                >
                  {dict.footer.resource2}
                </a>
              </li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground/80">
              {dict.footer.disclaimerShort}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} {dict.brand.name} — {dict.footer.rights}
          </p>
          <p className="inline-flex items-center gap-1.5">
            <span className="text-gold">✦</span>
            {dict.footer.builtLine}
          </p>
        </div>
      </div>
    </footer>
  );
}
