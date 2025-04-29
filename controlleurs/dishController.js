const Dish = require('../models/dishModel');
const jwt = require('jsonwebtoken');
const validator = require("validator"); 
const User = require('../models/userModel'); // 👈 Assure-toi que ce `require` est présent en haut du fichier


// ✅ Recommander des plats compatibles avec les préférences du user
const getRecommendedDishes = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    const excluded = user.excludedIngredients || [];

    // Retourne les plats qui ne contiennent AUCUN des ingrédients exclus
    const dishes = await Dish.find({
      ingredients: { $not: { $elemMatch: { $in: excluded } } }
    });

    res.status(200).json(dishes);
  } catch (err) {
    console.error("Erreur getRecommendedDishes :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Add a new dish
const addDish = async (req, res) => {
  const { name, description, price, category, image, isTopSeller } = req.body;

  try {
    // Create a new dish object
    const newDish = new Dish({
      name,
      description,
      price,
      category,
      image,
      isTopSeller,
      salesCount: 0, // Initially set sales count to 0
    });

    // Save the dish to the database
    await newDish.save();

    // Respond with success
    res.status(201).json({
      message: 'Dish added successfully',
      dish: newDish,
    });
  } catch (error) {
    // Handle any errors during the process
    res.status(500).json({
      error: 'Error adding dish',
      details: error.message,
    });
  }
};

// Mark dish as top seller
const markTopSeller = async (dishId) => {
  try {
    // Step 1: Set all dishes' `isTopSeller` to false
    await Dish.updateMany({}, { isTopSeller: false });

    // Step 2: Find the dish and set `isTopSeller` to true for the given dishId
    const dish = await Dish.findById(dishId);
    if (!dish) {
      throw new Error("Dish not found");
    }
    dish.isTopSeller = true;

    // Save the updated dish
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
    // Fetch all dishes sorted by `salesCount` in descending order and return the top seller
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
    // Fetch the top seller to exclude from the similar dishes
    const topSeller = await getTopSellers();

    // Find similar dishes within the same category, but exclude the top seller by its _id
    const similarDishes = await Dish.find({
      category,
      _id: { $ne: topSeller._id },  // Exclude the top seller
    }).limit(6);  // Limit to a reasonable number of similar dishes

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

    // Push the similar dish to the list of similar dishes
    dish.similarDishes.push(similarDishId);

    // Save the updated dish
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

    // Increment the sales count
    dish.salesCount += 1;

    // Save the updated dish
    await dish.save();
  } catch (error) {
    console.error("Error updating sales count:", error);
    throw new Error("Error updating sales count");
  }
};

// Fetch a challenge dish (e.g., from a specific category)
const getChallengeDish = async () => {
  try {
    const challengeDish = await Dish.findOne({ category: 'salade' }); // Example query
    if (!challengeDish) {
      throw new Error('Challenge dish not found');
    }
    return challengeDish;
  } catch (error) {
    throw error;
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
  getRecommendedDishes, // ✅ ajoute ceci
};