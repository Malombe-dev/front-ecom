"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { user, loading } = useAuth();
  const { refreshCart } = useCart();
  const [cart, setCart] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) apiFetch("/cart", { auth: true }).then(setCart).catch(() => {});
  }, [user]);

  async function updateQty(productId, quantity) {
    setBusy(true);
    const updated = await apiFetch(`/cart/${productId}`, { method: "PATCH", auth: true, body: { quantity } });
    setCart(updated);
    setBusy(false);
    refreshCart();
  }

  async function remove(productId) {
    setBusy(true);
    const updated = await apiFetch(`/cart/${productId}`, { method: "DELETE", auth: true });
    setCart(updated);
    setBusy(false);
    refreshCart();
  }

  const total = cart.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

  if (loading) return null;
  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="mb-4 text-ink-900">Log in to see your cart.</p>
        <Link href="/login?next=/cart" className="rounded-card bg-brand-900 px-5 py-2.5 font-semibold text-white">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 font-heading text-2xl font-bold text-ink-900">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-ink-500">Your cart is empty. <Link href="/" className="text-brand-600 underline">Go shopping</Link></p>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {cart.map((item) => (
              <div key={item.product._id} className="flex items-center gap-4 rounded-card border border-ink-300/30 p-3">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-card bg-brand-100">
                  <Image src={item.product.images?.[0]} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-ink-900">{item.product.name}</p>
                  <p className="text-sm text-ink-500">KSh {item.product.price.toLocaleString()}</p>
                </div>
                <input
                  type="number" min={1} value={item.quantity} disabled={busy}
                  onChange={(e) => updateQty(item.product._id, Number(e.target.value))}
                  className="w-16 rounded-card border border-ink-300/50 px-2 py-1"
                />
                <button onClick={() => remove(item.product._id)} className="text-sm text-danger-600 hover:underline">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-ink-300/30 pt-4">
            <p className="font-heading text-lg font-bold text-ink-900">Total: KSh {total.toLocaleString()}</p>
            <Link href="/checkout" className="rounded-card bg-accent-500 px-6 py-2.5 font-semibold text-brand-900 hover:bg-accent-600">
              Proceed to checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
