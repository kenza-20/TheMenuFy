const yup = require('yup');

// Validation for adding a new dish
const validateDishCreation = async (req, res, next) => {
  try {
    const schema = yup.object().shape({
      name: yup.string().required('Dish name is required'),
      description: yup.string().required('Dish description is required'),
      price: yup.number().positive().required('Dish price is required and must be a positive number'),
      category: yup.string().required('Dish category is required'),
      // You can add more fields like image, or salesCount validation here if needed
    });

    await schema.validate(req.body, { abortEarly: false });

    next();
  } catch (err) {
    res.status(400).json({ error: err.errors || "Validation failed for dish creation" });
  }
};

// Validation for updating a dish (e.g., marking a dish as top seller)
const validateDishUpdate = async (req, res, next) => {
  try {
    const schema = yup.object().shape({
      name: yup.string().optional(),
      description: yup.string().optional(),
      price: yup.number().positive().optional(),
      category: yup.string().optional(),
      isTopSeller: yup.boolean().optional(),
      similarDishes: yup.array().of(yup.string()).optional(),
    });

    await schema.validate(req.body, { abortEarly: false });

    next();
  } catch (err) {
    res.status(400).json({ error: err.errors || "Validation failed for dish update" });
  }
};

// Validation for adding a similar dish (validating dish IDs)
const validateSimilarDish = (req, res, next) => {
    const { dishId } = req.params; // Only dishId is needed for this route
    
    if (!dishId) {
      return res.status(400).json({ error: 'Dish ID is required' });
    }
    
    next();
  };
  

// Validation for sales count (increment sales)
const validateSalesIncrement = async (req, res, next) => {
  const { dishId } = req.params;

  if (!dishId) {
    return res.status(400).json({ error: 'Dish ID is required to increment sales count' });
  }

  // You can add more validation logic for sales if needed (for example, checking if sales can be incremented)
  next();
};

module.exports = {
  validateDishCreation,
  validateDishUpdate,
  validateSimilarDish,
  validateSalesIncrement,
};
