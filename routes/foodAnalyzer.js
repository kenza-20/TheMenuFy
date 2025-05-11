const express = require('express');
const AnalyzerController = require('../api/analyzer/AnalyzerController'); // make sure spelling is correct
const router = express.Router();

router.post('/analyze-nutrition', AnalyzerController.analyzeNutrition);
router.post('/generate-food-image', AnalyzerController.generateImage);
// router.post('/save-image', AnalyzerController.saveImage);

module.exports = router;
