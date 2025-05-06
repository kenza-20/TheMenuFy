import React, { useState, useEffect } from 'react';
import { FaPlus, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
// import { FaHeart, FaPlus } from "react-icons/fa"


const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('starters');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [searchLetter, setSearchLetter] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [goal, setGoal] = useState('None');


  const id_user = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    // Lire goal depuis userSetting dans le localStorage
    const settings = JSON.parse(localStorage.getItem("userSettings"));
    setGoal(settings?.goal || "None");
  }, []);

  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([])
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    axios.get(`http://localhost:3000/api/orders/${id_user}`)
      .then(response => {
        const transformedMeals = response.data
        setOrders(transformedMeals)})
      .catch(error => {
        console.error('Failed to fetch meals:', error);
      });
  }, []);


  useEffect(() => {
    axios.get(`http://localhost:3000/api/recipes/all`)
      .then(response => {
        console.log("Fetched recipeeeeeeeeeeess:", response.data)
        setMenuItems(response.data)
      })
      .catch(error => {
        console.error('Failed to fetch meals:', error)
      })
  
}, [])


  const categories = ['starters', 'mains', 'desserts'];

  

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().startsWith(searchLetter.toLowerCase());
    const matchesCategory = item.category === activeCategory;
    const matchesGoal = !goal || goal === "None" || item.goal === goal;
    return matchesSearch && matchesCategory && matchesGoal;
  });

  const addToCart = async (item) => {
    console.log("item",item.ingredients)
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("User not logged in");
      return;
    }

    const userAllergies = Array.isArray(user.allergies)
        ? user.allergies.map(a => a.toLowerCase().trim())
        : typeof user.allergies === "string"
            ? user.allergies.split(",").map(a => a.toLowerCase().trim())
            : [];

    const recipeAllergens = Array.isArray(item.allergens)
        ? item.allergens.map(a => a.toLowerCase().trim())
        : [];

    const allergensInCommon = recipeAllergens.filter(allergen =>
        userAllergies.includes(allergen)
    );

    if (allergensInCommon.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: '⚠️ Allergènes détectés',
        html: `Ce plat contient : <strong>${allergensInCommon.join(", ")}</strong>`,
        confirmButtonText: 'Retour'
      });
      return;
    }

    const isAlreadyInCart = orders.some(order => order.price_id === item.price_id);
    if (isAlreadyInCart) {
      Swal.fire({
        icon: 'warning',
        title: 'Already in Cart',
        text: `The item ${item.name} is already in your cart!`,
        confirmButtonText: 'Ok',
      });
      return;
    }

    const newOrder = {
      orderedAt: Date.now(),
      id_user: userId,
      // id_dish: item._id,
      name: item.name,
      price: item.price,
      price_id: item.price_id,
      description: item.description,
      image: item.image,
    };
  
    console.log(newOrder, "newOrder");
  
    try {
      await axios.post("http://localhost:3000/api/orders/add", newOrder);
      
      console.log('new',newOrder.ingredients)
      setOrders([...orders, newOrder]);
  
       Swal.fire({
             icon: 'success',
             title: 'Added to Cart!',
             text: `The item ${item.name} was added to your cart.`,
             confirmButtonText: 'Ok',
           })
    } catch (error) {
      console.error('Erreur lors de l’ajout au panier:', error);
    }
  };

  const addToFavorites = (item) => {
    const existingFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (existingFavorites.some(fav => fav.id === item.id)) {
      setPopupMessage(`${item.name} is already in favorites!`);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    const updatedFavorites = [...existingFavorites, item];
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);

    setPopupMessage(`Added to favorites: ${item.name}`);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
    navigate('/favorites');
  };

  const handleItemClick = (item) => {
    console.log(item._id,"CLICKED")
    navigate(`/dish/${item._id}`, { state: { item } });
  };

 

  useEffect(() => {
    const notificationListener = () => {
      const newNotification = JSON.parse(localStorage.getItem('notification'));
      if (newNotification) {
        setNotifications((prev) => [...prev, newNotification]);
        localStorage.removeItem('notification');
      }
    };

    window.addEventListener('storage', notificationListener);
    return () => {
      window.removeEventListener('storage', notificationListener);
    };
  }, []);

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

            {/* Categories */}
            <div className="flex justify-center mb-8 space-x-4">
              {categories.map((category,i) => (
                  <button
                      key={i}
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

            {/* Search Input */}
            <div className="mb-8 flex items-center space-x-2">
              <input
                  type="text"
                  value={searchLetter}
                  onChange={(e) => setSearchLetter(e.target.value)}
                  placeholder="Search"
                  className="px-4 py-2 w-full max-w-xs bg-white/10 text-white border border-white/30 rounded-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/60 transition"
              />
            </div>

            {/* Menu Items */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               


              {filteredMenuItems.map((item, j) => (
        <div
          key={j}
          className=" bg-black/10 rounded-xl cursor-pointer backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-yellow-300/50 transition-all duration-300 group flex flex-col h-[400px]"
          onClick={() => {handleItemClick(item)}}
          >
          <div className="relative overflow-hidden">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="rounded-lg w-full h-52 object-cover transition-transform duration-500 group-hover:scale-103 cursor-pointer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="p-5 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-yellow-400 group-hover:text-yellow-300 transition-colors">
                {item.name}
              </h3>
              <span className="text-sm font-bold text-white bg-yellow-500/20 px-3 py-1 rounded-full">
                {item.price} $
              </span>
            </div>

            <p className="text-gray-300 text-sm mb-4 line-clamp-2 flex-grow">{item.description}</p>

            <div className="flex justify-between items-center mt-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(item);
                }}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-5 py-2 rounded-full text-sm font-medium hover:from-yellow-400 hover:to-yellow-500 flex items-center transition-all shadow-lg shadow-yellow-500/20"
              >
                <FaPlus className="mr-2" size={14} />
                Add to Cart
              </button>

              <button
onClick={(e) => {
  e.stopPropagation();
  addToFavorites(item);
}}
                className="bg-black/30 backdrop-blur-sm border border-white/10 text-white p-2.5 rounded-full hover:bg-yellow-500/10 hover:border-yellow-500/50 hover:text-yellow-400 transition-all"
                aria-label="Add to favorites"
              >
                <FaHeart size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    



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

export default Menu;