export default function Loading() {
  return (
    <div className="container-x animate-pulse py-8" aria-label="Cargando">
      <div className="h-12 w-48 rounded bg-sand" />
      <div className="mt-6 grid grid-cols-2 gap-4 border-b border-line pb-3">{[1, 2].map((i) => <div key={i} className="h-10 rounded bg-sand" />)}</div>
      <div className="mt-5 h-12 rounded-[3px] bg-sand" />
      <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}><div className="aspect-[4/5] rounded-md bg-sand" /><div className="mt-3 h-4 w-3/4 rounded bg-sand" /><div className="mt-2 h-4 w-1/3 rounded bg-sand" /></div>
        ))}
      </div>
    </div>
  );
}
