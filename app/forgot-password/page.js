"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    await apiFetch("/auth/forgot-password", { method: "POST", body: { email } });
    setMessage("If that email exists, a reset code has been sent.");
    setTimeout(() => router.push(`/reset-password?email=${encodeURIComponent(email)}`), 1200);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 font-heading text-2xl font-bold text-ink-900">Forgot your password?</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          required type="email" placeholder="Your email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-card border border-ink-300/50 px-3 py-2"
        />
        <button className="rounded-card bg-brand-900 py-2.5 font-semibold text-white hover:bg-brand-600">
          Send reset code
        </button>
      </form>
      {message && <p className="mt-3 text-sm text-success-600">{message}</p>}
    </div>
  );
}
