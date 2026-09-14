"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

function VerifyForm() {
  const params = useSearchParams();
  const [userId, setUserId] = useState(params.get("userId") || "");
  const [email, setEmail] = useState(params.get("email") || "");
  const [isEditingEmail, setIsEditingEmail] = useState(!params.get("email"));
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSent(false);

    const cleanCode = code.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanCode) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    if (!userId && !cleanEmail) {
      setError("Please enter your email address");
      return;
    }

    setIsVerifying(true);
    try {
      const data = await apiFetch("/auth/verify-email", {
        method: "POST",
        body: {
          userId: userId || undefined,
          email: cleanEmail || undefined,
          code: cleanCode,
        },
      });
      login(data.token, data.user);
      router.push("/");
    } catch (err) {
      setError(err.message || "Failed to verify code");
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    if (isResending || countdown > 0) return;
    setError("");
    setSent(false);

    const cleanEmail = email.trim().toLowerCase();
    if (!userId && !cleanEmail) {
      setError("Please provide your email address to receive a new code");
      setIsEditingEmail(true);
      return;
    }

    setIsResending(true);
    try {
      const data = await apiFetch("/auth/resend-code", {
        method: "POST",
        body: {
          userId: userId || undefined,
          email: cleanEmail || undefined,
        },
      });
      if (data.userId && !userId) {
        setUserId(data.userId);
      }
      setSent(true);
      setCountdown(60);
    } catch (err) {
      setError(err.message || "Failed to resend code");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-2 font-heading text-2xl font-bold text-ink-900">Verify your email</h1>
      
      {email && !isEditingEmail ? (
        <div className="mb-6 text-sm text-ink-600">
          <p>
            We sent a 6-digit code to <strong className="text-ink-900">{email}</strong>.
          </p>
          <button
            type="button"
            onClick={() => setIsEditingEmail(true)}
            className="mt-1 text-xs text-brand-600 hover:underline"
          >
            Wrong email? Change it
          </button>
        </div>
      ) : (
        <p className="mb-4 text-sm text-ink-500">
          Enter your email and the 6-digit verification code sent to your inbox.
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {(!email || isEditingEmail) && (
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-700">Email Address</label>
            <input
              required
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-card border border-ink-300/50 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-700">Verification Code</label>
          <input
            required
            maxLength={6}
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.trim())}
            className="w-full rounded-card border border-ink-300/50 px-3 py-2 text-center text-lg font-bold tracking-widest focus:border-brand-600 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-danger-600">{error}</p>}
        {sent && (
          <p className="rounded bg-success-50 p-2 text-xs text-success-700 border border-success-200">
            A new verification code has been sent! Check your inbox (and spam folder).
          </p>
        )}

        <button
          type="submit"
          disabled={isVerifying}
          className="rounded-card bg-brand-900 py-2.5 font-semibold text-white hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <>
              <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Verifying...</span>
            </>
          ) : (
            "Verify email"
          )}
        </button>
      </form>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || countdown > 0}
          className="text-sm font-medium text-brand-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResending
            ? "Sending new code..."
            : countdown > 0
            ? `Resend code in ${countdown}s`
            : "Resend code"}
        </button>

        <Link href="/login" className="text-xs text-ink-500 hover:underline">
          Back to login
        </Link>
      </div>
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
