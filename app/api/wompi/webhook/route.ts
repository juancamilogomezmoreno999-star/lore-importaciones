import { NextResponse } from "next/server";
import { verifyEvent, type WompiEvent } from "@/lib/wompi";
import { applyWompiTransaction } from "@/lib/payments";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// URL que debes registrar en Wompi → Desarrolladores → "URL de Eventos":
//   https://TU-DOMINIO/api/wompi/webhook
export async function POST(request: Request) {
  let body: WompiEvent;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  if (!verifyEvent(body)) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }
  if (body.event === "transaction.updated" && isSupabaseConfigured) {
    await applyWompiTransaction(body.data.transaction);
  }
  return NextResponse.json({ ok: true });
}
