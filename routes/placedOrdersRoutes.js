const express = require('express');

const placedOrderController = require('../controlleurs/placedOrderController.js');
const router = express.Router()

router.post("/create", placedOrderController.createOrder);
router.get("/history/:userId", placedOrderController.getOrderHistory);
router.get('/getAll', placedOrderController.getAllOrders);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestion des commandes passées
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         orderItems:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *         totalPrice:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *         user:
 *           type: string
 *         paymentInfo:
 *           type: object
 *           properties:
 *             paymentMethod:
 *               type: string
 *             transactionId:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 * 
 *     OrderCreateRequest:
 *       type: object
 *       required:
 *         - orderItems
 *         - totalPrice
 *         - user
 *         - paymentMethod
 *       properties:
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         totalPrice:
 *           type: number
 *         user:
 *           type: string
 *         paymentMethod:
 *           type: string
 *           enum: [credit_card, cash, mobile_payment]
 * 
 *     OrderItem:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *         quantity:
 *           type: number
 *         price:
 *           type: number
 * 
 * paths:
 *   /placedOrders/create:
 *     post:
 *       summary: Crée une nouvelle commande
 *       tags: [Orders]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderCreateRequest'
 *       responses:
 *         201:
 *           description: Commande créée avec succès
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Order'
 *         400:
 *           description: Données de commande invalides
 *         500:
 *           description: Erreur serveur
 * 
 *   /placedOrders/history/{userId}:
 *     get:
 *       summary: Récupère l'historique des commandes d'un utilisateur
 *       tags: [Orders]
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *           description: ID de l'utilisateur
 *       responses:
 *         200:
 *           description: Liste des commandes de l'utilisateur
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Order'
 *         404:
 *           description: Aucune commande trouvée
 * 
 *   /placedOrders/getAll:
 *     get:
 *       summary: Récupère toutes les commandes
 *       tags: [Orders]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Liste de toutes les commandes
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Order'
 *         500:
 *           description: Erreur serveur
 */