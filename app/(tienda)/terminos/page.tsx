import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import Link from "next/link";
import { legalContact, legalIdentity, payments, shipping, store, LEGAL_UPDATED } from "@/lib/config";
import { formatCOP } from "@/lib/format";

export const metadata: Metadata = { title: "Términos y condiciones", alternates: { canonical: "/terminos" } };

// Texto base. Te recomendamos que un abogado lo revise y lo ajuste a tu negocio.
export default function TermsPage() {
  return (
    <LegalPage title="Términos y condiciones" updated={LEGAL_UPDATED}>
      <p>Estos términos regulan las compras realizadas en el sitio web de {legalIdentity}, en adelante “{store.name}”. Al hacer un pedido aceptas estas condiciones, que se rigen por las leyes de la República de Colombia, en especial la Ley 1480 de 2011 (Estatuto del Consumidor).</p>

      <h2>1. Productos y precios</h2>
      <p>Los productos que ofrecemos son originales, adquiridos en tiendas oficiales o distribuidores autorizados de Estados Unidos. Las fotos son de referencia; los colores pueden variar levemente según la pantalla. Los precios están en pesos colombianos (COP) e incluyen IVA, envío internacional y costos de importación. El envío nacional se muestra por separado antes de pagar.</p>

      <h2>2. Pedidos y disponibilidad</h2>
      <p>El pedido queda confirmado cuando el pago es aprobado (o, en pago contra entrega, cuando lo confirmamos contigo por WhatsApp o llamada). Si un producto no está disponible en Estados Unidos después de tu pago, te avisaremos y podrás elegir otro producto o recibir la devolución total de tu dinero.</p>

      <h2>3. Pagos y envío</h2>
      <ul>
        <li><b>Nequi o Llave</b> ({payments.nequi.display}): transfieres el valor exacto y nos envías el comprobante por WhatsApp. El pedido se confirma cuando verificamos el pago. Sin costo adicional.</li>
        <li><b>Pago en línea con Bold</b> (tarjeta o PSE).{payments.onlineFeePercent > 0 ? ` Se suma al total el costo de la pasarela de pagos (comisión del ${payments.onlineFeePercent}%), que se muestra por separado antes de pagar.` : ""}</li>
        <li><b>Contra entrega</b>: solo para productos marcados como de entrega inmediata (que ya están en Colombia).</li>
      </ul>
      <p>{store.name} no almacena ni tiene acceso a la información de tu tarjeta o cuenta bancaria. El envío nacional cuesta {formatCOP(shipping.cost)} y se muestra antes de confirmar el pedido.</p>

      <h2>4. Tiempos de entrega</h2>
      <p>Cada producto indica un tiempo estimado de entrega en días hábiles, contado desde la confirmación del pago. Son tiempos aproximados que pueden variar por causas ajenas a nosotros (aduana, transportadoras, clima, festivos en Colombia o Estados Unidos). Te mantendremos informado/a por correo y WhatsApp.</p>

      <h2>5. Retracto, garantías y reembolsos</h2>
      <p>Tienes derecho de retracto dentro de los 5 días hábiles siguientes a la entrega (artículo 47 de la Ley 1480), garantía según los términos de cada marca o fabricante (artículo 8 de la Ley 1480), y derecho a solicitar la reversión del pago en los casos del artículo 51 de la Ley 1480. Todos los detalles están en nuestra <Link href="/devoluciones">política de cambios, devoluciones y reembolsos</Link>.</p>

      <h2>6. Imágenes y marcas</h2>
      <p>Las fotos de esta página son propias o se usan con autorización. Las marcas de los productos pertenecen a sus respectivos dueños; {store.name} es un importador independiente y no es distribuidor oficial ni representante de esas marcas.</p>

      <h2>7. Contacto, PQR y autoridad</h2>
      <p>Para peticiones, quejas o reclamos escríbenos {legalContact}. Responderemos en máximo quince (15) días hábiles. Si no quedas satisfecho/a, puedes acudir a la Superintendencia de Industria y Comercio (SIC), autoridad de protección al consumidor en Colombia: <a href="https://www.sic.gov.co" target="_blank" rel="noopener">www.sic.gov.co</a>.</p>
    </LegalPage>
  );
}
