import Link from "next/link";
import { getFeaturedProducts, getCategories } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { HeroVideo } from "@/components/HeroVideo";
import { FlightRoute } from "@/components/FlightRoute";
import { IconBox, IconPlane, IconShield, IconStar, IconTruck, IconWhatsApp } from "@/components/icons";
import { store, testimonials, whatsappLink } from "@/lib/config";

export const revalidate = 60;

const steps = [
  { icon: IconBox, title: "1. Eliges y pagas", text: "Escoge tu producto en la web o escríbenos por WhatsApp si buscas algo especial. Pagas seguro con tarjeta, PSE o Nequi." },
  { icon: IconPlane, title: "2. Lo compramos en USA", text: "Lo compramos en Estados Unidos a través de canales de venta confiables y lo traemos a Colombia. Te contamos cada paso por correo." },
  { icon: IconTruck, title: "3. Te lo entregamos", text: "Lo recibes en la puerta de tu casa, en cualquier ciudad del país, con número de guía para hacerle seguimiento." },
];


export default async function HomePage() {
  const [featured, categories] = await Promise.all([getFeaturedProducts(8), getCategories()]);

  return (
    <>
      {/* Banner principal */}
      <section className="border-b border-line">
        <div className="container-x grid gap-10 py-10 md:grid-cols-[1.2fr_.8fr] md:items-center md:gap-12 md:py-16">
          <div className="min-w-0">
            <p className="eyebrow">Importamos de Estados Unidos 🇺🇸</p>
            <h1 className="mt-5 text-[2.5rem] sm:text-6xl lg:text-[4.5rem]">
              Te traemos lo mejor de USA, directo a la puerta de tu casa
            </h1>
            <FlightRoute id="ruta-banner" className="mt-2 max-w-xl sm:mt-4" />
            <p className="mt-3 text-lg text-ink/75">En todas las ciudades de Colombia 🇨🇴</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/catalogo" className="btn-primary">Ver catálogo</Link>
              <a href={whatsappLink("¡Hola! Quiero una asesoría personalizada 🙌")} target="_blank" rel="noopener" className="btn-outline">
                <IconWhatsApp width={20} /> Asesoría personalizada
              </a>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/75">
              <li className="flex items-center gap-2"><IconShield width={18} className="text-gold-dark" /> Productos 100% originales</li>
              <li className="flex items-center gap-2"><IconTruck width={18} className="text-gold-dark" /> Envíos a toda Colombia</li>
            </ul>
            {categories.length > 0 && (
              <div className="mt-9">
                <p className="mb-3 text-sm text-muted">Compra por categoría</p>
                <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
                  {categories.map((c) => (
                    <Link key={c} href={`/catalogo?categoria=${encodeURIComponent(c)}`} className="shrink-0 rounded-[3px] border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-ink">
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <HeroVideo src="/videos/presentacion.mp4" poster="/videos/presentacion.jpg" />
        </div>
      </section>

      {/* Destacados */}
      <section className="container-x mt-16">
        <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
          <h2 className="text-3xl sm:text-4xl">Productos destacados</h2>
          <Link href="/catalogo" className="shrink-0 text-sm font-semibold underline underline-offset-4 hover:text-gold-dark">Ver todo</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 2} />)}
        </div>
      </section>

      {/* Cómo funciona: la ruta de tu pedido */}
      <section className="container-x mt-20">
        <h2 className="text-3xl sm:text-4xl">¿Cómo funciona?</h2>
        <p className="mt-3 max-w-xl text-ink/75">Pedimos a USA → llega a Colombia → te lo entregamos. Tú solo esperas en casa.</p>
        <ol className="relative mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          <span aria-hidden className="route-dots absolute bottom-6 left-[19px] top-6 border-l-2 md:bottom-auto md:left-5 md:right-0 md:top-[19px] md:border-l-0 md:border-t-2" />
          {steps.map(({ icon: Icon, title, text }) => (
            <li key={title} className="relative pl-14 md:pl-0 md:pt-14">
              <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-gold bg-white text-gold-dark">
                <Icon width={20} height={20} />
              </span>
              <h3 className="font-sans text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 max-w-sm text-[15px] leading-relaxed text-ink/70">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Testimonios (solo si hay reales) */}
      {testimonials.length > 0 && (
      <section className="mt-20 bg-sand py-16">
        <div className="container-x">
          <h2 className="text-3xl sm:text-4xl">Lo que dicen de nosotros</h2>
          <div className="-mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:px-0">
            {testimonials.map((t) => (
              <figure key={t.name} className="w-[85%] shrink-0 snap-center border-t-2 border-gold pt-5 md:w-auto">
                <div className="flex gap-0.5 text-gold">{Array.from({ length: 5 }).map((_, i) => <IconStar key={i} width={18} />)}</div>
                <blockquote className="mt-4 text-[15px] leading-relaxed text-ink/80">“{t.text}”</blockquote>
                <figcaption className="mt-4 text-sm font-semibold">{t.name} <span className="font-normal text-muted">· {t.city}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Llamado a WhatsApp */}
      <section className="container-x mt-20">
        <div className="grid gap-6 rounded-md bg-sand px-6 py-10 sm:px-10 md:grid-cols-[1fr_auto] md:items-center md:gap-10">
          <div>
            <h2 className="text-3xl sm:text-4xl">¿Buscas algo que no ves aquí?</h2>
            <p className="mt-3 max-w-lg text-ink/75">Mándanos el enlace o la foto del producto y te cotizamos sin compromiso. Lo traemos de cualquier tienda de USA.</p>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <a href={whatsappLink("¡Hola! Quiero cotizar un producto de USA 🛍️")} target="_blank" rel="noopener" className="btn-whatsapp">
              <IconWhatsApp width={20} /> Cotizar por WhatsApp
            </a>
            <p className="text-sm text-muted">{store.whatsappDisplay}</p>
          </div>
        </div>
      </section>
    </>
  );
}
