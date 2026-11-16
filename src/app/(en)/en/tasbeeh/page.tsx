import { TasbeehView } from "@/views/tasbeeh-view";
import { buildMetadata } from "@/lib/metadata";
import { getDictionary } from "@/lib/i18n";

const dict = getDictionary("en");

export const metadata = buildMetadata("en", {
  title: dict.tasbeeh.title,
  description: dict.tasbeeh.description,
  path: "/tasbeeh",
});

export default function Page() {
  return <TasbeehView locale="en" />;
}
