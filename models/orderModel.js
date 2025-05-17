const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id_user: { type: String, required: true },
  orderedAt: { type: Date, default: Date.now },
  tableNumber: { type: Number, required: true }, // 🆕 table number field

  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  price_id: { type: String, required: true },
  quantity: { type: Number, required: true },
  ingredients: { type: Array, required: true },

  status: {
    type: String,
    enum: ['pending', 'preparing', 'served', 'paid'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Order', orderSchema);
