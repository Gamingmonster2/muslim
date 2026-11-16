import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { AppShell } from "@/components/app-shell";
import { site } from "@/lib/site";
import { getDictionary } from "@/lib/i18n";

const dict = getDictionary("ar");

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: dict.meta.siteTitle, template: `%s — ${dict.brand.name}` },
  description: dict.meta.siteDescription,
  keywords: [dict.meta.keywords],
  openGraph: {
    type: "website",
    locale: "ar_AR",
    url: "/",
    siteName: dict.brand.name,
    title: dict.meta.siteTitle,
    description: dict.meta.siteDescription,
    images: [site.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: dict.meta.siteTitle,
    description: dict.meta.siteDescription,
    images: [site.ogImage],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: dict.brand.name,
    statusBarStyle: "black-translucent",
  },
};

const DIR_SCRIPT = `(function(){try{var p=location.pathname;var en=p==='/en'||p.indexOf('/en/')===0;if(en){document.documentElement.lang='en';document.documentElement.dir='ltr';}else{document.documentElement.lang='ar';document.documentElement.dir='rtl';}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: DIR_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col bg-background text-foreground antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
