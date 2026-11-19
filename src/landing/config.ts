/* Everything an operator might need to change on the owner landing page, in one place.
   Copy (words on screen) lives in ./copy.ts. */

export const config = {
  /** Total free spots in the launch offer. The number left is always computed from real sign-ups. */
  seatTotal: 500,

  /** Town options for the form (keep "Other" last). */
  towns: ["Tenkasi", "Tirunelveli", "Kanyakumari", "Nagercoil", "Thoothukudi", "Other"],

  /** WhatsApp number for the help link and "Open WhatsApp" button: country code + number, digits only.
   *  TODO(Madhan): replace with the real IFH business number. */
  whatsappNumber: "919952990508",

  /** Starting value of the ₹ count-down in Section 2. */
  sampleMonthlyRent: 10000,

  /** How often the live counter refreshes while the tab is visible. */
  seatRefreshMs: 30_000,

  /** Hero picture: these photos take turns (with the matching messages in copy.hero.notes, same order).
   *  Drop `<slot>.webp` (or .avif / .jpg) into /public/landing/; picked up automatically.
   *  Wide (3:2) photos of good, ordinary Indian homes. Current files are free Pexels photos
   *  (Pexels licence: free for commercial use, no credit needed). */
  heroSlides: [
    // focus (optional): which part of the photo stays in view when cropped, as CSS object-position
    { slot: "hero-3", alt: "A bright living room in a rented flat" },
    { slot: "hero-house", alt: "A two-storey house with red tiled roofs in Virudhunagar", focus: "50% 85%" },
    { slot: "hero-bedroom", alt: "A clean bedroom with a big window and tiled floor" },
    { slot: "hero-kitchen", alt: "An Indian kitchen with a black granite counter and gas stove" },
    { slot: "hero-living", alt: "A modern living room in a Coimbatore home" },
  ],

  /** "Unga veedu. Unga rules." phone mock: the owner's uploaded photos, all of ONE house
   *  (e.g. a 2BHK, room by room). Drop `<slot>.webp` / .jpg into /public/landing/; a missing
   *  file keeps the house-icon tile. `chosen` = the photos the owner picks to show (step 02),
   *  which are also the two a tenant sees (steps 03-04). Square-ish crops work best. */
  privacyPhotos: [
    { slot: "home-1", room: "Living room" },
    { slot: "home-2", room: "Building front" },
    { slot: "home-3", room: "Kitchen" },
    { slot: "home-4", room: "Bedroom 1" },
    { slot: "home-5", room: "Bedroom 2" },
    { slot: "home-6", room: "Bathroom" },
    { slot: "home-7", room: "Balcony" },
    { slot: "home-8", room: "Dining area" },
    { slot: "home-9", room: "Living room, other side" },
    { slot: "home-10", room: "Entrance" },
  ],
  privacyChosen: [0, 3],
} as const;
