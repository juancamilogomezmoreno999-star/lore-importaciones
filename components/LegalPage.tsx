export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="container-x max-w-3xl py-10">
      <h1 className="text-4xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-muted">Última actualización: {updated}</p>
      <div className="prose-lore mt-8">{children}</div>
    </div>
  );
}
