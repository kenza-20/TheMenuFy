import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const DishNutritionalInfo = () => {
  const navigate = useNavigate();
  const { dishId } = useParams(); // Getting the dishId from the URL
  const [nutritionalInfo, setNutritionalInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Example meal data (Grilled Chicken Breast with Roasted Vegetables)
  const exampleNutritionalInfo = {
    calories: 500,
    carbs: 30,
    protein: 45,
    fat: 20,
    avgCalories: 475,
  };

  useEffect(() => {
    const fetchNutritionalInfo = async () => {
      try {
        setLoading(true); // Ensure loading state is true before the request
        const response = await axios.get(`/api/dish/${dishId}/nutritional-info`); // Using dynamic dishId
        setNutritionalInfo(response.data);
      } catch (err) {
        console.error('Error fetching nutritional info:', err);
        setError(err.response ? err.response.data.message : 'Failed to load nutritional information.');
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionalInfo();
  }, [dishId]); // Added dishId as dependency to reload if the dish changes

  // If no nutritional info fetched, use example data
  const dataToDisplay = nutritionalInfo || exampleNutritionalInfo;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate('/resto/2/menu')}
          className="bg-yellow-500 text-black px-6 py-3 rounded-full hover:bg-yellow-600 transition duration-300"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  if (!dataToDisplay) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>No nutritional information found.</p>
        <button
          onClick={() => navigate('/resto/2/menu')}
          className="bg-yellow-500 text-black px-6 py-3 rounded-full hover:bg-yellow-600 transition duration-300 mt-4"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/login1.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.5)",
        }}
      />
      <main className="relative flex-grow flex items-center justify-center py-6 px-4 sm:px-6 lg:px-20">
        <div className="w-full max-w-7xl mx-auto">
          <h2 className="text-3xl text-center text-yellow-400 mb-8">Nutritional Information</h2>

          {/* Nutritional Information Display */}
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white/10 rounded-xl p-6 border border-white/10 hover:bg-white/15 transition-colors transform hover:scale-105">
                <p className="text-lg mb-4"><span className="text-yellow-400 font-semibold">Calories:</span> {dataToDisplay.calories} kcal</p>
                <p className="text-lg mb-4"><span className="text-yellow-400 font-semibold">Carbohydrates:</span> {dataToDisplay.carbs} g</p>
                <p className="text-lg mb-4"><span className="text-yellow-400 font-semibold">Protein:</span> {dataToDisplay.protein} g</p>
                <p className="text-lg mb-4"><span className="text-yellow-400 font-semibold">Fat:</span> {dataToDisplay.fat} g</p>

                {/* Example Statistic - Average Calories */}
                <p className="text-lg mb-4"><span className="text-yellow-400 font-semibold">Average Calories per Serving:</span> {dataToDisplay.avgCalories} kcal</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/resto/2/menu')}
            className="mt-6 bg-yellow-500 text-black px-8 py-3 rounded-full hover:bg-yellow-600 transition duration-300"
          >
            Back to Menu
          </button>
        </div>
      </main>
    </div>
  );
};

export default DishNutritionalInfo;
