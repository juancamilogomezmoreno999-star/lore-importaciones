import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/data";
import { discountPercent, formatCOP } from "@/lib/format";
import { ProductGallery } from "@/components/ProductGallery";
import { AddToCart } from "@/components/AddToCart";
import { ProductCard } from "@/components/ProductCard";
import { IconClock, IconShield, IconTruck } from "@/components/icons";
import { shipping, store } from "@/lib/config";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    return (await getProducts()).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return { title: "Producto no encontrado" };
  const description = `${product.description.split("\n")[0].slice(0, 150)} Precio: ${formatCOP(product.price)}. Envío a toda Colombia.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: { title: product.name, description, images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product);
  const off = discountPercent(product.price, product.compare_at_price);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => (i.startsWith("http") ? i : `${store.siteUrl}${i}`)),
    category: product.category,
    brand: { "@type": "Brand", name: store.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "COP",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${store.siteUrl}/producto/${product.slug}`,
    },
  };

  return (
    <div className="container-x py-4 sm:py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav className="mb-4 text-xs text-muted" aria-label="Ruta">
        <Link href="/" className="hover:underline">Inicio</Link> / <Link href="/catalogo" className="hover:underline">Catálogo</Link> /{" "}
        <Link href={`/catalogo?categoria=${encodeURIComponent(product.category)}`} className="hover:underline">{product.category}</Link>
      </nav>
      <div className="grid gap-6 md:grid-cols-2 md:gap-12">
        <ProductGallery images={product.images} name={product.name} />
        <div>
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold">{formatCOP(product.price)}</span>
            {off > 0 && (
              <>
                <span className="text-lg text-muted line-through">{formatCOP(product.compare_at_price!)}</span>
                <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-gold-light">Ahorras {off}%</span>
              </>
            )}
          </div>
          <p className={`mt-2 text-sm font-medium ${product.stock > 0 ? "text-success" : "text-danger"}`}>
            {product.stock > 5 ? "✓ Disponible" : product.stock > 0 ? `¡Solo quedan ${product.stock} unidades!` : "Agotado por ahora"}
          </p>

          <div className="mt-6"><AddToCart product={product} /></div>

          <ul className="mt-6 space-y-3 rounded-2xl bg-white p-5 text-sm">
            <li className="flex gap-3"><IconClock width={20} className="shrink-0 text-gold-dark" /><span><b>Tiempo de entrega:</b> {product.delivery_time}</span></li>
            <li className="flex gap-3"><IconTruck width={20} className="shrink-0 text-gold-dark" /><span><b>Envío a toda Colombia</b>{shipping.freeFrom > 0 ? ` · gratis en compras desde ${formatCOP(shipping.freeFrom)}` : ""}</span></li>
            <li className="flex gap-3"><IconShield width={20} className="shrink-0 text-gold-dark" /><span><b>Original y garantizado.</b> Pago seguro con tarjeta, PSE o Nequi.</span></li>
          </ul>

          <div className="mt-8">
            <h2 className="font-sans text-lg font-semibold">Descripción</h2>
            <div className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink/80">{product.description}</div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold">También te puede gustar</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
