// models/orderModel.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id_user: { type: String, required: true },
  id_dish: { type: String, required: true },
  orderedAt: { type: Date, default: Date.now },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price_id: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
});

module.exports = mongoose.model('Order', orderSchema);