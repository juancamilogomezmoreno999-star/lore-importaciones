export default function Loading() {
  return (
    <div className="animate-pulse space-y-4" aria-label="Cargando">
      <div className="h-8 w-40 rounded-lg bg-ink/10" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 rounded-2xl bg-white" />)}
      </div>
      {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 rounded-2xl bg-white" />)}
    </div>
  );
}
