import type { Metadata } from "next";
import Link from "next/link";
import { shipping, store, whatsappLink } from "@/lib/config";
import { formatCOP } from "@/lib/format";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Tiempos de entrega, aduana, garantías, devoluciones y formas de pago al comprar productos importados de USA con Lore Importaciones.",
  alternates: { canonical: "/preguntas-frecuentes" },
};

const faqs: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "Tiempos y envíos",
    items: [
      { q: "¿Cuánto se demora mi pedido?", a: "Depende del producto: en cada uno verás el tiempo estimado. Los productos que ya tenemos en Colombia llegan en 1 a 3 días hábiles. Los que pedimos a Estados Unidos tardan normalmente entre 8 y 15 días hábiles desde que se confirma el pago." },
      { q: "¿Hacen envíos a toda Colombia?", a: `Sí, enviamos a cualquier ciudad o municipio del país con transportadoras reconocidas. El envío cuesta ${formatCOP(shipping.cost)}${shipping.freeFrom > 0 ? ` y es gratis en compras desde ${formatCOP(shipping.freeFrom)}` : ""}.` },
      { q: "¿Cómo sé en qué va mi pedido?", a: "Te enviamos un correo cada vez que tu pedido cambia de estado (pagado, comprando en USA, en tránsito y entregado), con el número de guía cuando sale a entrega. También puedes preguntarnos por WhatsApp cuando quieras." },
    ],
  },
  {
    group: "Aduana e impuestos",
    items: [
      { q: "¿Tengo que pagar algo adicional en la aduana?", a: "No. El precio que ves en la página ya incluye el envío internacional, los impuestos y los trámites de importación. Lo que ves es lo que pagas (más el envío nacional, si aplica)." },
      { q: "¿Quién hace los trámites de importación?", a: "Nosotros. Nos encargamos de toda la logística y de cumplir con la normativa de la DIAN. Tú no tienes que hacer ningún trámite." },
    ],
  },
  {
    group: "Pagos",
    items: [
      { q: "¿Qué medios de pago aceptan?", a: "Tarjetas débito y crédito, PSE, Nequi, Bancolombia y otros medios a través de Wompi, una pasarela de pagos colombiana. También ofrecemos pago contra entrega en algunas ciudades." },
      { q: "¿Es seguro pagar en la página?", a: "Sí. El pago se hace en la plataforma segura de Wompi (del Grupo Bancolombia). Nosotros nunca vemos ni guardamos los datos de tu tarjeta." },
    ],
  },
  {
    group: "Garantías y devoluciones",
    items: [
      { q: "¿Los productos son originales?", a: "Sí, 100%. Los compramos en tiendas oficiales y distribuidores autorizados de Estados Unidos. Si quieres, te compartimos el soporte de compra." },
      { q: "¿Tienen garantía?", a: "Sí. Todos los productos tienen la garantía legal que establece el Estatuto del Consumidor (Ley 1480 de 2011). Si tu producto llega con un defecto de fábrica, escríbenos dentro de los primeros días con fotos o video y te damos solución: reparación, cambio o devolución del dinero." },
      { q: "¿Puedo devolver un producto?", a: "Sí. Por ser una compra a distancia tienes derecho de retracto: puedes devolver el producto dentro de los 5 días hábiles siguientes a la entrega, sin usar, con sus etiquetas y empaque original. Te devolvemos el dinero en máximo 30 días calendario. Los costos de transporte de la devolución corren por tu cuenta." },
      { q: "¿Y si me equivoqué de talla?", a: "¡Tranquilo/a! Escríbenos apenas lo recibas. Si el producto está sin usar, te ayudamos con el cambio de talla según disponibilidad." },
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
      <h1 className="mt-2 text-4xl font-semibold">Preguntas frecuentes</h1>
      {faqs.map((g) => (
        <section key={g.group} className="mt-10">
          <h2 className="mb-3 text-xl font-semibold">{g.group}</h2>
          <div className="space-y-2">
            {g.items.map((f) => (
              <details key={f.q} className="card group p-0 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-medium">
                  {f.q}
                  <span className="text-xl text-gold-dark transition group-open:rotate-45">+</span>
                </summary>
                <p className="px-5 pb-5 text-[15px] leading-relaxed text-ink/75">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
      <div className="card mt-12 p-6 text-center">
        <p className="font-medium">¿No encontraste tu respuesta?</p>
        <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={whatsappLink()} target="_blank" rel="noopener" className="btn-whatsapp">WhatsApp {store.whatsappDisplay}</a>
          <Link href="/contacto" className="btn-outline">Escríbenos</Link>
        </div>
      </div>
    </div>
  );
}
