import type { Metadata } from "next";
import Image from "next/image";
import { LeadSection } from "@/components/LeadSection";
import { FeatureStack } from "@/components/FeatureStack";
import { WhyRail } from "@/components/WhyRail";
import { Icon } from "@/components/Icon";
import { CtaBand, SectionHead } from "@/components/Sections";
import { FAQ, type IconCard } from "@/content/site";

export const metadata: Metadata = {
  title: "For Owners",
  description:
    "Reach verified tenants directly on IFH Connects. Listing is free, leads are real, and there is no brokerage on your rent — not now, not ever.",
};

const BENEFITS: IconCard[] = [
  {
    icon: "tag",
    title: "Free to list",
    text: "Post your property in minutes. You only ever pay zero — tenants pay a small fee to reach you.",
  },
  {
    icon: "userCheck",
    title: "Verified leads only",
    text: "Every tenant is phone-verified before they can contact you. No spam, no time-wasters.",
  },
  {
    icon: "shield",
    title: "No brokerage, ever",
    text: "Deal with tenants directly. There is no broker in the middle and no commission on your rent.",
  },
];

const STEPS = [
  { title: "List it", text: "Add photos, rent, and details in a short guided form." },
  {
    title: "We review it",
    text: "Our team checks the listing and publishes it — usually within a day.",
  },
  {
    title: "Get direct enquiries",
    text: "Verified tenants unlock your contact and reach out. You stay in control.",
  },
];

const LISTABLE: (IconCard & { image: string; alt: string })[] = [
  {
    icon: "home",
    title: "Long-stay homes",
    text: "Flats, independent houses, PGs and villas.",
    image: "/assets/img/images.jpg",
    alt: "A bright, modern furnished living room",
  },
  {
    icon: "building",
    title: "Office spaces",
    text: "Desks, meeting rooms and full offices.",
    image: "/assets/img/11-most-exciting-co-working-spaces-in-india.jpg",
    alt: "An open-plan office with wooden desks",
  },
];

const TOOLS: IconCard[] = [
  {
    icon: "dash",
    title: "Owner dashboard",
    text: "See your listings, enquiries and status in one view.",
    wide: true,
  },
  {
    icon: "layers",
    title: "Manage properties",
    text: "Edit photos, rent and details whenever you like.",
  },
  {
    icon: "userCheck",
    title: "Receive leads",
    text: "Verified, phone-checked tenants reach out to you.",
  },
  {
    icon: "file",
    title: "Run a deal",
    text: "Take an enquiry through to a signed agreement.",
    wide: true,
  },
  {
    icon: "wallet",
    title: "Payouts",
    text: "Track what you're owed and when it arrives.",
    wide: true,
  },
  { icon: "life", title: "Owner support", text: "Get help from the IFH team when you need it." },
];

export default function PropertyOwnerPage() {
  return (
    <>
      <section className="hero hero-bg hero-owner" aria-labelledby="o-h">
        <Image
          className="hero-bg-img"
          src="/assets/img/luxury-house-design-1-1024x682.jpg"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
        />
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">For owners</span>
            <h1 className="hero-title" id="o-h">
              List your home. <span className="mark">Skip the broker.</span>
            </h1>
            <p className="lead">
              Reach verified tenants directly on IFH Connects. Listing is free, leads are real, and
              there is no brokerage on your rent — not now, not ever.
            </p>
            <div className="btn-row">
              <a className="btn" href="#how">
                See how it works
              </a>
            </div>
          </div>
          <div className="dash reveal" aria-label="Sample owner dashboard">
            <div className="dash-head">
              <span>Owner dashboard</span>
              <span className="badge badge-verified">
                <Icon name="check" />
                IFH verified
              </span>
            </div>
            <div className="dash-listing">
              <Image
                src="/assets/img/1560448204-e02f11c3d0e2-300.jpg"
                alt="Sample listing photo"
                width={84}
                height={72}
              />
              <div>
                <b>2BHK in Madhapur</b>
                <span className="mono">₹30,000 /month</span>
              </div>
            </div>
            <div className="dash-stat">
              <span className="n">3</span>
              <span>new enquiries</span>
            </div>
            <div className="status-line">
              <span className="badge badge-review">
                <Icon name="clock" />
                Under review
              </span>
              <Icon name="arrow" />
              <span className="badge badge-available">
                <Icon name="check" />
                Published
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-sage why-section" aria-labelledby="ben-h">
        <div className="container">
          <SectionHead id="ben-h" eyebrow="Why list with IFH" title="Three good reasons" />
          <WhyRail items={BENEFITS} />
        </div>
      </section>

      {/* How it works + what you can list, merged into one section */}
      <section className="section owner-flow" id="how" aria-labelledby="ohow-h">
        <div className="container">
          <SectionHead
            id="ohow-h"
            eyebrow="How it works"
            title="Three steps to your first tenant"
          />
          <div className="flow-grid">
            <ol className="flow-steps">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flow-step reveal">
                  <span className="flow-dot">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flow-card">
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <aside className="flow-list reveal" aria-labelledby="list-h">
              <span className="flow-pill">What you can list</span>
              <h3 id="list-h">Homes, stays and offices</h3>
              {LISTABLE.map((item) => (
                <div key={item.title} className="flow-tile">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 900px) 40vw, 100vw"
                  />
                  <div className="flow-tile-body">
                    <span className="flow-tile-icon">
                      <Icon name={item.icon} />
                    </span>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </section>

      <section className="section bg-sage" aria-labelledby="otools-h">
        <div className="container">
          <FeatureStack
            cards={TOOLS}
            id="otools-h"
            eyebrow="Owner tools"
            title="Run your listings from one place"
            respectWide
          />
        </div>
      </section>

      {/* What listing costs + Verified = trust, merged into one dark section */}
      <section className="section bg-ink on-dark bi owner-bi owner-cost" aria-labelledby="cost-h">
        <div className="container">
          <h2 className="sr-only" id="cost-h">
            What listing costs, and why verified means trust
          </h2>
          <div className="bi-rows">
            <div className="bi-row is-ifh reveal">
              <div className="bi-main">
                <p className="bi-line">
                  <span className="bi-big">Zero.</span>
                  <span className="bi-word">Free for owners. Always.</span>
                </p>
                <p className="bi-sub">
                  Listing, photographs, enquiries and the owner dashboard are free, and there is no
                  commission on your rent. We are paid by tenants who choose to connect.
                </p>
              </div>
              <span className="bi-note">→ What listing costs</span>
            </div>
            <div className="bi-row reveal">
              <div className="bi-main">
                <p className="bi-line">
                  <span className="bi-big">Verified</span>
                  <span className="bi-word">= trust</span>
                </p>
                <p className="bi-sub">
                  Every listing is checked against ownership documents. Verification covers the
                  listing and the owner&apos;s identity.
                </p>
              </div>
              <span className="bi-note">→ Verification</span>
            </div>
          </div>
        </div>
      </section>

      <LeadSection
        kind="owner"
        faqEyebrow="Owner FAQ"
        faqTitle="Owners ask, we answer"
        faqItems={[FAQ.listingCost, FAQ.verified, FAQ.broker, FAQ.deposit]}
      />

      <CtaBand
        title="Ready to find your tenant?"
        lead="It takes a few minutes and your first listing is free."
      >
        <a className="btn" href="#how">
          See how it works
        </a>
      </CtaBand>
    </>
  );
}
