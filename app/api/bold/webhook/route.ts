import { NextResponse } from "next/server";
import { verifyWebhook, type BoldWebhookEvent } from "@/lib/bold";
import { applyPaymentResult } from "@/lib/payments";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// URL que debes registrar en Bold → Integraciones → Webhooks:
//   https://TU-DOMINIO/api/bold/webhook
export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyWebhook(raw, request.headers.get("x-bold-signature"))) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }
  let event: BoldWebhookEvent;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const orderId = event.data?.metadata?.reference;
  if (isSupabaseConfigured && orderId && (event.type === "SALE_APPROVED" || event.type === "SALE_REJECTED")) {
    await applyPaymentResult({
      orderId,
      approved: event.type === "SALE_APPROVED",
      rejected: event.type === "SALE_REJECTED",
      amount: event.data.amount?.total ?? null,
      paymentId: event.data.payment_id ?? event.subject ?? null,
    });
  }
  return NextResponse.json({ ok: true });
}
