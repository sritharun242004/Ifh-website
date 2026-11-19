import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms governing your use of the IFH Connects (iFindHouse) property platform.",
};

const UPDATED = "12 November 2026";

export default function TermsPage() {
  return (
    <section className="container legal">
      <div className="legal-inner">
        <p className="legal-eyebrow">Legal</p>
        <h1>Terms &amp; Conditions</h1>
        <p className="legal-updated">Last updated: {UPDATED}</p>

        <p>
          These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your use of the IFH Connects
          (&ldquo;iFindHouse&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) website, mobile apps and
          services (the &ldquo;Platform&rdquo;). By accessing or using the Platform you agree to these
          Terms. If you do not agree, please do not use the Platform.
        </p>

        <h2>1. What we do</h2>
        <p>
          iFindHouse is an online platform that helps tenants discover rental homes and office spaces
          and connect directly with verified property owners, without brokers. We provide the
          technology that connects the two sides; we are <strong>not a broker, real-estate agent,
          landlord or a party to any rental agreement</strong> between a tenant and an owner.
        </p>

        <h2>2. Eligibility</h2>
        <p>
          You must be at least 18 years old and able to form a binding contract to use the Platform.
          You agree to provide accurate information and to keep it up to date.
        </p>

        <h2>3. Your account</h2>
        <p>
          You are responsible for the activity under your account and for keeping your sign-in
          details secure. Notify us promptly of any unauthorised use.
        </p>

        <h2>4. Listings &amp; owner responsibilities</h2>
        <ul>
          <li>Owners are responsible for the accuracy, legality and availability of their listings.</li>
          <li>Owners must have the right to list and rent the property and must comply with applicable laws.</li>
          <li>
            We may review, verify, de-list or remove listings that are inaccurate, unlawful, or that
            breach these Terms, but we do not guarantee the condition, legality or availability of any
            property.
          </li>
        </ul>

        <h2>5. Tenant responsibilities</h2>
        <p>
          Tenants are responsible for independently verifying a property, the owner and all terms
          before making any payment or entering into any agreement. Visits and rental agreements are
          arranged directly between tenants and owners.
        </p>

        <h2>6. Plans, credits &amp; payments</h2>
        <p>
          Certain features (such as unlocking owner contact details) require a paid plan or credits.
          Payments are processed by our payment partner (Razorpay). Fees, plans and any refund
          eligibility are described at the point of purchase. Except where required by law or stated
          otherwise, fees are non-refundable once the associated benefit has been used.
        </p>

        <h2>7. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>post false, misleading, unlawful or infringing content;</li>
          <li>scrape, copy or harvest data from the Platform without permission;</li>
          <li>misuse contact details obtained through the Platform, or send spam;</li>
          <li>attempt to disrupt, reverse-engineer or gain unauthorised access to the Platform.</li>
        </ul>

        <h2>8. Communications</h2>
        <p>
          By creating an account you agree to receive service communications (such as sign-in codes,
          enquiry and payment updates) by email and, where you opt in, WhatsApp. You can manage or opt
          out of non-essential messages in your notification settings.
        </p>

        <h2>9. Intellectual property</h2>
        <p>
          The Platform, including its software, design, logos and content, belongs to iFindHouse or
          its licensors and is protected by law. You may not use our branding without permission.
          Content you submit remains yours, but you grant us a licence to host and display it to
          operate the Platform.
        </p>

        <h2>10. Disclaimers</h2>
        <p>
          The Platform is provided &ldquo;as is&rdquo;. We do not warrant that listings are accurate
          or available, or that the Platform will be uninterrupted or error-free. We are not
          responsible for the acts or omissions of tenants or owners, or for any rental agreement
          entered into between them.
        </p>

        <h2>11. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, iFindHouse will not be liable for any indirect,
          incidental or consequential loss, or for any dealings between tenants and owners. Our total
          liability for any claim relating to the Platform is limited to the amount you paid to us in
          the three months before the claim.
        </p>

        <h2>12. Suspension &amp; termination</h2>
        <p>
          We may suspend or terminate access to the Platform if you breach these Terms or use the
          Platform unlawfully. You may stop using the Platform and close your account at any time.
        </p>

        <h2>13. Governing law</h2>
        <p>
          These Terms are governed by the laws of India, and the courts at the location of our
          registered office shall have jurisdiction, subject to applicable law.
        </p>

        <h2>14. Changes</h2>
        <p>
          We may update these Terms from time to time. The updated version will be posted here with a
          new &ldquo;Last updated&rdquo; date, and continued use of the Platform means you accept the
          changes.
        </p>

        <h2>15. Contact us</h2>
        <p>
          Questions about these Terms: <a href="mailto:official@ifindhouse.in">official@ifindhouse.in</a>.
        </p>
      </div>
    </section>
  );
}
