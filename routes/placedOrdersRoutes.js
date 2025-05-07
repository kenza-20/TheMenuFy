const express = require('express');
const authenticate = require('../middleware/authMiddleware.js');

const placedOrderController = require('../controlleurs/placedOrderController.js');
const router = express.Router()

router.post("/create", placedOrderController.createOrder);
router.get("/history/:userId", placedOrderController.getOrderHistory);
router.get("/most-purchased", authenticate, placedOrderController.getMostPurchasedDish);


module.exports = router;