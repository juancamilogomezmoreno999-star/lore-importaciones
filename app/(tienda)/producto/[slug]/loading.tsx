export default function Loading() {
  return (
    <div className="container-x animate-pulse py-4 sm:py-8" aria-label="Cargando">
      <div className="mb-4 h-3 w-40 rounded bg-sand" />
      <div className="grid gap-6 md:grid-cols-2 md:gap-12">
        <div className="aspect-square rounded-md bg-sand" />
        <div>
          <div className="h-3 w-20 rounded bg-sand" />
          <div className="mt-4 h-10 w-4/5 rounded bg-sand" />
          <div className="mt-5 h-8 w-1/3 rounded bg-sand" />
          <div className="mt-8 flex gap-2">{[1, 2, 3].map((i) => <div key={i} className="h-11 w-14 rounded-[3px] bg-sand" />)}</div>
          <div className="mt-6 h-12 w-full rounded-[3px] bg-sand" />
          <div className="mt-8 space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-4 w-full rounded bg-sand" />)}</div>
        </div>
      </div>
    </div>
  );
}
