import HeroSection from "../hero-section/HeroSection";
import AboutPage from "../about-page/AboutPage";
import FeaturesSection from "../features-page/FeaturesSection";
import ContactSection from "../contact-me/ContactSection";

function LandingPage() {
  return (
    <div className="h-screen overflow-y-scroll scroll-smooth">
      <section className="min-h-screen">
        <HeroSection />
      </section>
      <section className="min-h-screen">
        <AboutPage />
      </section>
      <section className="min-h-screen">
        <FeaturesSection />
      </section>
      <section className="min-h-screen">
        <ContactSection />
      </section>
    </div>
  );
}

export default LandingPage;
