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

  // const menuItems = [
  //   {
  //     id: 1,
  //     category: 'starters',
  //     name: 'Caesar Salad',
  //     description: 'Romaine lettuce, croutons, parmesan, homemade caesar dressing',
  //     price: 8.90,
  //     image: 'https://www.seriouseats.com/thmb/Fi_FEyVa3_-_uzfXh6OdLrzal2M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/the-best-caesar-salad-recipe-06-40e70f549ba2489db09355abd62f79a9.jpg',
  //   },
  //   {
  //     id: 2,
  //     category: 'mains',
  //     name: 'Beef Bourguignon',
  //     description: 'Beef stewed in red wine, carrots, onions, mushrooms',
  //     price: 18.50,
  //     image: 'https://www.seriouseats.com/thmb/_CovX26D-Z6wpeDYJXGhFhA47H8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/MMPSOUPSANDSTEWS-SEA-BoeufBourguignon-FredHardyII-000-991c38a78f934722954c47567b6be97b.jpg',
  //   },
  //   {
  //     id: 3,
  //     category: 'desserts',
  //     name: 'Crème Brûlée',
  //     description: 'Vanilla cream caramelized to perfection',
  //     price: 6.90,
  //     image: 'https://assets.afcdn.com/recipe/20161201/4190_w1024h1024c1cx2705cy1803.webp',
  //   },
  //   {
  //     id: 4,
  //     category: 'starters',
  //     name: 'Bruschetta',
  //     description: 'Grilled bread with tomato, garlic, basil and olive oil',
  //     price: 7.50,
  //     image: 'https://www.simplyorganic.com/media/wysiwyg/tmp/simply-oragnic-Roasted-Tomato-Bruschetta-1080x1080-thumbnail.jpg',
  //   },
  //   {
  //     id: 5,
  //     category: 'starters',
  //     name: 'French Onion Soup',
  //     description: 'Caramelized onions, beef broth, cheese-topped crouton',
  //     price: 9.00,
  //     image: 'https://www.thespruceeats.com/thmb/BYc5SJFHrCWFCRpTO5Z2IvMtrZs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/easy-french-onion-soup-3062131-hero-01-2a93bd3c60084db5a8a8e1039c0e0a2f.jpg',
  //   },
  //   {
  //     id: 6,
  //     category: 'mains',
  //     name: 'Coq au Vin',
  //     description: 'Chicken braised with wine, mushrooms, bacon and garlic',
  //     price: 17.00,
  //     image: 'https://www.francine.com/wp-content/uploads/2018/09/coq-au-vin-51190848505-1.webp',
  //   },
  //   {
  //     id: 7,
  //     category: 'mains',
  //     name: 'Grilled Salmon',
  //     description: 'Grilled salmon fillet with lemon butter sauce',
  //     price: 19.50,
  //     image: 'https://images.getrecipekit.com/20220505193805-grilled-garlic-dijon-salmon_1000x.webp?class=16x9',
  //   },
  //   {
  //     id: 8,
  //     category: 'desserts',
  //     name: 'Chocolate Lava Cake',
  //     description: 'Rich chocolate cake with molten center',
  //     price: 7.90,
  //     image: 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2010/12/28/4/FNM_010111-Copy-That-026_s4x3.jpg.rend.hgtvcom.1280.960.suffix/1382545880780.jpeg',
  //   },
  //   {
  //     id: 9,
  //     category: 'desserts',
  //     name: 'Tiramisu',
  //     description: 'Coffee-flavored Italian dessert with mascarpone',
  //     price: 8.50,
  //     image: 'https://biancolievito.it/wp-content/uploads/2023/09/MASCHERA-WORDPRESS-3.webp',
  //   },
  // ];

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
  
      setPopupMessage(`Order added: ${item.name}`);
      setShowPopup(true);
  
      setTimeout(() => {
        setShowPopup(false);
        // navigate('/orders'); // Navigate to orders page after 3 seconds (optional)
      }, 3000);
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
    navigate(`/dish/${item.id}`, { state: { item } });
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