"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  apiKey: string;
  orderId: string;
  amount: number;
  signature: string;
  description: string;
  redirectionUrl: string;
  customer: { email: string; fullName: string; phone: string; documentNumber: string };
};

/** Inserta el Botón de pagos de Bold (el script lo dibuja y abre la ventana de pago). */
export function BoldButton(p: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    el.innerHTML = "";
    const s = document.createElement("script");
    s.src = "https://checkout.bold.co/library/boldPaymentButton.js";
    s.async = true;
    s.setAttribute("data-bold-button", "dark-L");
    s.setAttribute("data-api-key", p.apiKey);
    s.setAttribute("data-order-id", p.orderId);
    s.setAttribute("data-currency", "COP");
    s.setAttribute("data-amount", String(p.amount));
    s.setAttribute("data-integrity-signature", p.signature);
    s.setAttribute("data-description", p.description.slice(0, 100));
    s.setAttribute("data-redirection-url", p.redirectionUrl);
    s.setAttribute(
      "data-customer-data",
      JSON.stringify({ ...p.customer, dialCode: "+57", documentType: "CC" }),
    );
    s.onerror = () => setFailed(true);
    el.appendChild(s);
    return () => {
      el.innerHTML = "";
    };
  }, [p.apiKey, p.orderId, p.amount, p.signature, p.description, p.redirectionUrl, p.customer]);

  return (
    <div>
      <div ref={box} className="flex min-h-14 justify-center" />
      {failed && (
        <p className="mt-3 text-center text-sm text-danger">
          No pudimos cargar el botón de pago. Revisa tu conexión y recarga la página.
        </p>
      )}
    </div>
  );
}
