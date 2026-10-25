"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

  const { data: before } = await supabase.from("orders").select("status, stock_discounted, payment_method, payment_status").eq("id", id).single();
  // Nequi: al pasar el pedido a Pagado (o más adelante) queda registrado como pagado
  const nequiPaid =
    before?.payment_method === "nequi" && before.payment_status === "pendiente" && !["pendiente", "cancelado"].includes(status);
  const { data: order, error } = await supabase
    .from("orders")
    .update({ status, tracking: tracking || null, ...(nequiPaid ? { payment_status: "aprobado" } : {}) })
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

/** Elimina un pedido para siempre (pensado para pedidos de prueba). Devuelve las unidades al inventario. */
export async function deleteOrder(id: string) {
  const { supabase } = await requireAdmin();
  if (!z.string().uuid().safeParse(id).success) return;
  const { data: order } = await supabase.from("orders").select("stock_discounted").eq("id", id).maybeSingle();
  if (!order) return;
  if (order.stock_discounted) await supabase.rpc("restore_order_stock", { p_order_id: id });
  await supabase.from("orders").delete().eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/admin/pedidos");
  revalidatePath("/catalogo");
  redirect("/admin/pedidos?borrado=1");
}
