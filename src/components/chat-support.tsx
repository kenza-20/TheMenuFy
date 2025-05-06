export {};

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: Date;
  }
}


import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, ChevronRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

interface ChatSupportProps {
  position?: "bottom-right" | "bottom-left";
  offset?: number;
  whatsappNumber?: string;
}

const ChatSupport: React.FC<ChatSupportProps> = ({
  position = "bottom-right",
  offset = 4,
  whatsappNumber = "+21611111111",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"livechat" | "whatsapp">("livechat");
  const [message, setMessage] = useState("");
  const [tawkLoaded, setTawkLoaded] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! How can we help you today?",
      isUser: false,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  useEffect(() => {
    const handleToggleChat = () => setIsOpen((prev) => !prev);
    document.addEventListener("toggle-chat-support", handleToggleChat);
    return () => document.removeEventListener("toggle-chat-support", handleToggleChat);
  }, []);

  useEffect(() => {
    if (!tawkLoaded && activeTab === "livechat") {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://embed.tawk.to/68162ac12a5b77190ef24c10/1iqb9e1rv";
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");
      document.body.appendChild(script);
  
      // Wait until Tawk_API is available
      script.onload = () => {
        setTawkLoaded(true);
        // Optionally expose it for global access (or context if needed)
        window.Tawk_API?.onLoad?.(() => {
          console.log("Tawk API loaded");
        });
      };
    }
  }, [activeTab, tawkLoaded]);
  

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      text: message,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    setTimeout(() => {
      const responseMessage = {
        text: "Thank you for your message. Our team will get back to you shortly.",
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, responseMessage]);
    }, 1000);
  };

  const handleWhatsAppRedirect = () => {
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/^\+/, "")}?text=${encodeURIComponent(
      "Hello! I need assistance with my order."
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const positionClass =
    position === "bottom-left"
      ? `left-${offset} bottom-${offset}`
      : `right-${offset} bottom-${offset}`;

  return (
    <>
      {/* <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`fixed ${positionClass} z-50 flex items-center justify-center w-14 h-14 rounded-full bg-yellow-500 text-black shadow-lg hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300`}
        onClick={() => setIsOpen(true)}
        aria-label="Open customer support chat"
      >
        <MessageSquare size={24} />
        <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full"></span>
      </motion.button> */}

      {/* <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed ${positionClass} z-[100] w-80 sm:w-96 h-[500px] max-h-[80vh] bg-black/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden`}
          > */}
            {/* Header */}
            {/* <div className="bg-yellow-500 text-black px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare size={20} />
                <h3 className="font-semibold">Customer Support</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-black/10 transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div> */}

            {/* Tabs */}
            {/* <div className="flex border-b border-white/10">
              <button
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  activeTab === "livechat"
                    ? "text-yellow-400 border-b-2 border-yellow-400"
                    : "text-white/70 hover:text-white"
                }`}
                onClick={() => setActiveTab("livechat")}
              >
                Live Chat
              </button>
              <button
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  activeTab === "whatsapp"
                    ? "text-yellow-400 border-b-2 border-yellow-400"
                    : "text-white/70 hover:text-white"
                }`}
                onClick={() => setActiveTab("whatsapp")}
              >
                WhatsApp
              </button>
            </div> */}

            {/* Content */}
            {/* <div className="flex-1 overflow-hidden">
              {activeTab === "livechat" ? (
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.isUser ? "bg-yellow-500 text-black" : "bg-white/10 text-white"
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-xs mt-1 opacity-70 text-right">{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t border-white/10">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 bg-white/10 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-white/50"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-yellow-500 text-black p-2 rounded-full hover:bg-yellow-400 transition-colors"
                        aria-label="Send message"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                    <p className="text-xs text-white/50 mt-2 text-center">
                      Our team typically responds within 10 minutes
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                    <FaWhatsapp size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">WhatsApp Support</h3>
                  <p className="text-white/70 mb-6">
                    Chat with our support team directly through WhatsApp for quick assistance
                  </p>
                  <button
                    onClick={handleWhatsAppRedirect}
                    className="bg-green-500 text-white px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-green-600 transition-colors"
                  >
                    <FaWhatsapp size={20} />
                    <span>Start WhatsApp Chat</span>
                    <ChevronRight size={16} />
                  </button>
                  <p className="text-xs text-white/50 mt-4">Available Monday-Friday, 9am-6pm</p>
                </div>
              )}
            </div> */}
          {/* </motion.div>
        )}
      </AnimatePresence> */}
    </>
  );
};

export default ChatSupport;
