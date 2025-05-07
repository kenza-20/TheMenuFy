import type React from "react"

import { useState, useEffect } from "react"
import axios from "axios"
import { ShoppingCart, Plus, TrendingUp } from "lucide-react"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"

interface SuggestionProps {
  cartItems: any[]
  userId: string
  onAddToCart: (item: any) => void
}

const CartSuggestions = ({ cartItems, userId, onAddToCart }: SuggestionProps) => {
  const [recommendations, setRecommendations] = useState([])
  const [topSellers, setTopSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true)

      try {
        // Always fetch top sellers
        const topSellersResponse = await axios.get("http://localhost:3000/api/recipes/top-selling")
        console.log(topSellersResponse.data, "TOP SELLERS")
        setTopSellers(topSellersResponse.data)

        // Only fetch recommendations if there are items in cart
        if (cartItems.length > 0) {
          try {
            const recommendationsResponse = await axios.post("http://localhost:3000/api/recipes/recommendations", {
              cartItems,
            })
            console.log(recommendationsResponse.data, "RECOMMENDATIONS")
            setRecommendations(recommendationsResponse.data)
          } catch (recError) {
            console.error("Failed to fetch recommendations:", recError)
            setRecommendations([])
          }
        }
      } catch (error) {
        console.error("Failed to fetch top sellers:", error)
        setTopSellers([])
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [cartItems])

  const handleItemClick = (item: any) => {
    console.log(item._id, "CLICKED")
    navigate(`/dish/${item._id}`, { state: { item } })
  }

  const handleAddSuggestion = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation()
    try {
      onAddToCart(item)

      Swal.fire({
        icon: "success",
        title: "Added to Cart!",
        text: `${item.name} has been added to your cart.`,
        confirmButtonColor: "#eab308",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      })
    } catch (error) {
      console.error("Failed to add suggestion to cart:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add item to cart. Please try again.",
        confirmButtonColor: "#eab308",
      })
    }
  }

  // Filter out items that are already in the cart from both recommendation lists
  const cartItemIds = new Set(cartItems.map((item:any) => item.id))

   const filteredTopSellers = topSellers.filter(
     (item: any) => item && item.price_id && !cartItemIds.has(item.price_id)
   )
  
   const filteredRecommendations = recommendations.filter(
     (item: any) => item && item.price_id && !cartItemIds.has(item.price_id)
   )
  
 //const filteredTopSellers = topSellers.filter((item:any) => !cartItemIds.has(item.price_id))
 //const filteredRecommendations = recommendations.filter((item:any) => !cartItemIds.has(item.price_id))

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  if (filteredTopSellers.length === 0 && filteredRecommendations.length === 0) {
    return null
  }

  const renderSuggestionItem = (item: any) => (
    <div
      onClick={() => handleItemClick(item)}
      key={item.price_id || item._id}
      className="cursor-pointer bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-yellow-500/30 transition-all duration-300 flex flex-col"
    >
      <div className="relative h-32 overflow-hidden">
        <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <h4 className="font-medium text-white text-sm mb-1">{item.name}</h4>
        <p className="text-white/70 text-xs line-clamp-2 mb-2 flex-grow">{item.description}</p>

        <div className="flex justify-between items-center mt-auto">
          <span className="text-yellow-500 font-semibold">${item.price?.toFixed(2)}</span>
          <button
            onClick={(e) => handleAddSuggestion(e, item)}
            className="bg-yellow-500 hover:bg-yellow-400 text-black rounded-full p-1.5 transition-colors"
            aria-label={`Add ${item.name} to cart`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      {/* Personalized Recommendations Section */}
      {filteredRecommendations.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingCart className="text-yellow-500 h-5 w-5" />
            <h3 className="text-xl font-semibold text-white">Complete Your Meal</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {filteredRecommendations.map(renderSuggestionItem)}
          </div>
        </div>
      )}

      {/* Top Sellers Section */}
      {filteredTopSellers.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-yellow-500 h-5 w-5" />
            <h3 className="text-xl font-semibold text-white">Most Popular Dishes</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {filteredTopSellers.map(renderSuggestionItem)}
          </div>
        </div>
      )}
    </div>
  )
}

export default CartSuggestions
