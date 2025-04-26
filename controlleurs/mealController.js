// controllers/mealController.js
const Meal = require('../models/Meal');

// CREATE
exports.createMeal = async (req, res) => {
  try {
    const meal = new Meal(req.body)
    await meal.save()
    res.status(201).json(meal)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// READ (All meals for a user)
exports.getMealsByUser = async (req, res) => {
  try {
    const meals = await Meal.find({ userId: req.params.userId })
    res.json(meals)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// UPDATE
exports.updateMeal = async (req, res) => {
  try {
    const updatedMeal = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updatedMeal)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// DELETE
exports.deleteMeal = async (req, res) => {
  try {
    await Meal.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
