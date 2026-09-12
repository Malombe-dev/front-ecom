export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 font-heading text-3xl font-bold text-ink-900">Terms & Conditions</h1>
      <div className="flex flex-col gap-5 text-sm leading-relaxed text-ink-500">
        <p>
          Welcome to Sokoni. By creating an account, browsing our catalog, or placing an order, you agree
          to the terms below. Please read them carefully before using the site.
        </p>

        <section>
          <h2 className="mb-1 font-heading text-lg font-semibold text-ink-900">Orders & payment</h2>
          <p>
            All orders are subject to product availability. Prices are shown in Kenyan Shillings (KSh) and
            may change without notice. We reserve the right to cancel or refuse any order at our discretion,
            for example in cases of suspected fraud or pricing errors.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-heading text-lg font-semibold text-ink-900">Delivery</h2>
          <p>
            Delivery times are estimates and not guaranteed. Sokoni is not liable for delays caused by
            circumstances outside our reasonable control, such as courier disruptions or incorrect delivery
            details provided at checkout.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-heading text-lg font-semibold text-ink-900">Returns & refunds</h2>
          <p>
            If an item arrives damaged, defective, or different from what you ordered, contact support
            within 7 days of delivery. Approved refunds are issued to the original payment method within a
            reasonable timeframe.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-heading text-lg font-semibold text-ink-900">Account responsibilities</h2>
          <p>
            You're responsible for keeping your account credentials secure and for all activity under your
            account. Let us know immediately if you suspect unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-heading text-lg font-semibold text-ink-900">Changes to these terms</h2>
          <p>
            We may update these terms from time to time. Continued use of Sokoni after changes are posted
            means you accept the updated terms.
          </p>
        </section>

        <p>Questions about these terms? Reach out via our <a className="text-brand-600 underline" href="/contact">contact page</a>.</p>
      </div>
    </div>
  );
}
