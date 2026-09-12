import Link from "next/link";
import { serverFetch } from "@/lib/api";

export default async function CategoryNav({ active }) {
  const categories = await serverFetch("/categories");
  if (!categories?.length) return null;

  return (
    <div className="flex flex-wrap gap-2 border-b border-ink-300/30 pb-4">
      <Link
        href="/"
        className={`rounded-full px-4 py-1.5 text-sm font-medium ${
          !active ? "bg-brand-900 text-white" : "bg-brand-100 text-brand-900 hover:bg-brand-100/70"
        }`}
      >
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c._id}
          href={`/?category=${c.slug}`}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            active === c.slug ? "bg-brand-900 text-white" : "bg-brand-100 text-brand-900 hover:bg-brand-100/70"
          }`}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
