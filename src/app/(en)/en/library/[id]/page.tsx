import { LibraryDetailView } from "@/views/library-detail-view";
import { buildMetadata } from "@/lib/metadata";
import { getLibraryItems } from "@/lib/content";

export function generateStaticParams() {
  return getLibraryItems().map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getLibraryItems().find((entry) => entry.id === id);
  return buildMetadata("en", {
    title: item?.title.en ?? "Audio library",
    description: item?.description.ar ?? "",
    path: `/library/${id}`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LibraryDetailView locale="en" id={id} />;
}
