"use server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServiceClient } from "@/lib/supabase/admin";
import { sendContactNotification } from "@/lib/email";

const schema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre").max(100),
  email: z.string().trim().toLowerCase().email("Revisa tu correo").max(160),
  phone: z.string().trim().max(20).optional(),
  message: z.string().trim().min(10, "Cuéntanos un poco más (mínimo 10 caracteres)").max(2000),
  consent: z.literal("on", { error: "Debes autorizar el tratamiento de tus datos" }),
  website: z.string().max(0).optional(),
});

export type ContactState = { ok: boolean; message: string } | null;

export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const { website, consent, ...msg } = parsed.data;
  void website; void consent;

  if (isSupabaseConfigured) {
    const { error } = await createServiceClient().from("contact_messages").insert({ ...msg, phone: msg.phone || null });
    if (error) return { ok: false, message: "No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos por WhatsApp." };
    await sendContactNotification(msg);
  }
  return { ok: true, message: "¡Mensaje enviado! Te responderemos muy pronto. 💛" };
}
