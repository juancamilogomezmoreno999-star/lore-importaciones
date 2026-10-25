import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createSessionClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";

/**
 * Verifica que haya una sesión iniciada Y que el correo esté en la tabla `admins`.
 * Se llama en el layout del panel y en cada acción del servidor.
 * `cache` hace que en una misma carga de página la verificación se haga una sola vez.
 */
export const requireAdmin = cache(async () => {
  if (!isSupabaseConfigured) redirect("/admin/login?demo=1");
  const supabase = await createSessionClient();
  const [{ data: { user } }, { data: isAdmin }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.rpc("is_admin"),
  ]);
  if (!user) redirect("/admin/login");
  if (!isAdmin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=no-autorizado");
  }
  return { supabase, user };
});
