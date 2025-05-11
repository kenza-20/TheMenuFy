const User = require("../models/userModel")
const Recipe = require("../models/Recipe")

const addToFavorites = async (req, res) => {
  try {
    const { userId, dishId } = req.body

    // Validate inputs
    if (!userId || !dishId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Dish ID are required",
      })
    }

    // Find the user
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check if dish already in favorites
    if (user.favorites && user.favorites.includes(dishId)) {
      return res.status(200).json({
        success: true,
        message: "Dish already in favorites",
        favorites: user.favorites,
      })
    }

    // Initialize favorites array if it doesn't exist
    if (!user.favorites) {
      user.favorites = []
    }

    // Add to favorites
    user.favorites.push(dishId)
    await user.save()

    // Return success response
    res.status(200).json({
      success: true,
      message: "Dish added to favorites",
      favorites: user.favorites,
    })
  } catch (err) {
    console.error("Error in addToFavorites:", err)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    })
  }
}

/**
 * Remove a dish from user's favorites
 * @route POST /api/favorites/remove
 */
const removeFromFavorites = async (req, res) => {
  try {
    const { userId, dishId } = req.body

    // Validate inputs
    if (!userId || !dishId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Dish ID are required",
      })
    }

    // Find the user
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check if favorites array exists
    if (!user.favorites || !Array.isArray(user.favorites)) {
      return res.status(200).json({
        success: true,
        message: "No favorites to remove from",
        favorites: [],
      })
    }

    // Check if dish is in favorites
    if (!user.favorites.includes(dishId)) {
      return res.status(200).json({
        success: true,
        message: "Dish not in favorites",
        favorites: user.favorites,
      })
    }

    // Remove from favorites
    user.favorites = user.favorites.filter((id) => id !== dishId)
    await user.save()

    // Return success response
    res.status(200).json({
      success: true,
      message: "Dish removed from favorites",
      favorites: user.favorites,
    })
  } catch (err) {
    console.error("Error in removeFromFavorites:", err)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    })
  }
}


const getUserFavorites = async (req, res) => {
  try {
    const { userId } = req.params

    // Validate input
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      })
    }

    // Find the user
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // If no favorites, return empty array
    if (!user.favorites || user.favorites.length === 0) {
      return res.status(200).json({
        success: true,
        favorites: [],
      })
    }

    // Get all recipes that match the favorite IDs
    const favorites = await Recipe.find({ _id: { $in: user.favorites } })

    // Return favorites
    res.status(200).json({
      success: true,
      favorites,
    })
  } catch (err) {
    console.error("Error in getUserFavorites:", err)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    })
  }
}


const checkFavorite = async (req, res) => {
  try {
    const { userId, dishId } = req.params

    // Validate inputs
    if (!userId || !dishId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Dish ID are required",
      })
    }

    // Find the user
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check if dish is in favorites
    const isFavorite = user.favorites && user.favorites.includes(dishId)

    // Return result
    res.status(200).json({
      success: true,
      isFavorite,
    })
  } catch (err) {
    console.error("Error in checkFavorite:", err)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    })
  }
}

module.exports = {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  checkFavorite,
}
