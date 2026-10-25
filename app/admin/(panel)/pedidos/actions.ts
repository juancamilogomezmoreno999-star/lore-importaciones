"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { allStatuses } from "@/lib/orders";
import { sendStatusUpdate } from "@/lib/email";
import type { Order, OrderStatus } from "@/lib/types";

const schema = z.object({
  id: z.string().uuid(),
  status: z.enum(allStatuses as [OrderStatus, ...OrderStatus[]]),
  tracking: z.string().trim().max(300).optional().default(""),
  notify: z.string().optional().transform((v) => v === "on"),
});

export async function updateOrder(_prev: string | null, form: FormData): Promise<string | null> {
  const { supabase } = await requireAdmin();
  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return "Datos inválidos";
  const { id, status, tracking, notify } = parsed.data;

  const { data: before } = await supabase.from("orders").select("status, stock_discounted").eq("id", id).single();
  const { data: order, error } = await supabase
    .from("orders")
    .update({ status, tracking: tracking || null })
    .eq("id", id)
    .select("*")
    .single<Order>();
  if (error || !order) return "No se pudo actualizar el pedido.";

  // Si se cancela, devolvemos las unidades al inventario
  if (status === "cancelado" && before?.stock_discounted) {
    await supabase.rpc("restore_order_stock", { p_order_id: id });
    revalidatePath("/catalogo");
  }

  const changed = before?.status !== status;
  if (notify && changed) await sendStatusUpdate(order);
  revalidatePath(`/admin/pedidos/${id}`);
  revalidatePath("/admin/pedidos");
  return changed ? (notify ? "✓ Estado actualizado y correo enviado al cliente." : "✓ Estado actualizado.") : "✓ Cambios guardados.";
}
