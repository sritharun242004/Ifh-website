import type Lenis from "lenis";

/* Holds the single Lenis instance so other client components (e.g. the mobile
   drawer) can pause smooth scrolling while they are open. */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}