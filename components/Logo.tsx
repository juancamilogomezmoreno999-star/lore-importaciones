import Image from "next/image";
import Link from "next/link";

// El logo está en public/logo.png (dorado con fondo transparente: sirve sobre fondo claro y oscuro).
export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const h = size === "lg" ? 64 : size === "sm" ? 34 : 46;
  return (
    <Link href="/" className="block shrink-0" aria-label="Lore Importaciones – inicio">
      <Image src="/logo.png" alt="Lore Importaciones" width={Math.round(h * 2.985)} height={h} priority className={size === "md" ? "h-[46px] w-auto md:h-[58px]" : undefined} />
    </Link>
  );
}
