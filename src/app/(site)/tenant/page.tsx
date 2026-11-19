import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LeadSection } from "@/components/LeadSection";
import { FeatureStack } from "@/components/FeatureStack";
import { FocusSlider } from "@/components/FocusSlider";
import { Icon, type IconName } from "@/components/Icon";
import { CityGrid, IconCards, SectionHead } from "@/components/Sections";
import { FAQ, type IconCard } from "@/content/site";

export const metadata: Metadata = {
  title: "For Tenants",
  description:
    "Browse every IFH-verified home and office for free — no account needed. Pay only when you want to talk to an owner.",
};

const FIND: {
  icon: IconName;
  title: string;
  text?: string;
  image: string;
  alt: string;
  links: string[];
}[] = [
  {
    icon: "home",
    title: "Rent a home",
    image: "/assets/img/images.jpg",
    alt: "A bright, modern furnished living room",
    links: ["1 BHK", "2 BHK", "3 BHK", "PG & co-living", "Villas", "All rental homes"],
  },
  {
    icon: "building",
    title: "Workspaces",
    image: "/assets/img/11-most-exciting-co-working-spaces-in-india.jpg",
    alt: "An open-plan office with wooden desks",
    links: ["All offices", "With meeting rooms", "Dedicated desks", "Compare spaces"],
  },
];

type Listing = {
  image: string;
  title: string;
  meta: string;
  suitable: string;
  amenities: string[];
  price: string;
  rented?: boolean;
};

const LISTINGS: Listing[] = [
  {
    image: "/assets/img/1560448204-e02f11c3d0e2-700.jpg",
    title: "2BHK in Madhapur, Hyderabad",
    meta: "2 BHK · 2 Baths · Madhapur",
    suitable: "Families, working professionals",
    amenities: ["Gated community", "Parking", "Lift"],
    price: "₹30,000",
  },
  {
    image: "/assets/img/1600596542815-ffad4c1539a9-700.jpg",
    title: "Independent 3BHK house in Jayanagar, Bengaluru",
    meta: "3 BHK · 3 Baths · Jayanagar",
    suitable: "Families",
    amenities: ["Parking", "24×7 water", "Ground floor"],
    price: "₹45,000",
  },
  {
    image: "/assets/img/1502672260266-1c1ef2d93688-700.jpg",
    title: "Furnished 1BHK in Adyar, Chennai",
    meta: "1 BHK · 1 Bath · Adyar",
    suitable: "Bachelors, couples",
    amenities: ["Pet-friendly", "24×7 water", "Lift"],
    price: "₹20,000",
  },
  {
    image: "/assets/img/1512917774080-9991f1c4c750-700.jpg",
    title: "3BHK villa in Koregaon Park, Pune",
    meta: "3 BHK · 4 Baths · Koregaon Park",
    suitable: "Families",
    amenities: ["Gated community", "Parking", "Pet-friendly"],
    price: "₹65,000",
  },
  {
    image: "/assets/img/1522708323590-d24dbb6b0267-700.jpg",
    title: "2BHK in Bandra West, Mumbai",
    meta: "2 BHK · 2 Baths · Bandra West",
    suitable: "Working professionals",
    amenities: ["Lift", "Parking", "24×7 water"],
    price: "₹85,000",
  },
  {
    image: "/assets/img/1560448204-e02f11c3d0e2-700.jpg",
    title: "1BHK in RS Puram, Coimbatore",
    meta: "1 BHK · 1 Bath · RS Puram",
    suitable: "Bachelors, couples",
    amenities: ["24×7 water", "Lift"],
    price: "₹14,000",
    rented: true,
  },
];

const STEPS = [
  {
    title: "Search everything, free",
    text: "Every listing, every photograph, every filter. No account needed and nothing held back behind a signup.",
    image: "/assets/img/1502672260266-1c1ef2d93688-700.jpg",
  },
  {
    title: "Connect when you are sure",
    text: "Pay a fixed fee to unlock an owner's number — only for the places you actually want to see.",
    image: "/assets/img/1497366216548-37526070297c-700.jpg",
  },
  {
    title: "Deal direct with the owner",
    text: "No agent in the middle, no commission on your rent, and no one taking a cut of your deposit.",
    image: "/assets/img/1600596542815-ffad4c1539a9-700.jpg",
  },
];

