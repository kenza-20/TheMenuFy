// models/orderModel.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id_user: { type: String, required: true },
  id_dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
  orderedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);