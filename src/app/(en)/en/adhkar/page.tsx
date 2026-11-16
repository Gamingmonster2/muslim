import { AdhkarView } from "@/views/adhkar-view";
import { buildMetadata } from "@/lib/metadata";
import { getDictionary } from "@/lib/i18n";

const dict = getDictionary("en");

export const metadata = buildMetadata("en", {
  title: dict.adhkar.title,
  description: dict.adhkar.description,
  path: "/adhkar",
});

export default function Page() {
  return <AdhkarView locale="en" />;
}
