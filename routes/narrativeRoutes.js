const express = require('express');
const router = express.Router();
const {
  getStep,
  generateFinalPlate
} = require('../controlleurs/narrativeGameController');

router.get('/step/:stepId?', getStep); // si vide = 'start'
router.post('/end', generateFinalPlate);

module.exports = router;
