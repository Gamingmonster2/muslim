"use client";

import { useEffect, useState } from "react";
import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallButton({
  locale,
  variant = "outline",
  className,
}: {
  locale: Locale;
  variant?: "outline" | "ghost" | "default";
  className?: string;
}) {
  const dict = getDictionary(locale);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleClick = async () => {
    if (installed) {
      toast.success(dict.pwa.installed);
      return;
    }
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      setDeferred(null);
      return;
    }
    toast.info(dict.pwa.installTitle, {
      description: dict.pwa.iosHint,
      icon: <Share2 className="size-4" />,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        (variant === "default"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border border-border/80 bg-card/60 text-foreground hover:bg-muted") +
        " inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-xs font-semibold transition-colors " +
        (className ?? "")
      }
    >
      <Download className="size-3.5" />
      <span className="hidden sm:inline">{dict.actions.install}</span>
    </button>
  );
}
