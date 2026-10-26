"use client";
import Link from "next/link";
import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { whatsappLink } from "@/lib/config";

export default function RecoverPage() {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim().toLowerCase();
    await createBrowserSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/cuenta/nueva-clave`,
    });
    setPending(false);
    setSent(true); // Por seguridad no decimos si el correo existe o no
  };
  return (
    <div className="container-x py-10">
      <div className="card mx-auto max-w-md p-6">
        <h1 className="text-2xl font-semibold">Recuperar contraseña</h1>
        {sent ? (
          <div className="mt-4 space-y-3 text-sm">
            <p>Si hay una cuenta con ese correo, te enviamos un enlace para crear una contraseña nueva. Revisa también la carpeta de spam.</p>
            <p className="text-muted">¿No te llegó? <a href={whatsappLink("¡Hola! No puedo entrar a mi cuenta de la tienda, ¿me ayudas?")} target="_blank" rel="noopener" className="underline">Escríbenos por WhatsApp</a>.</p>
            <Link href="/cuenta/ingresar" className="btn-outline w-full">Volver a ingresar</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-4 space-y-4">
            <p className="text-sm text-muted">Escribe el correo de tu cuenta y te enviaremos un enlace.</p>
            <div>
              <label className="label" htmlFor="email">Correo</label>
              <input id="email" name="email" type="email" required autoComplete="email" className="input" />
            </div>
            <button disabled={pending} className="btn-primary w-full">{pending ? "Enviando…" : "Enviar enlace"}</button>
          </form>
        )}
      </div>
    </div>
  );
}
