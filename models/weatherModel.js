const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  city: { type: String, required: true, unique: true },
  temperature: { type: Number, required: true },
  weather: { type: String, required: true },
  lastFetched: { type: Date, required: true },  // Timestamp of when data was fetched
}, { timestamps: true });

const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;
