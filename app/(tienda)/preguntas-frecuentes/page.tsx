import type { Metadata } from "next";
import Link from "next/link";
import { payments, shipping, store, whatsappLink } from "@/lib/config";
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
      { q: "¿Cuánto se demora mi pedido?", a: "Manejamos 2 modalidades de compra:\n\n⚡ Productos de entrega inmediata\nLos productos disponibles en Colombia tienen un tiempo estimado de entrega de 1 a 3 días hábiles.\n\n✈️ Productos por encargo desde USA\nEl tiempo estimado de entrega es de 15 a 20 días hábiles, contados a partir de la confirmación del pago.\n\nLos tiempos son estimados y pueden variar por circunstancias relacionadas con el transporte o la entrega." },
      { q: "¿Hacen envíos a toda Colombia?", a: `¡Sí! Realizamos envíos a ciudades y municipios de Colombia a través de empresas transportadoras reconocidas.\n\nEl costo de envío es de ${formatCOP(shipping.cost)} y está a cargo del cliente. Te confirmaremos las condiciones de entrega antes de confirmar tu compra.` },
      { q: "¿Cómo puedo conocer el estado de mi pedido?", a: "Te mantendremos informado sobre el avance de tu pedido por correo electrónico. También puedes escribirnos por WhatsApp si deseas consultar su estado.\n\nNuestro compromiso es brindarte información clara y acompañarte durante el proceso, desde la compra hasta la entrega." },
      { q: "¿Puedo solicitar un producto que no aparece en la página?", a: "¡Claro que sí! En Lore Importaciones te ayudamos a encontrar lo que estás buscando.\n\nSi viste un producto que te gustaría comprar, envíanos una foto o imagen de referencia por WhatsApp. También puedes compartirnos el enlace del producto o indicarnos la marca, referencia, talla o color que deseas.\n\n¿No sabes dónde encontrarlo? ¡No te preocupes! Cuéntanos qué marca estás buscando y, si deseas, te compartimos el enlace de su página oficial en Estados Unidos para que puedas explorar sus productos y elegir tus favoritos.\n\nRevisaremos si es posible conseguir el producto que deseas y te informaremos sobre su disponibilidad, precio y condiciones de compra antes de confirmar tu pedido." },
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
      { q: "¿Cuáles son los medios de pago disponibles?", a: `Para tu comodidad, contamos con diferentes alternativas de pago:\n\n• Tarjetas débito y crédito\n• PSE\n• Nequi\n• Llaves de pago\n• Transferencia bancaria\n• Zelle (para pagos desde Estados Unidos)\n\nEn la página puedes pagar con Nequi o Llave (${payments.nequi.display}) sin costo adicional, o con tarjeta o PSE a través de Bold${payments.onlineFeePercent > 0 ? `, donde se suma el costo de la pasarela (comisión del ${payments.onlineFeePercent}%), que verás por separado antes de pagar` : ""}. Para transferencia bancaria o Zelle, escríbenos por WhatsApp. En productos de entrega inmediata también puedes pagar contra entrega.` },
      { q: "¿Puedo cancelar o cambiar mi pedido?", a: "Las condiciones de cancelación o cambio de un pedido dependen de la modalidad de compra (entrega inmediata o por encargo) y del estado en que se encuentre el pedido. Escríbenos por WhatsApp y te contamos tus opciones. También puedes revisar nuestra política de cambios y devoluciones." },
      { q: "¿Es seguro pagar en la página?", a: "Sí. El pago se hace en la ventana segura de Bold. Nosotros nunca vemos ni guardamos los datos de tu tarjeta." },
    ],
  },
  {
    group: "Garantías y devoluciones",
    items: [
      { q: "¿Los productos son originales?", a: "Sí. Trabajamos con productos originales de marcas reconocidas, comprados a través de canales de venta confiables de Estados Unidos. Si quieres, te compartimos el soporte de compra." },
      { q: "¿Tienen garantía?", a: "Sí. La garantía es la que establece cada marca o fabricante para su producto. Si tu producto llega con un defecto de fábrica, escríbenos con fotos o video y tu número de pedido, y te ayudamos a gestionarla. No cubre daños por mal uso, golpes o humedad." },
      { q: "¿Puedo devolver un producto?", a: "Sí. Por ser una compra a distancia tienes derecho de retracto: puedes devolver el producto dentro de los 5 días hábiles siguientes a la entrega, sin usar, con sus etiquetas y empaque original. Te devolvemos el dinero en máximo 30 días calendario. Los costos de transporte de la devolución corren por tu cuenta. Todos los detalles están en la página Cambios y devoluciones." },
      { q: "¿Y si me equivoqué de talla?", a: "Escríbenos dentro de los 5 días hábiles siguientes a la entrega. Si el producto está sin usar y con etiquetas, te ayudamos con el cambio según disponibilidad. Los envíos del cambio (ida y vuelta) los paga el cliente." },
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
