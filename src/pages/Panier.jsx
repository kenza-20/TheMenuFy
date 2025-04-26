import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from "../components/button";
import BlurContainer from "../components/blurContainer";
import Swal from 'sweetalert'; // Import SweetAlert2

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import salmonImg from "../assets/food/salmon.jpg";
import hamburgerImg from "../assets/food/hamburger.jpg";
import pizzaImg from "../assets/food/pizza.jpg";
import caesarImg from "../assets/food/caesar-salad.jpg";

import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51RBkqsCMQL0uvhhSJtakmUvGDI24HNEfXmxVe9He1Cx9ACn7giTWVri20IwYyDYzEzo71OY6zlLjmg9Ob8ah7b2f00LmqRXMPe'); 

const meals = [
  {
    id: 'price_1RBl55CMQL0uvhhSDmPSQbEX',
    name: 'Grilled Salmon Plate',
    description: 'Lemon herb grilled salmon with rice and seasonal vegetables.',
    price: 18.25,
    image: salmonImg
  },
  {
    id: 'price_1RBl3oCMQL0uvhhSvIH9lTr8',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with cheddar, lettuce, tomato, and house sauce on a brioche bun.',
    price: 10.99,
    image: hamburgerImg
  },
  {
    id: 'price_1RBkzzCMQL0uvhhSYu42XsbP',
    name: 'Pepperoni Pizza',
    description: 'Classic pizza topped with pepperoni and mozzarella cheese.',
    price: 12.99,
    image: pizzaImg
  },
  {
    id: 'price_1RBkyiCMQL0uvhhSrfzb3Apf',
    name: 'Salade César',
    description: 'Crisp romaine, garlic croutons, Parmesan, and Caesar dressing.',
    price: 8.90,
    image: caesarImg
  },
];

//   4000001240000000

const generateInvoicePDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Invoice', 14, 22);

  const headers = [['Meal', 'Quantity', 'Price (CAD)', 'Subtotal']];
  const data = meals
    .filter(meal => quantities[meal.id] > 0)
    .map(meal => [
      meal.name,
      quantities[meal.id],
      `$${meal.price.toFixed(2)}`,
      `$${(meal.price * quantities[meal.id]).toFixed(2)}`
    ]);

    const now = new Date();
const formattedDate = now.toLocaleDateString();
const formattedTime = now.toLocaleTimeString();

doc.setFontSize(11);
doc.text(`Date: ${formattedDate}   Time: ${formattedTime}`, 14, 27);

  doc.autoTable({
    head: headers,
    body: data,
    startY: 30
  });

  doc.text(`Total: $${total}`, 14, doc.lastAutoTable.finalY + 10);

  doc.save('invoice.pdf');
};


const Panier = () => {
  const [quantities, setQuantities] = useState(meals.reduce((acc, meal) => {
    acc[meal.id] = 1;
    return acc;
  }, {}));

  const navigate = useNavigate();

  const removeMeal = (id) => {
    setQuantities(prev => ({
      ...prev,
      [id]: 0
    }));
  };

  const updateQuantity = (id, delta) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta)
    }));
  };

  const total = meals.reduce((acc, meal) => acc + meal.price * quantities[meal.id], 0).toFixed(2);

  const handleCheckout = async () => {
    try {
      const selectedMeals = meals
      .filter(meal => quantities[meal.id] > 0)
      .map(meal => ({
        name: meal.name,
        quantity: quantities[meal.id],
        price: meal.price,
        subtotal: (meal.price * quantities[meal.id]).toFixed(2)
      }));

    const total = selectedMeals.reduce((acc, item) => acc + parseFloat(item.subtotal), 0).toFixed(2);

    // Save to localStorage so we can access it on the Success page
    localStorage.setItem("invoiceData", JSON.stringify({ selectedMeals, total }));

    // Proceed to Stripe checkout
      const line_items = meals
        .filter(meal => quantities[meal.id] > 0)
        .map(meal => ({
          price: meal.id,
          quantity: quantities[meal.id],
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
      swal("Error", "An error occurred during the checkout process. Please try again.", "error");;
    
    }
  };
  


  
  return (
    <div className="relative min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/about-bg.jpg')" }}>
      <div className="absolute inset-0 bg-black/20"></div>

      <BlurContainer blur="xl" opacity={50} padding={8} rounded="2xl" className="w-full max-w-7xl mx-auto p-6 mt-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Meal Checkout</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-white">
            <thead className="bg-white/10 backdrop-blur-sm">
              <tr>
                <th className="p-3">Meal</th>
                <th className="p-3">Description</th>
                <th className="p-3">Price (CAD)</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Subtotal</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {meals.map(meal => (
                quantities[meal.id] > 0 && (
                  <tr key={meal.id} className="border-t border-white/20">
                    <td className="p-3 font-medium flex items-center justify-start gap-5">
                      <img src={meal.image} alt={meal.name} className="w-12 h-12 object-cover rounded shadow" />
                      {meal.name}
                    </td>
                    <td className="p-3 text-sm">{meal.description}</td>
                    <td className="p-3">${meal.price.toFixed(2)}</td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => updateQuantity(meal.id, -1)}>-</Button>
                        <span>{quantities[meal.id]}</span>
                        <Button size="sm" variant="outline" onClick={() => updateQuantity(meal.id, 1)}>+</Button>
                      </div>
                    </td>
                    <td className="p-3">${(meal.price * quantities[meal.id]).toFixed(2)}</td>
                    <td className="p-3">
                      <button onClick={() => removeMeal(meal.id)} className="text-red-500 hover:text-red-700 cursor-pointer transition duration-200 mt-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-circle-minus">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                          <path d="M9 12l6 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-right flex items-start justify-end gap-5">
          <h2 className="text-2xl font-semibold text-white mt-1">Total: ${total}</h2>
          <Button onClick={handleCheckout}>Checkout</Button>
        </div>
      </BlurContainer>
    </div>
  );
};

export default Panier;