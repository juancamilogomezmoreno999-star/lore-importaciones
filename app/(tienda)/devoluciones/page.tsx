import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { legalContact, store, whatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "Cambios, devoluciones y reembolsos",
  description: `Cómo funcionan los cambios, devoluciones, garantías y reembolsos en ${store.name}.`,
  alternates: { canonical: "/devoluciones" },
};

// Basado en la Ley 1480 de 2011 (Estatuto del Consumidor). Conviene que un abogado lo revise.
export default function ReturnsPage() {
  return (
    <LegalPage title="Cambios, devoluciones y reembolsos" updated="octubre de 2026">
      <p>Queremos que quedes feliz con tu compra. Si algo no salió bien, aquí te explicamos tus opciones, según el Estatuto del Consumidor (Ley 1480 de 2011).</p>

      <h2>1. Derecho de retracto (te arrepentiste)</h2>
      <ul>
        <li>Tienes <b>5 días hábiles</b> desde que recibes el producto para devolverlo, sin dar explicaciones.</li>
        <li>Debe estar sin usar, con etiquetas y en su empaque original.</li>
        <li>El costo del envío de la devolución corre por tu cuenta.</li>
        <li>No aplica a productos de uso personal que por higiene no pueden devolverse una vez abiertos (perfumes, cosméticos, ropa interior o similares).</li>
      </ul>

      <h2>2. Cambios de talla o color</h2>
      <p>Los cambios de talla o color son una cortesía, no una obligación legal, y funcionan así:</p>
      <ul>
        <li>Debes solicitarlo dentro de los 5 días hábiles siguientes a la entrega.</li>
        <li>El producto debe estar sin usar, con etiquetas y en su empaque original.</li>
        <li>Están <b>sujetos a disponibilidad</b>. Si la talla o el color no están disponibles, te ofrecemos otro producto o aplicas al derecho de retracto.</li>
        <li><b>Los costos de envío del cambio (ida y vuelta) los paga el cliente.</b></li>
        <li>Si el producto debe pedirse de nuevo a Estados Unidos, tendrá el mismo tiempo de entrega del producto original y puede tener una diferencia de precio.</li>
      </ul>

      <h2>3. Garantía (el producto llegó con un defecto)</h2>
      <ul>
        <li>El término y las condiciones de la garantía son <b>los que establece cada marca o fabricante</b> para el producto. Si la marca no indica un término, aplica el término legal del artículo 8 de la Ley 1480 de 2011.</li>
        <li>Escríbenos con fotos o video del defecto y el número de pedido. Revisamos el caso y, según corresponda, gestionamos la reparación, el cambio por otro igual o la devolución del dinero.</li>
        <li>La garantía no cubre daños por mal uso, golpes, caídas, humedad, instalación incorrecta, modificaciones ni desgaste normal.</li>
      </ul>

      <h2>4. Reversión del pago</h2>
      <p>Si pagaste por un medio electrónico (tarjeta, PSE, Nequi o Llave) y fuiste víctima de fraude, la operación no fue solicitada, el producto no fue recibido o no corresponde a lo pedido o está defectuoso, puedes solicitar la reversión del pago dentro de los 5 días hábiles siguientes a cuando lo supiste (artículo 51 de la Ley 1480).</p>

      <h2>5. ¿Cuándo y cómo te devolvemos el dinero?</h2>
      <ul>
        <li>Una vez recibamos y revisemos el producto, te devolvemos el dinero en máximo <b>30 días calendario</b>.</li>
        <li>Lo devolvemos por el mismo medio con el que pagaste (tarjeta, PSE, Nequi o Llave), o por transferencia si pagaste contra entrega.</li>
        <li>Si un producto que pagaste no está disponible en Estados Unidos, te avisamos y puedes elegir otro producto o la devolución total de tu dinero.</li>
      </ul>

      <h2>6. ¿Cómo hago la solicitud?</h2>
      <p>Escríbenos {legalContact}, con tu número de pedido (por ejemplo LORE-1010), el motivo y fotos si aplica. Te respondemos en máximo 15 días hábiles.</p>
      <p><a href={whatsappLink("¡Hola! Quiero hacer una solicitud de cambio o devolución de mi pedido")} target="_blank" rel="noopener" className="font-semibold underline">Escribir por WhatsApp</a> · <Link href="/terminos" className="underline">Términos y condiciones</Link></p>
    </LegalPage>
  );
}
