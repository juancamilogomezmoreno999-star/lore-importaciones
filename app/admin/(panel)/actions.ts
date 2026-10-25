"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

/** Reinicia el contador de "Ventas del mes": desde ahora solo cuenta las ventas nuevas. */
export async function resetMonthSales(undo = false) {
  const { supabase } = await requireAdmin();
  await supabase.auth.updateUser({ data: { sales_reset_at: undo ? null : new Date().toISOString() } });
  revalidatePath("/admin");
}
