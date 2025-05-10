

import { useState, useEffect } from "react"
import { FaPlus, FaHeart, FaUsers } from "react-icons/fa"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"

import AddToGroupModal from "../components/group-order/add-to-group-modal"

const Menu = () => {
  const { t, i18n } = useTranslation()
  const [goal, setGoal] = useState("None")
  const [isShowingMostPurchased, setIsShowingMostPurchased] = useState(false)
  const [activeCategory, setActiveCategory] = useState("starters")

  const [loading, setLoading] = useState(true)

  const [mostPurchasedDish, setMostPurchasedDish] = useState(null)

  const userId = localStorage.getItem("userId")
  const token = localStorage.getItem("token")

  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")
  const [searchLetter, setSearchLetter] = useState("")
  const [favorites, setFavorites] = useState([])
  const [notifications, setNotifications] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [orders, setOrders] = useState([])
  const [activeGroupOrders, setActiveGroupOrders] = useState([])
  const [showGroupOrderModal, setShowGroupOrderModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [hasValidGroupOrder, setHasValidGroupOrder] = useState(false)

  const id_user = typeof window !== "undefined" ? localStorage.getItem("userId") : null
  const navigate = useNavigate()
  const location = useLocation()

  // Check if we came from a group order
  const groupOrderCode = location.state?.groupOrderCode

  const handleMostPurchased = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      alert("No auth token found")
      return
    }

    try {
      const response = await axios.get("http://localhost:3000/api/placedOrders/most-purchased", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const mostPurchasedDish = response.data.mostPurchasedDish
      if (!mostPurchasedDish) return

      setMostPurchasedDish({
        _id: mostPurchasedDish._id,
        name: mostPurchasedDish.name || mostPurchasedDish._id || "Unnamed Dish",
        description: mostPurchasedDish.description || "No description",
        price: mostPurchasedDish.price || 0,
        image: mostPurchasedDish.image || "",
        price_id: mostPurchasedDish.price_id || "fallback-price-id",
        count: mostPurchasedDish.totalQuantity || 0,
      })

      setIsShowingMostPurchased(true)
      setActiveCategory("")
      setSearchLetter("")
    } catch (error) {
      console.error("Error fetching most purchased dishes:", error)
    }
  }

  // Load user settings and goal
  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem("userSettings"))
    setGoal(settings?.goal || "None")
  }, [])

  // Verify if the stored group order code is still valid
  const verifyStoredGroupOrder = async () => {
    const storedCode = localStorage.getItem("currentGroupOrder")
    if (!storedCode || !id_user) return false

    try {
      // Check if the group order exists and if the user is still a participant
      const response = await axios.get(`http://localhost:3000/api/group-orders/get?code=${storedCode}`)

      if (response.data.success && response.data.groupOrder) {
        const groupOrder = response.data.groupOrder

        // Check if the group order is active and the user is a participant
        const isActive = groupOrder.status === "active"
        const isParticipant = groupOrder.participants.some((p) => p.userId === id_user)

        if (!isActive || !isParticipant) {
          // If not active or user is not a participant, remove from localStorage
          localStorage.removeItem("currentGroupOrder")
          return false
        }

        return true
      } else {
        // Group order not found, remove from localStorage
        localStorage.removeItem("currentGroupOrder")
        return false
      }
    } catch (error) {
      console.error("Error verifying stored group order:", error)
      // On error, assume the group order is invalid
      localStorage.removeItem("currentGroupOrder")
      return false
    }
  }

  useEffect(() => {
    // Fetch user's active orders
    axios
      .get(`http://localhost:3000/api/orders/${id_user}`)
      .then((response) => {
        setOrders(response.data.orders || [])
      })
      .catch((error) => {
        console.error("Failed to fetch meals:", error)
      })

    // Fetch user's active group orders and verify stored group order
    const fetchGroupOrders = async () => {
      if (!id_user) return

      try {
        // First verify if the stored group order is still valid
        const isStoredOrderValid = await verifyStoredGroupOrder()

        // Then fetch all active group orders
        const response = await axios.get(`http://localhost:3000/api/group-orders/user/${id_user}`)

        if (response.data.success) {
          const activeOrders = response.data.groupOrders.filter((order) => order.status === "active")
          setActiveGroupOrders(activeOrders)

          // If we came from a specific group order, store that info
          if (groupOrderCode) {
            localStorage.setItem("currentGroupOrder", groupOrderCode)
            setHasValidGroupOrder(true)
          } else {
            // Set hasValidGroupOrder based on either the stored order or any active orders
            setHasValidGroupOrder(isStoredOrderValid || activeOrders.length > 0)
          }
        }
      } catch (error) {
        console.error("Failed to fetch group orders:", error)
        setHasValidGroupOrder(false)
      }
    }

    fetchGroupOrders()
  }, [id_user, groupOrderCode])

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/recipes/all`)
      .then((response) => {
        console.log("Fetched recipes:", response.data)
        setMenuItems(response.data)
      })
      .catch((error) => {
        console.error("Failed to fetch meals:", error)
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
        title: t("Login Required"),
        text: `${item.name} ${t("Please login to add items to your cart")}`,
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

    // Check if user has active group orders
    if (hasValidGroupOrder) {
      // Show modal to choose between personal cart and group order
      setSelectedItem(item)
      setShowGroupOrderModal(true)
      return
    }

    // If no group orders, proceed with adding to personal cart
    addToPersonalCart(item)
  }

  const addToPersonalCart = async (item) => {
    // Check if the item already exists in the orders based on price_id
    const isAlreadyInCart = orders.some((order) => order.price_id === item.price_id)

    if (isAlreadyInCart) {
      // Show SweetAlert if the item is already in the cart
      Swal.fire({
        icon: "warning",
        title: "Already in Cart",
        text: `The item ${item.name} is already in your cart!`,
        confirmButtonText: "Ok",
      })
      return
    }

    // If not already in cart, add the item to orders
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

    try {
      const res = await axios.post("http://localhost:3000/api/orders/add", newOrder)
      console.log(res, "res order")

      // Update the orders state to reflect the new order
      setOrders([...orders, newOrder])

      Swal.fire({
        icon: "success",
        title: "Added to Cart!",
        text: `The item ${item.name} was added to your cart.`,
        confirmButtonText: "Ok",
      })
    } catch (error) {
      console.error("Error adding order:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add item to cart. Please try again.",
      })
    }
  }

  const handleGroupOrderSuccess = () => {
    setShowGroupOrderModal(false)
    Swal.fire({
      icon: "success",
      title: "Added to Group Order!",
      text: `The item was added to your group order.`,
      confirmButtonText: "Ok",
    })
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
    console.log(item._id, "CLICKED")
    navigate(`/dish/${item._id}`, { state: { item } })
  }

  const goToGroupOrder = () => {
    const currentGroupOrder = localStorage.getItem("currentGroupOrder")
    if (currentGroupOrder) {
      navigate(`/group-order/${currentGroupOrder}`)
    } else if (activeGroupOrders.length > 0) {
      // If there's no current group order but user has active ones, go to the most recent
      navigate(`/group-order/${activeGroupOrders[0].code}`)
    }
  }

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
      <div className="flex justify-end mt-4 mr-4">
        <select
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          defaultValue={i18n.language}
          className="bg-white text-black px-3 py-1 rounded-lg shadow"
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
        </select>
      </div>
      <main className="relative flex-grow flex items-center justify-center py-6 px-4 sm:px-6 lg:px-20">
        <div className="w-full max-w-7xl mx-auto">
          {/* Group Order Banner - Only show if hasValidGroupOrder is true */}
          {hasValidGroupOrder && (
            <div className="mb-6 bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center">
                <FaUsers className="text-green-400 mr-2" size={20} />
                <span className="text-white">You're currently in a group order! Items can be added to your group.</span>
              </div>
              <button
                onClick={goToGroupOrder}
                className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-md transition-colors"
              >
                View Group Order
              </button>
            </div>
          )}

          {/* Categories */}
          <div className="flex justify-center mb-8 space-x-4">
            {categories.map((category, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveCategory(category)
                  setIsShowingMostPurchased(false)
                }}
                className={`px-6 py-2 rounded-full text-sm font-medium ${
                  activeCategory === category
                    ? "bg-yellow-500 text-white"
                    : "bg-white/10 text-yellow-400 hover:bg-yellow-400/20"
                }`}
              >
                {/* {category.charAt(0).toUpperCase() + category.slice(1)} */}

                {t(`categories.${category}`)}
              </button>
            ))}
            <button
              onClick={handleMostPurchased}
              className="px-6 py-2 rounded-full text-sm font-medium bg-pink-500 text-white hover:bg-pink-600 transition"
            >
              {t("categories.mostPurchased")}
            </button>
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
            {isShowingMostPurchased && mostPurchasedDish ? (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                <img
                  src={mostPurchasedDish.image || "/placeholder.svg"}
                  alt={mostPurchasedDish.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-yellow-400 mb-1">{mostPurchasedDish.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{mostPurchasedDish.description}</p>
                <span className="text-sm text-gray-400">{t("purchased", { count: mostPurchasedDish.count })}</span>
                <span className="text-lg font-bold text-yellow-500">{mostPurchasedDish.price}€</span>
                <button
                  onClick={(event) => {
                    event.stopPropagation()
                    addToCart(mostPurchasedDish, event) // ✅ on passe bien `event` en second argument
                  }}
                  className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm hover:bg-yellow-600 flex items-center transition-all"
                >
                  <FaPlus className="mr-2" />
                  {t("add")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenuItems.length === 0 ? (
                  <p className="text-center text-gray-300 col-span-full">No items found.</p>
                ) : (
                  filteredMenuItems.map((item, j) => (
                    <div
                      key={j}
                      className=" bg-black/10 rounded-xl cursor-pointer backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-yellow-300/50 transition-all duration-300 group flex flex-col h-[400px]"
                      onClick={() => {
                        handleItemClick(item)
                      }}
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
                            onClick={(e) => {
                              e.stopPropagation()
                              addToCart(item, e)
                            }}
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

      {/* Group Order Modal */}
      <AddToGroupModal
        isOpen={showGroupOrderModal}
        onClose={() => setShowGroupOrderModal(false)}
        item={selectedItem}
        onSuccess={handleGroupOrderSuccess}
      />
    </div>
  )
}

export default Menu
