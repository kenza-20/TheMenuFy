const express = require('express');
const router = express.Router();
const { generateImage } = require('../controlleurs/imageController');

router.post('/generate-image', (req, res, next) => {
  console.log('Reçu une requête POST sur /generate-image');
  next();
}, generateImage);

module.exports = router;