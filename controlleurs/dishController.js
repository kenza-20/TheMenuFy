const Dish = require('../models/dishModel');
const jwt = require('jsonwebtoken');
const validator = require("validator"); 


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
  
  

  async function addSimilarDish(dishId, similarDishId) {
    try {
      const dish = await Dish.findById(dishId);
      dish.similarDishes.push(similarDishId);
      await dish.save();
    } catch (error) {
      console.error("Error adding similar dish:", error);
    }
  }
  

  async function incrementSalesCount(dishId) {
    try {
      const dish = await Dish.findById(dishId);
      dish.salesCount += 1;  // Increment the sales count
      await dish.save();
    } catch (error) {
      console.error("Error updating sales count:", error);
    }
  }
  

  module.exports = {markTopSeller,getTopSellers,getSimilarDishes,addSimilarDish,incrementSalesCount,addDish};
  