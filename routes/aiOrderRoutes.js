const express = require('express');
const router = express.Router();
const { generateAiOrderSummary } = require('../controlleurs/aiOrderController');

router.post('/generate-summary', generateAiOrderSummary);

module.exports = router;
