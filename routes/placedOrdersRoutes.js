const express = require('express');

const placedOrderController = require('../controlleurs/placedOrderController.js');
const router = express.Router()

router.post("/create", placedOrderController.createOrder);
router.get("/history/:userId", placedOrderController.getOrderHistory);

module.exports = router;