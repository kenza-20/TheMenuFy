const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require("validator");

const Schema = mongoose.Schema;

const dishSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },  // URL for the image of the dish (optional)
  category: { type: String, required: true }, // e.g., appetizer, main course, dessert, etc.
  isTopSeller: { type: Boolean, default: false }, // flag to mark top sellers
  similarDishes: [{ type: Schema.Types.ObjectId, ref: 'Dish' }], // Reference to similar dishes
  salesCount: { type: Number, default: 0 }, // Track how many times the dish has been sold

  // 👇 AJOUT ICI
  servingMode: {
    type: String,
    enum: ['solo', 'shared'],
    default: 'solo'
  }
});

module.exports = mongoose.model('Dish', dishSchema);
