export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-3 font-heading text-3xl font-bold text-ink-900">Contact us</h1>
      <p className="mb-8 max-w-xl text-sm leading-relaxed text-ink-500">
        Got a question about an order, a product, or your account? Reach us through any of the channels
        below and we'll typically respond within 12 hours.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        <a
          href="tel:+254700000000"
          className="rounded-card border border-ink-300/30 p-5 transition-colors hover:border-accent-500"
        >
          <p className="mb-1 text-sm font-semibold text-ink-900">Call us</p>
          <p className="text-sm text-ink-500">+254 700 000 000</p>
          <p className="mt-1 text-xs text-ink-300">Mon–Sat, 8am–6pm</p>
        </a>
        <a
          href="mailto:support@sokoni.co.ke"
          className="rounded-card border border-ink-300/30 p-5 transition-colors hover:border-accent-500"
        >
          <p className="mb-1 text-sm font-semibold text-ink-900">Email us</p>
          <p className="text-sm text-ink-500">support@sokoni.co.ke</p>
          <p className="mt-1 text-xs text-ink-300">We reply within 12 hours</p>
        </a>
        <div className="rounded-card border border-ink-300/30 p-5">
          <p className="mb-1 text-sm font-semibold text-ink-900">Visit us</p>
          <p className="text-sm text-ink-500">Nairobi, Kenya</p>
          <p className="mt-1 text-xs text-ink-300">By appointment only</p>
        </div>
      </div>
    </div>
  );
}
