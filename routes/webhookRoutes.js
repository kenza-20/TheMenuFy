// routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const webhookController = require('../controlleurs/webhookController');

// Special raw body parser for Stripe webhooks
const bodyParser = require('body-parser');
router.post(
  '/stripe',
  bodyParser.raw({ type: 'application/json' }),
  webhookController.handleStripeWebhook
);

module.exports = router;

