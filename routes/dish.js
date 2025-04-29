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

// Fetch similar dishes (add validation for category parameter)
router.get('/:category/similar', async (req, res) => {
  const { category } = req.params;  // Get the category from the URL parameter
  try {
    const similarDishes = await dishController.getSimilarDishes(category);
    res.status(200).json(similarDishes);  // Send the similar dishes to the frontend
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch similar dishes' });
  }
});

// Fetch a specific dish by ID (added route for fetching a single dish by dishId)
router.get('/:dishId', async (req, res) => {
  const { dishId } = req.params; // Get dishId from the URL parameter
  try {
    const dish = await dishController.getDishById(dishId); // Ensure this method is implemented in your controller
    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    res.status(200).json(dish); // Send the dish data to the frontend
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dish' });
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

router.get('/recommended/:userId', dishController.getRecommendedDishes);


module.exports = router;