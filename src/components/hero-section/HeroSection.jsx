import { motion } from "framer-motion";
import ChatPreview from "./ChatPreview";
import MenuGenieLogo from "../util-components/MenuGenieLogo";

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] px-4 sm:px-6 py-16 bg-[var(--background)] overflow-hidden">
      {/* Floating Badge */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 bg-yellow-400 text-black px-3 py-1 rounded-full shadow font-semibold text-xs sm:text-sm animate-bounce">
        In Beta ✨ AI Chatbot
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
            <span className="text-[var(--textMain)]">AI-Powered Genie</span> is
            Here
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-[var(--textSecondary)] font-inter mb-6"
          >
            Turn menus into smart conversations. Let customers ask, and explore
            — all through your custom chatbot.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 order-2"
          >
            <a
              href="/signup"
              className="inline-block px-6 py-3 rounded-full bg-[var(--button)] text-black font-semibold hover:bg-[var(--button-hover)] transition"
            >
              Get Started for Free
            </a>
          </motion.div>

          <ul className="text-[var(--textMain)] space-y-3 text-sm sm:text-base">
            <li className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 bg-green-500 rounded-full"></span>
              Menu-aware AI chatbot that understands every menu item
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 bg-green-500 rounded-full"></span>
              Instantly share via QR code — no app required
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 bg-green-500 rounded-full"></span>
              Add detailed info to each menu item: sizes, tags, dietary notes &
              more
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 bg-green-500 rounded-full"></span>
              Fully customizable bot name, personality & look
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 bg-green-500 rounded-full"></span>
              Designed for cafes, restaurants, food trucks, and ghost kitchens
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 bg-green-500 rounded-full"></span>
              Setup in minutes with drag-and-drop image & text upload
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

      {/* Beta Banner */}
      <div className="mt-10 text-center">
        <div className="inline-block px-4 py-2 bg-[var(--button)] text-white rounded-full font-medium shadow-sm text-sm sm:text-base">
          🚀 Menu Genie is currently in <strong>Beta</strong> — and{" "}
          <span className="underline">completely free</span> to use!
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
