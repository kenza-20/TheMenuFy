import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';  // Import the trash icon
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const navigate = useNavigate();

    // Load favorites from localStorage on page load
    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
    }, []);

    const removeFromFavorites = (item) => {
        const updatedFavorites = favorites.filter(fav => fav.id !== item.id);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
        setPopupMessage(`${item.name} removed from favorites!`);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
    };

    const handleImageClick = (item) => {
        navigate(`/dish/${item.id}`, { state: { item } });
    };

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
                    <h2 className="text-3xl text-center text-yellow-400 mb-8">Your Favorites</h2>

                    {/* Favorites Items */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.length === 0 ? (
                                <p className="text-center text-gray-300">No favorites added yet.</p>
                            ) : (
                                favorites.map(item => (
                                    <div
                                        key={item.id}
                                        className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            onClick={() => handleImageClick(item)}
                                            className="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer"
                                        />
                                        <h3 className="text-xl font-semibold text-yellow-400 mb-2">{item.name}</h3>
                                        <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                                        <div className="flex justify-between items-center space-x-2">
                                            <span className="text-lg font-bold text-yellow-500">{item.price}€</span>
                                            <button
                                                onClick={() => removeFromFavorites(item)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-full text-sm hover:bg-red-600 flex items-center transition-all"
                                            >
                                                <FaTrash className="mr-2" /> {/* Replaced FaHeart with FaTrash */}
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Confirmation Popup */}
            {showPopup && (
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="bg-black bg-opacity-50 absolute inset-0"></div>
                    <div className="relative bg-yellow-500 text-black p-6 rounded-lg shadow-lg max-w-md w-full flex flex-col items-center">
                        <h3 className="text-xl font-semibold">{popupMessage}</h3>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="mt-4 text-lg font-bold text-black bg-white px-4 py-2 rounded-full hover:bg-gray-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Favorites;
