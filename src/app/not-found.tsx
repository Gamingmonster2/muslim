import Link from "next/link";
import { Container } from "@/components/shared/container";
import { getDictionary } from "@/lib/i18n";

export default function NotFound() {
  const dict = getDictionary("ar");
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-quran text-7xl font-bold text-primary/30">٤٠٤</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
        {dict.errors.notFound}
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {dict.errors.notFoundDesc}
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {dict.errors.backHome}
      </Link>
    </Container>
  );
}
