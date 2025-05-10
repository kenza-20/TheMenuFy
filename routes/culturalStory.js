const express = require('express');
const CulturalStoryController = require('../api/cultural-story/CulturalStoryController'); // make sure spelling is correct
const router = express.Router();

router.post('/', CulturalStoryController.culturalStory);

module.exports = router;
