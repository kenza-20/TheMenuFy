
const express = require('express');

const mealController = require('../controlleurs/mealController');
const router = express.Router()

router.post('/', mealController.createMeal)
router.get('/:userId', mealController.getMealsByUser)
router.put('/:id', mealController.updateMeal)
router.delete('/:id', mealController.deleteMeal)

module.exports = router;