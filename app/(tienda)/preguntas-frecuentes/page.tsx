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
      { q: "¿Cuánto se demora mi pedido?", a: "Manejamos 2 opciones. 1) Productos de entrega inmediata: tardan en llegar a tus manos de 1 a 3 días hábiles. 2) Productos por encargo: tardan en llegar a tus manos de 15 a 20 días hábiles a partir del momento en que se confirma el pago." },
      { q: "¿Hacen envíos a toda Colombia?", a: `Sí, realizamos envíos a cualquier ciudad o municipio de Colombia por medio de transportadoras reconocidas a nivel nacional. El envío tiene un costo de ${formatCOP(shipping.cost)}, que es asumido por el cliente.` },
      { q: "¿Puedo pedir un producto que no esté en la página?", a: "Sí, puedes escribirnos por WhatsApp y contarnos qué producto, marca, referencia, talla o color estás buscando. Revisamos y te informamos si es posible conseguirlo." },
      { q: "¿Cómo puedo saber el estado de mi pedido?", a: "Te estaremos informando por correo cada paso, o también nos puedes escribir al WhatsApp y preguntarnos en el momento que sea necesario. Siempre estaremos atentos para atenderte." },
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
      { q: "¿Cómo es la forma de pago?", a: `Aceptamos tarjetas débito y crédito, PSE, Nequi, Llave o transferencia bancaria.${payments.onlineFeePercent > 0 ? ` Al pagar con tarjeta o PSE (a través de Bold) se suma el costo de la pasarela (comisión del ${payments.onlineFeePercent}%); lo verás por separado antes de pagar. Nequi, Llave y transferencia no tienen costo adicional.` : ""} En productos de entrega inmediata también puedes pagar contra entrega.` },
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
