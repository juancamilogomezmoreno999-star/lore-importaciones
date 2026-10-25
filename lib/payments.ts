import "server-only";
import type { Order } from "./types";
import { createServiceClient } from "./supabase/admin";
import { sendOrderConfirmation } from "./email";

/**
 * Aplica el resultado de un pago de Bold a su pedido.
 * Se llama desde el webhook y desde la página del pedido (doble seguridad).
 * Es idempotente: si el pedido ya estaba aprobado no hace nada.
 */
export async function applyPaymentResult(r: {
  orderId: string;
  approved: boolean;
  rejected: boolean;
  amount: number | null;
  paymentId: string | null;
}) {
  if (!/^[0-9a-f-]{36}$/i.test(r.orderId)) return null;
  const db = createServiceClient();
  const { data: order } = await db.from("orders").select("*").eq("id", r.orderId).maybeSingle<Order>();
  if (!order) return null;
  if (order.payment_status === "aprobado") return order;

  if (r.approved) {
    if (r.amount !== null && r.amount !== order.total) {
      console.error("El monto pagado no coincide con el pedido", r.paymentId, order.id, r.amount, order.total);
      return order;
    }
    const { data: updated } = await db
      .from("orders")
      .update({ payment_status: "aprobado", status: "pagado", payment_id: r.paymentId })
      .eq("id", order.id)
      .neq("payment_status", "aprobado")
      .select("*")
      .maybeSingle<Order>();
    if (updated) {
      await db.rpc("discount_order_stock", { p_order_id: order.id });
      await sendOrderConfirmation(updated);
      return updated;
    }
    return order;
  }

  if (r.rejected) {
    const { data: updated } = await db
      .from("orders")
      .update({ payment_status: "rechazado", payment_id: r.paymentId })
      .eq("id", order.id)
      .select("*")
      .maybeSingle<Order>();
    return updated ?? order;
  }
  return order;
}
