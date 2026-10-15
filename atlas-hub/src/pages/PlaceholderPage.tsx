export default function PlaceholderPage({ title, note }: { title: string; note: string }) {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold text-petroleo">{title}</h1>
      <p className="text-sm">{note}</p>
    </section>
  );
}
