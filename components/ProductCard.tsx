import Link from "next/link";
import type { Product } from "@/lib/types";
import { discountPercent, formatCOP } from "@/lib/format";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const off = discountPercent(product.price, product.compare_at_price);
  const img = product.images[0];
  return (
    <Link href={`/producto/${product.slug}`} className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-sand">
        {img ? (
          <ProductImage
            src={img}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">Sin foto</div>
        )}
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {product.stock <= 0 && <span className="tag bg-white text-ink">Agotado</span>}
          {product.immediate_delivery && product.stock > 0 && <span className="tag bg-gold text-ink">⚡ Entrega inmediata</span>}
          {!product.immediate_delivery && product.stock > 0 && <span className="tag bg-white text-ink">✈️ Por encargo</span>}
          {off > 0 && <span className="tag bg-ink text-white">-{off}%</span>}
        </div>
      </div>
      <div className="flex flex-1 flex-col pt-3">
        <p className="text-xs text-muted">{product.category}</p>
        <h3 className="mt-0.5 line-clamp-2 font-sans text-[15px] font-medium leading-snug decoration-1 underline-offset-4 group-hover:underline">{product.name}</h3>
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-1.5 tabular-nums">
          <span className="text-base font-semibold sm:text-[17px]">{formatCOP(product.price)}</span>
          {off > 0 && <span className="text-xs text-muted line-through">{formatCOP(product.compare_at_price!)}</span>}
        </div>
      </div>
    </Link>
  );
}
