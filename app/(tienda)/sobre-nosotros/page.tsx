import type { Metadata } from "next";
import Link from "next/link";
import { store, whatsappLink } from "@/lib/config";
import { IconCheck, IconPlane, IconShield, IconWhatsApp } from "@/components/icons";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description: `${store.name}: tus marcas favoritas de USA, más cerca de ti. Moda, belleza y accesorios con entrega inmediata o por encargo desde Estados Unidos.`,
  alternates: { canonical: "/sobre-nosotros" },
};

const values = [
  { icon: IconShield, title: "Originales siempre", text: "Trabajamos para ofrecerte productos originales de marcas reconocidas, gestionando las compras a través de canales de venta confiables." },
  { icon: IconPlane, title: "Transparencia", text: "Te informamos sobre todo el proceso de tu pedido: confirmación de precios, disponibilidad y condiciones de compra antes de confirmar tu pedido." },
  { icon: IconWhatsApp, title: "Atención personalizada", text: "Estamos disponibles para resolver tus dudas, asesorarte, orientarte y acompañarte durante todo el proceso." },
  { icon: IconCheck, title: "Compromiso", text: "Trabajamos con respaldo, confianza, dedicación y cumplimiento, manteniéndote informado de todo el proceso y del estado de tu pedido." },
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
          Descubre una selección de productos de moda, belleza, accesorios y mucho más. En {store.name} acercamos a Colombia los productos que te encantan de Estados Unidos,
          con una experiencia de compra cómoda, atención personalizada y la confianza de saber quién te acompaña en cada paso.
        </p>
        <p className="mx-auto mt-6 inline-block rounded-full bg-gold/15 px-5 py-2.5 text-sm font-semibold text-gold-dark ring-1 ring-gold/40">
          Encuentra tus productos favoritos disponibles para entrega inmediata o solicítalos por encargo.
        </p>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
