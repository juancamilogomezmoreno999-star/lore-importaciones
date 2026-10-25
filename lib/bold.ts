import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// Bold – Botón de pagos (https://developers.bold.co).
// El cliente paga en la ventana segura de Bold: nosotros NUNCA vemos ni guardamos
// datos de tarjetas.
//
// Llaves: panel de Bold → Integraciones → Llaves de integración.
//  - Llave de identidad (pública)  → NEXT_PUBLIC_BOLD_API_KEY
//  - Llave secreta (privada)       → BOLD_SECRET_KEY
// Con las llaves de PRUEBA los pagos son simulados; con las de PRODUCCIÓN son reales.

export const boldApiKey = process.env.NEXT_PUBLIC_BOLD_API_KEY || "";
const secretKey = process.env.BOLD_SECRET_KEY || "";

export const isBoldConfigured = Boolean(boldApiKey && secretKey);

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

/** Hash de integridad: SHA-256 de orderId + monto + moneda + llave secreta. */
export function integritySignature(orderId: string, amount: number, currency = "COP") {
  return sha256(`${orderId}${amount}${currency}${secretKey}`);
}

/**
 * Verifica la firma del webhook (encabezado x-bold-signature):
 * HMAC-SHA256 (hex) del cuerpo codificado en Base64, usando la llave secreta.
 */
export function verifyWebhook(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const expected = createHmac("sha256", secretKey).update(Buffer.from(rawBody).toString("base64")).digest("hex");
  const received = signature.trim().toLowerCase();
  if (expected.length !== received.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

export type BoldStatus = "APPROVED" | "REJECTED" | "FAILED" | "PENDING" | "PROCESSING" | "VOIDED" | "NO_TRANSACTION_FOUND";

/** Consulta directamente en Bold el estado del pago de una orden (fuente confiable). */
export async function fetchPaymentStatus(orderId: string): Promise<{ status: BoldStatus; total: number | null; paymentId: string | null } | null> {
  if (!boldApiKey) return null;
  try {
    const res = await fetch(`https://payments.api.bold.co/v2/payment-voucher/${encodeURIComponent(orderId)}`, {
      headers: { Authorization: `x-api-key ${boldApiKey}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return {
      status: String(json.payment_status ?? "").toUpperCase() as BoldStatus,
      total: typeof json.total === "number" ? json.total : null,
      paymentId: json.payment_id ?? null,
    };
  } catch {
    return null;
  }
}

export type BoldWebhookEvent = {
  type: "SALE_APPROVED" | "SALE_REJECTED" | "VOID_APPROVED" | "VOID_REJECTED" | string;
  subject?: string;
  data: {
    payment_id?: string;
    amount?: { total?: number };
    metadata?: { reference?: string };
  };
};
