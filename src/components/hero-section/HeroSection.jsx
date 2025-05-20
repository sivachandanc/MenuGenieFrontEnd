import { motion } from "framer-motion";
import ChatPreview from "./ChatPreview";
import MenuGenieLogo from "../util-components/MenuGenieLogo";

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] px-4 sm:px-6 py-16 bg-[var(--background)] overflow-hidden">
      {/* Floating Badge */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 bg-yellow-400 text-black px-3 py-1 rounded-full shadow font-semibold text-xs sm:text-sm animate-bounce">
        New ✨ AI Chatbot
      </div>

      {/* Responsive Layout */}
      <div className="flex flex-col lg:flex-row justify-center lg:items-center text-center gap-10">
        {/* Text Content */}
        <div className="w-full lg:w-[52%] text-left max-w-2xl z-10 order-1">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--textMain)] font-inter leading-tight mb-6"
          >
            Your Restaurant’s
            <br />
            <span className="text-[var(--textMain)]">AI-Powered Genie</span> is Here
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-[var(--textSecondary)] font-inter mb-6"
          >
            Turn menus into smart conversations. Let customers order, ask, and explore — all through your custom chatbot.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 order-2"
          >
            <a
              href="#demo"
              className="w-full sm:w-auto text-center px-6 py-3 rounded-full bg-[var(--button)] text-black font-semibold shadow-md hover:shadow-lg hover:brightness-105 transition-all duration-200"
            >
              Try Demo
            </a>
            <a
              href="#book"
              className="w-full sm:w-auto text-center px-6 py-3 rounded-full border border-[var(--button)] text-[var(--textMain)] font-semibold hover:bg-[var(--button)] hover:text-black transition-all duration-200"
            >
              Book a Call
            </a>
          </motion.div>

          <ul className="text-[var(--textMain)] space-y-3 text-sm sm:text-base">
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
        </div>

        {/* Chat Preview */}
        <motion.div
          className="w-full max-w-[360px] mx-auto lg:w-[48%] flex justify-center z-10 order-2 lg:order-none"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ChatPreview />
        </motion.div>
      </div>

      {/* Glow backdrop */}
      <div className="absolute right-[10%] top-[25%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-[radial-gradient(circle,_rgba(255,255,255,0.08)_0%,_transparent_80%)] blur-3xl rounded-full z-0" />
    </section>
  );
}

export default HeroSection;
