const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  surname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tel: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'admin', 'kitchen', 'restaurant', 'client'], required: true },
  approved: { type: Boolean, default: false },
  confirmed: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  resetCode: { type: String },
  resetCodeExpiration: { type: Date },
  token: { type: String },
  image: { type: String },

  // Favorites: an array of Dish references
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish' // Refers to your Dish model
    }
  ],
  allergies: [{ type: String, default: [] }],
  neighborhood: { type: String, default: "" },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  
});

// Create and export the User model
const User = mongoose.model('User', userSchema, 'users'); // forcer le nom exact de la collection

module.exports = User;