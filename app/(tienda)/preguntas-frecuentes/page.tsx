import type { Metadata } from "next";
import Link from "next/link";
import { payments, shipping, store, whatsappLink } from "@/lib/config";
import { formatCOP } from "@/lib/format";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Tiempos de entrega, envíos, pedidos y formas de pago al comprar productos importados de USA con Lore Importaciones.",
  alternates: { canonical: "/preguntas-frecuentes" },
};

const faqs: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "Tiempos y envíos",
    items: [
      { q: "¿Cuánto se demora mi pedido?", a: "Manejamos 2 opciones:\n\n1. Productos de entrega inmediata: tardan en llegar a tus manos de 1 a 3 días hábiles.\n2. Productos por encargo: tardan en llegar a tus manos de 15 a 20 días hábiles a partir del momento en que sea confirmado el pago." },
      { q: "¿Hacen envíos a toda Colombia?", a: `Sí, realizamos envíos a cualquier ciudad o municipio de Colombia por medio de transportadoras reconocidas a nivel nacional. El envío tiene un costo de ${formatCOP(shipping.cost)}, que debe ser asumido por el cliente.` },
      { q: "¿Cómo puedo saber el estado de mi pedido?", a: "Te estaremos informando por correo cada paso, o también nos puedes escribir al WhatsApp y preguntarnos en el momento que sea necesario. Siempre estaremos atentos para atenderte." },
      { q: "¿Puedo pedir un producto que no esté en la página?", a: "Sí, puedes escribirnos por WhatsApp y contarnos qué producto, marca, referencia, talla o color estás buscando. Revisamos y te informamos si es posible conseguirlo." },
    ],
  },
  {
    group: "Pagos",
    items: [
      { q: "¿Cómo es la forma de pago?", a: `Aceptamos todas las tarjetas débito y crédito, PSE, Nequi, Llave o transferencia bancaria.${payments.onlineFeePercent > 0 ? `\n\nAl pagar con tarjeta o PSE (a través de Bold) se suma el costo de la pasarela (comisión del ${payments.onlineFeePercent}%), que verás por separado antes de pagar. Nequi, Llave y transferencia no tienen costo adicional; para transferencia bancaria escríbenos por WhatsApp.` : ""}` },
      { q: "¿Puedo cancelar o cambiar mi pedido?", a: "Las condiciones de cancelación o cambio de pedido dependen de la modalidad de la compra y del estado en que se encuentre el pedido.\n\nTambién puedes revisar nuestra política de cambios y devoluciones." },
      { q: "¿Es seguro pagar en la página?", a: "Sí. El pago se hace en la ventana segura de Bold. Nosotros nunca vemos ni guardamos los datos de tu tarjeta." },
    ],
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.flatMap((g) => g.items).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <div className="container-x max-w-3xl py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <p className="eyebrow">Resolvemos tus dudas</p>
      <h1 className="mt-5 text-[2.6rem] sm:text-6xl">Preguntas frecuentes</h1>
      <p className="mt-3 text-lg leading-relaxed text-ink/75">Queremos que compres con tranquilidad. Aquí encontrarás las respuestas a las dudas más comunes sobre nuestros productos, pedidos, pagos y envíos.</p>
      {faqs.map((g) => (
        <section key={g.group} className="mt-10">
          <h2 className="mb-2 text-2xl sm:text-3xl">{g.group}</h2>
          <div className="border-t border-ink">
            {g.items.map((f) => (
              <details key={f.q} className="group border-b border-line [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 text-[17px] font-medium">
                  {f.q}
                  <span aria-hidden className="text-2xl leading-none text-gold-dark transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-prose whitespace-pre-line pb-6 text-[15px] leading-relaxed text-ink/75">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
      <div className="mt-14 rounded-md bg-sand p-6 sm:p-8">
        <p className="font-display text-2xl">¿No encontraste tu respuesta?</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <a href={whatsappLink()} target="_blank" rel="noopener" className="btn-whatsapp">WhatsApp {store.whatsappDisplay}</a>
          <Link href="/contacto" className="btn-outline">Escríbenos</Link>
        </div>
      </div>
    </div>
  );
}
