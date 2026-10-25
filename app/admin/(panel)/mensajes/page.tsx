import { requireAdmin } from "@/lib/auth";
import type { ContactMessage } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { deleteMessage, markRead } from "./actions";

export const metadata = { title: "Mensajes" };

export default async function Messages() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(200);
  const messages = (data ?? []) as ContactMessage[];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Mensajes</h1>
      <ul className="space-y-2">
        {messages.map((m) => {
          const phone = m.phone?.replace(/\D/g, "").replace(/^57/, "");
          return (
            <li key={m.id} className={`card p-4 ${m.read ? "opacity-70" : "ring-1 ring-gold"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{!m.read && "🟡 "}{m.name}</p>
                  <p className="text-xs text-muted">{formatDate(m.created_at)}</p>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm">{m.message}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
                <a href={`mailto:${m.email}?subject=${encodeURIComponent("Respuesta de Lore Importaciones")}`} className="rounded-full bg-ink px-3 py-1.5 text-gold-light">Responder correo</a>
                {phone && <a href={`https://wa.me/57${phone}`} target="_blank" rel="noopener" className="rounded-full bg-[#25D366] px-3 py-1.5 text-white">WhatsApp</a>}
                <form action={markRead.bind(null, m.id, !m.read)}><button className="rounded-full border border-ink/15 px-3 py-1.5">{m.read ? "Marcar no leído" : "Marcar leído"}</button></form>
                <form action={deleteMessage.bind(null, m.id)}><button className="rounded-full border border-danger/30 px-3 py-1.5 text-danger">Borrar</button></form>
              </div>
              <p className="mt-2 text-xs text-muted">{m.email}{m.phone ? ` · ${m.phone}` : ""}</p>
            </li>
          );
        })}
      </ul>
      {messages.length === 0 && <p className="card p-8 text-center text-muted">No hay mensajes todavía.</p>}
    </div>
  );
}
