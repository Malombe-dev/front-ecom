"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const STATUSES = ["pending", "approved", "shipped", "delivered", "canceled"];

const STATUS_STYLES = {
  pending: "bg-accent-100 text-accent-600",
  approved: "bg-brand-100 text-brand-900",
  shipped: "bg-brand-100 text-brand-900",
  delivered: "bg-success-100 text-success-600",
  canceled: "bg-danger-100 text-danger-600",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");

  function load() {
    const q = filter ? `?status=${filter}` : "";
    apiFetch(`/admin/orders${q}`, { auth: true }).then(setOrders).catch(() => {});
  }
  useEffect(load, [filter]);

  async function updateStatus(id, status) {
    await apiFetch(`/admin/orders/${id}/status`, { method: "PATCH", auth: true, body: { status } });
    load();
  }

  return (
    <div>
      <h1 className="mb-4 font-heading text-2xl font-bold text-ink-900">Orders</h1>

      <div className="mb-4 flex gap-2">
        <button onClick={() => setFilter("")} className={`rounded-full px-3 py-1 text-xs font-semibold ${!filter ? "bg-brand-900 text-white" : "bg-brand-100 text-brand-900"}`}>
          All
        </button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${filter === s ? "bg-brand-900 text-white" : "bg-brand-100 text-brand-900"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {orders.map((o) => (
          <div key={o._id} className="rounded-card border border-ink-300/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-ink-900">Order #{o._id.slice(-6).toUpperCase()} — {o.user?.name}</p>
                <p className="text-sm text-ink-500">{o.user?.email} · {o.phone} · near {o.landmark}</p>
                <p className="text-sm text-ink-500">
                  {new Date(o.createdAt).toLocaleString()} · KSh {o.totalAmount.toLocaleString()}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[o.status]}`}>
                {o.status}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={o.status === s}
                  onClick={() => updateStatus(o._id, s)}
                  className="rounded-card border border-brand-900 px-3 py-1 text-xs font-semibold text-brand-900 capitalize hover:bg-brand-100 disabled:opacity-30"
                >
                  Mark {s}
                </button>
              ))}
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-ink-500">No orders match this filter.</p>}
      </div>
    </div>
  );
}
