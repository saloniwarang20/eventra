import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from "../context/AppContext";
import io from "socket.io-client";
import axios from 'axios';

const Chat = ({eventId}) => {
  const { backendUrl, userData } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Connect to socket
  useEffect(() => {
    socketRef.current = io(backendUrl, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current.emit("join_room", eventId);

    socketRef.current.on("receive_message", (data) => {
      setMessages((prev) => {
        if(prev.some((msg) => msg._id === data._id)) return prev;
        return [...prev, data]
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [backendUrl, eventId]);

  // Fetch old messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/chat/${eventId}/messages`, {
          withCredentials: true,
        });
        if (res.data.success) setMessages(res.data.data);
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [backendUrl, eventId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send new message
  const handleSend = async () => {
    if (!newMsg.trim()) return;
    try {
      const res = await axios.post(
        `${backendUrl}/api/chat/${eventId}/send`,
        { message: newMsg },
        { withCredentials: true }
      );
      if (res.data.success) {
        const messageData = res.data.data;
        socketRef.current.emit("send_message", messageData);
        setNewMsg("");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (loading)
    return <div className="text-center text-gray-500 p-4">Loading chat...</div>;

// className='flex flex-col h-[550px] bg-gray-50 rounded-lg shadow-inner'
  return (
    <div className='h-[500px] bg-gray-200 rounded-lg flex flex-col overflow-hidden'>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4" style={{scrollBehavior: "smooth"}}>
        {messages.map((msg, i) => {
          const isMine = msg.sender?._id === userData?._id || msg.sender === userData?._id;
          return (
            <div
              key={i}
              className={`flex ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-xl text-sm shadow-sm ${
                  isMine
                    ? "bg-gradient-to-r from-orange-500 to-rose-700 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                {!isMine && (
                  <p className="text-xs font-semibold text-rose-700 mb-1">
                    {msg.sender?.name || "Anonymous"}
                  </p>
                )}
                <p>{msg.message}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white flex items-center gap-3 border-t border-gray-300">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className=" bg-gradient-to-r from-orange-500 to-rose-800 text-white px-4 py-2 rounded-md ml-3 hover:opacity-90 transition"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat
