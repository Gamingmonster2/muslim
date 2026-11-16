"use client";

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AudioProvider } from "@/components/player/audio-provider";
import { PwaRegister } from "@/components/pwa/pwa-register";
import type { Locale } from "@/lib/types";

export function Providers({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <TooltipProvider delay={250}>
        <AudioProvider locale={locale}>
          {children}
          <Toaster position="top-center" richColors closeButton />
          <PwaRegister />
        </AudioProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
