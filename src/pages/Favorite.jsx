""

import { useState, useEffect } from "react"
import { FaPlus, FaTrash } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"

const Favorites = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const userId = localStorage.getItem("userId")
  const token = localStorage.getItem("token")

  // Fetch favorites when component mounts
  useEffect(() => {
    if (userId && token) {
      fetchFavorites()
    } else {
      setLoading(false)
    }
  }, [userId, token])

  const fetchFavorites = async () => {
    try {
      setLoading(true)

      const response = await axios.get(`http://localhost:3000/api/favorites/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setFavorites(response.data.favorites || [])
      } else {
        console.error("Failed to fetch favorites:", response.data.message)
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load favorites",
        confirmButtonText: "Ok",
        confirmButtonColor: "#EAB308",
      })
    } finally {
      setLoading(false)
    }
  }

  const removeFromFavorites = async (item, e) => {
    e.stopPropagation()

    try {
      const response = await axios.post(
        "http://localhost:3000/api/favorites/remove",
        {
          userId,
          dishId: item._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.data.success) {
        // Update local state
        setFavorites(favorites.filter((fav) => fav._id !== item._id))

        // Show success message
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
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error("Failed to remove from favorites:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to remove from favorites",
        confirmButtonText: "Ok",
        confirmButtonColor: "#EAB308",
      })
    }
  }

  const addToCart = async (item, e) => {
    e.stopPropagation()

    try {
      // Check if user is logged in
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

      // Create order object
      const newOrder = {
        orderedAt: Date.now(),
        id_user: userId,
        name: item.name,
        price: item.price,
        price_id: item.price_id,
        description: item.description,
        image: item.image,
      }

      // Add to cart
      await axios.post("http://localhost:3000/api/orders/add", newOrder)

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Added to Cart!",
        text: `${item.name} was added to your cart.`,
        confirmButtonText: "Ok",
        confirmButtonColor: "#EAB308",
        timer: 2000,
        timerProgressBar: true,
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

  const handleItemClick = (item) => {
    navigate(`/dish/${item._id}`, { state: { item } })
  }

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
          <h2 className="text-3xl text-center text-yellow-400 mb-8 font-bold">Your Favorites</h2>

          {/* Favorites Items */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
                <p className="text-gray-300">Loading your favorites...</p>
              </div>
            ) : !userId || !token ? (
              <div className="text-center py-10">
                <p className="text-gray-300 mb-4">Please log in to view your favorites.</p>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-yellow-500 text-black px-6 py-2 rounded-full hover:bg-yellow-400 transition-colors font-medium"
                >
                  Log In
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.length === 0 ? (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-300 mb-4">No favorites added yet.</p>
                    <button
                      onClick={() => navigate("/menu")}
                      className="bg-yellow-500 text-black px-6 py-2 rounded-full hover:bg-yellow-400 transition-colors font-medium"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  favorites.map((item) => (
                    <div
                      key={item._id}
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
                            onClick={(e) => removeFromFavorites(item, e)}
                            className="bg-black/30 backdrop-blur-sm border border-white/10 p-2.5 rounded-full hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all text-white"
                            aria-label="Remove from favorites"
                          >
                            <FaTrash size={16} />
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

export default Favorites
