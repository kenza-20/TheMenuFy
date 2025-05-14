const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  id_user: { type: String, required: true },
  orderedAt: { type: Date, default: Date.now },
  tableNumber: { type: Number },


  name: { type: String, required: true },     // Dish name
  description: { type: String, required: true },  // Dish description
  image: { type: String, required: true },     // Image URL for the dish
  price: { type: Number, required: true },     // Price of the dish
  price_id: { type: String, required: true },  // Price identifier (if applicable)
  quantity: { type: Number, required: true },  // Quantity ordered
  ingredients: { type: Array, required: true }, // List of ingredients

  status: {
    type: String,
    enum: ['pending', 'preparing', 'served', 'paid'],
    default: 'pending', // Default status when the order is first created
  }
});

module.exports = mongoose.model('Order', orderSchema);
