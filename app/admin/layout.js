"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const links = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
      </svg>
    ),
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    ),
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
        <path d="M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
        <path d="m9 16 2 2 4-4" />
      </svg>
    ),
  },
  {
    href: "/admin/admins",
    label: "Admins",
    superOnly: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setSidebarOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

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

  const filteredLinks = links.filter((l) => !l.superOnly || user.role === "superadmin");
  const activeLink = links.find((l) =>
    l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 md:py-8">
      {/* Mobile Admin Bar with collapse toggle */}
      <div className="mb-4 flex items-center justify-between rounded-card border border-ink-300/30 bg-white px-4 py-3 shadow-xs md:hidden">
        <div className="flex items-center gap-2">
          <span className="rounded bg-brand-100 px-2 py-0.5 text-xs font-bold uppercase text-brand-900">
            {user.role}
          </span>
          <span className="font-heading text-sm font-bold text-ink-900">
            {activeLink?.label || "Admin Portal"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Toggle admin menu"
          aria-expanded={sidebarOpen}
          className="flex items-center gap-1.5 rounded-card border border-ink-300/40 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-900 hover:bg-brand-100 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {sidebarOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
          <span>{sidebarOpen ? "Close" : "Menu"}</span>
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-900/60 backdrop-blur-xs transition-opacity md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-Over Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80vw] flex-col justify-between bg-white p-5 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="mb-6 flex items-center justify-between border-b border-ink-300/20 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-card bg-accent-500 font-bold text-brand-900 text-sm">
                A
              </span>
              <div>
                <h2 className="font-heading text-base font-bold text-ink-900">Admin Portal</h2>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">{user.role}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-card p-1.5 text-ink-500 hover:bg-brand-100 hover:text-ink-900"
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-1.5">
            {filteredLinks.map((l) => {
              const isActive = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-card px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-900 text-white shadow-xs"
                      : "text-ink-900 hover:bg-brand-100 hover:text-brand-900"
                  }`}
                >
                  <span className={isActive ? "text-accent-500" : "text-ink-500"}>{l.icon}</span>
                  <span>{l.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-ink-300/20 pt-4">
          <Link
            href="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2 rounded-card px-3 py-2 text-xs font-semibold text-brand-600 hover:bg-brand-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span>Back to Store</span>
          </Link>
        </div>
      </div>

      {/* Main Layout (Desktop side-by-side, Mobile stacked) */}
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden w-52 shrink-0 md:block">
          <div className="sticky top-20 rounded-card border border-ink-300/30 bg-white p-4 shadow-xs">
            <div className="mb-4 border-b border-ink-300/20 pb-3">
              <p className="font-heading text-sm font-bold text-ink-900">Admin Portal</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">{user.role}</p>
            </div>
            <nav className="flex flex-col gap-1">
              {filteredLinks.map((l) => {
                const isActive = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`flex items-center gap-2.5 rounded-card px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-brand-900 text-white shadow-xs"
                        : "text-ink-900 hover:bg-brand-100 hover:text-brand-900"
                    }`}
                  >
                    <span className={isActive ? "text-accent-500" : "text-ink-500"}>{l.icon}</span>
                    <span>{l.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-6 border-t border-ink-300/20 pt-3">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:underline"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                <span>View Store</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Content Container with min-w-0 to prevent flex item overflow */}
        <main className="min-w-0 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
