const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
  itemName: { type: String, required: true },
  itemQuantity: { type: Number, required: true },
  chefid: { type: String, required: true },
  restoid: { type: String, required: true },

});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;