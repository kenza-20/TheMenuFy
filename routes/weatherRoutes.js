const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');  // Import the Meal model

router.get('/recommendations/:city', async (req, res) => {
  try {
    const city = req.params.city;

    // Fetch weather info from a weather API (you can integrate this part if you have an actual weather API)
    const weatherData = {
      city,
      temperature: 25,  // Dummy data, replace with actual weather API response
      weather: 'Sunny',
    };

    // Fetch meals from the database (you can modify this query as per your needs)
    const meals = await Meal.find({
      // You can filter meals by different criteria, like mealType or calories
    }).limit(5);  // Limit the number of meals returned (you can adjust this number)

    // Prepare the recommendations data
    const recommendations = meals.map((meal) => ({
      _id: meal._id,
      name: meal.name,
      description: meal.notes || 'No description available.',
      temperature: weatherData.temperature,  // You can adjust this logic
      humidity: 60,  // This can also be adjusted based on your weather API response
      date: meal.date,
      photo: meal.photo || 'https://via.placeholder.com/150',  // Default photo if not available
    }));

    // Send the response with weather and meal recommendations
    res.json({
      weather: weatherData,
      recommendations: recommendations,
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
