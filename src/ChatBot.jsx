import { useState } from 'react';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { text: "Bonjour 👋 ! Pose-moi une question sur les plats 🍽️", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      const botReply = { text: data.reply || "🤖 MenuBot n’a pas pu répondre pour le moment.", sender: "bot" };
      setMessages(prev => [...prev, botReply]);
    } catch (err) {
      console.error("Erreur de requête :", err);
      setMessages(prev => [
        ...prev,
        { text: "❌ Erreur de connexion à MenuBot.", sender: "bot" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border shadow-lg rounded-xl w-80 z-50">
      <div className="p-3 border-b font-bold text-center bg-gray-100 rounded-t-xl">MenuBot 🤖</div>
      <div className="h-64 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`text-sm p-2 rounded-md whitespace-pre-wrap ${
              msg.sender === 'bot'
                ? 'bg-gray-200 text-left'
                : 'bg-blue-100 text-right'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-500 italic">MenuBot réfléchit...</div>
        )}
      </div>
      <div className="flex border-t p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 text-sm p-1 border rounded"
          placeholder="Pose ta question..."
        />
        <button
          onClick={handleSend}
          className="ml-2 px-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={loading}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
