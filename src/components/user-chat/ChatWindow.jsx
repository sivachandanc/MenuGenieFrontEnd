import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SendIcon from "../../assets/send.svg";
import ReactMarkdown from "react-markdown";
import { supabaseClient } from "../../supabase-utils/SupaBaseClient";

function ChatWindow({ setChatMode }) {
  setChatMode(true);
  const { businessID } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [botTyping, setBotTyping] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const sessionUUIDRef = useRef(null);
  const wsRef = useRef(null);

  const [businessInfo, setBusinessInfo] = useState({
    name: "",
    bot_name: "",
    logoUrl: "",
  });

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
        .select("name, bot_name, user_id")
        .eq("business_id", businessID)
        .single();

      if (error || !data) {
        console.error("Business not found:", error);
        navigate("/404", { replace: true });
        return;
      }

      const filePath = `business_logo/${businessID}.png`;
      const {
        data: { publicUrl },
      } = supabaseClient.storage.from("business").getPublicUrl(filePath);

      const res = await fetch(publicUrl, { method: "HEAD" });
      const finalUrl = res.ok
        ? publicUrl
        : supabaseClient.storage
            .from("business")
            .getPublicUrl("menu_genie_logo_default.png").data.publicUrl;

      setBusinessInfo({
        name: data.name,
        bot_name: data.bot_name,
        logoUrl: finalUrl,
      });
    };

    fetchBusinessInfo();
  }, [businessID, navigate]);

  // WebSocket connection setup
  useEffect(() => {
    if (!businessID || !sessionUUIDRef.current) return;

    const socket = new WebSocket(
      `${
        import.meta.env.VITE_USER_CHAT_BACKEND_WS
      }/chat/${businessID}?session=${sessionUUIDRef.current}`
    );

    wsRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.text) {
          setMessages((prev) => [
            ...prev,
            { text: data.text, sender: "bot", time: new Date() },
          ]);
        }
      } catch (err) {
        console.error("WebSocket message parse error:", err);
      } finally {
        setBotTyping(false);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => socket.close();
  }, [businessID]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, botTyping]);

  const sendMessage = () => {
    const text = inputRef.current?.value?.trim();
    if (
      !text ||
      !businessID ||
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN
    )
      return;

    const userMessage = { text, sender: "user", time: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    inputRef.current.value = "";
    setBotTyping(true);

    wsRef.current.send(JSON.stringify({ text }));
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[#f0f0f0] max-w-xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#075E54] text-white px-4 py-3 flex items-center shadow-md sticky top-0 z-10 gap-3">
        {businessInfo.logoUrl && (
          <img
            src={businessInfo.logoUrl}
            alt="Business Logo"
            className="w-8 h-8 rounded-full border border-white object-cover"
          />
        )}
        <div className="flex flex-col">
          <span className="text-base font-semibold">
            {businessInfo.bot_name} from {businessInfo.name}
          </span>
          {botTyping && (
            <span className="text-xs text-green-200 animate-pulse">
              typing...
            </span>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && !botTyping && (
          <div className="text-center text-gray-500 mt-8">
            Start a conversation with{" "}
            <span className="font-medium">{businessInfo.bot_name}</span>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender !== "user" && businessInfo.logoUrl && (
              <img
                src={businessInfo.logoUrl}
                className="w-6 h-6 rounded-full object-cover"
                alt="bot"
              />
            )}
            <div
              className={`relative max-w-[70%] px-4 py-2 rounded-2xl shadow text-sm break-words transition-all duration-300 ${
                msg.sender === "user"
                  ? "bg-[#DCF8C6] rounded-br-none"
                  : "bg-white rounded-bl-none"
              }`}
              title={msg.time ? new Date(msg.time).toLocaleTimeString() : ""}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}

        {botTyping && (
          <div className="flex gap-1 ml-1 mt-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0s]" />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white px-3 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] flex items-center gap-2 border-t">
        <input
          ref={inputRef}
          type="text"
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E54] bg-gray-50"
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={botTyping}
          className={`bg-[#075E54] text-white p-2 rounded-full hover:bg-[#064d45] transition ${
            botTyping ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <img src={SendIcon} alt="Send" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
