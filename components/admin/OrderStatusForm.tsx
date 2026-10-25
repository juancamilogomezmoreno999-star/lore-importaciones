"use client";
import { useActionState } from "react";
import type { OrderStatus } from "@/lib/types";
import { allStatuses, statusLabels } from "@/lib/orders";
import { updateOrder } from "@/app/admin/(panel)/pedidos/actions";

export function OrderStatusForm({ id, status, tracking }: { id: string; status: OrderStatus; tracking: string | null }) {
  const [msg, action, pending] = useActionState(updateOrder, null);
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      <div>
        <label className="label" htmlFor="status">Estado del pedido</label>
        <select id="status" name="status" defaultValue={status} className="input">
          {allStatuses.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="tracking">Guía / información de seguimiento <span className="font-normal text-muted">(opcional)</span></label>
        <input id="tracking" name="tracking" defaultValue={tracking ?? ""} className="input" placeholder="Ej: Servientrega guía 123456789" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="notify" defaultChecked className="h-5 w-5 accent-ink" />
        Enviar correo al cliente con el cambio
      </label>
      {msg && <p className={`text-sm font-medium ${msg.startsWith("✓") ? "text-success" : "text-danger"}`}>{msg}</p>}
      <button disabled={pending} className="btn-primary w-full">{pending ? "Guardando…" : "Guardar"}</button>
    </form>
  );
}
