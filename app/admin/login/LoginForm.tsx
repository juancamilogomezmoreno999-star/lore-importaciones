"use client";
import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm({ initialError }: { initialError?: string }) {
  const [error, action, pending] = useActionState(login, initialError ?? null);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="email">Correo</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
      </div>
      {error && <p role="alert" className="rounded-lg bg-danger/10 p-3 text-sm text-danger">{error}</p>}
      <button disabled={pending} className="btn-primary w-full">{pending ? "Entrando…" : "Entrar"}</button>
    </form>
  );
}
