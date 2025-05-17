const Meal = require('../models/Meal');

// CREATE
exports.createMeal = async (req, res) => {
  try {
    const meal = new Meal(req.body);
    await meal.save();
    res.status(201).json(meal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ (All meals for all users, no userId filter)
exports.getMeals = async (req, res) => {
  try {
    const meals = await Meal.find();
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateMeal = async (req, res) => {
  try {
    const updatedMeal = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedMeal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteMeal = async (req, res) => {
  try {
    await Meal.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Meal type by time of day
function getMealTypeForTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 10) return 'breakfast';
  if (hour >= 10 && hour < 12) return 'elevenses';
  if (hour >= 12 && hour < 15) return 'lunch';
  if (hour >= 15 && hour < 18) return 'snack';
  return 'dinner';
}

// GET meals by time of day
exports.getMealsForTimeOfDay = async (req, res) => {
  const mealType = getMealTypeForTimeOfDay();
  try {
    const meals = await Meal.find({ mealType });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching meals', error: err.message });
  }
};
