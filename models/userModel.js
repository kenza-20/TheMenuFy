const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  surname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'kitchen', 'restaurant', 'client'], 
    required: true
  },
  approved: {
    type: Boolean,
    default: false  // Restaurants must be approved by an admin
  }
});

// Static signup method
userSchema.statics.signup = async function(name, surname, email, password, confirmPassword, role, approved = false) {
  // Validation
  if (!name || !surname || !email || !password || !confirmPassword || !role) {
    throw new Error('All fields must be filled');
  }
  if (!validator.isEmail(email)) {
    throw new Error('Email not valid');
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error('Password must be at least 8 characters long, with uppercase, lowercase, number, and symbol');
  }
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw new Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ name, surname, email, password: hash, role, approved });

  return user;
};

// Approve restaurant function
userSchema.statics.approveRestaurant = async function(userId) {
  const user = await this.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.role !== 'restaurant') {
    throw new Error('Only restaurant users require approval');
  }

  user.approved = true;
  await user.save();

  return user;
};

module.exports = mongoose.model('User', userSchema);
