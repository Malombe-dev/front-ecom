"use client";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  const router = useRouter();

  async function handleCreate(body) {
    await apiFetch("/admin/products", { method: "POST", auth: true, body });
    router.push("/admin/products");
  }

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-ink-900">Add product</h1>
      <ProductForm onSubmit={handleCreate} submitLabel="Publish product" />
    </div>
  );
}
