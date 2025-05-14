const express = require('express');
const router = express.Router();
const {
  getStep,
  generateFinalPlate
} = require('../controlleurs/narrativeGameController');

router.get('/step/:stepId?', getStep); // si vide = 'start'
router.post('/end', generateFinalPlate);

module.exports = router;



/**
 * @swagger
 * tags:
 *   name: NarrativeGame
 *   description: Gestion du jeu narratif
 * 
 * components:
 *   schemas:
 *     Step:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         description:
 *           type: string
 *         choices:
 *           type: array
 *           items:
 *             type: string
 * 
 * paths:
 *   /narrative-game/step/{stepId}:
 *     get:
 *       summary: Récupérer une étape du jeu narratif
 *       tags: [NarrativeGame]
 *       parameters:
 *         - in: path
 *           name: stepId
 *           required: false
 *           schema:
 *             type: string
 *           description: ID de l'étape. Si vide, cela renvoie l'étape de départ.
 *       responses:
 *         200:
 *           description: Étape du jeu renvoyée avec succès
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Step'
 *         404:
 *           description: Étape non trouvée
 * 
 *   /narrative-game/end:
 *     post:
 *       summary: Générer l'assiette finale du jeu narratif
 *       tags: [NarrativeGame]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 finalChoices:
 *                   type: array
 *                   items:
 *                     type: string
 *       responses:
 *         200:
 *           description: Assiette finale générée avec succès
 *         400:
 *           description: Mauvaise requête (données invalides)
 */
