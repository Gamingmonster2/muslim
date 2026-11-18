import { HomeView } from "@/views/home-view";
import { buildMetadata } from "@/lib/metadata";
import { getDictionary } from "@/lib/i18n";

const dict = getDictionary("en");

export const metadata = buildMetadata("en", {
  title: dict.meta.siteTitle,
  description: dict.meta.siteDescription,
  path: "/",
  absolute: true,
});

export default function Page() {
  return <HomeView locale="en" />;
}
