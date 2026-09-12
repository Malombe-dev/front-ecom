"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    apiFetch(`/admin/products/${id}`, { auth: true })
      .then(setProduct)
      .catch((e) => setLoadError(e.message));
  }, [id]);

  async function handleUpdate(body) {
    await apiFetch(`/admin/products/${id}`, { method: "PUT", auth: true, body });
    router.push("/admin/products");
  }

  if (loadError) {
    return (
      <div>
        <p className="text-sm text-danger-600">{loadError}</p>
        <Link href="/admin/products" className="mt-2 inline-block text-sm text-brand-600 hover:underline">
          Back to products
        </Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-ink-900">Edit product</h1>
      <ProductForm initialProduct={product} onSubmit={handleUpdate} submitLabel="Save changes" />
    </div>
  );
}
