
const express = require('express');
const authenticate = require('../middleware/authMiddleware')
const mealController = require('../controlleurs/orderController');
const tableController = require ("../controlleurs/tableController")
const router = express.Router()
router.post('/add', mealController.addOrder)
router.delete('/:id_user/:price_id', mealController.deleteOrder)
router.delete('/:id_user', mealController.deleteAllOrders)
router.get('/:id_user', mealController.getOrdersByUser)
router.put('/:id_user/:price_id/increment', mealController.incrementQuantity)
router.put('/:id_user/:price_id/decrement', mealController.decrementQuantity)
router.get('/qr/:tableId', mealController.getOrdersByQRCode);
router.get('/qr/generate/:tableId', mealController.generateQRCodeForTable);

router.post('/table', tableController.addTable);  // Create a new table
router.get('/tables', tableController.getTables);  // Get all tables
router.get('/table/:tableId', tableController.getTableById);  // Get a specific table by ID
router.put('/table/:tableId/status', tableController.updateTableStatus);  // Update table status (occupied/unoccupied)
router.delete('/table/:tableId', tableController.deleteTable);  // Delete a specific table
  
module.exports = router;



/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Gestion des commandes
 *   - name: Tables
 *     description: Gestion des tables
 *
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id_user:
 *           type: string
 *         price_id:
 *           type: string
 *         quantity:
 *           type: number
 *     Table:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         number:
 *           type: integer
 *         status:
 *           type: string
 *     TableArray:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Table'
 *     OrderArray:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Order'
 *
 * paths:
 *   /orders/add:
 *     post:
 *       summary: Ajouter une commande
 *       tags: [Orders]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       responses:
 *         200:
 *           description: Commande ajoutée
 *
 *   /orders/{id_user}/{price_id}:
 *     delete:
 *       summary: Supprimer une commande spécifique
 *       tags: [Orders]
 *       parameters:
 *         - in: path
 *           name: id_user
 *           required: true
 *           schema:
 *             type: string
 *         - in: path
 *           name: price_id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Commande supprimée
 *
 *   /orders/{id_user}:
 *     delete:
 *       summary: Supprimer toutes les commandes d'un utilisateur
 *       tags: [Orders]
 *       parameters:
 *         - in: path
 *           name: id_user
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Toutes les commandes supprimées
 *     get:
 *       summary: Récupérer les commandes d'un utilisateur
 *       tags: [Orders]
 *       parameters:
 *         - in: path
 *           name: id_user
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Liste des commandes
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/OrderArray'
 *
 *   /orders/{id_user}/{price_id}/increment:
 *     put:
 *       summary: Incrémenter la quantité d'une commande
 *       tags: [Orders]
 *       parameters:
 *         - in: path
 *           name: id_user
 *           required: true
 *           schema:
 *             type: string
 *         - in: path
 *           name: price_id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Quantité incrémentée
 *
 *   /orders/{id_user}/{price_id}/decrement:
 *     put:
 *       summary: Décrémenter la quantité d'une commande
 *       tags: [Orders]
 *       parameters:
 *         - in: path
 *           name: id_user
 *           required: true
 *           schema:
 *             type: string
 *         - in: path
 *           name: price_id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Quantité décrémentée
 *
 *   /orders/qr/{tableId}:
 *     get:
 *       summary: Obtenir les commandes par QR code
 *       tags: [Orders]
 *       parameters:
 *         - in: path
 *           name: tableId
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Liste des commandes pour la table
 *
 *   /orders/qr/generate/{tableId}:
 *     get:
 *       summary: Générer un QR code pour une table
 *       tags: [Orders]
 *       parameters:
 *         - in: path
 *           name: tableId
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: QR code généré
 *
 *   /orders/table:
 *     post:
 *       summary: Ajouter une table
 *       tags: [Tables]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Table'
 *       responses:
 *         200:
 *           description: Table ajoutée
 *
 *   /orders/tables:
 *     get:
 *       summary: Obtenir toutes les tables
 *       tags: [Tables]
 *       responses:
 *         200:
 *           description: Liste des tables
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/TableArray'
 *
 *   /orders/table/{tableId}:
 *     get:
 *       summary: Obtenir une table par ID
 *       tags: [Tables]
 *       parameters:
 *         - in: path
 *           name: tableId
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Détails de la table
 *
 *   /orders/table/{tableId}/status:
 *     put:
 *       summary: Mettre à jour le statut d'une table
 *       tags: [Tables]
 *       parameters:
 *         - in: path
 *           name: tableId
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Statut mis à jour
 *
 *   /orders/table/{tableId}:
 *     delete:
 *       summary: Supprimer une table
 *       tags: [Tables]
 *       parameters:
 *         - in: path
 *           name: tableId
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Table supprimée
 */