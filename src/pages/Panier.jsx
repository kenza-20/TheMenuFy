import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from "../components/button";
import BlurContainer from "../components/blurContainer";
import swal from 'sweetalert';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { toast } from "sonner"
const stripePromise = loadStripe('pk_test_51RBkqsCMQL0uvhhSJtakmUvGDI24HNEfXmxVe9He1Cx9ACn7giTWVri20IwYyDYzEzo71OY6zlLjmg9Ob8ah7b2f00LmqRXMPe');
import Swal from 'sweetalert2';

//   4000001240000000

const Panier = () => {
  const [meals, setMeals] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
  const id_user = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    axios.get(`http://localhost:3000/api/orders/${id_user}`)
      .then(response => {
        const transformedMeals = response.data.map(item => ({
          id: item.price_id,
          name: item.name,
          description: item.description,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        }));
        setMeals(transformedMeals);

        console.log(transformedMeals,"orders")

        // Initialize quantities to 1 for each fetched meal
        const initialQuantities = {};
        transformedMeals.forEach(meal => {
          initialQuantities[meal.id] = meal.quantity; // Utilise la quantité réelle du backend
        });
        setQuantities(initialQuantities);
      })
      .catch(error => {
        console.error('Failed to fetch meals:', error);
      });
  }, []);
  const removeMeal = async (name , id) => {
    // Show the confirmation alert before proceeding with the deletion
    const result = await Swal.fire({
      title: "Are you sure ?",
      text: "You want to delete this order ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2b7fff",
      cancelButtonColor: "#eab308",
      confirmButtonText: "Yes, delete it !",
    });
  
    // If the user confirms, proceed with the deletion
    if (result.isConfirmed) {
      // Perform the delete request after confirmation
      await axios.delete(`http://localhost:3000/api/orders/${id_user}/${id}`).then(() => {
        // Show success message
        Swal.fire({
          title: "Deleted!",
          text: `${name} has been removed from cart`,
          icon: "success"
        });
  
        // Update the state to reflect the deletion
        setMeals(prevMeals => prevMeals.filter(meal => meal.id !== id));
        setQuantities(prev => ({
          ...prev,
          [id]: 0
        }));
      }).catch(error => {
        // Handle error during deletion
        Swal.fire({
          title: "Error!",
          text: "There was an error while deleting the meal.",
          icon: "error"
        });
        console.error('Failed to delete meal:', error);
      });
    }
  };
  

  const updateQuantity = async (id, delta) => {
    const newQuantity = Math.max(0, (quantities[id] || 0) + delta);
  
    setQuantities(prev => ({
      ...prev,
      [id]: newQuantity
    }));
  
    try {
      if (delta === 1) {
        await axios.put(`http://localhost:3000/api/orders/${id_user}/${id}/increment`);
      } else if (delta === -1 && newQuantity > 0) {
        await axios.put(`http://localhost:3000/api/orders/${id_user}/${id}/decrement`);
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error("Failed to update quantity.");
    }
  };
  

  const total = meals.reduce((acc, meal) => acc + meal.price * (quantities[meal.id] || 0), 0).toFixed(2);

  const handleCheckout = async () => {
    try {
      // console.log("mealzz")
      const selectedMeals = meals
        .filter(meal => quantities[meal.id] > 0)
        .map(meal => ({
          dishId: meal._id, // ✅ AJOUT ICI
          price_id:meal.id,
          description:meal.description,
          image:meal.image,
          name: meal.name,
          quantity: quantities[meal.id],
          price: meal.price,
          subtotal: (meal.price * quantities[meal.id]).toFixed(2)
        }));

      const total = selectedMeals.reduce((acc, item) => acc + parseFloat(item.subtotal), 0).toFixed(2);

      localStorage.setItem("invoiceData", JSON.stringify({ selectedMeals, total }));

      await axios.post("http://localhost:3000/api/placedOrders/create", {
        userId: id_user,
        items: selectedMeals,
        total: total
      });
      

      const line_items = selectedMeals.map(meal => ({
        price: meals.find(m => m.name === meal.name).id,
        quantity: meal.quantity,
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
      swal("Error", "An error occurred during the checkout process. Please try again.", "error");
    }
  };

  // const generateInvoicePDF = () => {
  //   const doc = new jsPDF();
  //   doc.setFontSize(18);
  //   doc.text('Invoice', 14, 22);

  //   const headers = [['Meal', 'Quantity', 'Price (CAD)', 'Subtotal']];
  //   const data = meals
  //     .filter(meal => quantities[meal.id] > 0)
  //     .map(meal => [
  //       meal.name,
  //       quantities[meal.id],
  //       `$${meal.price.toFixed(2)}`,
  //       `$${(meal.price * quantities[meal.id]).toFixed(2)}`
  //     ]);

  //   const now = new Date();
  //   const formattedDate = now.toLocaleDateString();
  //   const formattedTime = now.toLocaleTimeString();
  //   doc.setFontSize(11);
  //   doc.text(`Date: ${formattedDate}   Time: ${formattedTime}`, 14, 27);

  //   doc.autoTable({
  //     head: headers,
  //     body: data,
  //     startY: 30
  //   });

  //   doc.text(`Total: $${total}`, 14, doc.lastAutoTable.finalY + 10);

  //   doc.save('invoice.pdf');
  // };

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
                      <button onClick={() => removeMeal(meal.name , meal.id)} className="text-red-500 hover:text-red-700 cursor-pointer transition duration-200 mt-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          className="icon icon-tabler icons-tabler-outline icon-tabler-circle-minus">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
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
          {/* <Button onClick={generateInvoicePDF}>PDF</Button> */}
          <Button onClick={handleCheckout}>Checkout</Button>
        </div>
      </BlurContainer>
    </div>
  );
};

export default Panier;
