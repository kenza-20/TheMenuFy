const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableId: { type: String, required: true, unique: true },  // Unique table identifier (e.g., "table01")
  capacity: { type: Number, required: true },  // Number of people the table can seat
  isOccupied: { type: Boolean, default: false },  // Indicates whether the table is occupied
});

module.exports = mongoose.model('Table', tableSchema);
