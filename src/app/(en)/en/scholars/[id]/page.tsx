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
  return buildMetadata("en", {
    title: scholar ? `${scholar.name.en} — Ruqyah` : "Ruqyah",
    description: scholar?.bio.en ?? "",
    path: `/scholars/${id}`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ScholarDetailView locale="en" id={id} />;
}
