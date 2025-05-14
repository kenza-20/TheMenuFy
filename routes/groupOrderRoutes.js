// routes/groupOrderRoutes.js
const express = require('express');
const router = express.Router();
const groupOrderController = require('../controlleurs/groupOrderController');

// Create a new group order
router.post('/create', groupOrderController.createGroupOrder);

// Join an existing group order
router.post('/join', groupOrderController.joinGroupOrder);

// Add item to group order
router.post('/add-item', groupOrderController.addItemToGroupOrder);

// Remove item from group order
router.post('/remove-item', groupOrderController.removeItemFromGroupOrder);

// Get group order by code
router.get('/get', groupOrderController.getGroupOrder);

// Get all active group orders for a user
router.get('/user/:userId', groupOrderController.getUserGroupOrders);

// Update payment method
router.put('/update-payment', groupOrderController.updatePaymentMethod);

// Process checkout for group order
router.post('/checkout', groupOrderController.checkout);

router.post('/update-item-quantity', groupOrderController.updateItemQuantity);

router.post('/update-payment-status', groupOrderController.updatePaymentStatus);
router.post('/leave', groupOrderController.leave);
router.delete('/delete', groupOrderController.delete);

// Complete a group order after successful payment
router.put('/complete/:code', groupOrderController.completeGroupOrder);

module.exports = router;



/**
 * @swagger
 * tags:
 *   name: GroupOrders
 *   description: Gestion des commandes de groupe
 * 
 * components:
 *   schemas:
 *     GroupOrder:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         code:
 *           type: string
 *         userId:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             type: string
 *         paymentStatus:
 *           type: string
 *         totalAmount:
 *           type: number
 *           format: float
 *     GroupOrderRequest:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         userId:
 *           type: string
 *         itemId:
 *           type: string
 *         quantity:
 *           type: number
 *         paymentMethod:
 *           type: string
 * 
 * paths:
 *   /group-order/create:
 *     post:
 *       summary: Créer une nouvelle commande de groupe
 *       tags: [GroupOrders]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupOrderRequest'
 *       responses:
 *         201:
 *           description: Commande de groupe créée avec succès
 *         400:
 *           description: Mauvaise requête
 * 
 *   /group-order/join:
 *     post:
 *       summary: Rejoindre une commande de groupe existante
 *       tags: [GroupOrders]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupOrderRequest'
 *       responses:
 *         200:
 *           description: Vous avez rejoint la commande de groupe avec succès
 *         404:
 *           description: Commande de groupe non trouvée
 * 
 *   /group-order/add-item:
 *     post:
 *       summary: Ajouter un article à une commande de groupe
 *       tags: [GroupOrders]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupOrderRequest'
 *       responses:
 *         200:
 *           description: Article ajouté avec succès
 * 
 *   /group-order/remove-item:
 *     post:
 *       summary: Retirer un article de la commande de groupe
 *       tags: [GroupOrders]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupOrderRequest'
 *       responses:
 *         200:
 *           description: Article retiré avec succès
 * 
 *   /group-order/get:
 *     get:
 *       summary: Récupérer les informations d'une commande de groupe par son code
 *       tags: [GroupOrders]
 *       parameters:
 *         - in: query
 *           name: code
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Commande de groupe récupérée avec succès
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/GroupOrder'
 *         404:
 *           description: Commande de groupe non trouvée
 * 
 *   /group-order/user/{userId}:
 *     get:
 *       summary: Récupérer toutes les commandes de groupe actives pour un utilisateur
 *       tags: [GroupOrders]
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Liste des commandes de groupe de l'utilisateur
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/GroupOrder'
 * 
 *   /group-order/update-payment:
 *     put:
 *       summary: Mettre à jour la méthode de paiement d'une commande de groupe
 *       tags: [GroupOrders]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupOrderRequest'
 *       responses:
 *         200:
 *           description: Méthode de paiement mise à jour avec succès
 * 
 *   /group-order/checkout:
 *     post:
 *       summary: Traiter le checkout pour une commande de groupe
 *       tags: [GroupOrders]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupOrderRequest'
 *       responses:
 *         200:
 *           description: Checkout traité avec succès
 * 
 *   /group-order/update-item-quantity:
 *     post:
 *       summary: Mettre à jour la quantité d'un article dans la commande de groupe
 *       tags: [GroupOrders]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupOrderRequest'
 *       responses:
 *         200:
 *           description: Quantité de l'article mise à jour avec succès
 * 
 *   /group-order/update-payment-status:
 *     post:
 *       summary: Mettre à jour le statut de paiement d'une commande de groupe
 *       tags: [GroupOrders]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupOrderRequest'
 *       responses:
 *         200:
 *           description: Statut de paiement mis à jour avec succès
 * 
 *   /group-order/leave:
 *     post:
 *       summary: Quitter une commande de groupe
 *       tags: [GroupOrders]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupOrderRequest'
 *       responses:
 *         200:
 *           description: Vous avez quitté la commande de groupe avec succès
 * 
 *   /group-order/delete:
 *     delete:
 *       summary: Supprimer une commande de groupe
 *       tags: [GroupOrders]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupOrderRequest'
 *       responses:
 *         200:
 *           description: Commande de groupe supprimée avec succès
 * 
 *   /group-order/complete/{code}:
 *     put:
 *       summary: Compléter une commande de groupe après paiement réussi
 *       tags: [GroupOrders]
 *       parameters:
 *         - in: path
 *           name: code
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Commande de groupe complétée avec succès
 */
