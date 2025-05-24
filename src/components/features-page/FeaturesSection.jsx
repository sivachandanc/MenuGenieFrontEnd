import { motion } from "framer-motion";
import CutsomizeBotRep from "../../assets/customize_bot.png";
import QRIntegrationRep from "../../assets/qr_integration.png";
import MenuIntegration from "../../assets/menu_integration.png";

const features = [
  {
    title: "Customizable Chatbots",
    description:
      "Create chatbots tailored to your restaurant’s unique brand, including custom names and logos.",
    image: CutsomizeBotRep,
  },
  {
    title: "QR Code Integration",
    description:
      "Share your chatbot effortlessly with customers via QR codes, providing instant access to information.",
    image: QRIntegrationRep,
  },
  {
    title: "Menu Access",
    description:
      "Customers can easily access your full menu within the chatbot interface, making inquiries seamless.",
    image: MenuIntegration,
  },
];

function FeaturesSection() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-16 bg-[var(--background)]">
      <div className="text-center pb-6">
        <div className="inline-block px-4 py-2 bg-[var(--button)] text-white rounded-full font-medium shadow-sm text-sm sm:text-base">
          🚀 Menu Genie is currently in <strong>Beta</strong> — and{" "}
          <span className="underline">completely free</span> to use!
        </div>
      </div>

      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--textMain)] mb-6"
        >
          Key Features
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg text-[var(--textSecondary)] max-w-2xl mx-auto mb-12"
        >
          My Menu Genie offers a suite of powerful features to enhance your
          restaurant’s operations and customer satisfaction.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-5 text-center sm:text-left"
            >
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full max-h-48 object-contain rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-[var(--textMain)] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--textSecondary)]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
