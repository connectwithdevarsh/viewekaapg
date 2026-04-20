import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import RoomsSection from "@/components/rooms-section";
import PricingSection from "@/components/pricing-section";
import LocationSection from "@/components/location-section";
import GallerySection from "@/components/gallery-section";
import ContactSection from "@/components/contact-section";
import WhatsAppButton from "@/components/whatsapp-button";
import Lightbox from "@/components/lightbox";
import { useState, useEffect } from "react";

export default function Home() {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    // Animate sections on scroll
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <RoomsSection />
        <PricingSection />
        <LocationSection />
        <GallerySection onImageClick={setLightboxImage} />
        <ContactSection />
      </main>
      <WhatsAppButton />
      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
