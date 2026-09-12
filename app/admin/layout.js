"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/admins", label: "Admins", superOnly: true },
];

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) return null;

  if (!user || !["admin", "superadmin"].includes(user.role)) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-ink-900">You don't have access to this page.</p>
        <Link href="/login" className="mt-4 inline-block rounded-card bg-brand-900 px-5 py-2.5 font-semibold text-white">
          Log in as admin
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8">
      <aside className="w-48 shrink-0">
        <nav className="flex flex-col gap-1">
          {links
            .filter((l) => !l.superOnly || user.role === "superadmin")
            .map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-card px-3 py-2 text-sm font-medium ${
                  pathname === l.href ? "bg-brand-900 text-white" : "text-ink-900 hover:bg-brand-100"
                }`}
              >
                {l.label}
              </Link>
            ))}
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
