import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { store } from "@/lib/config";

export const metadata: Metadata = { title: "Términos y condiciones", alternates: { canonical: "/terminos" } };

// Texto base. Te recomendamos que un abogado lo revise y lo ajuste a tu negocio.
export default function TermsPage() {
  return (
    <LegalPage title="Términos y condiciones" updated="octubre de 2026">
      <p>Estos términos regulan las compras realizadas en el sitio web de {store.legalName} ({store.legalId}), en adelante “{store.name}”. Al hacer un pedido aceptas estas condiciones, que se rigen por las leyes de la República de Colombia, en especial la Ley 1480 de 2011 (Estatuto del Consumidor).</p>

      <h2>1. Productos y precios</h2>
      <p>Los productos que ofrecemos son originales, adquiridos en tiendas oficiales o distribuidores autorizados de Estados Unidos. Las fotos son de referencia; los colores pueden variar levemente según la pantalla. Los precios están en pesos colombianos (COP) e incluyen IVA, envío internacional y costos de importación. El envío nacional se muestra por separado antes de pagar.</p>

      <h2>2. Pedidos y disponibilidad</h2>
      <p>El pedido queda confirmado cuando el pago es aprobado (o, en pago contra entrega, cuando lo confirmamos contigo por WhatsApp o llamada). Si un producto no está disponible en Estados Unidos después de tu pago, te avisaremos y podrás elegir otro producto o recibir la devolución total de tu dinero.</p>

      <h2>3. Pagos</h2>
      <p>Los pagos en línea se procesan a través de Bold. {store.name} no almacena ni tiene acceso a la información de tu tarjeta o cuenta bancaria. Si se aplica el pago contra entrega, el valor se paga al recibir el producto.</p>

      <h2>4. Tiempos de entrega</h2>
      <p>Cada producto indica un tiempo estimado de entrega en días hábiles, contado desde la confirmación del pago. Son tiempos aproximados que pueden variar por causas ajenas a nosotros (aduana, transportadoras, clima, festivos en Colombia o Estados Unidos). Te mantendremos informado/a por correo y WhatsApp.</p>

      <h2>5. Derecho de retracto</h2>
      <p>Por tratarse de una venta a distancia, puedes retractarte de tu compra dentro de los cinco (5) días hábiles siguientes a la entrega del producto (artículo 47 de la Ley 1480 de 2011). El producto debe devolverse en el mismo estado en que lo recibiste, sin uso y con empaques y etiquetas. Los costos de transporte de la devolución corren por tu cuenta. Devolveremos el dinero en un plazo máximo de treinta (30) días calendario. No aplica en los casos exceptuados por la ley, como productos de uso personal que por razones de higiene no puedan devolverse una vez abiertos (perfumes, cosméticos o similares abiertos).</p>

      <h2>6. Reversión del pago</h2>
      <p>Si pagaste con tarjeta, PSE u otro medio electrónico, puedes solicitar la reversión del pago en los casos y plazos establecidos en el artículo 51 de la Ley 1480 de 2011, escribiéndonos dentro de los cinco (5) días hábiles siguientes a la fecha en que conociste el motivo.</p>

      <h2>7. Garantía</h2>
      <p>Todos los productos cuentan con la garantía legal por calidad, idoneidad y seguridad. Si tu producto presenta un defecto, escríbenos con fotos o video. Según el caso, haremos la reparación, el cambio o la devolución del dinero. La garantía no cubre daños por mal uso, golpes, humedad o desgaste normal.</p>

      <h2>8. Contacto y PQR</h2>
      <p>Para peticiones, quejas o reclamos puedes escribirnos por WhatsApp al {store.whatsappDisplay}, al correo {store.email} o a través del formulario de contacto. Responderemos en un máximo de quince (15) días hábiles.</p>
    </LegalPage>
  );
}
