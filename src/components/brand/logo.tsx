import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-emerald-deep text-primary-foreground shadow-sm ring-1 ring-primary/20",
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        width={size * 0.78}
        height={size * 0.78}
        role="presentation"
      >
        {/* نجمة ذهبية خلفية */}
        <path
          d="M32 8l3.6 8.9 9.5.7-7.2 6.1 2.3 9.2L32 28.2l-8.2 4.7 2.3-9.2-7.2-6.1 9.5-.7L32 8z"
          fill="var(--gold)"
          opacity="0.95"
        />
        {/* هلال */}
        <path
          d="M46 22a14 14 0 1 0 0 24 12 12 0 1 1 0-24z"
          fill="currentColor"
          opacity="0.92"
        />
        {/* كتاب مفتوح */}
        <path
          d="M14 46c6-2 12-2 18 1 6-3 12-3 18-1v8c-6-2-12-2-18 1-6-3-12-3-18-1v-8z"
          fill="var(--gold)"
          opacity="0.9"
        />
        <path
          d="M32 47v9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    </span>
  );
}

export function BrandLockup({
  name,
  tagline,
  size = 40,
  className,
  compact = false,
}: {
  name: string;
  tagline?: string;
  size?: number;
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Logo size={size} />
      {!compact && (
        <span className="flex flex-col justify-center leading-none">
          <span className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
            {name}
          </span>
          {tagline && (
            <span className="mt-1 text-[11px] font-medium text-muted-foreground sm:text-xs">
              {tagline}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
