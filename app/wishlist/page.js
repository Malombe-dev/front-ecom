"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (user) apiFetch("/wishlist", { auth: true }).then(setItems).catch(() => {});
  }, [user]);

  if (loading) return null;
  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="mb-4 text-ink-900">Log in to see your wishlist.</p>
        <Link href="/login?next=/wishlist" className="rounded-card bg-brand-900 px-5 py-2.5 font-semibold text-white">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 font-heading text-2xl font-bold text-ink-900">Your Wishlist</h1>
      {items.length === 0 ? (
        <p className="text-ink-500">Nothing here yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
