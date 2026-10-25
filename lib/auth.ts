import "server-only";
import { redirect } from "next/navigation";
import { createSessionClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";

/**
 * Verifica que haya una sesión iniciada Y que el correo esté en la tabla `admins`.
 * Se llama en el layout del panel y en cada acción del servidor.
 */
export async function requireAdmin() {
  if (!isSupabaseConfigured) redirect("/admin/login?demo=1");
  const supabase = await createSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=no-autorizado");
  }
  return { supabase, user };
}
