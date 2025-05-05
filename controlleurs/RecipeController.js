const Recipe = require('../models/Recipe');

// Create a new recipe
// exports.createRecipe = async (req, res) => {
//   const { name, meal, prepTime, protein, fat, carbs, ingredients, allergies, calories, notes, image } = req.body;

//   try {
//     const newRecipe = new Recipe({
//       name,
//       meal,
//       prepTime,
//       protein,
//       fat,
//       carbs,
//       ingredients,
//       allergies,
//       calories,
//       notes,
//       image
//     });

//     const recipe = await newRecipe.save();
//     res.status(201).json({ message: "Recipe added successfully", recipe });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error adding recipe", error: error.message });
//   }
// };


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

// Update a recipe
// exports.updateRecipe = async (req, res) => {
//   const { id } = req.params;
//   const { name, meal, prepTime, protein, fat, carbs, ingredients, allergies, calories, notes, image } = req.body;

//   try {
//     const updatedRecipe = await Recipe.findByIdAndUpdate(id, {
//       name, meal, prepTime, protein, fat, carbs, ingredients, allergies, calories, notes, image
//     }, { new: true });

//     if (!updatedRecipe) {
//       return res.status(404).json({ message: "Recipe not found" });
//     }

//     res.status(200).json({ message: "Recipe updated successfully", updatedRecipe });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error updating recipe", error: error.message });
//   }
// };

// // Delete a recipe
// exports.deleteRecipe = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedRecipe = await Recipe.findByIdAndDelete(id);

//     if (!deletedRecipe) {
//       return res.status(404).json({ message: "Recipe not found" });
//     }

//     res.status(200).json({ message: "Recipe deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error deleting recipe", error: error.message });
//   }
// };
