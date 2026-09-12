"use client";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleButton() {
  const divRef = useRef(null);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleCredential(response) {
    try {
      const data = await apiFetch("/auth/google", { method: "POST", body: { idToken: response.credential } });
      login(data.token, data.user);
      router.push(searchParams.get("next") || "/");
    } catch (e) {
      alert(e.message);
    }
  }

  useEffect(() => {
    window.handleGoogleCredential = handleCredential;
  }, []);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.google && divRef.current) {
            window.google.accounts.id.initialize({
              client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
              callback: (resp) => window.handleGoogleCredential(resp),
            });
            window.google.accounts.id.renderButton(divRef.current, {
              theme: "outline",
              size: "large",
              width: 320,
            });
          }
        }}
      />
      <div ref={divRef} />
    </>
  );
}
