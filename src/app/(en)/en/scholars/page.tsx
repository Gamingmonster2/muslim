import { ScholarsView } from "@/views/scholars-view";
import { buildMetadata } from "@/lib/metadata";
import { getDictionary } from "@/lib/i18n";

const dict = getDictionary("en");

export const metadata = buildMetadata("en", {
  title: dict.scholars.title,
  description: dict.scholars.description,
  path: "/scholars",
});

export default function Page() {
  return <ScholarsView locale="en" />;
}
