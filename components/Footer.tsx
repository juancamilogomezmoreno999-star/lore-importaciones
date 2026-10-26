import Link from "next/link";
import { Logo } from "./Logo";
import { instagramLink, legalIdentity, store, whatsappLink } from "@/lib/config";
import { IconInstagram, IconWhatsApp } from "./icons";

export function Footer() {
  return (
    <footer className="mt-20 bg-ink pb-28 pt-14 text-white/70 md:pb-14">
      <div className="container-x grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo size="lg" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{store.tagline}. Compramos por ti en tiendas oficiales de Estados Unidos y te acompañamos hasta que el pedido llegue a tus manos.</p>
          <div className="mt-5 flex gap-3">
            <a href={whatsappLink()} target="_blank" rel="noopener" className="rounded-full bg-white/10 p-2.5 text-gold-light hover:bg-white/20" aria-label="WhatsApp"><IconWhatsApp /></a>
            <a href={instagramLink} target="_blank" rel="noopener" className="rounded-full bg-white/10 p-2.5 text-gold-light hover:bg-white/20" aria-label="Instagram"><IconInstagram /></a>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-widest text-gold-light">Tienda</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/catalogo" className="hover:text-white">Catálogo</Link></li>
            <li><Link href="/carrito" className="hover:text-white">Mi carrito</Link></li>
            <li><Link href="/sobre-nosotros" className="hover:text-white">Sobre nosotros</Link></li>
            <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-widest text-gold-light">Ayuda</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/preguntas-frecuentes" className="hover:text-white">Preguntas frecuentes</Link></li>
            <li><Link href="/devoluciones" className="hover:text-white">Cambios y devoluciones</Link></li>
            <li><Link href="/terminos" className="hover:text-white">Términos y condiciones</Link></li>
            <li><Link href="/privacidad" className="hover:text-white">Tratamiento de datos</Link></li>
            <li><Link href="/cookies" className="hover:text-white">Política de cookies</Link></li>
            <li><a href={whatsappLink()} target="_blank" rel="noopener" className="hover:text-white">WhatsApp {store.whatsappDisplay}</a></li>
          </ul>
        </div>
      </div>
      <div className="container-x mt-12 space-y-2 border-t border-white/10 pt-6 text-xs text-white/60">
        <p>
          <b className="text-white/80">{store.name}</b> · {legalIdentity}
          {store.city && <> · {store.city}</>}
          {store.email && <> · {store.email}</>} · WhatsApp {store.whatsappDisplay}
        </p>
        <p>
          Protección al consumidor: <a href="https://www.sic.gov.co" target="_blank" rel="noopener" className="underline hover:text-white">Superintendencia de Industria y Comercio</a>.
          Las marcas mostradas pertenecen a sus respectivos dueños; somos un importador independiente.
        </p>
        <div className="flex flex-col gap-1 pt-1 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {store.name}. Todos los derechos reservados.</p>
          <p>Paga con Nequi o Llave, PSE o tarjeta</p>
        </div>
      </div>
    </footer>
  );
}
