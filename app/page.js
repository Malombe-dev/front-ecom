import { serverFetch } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import CategoryNav from "@/components/CategoryNav";

export const metadata = {
  title: "Shop everything you need",
  description: "Browse quality products by category — electronics, fashion, home, and more. Fast delivery to your nearest landmark.",
};

export default async function HomePage({ searchParams }) {
  const category = searchParams?.category;
  const query = category ? `?category=${category}` : "";
  const data = await serverFetch(`/products${query}`);
  const products = data?.products || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-8 rounded-card bg-brand-900 px-6 py-10 text-white md:px-10 md:py-14">
        <h1 className="max-w-xl font-heading text-3xl font-bold md:text-4xl">
          Everything you need, delivered near you
        </h1>
        <p className="mt-3 max-w-md text-white/80">
          Shop by category, save favorites, and track every order from checkout to delivery.
        </p>
      </section>

      <div className="mb-6">
        <CategoryNav active={category} />
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-ink-500">No products found in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
