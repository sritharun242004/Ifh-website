import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CITIES, type IconCard } from "@/content/site";
import { Icon } from "./Icon";

/* Building blocks shared by several pages. All server components. */

export function SectionHead({
  id,
  eyebrow,
  title,
  lead,
  aside,
  titleClassName,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  aside?: ReactNode;
  titleClassName?: string;
}) {
  const heading = (
    <>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className={`section-title${titleClassName ? ` ${titleClassName}` : ""}`} id={id}>
        {title}
      </h2>
      {lead && <p className="lead">{lead}</p>}
    </>
  );
  if (!aside) return <div className="section-head reveal">{heading}</div>;
  return (
    <div className="section-head row reveal">
      <div>{heading}</div>
      {aside}
    </div>
  );
}

/** Bento / icon card grid (`bento` or `cat-grid` layout). */
export function IconCards({
  cards,
  layout,
  className = "",
}: {
  cards: IconCard[];
  layout: "bento" | "cat-grid";
  className?: string;
}) {
  return (
    <div className={`grid ${layout} ${className}`.trim()}>
      {cards.map((card) => (
        <div
          key={card.title}
          className={["card", card.variant, card.wide && "wide", "reveal"]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="icon-box">
            <Icon name={card.icon} />
          </div>
          <h3>{card.title}</h3>
          <p>{card.text}</p>
        </div>
      ))}
    </div>
  );
}

/** Ink band comparing broker fees with IFH. */
export function BrokerBand({ children }: { children: ReactNode }) {
  return (
    <section className="section bg-ink on-dark" aria-labelledby="broker-h">
      <div className="container">
        <span className="eyebrow reveal">The brokerage maths</span>
        <h2 className="section-title broker-title reveal" id="broker-h">
          A month&apos;s rent is the going rate for brokerage.{" "}
          <em>We charge a fixed fee instead.</em>
        </h2>
        <div className="compare">
          <div className="reveal">
            <span className="who">Through a broker</span>
            <span className="big">One to two months&apos; rent</span>
          </div>
          <div className="ifh reveal">
            <span className="who">Through IFH</span>
            <span className="big">₹0</span>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

/** "Rentals by city" — bento on laptop, swipeable row on phones. */
export function CityGrid() {
  return (
    <section className="section bg-white" aria-labelledby="cities-h">
      <div className="container">
        <SectionHead id="cities-h" eyebrow="Rentals by city" title="Where renters are moving" />
        <div className="grid city-grid">
          {CITIES.map((city) => (
            <Link key={city.name} className="city reveal" href="/tenant#listings">
              <Image
                src={city.image}
                alt={`${city.name} homes for rent`}
                fill
                sizes="(min-width: 900px) 50vw, 62vw"
              />
              <span>
                {city.name} <Icon name="arrow" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Pale-lime closing call to action. */
export function CtaBand({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section className="section bg-pale cta-band" aria-labelledby="cta-h">
      <div className="container">
        <h2 id="cta-h" className="reveal">
          {title}
        </h2>
        {lead && <p className="lead reveal">{lead}</p>}
        <div className="btn-row reveal">{children}</div>
      </div>
    </section>
  );
}
