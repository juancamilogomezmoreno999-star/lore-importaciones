"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { FieldError } from "@/components/FieldError";
import { sendContact, type ContactState } from "./actions";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const aria = (name: string) => (errors[name] ? { "aria-invalid": true, "aria-describedby": `${name}-error` } : {});
  const clearOnChange = (e: React.FormEvent<HTMLFormElement>) => {
    const n = (e.target as unknown as HTMLInputElement).name;
    if (errors[n]) setErrors(({ [n]: _, ...rest }) => rest);
  };
  const focusFirst = (found: Record<string, string>) => {
    const first = Object.keys(found)[0];
    const el = first ? (document.getElementsByName(first)[0] as HTMLElement | undefined) : undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus({ preventScroll: true });
  };

  const validate = (e: React.FormEvent<HTMLFormElement>) => {
    const f = new FormData(e.currentTarget);
    const found: Record<string, string> = {};
    if (String(f.get("name") ?? "").trim().length < 2) found.name = "Escribe tu nombre.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(f.get("email") ?? "").trim())) found.email = "Escribe un correo válido (ej: nombre@gmail.com).";
    if (String(f.get("message") ?? "").trim().length < 10) found.message = "Cuéntanos un poco más (mínimo 10 caracteres).";
    if (f.get("consent") !== "on") found.consent = "Debes autorizar el tratamiento de tus datos para enviar el mensaje.";
    setErrors(found);
    if (Object.keys(found).length) {
      e.preventDefault();
      focusFirst(found);
    }
  };

  if (state?.ok) return <div className="card p-8 text-center text-lg font-medium">{state.message}</div>;
  return (
    <form action={action} onSubmit={validate} onChange={clearOnChange} noValidate className="card space-y-4 p-5 sm:p-6">
      <div>
        <label className="label" htmlFor="name">Nombre</label>
        <input id="name" {...aria("name")} name="name" autoComplete="name" className={`input ${errors.name ? "!border-danger focus:!ring-danger/20" : ""}`} />
        <FieldError id="name" msg={errors.name} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="email">Correo</label>
          <input id="email" {...aria("email")} name="email" type="email" autoComplete="email" className={`input ${errors.email ? "!border-danger focus:!ring-danger/20" : ""}`} />
          <FieldError id="email" msg={errors.email} />
        </div>
        <div>
          <label className="label" htmlFor="phone">Celular (opcional)</label>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className="input" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="message">Mensaje</label>
        <textarea id="message" {...aria("message")} name="message" rows={5} className={`input ${errors.message ? "!border-danger focus:!ring-danger/20" : ""}`} placeholder="¿Qué producto buscas o en qué te podemos ayudar?" />
        <FieldError id="message" msg={errors.message} />
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="flex gap-2 text-xs text-ink/70">
        <input type="checkbox" name="consent" {...aria("consent")} className={`mt-0.5 h-4 w-4 shrink-0 accent-ink ${errors.consent ? "outline outline-2 outline-offset-1 outline-danger" : ""}`} />
        <span>Autorizo el tratamiento de mis datos para responder mi solicitud, según la <Link href="/privacidad" className="underline">política de privacidad</Link>.</span>
      </label>
      <FieldError id="consent" msg={errors.consent} />
      {state && !state.ok && <p role="alert" className="text-sm font-medium text-danger">{state.message}</p>}
      <button disabled={pending} className="btn-primary w-full">{pending ? "Enviando…" : "Enviar mensaje"}</button>
    </form>
  );
}
