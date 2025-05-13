import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SendIcon from "../../assets/send.svg";

function ChatWindow({ setChatMode }) {
  setChatMode(true);
  const { businessID } = useParams();
  const [messages, setMessages] = useState([]);
  const [botTyping, setBotTyping] = useState(false);
  const socketRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!businessID) return;

    const userChatURL = import.meta.env.VITE_USER_CHAT_BACKEND;
    const webSocketURL = userChatURL.concat("/", businessID);
    const socket = new WebSocket(webSocketURL);
    console.log("Websocket URL is:")
    console.log(webSocketURL)
    socketRef.current = socket;

    socket.onopen = () => console.log("Connected to WebSocket server!");

    socket.onmessage = (event) => {
      setBotTyping(false); // bot finished typing
      try {
        const parsedMessage = JSON.parse(event.data);
        setMessages((prev) => [...prev, parsedMessage]);
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    };

    socket.onerror = (error) => console.error("WebSocket error:", error);
    socket.onclose = () => console.log("WebSocket connection closed");

    return () => socket.close();
  }, [businessID]);

  const sendMessage = () => {
    const text = inputRef.current?.value?.trim();
    if (!text) return;

    const userMessage = { text, sender: "user" };
    socketRef.current?.send(JSON.stringify(userMessage));
    setMessages((prev) => [...prev, userMessage]);

    inputRef.current.value = "";
    setBotTyping(true); // simulate bot typing immediately after user sends
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-between p-2 sm:p-4">
      <div className="flex-1 w-full max-w-2xl overflow-y-auto border p-4 rounded bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded max-w-xs break-words ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-300 text-black self-start mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {botTyping && (
          <div className="flex gap-1 self-start ml-1 mt-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0s]"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl mt-2 flex gap-2">
        <input
          type="text"
          ref={inputRef}
          className="flex-1 px-4 py-2 rounded-md bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[var(--button)]"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
        >
          <img src={SendIcon} alt="Send" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
