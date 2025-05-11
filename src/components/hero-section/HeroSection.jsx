function HeroSection() {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4 bg-[var(--background)]">
      {/* Heading */}
      <h1 className="text-5xl sm:text-6xl font-bold text-[var(--textMain)] font-inter leading-tight mb-4">
        Build Smart Chatbots for Your Business
      </h1>

      {/* Subheading */}
      <p className="text-lg sm:text-xl text-[var(--textSecondary)] font-inter max-w-2xl mb-8">
        MenuGenie helps you create custom AI-powered chatbots tailored to your
        brand — without writing a single line of code.
      </p>

      {/* Call to Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Get Started – Soft gradient style */}
        <a
          href="#get-started"
          className="px-6 py-3 rounded-full bg-[var(--button)] text-black font-semibold shadow-md hover:shadow-lg hover:brightness-105 transition-all duration-200"
        >
          Get Started
        </a>

      </div>
    </section>
  );
}

export default HeroSection;
