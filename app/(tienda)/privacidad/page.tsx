import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { store } from "@/lib/config";

export const metadata: Metadata = { title: "Política de privacidad y tratamiento de datos", alternates: { canonical: "/privacidad" } };

// Texto base conforme a la Ley 1581 de 2012 y el Decreto 1074 de 2015.
// Complétalo con tus datos (NIT/C.C., dirección) y, de ser posible, haz que lo revise un abogado.
export default function PrivacyPage() {
  return (
    <LegalPage title="Política de privacidad y tratamiento de datos personales" updated="octubre de 2026">
      <p>En cumplimiento de la Ley Estatutaria 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015) y demás normas aplicables, {store.legalName} informa cómo recolecta, usa y protege tus datos personales.</p>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li>Nombre: {store.legalName}</li>
        <li>Identificación: {store.legalId}</li>
        <li>Correo: {store.email}</li>
        <li>WhatsApp: {store.whatsappDisplay}</li>
      </ul>

      <h2>2. Datos que recolectamos</h2>
      <p>Nombre, número de cédula, celular, correo electrónico, ciudad, departamento y dirección de entrega, así como la información de tus pedidos. No recolectamos ni almacenamos datos de tarjetas: los pagos los procesa directamente Wompi, bajo sus propias políticas de seguridad.</p>

      <h2>3. Finalidades</h2>
      <ul>
        <li>Procesar, facturar, enviar y hacer seguimiento a tus pedidos.</li>
        <li>Comunicarnos contigo sobre el estado de tu compra por correo, llamada o WhatsApp.</li>
        <li>Atender peticiones, quejas, reclamos, garantías y devoluciones.</li>
        <li>Cumplir obligaciones legales, contables y tributarias.</li>
        <li>Enviarte novedades y promociones, solo si lo autorizas. Puedes pedir que dejemos de hacerlo en cualquier momento.</li>
      </ul>

      <h2>4. Tus derechos</h2>
      <p>Como titular de los datos tienes derecho a: conocer, actualizar y rectificar tus datos; solicitar prueba de la autorización otorgada; ser informado/a sobre el uso que les damos; presentar quejas ante la Superintendencia de Industria y Comercio (SIC); revocar la autorización o solicitar la supresión de tus datos cuando no exista un deber legal de conservarlos; y acceder gratuitamente a ellos.</p>

      <h2>5. Cómo ejercer tus derechos</h2>
      <p>Escríbenos a {store.email} indicando tu nombre, cédula y tu solicitud. Las consultas se responden en máximo diez (10) días hábiles y los reclamos en máximo quince (15) días hábiles, según los artículos 14 y 15 de la Ley 1581 de 2012.</p>

      <h2>6. Seguridad y encargados</h2>
      <p>Guardamos tu información en servidores con conexión cifrada (HTTPS) y acceso restringido. Compartimos únicamente los datos necesarios con proveedores que nos ayudan a operar (pasarela de pagos, transportadoras, servicio de correo electrónico y alojamiento web), quienes actúan como encargados del tratamiento y deben proteger tu información.</p>

      <h2>7. Vigencia</h2>
      <p>Esta política rige desde su publicación. Tus datos se conservarán mientras sea necesario para las finalidades descritas y para cumplir obligaciones legales. Cualquier cambio importante será publicado en esta página.</p>
    </LegalPage>
  );
}
