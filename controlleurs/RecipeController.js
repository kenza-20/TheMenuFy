const Recipe = require('../models/Recipe');
const PlacedOrder = require('../models/PlacedOrder');



exports.getAllRecipes = async (req, res) => {

  try {
    const recipes = await Recipe.find({});
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching recipes", error: error.message });
  }
};


exports.getRecipeById = async (req, res) => {
const { id } = req.params;
  try {
    const recipe = await Recipe.findOne({_id: id});
    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching recipe", error: error.message });
  }
};
exports.getRecipeByPriceId = async (req, res) => {
const { price_id } = req.params;
  try {
    const recipe = await Recipe.find({price_id: price_id});
    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching recipe", error: error.message });
  }
};


exports.getRecipeByName = async (req, res) => {
  const { name } = req.params;

  try {
    const recipe = await Recipe.findOne({ name: name });
    
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching recipe by name", error: error.message });
  }
};


//! upselling maram

// Get top selling products
exports.getTopSellingProducts = async (req, res) => {
  try {
    // Aggregate total quantity sold per product (grouped by price_id)
    const topProducts = await PlacedOrder.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.price_id", // <-- FIXED: use _id here
          totalSold: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 4 }
    ]);

    // Extract price_ids from aggregation result
    const priceIds = topProducts.map(p => p._id);

    // Fetch corresponding recipes by price_id
    const topRecipes = await Recipe.find({ price_id: { $in: priceIds } });

    // Sort the recipes to match the top order
    const sortedRecipes = priceIds.map(id =>
      topRecipes.find(recipe => recipe.price_id === id)
    );

    res.status(200).json(sortedRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching top selling products", error: error.message });
  }
};

// Get similar products based on category
exports.getSimilarProducts = async (req, res) => {
  const { category } = req.params

  try {
    const similarRecipes = await Recipe.find({ category }).limit(4)
    res.status(200).json(similarRecipes)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching similar products", error: error.message })
  }
}

// Get product recommendations based on cart items
exports.getCartRecommendations = async (req, res) => {
  const { cartItems } = req.body

  try {
    // Extract categories from cart items
    const cartCategories = new Set()
    const cartIds = new Set()

    cartItems.forEach((item) => {
      if (item.category) {
        cartCategories.add(item.category)
      }
      cartIds.add(item.id)
    })

    // Find recommendations based on categories in cart
    // but exclude items already in cart
    let recommendations = []

    if (cartCategories.size > 0) {
      // Find items in the same categories
      recommendations = await Recipe.find({
        category: { $in: Array.from(cartCategories) },
        price_id: { $nin: Array.from(cartIds) },
      }).limit(4)
    }

    // If we don't have enough recommendations, add some top sellers
    if (recommendations.length < 4) {
      const topSellers = await Recipe.find({
        price_id: { $nin: Array.from(cartIds) },
      }).limit(4 - recommendations.length)

      recommendations = [...recommendations, ...topSellers]
    }

    res.status(200).json(recommendations)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching recommendations", error: error.message })
  }
}

