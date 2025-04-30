import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Orders = () => {
    const id_user = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    const [orders, setOrders] = useState([]);
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

    


    const handleDeleteOrder = (orderId) => {
        // Delete order from localStorage
        const updatedOrders = orders.filter(order => order.id_order !== orderId);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        setOrders(updatedOrders);
    };

    const handleNavigateToMenu = () => {
        navigate('/resto/2/menu');
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