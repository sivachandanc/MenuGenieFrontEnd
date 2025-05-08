import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

function ChatWindow({setChatMode}) {
setChatMode(true)
  const { businessID: businessID } = useParams();
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!businessID) return;

    const userChatURL = import.meta.env.VITE_USER_CHAT_BACKEND;
    const webSocketURL = userChatURL.concat("/", businessID);
    const socket = new WebSocket(
      webSocketURL
    );
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to WebSocket server!");
    };

    socket.onmessage = (event) => {
      console.log("Received:", event.data);

      try {
        const parsedMessage = JSON.parse(event.data); // Expect { text, sender: "bot" }

        setMessages((prev) => [...prev, parsedMessage]);
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, [businessID]);

  const sendMessage = (text) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const userMessage = {
        text: text,
        sender: "user",
      };

      // Send structured user message
      socketRef.current.send(JSON.stringify(userMessage));

      // Immediately show the user message locally
      setMessages((prev) => [...prev, userMessage]);
    }
  };

  return (
    <div className="w-full max-w-md p-4 bg-white rounded shadow-md">
      <div className="h-64 overflow-y-scroll mb-4 border p-2 flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded max-w-xs ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end" // User: Right side
                : "bg-gray-300 text-black self-start" // Bot: Left side
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <button
        onClick={() => sendMessage("Hello from frontend!")}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Send Hello
      </button>
    </div>
  );
}

export default ChatWindow;
