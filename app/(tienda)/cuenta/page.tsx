import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Order } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSessionClient } from "@/lib/supabase/server";
import { formatCOP, formatDate, orderCode } from "@/lib/format";
import { statusLabels } from "@/lib/orders";
import { DeleteAccountButton, LogoutButton, ProfileForm, type Profile } from "./AccountClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mi cuenta", robots: { index: false, follow: false } };

export default async function AccountPage() {
  if (!isSupabaseConfigured) redirect("/cuenta/ingresar");
  const supabase = await createSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/cuenta/ingresar");

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from("customer_profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("orders").select("id, order_number, created_at, total, status").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
  ]);
  const name = (profile?.full_name || user.user_metadata?.full_name || "").split(" ")[0];
  const p: Profile = {
    full_name: profile?.full_name ?? user.user_metadata?.full_name ?? null,
    document: profile?.document ?? null,
    phone: profile?.phone ?? null,
    department: profile?.department ?? null,
    city: profile?.city ?? null,
    address: profile?.address ?? null,
  };

  return (
    <div className="container-x max-w-3xl space-y-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl sm:text-5xl">¡Hola{name ? `, ${name}` : ""}! 👋</h1>
          <p className="text-sm text-muted">{user.email}</p>
        </div>
        <LogoutButton />
      </div>

      <section className="card p-5">
        <h2 className="font-sans text-lg font-semibold">Mis pedidos</h2>
        {(orders as Pick<Order, "id" | "order_number" | "created_at" | "total" | "status">[] | null)?.length ? (
          <ul className="mt-3 divide-y divide-ink/5">
            {orders!.map((o) => (
              <li key={o.id}>
                <Link href={`/pedido/${o.id}`} className="flex items-center justify-between gap-3 py-3">
                  <span>
                    <b className="block text-sm">{orderCode(o.order_number)}</b>
                    <span className="text-xs text-muted">{formatDate(o.created_at)}</span>
                  </span>
                  <span className="text-right">
                    <span className="block text-sm font-semibold">{formatCOP(o.total)}</span>
                    <span className="text-xs text-gold-dark">{statusLabels[o.status as keyof typeof statusLabels]}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted">Aún no tienes pedidos con esta cuenta. <Link href="/catalogo" className="underline">Ver catálogo</Link></p>
        )}
      </section>

      <section className="card p-5">
        <h2 className="mb-4 font-sans text-lg font-semibold">Mis datos de envío</h2>
        <ProfileForm profile={p} />
      </section>

      <div className="text-center">
        <DeleteAccountButton />
      </div>
    </div>
  );
}
