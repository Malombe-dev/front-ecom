import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sokoni — Shop everything you need",
    template: "%s | Sokoni",
  },
  description:
    "Browse and shop quality products by category, track your orders, and get fast delivery to your nearest landmark.",
  openGraph: {
    type: "website",
    siteName: "Sokoni",
    title: "Sokoni — Shop everything you need",
    description: "Browse and shop quality products by category with fast, reliable delivery.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Sokoni — Shop everything you need",
    description: "Browse and shop quality products by category with fast, reliable delivery.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
