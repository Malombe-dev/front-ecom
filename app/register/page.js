"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import GoogleButton from "@/components/GoogleButton";

function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await apiFetch("/auth/register", { method: "POST", body: form });
      router.push(`/verify-email?userId=${data.userId}&email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 font-heading text-2xl font-bold text-ink-900">Create your account</h1>

      <div className="mb-6"><GoogleButton /></div>
      <div className="mb-6 flex items-center gap-3 text-xs text-ink-500">
        <div className="h-px flex-1 bg-ink-300/40" /> or <div className="h-px flex-1 bg-ink-300/40" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input required placeholder="Full name" value={form.name} onChange={update("name")}
          className="rounded-card border border-ink-300/50 px-3 py-2" />
        <input required type="email" placeholder="Email" value={form.email} onChange={update("email")}
          className="rounded-card border border-ink-300/50 px-3 py-2" />
        <input placeholder="Phone number" value={form.phone} onChange={update("phone")}
          className="rounded-card border border-ink-300/50 px-3 py-2" />
        <input required type="password" placeholder="Password" value={form.password} onChange={update("password")}
          className="rounded-card border border-ink-300/50 px-3 py-2" />
        {error && <p className="text-sm text-danger-600">{error}</p>}
        <button className="rounded-card bg-brand-900 py-2.5 font-semibold text-white hover:bg-brand-600">
          Create account
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account? <Link href="/login" className="text-brand-600 hover:underline">Log in</Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
