const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');

// 💡 Analyse intelligente du texte vocal
function buildMongoFilter(text) {
  text = text.toLowerCase();
  const filter = {};

  // 🌍 Traductions des origines
  const originMap = {
    france: 'France',
    italie: 'Italy',
    italy: 'Italy',
    japon: 'Japan',
    japan: 'Japan',
    mexique: 'Mexico',
    mexico: 'Mexico',
    "états-unis": "United States",
    etatsunis: "United States",
    usa: "United States"
  };

  const foundKey = Object.keys(originMap).find(k => text.includes(k));
  if (foundKey) {
    filter.origin = originMap[foundKey];
  }

  // 🥗 Catégories
  if (text.includes("végétarien") || text.includes("sans viande")) {
    filter.category = /végétarien/i;
  }

  // ❌ Allergènes à exclure
  const allergensToExclude = [];
  if (text.includes("sans gluten")) allergensToExclude.push("Gluten");
  if (text.includes("sans dairy") || text.includes("sans lactose")) allergensToExclude.push("Dairy");

  if (allergensToExclude.length > 0) {
    filter.allergens = { $nin: allergensToExclude };
  }

  // 🍗 Ingrédients ou Calories légères
  const keywords = ['chicken', 'salmon', 'beef', 'tofu'];
  const foundIngredient = keywords.find(k => text.includes(k));
  const isLight = text.includes("léger") || text.includes("light") || text.includes("pas trop lourd");

  if (foundIngredient || isLight) {
    filter.ingredients = { $elemMatch: {} };
    if (foundIngredient) {
      filter.ingredients.$elemMatch.name = new RegExp(foundIngredient, 'i');
    }
    if (isLight) {
      filter.ingredients.$elemMatch.calories = { $lte: 400 };
    }
  }

  return filter;
}

// 📦 POST /voice
router.post('/', async (req, res) => {
  const { speechText } = req.body;
  if (!speechText) {
    return res.status(400).json({ error: 'Texte vocal requis.' });
  }

  const filter = buildMongoFilter(speechText);

  try {
    const recipes = await Recipe.find(filter).select('name category origin description image price');
    console.log("🔍 Recettes filtrées :", recipes);
    res.json({ filteredMenu: recipes });
  } catch (error) {
    console.error("❌ Erreur MongoDB :", error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
