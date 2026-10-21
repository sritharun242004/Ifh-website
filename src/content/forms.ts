import { CITIES } from "@/content/site";

/* Questionnaires for the tenant and property-owner enquiry forms.
   The same config drives the UI (LeadSection) and server-side validation (lib/leads). */

export type LeadKind = "tenant" | "owner";

export type Field =
  | {
      name: string;
      label: string;
      type: "text" | "email" | "tel";
      required?: boolean;
      hint?: string;
    }
  | { name: string; label: string; type: "select"; options: string[]; required?: boolean }
  | { name: string; label: string; type: "radio"; options: string[]; required?: boolean }
  | { name: string; label: string; type: "chips"; options: string[]; required?: boolean }
  | { name: string; label: string; type: "textarea"; required?: boolean };

const CITY_OPTIONS = [...CITIES.map((c) => c.name), "Other"];

export const FORMS: Record<
  LeadKind,
  { eyebrow: string; title: string; lead: string; submit: string; fields: Field[] }
> = {
  tenant: {
    eyebrow: "Tell us what you need",
    title: "Find your place",
    lead: "Share a few details and an IFH advisor will call you with verified options.",
    submit: "Get matching homes",
    fields: [
      { name: "name", label: "Full name", type: "text", required: true },
      {
        name: "mobile",
        label: "Mobile number",
        type: "tel",
        required: true,
        hint: "10-digit Indian mobile",
      },
      { name: "email", label: "Email (optional)", type: "email" },
      { name: "city", label: "City", type: "select", options: CITY_OPTIONS, required: true },
      { name: "locality", label: "Preferred area or locality", type: "text" },
      {
        name: "interests",
        label: "I'm interested in",
        type: "chips",
        required: true,
        options: ["Rental home", "Room / PG", "Holiday stay", "Hotel", "Office space"],
      },
      {
        name: "budget",
        label: "Monthly budget",
        type: "select",
        required: true,
        options: [
          "Under ₹10,000",
          "₹10,000 – ₹25,000",
          "₹25,000 – ₹50,000",
          "₹50,000 – ₹1,00,000",
          "Above ₹1,00,000",
        ],
      },
      {
        name: "moveIn",
        label: "When do you want to move in?",
        type: "radio",
        required: true,
        options: ["Immediately", "Within 1 month", "1–3 months", "Just exploring"],
      },
      {
        name: "occupants",
        label: "Who will stay?",
        type: "radio",
        options: ["Family", "Bachelors", "Working professional", "Company / team"],
      },
      { name: "notes", label: "Anything else we should know?", type: "textarea" },
    ],
  },
  owner: {
    eyebrow: "List your property",
    title: "Find your tenant",
    lead: "Tell us about your property and our team will help you list it, free of brokerage.",
    submit: "List my property",
    fields: [
      { name: "name", label: "Full name", type: "text", required: true },
      {
        name: "mobile",
        label: "Mobile number",
        type: "tel",
        required: true,
        hint: "10-digit Indian mobile",
      },
      { name: "email", label: "Email (optional)", type: "email" },
      {
        name: "city",
        label: "City of the property",
        type: "select",
        options: CITY_OPTIONS,
        required: true,
      },
      { name: "locality", label: "Locality", type: "text", required: true },
      {
        name: "interests",
        label: "What do you want to list?",
        type: "chips",
        required: true,
        options: [
          "Apartment / house",
          "Villa",
          "Room / PG",
          "Holiday stay",
          "Hotel",
          "Office space",
        ],
      },
      {
        name: "listingFor",
        label: "Listing for",
        type: "radio",
        required: true,
        options: ["Rent", "Lease", "Short stay", "Not sure yet"],
      },
      {
        name: "propertyCount",
        label: "How many properties?",
        type: "select",
        required: true,
        options: ["1", "2–5", "6–20", "More than 20"],
      },
      {
        name: "expectedRent",
        label: "Expected monthly rent",
        type: "select",
        options: [
          "Under ₹10,000",
          "₹10,000 – ₹25,000",
          "₹25,000 – ₹50,000",
          "₹50,000 – ₹1,00,000",
          "Above ₹1,00,000",
        ],
      },
      {
        name: "furnishing",
        label: "Furnishing",
        type: "radio",
        options: ["Unfurnished", "Semi-furnished", "Fully furnished"],
      },
      {
        name: "role",
        label: "You are the",
        type: "radio",
        required: true,
        options: ["Owner", "Property manager", "Builder / developer"],
      },
      { name: "notes", label: "Anything else we should know?", type: "textarea" },
    ],
  },
};
