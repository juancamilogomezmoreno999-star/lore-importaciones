"use client";
import { usePathname } from "next/navigation";
import { whatsappLink } from "@/lib/config";
import { IconWhatsApp } from "./icons";

export function WhatsAppFloat() {
  // En la página de producto sube un poco para no tapar el botón "Agregar al carrito" en celular
  const raised = usePathname().startsWith("/producto/");
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener"
      aria-label="Escríbenos por WhatsApp"
      className={`fixed right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105 md:bottom-6 md:right-6 ${raised ? "bottom-24" : "bottom-5"}`}
    >
      <IconWhatsApp width={30} height={30} />
    </a>
  );
}
