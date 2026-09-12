"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

function VerifyForm() {
  const params = useSearchParams();
  const [userId, setUserId] = useState(params.get("userId") || "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await apiFetch("/auth/verify-email", { method: "POST", body: { userId, code } });
      login(data.token, data.user);
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  }

  async function resend() {
    try {
      await apiFetch("/auth/resend-code", { method: "POST", body: { userId } });
      setSent(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-2 font-heading text-2xl font-bold text-ink-900">Verify your email</h1>
      <p className="mb-6 text-sm text-ink-500">
        We sent a 6-digit code to {params.get("email") || "your email"}. Enter it below.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          required maxLength={6} placeholder="6-digit code" value={code}
          onChange={(e) => setCode(e.target.value)}
          className="rounded-card border border-ink-300/50 px-3 py-2 tracking-widest"
        />
        {error && <p className="text-sm text-danger-600">{error}</p>}
        <button className="rounded-card bg-brand-900 py-2.5 font-semibold text-white hover:bg-brand-600">
          Verify
        </button>
      </form>
      <button onClick={resend} className="mt-4 text-sm text-brand-600 hover:underline">
        Resend code
      </button>
      {sent && <p className="mt-1 text-sm text-success-600">New code sent!</p>}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}
