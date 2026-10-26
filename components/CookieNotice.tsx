"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "lore-aviso-cookies-v1";

/** Aviso informativo: la tienda solo usa almacenamiento técnico necesario (sin analíticas ni publicidad). */
export function CookieNotice() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {}
  }, []);
  if (!show) return null;
  const close = () => {
    try {
      localStorage.setItem(KEY, new Date().toISOString());
    } catch {}
    setShow(false);
  };
  return (
    <div role="region" aria-label="Aviso de cookies" className="fixed inset-x-3 bottom-24 z-40 mx-auto max-w-lg rounded-2xl bg-ink p-4 text-sm text-white/85 shadow-xl md:bottom-6">
      <p>
        🍪 Solo usamos el almacenamiento necesario para que la tienda funcione (por ejemplo, recordar tu carrito). No usamos cookies de publicidad ni de seguimiento.{" "}
        <Link href="/cookies" className="font-semibold text-gold-light underline">Más información</Link>
      </p>
      <button onClick={close} className="btn-gold mt-3 w-full !py-2.5 text-sm">Entendido</button>
    </div>
  );
}
