"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const STATUS_STYLES = {
  pending: "bg-accent-100 text-accent-600",
  approved: "bg-brand-100 text-brand-900",
  shipped: "bg-brand-100 text-brand-900",
  delivered: "bg-success-100 text-success-600",
  canceled: "bg-danger-100 text-danger-600",
};

const TWO_HOURS = 2 * 60 * 60 * 1000;

export default function MyOrdersPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) apiFetch("/orders/mine", { auth: true }).then(setOrders).catch(() => {});
  }, [user]);

  async function cancelOrder(id) {
    setError("");
    try {
      await apiFetch(`/orders/${id}/cancel`, { method: "PATCH", auth: true });
      const updated = await apiFetch("/orders/mine", { auth: true });
      setOrders(updated);
    } catch (e) {
      setError(e.message);
    }
  }

  function canCancel(order) {
    if (!["pending", "approved"].includes(order.status)) return false;
    return Date.now() - new Date(order.createdAt).getTime() < TWO_HOURS;
  }

  if (loading) return null;
  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="mb-4 text-ink-900">Log in to see your orders.</p>
        <Link href="/login?next=/account/orders" className="rounded-card bg-brand-900 px-5 py-2.5 font-semibold text-white">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 font-heading text-2xl font-bold text-ink-900">My Orders</h1>
      {error && <p className="mb-4 text-sm text-danger-600">{error}</p>}
      {orders.length === 0 ? (
        <p className="text-ink-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((o) => (
            <div key={o._id} className="rounded-card border border-ink-300/30 p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-ink-900">Order #{o._id.slice(-6).toUpperCase()}</p>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[o.status]}`}>
                  {o.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-500">
                {new Date(o.createdAt).toLocaleString()} · {o.items.length} item(s) · KSh {o.totalAmount.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-ink-500">Delivery near: {o.landmark}</p>

              {canCancel(o) ? (
                <button
                  onClick={() => cancelOrder(o._id)}
                  className="mt-3 rounded-card border border-danger-600 px-4 py-1.5 text-sm font-semibold text-danger-600 hover:bg-danger-100"
                >
                  Cancel order (within 2 hrs)
                </button>
              ) : (
                ["pending", "approved"].includes(o.status) && (
                  <p className="mt-3 text-sm text-ink-500">
                    Cancellation window has passed. Need changes? Contact support.
                  </p>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
