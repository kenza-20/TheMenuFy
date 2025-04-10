import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('starters');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const menuItems = [
    {
      id: 1,
      category: 'starters',
      name: 'Caesar Salad',
      description: 'Romaine lettuce, croutons, parmesan, homemade caesar dressing',
      price: 8.90,
      image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTH3xpcoJVqNygIpxeIdf_DQ2q46z3-cLyHnkXGwlyft5z1bHRQ7OuXRhe0iZ3h063yoNnaJIfLq7T20ZbeOzFNdcU7Pbe4k6di2JFX3LY',
    },
    {
      id: 2,
      category: 'mains',
      name: 'Beef Bourguignon',
      description: 'Beef stewed in red wine, carrots, onions, mushrooms',
      price: 18.50,
      image: 'https://www.seriouseats.com/thmb/_CovX26D-Z6wpeDYJXGhFhA47H8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/MMPSOUPSANDSTEWS-SEA-BoeufBourguignon-FredHardyII-000-991c38a78f934722954c47567b6be97b.jpg',
    },
    {
      id: 3,
      category: 'desserts',
      name: 'Crème Brûlée',
      description: 'Vanilla cream caramelized to perfection',
      price: 6.90,
      image: 'https://assets.afcdn.com/recipe/20161201/4190_w1024h1024c1cx2705cy1803.webp',
    },
  ];

  const categories = ['starters', 'mains', 'desserts'];
  const navigate = useNavigate(); // Hook for navigation

  const addToCart = (item) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("User not logged in");
      return;
    }

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const newOrder = {
      id_order: Date.now(),
      id_user: userId,
      id_dish: item.id,
    };

    localStorage.setItem('orders', JSON.stringify([...orders, newOrder]));

    setPopupMessage(`Order added: ${item.name}`);
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const handleReservation = (item) => {
    // Pass dish info to the Reservation page
    navigate('/reservation', { state: { item } });
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
          <div className="flex justify-center mb-8 space-x-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium ${
                  activeCategory === category
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white/10 text-yellow-400 hover:bg-yellow-400/20'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems
                .filter(item => item.category === activeCategory)
                .map(item => (
                  <div
                    key={item.id}
                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-semibold text-yellow-400 mb-2">{item.name}</h3>
                    <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-yellow-500">{item.price}€</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm hover:bg-yellow-600 flex items-center transition-all"
                      >
                        <FaPlus className="mr-2" />
                        Add
                      </button>
                      <button
                        onClick={() => handleReservation(item)} // Redirect to Reservation
                        className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition-all"
                      >
                        Reservation
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation popup */}
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

export default Menu;
