const Dish = require('../models/dishModel');
const jwt = require('jsonwebtoken');
const validator = require("validator");
const User = require('../models/userModel'); // Ensure this `require` is at the top of your file

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "fall";
  return "winter";
}

const getDishById = async (req, res) => {
  const { id } = req.params;  // Assuming you're using a route parameter to get the dish ID
  try {
    const dish = await Dish.findById(id);  // This expects an ObjectId
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }
    res.json(dish);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dish' });
  }
};


// Recommend dishes based on user's allergies
const getRecommendedDishes = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const excluded = (user.allergies || []).map(a => a.toLowerCase());

    const dishes = await Dish.find({
      ingredients: { $nin: excluded }
    });

    res.status(200).json(dishes);
  } catch (err) {
    console.error("Error in getRecommendedDishes:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add a new dish
const addDish = async (req, res) => {
  const { name, description, price, category, image, isTopSeller, ingredients, servingMode, mood = 'neutral' } = req.body;

  try {
    const newDish = new Dish({
      name,
      description,
      price,
      category,
      image,
      isTopSeller,
      salesCount: 0,
      ingredients,
      servingMode, 
      mood // Use the provided or default 'neutral' mood
    });

    await newDish.save();

    res.status(201).json({
      message: 'Dish added successfully',
      dish: newDish,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error adding dish',
      details: error.message,
    });
  }
};


// Mark dish as top seller
const markTopSeller = async (dishId) => {
  try {
    await Dish.updateMany({}, { isTopSeller: false });

    const dish = await Dish.findById(dishId);
    if (!dish) {
      throw new Error("Dish not found");
    }
    dish.isTopSeller = true;

    await dish.save();
    return dish;
  } catch (error) {
    console.error("Error marking top seller:", error);
    throw new Error("Error marking top seller");
  }
};

// Get top-selling dish
const getTopSellers = async () => {
  try {
    const topSeller = await Dish.findOne().sort({ salesCount: -1 });
    return topSeller;
  } catch (error) {
    console.error("Error fetching top sellers:", error);
    throw new Error("Error fetching top seller");
  }
};

// Get similar dishes (excluding the top seller)
const getSimilarDishes = async (category) => {
  try {
    const topSeller = await getTopSellers();

    const similarDishes = await Dish.find({
      category,
      _id: { $ne: topSeller._id },  // Exclude the top seller
    }).limit(6);

    return similarDishes;
  } catch (error) {
    console.error("Error fetching similar dishes:", error);
    throw new Error("Error fetching similar dishes");
  }
};

// Add a similar dish to the current dish
const addSimilarDish = async (dishId, similarDishId) => {
  try {
    const dish = await Dish.findById(dishId);
    if (!dish) throw new Error("Dish not found");

    dish.similarDishes.push(similarDishId);
    await dish.save();
  } catch (error) {
    console.error("Error adding similar dish:", error);
    throw new Error("Error adding similar dish");
  }
};

// Increment the sales count for a specific dish
const incrementSalesCount = async (dishId) => {
  try {
    const dish = await Dish.findById(dishId);
    if (!dish) throw new Error("Dish not found");

    dish.salesCount += 1;
    await dish.save();
  } catch (error) {
    console.error("Error updating sales count:", error);
    throw new Error("Error updating sales count");
  }
};

// Fetch a challenge dish
const getChallengeDish = async () => {
  try {
    const challengeDish = await Dish.findOne({ category: 'salade' });
    if (!challengeDish) {
      throw new Error('Challenge dish not found');
    }
    return challengeDish;
  } catch (error) {
    throw error;
  }
};

// Controller to fetch similar dishes via a GET request
const handleGetSimilarDishes = async (req, res) => {
  const { category } = req.query;

  try {
    const similarDishes = await getSimilarDishes(category);
    res.status(200).json(similarDishes);
  } catch (error) {
    console.error("Error in handleGetSimilarDishes:", error);
    res.status(500).json({ message: "Error fetching similar dishes", error: error.message });
  }
};

// Filter dishes by various criteria
const filterDishes = async (req, res) => {
  const { type, mode } = req.query;

  try {
    let filter = {};

    if (type === 'low-budget') {
      filter.price = { $lte: 10 };
    } else if (type === 'fast') {
      filter.preparationTime = { $lte: 15 };
    }

    if (mode === 'solo' || mode === 'shared') {
      filter.mode = mode;
    }

    const dishes = await Dish.find(filter);
    res.status(200).json(dishes);
  } catch (error) {
    console.error("Error in filterDishes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch seasonal dishes based on current season
const getSeasonalDishes = async (req, res) => {
  try {
    const season = getCurrentSeason();

    const seasonalIngredients = {
      spring: ["asperge", "fraise", "épinard"],
      summer: ["tomate", "courgette", "pêche"],
      fall: ["potiron", "poire", "chou"],
      winter: ["orange", "carotte", "poireau"]
    };

    const dishes = await Dish.find({
      ingredients: { $in: seasonalIngredients[season] }
    });

    res.status(200).json(dishes);
  } catch (err) {
    console.error("Error fetching seasonal dishes:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get popular dishes by neighborhood
const getPopularDishesByNeighborhood = async (req, res) => {
  const { neighborhood } = req.query;

  if (!neighborhood) {
    return res.status(400).json({ message: "Neighborhood is required." });
  }

  try {
    const popularDishes = await Dish.find({ neighborhood })
      .sort({ salesCount: -1 })
      .limit(6);

    res.status(200).json(popularDishes);
  } catch (err) {
    console.error("Error fetching popular dishes by neighborhood:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get dishes based on mood
const getDishByMood = async (req, res) => {
  const { mood } = req.params;  // Expecting the mood as a route parameter
  
  try {
    // Find the dish by its mood
    const dish = await Dish.find({ mood: mood });

    if (!dish) {
      return res.status(404).json({ message: `No dish found for mood: ${mood}` });
    }

    res.json(dish); // Send back the found dish
  } catch (error) {
    console.error('Error while fetching dish:', error);
    res.status(500).json({ error: `Failed to fetch dish: ${error.message}` });
  }
};



const deleteDish = async (req, res) => {
  const { id } = req.params;  // Get the dish ID from the request parameters

  try {
    const dish = await Dish.findById(id);  // Try to find the dish by ID

    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });  // If dish doesn't exist, return 404
    }

    // Delete the dish
    await Dish.findByIdAndDelete(id);

    res.status(200).json({ message: 'Dish deleted successfully' });  // Return success message
  } catch (error) {
    console.error('Error deleting dish:', error);
    res.status(500).json({ error: 'Failed to delete dish' });  // Return error message if something goes wrong
  }
};
module.exports = {
  markTopSeller,
  getTopSellers,
  getSimilarDishes,
  addSimilarDish,
  incrementSalesCount,
  addDish,
  getChallengeDish,
  getRecommendedDishes,
  handleGetSimilarDishes,
  filterDishes,
  getDishById,
  getSeasonalDishes,
  getPopularDishesByNeighborhood,
  getDishByMood,
  deleteDish
};
