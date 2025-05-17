import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Orders = () => {
    const id_user = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    const [orders, setOrders] = useState([]);
    // const [menuItems, setMenuItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3000/api/orders/${id_user}`)
          .then(response => {
            console.log("Fetched orders:", response.data)
            setOrders(response.data)
          })
          .catch(error => {
            console.error('Failed to fetch meals:', error)
          })
      
    }, [])

    
    // useEffect(() => {
    //     // Retrieve orders from localStorage
    //     const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    //     setOrders(storedOrders);
    // }, []);

    const handleDeleteOrder = (orderId) => {
        // Delete order from localStorage
        const updatedOrders = orders.filter(order => order.id_order !== orderId);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        setOrders(updatedOrders);
    };

    const handleNavigateToMenu = () => {
        navigate('/resto/2/menu');
    };


    // const menuItems = [
    //     {
    //         id: 1,
    //         category: 'starters',
    //         name: 'Caesar Salad',
    //         description: 'Romaine lettuce, croutons, parmesan, homemade caesar dressing',
    //         price: 8.90,
    //         image: 'https://www.seriouseats.com/thmb/Fi_FEyVa3_-_uzfXh6OdLrzal2M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/the-best-caesar-salad-recipe-06-40e70f549ba2489db09355abd62f79a9.jpg',
    //     },
    //     {
    //         id: 2,
    //         category: 'mains',
    //         name: 'Beef Bourguignon',
    //         description: 'Beef stewed in red wine, carrots, onions, mushrooms',
    //         price: 18.50,
    //         image: 'https://www.seriouseats.com/thmb/_CovX26D-Z6wpeDYJXGhFhA47H8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/MMPSOUPSANDSTEWS-SEA-BoeufBourguignon-FredHardyII-000-991c38a78f934722954c47567b6be97b.jpg',
    //     },
    //     {
    //         id: 3,
    //         category: 'desserts',
    //         name: 'Crème Brûlée',
    //         description: 'Vanilla cream caramelized to perfection',
    //         price: 6.90,
    //         image: 'https://assets.afcdn.com/recipe/20161201/4190_w1024h1024c1cx2705cy1803.webp',
    //     },
    //     {
    //         id: 4,
    //         category: 'starters',
    //         name: 'Bruschetta',
    //         description: 'Grilled bread with tomato, garlic, basil and olive oil',
    //         price: 7.50,
    //         image: 'https://www.simplyorganic.com/media/wysiwyg/tmp/simply-oragnic-Roasted-Tomato-Bruschetta-1080x1080-thumbnail.jpg',
    //     },
    //     {
    //         id: 5,
    //         category: 'starters',
    //         name: 'French Onion Soup',
    //         description: 'Caramelized onions, beef broth, cheese-topped crouton',
    //         price: 9.00,
    //         image: 'https://www.thespruceeats.com/thmb/BYc5SJFHrCWFCRpTO5Z2IvMtrZs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/easy-french-onion-soup-3062131-hero-01-2a93bd3c60084db5a8a8e1039c0e0a2f.jpg',
    //     },
    //     {
    //         id: 6,
    //         category: 'mains',
    //         name: 'Coq au Vin',
    //         description: 'Chicken braised with wine, mushrooms, bacon and garlic',
    //         price: 17.00,
    //         image: 'https://www.francine.com/wp-content/uploads/2018/09/coq-au-vin-51190848505-1.webp',
    //     },
    //     {
    //         id: 7,
    //         category: 'mains',
    //         name: 'Grilled Salmon',
    //         description: 'Grilled salmon fillet with lemon butter sauce',
    //         price: 19.50,
    //         image: 'https://images.getrecipekit.com/20220505193805-grilled-garlic-dijon-salmon_1000x.webp?class=16x9',
    //     },
    //     {
    //         id: 8,
    //         category: 'desserts',
    //         name: 'Chocolate Lava Cake',
    //         description: 'Rich chocolate cake with molten center',
    //         price: 7.90,
    //         image: 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2010/12/28/4/FNM_010111-Copy-That-026_s4x3.jpg.rend.hgtvcom.1280.960.suffix/1382545880780.jpeg',
    //     },
    //     {
    //         id: 9,
    //         category: 'desserts',
    //         name: 'Tiramisu',
    //         description: 'Coffee-flavored Italian dessert with mascarpone',
    //         price: 8.50,
    //         image: 'https://biancolievito.it/wp-content/uploads/2023/09/MASCHERA-WORDPRESS-3.webp',
    //     },
    // ];

    // const getDishImage = (dishId) => {
    //     const dish = orders.find(item => item.id_dish === dishId);
    //     return dish ? dish.image : '';
    // };

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
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-semibold text-yellow-400">Your Orders</h2>
                        <button
                            onClick={handleNavigateToMenu}
                            className="mt-4 bg-yellow-500 text-black px-6 py-2 rounded-full text-sm hover:bg-yellow-600 transition-all"
                        >
                            Go to Menu
                        </button>
                    </div>

                    {/* Orders List */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                        {orders.length === 0 ? (
                            <p className="text-center text-gray-300">No orders yet. Add items to your cart!</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {orders.map(order => (
                                    <div
                                        key={order.id_order}
                                        className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
                                    >
                                        <h3 className="text-xl font-semibold text-yellow-400 mb-2">Dish: &nbsp; {order.name}</h3>
                                        <p className="text-gray-300 text-sm mb-4">Price: &nbsp;  {order.price} $</p>
                                        <img src={order.image} alt="Dish" className="w-full h-48 object-cover rounded-lg mb-4" />
                                        <div className="flex justify-between items-center space-x-2">
                                            <button
                                                onClick={() => handleDeleteOrder(order.id_order)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-full text-sm hover:bg-red-600 flex items-center transition-all"
                                            >
                                                <FaTrashAlt className="mr-2" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Orders;