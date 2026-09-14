"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    apiFetch("/admin/dashboard", { auth: true }).then(setStats).catch(() => {});
  }, []);

  if (!stats) return <p className="text-ink-500">Loading...</p>;

  const cards = [
    { label: "Total orders", value: stats.totalOrders },
    { label: "Pending", value: stats.ordersByStatus.pending },
    { label: "Approved", value: stats.ordersByStatus.approved },
    { label: "Shipped", value: stats.ordersByStatus.shipped },
    { label: "Delivered", value: stats.ordersByStatus.delivered },
    { label: "Canceled", value: stats.ordersByStatus.canceled },
    { label: "Active products", value: stats.totalProducts },
    { label: "Customers", value: stats.totalCustomers },
  ];

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-ink-900">Dashboard</h1>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-card border border-ink-300/30 bg-white p-3 sm:p-4 shadow-xs">
            <p className="text-xs sm:text-sm text-ink-500 font-medium">{c.label}</p>
            <p className="mt-1 font-heading text-xl sm:text-2xl font-bold text-brand-900">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
