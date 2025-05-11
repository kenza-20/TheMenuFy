// models/group-order.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupOrderSchema = new Schema({
  
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    creatorId: {
      type: String,
      required: true,
    },
    creatorName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "closed", "completed"],
      default: "active",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    participants: [
      {
        userId: String,
        userName: String,
        joinedAt: Date,
        paymentStatus: {
          type: String,
          enum: ["pending", "paid", "failed"],
          default: "pending",
        },
      },
    ],
    items: [
      {
        userId: String,
        userName: String,
        itemId: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        description: String,
        addedAt: Date,
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["single", "split", "individual"],
      default: "single",
    },
    notes: String,
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true },);

module.exports = mongoose.model('GroupOrder', GroupOrderSchema);