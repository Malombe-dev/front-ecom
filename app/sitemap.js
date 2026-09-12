import { serverFetch } from "@/lib/api";

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let products = [];
  try {
    const data = await serverFetch("/products?limit=1000");
    products = data?.products || [];
  } catch {
    // Backend wasn't reachable at build time — ship a sitemap with just the
    // homepage rather than failing the whole build. Product URLs will show up
    // once this runs somewhere that can reach the API (e.g. after deploy, on
    // revalidation, or on the next build once NEXT_PUBLIC_API_URL is live).
  }

  const productUrls = products.map((p) => ({
    url: `${siteUrl}/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...productUrls,
  ];
}