const FLOW = ["Send enquiry", "Verify by OTP", "Pick a plan", "Unlock owner details"];

const TOOLS: IconCard[] = [
  {
    icon: "heart",
    title: "Wishlist / Saved",
    text: "Save listings and come back to them on any device.",
    variant: "lime",
  },
  { icon: "scale", title: "Compare listings", text: "Put homes or offices side by side." },
  { icon: "chat", title: "Chat with owners", text: "Talk directly once you've connected." },
  { icon: "calendar", title: "Schedule visits", text: "Pick a time that suits you both." },
  { icon: "star", title: "Reviews", text: "Read honest reviews from earlier tenants." },
  { icon: "bell", title: "Notifications", text: "Get alerts on replies, visits and new listings." },
  {
    icon: "card",
    title: "Online payments with GST invoices",
    text: "Pay securely and download your GST invoice.",
    wide: true,
  },
  {
    icon: "sparkles",
    title: "Ask IFH AI assistant",
    text: "Describe what you need in your own words.",
    variant: "dark",
  },
];

const PLANS = [
  {
    name: "Single 30",
    desc: "Get started — connect with a handful of owners.",
    price: "₹99",
    access: "30-day access",
    connections: "1 owner connection · valid 30 days",
  },
  {
    name: "Plus",
    desc: "More connections, more time to compare.",
    price: "₹299",
    access: "60-day access",
    connections: "20 owner connections · valid 60 days",
    best: true,
  },
  {
    name: "Pro",
    desc: "Most connections and the longest runway.",
    price: "₹699",
    access: "90-day access",
    connections: "50 owner connections · valid 90 days",
  },
];

const INCLUDED = [
  "Owner's direct number & WhatsApp",
  "Chat with the owner directly",
  "Full photos & video tour",
  "Exact address & map location",
  "Schedule a visit",
  "Zero brokerage, ever",
];

