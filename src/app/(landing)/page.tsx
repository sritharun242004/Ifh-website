import { Footer } from "@/landing/components/Footer";
import { FormSection } from "@/landing/components/FormSection";
import { Hero } from "@/landing/components/Hero";
import { Intro } from "@/landing/components/Intro";
import { PrivacySection } from "@/landing/components/PrivacySection";
import { SeatsProvider } from "@/landing/components/SeatsProvider";
import { StickyCta } from "@/landing/components/StickyCta";
import { TopBar } from "@/landing/components/TopBar";
import { ZeroReveal } from "@/landing/components/ZeroReveal";
import { config } from "@/landing/config";
import { findSlotImage } from "@/landing/lib/slots";

export default function OwnerLandingPage() {
  // Resolved on the server (file lookup), passed down to the client-side phone mock.
  const homePhotos = config.privacyPhotos.map((p) => findSlotImage(p.slot));
  return (
    <SeatsProvider>
      <Intro />
      <TopBar />
      <main id="main">
        <Hero />
        <ZeroReveal />
        <PrivacySection photos={homePhotos} />
        <FormSection />
      </main>
      <Footer />
      <StickyCta />
    </SeatsProvider>
  );
}
