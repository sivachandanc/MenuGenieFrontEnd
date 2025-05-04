function HeroSection() {
    return (
      <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4 bg-[var(--background)]">
        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl font-bold text-textMain font-interleading-tight mb-4">
          Build Smart Chatbots for Your Business
        </h1>
  
        {/* Subheading */}
        <p className="text-lg sm:text-xl text-textSecondary font-intermax-w-2xl mb-8">
          MenuGenie helps you create custom AI-powered chatbots tailored to your brand — without writing a single line of code.
        </p>
  
        {/* Call to Action Buttons */}
        <div className="flex gap-6">
          <a href="#get-started" className="px-6 py-3 rounded-lg bg-accent text-white font-semibold hover:opacity-90 transition">
            Get Started
          </a>
          <a href="#demo" className="px-6 py-3 rounded-lg border border-accent text-accent font-semibold hover:bg-accent hover:text-white transition">
            See Demo
          </a>
        </div>
      </section>
    );
  }
  
  export default HeroSection;
  