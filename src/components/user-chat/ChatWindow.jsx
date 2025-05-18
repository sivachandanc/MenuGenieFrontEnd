import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import SendIcon from "../../assets/send.svg";
import ReactMarkdown from "react-markdown";
import { supabaseClient } from "../../supabase-utils/SupaBaseClient";

function ChatWindow({ setChatMode }) {
  setChatMode(true);
  const { businessID } = useParams();
  const [messages, setMessages] = useState([]);
  const [botTyping, setBotTyping] = useState(false);
  const inputRef = useRef(null);
  const sessionUUIDRef = useRef(null);

  const [businessInfo, setBusinessInfo] = useState({ name: "", bot_name: "" });

  useEffect(() => {
    const existingUUID = localStorage.getItem("sessionUUID");
    if (existingUUID) {
      sessionUUIDRef.current = existingUUID;
    } else {
      const newUUID = crypto.randomUUID();
      sessionUUIDRef.current = newUUID;
      localStorage.setItem("sessionUUID", newUUID);
    }
  }, []);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      if (!businessID) return;
      const { data, error } = await supabaseClient
        .from("business_chat_info")
        .select("name, bot_name")
        .eq("business_id", businessID)
        .single();

      if (!error && data) {
        setBusinessInfo({ name: data.name, bot_name: data.bot_name });
      } else {
        console.error("Failed to fetch business info:", error);
      }
    };

    fetchBusinessInfo();
  }, [businessID]);

  const sendMessage = async () => {
    const text = inputRef.current?.value?.trim();
    if (!text || !businessID) return;

    const userMessage = { text, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    inputRef.current.value = "";
    setBotTyping(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_USER_CHAT_BACKEND}/chat/${businessID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-ID": sessionUUIDRef.current,
        },
        body: JSON.stringify({ text }),
      });

      const botMessage = await res.json();
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Failed to get bot response:", err);
    } finally {
      setBotTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[#f0f0f0]">
      {/* WhatsApp-style Top Banner */}
      <div className="bg-[#075E54] text-white px-4 py-3 flex items-center shadow-md sticky top-0 z-10">
        <div className="text-lg font-semibold">
          {businessInfo.bot_name} from {businessInfo.name}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[70%] px-4 py-2 rounded-2xl shadow text-sm break-words ${
              msg.sender === "user"
                ? "ml-auto bg-[#DCF8C6] rounded-br-none"
                : "mr-auto bg-white rounded-bl-none"
            }`}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}

        {botTyping && (
          <div className="flex gap-1 ml-1 mt-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0s]" />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>

      {/* Input Field at Bottom */}
      <div className="bg-white p-3 flex items-center gap-2 border-t">
        <input
          ref={inputRef}
          type="text"
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E54] bg-gray-50"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-[#075E54] text-white p-2 rounded-full hover:bg-[#064d45]"
        >
          <img src={SendIcon} alt="Send" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
