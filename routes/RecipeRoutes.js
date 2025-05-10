const express = require('express');
const router = express.Router();
const recipeController = require('../controlleurs/RecipeController');



router.get('/all', recipeController.getAllRecipes);
router.get('/top-selling', recipeController.getTopSellingProducts);
router.post('/recommendations', recipeController.getCartRecommendations);



router.get('/:id', recipeController.getRecipeById);
router.get('/price_id/:price_id', recipeController.getRecipeByPriceId);
router.get('/similar_products/:category', recipeController.getSimilarProducts);
router.get('/name/:name', recipeController.getRecipeByName); 



module.exports = router;
