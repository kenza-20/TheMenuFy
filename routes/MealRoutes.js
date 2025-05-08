const express = require('express');
const mealController = require('../controlleurs/mealController'); // make sure spelling is correct
const router = express.Router();

router.post('/', mealController.createMeal);
router.get('/', mealController.getMeals);
router.put('/:id', mealController.updateMeal);
router.delete('/:id', mealController.deleteMeal);
router.get('/time-of-day', mealController.getMealsForTimeOfDay); // use this exact path

module.exports = router;
