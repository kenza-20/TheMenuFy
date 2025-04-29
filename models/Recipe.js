const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  meal: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  prepTime: {
    type: String,
    required: true
  },
  ingredients: {
    type: [String],
    required: true
  },
  allergies: {
    type: [String],
    default: []
  },
  protein: {
    type: String,
    required: true
  },
  fat: {
    type: String,
    required: true
  },
  carbs: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
