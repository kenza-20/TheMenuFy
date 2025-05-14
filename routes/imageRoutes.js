const express = require('express');
const router = express.Router();
const { generateImage } = require('../controlleurs/imageContreller');

router.post('/generate-image', (req, res, next) => {
  console.log('Reçu une requête POST sur /generate-image');
  next();
}, generateImage);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Image
 *   description: Génération d'images
 * 
 * paths:
 *   /generate-image:
 *     post:
 *       summary: Générer une image en fonction de la requête
 *       tags: [Image]
 *       responses:
 *         200:
 *           description: Image générée avec succès
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Image générée avec succès"
 *                   imageUrl:
 *                     type: string
 *                     example: "https://example.com/generated-image.png"
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
 *         500:
 *           description: Erreur interne du serveur
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: "Erreur interne du serveur"
 */
