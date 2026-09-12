import Link from "next/link";

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 3a2 2 0 0 1-.4 2.1L8 10.2a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c1 .4 2 .6 3 .7a2 2 0 0 1 1.7 2.1z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.4c0-.9.3-1.6 1.7-1.6h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4v3.2h2.8V22h3.3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 2H22l-7.6 8.7L23 22h-7.1l-5.6-6.8L3.8 22H.7l8.1-9.3L1 2h7.3l5 6.2L18.9 2zm-1.2 18h1.7L6.4 3.9H4.6L17.7 20z" />
    </svg>
  );
}

const quickLinks = [
  { href: "/", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/account/orders", label: "My Orders" },
  { href: "/wishlist", label: "Wishlist" },
];

const legalLinks = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/contact", label: "Contact Us" },
];

const socials = [
  { href: "https://facebook.com", label: "Facebook", Icon: FacebookIcon },
  { href: "https://instagram.com", label: "Instagram", Icon: InstagramIcon },
  { href: "https://x.com", label: "X (Twitter)", Icon: XIcon },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink-300/30 bg-brand-900 text-white/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold text-white">
            <span className="flex h-7 w-7 items-center justify-center rounded-card bg-accent-500 text-xs font-extrabold text-brand-900">S</span>
            Sokoni
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
            Quality products by category, with fast, reliable delivery to your nearest landmark.
          </p>
          <div className="mt-4 flex items-center gap-3">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-accent-500 hover:text-accent-500"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Quick links</h3>
          <ul className="flex flex-col gap-2 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/60 hover:text-accent-500">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Policies</h3>
          <ul className="flex flex-col gap-2 text-sm">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/60 hover:text-accent-500">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Get in touch</h3>
          <ul className="flex flex-col gap-2.5 text-sm text-white/60">
            <li className="flex items-center gap-2">
              <PhoneIcon />
              <a href="tel:+254700000000" className="hover:text-accent-500">+254 700 000 000</a>
            </li>
            <li className="flex items-center gap-2">
              <MailIcon />
              <a href="mailto:support@sokoni.co.ke" className="hover:text-accent-500">support@sokoni.co.ke</a>
            </li>
            <li className="flex items-center gap-2">
              <PinIcon />
              <span>Nairobi, Kenya</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-white/50 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Sokoni. All rights reserved.</p>
          <p>Need help with an order? We typically respond within 12 hours.</p>
        </div>
      </div>
    </footer>
  );
}
