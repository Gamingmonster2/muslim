import { DesignView } from "@/views/design-view";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata("ar", {
  title: "نماذج التصميم",
  description: "استعراض نظام التصميم الخاص بمنصة اسمع دينك.",
  path: "/design",
  noIndex: true,
});

export default function Page() {
  return <DesignView locale="ar" />;
}
