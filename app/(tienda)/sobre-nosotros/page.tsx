import type { Metadata } from "next";
import Link from "next/link";
import { store, whatsappLink } from "@/lib/config";
import { IconShield, IconPlane, IconWhatsApp } from "@/components/icons";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description: `${store.name}: tus marcas favoritas de USA, más cerca de ti. Moda, belleza y accesorios con entrega inmediata o por encargo desde Estados Unidos.`,
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
        <p className="eyebrow">{store.name}</p>
        <h1 className="mt-2 text-4xl font-semibold leading-tight sm:text-5xl">
          Tus marcas favoritas de USA, <span className="italic text-gold-dark">más cerca de ti.</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink/75">
          Descubre moda, belleza, accesorios y mucho más. Encuentra tus favoritos disponibles para entrega inmediata o solicítalos por encargo desde Estados Unidos.
        </p>
        <p className="mx-auto mt-6 inline-block rounded-full bg-gold/15 px-5 py-2.5 text-sm font-semibold text-gold-dark ring-1 ring-gold/40">
          Calidad, confianza y una experiencia de compra pensada para ti.
        </p>
        <p className="mt-8 leading-relaxed text-ink/75">
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
