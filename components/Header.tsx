"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "./CartProvider";
import { IconBag, IconClose, IconMenu, IconSearch, IconUser } from "./icons";
import { RouteSeparator } from "./FlightRoute";

const nav = [
  { href: "/sobre-nosotros", label: "Nosotros" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const { count, ready, user } = useCart();
  const accountHref = user ? "/cuenta" : "/cuenta/ingresar";
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-md">
      <div className="flex items-center justify-center gap-2 whitespace-nowrap bg-ink px-3 py-2 text-center text-[11px] font-medium text-gold-light [font-stretch:88%] sm:gap-3 sm:text-[12px] sm:[font-stretch:100%]">
        <span>Productos 100% originales de USA</span>
        <RouteSeparator className="w-8 shrink-0 text-gold sm:w-12" />
        <span>Envíos a toda Colombia</span>
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
              aria-current={pathname.startsWith(n.href) ? "page" : undefined}
              className={`border-b-2 py-1 text-sm font-medium transition-colors [font-stretch:108%] ${pathname.startsWith(n.href) ? "route-dots text-ink" : "border-transparent text-ink/70 hover:text-ink"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Link href="/catalogo" className="hidden p-2 sm:block" aria-label="Buscar productos">
            <IconSearch />
          </Link>
          <Link href={accountHref} className="relative p-2" aria-label={user ? "Mi cuenta" : "Ingresar"}>
            <IconUser />
            {user && <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-cream" />}
          </Link>
          <Link href="/carrito" className="relative -mr-2 p-2" aria-label={`Carrito, ${count} productos`}>
            <IconBag />
            {ready && count > 0 && (
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

    </header>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col bg-white p-6">
            <div className="mb-8 flex items-center justify-between">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Cerrar menú" className="p-2">
                <IconClose />
              </button>
            </div>
            <nav className="flex flex-col">
              <Link href="/" className="border-b border-line py-4 font-display text-2xl">Inicio</Link>
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="border-b border-line py-4 font-display text-2xl">
                  {n.label}
                </Link>
              ))}
            </nav>
            <Link href={accountHref} className="btn-outline mt-auto">
              <IconUser /> {user ? "Mi cuenta" : "Ingresar o crear cuenta"}
            </Link>
            <Link href="/carrito" className="btn-primary mt-3">
              <IconBag /> Ver carrito {ready && count > 0 ? `(${count})` : ""}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
