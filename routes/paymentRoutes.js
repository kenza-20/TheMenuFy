const express = require('express');
const userModel = require('../models/userModel');
const paymentController = require('../controlleurs/paymentController');
const router = express.Router();


router.post('/checkout', paymentController.checkout);

router.get('/success', paymentController.checkoutSuccess);
router.get('/cancel', paymentController.checkoutCancel);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Gestion des transactions de paiement
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     CheckoutRequest:
 *       type: object
 *       required:
 *         - items
 *         - user
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               name:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *         user:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *             email:
 *               type: string
 *             name:
 *               type: string
 * 
 *     PaymentResponse:
 *       type: object
 *       properties:
 *         sessionId:
 *           type: string
 *         url:
 *           type: string
 * 
 * paths:
 *   /payments/checkout:
 *     post:
 *       summary: Initialise un processus de paiement
 *       tags: [Payments]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckoutRequest'
 *       responses:
 *         200:
 *           description: Session de paiement créée
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PaymentResponse'
 *         400:
 *           description: Données de paiement invalides
 *         500:
 *           description: Erreur de traitement du paiement
 * 
 *   /payments/success:
 *     get:
 *       summary: Callback de succès de paiement
 *       tags: [Payments]
 *       parameters:
 *         - in: query
 *           name: session_id
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         200:
 *           description: Paiement confirmé
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   sessionId:
 *                     type: string
 *         400:
 *           description: Session invalide
 * 
 *   /payments/cancel:
 *     get:
 *       summary: Annulation de paiement
 *       tags: [Payments]
 *       responses:
 *         200:
 *           description: Paiement annulé
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 */