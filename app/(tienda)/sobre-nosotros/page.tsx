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
    <div className="container-x py-12">
      <div className="max-w-3xl">
        <p className="eyebrow">{store.name}</p>
        <h1 className="mt-5 text-[2.6rem] sm:text-6xl">Tus marcas favoritas de USA, más cerca de ti.</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink/75">
          Descubre una selección de productos de moda, belleza, accesorios y mucho más. En {store.name} acercamos a Colombia los productos que te encantan de Estados Unidos,
          con una experiencia de compra cómoda, atención personalizada y la confianza de saber quién te acompaña en cada paso.
        </p>
        <p className="route-dots mt-8 border-l-2 pl-5 font-display text-2xl leading-snug">
          Encuentra tus productos favoritos disponibles para entrega inmediata o solicítalos por encargo.
        </p>
      </div>
      <ul className="mt-14 grid border-t border-line sm:grid-cols-2">
        {values.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-4 border-b border-line py-7 sm:pr-8 sm:odd:border-r sm:even:pl-8">
            <Icon width={24} height={24} className="mt-1 shrink-0 text-gold-dark" />
            <div>
              <h2 className="font-sans text-lg font-semibold">{title}</h2>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink/70">{text}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <Link href="/catalogo" className="btn-primary">Ver productos</Link>
        <a href={whatsappLink()} target="_blank" rel="noopener" className="btn-whatsapp"><IconWhatsApp width={20} /> Escríbenos</a>
      </div>
    </div>
  );
}
