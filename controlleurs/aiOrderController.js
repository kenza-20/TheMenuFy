// 📁 controllers/aiOrderController.js
const Recipe = require('../models/Recipe');
const axios = require('axios');

// 🧠 Gère une commande IA avec plats personnalisés choisis à partir de la base de données
const { generateStoryOllama } = require("../utils/generateStoryOllama");

const generateOrderStory = async (req, res) => {
  const { items, tone = "poétique" } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Aucun plat fourni." });
  }

  try {
    const story = await generateStoryOllama(items, tone);
    res.json({ story });
  } catch (err) {
    console.error("Erreur avec Ollama:", err.message);
    res.status(500).json({ error: "Erreur de génération IA avec Ollama." });
  }
};

module.exports = { generateAiOrderSummary: generateOrderStory };

