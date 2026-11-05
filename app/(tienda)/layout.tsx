import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { CookieNotice } from "@/components/CookieNotice";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <a href="#contenido" className="sr-only z-50 rounded-[3px] bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">{children}</main>
      <CookieNotice />
      <Footer />
      <WhatsAppFloat />
    </CartProvider>
  );
}
