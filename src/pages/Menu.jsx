"use client"

import { useState, useEffect } from "react"
import { FaPlus, FaHeart } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("starters")
  const [searchLetter, setSearchLetter] = useState("")
  const [favorites, setFavorites] = useState([])
  const [notifications, setNotifications] = useState([])
  const [goal, setGoal] = useState("None")
  const [menuItems, setMenuItems] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const userId = localStorage.getItem("userId")
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  // Load user settings and goal
  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem("userSettings"))
    setGoal(settings?.goal || "None")
  }, [])

  // Fetch user's orders
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:3000/api/orders/${userId}`)
        .then((response) => {
          setOrders(response.data)
        })
        .catch((error) => {
          console.error("Failed to fetch orders:", error)
        })
    }
  }, [userId])

  // Fetch menu items
  useEffect(() => {
    setLoading(true)
    axios
      .get(`http://localhost:3000/api/recipes/all`)
      .then((response) => {
        setMenuItems(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to fetch recipes:", error)
        setLoading(false)
      })
  }, [])

  // Fetch user's favorites
  useEffect(() => {
    if (userId && token) {
      fetchUserFavorites()
    }
  }, [userId, token])

  const fetchUserFavorites = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/favorites/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success && response.data.favorites) {
        // Store just the IDs for easy checking
        const favoriteIds = response.data.favorites.map((item) => item._id)
        setFavorites(favoriteIds)
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error)
    }
  }

  const categories = ["starters", "mains", "desserts"]

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().startsWith(searchLetter.toLowerCase())
    const matchesCategory = item.category === activeCategory
    const matchesGoal = !goal || goal === "None" || item.goal === goal
    return matchesSearch && matchesCategory && matchesGoal
  })

  const addToCart = async (item, e) => {
    e.stopPropagation()

    if (!userId) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to add items to your cart",
        confirmButtonText: "Ok",
        confirmButtonColor: "#EAB308",
      })
      return
    }

    const user = JSON.parse(localStorage.getItem("user"))

    // Check for allergies
    const userAllergies = Array.isArray(user.allergies)
      ? user.allergies.map((a) => a.toLowerCase().trim())
      : typeof user.allergies === "string"
        ? user.allergies.split(",").map((a) => a.toLowerCase().trim())
        : []

    const recipeAllergens = Array.isArray(item.allergens) ? item.allergens.map((a) => a.toLowerCase().trim()) : []

    const allergensInCommon = recipeAllergens.filter((allergen) => userAllergies.includes(allergen))

    if (allergensInCommon.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "⚠️ Allergènes détectés",
        html: `Ce plat contient : <strong>${allergensInCommon.join(", ")}</strong>`,
        confirmButtonText: "Retour",
        confirmButtonColor: "#EAB308",
      })
      return
    }

    // Check if already in cart
    const isAlreadyInCart = orders.some((order) => order.price_id === item.price_id)
    if (isAlreadyInCart) {
      Swal.fire({
        icon: "warning",
        title: "Already in Cart",
        text: `The item ${item.name} is already in your cart!`,
        confirmButtonText: "Ok",
        confirmButtonColor: "#EAB308",
      })
      return
    }

    // Add to cart
    const newOrder = {
      orderedAt: Date.now(),
      id_user: userId,
      name: item.name,
      price: item.price,
      price_id: item.price_id,
      description: item.description,
      image: item.image,
    }

    try {
      await axios.post("http://localhost:3000/api/orders/add", newOrder)
      setOrders([...orders, newOrder])

      Swal.fire({
        icon: "success",
        title: "Added to Cart!",
        text: `The item ${item.name} was added to your cart.`,
        confirmButtonText: "Ok",
        confirmButtonColor: "#EAB308",
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add item to cart",
        confirmButtonText: "Ok",
        confirmButtonColor: "#EAB308",
      })
    }
  }

  const toggleFavorite = async (item, e) => {
    e.stopPropagation()

    if (!userId || !token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to manage favorites",
        confirmButtonText: "Ok",
        confirmButtonColor: "#EAB308",
      })
      return
    }

    try {
      const isFavorite = favorites.includes(item._id)

      if (isFavorite) {
        // Remove from favorites
        await axios.post(
          "http://localhost:3000/api/favorites/remove",
          {
            userId,
            dishId: item._id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        setFavorites(favorites.filter((id) => id !== item._id))

        Swal.fire({
          icon: "success",
          title: "Removed from Favorites",
          text: `${item.name} has been removed from your favorites!`,
          confirmButtonText: "Ok",
          confirmButtonColor: "#EAB308",
          timer: 2000,
          timerProgressBar: true,
        })
      } else {
        // Add to favorites
        await axios.post(
          "http://localhost:3000/api/favorites/add",
          {
            userId,
            dishId: item._id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        setFavorites([...favorites, item._id])

        Swal.fire({
          icon: "success",
          title: "Added to Favorites",
          text: `${item.name} has been added to your favorites!`,
          confirmButtonText: "Ok",
          confirmButtonColor: "#EAB308",
          timer: 2000,
          timerProgressBar: true,
        })
      }
    } catch (error) {
      console.error("Error managing favorites:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update favorites",
        confirmButtonText: "Ok",
        confirmButtonColor: "#EAB308",
      })
    }
  }

  const handleItemClick = (item) => {
    navigate(`/dish/${item._id}`, { state: { item } })
  }

  // Listen for notifications
  useEffect(() => {
    const notificationListener = () => {
      const newNotification = JSON.parse(localStorage.getItem("notification"))
      if (newNotification) {
        setNotifications((prev) => [...prev, newNotification])
        localStorage.removeItem("notification")
      }
    }

    window.addEventListener("storage", notificationListener)
    return () => {
      window.removeEventListener("storage", notificationListener)
    }
  }, [])

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
            {categories.map((category, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium ${
                  activeCategory === category
                    ? "bg-yellow-500 text-white"
                    : "bg-white/10 text-yellow-400 hover:bg-yellow-400/20"
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
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
                <p className="text-gray-300">Loading menu items...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenuItems.length === 0 ? (
                  <p className="text-center text-gray-300 col-span-full">No items found.</p>
                ) : (
                  filteredMenuItems.map((item, j) => (
                    <div
                      key={j}
                      className="bg-black/10 rounded-xl cursor-pointer backdrop-blur-sm overflow-hidden border border-white/10 hover:border-yellow-300/50 transition-all duration-300 group flex flex-col h-[400px]"
                      onClick={() => handleItemClick(item)}
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
                            onClick={(e) => addToCart(item, e)}
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-5 py-2 rounded-full text-sm font-medium hover:from-yellow-400 hover:to-yellow-500 flex items-center transition-all shadow-lg shadow-yellow-500/20"
                          >
                            <FaPlus className="mr-2" size={14} />
                            Add to Cart
                          </button>

                          <button
                            onClick={(e) => toggleFavorite(item, e)}
                            className={`bg-black/30 backdrop-blur-sm border border-white/10 p-2.5 rounded-full hover:bg-yellow-500/10 hover:border-yellow-500/50 transition-all ${
                              favorites.includes(item._id) ? "text-yellow-700" : "text-white"
                            }`}
                            aria-label={favorites.includes(item._id) ? "Remove from favorites" : "Add to favorites"}
                          >
                            <FaHeart size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Menu
