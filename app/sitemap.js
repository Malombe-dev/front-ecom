import { serverFetch } from "@/lib/api";

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const data = await serverFetch("/products?limit=1000");
  const products = data?.products || [];

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
