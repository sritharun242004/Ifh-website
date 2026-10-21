import Image from "next/image";
import Link from "next/link";
import { Faq } from "@/components/Faq";
import { FeatureStack } from "@/components/FeatureStack";
import { Icon } from "@/components/Icon";
import { VillaHero } from "@/components/VillaHero";
import { AboutWheel } from "@/components/AboutWheel";
import { BrokerIndex } from "@/components/BrokerIndex";
import { VisitCalendar } from "@/components/VisitCalendar";
import { CtaStrip } from "@/components/CtaStrip";
import { CityGrid } from "@/components/Sections";
import { ALL_FAQS, type IconCard } from "@/content/site";

const ABOUT = [
  {
    kicker: "01 — Discover",
    title: "We Connect",
    text: "Connecting people with the right homes, stays and workspaces.",
    image: "/assets/img/1497366216548-37526070297c-700.jpg",
    alt: "A bright modern workspace",
  },
  {
    kicker: "02 — Simplify",
    title: "We Simplify",
    text: "Making property discovery and listing simple, transparent and hassle-free.",
    image: "/assets/img/1502672260266-1c1ef2d93688-700.jpg",
    alt: "A clean, bright living room",
  },
  {
    kicker: "03 — Connect",
    title: "We Empower",
    text: "Helping tenants and owners connect directly, with more control over their choices.",
    image: "/assets/img/1600596542815-ffad4c1539a9-700.jpg",
    alt: "A modern independent house",
  },
  {
    kicker: "04 — Build trust",
    title: "We Build Trust",
    text: "Creating a more reliable property experience through verified listings and clearer connections.",
    image: "/assets/img/1560448204-e02f11c3d0e2-700.jpg",
    alt: "A verified apartment interior",
  },
];

const FEATURES: IconCard[] = [
  {
    icon: "tag",
    title: "Zero brokerage",
    text: "Connect with owners directly, never through an agent.",
    variant: "lime",
  },
  {
    icon: "shield",
    title: "Verified listings",
    text: "Every listing is checked against ownership documents.",
  },
  {
    icon: "search",
    title: "Search & discovery",
    text: "Browse, filter, property details, wishlist, compare.",
    variant: "sage",
    wide: true,
  },
  { icon: "chat", title: "Enquiry flow", text: "Enquire → OTP verify → pick a plan." },
  { icon: "lock", title: "Paid access", text: "Full details unlock with a plan." },
  {
    icon: "card",
    title: "Payments & GST invoices",
    text: "Pay online and get a GST invoice every time.",
    variant: "sage",
  },
  {
    icon: "calendar",
    title: "Messaging & visits",
    text: "Chat with owners and schedule visits.",
    wide: true,
  },
  {
    icon: "bell",
    title: "Reviews, support & notifications",
    text: "Honest reviews, helpful support and timely alerts.",
  },
  {
    icon: "sparkles",
    title: "AI assistant",
    text: "The in-app “Ask IFH” widget helps you search in your own words.",
    variant: "dark",
    wide: true,
  },
];

const DOORS = [
  {
    href: "/tenant",
    image: "/assets/img/1502672260266-1c1ef2d93688-1000.jpg",
    alt: "A bright, furnished living room",
    icon: "home",
    tag: "Tenant",
    title: ["Looking for", "a place"],
    text: "Browse verified homes and offices for free. Pay only to reach an owner.",
    cta: "Find a place",
  },
  {
    href: "/property-owner",
    image: "/assets/img/1600596542815-ffad4c1539a9-1000.jpg",
    alt: "A modern independent house",
    icon: "user",
    tag: "Property owner",
    title: ["I have a place", "to list"],
    text: "List for free, meet verified tenants and keep every rupee of your rent.",
    cta: "List your property",
  },
] as const;

export default function HomePage() {
  return (
    <>
      {/* Hero — sunrise villa crossfades to sunset as you scroll */}
      <VillaHero />

      <CtaStrip />

      {/* About IFH Connects — about + about IFH Connects merged */}
      <section className="section bg-white about-section" id="about" aria-labelledby="about-h">
        <div className="container">
          <div className="about-intro reveal" id="why-ifh">
            <Link className="eyebrow" href="/#why-ifh">
              Why IFH
            </Link>
            <h2 className="hero-title about-heading" id="about-h">
              Renting, without the <span className="mark">middleman.</span>
            </h2>
            <div className="about-split">
              <div className="about-side">
                <p className="lead">
                  The brokerage maths, what IFH stands on, and the questions people ask before they
                  sign.
                </p>
                <p className="about-lead">
                  IFH Connects brings property seekers and owners together to make finding, listing
                  and connecting around spaces easier.
                </p>
              </div>
              <div className="about-steps-wrap">
                <span className="about-tag">A broker-free property platform</span>
                <AboutWheel />
              </div>
            </div>
          </div>
          <div className="grid about-grid">
            {ABOUT.map((card) => (
              <article key={card.title} className="about-card reveal">
                <div className="about-photo">
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 600px) 50vw, 100vw"
                  />
                </div>
                <div className="about-body">
                  <span className="about-kicker">{card.kicker}</span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="platform-block">
            <FeatureStack cards={FEATURES} />
          </div>
        </div>
      </section>

      {/* Who are you? */}
      <section className="section doorway" aria-labelledby="who-h">
        <div className="container">
          <div className="doorway-head reveal">
            <span className="pill">Who are you?</span>
            <h2 id="who-h">
              Pick your <span className="mark">doorway</span>
            </h2>
            <p>Choose how you want to find your next space. We’ve got you covered.</p>
          </div>
          <div className="grid door-grid">
            {DOORS.map((door) => (
              <Link key={door.href} className="door reveal" href={door.href}>
                <Image
                  src={door.image}
                  alt={door.alt}
                  fill
                  sizes="(min-width: 600px) 50vw, 100vw"
                />
                <div className="door-top">
                  <span className="door-icon">
                    <Icon name={door.icon} />
                  </span>
                  <span className="door-tag">{door.tag}</span>
                </div>
                <div className="door-body">
                  <h3>
                    {door.title[0]}
                    <br />
                    {door.title[1]}
                  </h3>
                  <p>{door.text}</p>
                  <span className="door-cta">
                    <span className="go">
                      <Icon name="arrow" />
                    </span>
                    <span className="door-cta-label">{door.cta}</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <BrokerIndex>
        <p className="band-cta reveal">
          <Link className="btn" href="/#why-ifh">
            Why IFH <Icon name="arrow" />
          </Link>
        </p>
      </BrokerIndex>

      <CityGrid />

      <VisitCalendar />

      <Faq
        id="home-faq"
        eyebrow="Before you ask"
        title="Questions people actually have"
        items={ALL_FAQS}
      />
    </>
  );
}
