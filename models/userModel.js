const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  surname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'admin', 'kitchen', 'restaurant', 'client'], required: true },
  approved: { type: Boolean, default: false },
  confirmed: { type: Boolean, default: false },
  resetCode: { type: String },
  resetCodeExpiration: { type: Date }


});

module.exports = mongoose.model('User', userSchema);
