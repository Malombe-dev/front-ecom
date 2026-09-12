"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import GoogleButton from "@/components/GoogleButton";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await apiFetch("/auth/login", { method: "POST", body: { email, password } });
      login(data.token, data.user);
      router.push(searchParams.get("next") || "/");
    } catch (err) {
      if (err.message.includes("verify")) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        setError(err.message);
      }
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 font-heading text-2xl font-bold text-ink-900">Log in</h1>

      <div className="mb-6">
        <GoogleButton />
      </div>
      <div className="mb-6 flex items-center gap-3 text-xs text-ink-500">
        <div className="h-px flex-1 bg-ink-300/40" /> or <div className="h-px flex-1 bg-ink-300/40" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email" required placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-card border border-ink-300/50 px-3 py-2"
        />
        <input
          type="password" required placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-card border border-ink-300/50 px-3 py-2"
        />
        {error && <p className="text-sm text-danger-600">{error}</p>}
        <button className="rounded-card bg-brand-900 py-2.5 font-semibold text-white hover:bg-brand-600">
          Log in
        </button>
      </form>

      <div className="mt-4 flex justify-between text-sm">
        <Link href="/forgot-password" className="text-brand-600 hover:underline">Forgot password?</Link>
        <Link href="/register" className="text-brand-600 hover:underline">Create account</Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
