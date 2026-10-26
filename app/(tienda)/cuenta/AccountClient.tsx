"use client";
import { useRouter } from "next/navigation";
import { useActionState, useTransition } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { departamentos } from "@/lib/colombia";
import { deleteAccount, saveProfile } from "./actions";

export type Profile = { full_name: string | null; document: string | null; phone: string | null; department: string | null; city: string | null; address: string | null };

export function ProfileForm({ profile }: { profile: Profile }) {
  const [msg, action, pending] = useActionState(saveProfile, null);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="full_name">Nombre completo</label>
        <input id="full_name" name="full_name" defaultValue={profile.full_name ?? ""} autoComplete="name" className="input" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="document">Cédula</label>
          <input id="document" name="document" defaultValue={profile.document ?? ""} inputMode="numeric" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Celular</label>
          <input id="phone" name="phone" defaultValue={profile.phone ?? ""} type="tel" inputMode="tel" autoComplete="tel-national" className="input" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="department">Departamento</label>
          <select id="department" name="department" defaultValue={profile.department ?? ""} className="input">
            <option value="">Elige…</option>
            {departamentos.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="city">Ciudad o municipio</label>
          <input id="city" name="city" defaultValue={profile.city ?? ""} autoComplete="address-level2" className="input" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="address">Dirección</label>
        <input id="address" name="address" defaultValue={profile.address ?? ""} autoComplete="street-address" className="input" />
      </div>
      {msg && <p className={`text-sm font-medium ${msg.startsWith("✓") ? "text-success" : "text-danger"}`}>{msg}</p>}
      <button disabled={pending} className="btn-primary w-full sm:w-auto">{pending ? "Guardando…" : "Guardar mis datos"}</button>
    </form>
  );
}

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await createBrowserSupabase().auth.signOut();
        router.replace("/");
        router.refresh();
      }}
      className="btn-outline"
    >
      Cerrar sesión
    </button>
  );
}

export function DeleteAccountButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("¿Eliminar tu cuenta para siempre?\n\nSe borrarán tus datos guardados y tu carrito. Tus pedidos anteriores se conservan por obligaciones legales, pero ya no estarán ligados a una cuenta.")) {
          start(async () => {
            const ok = await deleteAccount();
            if (!ok) {
              alert("No pudimos eliminar tu cuenta. Escríbenos por WhatsApp y lo hacemos por ti.");
              return;
            }
            await createBrowserSupabase().auth.signOut({ scope: "local" });
            alert("Tu cuenta fue eliminada.");
            router.replace("/");
            router.refresh();
          });
        }
      }}
      className="text-sm text-danger underline disabled:opacity-50"
    >
      {pending ? "Eliminando…" : "Eliminar mi cuenta"}
    </button>
  );
}
