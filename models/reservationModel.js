const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  specialRequests: { type: String },
  numberOfGuests: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
