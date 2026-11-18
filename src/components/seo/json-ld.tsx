/** يضيف بيانات Schema.org (JSON-LD) داخل HTML الثابت لمحركات البحث */
export function JsonLd({ data }: { data: object[] }) {
  return (
    <>
      {data.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
