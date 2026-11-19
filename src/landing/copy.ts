/* All visible words on the owner landing page. Simple English / Tanglish only.
   The only Tamil-script line allowed is `brandLine`. */

export const copy = {
  meta: {
    title: "IFH - நம்ம ஊரு App | First 500 owners post free",
    description: "Post your house free. Zero commission. Only verified tenants see your number.",
  },

  brandLine: "நம்ம ஊரு App",

  topBar: {
    logoLabel: "IFH - I Find House",
    seatsSuffix: "left",
    seatsGone: "All taken",
  },

  hero: {
    titleLines: ["Veedu gaaliya", "irukka?"],
    sub: "Post your house free. Get a good tenant.",
    photoTag: "Your house",
    /** One message per hero photo (same order as config.heroSlides). Simple English. */
    notes: [
      { avatar: "K", title: "Karthik wants to see your house", verified: true, meta: "Just now" },
      { icon: "heart", title: "25 people liked your house", meta: "This week" },
      { avatar: "P", title: "Priya: Is the house still free?", verified: true, meta: "2 min ago" },
      { icon: "calendar", title: "House visit fixed: Sunday, 11 AM", verified: true, meta: "Arun" },
      { icon: "rupee", title: "Deal done! ₹0 paid to broker", meta: "Today" },
    ],
    points: ["₹0 broker commission", "Only verified tenants can call", "Your number stays hidden"],
    cta: "Free-ah Post Pannunga",
    counterLabel: "free spots left",
    counterGone: "All 500 free spots taken",
    counterUnavailable: "First 500 owners free",
    time: "Takes 1 minute",
  },

  zero: {
    kicker: "No more",
    bigLine: "1 MONTH RENT",
    toBroker: "to the broker.",
    payoff: "Unga rent. Full-ah ungalukku.",
  },

  privacy: {
    titleLines: ["Unga veedu.", "Unga rules."],
    steps: [
      "Photos upload pannunga",
      "Neenga choose panra photos mattum show aagum",
      "Phone number & location hidden",
      "Verified tenants mattum paakalaam",
    ],
    trust: "KYC verified tenants only.",
    mock: {
      title: "Unga listing",
      hiddenNumber: "+91 ••••• •••••",
      shownNumber: "+91 98765 43210",
      locationLabel: "Location hidden",
      kyc: "KYC Verified",
      shown: "Shown",
    },
  },

  form: {
    titleLines: ["Unga spot-ah", "lock pannunga."],
    waitlistTitleLines: ["Join the", "waitlist."],
    counterSuffix: "free spots left",
    counterGone: "All 500 free spots taken",
    stepOf: (n: number) => `Step ${n} of 2`,
    name: { label: "Your name", placeholder: "Eg. Murugan" },
    phone: { label: "Phone number", placeholder: "10 digit number" },
    town: { label: "Town", placeholder: "Choose your town", sheetTitle: "Unga town?" },
    next: "Next",
    location: {
      label: "House location",
      placeholder: "Area / street",
      useMine: "Use my location",
      locating: "Finding you...",
      added: "Location added",
      denied: "Location not allowed. Type the area instead.",
    },
    when: { label: "When is the house free?", options: ["Now", "Within 1 month", "Later"] },
    photos: {
      label: "House photos",
      optional: "Optional",
      add: "Add photos",
      hint: "Up to 10",
      remove: "Remove photo",
    },
    consent: "Send my confirmation on WhatsApp",
    back: "Back",
    submit: "Lock my free spot",
    submitWaitlist: "Notify me",
    saving: "Saving...",
    errors: {
      name: "Enter your name",
      phone: "Enter 10 digit number",
      phoneStart: "Number should start with 6, 7, 8 or 9",
      town: "Choose your town",
      location: "Type your area or tap Use my location",
      when: "Choose one",
      network: "Could not save. Check internet and try again.",
    },
    success: {
      title: (n: number) => `Done! Unga spot #${n} locked.`,
      waitlistTitle: "Done! You are on the waitlist.",
      whatsapp: "WhatsApp-la confirmation varum.",
      noWhatsapp: "We will call you soon.",
      openWhatsapp: "Open WhatsApp",
      waText: (name: string) => `Hi IFH, I just signed up. My name is ${name}.`,
    },
  },

  footer: {
    name: "IFH - I Find House",
    privacy: "Privacy",
    terms: "Terms",
    help: "WhatsApp help",
  },

  sticky: {
    seatsSuffix: "free spots left",
    seatsGone: "Free spots over",
    cta: "Post Free",
    ctaGone: "Notify me",
  },
} as const;
