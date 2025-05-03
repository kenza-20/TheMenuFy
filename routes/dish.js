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

const dishController = require('../controlleurs/dishController'); // ✅ bon dossier + bon nom
const router = express.Router();

// ✅ CORRIGÉ : mettre avant les routes dynamiques
router.get('/filter', dishController.filterDishes);
router.get('/recommended/:userId', dishController.getRecommendedDishes);
router.get('/recommendations/like', dishController.handleGetSimilarDishes);

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
  const { category } = req.params;
  try {
    const similarDishes = await dishController.getSimilarDishes(category);
    res.status(200).json(similarDishes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch similar dishes' });
  }
});

// Fetch a specific dish by ID
router.get('/:dishId', async (req, res) => {
  const { dishId } = req.params;
  try {
    const dish = await dishController.getDishById(dishId);
    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    res.status(200).json(dish);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dish' });
  }
});

// Increment sales count
router.post('/:dishId/increment-sales', validateSalesIncrement, async (req, res) => {
  const { dishId } = req.params;
  try {
    await dishController.incrementSalesCount(dishId);
    res.status(200).json({ message: 'Sales count incremented successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to increment sales count' });
  }
});

// Mark dish as top seller
router.post('/:dishId/mark-top-seller', validateDishUpdate, async (req, res) => {
  const { dishId } = req.params;
  try {
    await dishController.markTopSeller(dishId);
    res.status(200).json({ message: 'Dish marked as top seller' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark dish as top seller' });
  }
});

// Add a similar dish
router.post('/:dishId/add-similar/:similarDishId', validateSimilarDish, async (req, res) => {
  const { dishId, similarDishId } = req.params;
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

module.exports = router;
