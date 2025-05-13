const nutritionDB = require('../data/nutritionDB');

const getNutritionData = (req, res) => {
  const { foodItems } = req.body;
  let total = { calories: 0, protein: 0, carbs: 0, fat: 0 };

  foodItems.forEach(item => {
    const food = nutritionDB[item];
    if (food) {
      total.calories += food.calories;
      total.protein += food.protein;
      total.carbs += food.carbs;
      total.fat += food.fat;
    }
  });

  res.json(total);
};

module.exports = { getNutritionData };
