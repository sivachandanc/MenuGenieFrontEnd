import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ChatPreview from "./ChatPreview";
import MenuGenieLogo from "../util-components/MenuGenieLogo";

const testimonials = [
  {
    name: "Jet Café",
    quote: "This chatbot turned 30% of our site visitors into paying customers!",
    icon: "☕️"
  },
  {
    name: "Urban Taco",
    quote: "MenuGenie saved us hours each day answering the same questions.",
    icon: "🌮"
  },
  {
    name: "Brew Bros",
    quote: "Our online orders doubled in two weeks.",
    icon: "🍺"
  }
];

function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col lg:flex-row justify-center lg:items-center items-start text-center px-4 py-16 bg-[var(--background)] overflow-hidden">
      {/* Floating Badge */}
      <div className="absolute top-6 left-6 z-30 bg-yellow-400 text-black px-3 py-1 rounded-full shadow font-semibold text-sm animate-bounce">
        New ✨ AI Chatbot
      </div>

      {/* Testimonial Card */}
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[90%] sm:w-[400px] bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-md"
      >
        <div className="text-sm text-gray-700 font-medium">"{testimonials[index].quote}"</div>
        <div className="mt-2 text-xs text-gray-500">— {testimonials[index].name} {testimonials[index].icon}</div>
      </motion.div>

      {/* Left Text Block */}
      <div className="w-full lg:w-[52%] text-left max-w-2xl z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold text-[var(--textMain)] font-inter leading-tight mb-6"
        >
          Your Restaurant’s
          <br />
          <span className="text-[var(--textMain)]">AI-Powered Genie</span> is Here
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg sm:text-xl text-[var(--textSecondary)] font-inter mb-6"
        >
          Turn menus into smart conversations. Let customers order, ask, and explore — all through your custom chatbot.
        </motion.p>

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6"
        >
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
        </motion.div>
      </div>

      {/* Glow backdrop */}
      <div className="absolute right-[10%] top-[25%] w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(255,255,255,0.08)_0%,_transparent_80%)] blur-3xl rounded-full z-0" />

      {/* Right Visual Block */}
      <motion.div
        className="w-full lg:w-[48%] mt-10 lg:mt-0 flex justify-center z-10"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <ChatPreview />
      </motion.div>
    </section>
  );
}

export default HeroSection;