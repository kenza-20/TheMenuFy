import React, { useState, useEffect } from 'react';
import { FaPlus, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';


const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('starters');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [searchLetter, setSearchLetter] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const id_user = typeof window !== "undefined" ? localStorage.getItem("userId") : null;


  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([])
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    axios.get(`http://localhost:3000/api/orders/${id_user}`)
      .then(response => {
        const transformedMeals = response.data.map(item => ({
          price_id:item.price_id
        }));
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


  // Fetch meals from API
  





  const categories = ['starters', 'mains', 'desserts'];

  const addToCart = async (item) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("User not logged in");
      return;
    }
  
    console.log("this is the item", item);
  
    // Check if the item already exists in the orders based on price_id
    const isAlreadyInCart = orders.some(order => order.price_id === item.price_id);
  
    if (isAlreadyInCart) {
      // Show SweetAlert if the item is already in the cart
      Swal.fire({
        icon: 'warning',
        title: 'Already in Cart',
        text: `The item ${item.name} is already in your cart!`,
        confirmButtonText: 'Ok',
      });
      return;
    }
  
    // If not already in cart, add the item to orders
    const newOrder = {
      orderedAt: Date.now(),
      id_user: userId,
      id_dish: item._id,
      name: item.name,
      price: item.price,
      price_id: item.price_id,
      description: item.description,
      image: item.image,
    };
  
    console.log(newOrder, "newOrder");
  
    try {
      const res = await axios.post("http://localhost:3000/api/orders/add", newOrder);
      console.log(res, "res orderr");
  
      // Optionally update the orders state to reflect the new order
      setOrders([...orders, newOrder]);
  
       Swal.fire({
             icon: 'success',
             title: 'Added to Cart!',
             text: `The item ${item.name} was added to your cart.`,
             confirmButtonText: 'Ok',
           }).then(() => {
            //  navigate('/resto/2/menu'); // redirect only after user clicks 'Ok'
           });
    } catch (error) {
      console.error('Error adding order:', error);
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

  const handleImageClick = (item) => {
    console.log(item._id,"CLICKED")
    navigate(`/dish/${item._id}`, { state: { item } });
  };

  const filteredMenuItems = menuItems.filter(item =>
      item.name.toLowerCase().startsWith(searchLetter.toLowerCase()) &&
      item.category === activeCategory
  );

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
                {filteredMenuItems.map((item,j) => (
                    <div
                        key={j}
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
                            onClick={() => addToCart(item)}
                            className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm hover:bg-yellow-600 flex items-center transition-all"
                        >
                          <FaPlus className="mr-2" />
                          Add
                        </button>
                        <button
                            onClick={() => addToFavorites(item)}
                            className="bg-red-500 text-white px-4 py-2 rounded-full text-sm hover:bg-red-600 flex items-center transition-all"
                        >
                          <FaHeart className="mr-2" />
                        </button>
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