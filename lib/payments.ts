import "server-only";
import type { Order } from "./types";
import { createServiceClient } from "./supabase/admin";
import type { WompiTransaction } from "./wompi";
import { sendOrderConfirmation } from "./email";

/**
 * Aplica el resultado de una transacción de Wompi a su pedido.
 * Se llama desde el webhook y desde la página de confirmación (doble seguridad).
 * Es idempotente: si el pedido ya estaba aprobado no hace nada.
 */
export async function applyWompiTransaction(tx: WompiTransaction) {
  const db = createServiceClient();
  const { data: order } = await db.from("orders").select("*").eq("id", tx.reference).maybeSingle<Order>();
  if (!order) return null;
  if (order.payment_status === "aprobado") return order;

  if (tx.status === "APPROVED") {
    if (tx.amount_in_cents !== order.total * 100 || tx.currency !== "COP") {
      console.error("Monto de Wompi no coincide con el pedido", tx.id, order.id);
      return order;
    }
    const { data: updated } = await db
      .from("orders")
      .update({ payment_status: "aprobado", status: "pagado", wompi_transaction_id: tx.id })
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

  if (["DECLINED", "VOIDED", "ERROR"].includes(tx.status)) {
    const { data: updated } = await db
      .from("orders")
      .update({ payment_status: "rechazado", wompi_transaction_id: tx.id })
      .eq("id", order.id)
      .select("*")
      .maybeSingle<Order>();
    return updated ?? order;
  }
  return order;
}
