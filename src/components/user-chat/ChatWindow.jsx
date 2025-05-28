import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SendIcon from "../../assets/send.svg";
import ReactMarkdown from "react-markdown";
import { supabaseClient } from "../../supabase-utils/SupaBaseClient";
import MenuImagePreviewStack from "./MenuImagePreviewStack";

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
  const [socketClosed, setSocketClosed] = useState(false);

  const [businessInfo, setBusinessInfo] = useState({
    name: "",
    bot_name: "",
    logoUrl: "",
  });

  const [menuImages, setMenuImages] = useState([]);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const minSwipeDistance = 50;
    const distance = touchStartX.current - touchEndX.current;

    if (distance > minSwipeDistance && activeIndex < menuImages.length - 1) {
      setActiveIndex((prev) => prev + 1);
      setImageLoading(true);
    } else if (distance < -minSwipeDistance && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
      setImageLoading(true);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

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

      if (error || !data) {
        console.error("Business not found:", error);
        navigate("/404", { replace: true });
        return;
      }

      const logoPath = `business_logo/${businessID}.png`;
      const {
        data: { publicUrl: logoUrl },
      } = supabaseClient.storage.from("business").getPublicUrl(logoPath);

      const logoExists = await fetch(logoUrl, { method: "HEAD" });
      const finalLogoUrl = logoExists.ok
        ? logoUrl
        : supabaseClient.storage
            .from("business")
            .getPublicUrl("menu_genie_logo_default.png").data.publicUrl;

      setBusinessInfo({
        name: data.name,
        bot_name: data.bot_name,
        logoUrl: finalLogoUrl,
      });
    };

    const fetchMenuImages = async () => {
      const { data, error } = await supabaseClient.storage
        .from("business")
        .list(`business_menu/${businessID}/`);

      if (error) return;

      const images = data
        .filter((f) => f.name.startsWith("menu_"))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(
          (file) =>
            `${
              import.meta.env.VITE_SUPABASE_URL
            }/storage/v1/object/public/business/business_menu/${businessID}/${
              file.name
            }`
        );

      setMenuImages(images);
    };

    fetchBusinessInfo();
    fetchMenuImages();
  }, [businessID, navigate]);

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

    socket.onerror = (err) => console.error("WebSocket error:", err);
    socket.onclose = () => {
      console.warn("WebSocket closed");
      setSocketClosed(true);
    };

    return () => {
      socket.onclose = null;
      socket.close();
    };
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

    setMessages((prev) => [
      ...prev,
      { text, sender: "user", time: new Date() },
    ]);
    inputRef.current.value = "";
    setBotTyping(true);
    wsRef.current.send(JSON.stringify({ text }));
  };

  const reconnectSocket = () => {
    setSocketClosed(false); // hide banner

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

    socket.onerror = (err) => console.error("WebSocket error:", err);
    socket.onclose = () => {
      console.warn("WebSocket closed again");
      setSocketClosed(true); // show banner again if reconnect fails
    };
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[#f0f0f0] max-w-xl mx-auto">
      {socketClosed && (
        <div className="bg-yellow-100 text-yellow-900 px-4 py-3 text-sm text-center border-b border-yellow-300 shadow z-50">
          {businessInfo.bot_name || "Bot"} is away.
          <button
            onClick={reconnectSocket}
            className="underline text-[#075E54] font-medium ml-1"
          >
            Ring her in?
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {businessInfo.logoUrl && (
            <img
              src={businessInfo.logoUrl}
              alt="Business Logo"
              className="w-8 h-8 rounded-full border object-cover"
            />
          )}
          <div className="flex flex-col">
            <span className="text-base font-semibold">
              {businessInfo.bot_name} from {businessInfo.name}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`h-2 w-2 rounded-full ${
                  socketClosed ? "bg-gray-400" : "bg-green-400"
                }`}
              />
              <span className="text-xs text-white">
                {socketClosed ? "away" : "online"}
              </span>
            </div>
            {botTyping && (
              <span className="text-xs text-green-200 animate-pulse">
                typing...
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            setShowMenuModal(true);
            setActiveIndex(0);
            setImageLoading(true);
          }}
          className="text-sm bg-white text-[#075E54] px-3 py-1 rounded-full font-medium hover:bg-gray-100 transition"
        >
          View Menu
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && !botTyping && (
          <div className="text-center text-gray-500 mt-8">
            Any Questions on the menu? ask {" "}
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

        {menuImages.length > 0 && (
          <MenuImagePreviewStack
            menuImages={menuImages}
            onClickPreview={() => {
              setShowMenuModal(true);
              setActiveIndex(0);
              setImageLoading(true);
            }}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
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

      {/* Menu Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Pills */}
            <div className="absolute top-4 flex gap-2 z-20">
              {menuImages.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 w-8 rounded-full transition ${
                    i === activeIndex ? "bg-white" : "bg-gray-500 bg-opacity-50"
                  }`}
                />
              ))}
            </div>

            {/* Arrows (desktop only) */}
            {activeIndex > 0 && (
              <button
                onClick={() => {
                  setActiveIndex((prev) => prev - 1);
                  setImageLoading(true);
                }}
                className="hidden md:flex absolute left-4 text-white bg-[#075E54] text-3xl z-20 p-2 hover:bg-black/30 rounded-full"
              >
                ‹
              </button>
            )}
            {activeIndex < menuImages.length - 1 && (
              <button
                onClick={() => {
                  setActiveIndex((prev) => prev + 1);
                  setImageLoading(true);
                }}
                className="hidden md:flex absolute right-4 text-white bg-[#075E54] text-3xl z-20 p-2 hover:bg-black/30 rounded-full"
              >
                ›
              </button>
            )}

            {/* Fullscreen Image with Swipe Support */}
            <div
              className="relative flex items-center justify-center w-full h-full"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <img
                src={`${menuImages[activeIndex]}?t=${Date.now()}`}
                alt={`Menu ${activeIndex + 1}`}
                className={`max-h-[90vh] max-w-[90vw] object-contain rounded shadow transition-opacity duration-300 ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setImageLoading(false)}
              />
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowMenuModal(false)}
              className="absolute top-4 right-4 text-white text-2xl font-bold bg-black bg-opacity-50 rounded-full px-2 hover:bg-opacity-80 z-20"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
