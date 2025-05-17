import React, { useState, useEffect } from "react";
import axios from "axios";

const MoodPage = () => {
  const [mood, setMood] = useState("");
  const [recommendedDishes, setRecommendedDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!mood) return;

    const fetchMoodBasedDishes = async () => {
      setLoading(true);
      setError(""); // Clear previous errors

      try {
        const res = await axios.get(`http://localhost:3000/api/dish/mood/${mood}`);
        if (res.data.length === 0) {
          setError("No dishes found for this mood.");
        }
        setRecommendedDishes(res.data); // Directly update with the received dish data (not wrapped in array)
      } catch (err) {
        setError("Error fetching mood-based dishes.");
        console.error("Error fetching mood-based dishes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodBasedDishes();
  }, [mood]);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Mood Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center -z-10">
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="max-w-4xl px-4 space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold animate-fade-in">
            Find the Perfect Dish for Your Mood
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            Whether you're feeling happy, tired, or adventurous, we have something just for you!
          </p>

          <div className="space-x-4">
            <button
              onClick={() => setMood("happy")}
              className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-full hover:bg-yellow-500 transform transition duration-300 hover:scale-105 shadow-lg"
            >
              Happy Mood
            </button>
            <button
              onClick={() => setMood("tired")}
              className="inline-block bg-teal-500 text-white px-8 py-3 rounded-full hover:bg-teal-600 transition duration-300"
            >
              Tired Mood
            </button>
            <button
              onClick={() => setMood("adventurous")}
              className="inline-block bg-pink-500 text-white px-8 py-3 rounded-full hover:bg-pink-600 transition duration-300"
            >
              Adventurous Mood
            </button>
          </div>
        </div>
      </section>

      {/* Recommended Dishes */}
      {loading && (
        <div className="text-center py-20 text-xl text-yellow-400">Loading...</div>
      )}

      {error && (
        <div className="text-center py-20 text-xl text-red-400">{error}</div>
      )}

      {recommendedDishes.length > 0 && !loading && !error && (
        <section className="py-20 bg-black/75">
          <div className="container mx-auto px-6">
            <h2 className="text-5xl font-bold text-center text-yellow-400 mb-12">
              Dishes for Your Mood
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {recommendedDishes.map((dish) => (
                <div key={dish._id} className="bg-black/40 rounded-2xl shadow-lg backdrop-blur-md text-white overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-2xl font-semibold mb-2">{dish.name}</h3>
                    <p className="text-sm text-gray-300 mb-3">{dish.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-400 font-bold">{dish.price} TND</span>
                      <button className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm hover:bg-yellow-500 transition">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default MoodPage;
