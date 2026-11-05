import type { Metadata, Viewport } from "next";
import { Archivo, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import { store } from "@/lib/config";

// Bodoni Moda: la letra de las revistas de moda, para títulos grandes.
// Archivo: grotesca de etiqueta de envío, con ancho variable (botones más anchos, etiquetas más angostas).
const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni", display: "swap", axes: ["opsz"] });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap", axes: ["wdth"] });

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

export const viewport: Viewport = { themeColor: "#000000", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${archivo.variable} ${bodoni.variable}`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
