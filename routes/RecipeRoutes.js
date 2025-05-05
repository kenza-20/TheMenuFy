const express = require('express');
const router = express.Router();
const recipeController = require('../controlleurs/RecipeController');

// Create a new recipe
// router.post('/add', recipeController.createRecipe);

// Get all recipes 
router.get('/all', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);
router.get('/price_id/:price_id', recipeController.getRecipeByPriceId);
router.get('/name/:name', recipeController.getRecipeByName); 

// Update a recipe by ID
// router.put('/:id', recipeController.updateRecipe);

// Delete a recipe by ID
// router.delete('/:id', recipeController.deleteRecipe);

module.exports = router;
