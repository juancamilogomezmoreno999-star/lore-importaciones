import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { store } from "@/lib/config";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(store.siteUrl),
  title: { default: `${store.name} | Productos originales de USA en Colombia`, template: `%s | ${store.name}` },
  description: store.description,
  keywords: ["importaciones", "productos de Estados Unidos", "compras en USA", "Colombia", "originales", "envío nacional"],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: store.name,
    title: `${store.name} | Productos originales de USA en Colombia`,
    description: store.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#0b0b0c", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
