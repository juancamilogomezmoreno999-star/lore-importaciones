import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

// Documentación: https://docs.wompi.co
// Con Web Checkout el cliente paga en la página segura de Wompi: nosotros NUNCA
// vemos ni guardamos datos de tarjetas.

const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || "";
export const isWompiConfigured = Boolean(publicKey && process.env.WOMPI_INTEGRITY_SECRET);

const apiBase = publicKey.startsWith("pub_prod_")
  ? "https://production.wompi.co/v1"
  : "https://sandbox.wompi.co/v1";

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export type WompiCustomer = {
  email: string;
  fullName: string;
  phone: string;
  document: string;
};

/** Construye el enlace al Web Checkout de Wompi con firma de integridad. */
export function buildCheckoutUrl(opts: {
  reference: string;
  amountInCents: number;
  redirectUrl: string;
  customer: WompiCustomer;
}) {
  const secret = process.env.WOMPI_INTEGRITY_SECRET!;
  const signature = sha256(`${opts.reference}${opts.amountInCents}COP${secret}`);
  const params = new URLSearchParams({
    "public-key": publicKey,
    currency: "COP",
    "amount-in-cents": String(opts.amountInCents),
    reference: opts.reference,
    "signature:integrity": signature,
    "redirect-url": opts.redirectUrl,
    "customer-data:email": opts.customer.email,
    "customer-data:full-name": opts.customer.fullName,
    "customer-data:phone-number": opts.customer.phone,
    "customer-data:phone-number-prefix": "+57",
    "customer-data:legal-id": opts.customer.document,
    "customer-data:legal-id-type": "CC",
  });
  return `https://checkout.wompi.co/p/?${params.toString()}`;
}

export type WompiTransaction = {
  id: string;
  status: "APPROVED" | "DECLINED" | "VOIDED" | "ERROR" | "PENDING";
  reference: string;
  amount_in_cents: number;
  currency: string;
  payment_method_type?: string;
};

/** Consulta una transacción directamente en Wompi (fuente confiable). */
export async function fetchTransaction(id: string): Promise<WompiTransaction | null> {
  if (!/^[\w-]{5,80}$/.test(id)) return null;
  const res = await fetch(`${apiBase}/transactions/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data ?? null;
}

type WompiEvent = {
  event: string;
  data: { transaction: WompiTransaction } & Record<string, unknown>;
  signature: { properties: string[]; checksum: string };
  timestamp: number;
};

/** Verifica la firma de un evento (webhook) enviado por Wompi. */
export function verifyEvent(body: WompiEvent): boolean {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret || !body?.signature?.properties) return false;
  const values = body.signature.properties.map((path) => {
    return path.split(".").reduce<unknown>((obj, key) => {
      return obj && typeof obj === "object" ? (obj as Record<string, unknown>)[key] : undefined;
    }, body.data);
  });
  const expected = sha256(`${values.join("")}${body.timestamp}${secret}`);
  const received = String(body.signature.checksum || "").toLowerCase();
  if (expected.length !== received.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

export type { WompiEvent };
