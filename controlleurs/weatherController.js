require('dotenv').config();  // Load environment variables from .env file
const axios = require('axios');
const Meal = require('../models/Meal');  // Import the Meal model
const Weather = require('../models/weatherModel');  // Import the Weather model

// Load the API key from the environment variable
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// Function to fetch weather data from the OpenWeatherMap API
const fetchWeatherFromAPI = async (city) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching weather data for ${city}:`, error);
        return null;
    }
};

// Controller function to get weather-based meal recommendations
const getRecommendations = async (req, res) => {
    const { city } = req.params;  // Get the city name from the request parameters

    // Validate city input
    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }

    // Check if weather data is already in the database
    let weatherData = await Weather.findOne({ city });

    // If data is not found or it's expired (older than 1 hour), fetch new data from the API
    if (!weatherData || (new Date() - weatherData.lastFetched) > 3600000) {
        const weatherFromAPI = await fetchWeatherFromAPI(city);

        if (!weatherFromAPI) {
            return res.status(500).json({ error: "Unable to fetch weather data" });
        }

        // Save the new weather data in the database
        weatherData = new Weather({
            city: weatherFromAPI.name,
            temperature: weatherFromAPI.main.temp,
            weather: weatherFromAPI.weather[0].description,
            lastFetched: new Date(),
        });

        await weatherData.save();
    }

    // Based on the temperature, recommend different types of meals
    const temperature = weatherData.temperature;
    let mealFilter = {};

    if (temperature < 15) {
        // Cold weather: recommend hot meals (e.g., hearty meals)
        mealFilter = { mealType: { $in: ['lunch', 'dinner'] }, calories: { $gt: 200 } };  // Higher-calorie meals
    } else if (temperature >= 15 && temperature <= 30) {
        // Moderate weather: recommend balanced meals
        mealFilter = { mealType: { $in: ['lunch', 'dinner', 'snack'] }, calories: { $gt: 150, $lt: 600 } };
    } else {
        // Hot weather: recommend lighter meals (e.g., salads, snacks)
        mealFilter = { mealType: { $in: ['snack', 'lunch'] }, calories: { $lt: 300 } };  // Lighter meals
    }

    // Fetch the meals based on the filter
    const recommendedMeals = await Meal.find(mealFilter);

    if (recommendedMeals.length === 0) {
        return res.status(404).json({ message: 'No meal recommendations found for this weather' });
    }

    // Send the response with the weather data and recommended meals
    res.json({ weather: weatherData, recommendations: recommendedMeals });
};

module.exports = { getRecommendations };
