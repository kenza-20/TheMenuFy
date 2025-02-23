const express = require('express');
const { signupUser, approveRestaurant } = require('../controlleurs/userController');

const router = express.Router();

// Signup route
router.post('/signup', signupUser);

// Admin approves a restaurant
router.patch('/approve/:userId', approveRestaurant);

module.exports = router;
