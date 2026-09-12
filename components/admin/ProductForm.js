"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import ImageUploader from "@/components/ImageUploader";

const emptyForm = {
  name: "", description: "", price: "", compareAtPrice: "",
  category: "", stock: "", sku: "", seoTitle: "", seoDescription: "",
};

export default function ProductForm({ initialProduct, onSubmit, submitLabel }) {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState(initialProduct?.images || []);
  const [form, setForm] = useState(() =>
    initialProduct
      ? {
          name: initialProduct.name || "",
          description: initialProduct.description || "",
          price: initialProduct.price ?? "",
          compareAtPrice: initialProduct.compareAtPrice ?? "",
          category: initialProduct.category?._id || initialProduct.category || "",
          stock: initialProduct.stock ?? "",
          sku: initialProduct.sku || "",
          seoTitle: initialProduct.seoTitle || "",
          seoDescription: initialProduct.seoDescription || "",
        }
      : emptyForm
  );
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function loadCategories() {
    apiFetch("/categories").then(setCategories).catch(() => {});
  }
  useEffect(loadCategories, []);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function addCategory() {
    if (!newCategory.trim()) return;
    await apiFetch("/admin/categories", { method: "POST", auth: true, body: { name: newCategory } });
    setNewCategory("");
    loadCategories();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (images.length === 0) {
      setError("Please upload at least one product image");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        stock: Number(form.stock) || 0,
        images,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6 rounded-card border border-ink-300/30 p-4">
        <p className="mb-2 text-sm font-medium text-ink-900">Quick-add a category</p>
        <div className="flex gap-2">
          <input
            value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="e.g. Electronics"
            className="flex-1 rounded-card border border-ink-300/50 px-3 py-1.5 text-sm"
          />
          <button onClick={addCategory} type="button" className="rounded-card bg-brand-100 px-3 py-1.5 text-sm font-semibold text-brand-900">
            Add
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input required placeholder="Product name" value={form.name} onChange={update("name")}
          className="rounded-card border border-ink-300/50 px-3 py-2" />
        <textarea required placeholder="Description" rows={3} value={form.description} onChange={update("description")}
          className="rounded-card border border-ink-300/50 px-3 py-2" />

        <div className="flex gap-3">
          <input required type="number" placeholder="Price (KSh)" value={form.price} onChange={update("price")}
            className="flex-1 rounded-card border border-ink-300/50 px-3 py-2" />
          <input type="number" placeholder="Compare-at price (optional)" value={form.compareAtPrice} onChange={update("compareAtPrice")}
            className="flex-1 rounded-card border border-ink-300/50 px-3 py-2" />
        </div>

        <ImageUploader images={images} onChange={setImages} />

        <select required value={form.category} onChange={update("category")}
          className="rounded-card border border-ink-300/50 px-3 py-2">
          <option value="">Select category</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        <div className="flex gap-3">
          <input type="number" placeholder="Stock quantity" value={form.stock} onChange={update("stock")}
            className="flex-1 rounded-card border border-ink-300/50 px-3 py-2" />
          <input placeholder="SKU (optional)" value={form.sku} onChange={update("sku")}
            className="flex-1 rounded-card border border-ink-300/50 px-3 py-2" />
        </div>

        <details className="rounded-card border border-ink-300/30 p-3">
          <summary className="cursor-pointer text-sm font-medium text-ink-900">SEO settings (optional)</summary>
          <div className="mt-3 flex flex-col gap-2">
            <input placeholder="SEO title (defaults to product name)" value={form.seoTitle} onChange={update("seoTitle")}
              className="rounded-card border border-ink-300/50 px-3 py-2 text-sm" />
            <textarea placeholder="SEO description (defaults to first part of description)" rows={2}
              value={form.seoDescription} onChange={update("seoDescription")}
              className="rounded-card border border-ink-300/50 px-3 py-2 text-sm" />
          </div>
        </details>

        {error && <p className="text-sm text-danger-600">{error}</p>}

        <button disabled={saving} className="rounded-card bg-brand-900 py-2.5 font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
          {saving ? "Saving..." : submitLabel}
        </button>
      </form>
    </div>
  );
}
