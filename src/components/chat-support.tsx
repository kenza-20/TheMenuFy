export {};

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: Date;
  }
}

import React, { useState, useEffect } from "react";


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
  const [tawkLoaded, setTawkLoaded] = useState(false);
 
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
  

  

   

 

  return (
    <>
      </>
  );
};

export default ChatSupport;
