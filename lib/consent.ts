import "server-only";
import { headers } from "next/headers";
import { createServiceClient } from "./supabase/admin";
import { isSupabaseConfigured } from "./supabase/env";
import { LEGAL_VERSION } from "./config";

/**
 * Guarda la prueba de la autorización (Decreto 1377 de 2013, art. 8):
 * qué aceptó la persona, cuándo, desde qué IP y navegador, y qué versión de los documentos.
 * Nunca bloquea la compra: si falla, solo lo deja en el registro de errores.
 */
export async function recordConsent(c: {
  context: "pedido" | "registro" | "contacto";
  email: string;
  terms: boolean;
  privacy: boolean;
  userId?: string | null;
  orderId?: string | null;
}) {
  if (!isSupabaseConfigured) return;
  try {
    const h = await headers();
    const ip = (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "").trim() || null;
    const { error } = await createServiceClient().from("consent_log").insert({
      context: c.context,
      email: c.email.toLowerCase(),
      user_id: c.userId ?? null,
      order_id: c.orderId ?? null,
      accepted_terms: c.terms,
      accepted_privacy: c.privacy,
      terms_version: c.terms ? LEGAL_VERSION : null,
      privacy_version: c.privacy ? LEGAL_VERSION : null,
      ip,
      user_agent: h.get("user-agent")?.slice(0, 300) ?? null,
    });
    if (error) console.error("recordConsent", error.message);
  } catch (e) {
    console.error("recordConsent", e);
  }
}
