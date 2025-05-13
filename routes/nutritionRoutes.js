// routes/nutritionRoutes.js
const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe'); // Supposons que vous avez un modèle Recipe

// Récupérer tous les ingrédients uniques depuis les recettes
router.get('/ingredients', async (req, res) => {
  try {
    const recipes = await Recipe.find().select('ingredients');
    const allIngredients = recipes.flatMap(recipe => recipe.ingredients);
    
    // Filtrer les doublons par nom
    const uniqueIngredients = Array.from(new Set(allIngredients.map(i => i.name)))
      .map(name => allIngredients.find(i => i.name === name));

    res.json(uniqueIngredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculer la nutrition pour une liste d'ingrédients
router.post('/nutrition', async (req, res) => {
  try {
    const { foodItems } = req.body;
    const recipes = await Recipe.find().select('ingredients');

    const nutritionData = recipes.flatMap(recipe => recipe.ingredients)
      .filter(ing => foodItems.includes(ing.name))
      .reduce((acc, ing) => {
        acc.calories += ing.calories;
        acc.protein += ing.protein;
        acc.carbs += ing.carbs;
        acc.fat += ing.fat;
        return acc;
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    res.json(nutritionData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;