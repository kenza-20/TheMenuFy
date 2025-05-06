import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TimeBasedMealSuggestions = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMealsForTime = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/meals/time-of-day');
        if (Array.isArray(response.data)) {
          setMeals(response.data);
        } else {
          setError('Data format error: expected an array of meals.');
        }
      } catch (err) {
        console.error('Error fetching meals:', err);
        setError('Failed to load meals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMealsForTime();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/login1.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />
      <main className="relative flex-grow flex items-center justify-center py-6 px-4 sm:px-6 lg:px-20">
        <div className="w-full max-w-7xl mx-auto">
          <h2 className="text-3xl text-center text-yellow-400 mb-8">🍴 Meal Suggestions</h2>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meals.length === 0 ? (
                <p className="text-center text-gray-300">No meals available for this time of the day.</p>
              ) : (
                meals.map((meal) => (
                  <div
                    key={meal._id}
                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    {meal.photo && (
                      <img
                        src={meal.photo}
                        alt={meal.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-xl font-semibold text-yellow-400 mb-2">{meal.name}</h3>
                    <p className="text-gray-300 text-sm mb-2">{meal.notes}</p>
                    <p className="text-sm text-gray-400 mb-1">Type: {meal.mealType}</p>
                    <p className="text-sm text-gray-400 mb-1">Calories: {meal.calories}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(meal.date).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TimeBasedMealSuggestions;
