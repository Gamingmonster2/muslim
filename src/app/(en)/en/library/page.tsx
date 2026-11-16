import { LibraryView } from "@/views/library-view";
import { buildMetadata } from "@/lib/metadata";
import { getDictionary } from "@/lib/i18n";

const dict = getDictionary("en");

export const metadata = buildMetadata("en", {
  title: dict.library.title,
  description: dict.library.description,
  path: "/library",
});

export default function Page() {
  return <LibraryView locale="en" />;
}
