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



/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: Gestion des recettes
 * 
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         category:
 *           type: string
 *         price:
 *           type: number
 *         price_id:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 *     RecommendationRequest:
 *       type: object
 *       properties:
 *         cart:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *               quantity:
 *                 type: number
 *     RecipeArray:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Recipe'
 * 
 * paths:
 *   /recipes/all:
 *     get:
 *       summary: Récupère toutes les recettes
 *       tags: [Recipes]
 *       responses:
 *         200:
 *           description: Liste de toutes les recettes
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/RecipeArray'
 * 
 *   /recipes/top-selling:
 *     get:
 *       summary: Récupère les produits les plus vendus
 *       tags: [Recipes]
 *       responses:
 *         200:
 *           description: Liste des produits les plus vendus
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/RecipeArray'
 * 
 *   /recipes/recommendations:
 *     post:
 *       summary: Obtenir des recommandations basées sur le panier
 *       tags: [Recipes]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecommendationRequest'
 *       responses:
 *         200:
 *           description: Recommandations générées
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/RecipeArray'
 * 
 *   /recipes/{id}:
 *     get:
 *       summary: Récupère une recette par son ID
 *       tags: [Recipes]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Détails de la recette
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Recipe'
 *         404:
 *           description: Recette non trouvée
 * 
 *   /recipes/price_id/{price_id}:
 *     get:
 *       summary: Récupère une recette par son ID de prix
 *       tags: [Recipes]
 *       parameters:
 *         - in: path
 *           name: price_id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Détails de la recette
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Recipe'
 *         404:
 *           description: Recette non trouvée
 * 
 *   /recipes/similar_products/{category}:
 *     get:
 *       summary: Récupère des produits similaires par catégorie
 *       tags: [Recipes]
 *       parameters:
 *         - in: path
 *           name: category
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Liste des produits similaires
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/RecipeArray'
 * 
 *   /recipes/name/{name}:
 *     get:
 *       summary: Récupère une recette par son nom
 *       tags: [Recipes]
 *       parameters:
 *         - in: path
 *           name: name
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Détails de la recette
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Recipe'
 *         404:
 *           description: Recette non trouvée
 */