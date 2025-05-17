// models/PlacedOrder.js (or .ts if using TypeScript)
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  _id: String,
  price: Number,
  subtotal: Number,
  image: String,
  price_id:String,
  description:String,
});

const PlacedOrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  items: [OrderItemSchema],
  total: Number,
  noteCommande : {
    type: String  },
    // New fields for group order information
    isGroupOrder: {
      type: Boolean,
      default: false,
    },
    groupOrderCode: String,
    groupOrderName: String,
    groupOrderPaymentMethod: String,
    userPaymentAmount: Number, // The amount this user paid (for split or individual payments)
    groupOrderTotalAmount: Number, // The total amount of the group order
},{ timestamps: true });

const PlacedOrder = mongoose.model('PlacedOrder', PlacedOrderSchema);

module.exports = PlacedOrder;