import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Info } from "lucide-react"
import { Button } from "../components/ui/button"
import BlurContainer from "../components/blurContainer"
import { Link, useLocation, useParams,useNavigate } from "react-router-dom";
import axios from 'axios'
import Swal from 'sweetalert2';

const  DishDetail = () => {
  const [dish, setDish] = useState(null)
  const [activeTab, setActiveTab] = useState("ingredients")
  const { id } = useParams();  // Get the id from the URL params
  const navigate = useNavigate(); // To navigate between pages
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const id_user = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    console.log("received",id)
    console.log(typeof(id))
    const fetchDishDetails = async () => {
        try {
            // Assuming you have an endpoint to fetch nutritional info (replace with real API call)
            const res = await axios.get(`http://localhost:3000/api/recipes/${id}`)
setDish(res.data);
console.log('HAAAAAA', res);
}
         catch (error) {
            console.error('Error fetching dish details', error);
        }
    };

    fetchDishDetails();
}, [id]);



  useEffect(() => {
    axios.get(`http://localhost:3000/api/orders/${id_user}`)
      .then(response => {
        console.log("Fetched orderzzz:", response.data)
        setOrders(response.data);})
      .catch(error => {
        console.error('Failed to fetch meals:', error);
      });      
    
  }, []);

 



const addToCart = async () => {
    if (!id_user) {
      alert("User not logged in");
      return;
    }
  
    console.log("this is the item", dish);
  
    // Check if the item already exists in the orders based on price_id
    const isAlreadyInCart = orders.some(order => order.price_id == dish.price_id);
  
    if (isAlreadyInCart) {
      // Show SweetAlert if the item is already in the cart
      Swal.fire({
        icon: 'warning',
        title: 'Already in Cart',
        text: `The item ${dish.name} is already in your cart!`,
        confirmButtonText: 'Ok',
      });
      return;
    }
  
    // If not already in cart, add the item to orders
    const newOrder = {
      orderedAt: Date.now(),
      id_user: id_user,
      // id_dish: dish._id,
      name: dish.name,
      price: dish.price,
      price_id: dish.price_id,
      description: dish.description,
      image: dish.image,
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
        text: `The item ${dish.name} was added to your cart.`,
        confirmButtonText: 'Ok',
      }).then(() => {
        navigate('/resto/2/menu'); // redirect only after user clicks 'Ok'
      });
      
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };



  // Calculate total calories and carbs
  const calculateNutrients = (ingredients) => {
    if (!ingredients) return { totalCalories: 0, totalCarbs: 0 }

    let totalCalories = 0
    let totalCarbs = 0

    ingredients.forEach((ingredient) => {
      totalCalories += (ingredient.calories * ingredient.amount) / 100
      totalCarbs += (ingredient.carbs * ingredient.amount) / 100
    })

    return { totalCalories: Math.round(totalCalories), totalCarbs: Math.round(totalCarbs) }
  }

  const { totalCalories, totalCarbs } = dish
    ? calculateNutrients(dish.ingredients)
    : { totalCalories: 0, totalCarbs: 0 }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  const tabVariants = {
    inactive: { opacity: 0.7 },
    active: { opacity: 1, scale: 1.05 },
  }

  if (!dish) {
  
        
        return (
      <div className="relative min-h-screen flex flex-col items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat min-h-screen"
          style={{
            backgroundImage: "url('/bg.jpg')",
            boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
          }}
        />
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white text-xl">
            Loading dish details...
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat min-h-screen"
        style={{
          backgroundImage: "url('/bg.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />

      {/* Main content */}
      <div className="relative flex-grow flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-16">
        <div className="w-full max-w-7xl pt-15">
          <BlurContainer blur="xl" opacity={50} padding={8} rounded="2xl" className="w-full mx-auto p-6">
            <motion.div
              className="flex flex-col space-y-10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Back Button */}
              <motion.div variants={itemVariants}>
                {/* <Link to="/reso/2/menu" className="text-white hover:text-yellow-500">
                  <Button variant="ghost" className="text-white hover:text-yellow-400 transition-colors">
                   
                  </Button>
                </Link> */}
                  <Link to="/resto/2/menu" className="text-white hover:text-yellow-500 transition flex align-center"> <ArrowLeft className="relative mr-3 h-7 w-5" />
                  Back to Menu</Link>
                
              </motion.div>

              {/* Header Section */}
              <motion.div className="text-center" variants={itemVariants}>
                <h2 className="text-3xl md:text-5xl font-bold text-white">{dish.name}</h2>
                <p className="mt-4 text-lg text-white">{dish.description || "Not available"}</p>
                <motion.div
                  className="mt-5 mb-8 border-b-4 border-yellow-500 w-48 mx-auto rounded-full shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: "12rem" }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                ></motion.div>
              </motion.div>

              {/* Dish Image and Price */}
              <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-8">
                <motion.div
                  className="w-full md:w-1/2 relative rounded-xl overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={dish.image || "/placeholder.svg"} alt={dish.name} className="w-full h-80 object-cover" />
                  <div className="absolute top-4 right-4 bg-yellow-500 text-black font-bold px-4 py-2 rounded-full">
                    ${dish.price?.toFixed(2) || "Not available"}
                  </div>
                </motion.div>

                {/* Dish Details */}
                <div className="w-full md:w-1/2 bg-black/20 backdrop-blur-sm rounded-xl p-6">
                  {/* Tabs */}
                  <div className="flex mb-6 border-b border-white/20">
                    <motion.button
                      className={`px-4 py-2 text-white ${activeTab === "ingredients" ? "border-b-2 border-yellow-500" : ""}`}
                      onClick={() => setActiveTab("ingredients")}
                      variants={tabVariants}
                      animate={activeTab === "ingredients" ? "active" : "inactive"}
                    >
                      Ingredients
                    </motion.button>
                    <motion.button
                      className={`px-4 py-2 text-white ${activeTab === "nutrition" ? "border-b-2 border-yellow-500" : ""}`}
                      onClick={() => setActiveTab("nutrition")}
                      variants={tabVariants}
                      animate={activeTab === "nutrition" ? "active" : "inactive"}
                    >
                      Nutrition
                    </motion.button>
                    <motion.button
                      className={`px-4 py-2 text-white ${activeTab === "allergens" ? "border-b-2 border-yellow-500" : ""}`}
                      onClick={() => setActiveTab("allergens")}
                      variants={tabVariants}
                      animate={activeTab === "allergens" ? "active" : "inactive"}
                    >
                      Allergens
                    </motion.button>
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    {activeTab === "ingredients" && (
                      <motion.div
                        key="ingredients"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-xl font-semibold text-yellow-400 mb-4">Ingredients</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {dish.ingredients.map((ingredient, index) => (
                            <motion.div
                              key={index}
                              className="bg-white/10 p-3 rounded-lg"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.15)" }}
                            >
                              <p className="text-white font-medium">{ingredient.name}</p>
                              <p className="text-white/70 text-sm">{ingredient.amount}g</p>
                            </motion.div>
                          ))}
                        </div>
                        <div className="mt-4 text-white/80 text-sm">
                          <p>
                            Origin: <span className="text-yellow-400">{dish.origin || "Not available"}</span>
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "nutrition" && (
                      <motion.div
                        key="nutrition"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-xl font-semibold text-yellow-400 mb-4">Nutritional Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <motion.div className="bg-white/10 p-4 rounded-lg text-center" whileHover={{ scale: 1.05 }}>
                            <p className="text-white/70 text-sm">Total Calories</p>
                            <p className="text-white text-2xl font-bold">{totalCalories}</p>
                            <p className="text-white/70 text-xs">kcal</p>
                          </motion.div>
                          <motion.div className="bg-white/10 p-4 rounded-lg text-center" whileHover={{ scale: 1.05 }}>
                            <p className="text-white/70 text-sm">Total Carbs</p>
                            <p className="text-white text-2xl font-bold">{totalCarbs}</p>
                            <p className="text-white/70 text-xs">g</p>
                          </motion.div>
                        </div>
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold text-yellow-400 mb-2">Ingredients Breakdown</h4>
                          <div className="space-y-3">
                            
                          {dish.ingredients && dish.ingredients.length > 0 ? (
  dish.ingredients.map((ingredient, index) => (
    <motion.div
      key={index}
      className="flex justify-between items-center bg-white/10 p-3 rounded-lg mb-2"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div>
        <p className="text-white">{ingredient?.name || "Unnamed ingredient"}</p>
        <p className="text-white/70 text-xs">
          {ingredient?.amount != null ? `${ingredient.amount}g` : "Amount not available"}
        </p>
      </div>
      <div className="text-right">
        <p className="text-white">
          {ingredient?.calories != null ? `${ingredient.calories} kcal` : "Calories not available"}
        </p>
        <p className="text-white/70 text-xs">
          {ingredient?.carbs != null ? `${ingredient.carbs}g carbs` : "Carbs not available"}
        </p>
      </div>
    </motion.div>
  ))
) : (
  <p className="text-white/70">No ingredients available.</p>
)}



                          </div>
                        </div>
                      </motion.div>
                    )}

{activeTab === "allergens" && (
  <motion.div
    key="allergens"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    <h3 className="text-xl font-semibold text-yellow-400 mb-4">Allergens & Warnings</h3>
    <div className="bg-white/10 p-4 rounded-lg mb-4">
      <div className="flex items-start">
        <Info className="text-yellow-400 mr-2 h-5 w-5 mt-0.5" />
        <p className="text-white">
          {(dish?.allergens && dish.allergens.length > 0)
            ? "This dish contains the following allergens:"
            : "This dish contains no known allergens."}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {(dish?.allergens && dish.allergens.length > 0) ? (
          dish.allergens.map((allergen, index) => (
            <motion.span
              key={index}
              className="bg-red-500/20 border border-red-500/50 text-white px-3 py-1 rounded-full text-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              {allergen}
            </motion.span>
          ))
        ) : (
          <span className="text-white/60 italic">No allergens</span>
        )}
      </div>
    </div>
    <p className="text-white/80 text-sm mt-4">
      Please inform our staff of any allergies or dietary restrictions before ordering.
    </p>
  </motion.div>
)}


                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Order Button */}
              <motion.div variants={itemVariants} className="flex justify-center">
                <Button  onClick={() => addToCart()}  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semi-bold px-8 py-6 text-lg rounded-full">
                  Add to Cart
                </Button>
              </motion.div>
            </motion.div>
          </BlurContainer>
        </div>
      </div>
    </div>
  )
}


export default DishDetail;