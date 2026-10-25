import type { Metadata } from "next";
import Link from "next/link";
import { store, whatsappLink } from "@/lib/config";
import { IconShield, IconPlane, IconWhatsApp } from "@/components/icons";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description: `Conoce a ${store.name}: traemos productos originales de Estados Unidos a Colombia con precios justos y atención personalizada.`,
  alternates: { canonical: "/sobre-nosotros" },
};

const values = [
  { icon: IconShield, title: "Originales, siempre", text: "Compramos únicamente en tiendas oficiales y distribuidores autorizados de Estados Unidos." },
  { icon: IconPlane, title: "Transparencia", text: "Te contamos en qué va tu pedido: cuando lo compramos, cuando viaja y cuando sale a entrega." },
  { icon: IconWhatsApp, title: "Atención de verdad", text: "Detrás de cada mensaje hay una persona. Te asesoramos antes, durante y después de tu compra." },
];

export default function AboutPage() {
  return (
    <div className="container-x py-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Nuestra historia</p>
        <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Acercamos lo mejor de USA a Colombia</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink/75">
          {store.name} nació de una idea sencilla: que comprar productos originales de Estados Unidos sea fácil, seguro y a buen precio
          para cualquier persona en Colombia, sin tarjetas internacionales, sin casilleros y sin enredos con la aduana.
        </p>
        <p className="mt-4 leading-relaxed text-ink/75">
          Nosotros nos encargamos de todo: buscamos el producto, lo compramos, lo traemos al país y te lo llevamos hasta la puerta de tu casa.
          Tú solo eliges lo que te gusta.
        </p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {values.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card p-6">
            <Icon width={28} height={28} className="text-gold-dark" />
            <h2 className="mt-3 font-sans text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/catalogo" className="btn-primary">Ver productos</Link>
        <a href={whatsappLink()} target="_blank" rel="noopener" className="btn-whatsapp"><IconWhatsApp width={20} /> Escríbenos</a>
      </div>
    </div>
  );
}
