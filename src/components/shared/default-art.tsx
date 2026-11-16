import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

/** غلاف افتراضي أنيق عند غياب الصورة */
export function DefaultArt({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/20 via-muted to-gold/15 text-center",
        className
      )}
    >
      <Logo size={64} />
      {label && (
        <span className="px-3 text-xs font-semibold leading-snug text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
}
