// routes/voiceCommand.js
const express = require('express');
const router = express.Router();
const { handleVoiceCommand } = require('../controlleurs/voiceController');

router.post('/', handleVoiceCommand);

module.exports = router;
