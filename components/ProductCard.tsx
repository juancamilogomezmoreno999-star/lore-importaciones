import Link from "next/link";
import type { Product } from "@/lib/types";
import { discountPercent, formatCOP } from "@/lib/format";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const off = discountPercent(product.price, product.compare_at_price);
  const img = product.images[0];
  return (
    <Link href={`/producto/${product.slug}`} className="group card flex flex-col overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-sand">
        {img ? (
          <ProductImage
            src={img}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">Sin foto</div>
        )}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {off > 0 && <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-gold-light">-{off}%</span>}
          {product.stock <= 0 && <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold">Agotado</span>}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-gold-dark">{product.category}</p>
        <h3 className="mt-1 line-clamp-2 font-sans text-sm font-medium leading-snug sm:text-[15px]">{product.name}</h3>
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-2">
          <span className="text-base font-bold sm:text-lg">{formatCOP(product.price)}</span>
          {off > 0 && <span className="text-xs text-muted line-through">{formatCOP(product.compare_at_price!)}</span>}
        </div>
      </div>
    </Link>
  );
}
