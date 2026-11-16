import { AboutView } from "@/views/about-view";
import { buildMetadata } from "@/lib/metadata";
import { getDictionary } from "@/lib/i18n";

const dict = getDictionary("ar");

export const metadata = buildMetadata("ar", {
  title: dict.about.title,
  description: dict.about.lead,
  path: "/about",
});

export default function Page() {
  return <AboutView locale="ar" />;
}
