const express = require('express');
const router = express.Router();

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



/**
 * @swagger
 * tags:
 *   name: Ingredients
 *   description: Gestion des ingrédients et de la nutrition des recettes
 * 
 * components:
 *   schemas:
 *     Ingredient:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         calories:
 *           type: number
 *         protein:
 *           type: number
 *         carbs:
 *           type: number
 *         fat:
 *           type: number
 * 
 *     NutritionData:
 *       type: object
 *       properties:
 *         calories:
 *           type: number
 *         protein:
 *           type: number
 *         carbs:
 *           type: number
 *         fat:
 *           type: number
 * 
 *     IngredientArray:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Ingredient'
 * 
 * paths:
 *   /nutrition/ingredients:
 *     get:
 *       summary: Récupère tous les ingrédients uniques depuis les recettes
 *       tags: [Ingredients]
 *       responses:
 *         200:
 *           description: Liste des ingrédients uniques
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/IngredientArray'
 *         500:
 *           description: Erreur interne du serveur
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 * 
 *   /nutrition/nutrition:
 *     post:
 *       summary: Calculer la nutrition pour une liste d'ingrédients
 *       tags: [Ingredients]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 foodItems:
 *                   type: array
 *                   items:
 *                     type: string
 *       responses:
 *         200:
 *           description: Données nutritionnelles calculées
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/NutritionData'
 *         500:
 *           description: Erreur interne du serveur
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 */
