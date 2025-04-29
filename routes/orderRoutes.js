
const express = require('express');

const mealController = require('../controlleurs/orderController');
const router = express.Router()

router.post('/add', mealController.addOrder)
router.delete('/:id_user/:price_id', mealController.deleteOrder)
router.delete('/:id_user', mealController.deleteAllOrders)
router.get('/:id_user', mealController.getOrdersByUser)
router.put('/:id_user/:price_id/increment', mealController.incrementQuantity)
router.put('/:id_user/:price_id/decrement', mealController.decrementQuantity)

module.exports = router;