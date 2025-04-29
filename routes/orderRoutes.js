// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { getUserOrders } = require('../controlleurs/orderController');
const Order = require('../models/orderModel');
const authenticate = require('../middleware/authMiddleware');

router.get('/my-orders', authenticate, getUserOrders);

router.post('/create', async (req, res) => {
    try {
      const { id_user, id_dish } = req.body;
  
      if (!id_user || !id_dish) {
        return res.status(400).json({ message: 'Les informations de la commande sont incomplètes.' });
      }
  
      const newOrder = new Order({
        id_user,
        id_dish
      });
  
      await newOrder.save();
  
      return res.status(201).json({
        message: 'Commande créée avec succès',
        order: newOrder
      });
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  });

module.exports = router;