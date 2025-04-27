import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Dish data can be moved to a separate file or kept here if it's static
const dishes = [
  {
    id: 1,
    name: 'Caesar Salad',
    description: 'Romaine lettuce, croutons, parmesan, homemade caesar dressing',
    price: 8.90,
    image: 'https://www.seriouseats.com/thmb/Fi_FEyVa3_-_uzfXh6OdLrzal2M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/the-best-caesar-salad-recipe-06-40e70f549ba2489db09355abd62f79a9.jpg',
    origin: 'United States',
    ingredients: [
      { name: 'Romaine lettuce', amount: 50, calories: 14, carbs: 3 },
      { name: 'Croutons', amount: 30, calories: 400, carbs: 70 },
      { name: 'Parmesan', amount: 20, calories: 431, carbs: 4 },
      { name: 'Caesar dressing', amount: 30, calories: 140, carbs: 2 },
    ],
    allergens: ['Dairy', 'Gluten'],
  },
  {
    id: 2,
    name: 'Beef Bourguignon',
    description: 'Beef stewed in red wine, carrots, onions, mushrooms',
    price: 18.50,
    image: 'https://www.seriouseats.com/thmb/_CovX26D-Z6wpeDYJXGhFhA47H8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/MMPSOUPSANDSTEWS-SEA-BoeufBourguignon-FredHardyII-000-991c38a78f934722954c47567b6be97b.jpg',
    origin: 'France',
    ingredients: [
      { name: 'Beef', amount: 200, calories: 250, carbs: 0 },
      { name: 'Red wine', amount: 100, calories: 85, carbs: 2 },
      { name: 'Carrots', amount: 50, calories: 20, carbs: 5 },
      { name: 'Onions', amount: 50, calories: 20, carbs: 5 },
      { name: 'Mushrooms', amount: 50, calories: 15, carbs: 3 },
    ],
  },
  {
    id: 3,
    name: 'Crème Brûlée',
    description: 'Vanilla cream caramelized to perfection',
    price: 6.90,
    image: 'https://assets.afcdn.com/recipe/20161201/4190_w1024h1024c1cx2705cy1803.webp',
    origin: 'France',
    ingredients: [
      { name: 'Vanilla', amount: 5, calories: 12, carbs: 2 },
      { name: 'Egg yolks', amount: 30, calories: 55, carbs: 1 },
      { name: 'Sugar', amount: 20, calories: 80, carbs: 20 },
      { name: 'Cream', amount: 50, calories: 250, carbs: 3 },
    ],
  },
  {
    id: 4,
    name: 'Bruschetta',
    description: 'Bruschetta is an Italian appetizer that consists of toasted bread topped with a mixture of fresh ingredients, typically including tomatoes, basil, garlic, olive oil, and balsamic vinegar.',
    price: 7.50,
    image: 'https://www.simplyorganic.com/media/wysiwyg/tmp/simply-oragnic-Roasted-Tomato-Bruschetta-1080x1080-thumbnail.jpg',
    origin: 'Italy',
    ingredients: [
      { name: 'Italian bread', amount: 50, calories: 130, carbs: 25 },
      { name: 'Tomato sauce', amount: 30, calories: 25, carbs: 5 },
      { name: 'Mozzarella', amount: 30, calories: 85, carbs: 2 },
      { name: 'Basil', amount: 5, calories: 2, carbs: 0 },
      { name: 'Olive oil', amount: 10, calories: 90, carbs: 0 },
    ],
  },
  {
    id: 5,
    name: 'French Onion Soup',
    description: 'French Onion Soup is a classic French dish made with caramelized onions, beef broth, and topped with a slice of toasted bread and melted cheese.',
    price: 9.00,
    image: 'https://www.thespruceeats.com/thmb/BYc5SJFHrCWFCRpTO5Z2IvMtrZs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/easy-french-onion-soup-3062131-hero-01-2a93bd3c60084db5a8a8e1039c0e0a2f.jpg',
    origin: 'France',
    ingredients: [
      { name: 'French baguette', amount: 50, calories: 140, carbs: 30 },
      { name: 'Beef Broth', amount: 200, calories: 60, carbs: 2 },
      { name: 'Garlic', amount: 5, calories: 5, carbs: 1 },
      { name: 'Swiss cheese', amount: 30, calories: 110, carbs: 1 },
      { name: 'Olive oil', amount: 10, calories: 90, carbs: 0 },
      { name: 'Onions', amount: 50, calories: 20, carbs: 5 },
    ],
  },
  {
    id: 6,
    name: 'Coq au Vin',
    description: 'Coq au Vin is a traditional French dish made by braising chicken in red wine, usually with vegetables, mushrooms, and herbs.',
    price: 17.00,
    image: 'https://www.francine.com/wp-content/uploads/2018/09/coq-au-vin-51190848505-1.webp',
    origin: 'France',
    ingredients: [
      { name: 'Chicken', amount: 200, calories: 220, carbs: 0 },
      { name: 'Tomato', amount: 50, calories: 20, carbs: 5 },
      { name: 'Cream', amount: 30, calories: 150, carbs: 3 },
      { name: 'Butter', amount: 20, calories: 150, carbs: 0 },
      { name: 'Carrots', amount: 50, calories: 20, carbs: 5 },
      { name: 'Mushrooms', amount: 50, calories: 15, carbs: 3 },
    ],
  },
  {
    id: 7,
    name: 'Grilled Salmon',
    description: 'Grilled Salmon is a simple yet delicious dish, offering a healthy option full of omega-3 fatty acids and protein.',
    price: 19.50,
    image: 'https://images.getrecipekit.com/20220505193805-grilled-garlic-dijon-salmon_1000x.webp?class=16x9',
    origin: 'Japan',
    ingredients: [
      { name: 'Salmon', amount: 200, calories: 300, carbs: 0 },
      { name: 'Lemon', amount: 30, calories: 10, carbs: 3 },
      { name: 'Honey', amount: 10, calories: 30, carbs: 8 },
      { name: 'Olive oil', amount: 10, calories: 90, carbs: 0 },
    ],
  },
  {
    id: 8,
    name: 'Chocolate Lava Cake',
    description: 'Chocolate Lava Cake is a decadent dessert with a rich, molten center that oozes out when you cut into it.',
    price: 7.90,
    image: 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2010/12/28/4/FNM_010111-Copy-That-026_s4x3.jpg.rend.hgtvcom.1280.960.suffix/1382545880780.jpeg',
    origin: 'Mexico',
    ingredients: [
      { name: 'Butter', amount: 50, calories: 350, carbs: 2 },
      { name: 'Chocolate', amount: 100, calories: 450, carbs: 50 },
      { name: 'Sugar', amount: 50, calories: 200, carbs: 50 },
      { name: 'Eggs', amount: 50, calories: 70, carbs: 1 },
      { name: 'Flour', amount: 30, calories: 100, carbs: 22 },
    ],
  },
];


