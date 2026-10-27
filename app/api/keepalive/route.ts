import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Visita automática (la programa vercel.json cada 2 días): hace una consulta mínima a la base de datos
 * para que Supabase (plan gratis) no la pause por inactividad. No devuelve ni modifica datos.
 */
export async function GET(request: Request) {
  // Si defines CRON_SECRET en Vercel, solo responde a la tarea programada de Vercel.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (!isSupabaseConfigured) return NextResponse.json({ ok: true, demo: true });
  if (!(await rateLimit("keepalive", 10, 3600))) return NextResponse.json({ ok: true, limited: true });

  const { error } = await createPublicClient().from("products").select("id").limit(1);
  return NextResponse.json({ ok: !error }, { status: error ? 500 : 200, headers: { "Cache-Control": "no-store" } });
}
