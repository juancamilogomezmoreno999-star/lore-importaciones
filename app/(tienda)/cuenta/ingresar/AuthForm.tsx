"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LEGAL_VERSION } from "@/lib/config";
import { recordSignupConsent } from "../actions";
import { FieldError } from "@/components/FieldError";

const errors: Record<string, string> = {
  "Invalid login credentials": "Correo o contraseña incorrectos.",
  "User already registered": "Ya existe una cuenta con ese correo. Ingresa con tu contraseña.",
  "Email not confirmed": "Tu correo aún no está confirmado. Revisa tu bandeja de entrada.",
  "Signups not allowed for this instance": "Por ahora no es posible crear cuentas. Escríbenos por WhatsApp.",
};
const translate = (m: string) =>
  errors[m] ?? (m.toLowerCase().includes("password") ? "La contraseña debe tener mínimo 8 caracteres." : "No pudimos completar la solicitud. Intenta de nuevo.");

export function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next")?.startsWith("/") ? params.get("next")! : "/cuenta";
  const [mode, setMode] = useState<"ingresar" | "registro">(params.get("modo") === "registro" ? "registro" : "ingresar");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [pending, setPending] = useState(false);
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

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim().toLowerCase();
    const password = String(f.get("password") ?? "");
    const found: Record<string, string> = {};
    if (mode === "registro" && String(f.get("name") ?? "").trim().length < 3) found.name = "Escribe tu nombre completo.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) found.email = "Escribe un correo válido (ej: nombre@gmail.com).";
    if (!password) found.password = "Escribe tu contraseña.";
    else if (mode === "registro" && password.length < 8) found.password = "La contraseña debe tener mínimo 8 caracteres.";
    if (mode === "registro" && f.get("accept_terms") !== "on") found.accept_terms = "Debes aceptar los términos y condiciones para crear tu cuenta.";
    if (mode === "registro" && f.get("accept_privacy") !== "on") found.accept_privacy = "Debes autorizar el tratamiento de tus datos para crear tu cuenta.";
    setErrors(found);
    if (Object.keys(found).length) return focusFirst(found);
    if (!isSupabaseConfigured) return setError("Las cuentas no están disponibles en modo demostración.");
    setError("");
    setInfo("");
    setPending(true);
    const supabase = createBrowserSupabase();
    if (mode === "ingresar") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setPending(false);
      if (error) return setError(translate(error.message));
    } else {
      if (password.length < 8) {
        setPending(false);
        return setError("La contraseña debe tener mínimo 8 caracteres.");
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: String(f.get("name") ?? "").trim(),
            // Prueba de la aceptación guardada también en la cuenta
            terms_accepted_at: new Date().toISOString(),
            privacy_accepted_at: new Date().toISOString(),
            legal_version: LEGAL_VERSION,
          },
          emailRedirectTo: `${location.origin}/auth/callback?next=/cuenta` },
      });
      setPending(false);
      if (error) return setError(translate(error.message));
      await recordSignupConsent();
      if (!data.session) return setInfo("¡Listo! Te enviamos un correo para confirmar tu cuenta. Ábrelo y vuelve a ingresar.");
    }
    router.replace(next);
    router.refresh();
  };

  return (
    <div className="card mx-auto w-full max-w-md p-6">
      <div className="mb-6 grid grid-cols-2 rounded-full bg-sand/70 p-1 text-sm font-semibold">
        {(["ingresar", "registro"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setError(""); setInfo(""); setErrors({}); }}
            className={`rounded-full py-2.5 transition ${mode === m ? "bg-ink text-gold-light" : "text-ink/70"}`}
          >
            {m === "ingresar" ? "Ingresar" : "Crear cuenta"}
          </button>
        ))}
      </div>
      <form onSubmit={submit} onChange={clearOnChange} noValidate className="space-y-4">
        {mode === "registro" && (
          <div>
            <label className="label" htmlFor="name">Nombre completo</label>
            <input id="name" {...aria("name")} name="name" autoComplete="name" className={`input ${errors.name ? "!border-danger focus:!ring-danger/20" : ""}`} />
        <FieldError id="name" msg={errors.name} />
          </div>
        )}
        <div>
          <label className="label" htmlFor="email">Correo</label>
          <input id="email" {...aria("email")} name="email" type="email" autoComplete="email" className={`input ${errors.email ? "!border-danger focus:!ring-danger/20" : ""}`} />
        <FieldError id="email" msg={errors.email} />
        </div>
        <div>
          <label className="label" htmlFor="password">Contraseña</label>
          <input id="password" {...aria("password")} name="password" type="password" minLength={mode === "registro" ? 8 : undefined} autoComplete={mode === "registro" ? "new-password" : "current-password"} className={`input ${errors.password ? "!border-danger focus:!ring-danger/20" : ""}`} />
        <FieldError id="password" msg={errors.password} />
          {mode === "registro" && <p className="mt-1 text-xs text-muted">Mínimo 8 caracteres.</p>}
        </div>
        {mode === "registro" && (
          <div className="space-y-2 text-xs leading-relaxed text-ink/70">
            <label className="flex gap-2">
              <input type="checkbox" name="accept_terms" {...aria("accept_terms")} className={`mt-0.5 h-4 w-4 shrink-0 accent-ink ${errors.accept_terms ? "outline outline-2 outline-offset-1 outline-danger" : ""}`} />
              <span>He leído y acepto los <Link href="/terminos" target="_blank" className="underline">términos y condiciones</Link>.</span>
            </label>
            <FieldError id="accept_terms" msg={errors.accept_terms} />
            <label className="flex gap-2">
              <input type="checkbox" name="accept_privacy" {...aria("accept_privacy")} className={`mt-0.5 h-4 w-4 shrink-0 accent-ink ${errors.accept_privacy ? "outline outline-2 outline-offset-1 outline-danger" : ""}`} />
              <span>Autorizo el tratamiento de mis datos personales según la <Link href="/privacidad" target="_blank" className="underline">política de tratamiento de datos personales</Link> (Ley 1581 de 2012).</span>
            </label>
            <FieldError id="accept_privacy" msg={errors.accept_privacy} />
          </div>
        )}
        {error && <p role="alert" className="rounded-lg bg-danger/10 p-3 text-sm text-danger">{error}</p>}
        {info && <p role="status" className="rounded-lg bg-success/10 p-3 text-sm text-success">{info}</p>}
        <button disabled={pending} className="btn-primary w-full">
          {pending ? "Un momento…" : mode === "ingresar" ? "Ingresar" : "Crear mi cuenta"}
        </button>
        {mode === "ingresar" && (
          <p className="text-center text-sm"><Link href="/cuenta/recuperar" className="text-gold-dark underline">¿Olvidaste tu contraseña?</Link></p>
        )}
      </form>
    </div>
  );
}
