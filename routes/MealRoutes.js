const express = require('express');
const mealController = require('../controlleurs/mealController'); // make sure spelling is correct
const router = express.Router();

router.post('/', mealController.createMeal);
router.get('/:userId', mealController.getMeals);
router.put('/:id', mealController.updateMeal);
router.delete('/:id', mealController.deleteMeal);
router.get('/time-of-day', mealController.getMealsForTimeOfDay); // use this exact path

module.exports = router;



/**
 * @swagger
 * tags:
 *   name: Meals
 *   description: Gestion des repas
 * 
 * paths:
 *   /meals:
 *     post:
 *       summary: Créer un nouveau repas
 *       tags: [Meals]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 ingredients:
 *                   type: array
 *                   items:
 *                     type: string
 *       responses:
 *         201:
 *           description: Repas créé avec succès
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Repas créé avec succès"
 *         400:
 *           description: Mauvaise requête (données invalides ou manquantes)
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: "Données manquantes ou invalides"
 * 
 *   /meals/:userId
 *     get:
 *       summary: Récupérer la liste de tous les repas
 *       tags: [Meals]
 *       responses:
 *         200:
 *           description: Liste de tous les repas
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 * 
 *   /meals/{id}:
 *     put:
 *       summary: Mettre à jour un repas existant
 *       tags: [Meals]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 ingredients:
 *                   type: array
 *                   items:
 *                     type: string
 *       responses:
 *         200:
 *           description: Repas mis à jour avec succès
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Repas mis à jour avec succès"
 *         404:
 *           description: Repas non trouvé
 * 
 *   /meals/{id}:
 *     delete:
 *       summary: Supprimer un repas par son ID
 *       tags: [Meals]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Repas supprimé avec succès
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Repas supprimé avec succès"
 *         404:
 *           description: Repas non trouvé
 * 
 *   /meals/time-of-day:
 *     get:
 *       summary: Récupérer les repas en fonction de l'heure de la journée
 *       tags: [Meals]
 *       responses:
 *         200:
 *           description: Liste des repas pour l'heure de la journée
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 */
