const PlacedOrder = require("../models/PlacedOrder");
const Recipe = require("../models/Recipe");

// Convertit un mot en nombre
function wordToNumber(word) {
  const map = {
    "un": 1, "une": 1,
    "deux": 2,
    "trois": 3,
    "quatre": 4,
    "cinq": 5,
    "six": 6,
    "sept": 7,
    "huit": 8,
    "neuf": 9,
    "dix": 10,
  };
  return map[word.toLowerCase()] || null;
}

// Nettoyage du texte vocal
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, "") // enlève ponctuation
    .replace(/\b(svp|sil te plait|sil vous plait|plait)\b/gi, "")
    .replace(/\b(je veux|je voudrais|peux tu|rajoute|commande|commander|mets moi|je prends)\b/gi, "ajoute")
    .replace(/\b(de la|du|des|la|le|un|une|tout|seul|je|veux|prendre|non)\b/gi, "")
    .replace(/\b(ajoute)\b\s*\b(ajoute)\b/gi, "ajoute") // supprime "ajoute ajoute"
    .replace(/\s+/g, " ")
    .trim();
}

// Extraction d'infos depuis le texte
function extractInfo(text) {
  const cleaned = normalizeText(text);
  console.log("🧼 Texte nettoyé :", cleaned);

  const regex = /\bajoute\b\s*(\d+|\w+)?\s*(.+)/i;
  const match = cleaned.match(regex);

  if (!match) {
    console.warn("❌ Aucune correspondance avec la regex !");
    return null;
  }

  let quantity = 1;
  const possibleNumber = match[1]?.trim();

  if (possibleNumber) {
    const parsed = parseInt(possibleNumber);
    const converted = wordToNumber(possibleNumber);
    quantity = !isNaN(parsed) ? parsed : (converted || 1);
  }

  const phrase = match[2].trim();
  const stopWords = ["svp", "plait", "sil", "vous", "te"];
  const mots = phrase.split(" ").filter(m => !stopWords.includes(m));

  if (mots.length === 0) return null;

  const item = mots.join(" ");
  return { action: "add", quantity, item };
}

// Contrôleur principal
exports.handleVoiceCommand = async (req, res) => {
  const { text } = req.body;
  console.log("📥 Texte reçu du frontend :", text);

  if (!text) {
    console.warn("⚠️ Aucun texte reçu");
    return res.status(400).json({ error: "Texte manquant" });
  }

  const result = extractInfo(text);
  console.log("🔍 Résultat de extractInfo =", result);

  if (!result || !result.item) {
    console.warn("⚠️ Item non reconnu :", result);
    return res.status(422).json({ error: "Commande non comprise ou plat non précisé" });
  }

  try {
    const userId = "66436a0dc1f0a4306c7b4e58"; // exemple fixe
    console.log("👤 Utilisateur ID :", userId);
    console.log("🔎 Recherche MongoDB avec :", result.item);

    const searchWords = result.item.split(" ");
    let matchedRecipe = null;

    for (let i = 0; i < searchWords.length; i++) {
      const attempt = searchWords.slice(i).join(" ");
      console.log(`🔍 Tentative avec : "${attempt}"`);

      matchedRecipe = await Recipe.findOne({
        $or: [
          { name: { $regex: new RegExp(attempt, "i") } },
          { alias: { $regex: new RegExp(attempt, "i") } },
        ],
      });

      if (matchedRecipe) break;
    }

    if (!matchedRecipe) {
      console.warn("❌ Recette introuvable pour les mots :", searchWords);
      return res.status(404).json({ error: `Recette "${result.item}" non trouvée` });
    }

    console.log("✅ Recette trouvée :", matchedRecipe.name);

    const newOrder = new PlacedOrder({
      userId,
      items: [{
        name: matchedRecipe.name,
        quantity: result.quantity,
        price: matchedRecipe.price,
      }],
      total: result.quantity * matchedRecipe.price,
      noteCommande: `Commande vocale : ${matchedRecipe.name}`,
      isGroupOrder: false,
    });

    await newOrder.save();
    console.log("💾 Commande enregistrée :", newOrder);

    return res.status(201).json({
      message: `✔️ ${result.quantity} ${matchedRecipe.name}(s) ajouté(s) avec succès !`,
      order: newOrder,
    });

  } catch (err) {
    console.error("🔥 Erreur serveur :", err);
    return res.status(500).json({ error: "Erreur serveur lors de la commande vocale" });
  }
};
