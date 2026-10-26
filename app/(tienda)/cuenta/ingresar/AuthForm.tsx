"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/env";

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

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSupabaseConfigured) return setError("Las cuentas no están disponibles en modo demostración.");
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim().toLowerCase();
    const password = String(f.get("password") ?? "");
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
        options: { data: { full_name: String(f.get("name") ?? "").trim() }, emailRedirectTo: `${location.origin}/auth/callback?next=/cuenta` },
      });
      setPending(false);
      if (error) return setError(translate(error.message));
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
            onClick={() => { setMode(m); setError(""); setInfo(""); }}
            className={`rounded-full py-2.5 transition ${mode === m ? "bg-ink text-gold-light" : "text-ink/70"}`}
          >
            {m === "ingresar" ? "Ingresar" : "Crear cuenta"}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="space-y-4">
        {mode === "registro" && (
          <div>
            <label className="label" htmlFor="name">Nombre completo</label>
            <input id="name" name="name" required autoComplete="name" className="input" />
          </div>
        )}
        <div>
          <label className="label" htmlFor="email">Correo</label>
          <input id="email" name="email" type="email" required autoComplete="email" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" required minLength={mode === "registro" ? 8 : undefined} autoComplete={mode === "registro" ? "new-password" : "current-password"} className="input" />
          {mode === "registro" && <p className="mt-1 text-xs text-muted">Mínimo 8 caracteres.</p>}
        </div>
        {mode === "registro" && (
          <label className="flex gap-2 text-xs leading-relaxed text-ink/70">
            <input type="checkbox" required className="mt-0.5 accent-ink" />
            <span>Acepto los <Link href="/terminos" target="_blank" className="underline">términos y condiciones</Link> y autorizo el tratamiento de mis datos según la <Link href="/privacidad" target="_blank" className="underline">política de privacidad</Link> (Ley 1581 de 2012).</span>
          </label>
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
