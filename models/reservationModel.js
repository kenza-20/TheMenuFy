const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  specialRequests: { type: String },  // Optional field for any special requests from the user
  numberOfGuests: { type: Number, required: true }, // Added number of guests field
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
