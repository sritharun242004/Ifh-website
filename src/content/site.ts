import type { IconName } from "@/components/Icon";

/* Shared content used on more than one page. Page-specific copy lives in each page file. */

export const NAV = [
  { label: "Why IFH", href: "/#why-ifh" },
  { label: "Tenant", href: "/tenant" },
  { label: "Property Owner", href: "/property-owner" },
] as const;

export type FooterColumn = { title: string; links: { label: string; href: string }[] };

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Rent a home",
    links: [
      { label: "All rental homes", href: "/tenant#find" },
      { label: "1 BHK", href: "/tenant#find" },
      { label: "2 BHK", href: "/tenant#find" },
      { label: "3 BHK", href: "/tenant#find" },
      { label: "PG & co-living", href: "/tenant#find" },
      { label: "Villas", href: "/tenant#find" },
    ],
  },
  {
    title: "Workspaces",
    links: [
      { label: "All offices", href: "/tenant#find" },
      { label: "With meeting rooms", href: "/tenant#find" },
      { label: "Dedicated desks", href: "/tenant#find" },
      { label: "Compare spaces", href: "/tenant#find" },
    ],
  },
  {
    title: "For owners",
    links: [
      { label: "List your property", href: "/property-owner" },
      { label: "Owner dashboard", href: "/property-owner" },
      { label: "Run a deal", href: "/property-owner" },
      { label: "Pricing", href: "/tenant#pricing" },
      { label: "Owner support", href: "/property-owner#faq" },
    ],
  },
  {
    title: "IFH Connects",
    links: [
      { label: "About us", href: "/#about" },
      { label: "Help centre", href: "/#faq" },
    ],
  },
];

export type City = { name: string; image: string };

export const CITIES: City[] = [
  { name: "Bengaluru", image: "/assets/img/1480714378408-67cf0d13bc1b-500.jpg" },
  { name: "Chennai", image: "/assets/img/1522708323590-d24dbb6b0267-500.jpg" },
  { name: "Mumbai", image: "/assets/img/1512917774080-9991f1c4c750-500.jpg" },
  { name: "Hyderabad", image: "/assets/img/1560448204-e02f11c3d0e2-500.jpg" },
  { name: "Pune", image: "/assets/img/1600596542815-ffad4c1539a9-500.jpg" },
  { name: "Coimbatore", image: "/assets/img/1502672260266-1c1ef2d93688-500.jpg" },
];

export type FaqItem = { q: string; a: string };

export const FAQ = {
  broker: {
    q: "Is there really no brokerage?",
    a: "No brokerage, ever. You browse and shortlist for free, and pay a fixed connection fee only when you choose to unlock an owner's contact details. The owner pays nothing and never owes a commission on rent.",
  },
  verified: {
    q: "What does “IFH verified” mean?",
    a: "That our team has checked the listing against ownership documents and confirmed the property exists as described. Verification covers the listing and the owner's identity — it is not a survey, and it does not inspect condition.",
  },
  reply: {
    q: "How quickly do owners reply?",
    a: "Most reply the same day. Owner response time is shown on each listing, so you can weigh it before you spend a connection on someone who has not logged in for a fortnight.",
  },
  deposit: {
    q: "What happens to my deposit?",
    a: "Deposits are agreed and paid directly between you and the owner — IFH never holds them. The listing shows the deposit in rupees before you connect, so it is never a surprise at signing.",
  },
  listingCost: {
    q: "I am an owner. What does listing cost?",
    a: "Nothing. Listing, photographs, enquiries and the owner dashboard are free, and there is no commission on your rent. We are paid by tenants who choose to connect.",
  },
} satisfies Record<string, FaqItem>;

/** All five questions, in the order used on Home and Why IFH. */
export const ALL_FAQS: FaqItem[] = [
  FAQ.broker,
  FAQ.verified,
  FAQ.reply,
  FAQ.deposit,
  FAQ.listingCost,
];

export type IconCard = {
  icon: IconName;
  title: string;
  text: string;
  variant?: "lime" | "sage" | "dark";
  wide?: boolean;
};
