"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import GoogleButton from "@/components/GoogleButton";

function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const cleanEmail = form.email.trim().toLowerCase();

    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: { ...form, email: cleanEmail },
      });
      const userIdParam = data.userId ? `userId=${data.userId}&` : "";
      router.push(`/verify-email?${userIdParam}email=${encodeURIComponent(cleanEmail)}`);
    } catch (err) {
      if (err.data?.userId || err.message?.toLowerCase().includes("verify")) {
        const userIdParam = err.data?.userId ? `userId=${err.data.userId}&` : "";
        router.push(`/verify-email?${userIdParam}email=${encodeURIComponent(cleanEmail)}`);
        return;
      }
      setError(err.message || "Failed to create account");
      setLoading(false);
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
        <button
          type="submit"
          disabled={loading}
          className="rounded-card bg-brand-900 py-2.5 font-semibold text-white hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Creating account...</span>
            </>
          ) : (
            "Create account"
          )}
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
