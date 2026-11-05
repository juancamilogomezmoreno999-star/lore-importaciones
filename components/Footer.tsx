import Link from "next/link";
import { Logo } from "./Logo";
import { instagramLink, legalIdentity, store, whatsappLink } from "@/lib/config";
import { IconInstagram, IconWhatsApp } from "./icons";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink pb-28 pt-14 text-white/70 md:pb-14">
      <div className="container-x grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo size="lg" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{store.tagline}. Compramos por ti en Estados Unidos a través de canales de venta confiables y te acompañamos hasta que el pedido llegue a tus manos.</p>
          <div className="mt-5 flex gap-3">
            <a href={whatsappLink()} target="_blank" rel="noopener" className="rounded-[3px] border border-white/20 p-2.5 text-gold-light transition-colors hover:border-gold" aria-label="WhatsApp"><IconWhatsApp /></a>
            <a href={instagramLink} target="_blank" rel="noopener" className="rounded-[3px] border border-white/20 p-2.5 text-gold-light transition-colors hover:border-gold" aria-label="Instagram"><IconInstagram /></a>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-display text-xl text-gold-light">Tienda</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/catalogo" className="hover:text-white">Catálogo</Link></li>
            <li><Link href="/carrito" className="hover:text-white">Mi carrito</Link></li>
            <li><Link href="/sobre-nosotros" className="hover:text-white">Sobre nosotros</Link></li>
            <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-display text-xl text-gold-light">Ayuda</h3>
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
      <div className="container-x mt-12 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/60">
        <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
          <div><dt className="text-white/40">Negocio</dt><dd className="text-white/85">{store.name}</dd></div>
          <div><dt className="text-white/40">Responsable</dt><dd>{legalIdentity}</dd></div>
          {store.city && <div><dt className="text-white/40">Ubicación</dt><dd>{store.city}</dd></div>}
          <div><dt className="text-white/40">Contacto</dt><dd>{store.email && <>{store.email}<br /></>}WhatsApp {store.whatsappDisplay}</dd></div>
        </dl>
        <p className="mt-6">
          Protección al consumidor: <a href="https://www.sic.gov.co" target="_blank" rel="noopener" className="underline hover:text-white">Superintendencia de Industria y Comercio</a>.
          Las marcas mostradas pertenecen a sus respectivos dueños; somos un importador independiente.
        </p>
        <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {store.name}. Todos los derechos reservados.</p>
          <p>Paga con Nequi o Llave, PSE o tarjeta</p>
        </div>
      </div>
    </footer>
  );
}
