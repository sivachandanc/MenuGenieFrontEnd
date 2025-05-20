import { useEffect, useState, useRef } from "react";
import MenuGenieLogo from "../util-components/MenuGenieLogo";
import { motion, AnimatePresence } from "framer-motion";

const chatMessages = [
  { from: "user", text: "What’s your best coffee today?" },
  { from: "bot", text: "Our top pick: Jet Fuel Latte ☕️ — bold & smooth!" },
  { from: "user", text: "Can I get that with almond milk?" },
  { from: "bot", text: "Absolutely! Almond, oat, and soy are available." },
];

function ChatPreview() {
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingKey, setTypingKey] = useState(0); // forces reanimation
  const messageIndex = useRef(0);
  const loopTimeout = useRef(null);

  const showNextMessage = () => {
    const nextMsg = chatMessages[messageIndex.current];
    if (!nextMsg) return;

    if (nextMsg.from === "bot") {
      setIsTyping(true);
      setTypingKey((k) => k + 1); // trigger AnimatePresence re-render

      // First fade out typing
      loopTimeout.current = setTimeout(() => {
        setIsTyping(false);
        // Then fade in the message
        loopTimeout.current = setTimeout(() => {
          setDisplayedMessages((prev) => [...prev, nextMsg]);
          messageIndex.current++;
          loopTimeout.current = setTimeout(showNextMessage, 1000);
        }, 300); // slight delay between ... fade out and msg fade in
      }, 1000);
    } else {
      setDisplayedMessages((prev) => [...prev, nextMsg]);
      messageIndex.current++;
      loopTimeout.current = setTimeout(showNextMessage, 1000);
    }
  };

  useEffect(() => {
    showNextMessage();
    return () => clearTimeout(loopTimeout.current);
  }, []);

  useEffect(() => {
    if (messageIndex.current >= chatMessages.length && !isTyping) {
      loopTimeout.current = setTimeout(() => {
        setDisplayedMessages([]);
        messageIndex.current = 0;
        loopTimeout.current = setTimeout(showNextMessage, 800);
      }, 4000);
    }
  }, [displayedMessages, isTyping]);

  return (
    <div className="w-[300px] h-[420px] rounded-2xl bg-white shadow-xl flex flex-col overflow-hidden">
      {/* Banner/Header */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[var(--button)] text-black font-semibold border-b border-gray-200">
        <MenuGenieLogo />
        <span className="text-sm">MenuGenie Bot</span>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 space-y-4 flex flex-col">
        {displayedMessages.map((msg, index) => (
          <motion.div
            key={`${msg.text}-${index}`}
            className={`px-4 py-2 rounded-xl max-w-[80%] text-sm ${
              msg.from === "user"
                ? "bg-gray-100 self-end ml-auto"
                : "bg-green-100 self-start"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {msg.text}
          </motion.div>
        ))}

        <AnimatePresence>
          {isTyping && (
            <motion.div
              key={`typing-${typingKey}`}
              className="px-4 py-2 rounded-xl max-w-[80%] text-sm bg-green-100 self-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <span className="tracking-widest animate-pulse">...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ChatPreview;
