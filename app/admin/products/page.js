"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [busyId, setBusyId] = useState(null);

  function load() {
    apiFetch("/admin/products", { auth: true }).then(setProducts).catch(() => {});
  }

  useEffect(load, []);

  async function toggleActive(product) {
    setBusyId(product._id);
    try {
      if (product.isActive) {
        await apiFetch(`/admin/products/${product._id}`, { method: "DELETE", auth: true });
      } else {
        await apiFetch(`/admin/products/${product._id}`, { method: "PUT", auth: true, body: { isActive: true } });
      }
      load();
    } finally {
      setBusyId(null);
    }
  }

  async function permanentDelete(product) {
    if (!confirm(`Permanently delete "${product.name}"? This can't be undone.`)) return;
    setBusyId(product._id);
    try {
      await apiFetch(`/admin/products/${product._id}/permanent`, { method: "DELETE", auth: true });
      load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-ink-900">Products</h1>
        <Link href="/admin/products/new" className="rounded-card bg-accent-500 px-4 py-2 text-sm font-semibold text-brand-900 hover:bg-accent-600">
          + Add product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-card border border-ink-300/30 bg-white shadow-xs">
        <table className="w-full min-w-[540px] text-left text-sm">
          <thead className="bg-brand-100 text-ink-900">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t border-ink-300/20">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.category?.name}</td>
                <td className="px-4 py-2">KSh {p.price.toLocaleString()}</td>
                <td className="px-4 py-2">{p.stock}</td>
                <td className="px-4 py-2">
                  <span className={p.isActive ? "text-success-600" : "text-danger-600"}>
                    {p.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link href={`/admin/products/${p._id}/edit`} className="text-brand-600 hover:underline">
                      Edit
                    </Link>
                    <button
                      onClick={() => toggleActive(p)}
                      disabled={busyId === p._id}
                      className="text-brand-600 hover:underline disabled:opacity-50"
                    >
                      {p.isActive ? "Hide" : "Restore"}
                    </button>
                    <button
                      onClick={() => permanentDelete(p)}
                      disabled={busyId === p._id}
                      className="text-danger-600 hover:underline disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-500">
                  No products yet. Use "+ Add product" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
