// models/Meal.js
const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  mealType: { type: String, enum: ['breakfast', 'elevenses', 'lunch', 'dinner', 'snack'], required: true },
  calories: { type: Number, required: true },
  notes: { type: String, default: '' },
  photo: { type: String }, 
  date: { type: Date, required: true },
}, { timestamps: true });

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;
