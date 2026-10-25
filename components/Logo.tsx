import Link from "next/link";

// Cuando tengas el logo: guárdalo como public/logo.png y reemplaza el contenido
// del <Link> por: <Image src="/logo.png" alt="Lore Importaciones" width={140} height={48} priority />
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex flex-col items-center leading-none" aria-label="Lore Importaciones – inicio">
      <span className={`font-display text-2xl font-bold tracking-[.25em] ${light ? "text-gold-light" : "text-ink"}`}>LORE</span>
      <span className="mt-0.5 text-[9px] font-semibold tracking-[.42em] text-gold-dark">IMPORTACIONES</span>
    </Link>
  );
}
