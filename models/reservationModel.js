const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
