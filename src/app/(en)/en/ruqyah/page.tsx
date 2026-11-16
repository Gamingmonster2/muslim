import { RuqyahView } from "@/views/ruqyah-view";
import { buildMetadata } from "@/lib/metadata";
import { getDictionary } from "@/lib/i18n";

const dict = getDictionary("en");

export const metadata = buildMetadata("en", {
  title: dict.ruqyah.title,
  description: dict.ruqyah.description,
  path: "/ruqyah",
});

export default function Page() {
  return <RuqyahView locale="en" />;
}
