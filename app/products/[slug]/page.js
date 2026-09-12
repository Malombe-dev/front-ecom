import Image from "next/image";
import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/api";
import StarRating from "@/components/StarRating";
import ProductActions from "@/components/ProductActions";

export async function generateMetadata({ params }) {
  const product = await serverFetch(`/products/${params.slug}`);
  if (!product) return { title: "Product not found" };

  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.description.slice(0, 155),
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.description.slice(0, 155),
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const product = await serverFetch(`/products/${params.slug}`);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "KES",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    aggregateRating: product.numRatings
      ? { "@type": "AggregateRating", ratingValue: product.avgRating, reviewCount: product.numRatings }
      : undefined,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Structured data helps this page appear as a rich result in search */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-card bg-brand-100">
          <Image src={product.images?.[0]} alt={product.name} fill sizes="50vw" className="object-cover" priority />
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide text-ink-500">{product.category?.name}</p>
          <h1 className="mt-1 font-heading text-2xl font-bold text-ink-900 md:text-3xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <StarRating value={product.avgRating} size="text-base" />
            <span className="text-sm text-ink-500">({product.numRatings} ratings)</span>
          </div>
          <p className="mt-4 font-heading text-3xl font-bold text-brand-900">
            KSh {product.price.toLocaleString()}
          </p>
          <p className="mt-4 text-ink-900/90">{product.description}</p>
          <p className="mt-2 text-sm text-ink-500">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          <div className="mt-6">
            <ProductActions product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
