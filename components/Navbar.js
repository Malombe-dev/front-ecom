"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

function CartIcon(props) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="21" r="1.2" />
      <circle cx="18" cy="21" r="1.2" />
      <path d="M2.5 3h2.2l2.1 11.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 1.96-1.6L21 7.5H6.1" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function MenuIcon({ open }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
    </svg>
  );
}

function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const navLinks = (user) => [
  { href: "/", label: "Shop", show: true },
  { href: "/wishlist", label: "Wishlist", show: !!user },
  { href: "/account/orders", label: "My Orders", show: !!user },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const links = navLinks(user).filter((l) => l.show);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-900/95 backdrop-blur supports-[backdrop-filter]:bg-brand-900/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-card bg-accent-500 text-sm font-extrabold text-brand-900">S</span>
          Sokoni
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-white/80 transition-colors hover:text-accent-500">
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className="text-sm font-medium text-accent-500 transition-colors hover:text-accent-600">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-card text-white transition-colors hover:bg-white/10"
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent-500 px-1 text-[11px] font-bold leading-none text-brand-900">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative hidden md:block" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                className="flex items-center gap-2 rounded-card py-1 pl-1 pr-2 text-white hover:bg-white/10"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-brand-900">
                  {initials(user.name)}
                </span>
                <span className="max-w-[110px] truncate text-sm font-medium">{user.name}</span>
                <ChevronIcon open={menuOpen} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-card border border-ink-300/30 bg-white py-1 shadow-lg">
                  <div className="border-b border-ink-300/20 px-4 py-2">
                    <p className="truncate text-sm font-semibold text-ink-900">{user.name}</p>
                    <p className="truncate text-xs text-ink-500">{user.email}</p>
                  </div>
                  <Link href="/account/orders" className="block px-4 py-2 text-sm text-ink-900 hover:bg-brand-100" onClick={() => setMenuOpen(false)}>
                    My Orders
                  </Link>
                  <Link href="/wishlist" className="block px-4 py-2 text-sm text-ink-900 hover:bg-brand-100" onClick={() => setMenuOpen(false)}>
                    Wishlist
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="block px-4 py-2 text-sm text-brand-600 hover:bg-brand-100" onClick={() => setMenuOpen(false)}>
                      Admin dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { setMenuOpen(false); logout(); }}
                    className="block w-full px-4 py-2 text-left text-sm text-danger-600 hover:bg-brand-100"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-card bg-accent-500 px-4 py-2 text-sm font-semibold text-brand-900 hover:bg-accent-600 md:inline-block"
            >
              Log in
            </Link>
          )}

          <button
            className="text-white md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/10 bg-brand-900 px-4 py-3 md:hidden">
          {user && (
            <div className="mb-2 flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-brand-900">
                {initials(user.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                <p className="truncate text-xs text-white/60">{user.email}</p>
              </div>
            </div>
          )}
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="py-2 text-white/90" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className="py-2 text-accent-500" onClick={() => setOpen(false)}>
              Admin
            </Link>
          )}
          {user ? (
            <button onClick={() => { setOpen(false); logout(); }} className="py-2 text-left text-danger-600">
              Log out
            </button>
          ) : (
            <Link href="/login" className="mt-1 rounded-card bg-accent-500 px-4 py-2 text-center text-sm font-semibold text-brand-900" onClick={() => setOpen(false)}>
              Log in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
