"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Inicio", icon: "🏠" },
  { href: "/admin/productos", label: "Productos", icon: "🛍️" },
  { href: "/admin/pedidos", label: "Pedidos", icon: "📦" },
  { href: "/admin/mensajes", label: "Mensajes", icon: "✉️" },
];

export function AdminNav({ unread }: { unread: number }) {
  const path = usePathname();
  const active = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));
  return (
    <>
      <nav className="hidden gap-1 md:flex">
        {items.map((i) => (
          <Link key={i.href} href={i.href} className={`rounded-full px-4 py-2 text-sm font-medium ${active(i.href) ? "bg-ink text-gold-light" : "hover:bg-ink/5"}`}>
            {i.label}{i.href === "/admin/mensajes" && unread > 0 ? ` (${unread})` : ""}
          </Link>
        ))}
      </nav>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-ink/10 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
        {items.map((i) => (
          <Link key={i.href} href={i.href} className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${active(i.href) ? "text-ink" : "text-ink/50"}`}>
            <span className="text-xl leading-none">{i.icon}</span>
            {i.label}
            {i.href === "/admin/mensajes" && unread > 0 && <span className="absolute right-[28%] top-1.5 h-2.5 w-2.5 rounded-full bg-danger" />}
          </Link>
        ))}
      </nav>
    </>
  );
}
