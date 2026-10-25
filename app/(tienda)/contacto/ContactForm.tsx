"use client";
import Link from "next/link";
import { useActionState } from "react";
import { sendContact, type ContactState } from "./actions";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, null);
  if (state?.ok) return <div className="card p-8 text-center text-lg font-medium">{state.message}</div>;
  return (
    <form action={action} className="card space-y-4 p-5 sm:p-6">
      <div>
        <label className="label" htmlFor="name">Nombre</label>
        <input id="name" name="name" required autoComplete="name" className="input" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="email">Correo</label>
          <input id="email" name="email" type="email" required autoComplete="email" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Celular (opcional)</label>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className="input" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="message">Mensaje</label>
        <textarea id="message" name="message" required rows={5} className="input" placeholder="¿Qué producto buscas o en qué te podemos ayudar?" />
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="flex gap-2 text-xs text-ink/70">
        <input type="checkbox" name="consent" required className="mt-0.5 accent-ink" />
        <span>Autorizo el tratamiento de mis datos para responder mi solicitud, según la <Link href="/privacidad" className="underline">política de privacidad</Link>.</span>
      </label>
      {state && !state.ok && <p role="alert" className="text-sm font-medium text-danger">{state.message}</p>}
      <button disabled={pending} className="btn-primary w-full">{pending ? "Enviando…" : "Enviar mensaje"}</button>
    </form>
  );
}
