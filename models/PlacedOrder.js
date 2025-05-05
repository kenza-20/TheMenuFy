// models/PlacedOrder.js (or .ts if using TypeScript)
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
  subtotal: Number,
  image: String,
  price_id:String,
  description:String,
  dishId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish'
  }
}, { _id: false });

const PlacedOrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  items: [OrderItemSchema],
  total: Number,
},{ timestamps: true });

const PlacedOrder = mongoose.model('PlacedOrder', PlacedOrderSchema);

module.exports = PlacedOrder;