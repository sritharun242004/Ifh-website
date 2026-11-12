import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How IFH Connects (iFindHouse) collects, uses, shares and protects your personal information.",
};

const UPDATED = "12 November 2026";

export default function PrivacyPage() {
  return (
    <section className="container legal">
      <div className="legal-inner">
        <p className="legal-eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: {UPDATED}</p>

        <p>
          This Privacy Policy explains how IFH Connects (&ldquo;iFindHouse&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;) collects, uses, shares and protects your personal information when you
          use our website, mobile apps and related services (the &ldquo;Platform&rdquo;). iFindHouse
          is a property platform that connects people looking to rent homes and office spaces
          directly with verified property owners, without brokers. By using the Platform you agree to
          this Policy.
        </p>

        <h2>1. Information we collect</h2>
        <ul>
          <li>
            <strong>Account &amp; contact details</strong> — your name, email address, phone number,
            and the password or sign-in method you use.
          </li>
          <li>
            <strong>Property &amp; listing details</strong> — for owners: addresses, photos, rent,
            amenities and availability; for tenants: your search preferences, saved homes and
            enquiries.
          </li>
          <li>
            <strong>Transaction details</strong> — plans, credits and payments. Card and banking
            details are handled by our payment processor (Razorpay) and are not stored by us.
          </li>
          <li>
            <strong>Usage &amp; device data</strong> — pages viewed, actions taken, device type,
            browser, IP address and similar diagnostic data.
          </li>
          <li>
            <strong>Location of listings</strong> — the approximate and exact location of properties
            listed on the Platform (exact address is shown only after a connection is unlocked).
          </li>
        </ul>

        <h2>2. How we use your information</h2>
        <ul>
          <li>To operate the Platform — show listings, enable enquiries, and connect tenants with owners.</li>
          <li>To create and secure your account and verify your identity.</li>
          <li>To process payments, plans and credits.</li>
          <li>
            To send you <strong>service communications</strong> — sign-in codes, enquiry and visit
            updates, payment receipts and listing status — by <strong>email and, where you have
            opted in, WhatsApp</strong>. You can opt out of non-essential messages at any time in
            your notification settings.
          </li>
          <li>To improve, secure and troubleshoot the Platform and prevent fraud or abuse.</li>
          <li>To comply with legal obligations.</li>
        </ul>

        <h2>3. WhatsApp &amp; messaging</h2>
        <p>
          Where you opt in, we send transactional notifications over WhatsApp using the WhatsApp
          Business Platform. We only message numbers that have been provided and opted in, and we use
          these messages for service updates (not spam). Your use of WhatsApp is also governed by
          WhatsApp&rsquo;s own terms and privacy policy. You can stop WhatsApp messages at any time by
          replying STOP or turning off WhatsApp in your notification settings.
        </p>

        <h2>4. How we share information</h2>
        <ul>
          <li>
            <strong>Between tenants and owners</strong> — once a connection is made, limited contact
            details are shared so you can arrange a visit or rental directly.
          </li>
          <li>
            <strong>Service providers</strong> — hosting, payments (Razorpay), messaging (email and
            WhatsApp/Meta) and analytics providers who process data on our behalf under contract.
          </li>
          <li>
            <strong>Legal</strong> — when required by law, regulation, legal process or to protect
            rights, safety and property.
          </li>
        </ul>
        <p>We do not sell your personal information.</p>

        <h2>5. Data security</h2>
        <p>
          We protect your data with encryption in transit and at rest, access controls and other
          safeguards. Sensitive personal information such as your phone number is stored encrypted.
          No method of transmission or storage is completely secure, but we work to protect your
          information and to notify you of material incidents where required.
        </p>

        <h2>6. Data retention</h2>
        <p>
          We keep personal information for as long as your account is active or as needed to provide
          the Platform, and thereafter as required to meet legal, tax and accounting obligations or
          to resolve disputes.
        </p>

        <h2>7. Your rights</h2>
        <p>
          You may access, correct, update or request deletion of your personal information, and
          withdraw consent for optional communications, by using your account settings or contacting
          us at the address below. We will respond in line with applicable law.
        </p>

        <h2>8. Cookies</h2>
        <p>
          We use essential cookies and similar technologies to keep you signed in, remember
          preferences and understand how the Platform is used. You can control cookies through your
          browser settings.
        </p>

        <h2>9. Children</h2>
        <p>
          The Platform is intended for users aged 18 and above and is not directed at children.
        </p>

        <h2>10. Changes to this Policy</h2>
        <p>
          We may update this Policy from time to time. We will post the updated version here with a
          new &ldquo;Last updated&rdquo; date, and where appropriate notify you of significant
          changes.
        </p>

        <h2>11. Contact us</h2>
        <p>
          Questions or requests about this Policy or your data: <a href="mailto:official@ifindhouse.in">official@ifindhouse.in</a>.
        </p>
      </div>
    </section>
  );
}
