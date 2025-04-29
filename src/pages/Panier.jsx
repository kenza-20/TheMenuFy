import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import Swal from 'sweetalert'; // Import SweetAlert2
import Button from "../components/button";
import BlurContainer from "../components/blurContainer";
import salmonImg from "../assets/food/salmon.jpg";
import hamburgerImg from "../assets/food/hamburger.jpg";
import pizzaImg from "../assets/food/pizza.jpg";
import caesarImg from "../assets/food/caesar-salad.jpg";

const stripePromise = loadStripe('pk_test_51RBkqsCMQL0uvhhSJtakmUvGDI24HNEfXmxVe9He1Cx9ACn7giTWVri20IwYyDYzEzo71OY6zlLjmg9Ob8ah7b2f00LmqRXMPe'); 

const meals = [
  {
    id: 'price_1RBl55CMQL0uvhhSDmPSQbEX',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, croutons, parmesan, homemade caesar dressing',
    price: 8.90,
    image: 'https://www.seriouseats.com/thmb/Fi_FEyVa3_-_uzfXh6OdLrzal2M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/the-best-caesar-salad-recipe-06-40e70f549ba2489db09355abd62f79a9.jpg'
  },

  {
    id: 'price_1RBl3oCMQL0uvhhSvIH9lTr8',
    category: 'mains',
    name: 'Beef Bourguignon',
    description: 'Beef stewed in red wine, carrots, onions, mushrooms',
    price: 18.50,
    image: 'https://www.seriouseats.com/thmb/_CovX26D-Z6wpeDYJXGhFhA47H8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/MMPSOUPSANDSTEWS-SEA-BoeufBourguignon-FredHardyII-000-991c38a78f934722954c47567b6be97b.jpg'
  },

  {
    id: 'price_1RBkzzCMQL0uvhhSYu42XsbP',
    category: 'desserts',
      name: 'Crème Brûlée',
      description: 'Vanilla cream caramelized to perfection',
      price: 6.90,
      image: 'https://assets.afcdn.com/recipe/20161201/4190_w1024h1024c1cx2705cy1803.webp'
    },
  {
    id: 'price_1RBkyiCMQL0uvhhSrfzb3Apf',
    category: 'starters',
    name: 'Bruschetta',
    description: 'Grilled bread with tomato, garlic, basil and olive oil',
    price: 7.50,
    image: 'https://www.simplyorganic.com/media/wysiwyg/tmp/simply-oragnic-Roasted-Tomato-Bruschetta-1080x1080-thumbnail.jpg',
  },
];

//   4000001240000000

const Panier = () => {
  const [cartItems, setCartItems] = useState([]);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [quantities, setQuantities] = useState({});
  
  const navigate = useNavigate();

  // Load cart data from localStorage on component mount
  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    setCartItems(orders);

    // Initialize quantities from the cart items
    const initialQuantities = {};
    orders.forEach(item => {
      initialQuantities[item.id_order] = 1; // default quantity is 1
    });
    setQuantities(initialQuantities);
  }, []);

  // Update quantity for an item
  const updateQuantity = (id_order, delta) => {
    setQuantities(prevQuantities => {
      const newQuantities = { ...prevQuantities };
      const newQuantity = newQuantities[id_order] + delta;
      if (newQuantity >= 1) {
        newQuantities[id_order] = newQuantity;
      }
      return newQuantities;
    });
  };

  // Remove item from cart
  const removeFromCart = (id_order) => {
    const updatedCart = cartItems.filter(item => item.id_order !== id_order);
    setCartItems(updatedCart);
    localStorage.setItem('orders', JSON.stringify(updatedCart));

    setPopupMessage('Item removed from cart');
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((acc, item) => {
    const itemQuantity = quantities[item.id_order] || 1;
    return acc + item.price * itemQuantity;
  }, 0).toFixed(2);

  // Handle checkout process
  const handleCheckout = async () => {
    try {
      const selectedMeals = meals.map(item => ({
        name: item.name,
        quantity: quantities[item.id_order] || 1,
        price: item.price,
        subtotal: (item.price * (quantities[item.id_order] || 1)).toFixed(2)
      }));

      const total = selectedMeals.reduce((acc, item) => acc + parseFloat(item.subtotal), 0).toFixed(2);

      // Save to localStorage so we can access it on the Success page
      localStorage.setItem("invoiceData", JSON.stringify({ selectedMeals, total }));

      // Proceed to Stripe checkout
      const line_items = meals.map(item => ({
        price: item.id, 
        quantity: quantities[item.id_order] || 1,
      }));

      const response = await fetch('http://localhost:3000/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line_items }),
      });

      const { id } = await response.json();

      if (!id) throw new Error('sessionId not returned from server');

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: id });

    } catch (error) {
      console.error('Error during checkout:', error);
      Swal("Error", "An error occurred during the checkout process. Please try again.", "error");
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/about-bg.jpg')" }}>
      <div className="absolute inset-0 bg-black/20"></div>

      <BlurContainer blur="xl" opacity={50} padding={8} rounded="2xl" className="w-full max-w-7xl mx-auto p-6 mt-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Your Cart</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-white">
            <thead className="bg-white/10 backdrop-blur-sm">
              <tr>
                <th className="p-3">Meal</th>
                <th className="p-3">Description</th>
                <th className="p-3">Price</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Subtotal</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id_order} className="border-t border-white/20">
                  <td className="p-3 font-medium flex items-center justify-start gap-5">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded shadow" />
                    {item.name}
                  </td>
                  <td className="p-3 text-sm">{item.description}</td>
                  <td className="p-3">${item.price.toFixed(2)}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id_order, -1)}>-</Button>
                      <span>{quantities[item.id_order]}</span>
                      <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id_order, 1)}>+</Button>
                    </div>
                  </td>
                  <td className="p-3">${(item.price * (quantities[item.id_order] || 1)).toFixed(2)}</td>
                  <td className="p-3">
                    <button onClick={() => removeFromCart(item.id_order)} className="text-red-500 hover:text-red-700 cursor-pointer transition duration-200 mt-3">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-right flex items-start justify-end gap-5">
          <h2 className="text-2xl font-semibold text-white mt-1">Total: ${totalPrice}</h2>
          <Button onClick={handleCheckout}>Proceed to Payment</Button>
        </div>
      </BlurContainer>
    </div>
  );
};

export default Panier;
