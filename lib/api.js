// Thin fetch wrapper for talking to the Express API (proxied through /api via next.config.js rewrites)

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function apiFetch(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

// Server-side fetch for SEO pages (product listing/detail) — talks straight to the backend, no browser needed.
export async function serverFetch(path) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const res = await fetch(`${base}/api${path}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}