const DishDetail = () => {
  const { id } = useParams();  // Get the id from the URL params
  const navigate = useNavigate(); // To navigate between pages
  const [dish, setDish] = useState(null); // Dish state to hold dish details

  // Fetch dish details when the component mounts or id changes
  useEffect(() => {
    const fetchDishDetails = async () => {
      try {
        // Assuming you have an endpoint to fetch nutritional info (replace with real API call)
        const response = await axios.get(`/api/dish/${id}/nutritional-info`);
        setDish(response.data);
      } catch (error) {
        console.error('Error fetching dish details', error);
      }
    };

    fetchDishDetails();
  }, [id]);

  // Find the dish by id
  const item = dishes.find(dish => dish.id === parseInt(id));

  if (!item || !dish) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-900">
        <h2 className="text-2xl font-bold mb-4">Dish Not Found</h2>
        <button
          onClick={() => navigate('/resto/2/menu')}
          className="bg-yellow-500 text-black px-8 py-3 rounded-full hover:bg-yellow-600 transition duration-300"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  // Calculate total calories and carbs for the dish
  const calculateNutrients = (ingredients) => {
    let totalCalories = 0;
    let totalCarbs = 0;

    ingredients.forEach(ingredient => {
      totalCalories += (ingredient.calories * ingredient.amount) / 100;
      totalCarbs += (ingredient.carbs * ingredient.amount) / 100;
    });

    return { totalCalories, totalCarbs };
  };

  const { totalCalories, totalCarbs } = calculateNutrients(item.ingredients);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: `url(${item.image})`,
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.3)',
        }}
      />

      <main className="relative flex-grow flex items-center justify-center py-6 px-4 sm:px-6 lg:px-20">
        <div className="w-full max-w-7xl mx-auto">
          {/* Dish Details */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-2">{item.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                  <span className="text-lg font-bold text-yellow-500">{item.price}€</span>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-yellow-400 mb-4">Origin</h3>
                <p className="text-gray-300 text-sm">{item.origin}</p>

                <h3 className="text-xl font-semibold text-yellow-400 mb-4 mt-6">Ingredients</h3>
                <ul className="text-gray-300 text-sm list-disc pl-6">
                  {item.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient.name} - {ingredient.amount}g</li>
                  ))}
                </ul>

                {/* Nutritional Info */}
                <h3 className="text-xl font-semibold text-yellow-400 mb-4 mt-6">Nutritional Information</h3>
                <p className="text-gray-300 text-sm">Total Calories: {totalCalories} kcal</p>
                <p className="text-gray-300 text-sm">Total Carbs: {totalCarbs} g</p>

                {/* Allergens & Warnings */}
                <h3 className="text-xl font-semibold text-yellow-400 mb-4 mt-6">Allergens & Warnings</h3>
                <p className="text-gray-300 text-sm">
                  {item.allergens ? `This dish contains: ${item.allergens.join(', ')}` : 'No major allergens detected.'}
                </p>
                <p className="text-red-500 text-sm mt-2">
                  Please consult with staff for further allergen information and dietary restrictions.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/resto/2/menu')}
            className="bg-yellow-500 text-black px-8 py-3 rounded-full hover:bg-yellow-600 transition duration-300"
          >
            Back to Menu
          </button>
        </div>
      </main>
    </div>
  );
};

export default DishDetail;
