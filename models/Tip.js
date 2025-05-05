const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }, // optional image URL
  date: { type: Date, default: Date.now }
});

module.exports  = mongoose.model('Tip', tipSchema);
