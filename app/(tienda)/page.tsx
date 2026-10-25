import Link from "next/link";
import { getFeaturedProducts, getCategories } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { IconBox, IconPlane, IconShield, IconStar, IconTruck, IconWhatsApp, IconChevron } from "@/components/icons";
import { store, whatsappLink } from "@/lib/config";

export const revalidate = 60;

const steps = [
  { icon: IconBox, title: "1. Eliges y pagas", text: "Escoge tu producto en la web o escríbenos por WhatsApp si buscas algo especial. Pagas seguro con tarjeta, PSE o Nequi." },
  { icon: IconPlane, title: "2. Lo compramos en USA", text: "Lo pedimos en tiendas oficiales de Estados Unidos y lo traemos a Colombia. Te contamos cada paso por correo." },
  { icon: IconTruck, title: "3. Te lo entregamos", text: "Lo recibes en la puerta de tu casa, en cualquier ciudad del país, con número de guía para hacerle seguimiento." },
];

// ⚠️ TESTIMONIOS DE EJEMPLO: reemplázalos por opiniones reales de tus clientes (con su permiso)
// antes de publicar. Publicar reseñas inventadas es publicidad engañosa.
const testimonials = [
  { name: "Valentina R.", city: "Medellín", text: "Me llegaron los tenis en 10 días, originales y en su caja. Lore me estuvo contando todo por WhatsApp. ¡Súper recomendados!" },
  { name: "Andrés M.", city: "Bogotá", text: "Pedí unos audífonos que acá estaban carísimos. Ahorré bastante y la atención fue excelente de principio a fin." },
  { name: "Carolina P.", city: "Cali", text: "Ya es mi tercera compra. Siempre cumplen con los tiempos y todo llega perfecto. Mi perfume favorito ahora lo pido acá." },
];

export default async function HomePage() {
  const [featured, categories] = await Promise.all([getFeaturedProducts(8), getCategories()]);
  const hero = featured[0];

  return (
    <>
      {/* Banner principal */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(201,162,74,.28),transparent_55%)]" />
        <div className="container-x relative grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
          <div>
            <p className="eyebrow !text-gold-light">Importados de Estados Unidos 🇺🇸</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.1] sm:text-5xl md:text-6xl">
              Lo mejor de USA, <span className="text-gold-light italic">directo a tu puerta</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
              Productos 100% originales a mejor precio, con pago seguro y acompañamiento real de principio a fin.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/catalogo" className="btn-gold">Ver productos <IconChevron width={18} /></Link>
              <a href={whatsappLink("¡Hola! Quiero pedir un producto que no veo en la página 🙌")} target="_blank" rel="noopener" className="btn border border-white/25 text-white hover:bg-white/10">
                <IconWhatsApp width={20} /> Pide lo que buscas
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
              <span className="flex items-center gap-2"><IconShield width={18} className="text-gold-light" /> Pago 100% seguro</span>
              <span className="flex items-center gap-2"><IconTruck width={18} className="text-gold-light" /> Envíos a todo el país</span>
            </div>
          </div>
          {hero?.images[0] && (
            <Link href={`/producto/${hero.slug}`} className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl ring-1 ring-gold/30">
              <ProductImage src={hero.images[0]} alt={hero.name} fill priority sizes="(max-width: 768px) 90vw, 450px" className="object-cover" />
              <span className="absolute bottom-4 left-4 rounded-full bg-cream/95 px-4 py-2 text-sm font-semibold text-ink">{hero.name}</span>
            </Link>
          )}
        </div>
      </section>

      {/* Categorías */}
      {categories.length > 0 && (
        <section className="container-x mt-8">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
            {categories.map((c) => (
              <Link key={c} href={`/catalogo?categoria=${encodeURIComponent(c)}`} className="shrink-0 rounded-full border border-ink/10 bg-white px-5 py-2.5 text-sm font-medium hover:border-gold">
                {c}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Destacados */}
      <section className="container-x mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Lo más pedido</p>
            <h2 className="mt-2 text-3xl font-semibold">Productos destacados</h2>
          </div>
          <Link href="/catalogo" className="shrink-0 text-sm font-semibold text-gold-dark hover:underline">Ver todo →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 2} />)}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="container-x mt-20">
        <div className="text-center">
          <p className="eyebrow">Así de fácil</p>
          <h2 className="mt-2 text-3xl font-semibold">¿Cómo funciona?</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted">Pedimos a USA → llega a Colombia → te lo entregamos. Tú solo esperas en casa.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink text-gold-light"><Icon width={26} height={26} /></div>
              <h3 className="mt-4 font-sans text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonios */}
      <section className="mt-20 bg-sand/60 py-16">
        <div className="container-x">
          <div className="text-center">
            <p className="eyebrow">Clientes felices</p>
            <h2 className="mt-2 text-3xl font-semibold">Lo que dicen de nosotros</h2>
          </div>
          <div className="-mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:px-0">
            {testimonials.map((t) => (
              <figure key={t.name} className="card w-[85%] shrink-0 snap-center p-6 md:w-auto">
                <div className="flex gap-0.5 text-gold">{Array.from({ length: 5 }).map((_, i) => <IconStar key={i} width={18} />)}</div>
                <blockquote className="mt-4 text-[15px] leading-relaxed text-ink/80">“{t.text}”</blockquote>
                <figcaption className="mt-4 text-sm font-semibold">{t.name} <span className="font-normal text-muted">· {t.city}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Llamado a WhatsApp */}
      <section className="container-x mt-16">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-center text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,162,74,.3),transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl font-semibold">¿Buscas algo que no ves aquí?</h2>
            <p className="mx-auto mt-3 max-w-md text-white/75">Mándanos el enlace o la foto del producto y te cotizamos sin compromiso. Lo traemos de cualquier tienda de USA.</p>
            <a href={whatsappLink("¡Hola! Quiero cotizar un producto de USA 🛍️")} target="_blank" rel="noopener" className="btn-whatsapp mt-7">
              <IconWhatsApp width={20} /> Cotizar por WhatsApp
            </a>
            <p className="mt-3 text-sm text-white/50">{store.whatsappDisplay}</p>
          </div>
        </div>
      </section>
    </>
  );
}
