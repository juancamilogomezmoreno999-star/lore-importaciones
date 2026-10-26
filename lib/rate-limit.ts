import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createServiceClient } from "./supabase/admin";
import { isSupabaseConfigured } from "./supabase/env";

/**
 * Límite de intentos por persona (por dirección IP). Devuelve `true` si puede continuar.
 *
 * - La IP nunca se guarda: se convierte en un código irreversible (hash).
 * - Si la base de datos aún no tiene la función `check_rate_limit` (ver supabase/limite-de-intentos.sql),
 *   deja pasar: la tienda nunca se bloquea por un fallo del límite.
 */
export async function rateLimit(name: string, limit: number, windowSeconds: number): Promise<boolean> {
  if (!isSupabaseConfigured) return true;
  try {
    const h = await headers();
    const ip = (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "desconocida").trim();
    const who = createHash("sha256").update(`${ip}|${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""}`).digest("hex").slice(0, 32);
    const { data, error } = await createServiceClient().rpc("check_rate_limit", {
      p_key: `${name}:${who}`,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    if (error) return true;
    return data !== false;
  } catch {
    return true;
  }
}

export const TOO_MANY = "Demasiados intentos en poco tiempo. Espera unos minutos e inténtalo de nuevo, o escríbenos por WhatsApp.";
