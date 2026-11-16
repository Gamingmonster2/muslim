import { ScholarDetailView } from "@/views/scholar-detail-view";
import { buildMetadata } from "@/lib/metadata";
import { getScholars } from "@/lib/content";

export function generateStaticParams() {
  return getScholars().map((scholar) => ({ id: scholar.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scholar = getScholars().find((item) => item.id === id);
  return buildMetadata("ar", {
    title: scholar ? `${scholar.name.ar} — الرقية الشرعية` : "الرقية الشرعية",
    description: scholar?.bio.ar ?? "",
    path: `/scholars/${id}`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ScholarDetailView locale="ar" id={id} />;
}
