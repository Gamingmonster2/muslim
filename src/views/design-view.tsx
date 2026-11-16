import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HexagonPattern } from "@/components/ui/hexagon-pattern";
import { DotPattern } from "@/components/ui/dot-pattern";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const PALETTE = [
  { name: "primary", css: "var(--primary)" },
  { name: "gold", css: "var(--gold)" },
  { name: "emerald-deep", css: "var(--emerald-deep)" },
  { name: "background", css: "var(--background)" },
  { name: "card", css: "var(--card)" },
  { name: "muted", css: "var(--muted)" },
];

export function DesignView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <div className="py-10">
      <Container>
        <SectionHeading
          eyebrow={dict.brand.name}
          title="نماذج التصميم — Design samples"
          description="استعراض لألوان وخطوط ومكوّنات المنصة، للمراجعة والتطوير."
          align="center"
        />

        {/* الألوان */}
        <section className="mt-10">
          <h2 className="font-display text-lg font-bold">لوحة الألوان</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {PALETTE.map((color) => (
              <div key={color.name} className="overflow-hidden rounded-2xl border border-border/60 bg-card">
                <div className="h-20" style={{ background: color.css }} />
                <div className="p-2 text-center text-xs font-semibold text-foreground">
                  {color.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* الخطوط */}
        <section className="mt-10">
          <h2 className="font-display text-lg font-bold">الخطوط</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <p className="text-xs text-muted-foreground">IBM Plex Sans Arabic — الواجهة</p>
              <p className="mt-2 text-2xl font-bold">بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <p className="text-xs text-muted-foreground">Amiri — القرآن والأذكار</p>
              <p className="mt-2 font-quran text-2xl leading-loose">
                قُلْ هُوَ اللَّهُ أَحَدٌ
              </p>
            </div>
          </div>
        </section>

        {/* الأزرار */}
        <section className="mt-10">
          <h2 className="font-display text-lg font-bold">الأزرار</h2>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button>زر أساسي</Button>
            <Button variant="outline">مخطط</Button>
            <Button variant="secondary">ثانوي</Button>
            <Button variant="ghost">شبح</Button>
            <Button variant="destructive">تحذيري</Button>
            <Button size="lg">كبير</Button>
            <Button size="icon">✦</Button>
          </div>
        </section>

        {/* الشارات */}
        <section className="mt-10">
          <h2 className="font-display text-lg font-bold">الشارات</h2>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge>افتراضي</Badge>
            <Badge variant="secondary">ثانوي</Badge>
            <Badge variant="outline">مخطط</Badge>
            <Badge variant="destructive">تحذيري</Badge>
            <Badge className="border-gold/30 bg-gold/10 text-gold-foreground">
              ✦ ذهبي
            </Badge>
          </div>
        </section>

        {/* الأنماط */}
        <section className="mt-10">
          <h2 className="font-display text-lg font-bold">الأنماط الهندسية</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="relative h-40 overflow-hidden rounded-2xl border border-border/60">
              <HexagonPattern className="absolute inset-0 fill-primary/25 stroke-primary/15" />
              <span className="absolute bottom-3 start-3 text-xs font-semibold text-muted-foreground">
                HexagonPattern
              </span>
            </div>
            <div className="relative h-40 overflow-hidden rounded-2xl border border-border/60">
              <DotPattern className="absolute inset-0 text-primary/40" />
              <span className="absolute bottom-3 start-3 text-xs font-semibold text-muted-foreground">
                DotPattern
              </span>
            </div>
          </div>
        </section>

        {/* بطاقة نموذجية */}
        <section className="mt-10">
          <h2 className="font-display text-lg font-bold">بطاقة</h2>
          <div className="mt-4 grid max-w-sm">
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  ✦
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">عنوان البطاقة</h3>
                  <p className="text-xs text-muted-foreground">وصف مختصر هنا</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                مثال على بطاقة المحتوى المستخدمة في شيوخ الرقية والمكتبة الصوتية.
              </p>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
