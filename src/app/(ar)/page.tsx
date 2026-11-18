import { HomeView } from "@/views/home-view";
import { buildMetadata } from "@/lib/metadata";
import { getDictionary } from "@/lib/i18n";

const dict = getDictionary("ar");

export const metadata = buildMetadata("ar", {
  title: dict.meta.siteTitle,
  description: dict.meta.siteDescription,
  path: "/",
  absolute: true,
});

export default function Page() {
  return <HomeView locale="ar" />;
}
