"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "./CartProvider";
import { IconBag, IconClose, IconMenu, IconSearch } from "./icons";

const nav = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/sobre-nosotros", label: "Nosotros" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/90 backdrop-blur-md">
      <div className="bg-ink py-2 text-center text-[12px] font-medium text-gold-light">
        ✈️ Productos 100% originales de USA · Envíos a toda Colombia
      </div>
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <button className="-ml-2 p-2 md:hidden" onClick={() => setOpen(true)} aria-label="Abrir menú">
          <IconMenu />
        </button>
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-sm font-medium transition hover:text-gold-dark ${pathname.startsWith(n.href) ? "text-gold-dark" : "text-ink/80"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Link href="/catalogo" className="hidden p-2 sm:block" aria-label="Buscar productos">
            <IconSearch />
          </Link>
          <Link href="/carrito" className="relative -mr-2 p-2" aria-label={`Carrito, ${count} productos`}>
            <IconBag />
            {ready && count > 0 && (
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-ink">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col bg-cream p-6 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Cerrar menú" className="p-2">
                <IconClose />
              </button>
            </div>
            <nav className="flex flex-col">
              <Link href="/" className="border-b border-ink/5 py-4 text-lg font-medium">Inicio</Link>
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="border-b border-ink/5 py-4 text-lg font-medium">
                  {n.label}
                </Link>
              ))}
            </nav>
            <Link href="/carrito" className="btn-primary mt-auto">
              <IconBag /> Ver carrito {ready && count > 0 ? `(${count})` : ""}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
