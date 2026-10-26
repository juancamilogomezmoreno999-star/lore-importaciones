"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSessionClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { recordConsent } from "@/lib/consent";
import { rateLimit } from "@/lib/rate-limit";

const profileSchema = z.object({
  full_name: z.string().trim().max(120),
  document: z.string().trim().max(12),
  phone: z.string().trim().max(20),
  department: z.string().trim().max(60),
  city: z.string().trim().max(80),
  address: z.string().trim().max(250),
});

export async function saveProfile(_prev: string | null, form: FormData): Promise<string | null> {
  const supabase = await createSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/cuenta/ingresar");
  const parsed = profileSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return "Revisa los datos.";
  const { error } = await supabase
    .from("customer_profiles")
    .upsert({ user_id: user.id, ...parsed.data, updated_at: new Date().toISOString() });
  if (error) return "No se pudieron guardar tus datos.";
  revalidatePath("/cuenta");
  return "✓ Datos guardados. Los usaremos para llenar tus próximas compras.";
}

/** Elimina la cuenta del cliente (derecho de supresión, Ley 1581). Los pedidos se conservan sin vínculo a la cuenta. */
export async function deleteAccount(): Promise<boolean> {
  const supabase = await createSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { error } = await createServiceClient().auth.admin.deleteUser(user.id);
  if (error) return false;
  await supabase.auth.signOut({ scope: "local" });
  return true;
}

/** Guarda la prueba de que el cliente aceptó términos y privacidad al crear su cuenta. */
export async function recordSignupConsent() {
  if (!(await rateLimit("consentimiento", 10, 600))) return;
  const supabase = await createSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return;
  await recordConsent({ context: "registro", email: user.email, terms: true, privacy: true, userId: user.id });
}
