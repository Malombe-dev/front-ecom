export const metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 font-heading text-3xl font-bold text-ink-900">Privacy Policy</h1>
      <div className="flex flex-col gap-5 text-sm leading-relaxed text-ink-500">
        <p>
          This policy explains what information Sokoni collects, how we use it, and the choices you have.
        </p>

        <section>
          <h2 className="mb-1 font-heading text-lg font-semibold text-ink-900">Information we collect</h2>
          <p>
            When you create an account, sign in, or place an order, we collect details such as your name,
            email address, phone number, delivery address, and order history. If you sign in with Google,
            we receive your name, email, and profile photo from Google.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-heading text-lg font-semibold text-ink-900">How we use it</h2>
          <p>
            We use your information to process orders, communicate delivery updates, provide customer
            support, and improve the site. We do not sell your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-heading text-lg font-semibold text-ink-900">Cookies & storage</h2>
          <p>
            We use essential cookies and local storage to keep you signed in and remember your cart. You
            can clear these at any time through your browser settings, though some features may stop
            working correctly.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-heading text-lg font-semibold text-ink-900">Sharing with third parties</h2>
          <p>
            We share order details with delivery partners and payment processors only as needed to fulfil
            your order. These partners are required to protect your data and use it only for that purpose.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-heading text-lg font-semibold text-ink-900">Your choices</h2>
          <p>
            You can review or update your account details at any time, or request that we delete your
            account and associated data by contacting support.
          </p>
        </section>

        <p>Questions about this policy? Reach out via our <a className="text-brand-600 underline" href="/contact">contact page</a>.</p>
      </div>
    </div>
  );
}
