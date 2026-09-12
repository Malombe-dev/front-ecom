"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import StarRating from "./StarRating";

export default function ProductActions({ product }) {
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [myRating, setMyRating] = useState(0);
  const [comment, setComment] = useState("");

  function requireLogin() {
    router.push(`/login?next=/products/${product.slug}`);
  }

  async function addToCart() {
    if (!user) return requireLogin();
    try {
      await apiFetch("/cart", { method: "POST", auth: true, body: { productId: product._id, quantity: qty } });
      setMessage("Added to cart");
      refreshCart();
    } catch (e) {
      setMessage(e.message);
    }
  }

  async function toggleWishlist() {
    if (!user) return requireLogin();
    try {
      const res = await apiFetch("/wishlist/toggle", { method: "POST", auth: true, body: { productId: product._id } });
      setMessage(res.added ? "Added to wishlist" : "Removed from wishlist");
    } catch (e) {
      setMessage(e.message);
    }
  }

  async function submitRating(e) {
    e.preventDefault();
    if (!user) return requireLogin();
    try {
      await apiFetch(`/products/${product._id}/ratings`, {
        method: "POST",
        auth: true,
        body: { value: myRating, comment },
      });
      setMessage("Thanks for your rating!");
    } catch (e) {
      setMessage(e.message);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <label htmlFor="qty" className="text-sm text-ink-500">Qty</label>
        <input
          id="qty"
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
          className="w-16 rounded-card border border-ink-300/50 px-2 py-1"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={addToCart}
          className="rounded-card bg-brand-900 px-5 py-2.5 font-semibold text-white hover:bg-brand-600"
        >
          Add to cart
        </button>
        <button
          onClick={toggleWishlist}
          className="rounded-card border border-brand-900 px-5 py-2.5 font-semibold text-brand-900 hover:bg-brand-100"
        >
          ♥ Wishlist
        </button>
      </div>

      {message && <p className="text-sm text-success-600">{message}</p>}

      <form onSubmit={submitRating} className="mt-4 rounded-card border border-ink-300/30 p-4">
        <h3 className="mb-2 font-heading font-semibold text-ink-900">Rate this product</h3>
        <div className="mb-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setMyRating(n)}
              className={n <= myRating ? "text-accent-500" : "text-ink-300"}
              aria-label={`${n} star`}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional comment"
          className="mb-2 w-full rounded-card border border-ink-300/50 p-2 text-sm"
          rows={2}
        />
        <button
          type="submit"
          disabled={!myRating}
          className="rounded-card bg-accent-500 px-4 py-2 text-sm font-semibold text-brand-900 hover:bg-accent-600 disabled:opacity-50"
        >
          Submit rating
        </button>
      </form>
    </div>
  );
}
