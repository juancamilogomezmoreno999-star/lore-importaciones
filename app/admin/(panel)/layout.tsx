import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { logout } from "../login/actions";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { supabase, user } = await requireAdmin();
  const { count } = await supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("read", false);
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
          <Link href="/admin" className="font-display text-lg font-bold tracking-[.2em]">LORE <span className="font-sans text-xs font-medium tracking-normal text-gold-dark">panel</span></Link>
          <AdminNav unread={count ?? 0} />
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="hidden text-sm text-muted hover:underline sm:block">Ver tienda ↗</Link>
            <form action={logout}><button className="text-sm font-medium text-muted hover:text-danger" title={user.email}>Salir</button></form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 md:pb-12">{children}</main>
    </>
  );
}
