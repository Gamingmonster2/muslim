import { notFound } from "next/navigation";
import { AdhkarReader } from "@/components/adhkar/adhkar-reader";
import { buildMetadata } from "@/lib/metadata";
import { getAdhkarCategories } from "@/lib/content";

export function generateStaticParams() {
  return getAdhkarCategories().map((category) => ({ id: category.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = getAdhkarCategories().find((item) => item.id === id);
  return buildMetadata("ar", {
    title: category?.title.ar ?? "الأذكار",
    description: category?.description.ar ?? "",
    path: `/adhkar/${id}`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = getAdhkarCategories().find((item) => item.id === id);
  if (!category) notFound();
  return <AdhkarReader category={category} locale="ar" />;
}