export default function TenantPage() {
  return (
    <>
      <section className="hero hero-bg" aria-labelledby="t-h">
        <Image
          className="hero-bg-img hero-bg-mobile"
          src="/assets/img/1a32863f-290b-4337-852a-d85e6d582b44.png"
          alt=""
          fill
          priority
          quality={85}
          sizes="100vw"
        />
        <Image
          className="hero-bg-img hero-bg-desktop"
          src="/assets/img/traditional-Indian-interiors-7-1.jpg"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
        />
        <div className="container">
          <span className="eyebrow">For tenants</span>
          <h1 className="hero-title" id="t-h">
            Find your next space. Skip <span className="mark">the broker.</span>
          </h1>
          <p className="lead">
            Browse every IFH-verified home and office for free — no account needed. Pay only when
            you want to talk to an owner.
          </p>
          <div className="btn-row">
            <a className="btn" href="#listings">
              Browse homes
            </a>
            <a className="btn btn-secondary" href="#pricing">
              See pricing
            </a>
          </div>
        </div>
      </section>

      <section className="section bg-sage" id="find" aria-labelledby="find-h">
        <div className="container">
          <SectionHead id="find-h" eyebrow="What you can find" title="Homes and workspaces" />
          <div className="find-grid">
            {FIND.map((group) => (
              <article key={group.title} className="find-card reveal">
                <div className="find-photo">
                  <Image
                    src={group.image}
                    alt={group.alt}
                    fill
                    sizes="(min-width: 900px) 50vw, 100vw"
                  />
                  <span className="find-icon">
                    <Icon name={group.icon} />
                  </span>
                  <h3>{group.title}</h3>
                </div>
                <ol className="find-rail">
                  {group.links.map((label, i) => (
                    <li key={label} style={{ "--n": i } as React.CSSProperties}>
                      <a className="find-item" href="#find">
                        <span className="find-ball" aria-hidden="true">
                          {i + 1}
                        </span>
                        <span className="find-pill">
                          <span>{label}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CityGrid />

      <section className="section bg-tint" id="listings" aria-labelledby="avail-h">
        <div className="container">
          <SectionHead
            id="avail-h"
            eyebrow="Sample listings"
            title="Homes available now"
            aside={
              <a className="link-arrow" href="#pricing">
                How to connect <Icon name="arrow" />
              </a>
            }
          />
          <FocusSlider className="grid listing-grid">
            {LISTINGS.map((listing) => (
              <article
                key={listing.title}
                className={`listing${listing.rented ? " rented" : ""} reveal`}
              >
                <div className="l-photo">
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    width={700}
                    height={525}
                    sizes="(min-width: 1280px) 33vw, (min-width: 600px) 50vw, 100vw"
                  />
                  <div className="l-badges">
                    <span className="badge badge-verified">
                      <Icon name="check" />
                      IFH verified
                    </span>
                    {listing.rented ? (
                      <span className="badge badge-rented">
                        <Icon name="lock" />
                        Rented
                      </span>
                    ) : (
                      <span className="badge badge-available">
                        <Icon name="dot" />
                        Available now
                      </span>
                    )}
                  </div>
                  <div className="dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
                <div className="l-body">
                  <h3>{listing.title}</h3>
                  <p className="l-meta">{listing.meta}</p>
                  <p className="l-suit">Suitable for: {listing.suitable}</p>
                  <div className="chips">
                    {listing.amenities.map((amenity) => (
                      <span key={amenity} className="chip chip-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <p className="price">
                    {listing.price} <small>/month</small>
                  </p>
                  <div className="l-actions">
                    <a className="btn btn-secondary btn-sm" href="#listings">
                      View details
                    </a>
                    <a className="btn btn-sm" href="#listings">
                      Contact owner
                    </a>
                  </div>
                  <label className="compare-check">
                    <input type="checkbox" /> Compare
                  </label>
                </div>
              </article>
            ))}
          </FocusSlider>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="how-h">
        <div className="container">
          <SectionHead id="how-h" eyebrow="How it works" title="Three steps to your next home" />
          <div className="steps-photo">
            {STEPS.map((step, i) => (
              <article key={step.title} className="step-photo reveal">
                <Image src={step.image} alt="" fill sizes="(min-width: 900px) 33vw, 100vw" />
                <div className="step-photo-body">
                  <span className="step-kicker">Step {String(i + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  {i === 1 && (
                    <ol className="step-list" aria-label="Enquiry flow">
                      {FLOW.map((label) => (
                        <li key={label}>
                          <span>{label}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-sage" aria-labelledby="tools-h">
        <div className="container">
          <FeatureStack
            cards={TOOLS}
            id="tools-h"
            eyebrow="Tenant tools"
            title="Everything you need to decide"
            respectWide
          />
        </div>
      </section>

      <section className="section bg-white" id="pricing" aria-labelledby="price-h">
        <div className="container">
          <SectionHead id="price-h" eyebrow="Pricing" title="Pay once. Connect directly." />
          <div className="grid price-grid">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`plan${plan.best ? " best" : ""} reveal`}>
                {plan.best && <span className="badge badge-best">Best value</span>}
                <h3>{plan.name}</h3>
                <p className="desc">{plan.desc}</p>
                <div className="amount">
                  {plan.price} <small>one-time</small>
                </div>
                <p className="gst">Total price · GST included</p>
                <div className="meta">
                  <span>{plan.access}</span>
                  <span>{plan.connections}</span>
                </div>
                <ul>
                  {INCLUDED.map((item) => (
                    <li key={item}>
                      <Icon name="check" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a className="btn plan-btn" href="#listings">
                  <span>Choose this plan</span>
                  <span className="btn-go">
                    <Icon name="arrow" />
                  </span>
                </a>
              </div>
            ))}
          </div>
          <p className="price-note reveal">
            Browse every listing for free. Pay only when you want an owner&apos;s contact, exact
            address, video tour and visit scheduling — then talk to owners directly, with zero
            brokerage.
          </p>
          <div className="chips trust-chips reveal">
            {["GST included", "No brokerage", "No recurring charge"].map((label) => (
              <span key={label} className="badge badge-verified">
                <Icon name="check" />
                {label}
              </span>
            ))}
          </div>
          <p className="fine">
            You&apos;ll choose a property and pay only after showing interest and verifying your
            number. Access stays active until the plan expires or its unlocks are used.
          </p>
        </div>
      </section>

      <LeadSection
        kind="tenant"
        faqEyebrow="Tenant FAQ"
        faqTitle="Questions renters ask"
        faqItems={[FAQ.broker, FAQ.verified, FAQ.reply, FAQ.deposit]}
      />
    </>
  );
}
