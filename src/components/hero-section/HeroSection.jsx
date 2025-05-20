import ChatPreview from "./ChatPreview";

function HeroSection() {
  return (
    <section className="min-h-[90vh] flex flex-col lg:flex-row justify-center lg:items-center items-start text-center px-4 py-16 bg-[var(--background)]">
      {/* Left Text Block */}
      <div className="w-full lg:w-[52%] text-left max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--textMain)] font-inter leading-tight mb-6">
          Your Restaurant’s
          <br />
          <span className="text-[var(--textMain)]">AI-Powered Genie</span> is
          Here
        </h1>

        <p className="text-lg sm:text-xl text-[var(--textSecondary)] font-inter mb-6">
          Turn menus into smart conversations. Let customers order, ask, and
          explore — all through your custom chatbot.
        </p>

        <ul className="text-[var(--textMain)] mb-8 space-y-3">
          <li className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 bg-green-500 rounded-full"></span>
            Menu-aware AI chatbot
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 bg-green-500 rounded-full"></span>
            Fully customizable
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 bg-green-500 rounded-full"></span>
            Works on your website & WhatsApp
          </li>
        </ul>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <a
            href="#demo"
            className="px-6 py-3 rounded-full bg-[var(--button)] text-black font-semibold shadow-md hover:shadow-lg hover:brightness-105 transition-all duration-200"
          >
            Try Demo
          </a>
          <a
            href="#book"
            className="px-6 py-3 rounded-full border border-[var(--button)] text-[var(--textMain)] font-semibold hover:bg-[var(--button)] hover:text-black transition-all duration-200"
          >
            Book a Call
          </a>
        </div>
      </div>

      {/* Right Visual Block */}
      <div className="w-full lg:w-[48%] mt-10 lg:mt-0 flex justify-center">
        <ChatPreview />
      </div>
    </section>
  );
}

export default HeroSection;
