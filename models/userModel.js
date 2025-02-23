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
userSchema.statics.signup = async function(name, surname, email, password, confirmPassword, role) {
  // Validation
  if (!name || !surname || !email || !password || !confirmPassword || !role) {
    throw Error('All fields must be filled');
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid');
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough');
  }
  if (password !== confirmPassword) {
    throw Error('Passwords do not match');
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ name, surname, email, password: hash, role });

  return user;
};

module.exports = mongoose.model('User', userSchema);
