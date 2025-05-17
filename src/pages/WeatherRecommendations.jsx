import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash'; // If you prefer lodash

const WeatherRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [weather, setWeather] = useState(null); // Added weather state
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherRecommendations = async (city) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/weather/recommendations/${city}`);
      
      // Validate response structure
      const { weather, recommendations } = response.data || {};
  
      if (weather && Array.isArray(recommendations)) {
        setWeather(weather);
        setRecommendations(recommendations);
      } else {
        throw new Error('Invalid response format from backend.');
      }
    } catch (err) {
      console.error('Error fetching weather recommendations:', err);
      setError('Failed to load weather recommendations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  // Debounced version of fetchWeatherRecommendations
  const debouncedFetch = useRef(
    debounce((cityName) => fetchWeatherRecommendations(cityName), 5000) // Wait 500ms after user stops typing
  ).current;

  const handleCityChange = (event) => {
    setCity(event.target.value);
    debouncedFetch(event.target.value); // Call the debounced function
  };

  useEffect(() => {
    if (city) {
      debouncedFetch(city);
    }
  }, [city, debouncedFetch]);

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
          backgroundImage: "url('/weather-background.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />
      <main className="relative flex-grow flex items-center justify-center py-6 px-4 sm:px-6 lg:px-20">
        <div className="w-full max-w-7xl mx-auto">
          <h2 className="text-3xl text-center text-yellow-400 mb-8">☀️ Weather Recommendations</h2>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <div className="mb-6">
              <input
                type="text"
                value={city}
                onChange={handleCityChange}
                placeholder="Enter city name"
                className="w-full p-3 text-lg text-gray-700 rounded-md"
              />
            </div>

            {recommendations.length === 0 && !loading && !error ? (
              <p className="text-center text-gray-300">No recommendations available for this city.</p>
            ) : (
              <>
                {weather && (
                  <div className="mb-6 text-center">
                    <p className="text-xl text-gray-300">Weather in {weather.city}:</p>
                    <p className="text-lg text-yellow-400">{weather.temperature}°C - {weather.weather}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((recommendation) => (
                    <div
                      key={recommendation._id}
                      className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      {recommendation.photo && (
                        <img
                          src={recommendation.photo}
                          alt={recommendation.name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="text-xl font-semibold text-yellow-400 mb-2">{recommendation.name}</h3>
                      <p className="text-gray-300 text-sm mb-2">{recommendation.description}</p>
                      <p className="text-sm text-gray-400 mb-1">Temperature: {recommendation.temperature}°C</p>
                      <p className="text-sm text-gray-400 mb-1">Humidity: {recommendation.humidity}%</p>
                      <p className="text-sm text-gray-500">
                        {new Date(recommendation.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeatherRecommendations;
