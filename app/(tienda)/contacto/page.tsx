import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";
import { instagramLink, store, whatsappLink } from "@/lib/config";
import { IconInstagram, IconWhatsApp } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Escríbenos por WhatsApp al ${store.whatsappDisplay}, por Instagram @${store.instagram} o déjanos un mensaje. Te respondemos rápido.`,
  alternates: { canonical: "/contacto" },
};

export default function ContactPage() {
  return (
    <div className="container-x py-10">
      <div className="max-w-2xl">
        <p className="eyebrow">Hablemos</p>
        <h1 className="mt-2 text-4xl font-semibold">Contáctanos</h1>
        <p className="mt-3 text-muted">¿Tienes dudas sobre un producto, quieres cotizar algo de USA o saber cómo va tu pedido? Estamos para ayudarte.</p>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1.3fr]">
        <div className="space-y-3">
          <a href={whatsappLink()} target="_blank" rel="noopener" className="card flex items-center gap-4 p-5 hover:ring-1 hover:ring-[#25D366]">
            <span className="rounded-full bg-[#25D366] p-3 text-white"><IconWhatsApp /></span>
            <span><b className="block">WhatsApp</b><span className="text-sm text-muted">{store.whatsappDisplay} · respuesta más rápida</span></span>
          </a>
          <a href={instagramLink} target="_blank" rel="noopener" className="card flex items-center gap-4 p-5 hover:ring-1 hover:ring-gold">
            <span className="rounded-full bg-ink p-3 text-gold-light"><IconInstagram /></span>
            <span><b className="block">Instagram</b><span className="text-sm text-muted">@{store.instagram}</span></span>
          </a>
          <div className="card p-5 text-sm text-muted">
            <b className="block text-ink">Horario de atención</b>
            Lunes a sábado, 8:00 a. m. – 7:00 p. m.
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
