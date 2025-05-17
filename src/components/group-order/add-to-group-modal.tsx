

import { useState, useEffect } from "react"
import { X, Users, ShoppingBag, Plus, ShoppingCart } from "lucide-react"
import axios from "axios"
import Swal from "sweetalert2"

interface GroupOrderItem {
  _id: string
  userId: string
  userName: string
  itemId: string
  name: string
  price: number
  quantity: number
  image: string
  description?: string
  addedAt: string
}

interface GroupOrder {
  _id: string
  code: string
  name: string
  status: string
  expiresAt: string
  items: GroupOrderItem[]
}

interface AddToGroupModalProps {
  isOpen: boolean
  onClose: () => void
  item: any
  onSuccess: () => void
}

const AddToGroupModal = ({ isOpen, onClose, item, onSuccess }: AddToGroupModalProps) => {
  const [activeGroupOrders, setActiveGroupOrders] = useState<GroupOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [addingToGroup, setAddingToGroup] = useState<string | null>(null)
  const [addingToPersonal, setAddingToPersonal] = useState(false)

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null
  const userName = typeof window !== "undefined" ? localStorage.getItem("userName") || "User" : "User"

  useEffect(() => {
    const fetchActiveGroupOrders = async () => {
      if (!isOpen || !userId) return

      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:3000/api/group-orders/user/${userId}`)
        setActiveGroupOrders(response.data.groupOrders.filter((order: GroupOrder) => order.status === "active"))
      } catch (error) {
        console.error("Error fetching active group orders:", error)
        setActiveGroupOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchActiveGroupOrders()
  }, [isOpen, userId])

  // Check if the current user has already added this item to the group order
  const hasUserAddedItem = (groupOrder: GroupOrder) => {
    if (!item || !groupOrder.items || !userId) return false

    return groupOrder.items.some(
      (orderItem) => orderItem.userId === userId && orderItem.itemId === (item.price_id || item.id),
    )
  }

  // Add a check to verify the user is still a participant before showing the group order
  const handleAddToGroup = async (groupOrder: GroupOrder) => {
    try {
      setAddingToGroup(groupOrder.code)

      // First, verify the user is still a participant
      const verifyResponse = await axios.get(`http://localhost:3000/api/group-orders/get?code=${groupOrder.code}`)
      const currentGroupOrder = verifyResponse.data.groupOrder

      // Check if user is still a participant
      const isStillParticipant = currentGroupOrder.participants.some((p:any) => p.userId === userId)

      if (!isStillParticipant) {
        Swal.fire({
          icon: "error",
          title: "Not a Participant",
          text: "You are no longer a participant in this group order.",
        })
        setAddingToGroup(null)
        return
      }

      // Check if the current user has already added this item
      if (hasUserAddedItem(currentGroupOrder)) {
        Swal.fire({
          icon: "warning",
          title: "Already in Your Items",
          text: `You've already added ${item.name} to this group order!`,
        })
        setAddingToGroup(null)
        return
      }

      const response = await axios.post("http://localhost:3000/api/group-orders/add-item", {
        code: groupOrder.code,
        userId,
        userName,
        item,
      })

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Added to Group Order",
          text: `${item.name} has been added to the group order: ${groupOrder.name}`,
          confirmButtonColor: "#eab308",
        })
        onSuccess()
        onClose()
      }
    } catch (error: any) {
      console.error("Error adding item to group order:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to add item to group order. Please try again.",
      })
    } finally {
      setAddingToGroup(null)
    }
  }

  const handleAddToPersonalCart = async () => {
    if (!item) return

    try {
      setAddingToPersonal(true)

      // Check if the item already exists in the cart
      const ordersResponse = await axios.get(`http://localhost:3000/api/orders/${userId}`)
      const isAlreadyInCart = ordersResponse.data.some((order: any) => order.price_id === item.price_id)

      if (isAlreadyInCart) {
        Swal.fire({
          icon: "warning",
          title: "Already in Cart",
          text: `${item.name} is already in your personal cart!`,
          confirmButtonColor: "#eab308",
        })
        setAddingToPersonal(false)
        onClose()
        return
      }

      // Add to personal cart
      const newOrder = {
        orderedAt: Date.now(),
        id_user: userId,
        name: item.name,
        price: item.price,
        price_id: item.price_id,
        description: item.description,
        image: item.image,
        quantity: 1,
      }

      await axios.post("http://localhost:3000/api/orders/add", newOrder)

      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: `${item.name} has been added to your personal cart.`,
        confirmButtonColor: "#eab308",
      })
      onClose()
    } catch (error) {
      console.error("Error adding to personal cart:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add item to your personal cart. Please try again.",
      })
    } finally {
      setAddingToPersonal(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5 text-yellow-500" />
            Add Item to Cart
          </h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-white/5 rounded-lg flex items-center">
          <img src={item?.image || "/placeholder.svg"} alt={item?.name} className="w-16 h-16 object-cover rounded-md" />
          <div className="ml-3">
            <h3 className="text-white font-medium">{item?.name}</h3>
            <p className="text-yellow-500">${item?.price?.toFixed(2)}</p>
          </div>
        </div>

        {/* Personal Cart Option */}
        <button
          onClick={handleAddToPersonalCart}
          disabled={addingToPersonal}
          className={`w-full flex items-center justify-between p-3 mb-4 rounded-lg transition-colors ${
            addingToPersonal ? "bg-yellow-500/50 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400"
          }`}
        >
          <div className="flex items-center">
            <ShoppingCart className="h-5 w-5 text-black mr-2" />
            <div className="text-left">
              <p className="text-black font-medium">Add to Personal Cart</p>
            </div>
          </div>
          {addingToPersonal ? (
            <div className="animate-spin h-5 w-5 border-2 border-black/20 border-t-black rounded-full"></div>
          ) : (
            <Plus className="h-5 w-5 text-black" />
          )}
        </button>

        <div className="mb-3">
          <h3 className="text-white font-medium">Or add to a group order:</h3>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : activeGroupOrders.length === 0 ? (
          <div className="text-center py-6">
            <Users className="mx-auto h-12 w-12 text-white/30 mb-3" />
            <p className="text-white/70 mb-4">You don't have any active group orders</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {activeGroupOrders.map((groupOrder) => (
              <button
                key={groupOrder._id}
                onClick={() => handleAddToGroup(groupOrder)}
                disabled={addingToGroup === groupOrder.code || hasUserAddedItem(groupOrder)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  addingToGroup === groupOrder.code
                    ? "bg-white/20 cursor-not-allowed"
                    : hasUserAddedItem(groupOrder)
                      ? "bg-yellow-500/20 cursor-not-allowed"
                      : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-yellow-500 mr-2" />
                  <div className="text-left">
                    <p className="text-white font-medium">{groupOrder.name}</p>
                    <p className="text-white/60 text-sm">Code: {groupOrder.code}</p>
                  </div>
                </div>
                {addingToGroup === groupOrder.code ? (
                  <div className="animate-spin h-5 w-5 border-2 border-yellow-500/20 border-t-yellow-500 rounded-full"></div>
                ) : hasUserAddedItem(groupOrder) ? (
                  <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full">Already Added</span>
                ) : (
                  <Plus className="h-5 w-5 text-yellow-500" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AddToGroupModal
