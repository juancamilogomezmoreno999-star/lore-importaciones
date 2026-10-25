"use client";
import { useTransition } from "react";
import { resetMonthSales } from "@/app/admin/(panel)/actions";

export function ResetSalesButton({ active }: { active: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (active) {
          if (confirm("¿Volver a contar todas las ventas del mes?")) start(() => resetMonthSales(true));
        } else if (confirm("¿Reiniciar las ventas del mes?\n\nEl contador vuelve a $0 y solo sumará las ventas nuevas. Tus pedidos NO se borran.")) {
          start(() => resetMonthSales());
        }
      }}
      className="mt-2 text-[11px] font-medium text-gold-dark underline disabled:opacity-50"
    >
      {pending ? "…" : active ? "Deshacer reinicio" : "Reiniciar"}
    </button>
  );
}
