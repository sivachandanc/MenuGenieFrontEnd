import { useRef, useState } from "react";
import { motion } from "framer-motion";

function ContactSection() {
  const formRef = useRef();
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    const name = form.name.value;
    const email = form.email.value;
    const message = form.message.value;

    setStatus("sending");

    const subject = `Contact Form - ${name}`;
    const text = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    try {
      const response = await fetch("https://kqweqqqwovofuvjvrwwk.supabase.co/functions/v1/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "sivachandan@proton.me", // Replace with your receiving email
          subject,
          text,
        }),
      });

      if (response.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Email send error:", err);
      setStatus("error");
    }
  };

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-20 bg-[var(--background)] text-[var(--textMain)]">
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

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block font-semibold mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--button)]"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--button)]"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block font-semibold mb-1">
              Message
            </label>
            <textarea
              name="message"
              rows="5"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--button)]"
              placeholder="How can we help you?"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-block bg-[var(--button)] text-black font-semibold px-6 py-3 rounded-full shadow hover:brightness-105 transition-all"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
            {status === "sent" && <p className="text-green-600 mt-2">✅ Message sent!</p>}
            {status === "error" && <p className="text-red-600 mt-2">❌ Failed to send message.</p>}
          </div>
        </form>
      </div>

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
