const express = require('express');
const router = express.Router();
const recipeController = require('../controlleurs/RecipeController');

// Create a new recipe
router.post('/recipe', recipeController.createRecipe);

// Get all recipes 
router.get('/recipes/all', recipeController.getAllRecipes);
router.get('/recipes/:id', recipeController.getRecipeById);

// Update a recipe by ID
router.put('/recipe/:id', recipeController.updateRecipe);

// Delete a recipe by ID
router.delete('/recipe/:id', recipeController.deleteRecipe);

module.exports = router;
