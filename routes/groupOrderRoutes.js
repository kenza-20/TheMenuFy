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