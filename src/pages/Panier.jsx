import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

import Button from "../components/button"
import BlurContainer from "../components/blurContainer"
import swal from "sweetalert"
import "jspdf-autotable"
import axios from "axios"
import { toast } from "sonner"
import { loadStripe } from "@stripe/stripe-js"
const stripePromise = loadStripe(
  "pk_test_51RBkqsCMQL0uvhhSJtakmUvGDI24HNEfXmxVe9He1Cx9ACn7giTWVri20IwYyDYzEzo71OY6zlLjmg9Ob8ah7b2f00LmqRXMPe",
)
import Swal from "sweetalert2"
import { ShoppingBag } from "lucide-react"
import CartSuggestions from "../components/cart-suggestion-component"

//   4000001240000000

const Panier = () => {
  const [meals, setMeals] = useState([])
  const [quantities, setQuantities] = useState({})
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const id_user = typeof window !== "undefined" ? localStorage.getItem("userId") : null
  const [orderNote, setOrderNote] = useState("")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await axios.get(`http://localhost:3000/api/orders/${id_user}`)
        .then(response => {
          console.log('aaaaaaaa',response.data)
          const transformedMeals = response.data.map(item => ({
            id: item.price_id,
            name: item.name,
            description: item.description,
            image: item.image,
            price: item.price,
            ingredients: item.ingredients || [],
            quantity: item.quantity
          }));
          console.log('iiiiii',transformedMeals.ingredients)

          setMeals(transformedMeals);

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
    
      } catch (error) {
        console.error("Failed to fetch cart items :", error)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load your cart items. Please try again later.",
        })
      } finally {
        setLoading(false)
      }
    }

    if (id_user) {
      fetchOrders()
    } else {
      navigate("/login")
    }
  }, [id_user])
  useEffect(() => {}, [])

  useEffect(() => {
    // Check for saved note from order history
    const savedNote = localStorage.getItem("cartOrderNote")
    if (savedNote) {
      setOrderNote(savedNote)
      // Clear it after using it to avoid affecting future cart sessions
      localStorage.removeItem("cartOrderNote")
    }
  }, [])

  const removeMeal = async (name, id) => {
    // Show the confirmation alert before proceeding with the deletion
    const result = await Swal.fire({
      title: "Are you sure ?",
      text: "You want to delete this order ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2b7fff",
      cancelButtonColor: "#eab308",
      confirmButtonText: "Yes, delete it !",
    })

    // If the user confirms, proceed with the deletion
    if (result.isConfirmed) {
      // Perform the delete request after confirmation
      await axios
        .delete(`http://localhost:3000/api/orders/${id_user}/${id}`)
        .then(() => {
          // Show success message
          Swal.fire({
            title: "Deleted!",
            text: `${name} has been removed from cart`,
            icon: "success",
          })

          // Update the state to reflect the deletion
          setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== id))
          setQuantities((prev) => ({
            ...prev,
            [id]: 0,
          }))
        })
        .catch((error) => {
          // Handle error during deletion
          Swal.fire({
            title: "Error!",
            text: "There was an error while deleting the meal.",
            icon: "error",
          })
          console.error("Failed to delete meal:", error)
        })
    }
  }

  const updateQuantity = async (id, delta) => {
    const newQuantity = Math.max(0, (quantities[id] || 0) + delta)

    setQuantities((prev) => ({
      ...prev,
      [id]: newQuantity,
    }))

    try {
      if (delta === 1) {
        await axios.put(`http://localhost:3000/api/orders/${id_user}/${id}/increment`)
      } else if (delta === -1 && newQuantity > 0) {
        await axios.put(`http://localhost:3000/api/orders/${id_user}/${id}/decrement`)
      }
    } catch (error) {
      console.error("Failed to update quantity:", error)
      toast.error("Failed to update quantity.")
    }
  }

  const total = meals.reduce((acc, meal) => acc + meal.price * (quantities[meal.id] || 0), 0).toFixed(2)

  const calculateTotalCalories = () => {
    let totalCalories = 0;
    meals.forEach(meal => {
      const mealCalories = (meal.ingredients || []).reduce((sum, ing) => sum + (ing.calories || 0), 0);
      totalCalories += mealCalories * (quantities[meal.id] || 0);
    });
    return totalCalories;
  };


  const handleCheckout = async () => {
    const totalCalories = calculateTotalCalories();
     const userSettings = JSON.parse(localStorage.getItem("userSettings")) || {};
     const { maxCalories, minCalories } = userSettings;
 
     // Avertissement si calories hors des limites
     if ((maxCalories && totalCalories > maxCalories) || (minCalories && totalCalories < minCalories)) {
       const result = await Swal.fire({
         title: 'Calorie Warning',
         text: `Your total calories (${totalCalories}) ${maxCalories && totalCalories > maxCalories ? `exceed your max limit of ${maxCalories}` : ''}${minCalories && totalCalories < minCalories ? `are below your min requirement of ${minCalories}` : ''}. Do you still want to continue?`,
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Yes, proceed to payment',
         cancelButtonText: 'Cancel',
       });
 
       if (!result.isConfirmed) return; // Stop si utilisateur annule
     }
 
    console.log("mealsss before sending to success", meals)
    try {
      const selectedMeals = meals
        .filter((meal) => quantities[meal.id] > 0)
        .map((meal) => ({
          price_id: meal.id,
          // _id: "idddd",
          description: meal.description,
          image: meal.image,
          name: meal.name,
          quantity: quantities[meal.id],
          price: meal.price,
          subtotal: (meal.price * quantities[meal.id]).toFixed(2),
        }))

      const total = selectedMeals.reduce((acc, item) => acc + Number.parseFloat(item.subtotal), 0).toFixed(2)

      localStorage.setItem(
        "invoiceData",
        JSON.stringify({
          selectedMeals,
          total,
          noteCommande: orderNote,
        }),
      )

      const line_items = selectedMeals.map((meal) => ({
        price: meals.find((m) => m.name === meal.name).id,
        quantity: meal.quantity,
      }))

      const response = await fetch("http://localhost:3000/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ line_items }),
      })

      const { id } = await response.json()

      if (!id) throw new Error("sessionId not returned from server")

      const stripe = await stripePromise
      await stripe.redirectToCheckout({ sessionId: id })
    } catch (error) {
      console.error("Error during checkout:", error)
      swal("Error", "An error occurred during the checkout process. Please try again.", "error")
    }
  }

  // New function to handle adding a suggested item to cart
  const handleAddSuggestion = async (item) => {
    try {
      const newOrder = {
        orderedAt: Date.now(),
        id_user: id_user,
        name: item.name,
        price: item.price,
        price_id: item.price_id,
        description: item.description,
        image: item.image,
        quantity: 1,
      }

      await axios.post("http://localhost:3000/api/orders/add", newOrder)

      // Update the local state
      const newMeal = {
        id: item.price_id,
        name: item.name,
        description: item.description,
        image: item.image,
        price: item.price,
        quantity: 1,
      }

      setMeals((prevMeals) => [...prevMeals, newMeal])
      setQuantities((prev) => ({
        ...prev,
        [item.price_id]: 1,
      }))
    } catch (error) {
      console.error("Failed to add suggestion to cart:", error)
      toast.error("Failed to add item to cart.")
    }
  }




  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/about-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      <BlurContainer
        blur="xl"
        opacity={50}
        padding={8}
        rounded="2xl"
        className="w-full max-w-7xl mx-auto p-6 mt-35 mb-25"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Meal Checkout</h1>
           <motion.div
                            className="mt-5 mb-8 border-b-4 border-yellow-500 w-48 rounded-full shadow-lg md:mx-0 mx-auto"
                            initial={{ width: 0 }}
                            animate={{ width: "12rem" }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            ></motion.div>
        </div>
                            

        </div>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : meals.length === 0 ? (
          <div className="mt-20 flex flex-col items-center justify-center h-full">
            <ShoppingBag className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
            <h3 className=" text-xl font-semibold text-white mb-2">No items Found </h3>
            <p className="text-white/80">You haven't placed any Items In Cart yet.</p>
            <button
              onClick={() => navigate("/resto/2/menu")}
              className="mt-6 px-6 py-2 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-colors"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-white ">
                <thead className="bg-white/10 backdrop-blur-sm">
                  <tr className="border-spacing-x-6">
                    <th className="p-3">Meal</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Price (CAD)</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Subtotal</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {meals.map(
                    (meal) =>
                      quantities[meal.id] > 0 && (
                        <tr key={meal.id} className="border-t border-white/20">
                          <td className="pr-8 pl-3 py-3 font-medium flex items-center justify-start gap-5">
                            <img
                              src={meal.image || "/placeholder.svg"}
                              alt={meal.name}
                              className="w-12 h-12 object-cover rounded shadow"
                            />
                            {meal.name}
                          </td>
                          <td className="pl-6 pr-3 py-3 text-sm">{meal.description}</td>
                          <td className="p-3">${meal.price.toFixed(2)}</td>
                          <td className="p-3">
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline" onClick={() => updateQuantity(meal.id, -1)}>
                                -
                              </Button>
                              <span>{quantities[meal.id]}</span>
                              <Button size="sm" variant="outline" onClick={() => updateQuantity(meal.id, 1)}>
                                +
                              </Button>
                            </div>
                          </td>
                          <td className="p-3">${(meal.price * quantities[meal.id]).toFixed(2)}</td>
                          <td className="p-3">
                            <button
                              onClick={() => removeMeal(meal.name, meal.id)}
                              className="text-red-500 hover:text-red-700 cursor-pointer transition duration-200 mt-3"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="icon icon-tabler icons-tabler-outline icon-tabler-circle-minus"
                              >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                <path d="M9 12l6 0" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ),
                  )}
                </tbody>
              </table>
            </div>

            {/* Cart Suggestions Component */}
            {meals.length > 0 && (
              <CartSuggestions cartItems={meals} userId={id_user} onAddToCart={handleAddSuggestion} />
            )}

            <div className="mt-20 flex md:flex-row items-start justify-between w-full gap-5">
              <div className="w-full md:w-1/3">
                <label htmlFor="orderNote" className="block text-white text-sm font-medium mb-2">
                  Add a note to your order (optional)
                </label>
                <textarea
                  id="orderNote"
                  rows={3}
                  className="w-full p-3 h-13 bg-white/10 backdrop-blur-sm text-white rounded-md border border-white/20 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Special instructions, allergies, delivery notes..."
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-end justify-end">
                <h2 className="text-2xl font-semibold text-white mt-1">Total: ${total}</h2>
                <Button onClick={handleCheckout} className="mt-4">
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </BlurContainer>
    </div>
  )
}

export default Panier
