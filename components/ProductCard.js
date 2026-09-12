import Link from "next/link";
import Image from "next/image";
import StarRating from "./StarRating";

export default function ProductCard({ product }) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-ink-300/30 bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-brand-100">
        <Image
          src={product.images?.[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition group-hover:scale-105"
        />
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-full bg-danger-600 px-2 py-0.5 text-xs font-semibold text-white">
            Sale
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-ink-900">{product.name}</h3>
        <StarRating value={product.avgRating} />
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-heading text-base font-bold text-brand-900">
            KSh {product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-ink-300 line-through">
              KSh {product.compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
