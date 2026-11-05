/**
 * La ruta punteada del avión del logo. En el banner se dibuja y el avión vuela una sola vez;
 * con "reducir movimiento" activado aparece ya dibujada.
 */
const D = "M 4 58 C 150 70, 330 64, 452 38 C 500 27, 540 18, 592 10";
const PLANE =
  "M11 0 L-5 -2.1 L-8.5 -9 L-11 -9 L-8 -1.7 L-11 -1.5 L-13 -4.5 L-14.6 -4.5 L-13.2 0 L-14.6 4.5 L-13 4.5 L-11 1.5 L-8 1.7 L-11 9 L-8.5 9 L-5 2.1 Z";

export function FlightRoute({ id, className = "" }: { id: string; className?: string }) {
  return (
    <svg viewBox="0 0 600 70" className={`h-auto w-full overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="-20" y="-20" width="640" height="110">
          <path d={D} pathLength={1} className="ruta-trazo" fill="none" stroke="#fff" strokeWidth="10" />
        </mask>
      </defs>
      <path d={D} fill="none" stroke="var(--color-gold)" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="0.01 8.5" mask={`url(#${id}-mask)`} />
      <g className="avion-vuela" fill="var(--color-ink)">
        <path d={PLANE} />
        <animateMotion dur="1.9s" begin="0.35s" fill="freeze" rotate="auto" path={D} calcMode="linear" />
      </g>
      <g className="avion-quieto" fill="var(--color-ink)" transform="translate(592 10) rotate(-9.8)">
        <path d={PLANE} />
      </g>
    </svg>
  );
}

/** Tramo corto de la ruta, para separar textos (barra superior). */
export function RouteSeparator({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 12" className={`inline-block h-3 w-12 ${className}`} aria-hidden="true" focusable="false">
      <path d="M2 6 H46" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="0.01 5" fill="none" />
      <g transform="translate(55 6) scale(.42)" fill="currentColor"><path d={PLANE} /></g>
    </svg>
  );
}
