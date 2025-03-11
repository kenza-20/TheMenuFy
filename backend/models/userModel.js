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
  isBlocked: { type: Boolean, default: false },
  resetCode: { type: String },  // Doit être défini ici
resetCodeExpiration: { type: Date },

});

// 🔹 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔹 Compare password for login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
