import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('plats');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    {
      id: 1,
      category: 'entrées',
      name: 'Salade César',
      description: 'Laitue romaine, croûtons, parmesan, sauce césar maison',
      price: 8.90,
      image: '/salade-cesar.jpg'
    },
    {
      id: 2,
      category: 'plats',
      name: 'Bœuf Bourguignon',
      description: 'Bœuf mijoté au vin rouge, carottes, oignons, champignons',
      price: 18.50,
      image: '/boeuf-bourguignon.jpg'
    },
    {
      id: 3,
      category: 'desserts',
      name: 'Crème Brûlée',
      description: 'Crème vanille caramélisée à la perfection',
      price: 6.90,
      image: '/creme-brulee.jpg'
    },
  ];

  const categories = ['entrées', 'plats', 'desserts'];

  useEffect(() => {
    const handleSearchChange = (e) => {
      setSearchQuery(e.detail);
    };
    window.addEventListener("search-change", handleSearchChange);
    return () => window.removeEventListener("search-change", handleSearchChange);
  }, []);

  const addToCart = (item) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("Utilisateur non connecté");
      return;
    }

    const commandes = JSON.parse(localStorage.getItem('commandes')) || [];
    const nouvelleCommande = {
      id_commande: Date.now(),
      id_user: userId,
      id_plat: item.id,
    };

    localStorage.setItem('commandes', JSON.stringify([...commandes, nouvelleCommande]));
    setPopupMessage(`Commande ajoutée : ${item.name}`);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const filteredItems = menuItems.filter(item => {
    const lowerSearch = searchQuery.toLowerCase();
    const match =
    item.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().startsWith(searchQuery.toLowerCase())
    

    return searchQuery ? match : item.category === activeCategory;
  });

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
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
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
                      Ajouter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-black bg-opacity-50 absolute inset-0"></div>
          <div className="relative bg-yellow-500 text-black p-6 rounded-lg shadow-lg max-w-md w-full flex flex-col items-center">
            <h3 className="text-xl font-semibold">{popupMessage}</h3>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 text-lg font-bold text-black bg-white px-4 py-2 rounded-full hover:bg-gray-200"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
