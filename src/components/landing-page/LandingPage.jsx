import HeroSection from "../hero-section/HeroSection";
import AboutPage from "../about-page/AboutPage";
import FeaturesSection from "../features-page/FeaturesSection";
import ContactSection from "../contact-me/ContactSection";

function LandingPage() {
  return (
    <div className="h-screen overflow-y-scroll snap-mandatory snap-y scroll-smooth">
      <section className="min-h-screen snap-start snap-always">
        <HeroSection />
      </section>
      <section className="min-h-screen snap-start snap-always">
        <AboutPage />
      </section>
      <section className="min-h-screen snap-start snap-always">
        <FeaturesSection />
      </section>
      <section className="min-h-screen snap-start snap-always">
        <ContactSection />
      </section>
    </div>
  );
}

export default LandingPage;
