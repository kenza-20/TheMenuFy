const express = require('express');
const router = express.Router();
const { getCultureByCountry } = require('../controlleurs/cultureController');

router.get('/:country', getCultureByCountry);

module.exports = router;
