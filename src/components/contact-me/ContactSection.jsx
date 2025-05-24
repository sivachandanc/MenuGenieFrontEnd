import { motion } from "framer-motion";

function ContactSection() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-20 bg-[var(--background)] text-[var(--textMain)]">
      {/* Heading */}
      <div className="max-w-2xl mx-auto text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
        >
          Get in Touch
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg text-[var(--textSecondary)]"
        >
          We'd love to hear from you! Reach out with any questions, feedback, or partnership ideas.
        </motion.p>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block font-semibold mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--button)]"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--button)]"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block font-semibold mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows="5"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--button)]"
              placeholder="How can we help you?"
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="inline-block bg-[var(--button)] text-black font-semibold px-6 py-3 rounded-full shadow hover:brightness-105 transition-all"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>

      {/* Beta Tag */}
      <div className="text-center mt-12">
        <div className="inline-block px-4 py-2 bg-[var(--button)] text-white rounded-full font-medium shadow-sm text-sm sm:text-base">
          🚀 Menu Genie is currently in <strong>Beta</strong> — and{" "}
          <span className="underline">completely free</span> to use!
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
