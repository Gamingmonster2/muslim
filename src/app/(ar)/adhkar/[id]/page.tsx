import { notFound } from "next/navigation";
import { AdhkarReader } from "@/components/adhkar/adhkar-reader";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/metadata";
import { getAdhkarCategories } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { buildBreadcrumbSchema } from "@/lib/schema";

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
  const dict = getDictionary("ar");
  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbSchema("ar", [
            { name: dict.nav.home, path: "/" },
            { name: dict.adhkar.title, path: "/adhkar" },
            { name: category.title.ar, path: `/adhkar/${id}` },
          ]),
        ]}
      />
      <AdhkarReader category={category} locale="ar" />
    </>
  );
}
