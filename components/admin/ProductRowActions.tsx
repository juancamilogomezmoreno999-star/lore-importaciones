"use client";
import { useTransition } from "react";
import { deleteProduct, toggleVisible } from "@/app/admin/(panel)/productos/actions";

export function ProductRowActions({ id, name, visible }: { id: string; name: string; visible: boolean }) {
  const [pending, start] = useTransition();
  return (
    <div className={`flex gap-2 ${pending ? "opacity-50" : ""}`}>
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => toggleVisible(id, !visible))}
        className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium hover:border-ink/40"
      >
        {visible ? "Ocultar" : "Mostrar"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm(`¿Eliminar "${name}" para siempre? Esta acción no se puede deshacer.\n\nSi solo quieres que no se vea, usa "Ocultar".`)) start(() => deleteProduct(id));
        }}
        className="rounded-full border border-danger/30 px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/5"
      >
        Eliminar
      </button>
    </div>
  );
}
