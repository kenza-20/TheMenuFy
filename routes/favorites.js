const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Dish = require('../models/dishModel');
// const { verifyToken } = require('../middleware/auth'); // If you have auth

// Add a dish to favorites
router.post('/add', /*verifyToken,*/ async (req, res) => {
  const { dishId, userId } = req.body; // assume you send userId and dishId

  try {
    const user = await User.findById(userId);
    if (!user.favorites.includes(dishId)) {
      user.favorites.push(dishId);
      await user.save();
    }
    res.status(200).json({ message: 'Dish added to favorites!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a dish from favorites
router.post('/remove', /*verifyToken,*/ async (req, res) => {
  const { dishId, userId } = req.body;

  try {
    const user = await User.findById(userId);
    user.favorites = user.favorites.filter(id => id.toString() !== dishId);
    await user.save();
    res.status(200).json({ message: 'Dish removed from favorites!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's favorite dishes
router.get('/:userId', /*verifyToken,*/ async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('favorites');
    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
