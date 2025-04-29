const express = require('express');
const userModel = require('../models/userModel');
const paymentController = require('../controlleurs/paymentController');
const router = express.Router();


router.post('/checkout', paymentController.checkout);

router.get('/success', paymentController.checkoutSuccess);
router.get('/cancel', paymentController.checkoutCancel);

module.exports = router;
