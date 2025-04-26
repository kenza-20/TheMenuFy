const express = require('express');
const { 
  validateUser, 
  validateLogin 
} = require('../middleware/validateUser');
const { 
  validateDishCreation, 
  validateDishUpdate, 
  validateSimilarDish, 
  validateSalesIncrement 
} = require('../middleware/validateDish');

const dishController = require('../controlleurs/dishController'); // Fixed typo in the import
const router = express.Router();

// Fetch top-selling dishes
router.get('/top-sellers', async (req, res) => {
  try {
    const topSeller = await dishController.getTopSellers();
    res.status(200).json(topSeller);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top seller' });
  }
});

// Fetch similar dishes (add validation for dishId parameter)
router.get('/:category/similar', async (req, res) => {
  const { category } = req.params;  // Get the category from the URL parameter
  try {
    const similarDishes = await dishController.getSimilarDishes(category);
    res.status(200).json(similarDishes);  // Send the similar dishes to the frontend
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch similar dishes' });
  }
});

// Increment sales count (add validation for dishId parameter)
router.post('/:dishId/increment-sales', validateSalesIncrement, async (req, res) => {
  const { dishId } = req.params; // Extract dishId from the URL
  try {
    await dishController.incrementSalesCount(dishId);
    res.status(200).json({ message: 'Sales count incremented successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to increment sales count' });
  }
});

// Mark dish as top seller (validate before marking as top seller)
router.post('/:dishId/mark-top-seller', validateDishUpdate, async (req, res) => {
  const { dishId } = req.params; // Extract dishId from the URL
  try {
    await dishController.markTopSeller(dishId);
    res.status(200).json({ message: 'Dish marked as top seller' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark dish as top seller' });
  }
});

// Add a similar dish (validate before adding similar dish)
router.post('/:dishId/add-similar/:similarDishId', validateSimilarDish, async (req, res) => {
  const { dishId, similarDishId } = req.params; // Extract dishId and similarDishId from the URL
  try {
    await dishController.addSimilarDish(dishId, similarDishId);
    res.status(200).json({ message: 'Similar dish added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add similar dish' });
  }
});

// Add a new dish
router.post('/add', validateDishCreation, async (req, res) => {
  try {
    await dishController.addDish(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add dish' });
  }
});

router.get('/challenge', async (req, res) => {
  try {
    const challengeDish = await dishController.getChallengeDish();
    res.status(200).json(challengeDish);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch challenge dish' });
  }
});


router.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  const dishes = await Dish.find({ category });
  res.json(dishes);
});


module.exports = router;
