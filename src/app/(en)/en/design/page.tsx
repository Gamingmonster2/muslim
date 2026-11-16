import { DesignView } from "@/views/design-view";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata("en", {
  title: "Design samples",
  description: "The design system samples for ListenYourDeen.",
  path: "/design",
  noIndex: true,
});

export default function Page() {
  return <DesignView locale="en" />;
}
