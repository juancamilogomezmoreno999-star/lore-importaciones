import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-cream px-4 text-center">
      <p className="font-display text-7xl font-bold text-gold">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Esta página no existe</h1>
      <p className="mt-2 text-muted">Puede que el producto ya no esté disponible.</p>
      <Link href="/catalogo" className="btn-primary mt-6">Ver catálogo</Link>
    </div>
  );
}
