"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

function ResetForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get("email") || "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await apiFetch("/auth/reset-password", { method: "POST", body: { email, code, newPassword } });
      router.push("/login");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 font-heading text-2xl font-bold text-ink-900">Reset your password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="rounded-card border border-ink-300/50 px-3 py-2" />
        <input required placeholder="Reset code" value={code} onChange={(e) => setCode(e.target.value)}
          className="rounded-card border border-ink-300/50 px-3 py-2" />
        <input required type="password" placeholder="New password" value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="rounded-card border border-ink-300/50 px-3 py-2" />
        {error && <p className="text-sm text-danger-600">{error}</p>}
        <button className="rounded-card bg-brand-900 py-2.5 font-semibold text-white hover:bg-brand-600">
          Reset password
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
