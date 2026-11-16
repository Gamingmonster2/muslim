import Link from "next/link";
import { ArrowUpLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  actionHref,
  align = "start",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: string;
  actionHref?: string;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/30 bg-gold/8 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold">
          <span className="text-gold">✦</span>
          {eyebrow}
        </span>
      )}
      <div
        className={cn(
          "flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
          align === "center" && "sm:flex-col sm:items-center"
        )}
      >
        <div>
          <h2 className="font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
            {title}
          </h2>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
        </div>
        {action && actionHref && (
          <Link
            href={actionHref}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary transition-colors hover:text-primary/80"
          >
            {action}
            <ArrowUpLeft className="size-4 rtl:hidden" />
            <ArrowUpRight className="hidden size-4 rtl:inline" />
          </Link>
        )}
      </div>
    </div>
  );
}
