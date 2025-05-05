const axios = require("axios");

const askMenuBot = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message manquant." });
  }

  try {
    const response = await axios.post("http://localhost:11434/api/chat", {
      model: "llama3",
      stream: false, // ← très important pour avoir tout d'un coup
      messages: [
        { role: "system", content: "Tu es MenuBot, expert en cuisine. Réponds simplement." },
        { role: "user", content: message }
      ],
  options: {
    num_predict: 100 // ✅ limite la taille de la réponse (~80 mots)
  }
    });

    console.log("📦 Réponse complète :", response.data);

    const botReply = response.data.message?.content;

    if (!botReply) {
      return res.status(500).json({ error: "Aucune réponse générée par MenuBot 🤖" });
    }

    res.status(200).json({ reply: botReply });

  } catch (error) {
    console.error("❌ Erreur Ollama:", error.message);
    res.status(500).json({ error: "Erreur de communication avec MenuBot 🤖" });
  }
};

module.exports = { askMenuBot };
