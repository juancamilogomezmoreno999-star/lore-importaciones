"use client";
import { useTransition } from "react";
import { deleteOrder } from "@/app/admin/(panel)/pedidos/actions";

export function DeleteOrderButton({ id, code }: { id: string; code: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`¿Eliminar el pedido ${code} para siempre?\n\nÚsalo solo para pedidos de prueba. No se puede deshacer. Si tenía unidades apartadas, vuelven al inventario.`)) {
          start(() => deleteOrder(id));
        }
      }}
      className="w-full rounded-full border border-danger/30 py-3 text-sm font-medium text-danger hover:bg-danger/5 disabled:opacity-50"
    >
      {pending ? "Eliminando…" : "🗑️ Eliminar pedido"}
    </button>
  );
}
