"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export default function NewPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    if (password.length < 8) return setError("Mínimo 8 caracteres.");
    setPending(true);
    const { error } = await createBrowserSupabase().auth.updateUser({ password });
    setPending(false);
    if (error) return setError("El enlace venció o ya se usó. Pide uno nuevo en “¿Olvidaste tu contraseña?”.");
    router.replace("/cuenta");
    router.refresh();
  };
  return (
    <div className="container-x py-10">
      <form onSubmit={submit} className="card mx-auto max-w-md space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Crea tu nueva contraseña</h1>
        <div>
          <label className="label" htmlFor="password">Nueva contraseña</label>
          <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className="input" />
        </div>
        {error && <p role="alert" className="rounded-lg bg-danger/10 p-3 text-sm text-danger">{error}</p>}
        <button disabled={pending} className="btn-primary w-full">{pending ? "Guardando…" : "Guardar contraseña"}</button>
      </form>
    </div>
  );
}
