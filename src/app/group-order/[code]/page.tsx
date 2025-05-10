"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Users,
  Clock,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  UserPlus,
  Share2,
  ArrowLeft,
  DollarSign,
  SplitSquareVertical,
  UserCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogOut,
  Trash,
} from "lucide-react"
import axios from "axios"
import Swal from "sweetalert2"
import { loadStripe } from "@stripe/stripe-js"
import BlurContainer from "../../../components/blurContainer"
import ShareGroupOrderModal from "../../../components/group-order/share-modal"

const stripePromise = loadStripe(
  "pk_test_51RBkqsCMQL0uvhhSJtakmUvGDI24HNEfXmxVe9He1Cx9ACn7giTWVri20IwYyDYzEzo71OY6zlLjmg9Ob8ah7b2f00LmqRXMPe",
)

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

interface GroupOrderParticipant {
  userId: string
  userName: string
  joinedAt: string
  paymentStatus: "pending" | "paid" | "failed"
}

interface GroupOrder {
  _id: string
  code: string
  name: string
  creatorId: string
  creatorName: string
  status: "active" | "closed" | "completed"
  expiresAt: string
  participants: GroupOrderParticipant[]
  items: GroupOrderItem[]
  paymentMethod: "single" | "split" | "individual"
  notes?: string
  createdAt: string
  updatedAt: string
  paymentStatus: "pending" | "partial" | "paid" | "failed"
}

const GroupOrderPage = () => {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [groupOrder, setGroupOrder] = useState<GroupOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [updatingQuantity, setUpdatingQuantity] = useState<string | null>(null)
  const [leavingGroup, setLeavingGroup] = useState(false)
  const [deletingGroup, setDeletingGroup] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joiningGroup, setJoiningGroup] = useState(false)

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null
  const userName = typeof window !== "undefined" ? localStorage.getItem("userName") || "User" : "User"

  useEffect(() => {
    const fetchGroupOrder = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:3000/api/group-orders/get?code=${code}`)
        setGroupOrder(response.data.groupOrder)
      } catch (error: any) {
        console.error("Error fetching group order:", error)
        setError(error.response?.data?.message || "Failed to load group order")
      } finally {
        setLoading(false)
      }
    }

    if (code) {
      fetchGroupOrder()
    }

    // Auto-refresh every 30 seconds to get updates
    const interval = setInterval(fetchGroupOrder, 30000)
    return () => clearInterval(interval)
  }, [code])

  useEffect(() => {
    if (!loading && groupOrder && userId) {
      const isParticipant = groupOrder.participants.some((p) => p.userId === userId)
      const isActive = groupOrder.status === "active"

      // If group order is not active, show a message and redirect
      if (!isActive) {
        Swal.fire({
          icon: "info",
          title: `Group Order ${groupOrder.status === "closed" ? "Closed" : "Completed"}`,
          text: `This group order is ${groupOrder.status}. You cannot join or modify it.`,
        }).then(() => {
          navigate("/")
        })
        return
      }

      // If user is not a participant and the group is active, show join modal
      if (!isParticipant && isActive) {
        setShowJoinModal(true)
      } else if (isParticipant) {
        // If user is a participant, store the current group order code
        localStorage.setItem("currentGroupOrder", groupOrder.code)
      }
    }
  }, [groupOrder, loading, userId, navigate])

  const handleJoinGroupOrder = async () => {
    if (!groupOrder || !userId || !userName) return

    try {
      setJoiningGroup(true)

      const response = await axios.post("http://localhost:3000/api/group-orders/join", {
        code,
        userId,
        userName,
      })

      if (response.data.success) {
        setGroupOrder(response.data.groupOrder)
        localStorage.setItem("currentGroupOrder", code!)
        setShowJoinModal(false)

        Swal.fire({
          icon: "success",
          title: "Joined Group Order",
          text: `You have successfully joined ${groupOrder.name}!`,
        })
      }
    } catch (error: any) {
      console.error("Error joining group order:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to join group order. Please try again.",
      }).then(() => {
        navigate("/")
      })
    } finally {
      setJoiningGroup(false)
    }
  }

  const handleDeclineJoin = () => {
    Swal.fire({
      icon: "info",
      title: "Declined",
      text: "You declined to join this group order.",
    }).then(() => {
      navigate("/")
    })
  }

  useEffect(() => {
    if (groupOrder) {
      // Calculate time left
      const updateTimeLeft = () => {
        const now = new Date()
        const expiresAt = new Date(groupOrder.expiresAt)
        const diff = expiresAt.getTime() - now.getTime()

        if (diff <= 0) {
          setTimeLeft("Expired")
          return
        }

        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m remaining`)
        } else {
          setTimeLeft(`${minutes}m remaining`)
        }
      }

      updateTimeLeft()
      const interval = setInterval(updateTimeLeft, 60000) // Update every minute
      return () => clearInterval(interval)
    }
  }, [groupOrder])

  const handleBrowseMenu = () => {
    navigate("/resto/2/menu", { state: { groupOrderCode: code } })
  }

  const handleUpdateQuantity = async (itemId: string, delta: number) => {
    if (!groupOrder) return

    try {
      setUpdatingQuantity(itemId)

      // Find the item
      const item = groupOrder.items.find((item) => item._id === itemId)
      if (!item) return

      // Only allow users to update their own items or the creator to update any item
      if (item.userId !== userId && groupOrder.creatorId !== userId) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "You can only update your own items",
        })
        return
      }

      // Calculate new quantity
      const newQuantity = Math.max(1, item.quantity + delta)

      // Call API to update quantity
      await axios.post(`http://localhost:3000/api/group-orders/update-item-quantity`, {
        code,
        userId,
        itemId,
        quantity: newQuantity,
      })

      // Update local state
      setGroupOrder((prev) => {
        if (!prev) return null
        return {
          ...prev,
          items: prev.items.map((i) => (i._id === itemId ? { ...i, quantity: newQuantity } : i)),
        }
      })
    } catch (error) {
      console.error("Error updating quantity:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update quantity. Please try again.",
      })
    } finally {
      setUpdatingQuantity(null)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      // Check if user is allowed to remove this item
      const item = groupOrder?.items.find((item) => item._id === itemId)

      if (!item) return

      // Only allow users to remove their own items or the creator to remove any item
      if (item.userId !== userId && groupOrder?.creatorId !== userId) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "You can only remove your own items",
        })
        return
      }

      const result = await Swal.fire({
        title: "Remove Item?",
        text: "Are you sure you want to remove this item from the group order?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, remove it",
      })

      if (result.isConfirmed) {
        // Call API to remove item
        await axios.post(`http://localhost:3000/api/group-orders/remove-item`, {
          code,
          userId,
          itemId,
        })

        // Update local state
        setGroupOrder((prev) => {
          if (!prev) return null
          return {
            ...prev,
            items: prev.items.filter((item) => item._id !== itemId),
          }
        })

        Swal.fire("Removed!", "The item has been removed from the group order.", "success")
      }
    } catch (error) {
      console.error("Error removing item:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to remove item. Please try again.",
      })
    }
  }

  const handleUpdatePaymentMethod = async (method: "single" | "split" | "individual") => {
    if (groupOrder?.creatorId !== userId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Only the group order creator can change the payment method",
      })
      return
    }

    try {
      await axios.put(`http://localhost:3000/api/group-orders/update-payment`, {
        code,
        userId,
        paymentMethod: method,
      })

      // Update local state
      setGroupOrder((prev) => {
        if (!prev) return null
        return {
          ...prev,
          paymentMethod: method,
        }
      })

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Payment method has been updated",
      })
    } catch (error) {
      console.error("Error updating payment method:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update payment method. Please try again.",
      })
    }
  }

  const handleCheckout = async () => {
    if (!groupOrder) return

    try {
      setCheckoutLoading(true)

      // Determine if user can checkout based on payment method
      if (groupOrder.paymentMethod === "single" && groupOrder.creatorId !== userId) {
        Swal.fire({
          icon: "info",
          title: "Single Payment",
          text: "Only the group order creator can checkout with single payment method",
        })
        setCheckoutLoading(false)
        return
      }

      // For individual payment, check if user has items
      if (groupOrder.paymentMethod === "individual") {
        const userItems = groupOrder.items.filter((item) => item.userId === userId)
        if (userItems.length === 0) {
          Swal.fire({
            icon: "info",
            title: "No Items",
            text: "You don't have any items in this group order",
          })
          setCheckoutLoading(false)
          return
        }
      }

      // Prepare the items for checkout based on payment method
      let selectedItems = []
      let total = 0

      if (groupOrder.paymentMethod === "individual") {
        // Only checkout items added by this user
        selectedItems = groupOrder.items
          .filter((item) => item.userId === userId)
          .map((item) => ({
            price_id: item.itemId,
            description: item.description || "",
            image: item.image,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            subtotal: (item.price * item.quantity).toFixed(2),
          }))

        total = selectedItems.reduce((sum, item) => sum + Number.parseFloat(item.subtotal), 0)
      } else if (groupOrder.paymentMethod === "split") {
        // All items, but divide cost by number of participants
        selectedItems = groupOrder.items.map((item) => ({
          price_id: item.itemId,
          description: item.description || "",
          image: item.image,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: (item.price * item.quantity).toFixed(2),
        }))

        const fullTotal = selectedItems.reduce((sum, item) => sum + Number.parseFloat(item.subtotal), 0)
        total = fullTotal / groupOrder.participants.length
      } else {
        // Single payment - all items
        selectedItems = groupOrder.items.map((item) => ({
          price_id: item.itemId,
          description: item.description || "",
          image: item.image,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: (item.price * item.quantity).toFixed(2),
        }))

        total = selectedItems.reduce((sum, item) => sum + Number.parseFloat(item.subtotal), 0)
      }

      // Store invoice data in localStorage for the success page
      localStorage.setItem(
        "invoiceData",
        JSON.stringify({
          selectedMeals: selectedItems,
          total: total.toFixed(2),
          noteCommande: groupOrder.notes || "",
          groupOrderCode: code,
          groupOrderName: groupOrder.name,
          paymentType: groupOrder.paymentMethod,
        }),
      )

      // Prepare line items for Stripe
      const line_items = selectedItems.map((item) => ({
        price: item.price_id,
        quantity: item.quantity,
      }))

      // Call the checkout API
      const response = await fetch("http://localhost:3000/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          line_items,
          groupOrderCode: code,
          paymentType: groupOrder.paymentMethod,
        }),
      })

      const data = await response.json()

      if (!data.id) throw new Error("sessionId not returned from server")

      // Redirect to Stripe checkout
      const stripe = await stripePromise
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: data.id })
      }
    } catch (error: any) {
      console.error("Error during checkout:", error)
      Swal.fire({
        icon: "error",
        title: "Checkout Failed",
        text: error.response?.data?.message || "An error occurred during checkout. Please try again.",
      })
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handleLeaveGroupOrder = async () => {
    if (!groupOrder) return

    // Check if user is the creator
    if (groupOrder.creatorId === userId) {
      Swal.fire({
        icon: "error",
        title: "Cannot Leave",
        text: "As the organizer, you cannot leave your own group order. You can delete it instead.",
      })
      return
    }

    // Confirm before leaving
    const result = await Swal.fire({
      title: "Leave Group Order?",
      text: "Are you sure you want to leave this group order? All your items will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, leave",
    })

    if (!result.isConfirmed) return

    try {
      setLeavingGroup(true)

      // Call API to leave group order
      await axios.post(`http://localhost:3000/api/group-orders/leave`, {
        code,
        userId,
      })

      // Clear the current group order from localStorage
      localStorage.removeItem("currentGroupOrder")

      // Show success message and redirect to home
      Swal.fire({
        icon: "success",
        title: "Left Group Order",
        text: "You have successfully left the group order.",
      }).then(() => {
        navigate("/")
      })
    } catch (error: any) {
      console.error("Error leaving group order:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to leave group order. Please try again.",
      })
    } finally {
      setLeavingGroup(false)
    }
  }

  const handleDeleteGroupOrder = async () => {
    if (!groupOrder) return

    // Check if user is the creator
    if (groupOrder.creatorId !== userId) {
      Swal.fire({
        icon: "error",
        title: "Not Authorized",
        text: "Only the group order organizer can delete the group order.",
      })
      return
    }

    // Confirm before deleting
    const result = await Swal.fire({
      title: "Delete Group Order?",
      text: "Are you sure you want to delete this group order? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
    })

    if (!result.isConfirmed) return

    try {
      setDeletingGroup(true)

      // Call API to delete group order
      await axios.delete(`http://localhost:3000/api/group-orders/delete`, {
        data: { code, userId },
      })

      // Clear the current group order from localStorage
      localStorage.removeItem("currentGroupOrder")

      // Show success message and redirect to home
      Swal.fire({
        icon: "success",
        title: "Group Order Deleted",
        text: "The group order has been successfully deleted.",
      }).then(() => {
        navigate("/")
      })
    } catch (error: any) {
      console.error("Error deleting group order:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to delete group order. Please try again.",
      })
    } finally {
      setDeletingGroup(false)
    }
  }

  const calculateTotal = () => {
    if (!groupOrder) return 0

    let total = 0

    if (groupOrder.paymentMethod === "individual") {
      // Only calculate total for user's items
      const userItems = groupOrder.items.filter((item) => item.userId === userId)
      total = userItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    } else if (groupOrder.paymentMethod === "split") {
      // Calculate total and divide by number of participants
      const fullTotal = groupOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      total = fullTotal / groupOrder.participants.length
    } else {
      // Single payment - full total
      total = groupOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }

    return total.toFixed(2)
  }

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "partial":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Paid"
      case "pending":
        return "Pending"
      case "failed":
        return "Failed"
      case "partial":
        return "Partially Paid"
      default:
        return "Pending"
    }
  }

  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/20 text-green-500"
      case "pending":
        return "bg-yellow-500/20 text-yellow-500"
      case "failed":
        return "bg-red-500/20 text-red-500"
      case "partial":
        return "bg-blue-500/20 text-blue-500"
      default:
        return "bg-yellow-500/20 text-yellow-500"
    }
  }

  const isUserParticipant = groupOrder?.participants.some((p) => p.userId === userId) || false
  const isCreator = groupOrder?.creatorId === userId || false

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center -z-10">
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  if (error || !groupOrder) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center -z-10">
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <BlurContainer blur="xl" opacity={50} padding={8} rounded="2xl" className="w-full max-w-md mx-auto p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Group Order Not Found</h2>
            <p className="text-white/80 mb-6">{error || "This group order doesn't exist or has expired."}</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </BlurContainer>
      </div>
    )
  }

  // Group items by user
  const itemsByUser: Record<string, GroupOrderItem[]> = {}
  groupOrder.items.forEach((item) => {
    if (!itemsByUser[item.userId]) {
      itemsByUser[item.userId] = []
    }
    itemsByUser[item.userId].push(item)
  })

  // Get current user's payment status
  const currentUserParticipant = groupOrder.participants.find((p) => p.userId === userId)
  const currentUserPaymentStatus = currentUserParticipant?.paymentStatus || "pending"

  // Join Group Order Modal
  if (showJoinModal) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center -z-10">
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <BlurContainer blur="xl" opacity={50} padding={8} rounded="2xl" className="w-full max-w-md mx-auto p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Join Group Order</h2>
            <p className="text-white/80 mb-6">
              You've been invited to join <span className="text-yellow-500 font-semibold">{groupOrder.name}</span>
            </p>

            <div className="flex flex-col space-y-3 mb-6">
              <div className="bg-white/10 p-3 rounded-lg">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-white/80">
                    Organized by: <span className="text-white">{groupOrder.creatorName}</span>
                  </span>
                </div>
              </div>

              <div className="bg-white/10 p-3 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-white/80">
                    Time left: <span className="text-white">{timeLeft}</span>
                  </span>
                </div>
              </div>

              <div className="bg-white/10 p-3 rounded-lg">
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-white/80">
                    Items: <span className="text-white">{groupOrder.items.length}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleDeclineJoin}
                className="flex-1 px-6 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleJoinGroupOrder}
                disabled={joiningGroup}
                className={`flex-1 px-6 py-2 ${
                  joiningGroup ? "bg-yellow-500/50 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400"
                } text-black rounded-full transition-colors flex items-center justify-center`}
              >
                {joiningGroup ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-black/20 border-t-black rounded-full mr-2"></div>
                    Joining...
                  </>
                ) : (
                  "Join Group"
                )}
              </button>
            </div>
          </div>
        </BlurContainer>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center -z-10">
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="mt-25 mb-20 relative flex-grow flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-16">
        <div className="w-full max-w-7xl">
          <BlurContainer blur="xl" opacity={50} padding={8} rounded="2xl" className="w-full mx-auto p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate("/")}
                    className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 text-white" />
                  </button>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{groupOrder.name}</h1>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                  <div className="flex items-center text-white/70">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{groupOrder.participants.length} participants</span>
                  </div>
                  <div className="flex items-center text-white/70">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className={groupOrder.status === "active" ? "text-green-400" : "text-red-400"}>
                      {groupOrder.status === "active" ? timeLeft : "Expired"}
                    </span>
                  </div>
                  <div className="flex items-center bg-yellow-500/20 px-3 py-1 rounded-full">
                    <span className="text-yellow-500 font-medium">Code: {groupOrder.code}</span>
                  </div>
                  {/* Payment Status Badge */}
                  <div
                    className={`flex items-center px-3 py-1 rounded-full ${getPaymentStatusClass(groupOrder.paymentStatus)}`}
                  >
                    {getPaymentStatusIcon(groupOrder.paymentStatus)}
                    <span className="ml-1 font-medium">{getPaymentStatusText(groupOrder.paymentStatus)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {/* Leave Group Order Button (for non-creators) */}
                {!isCreator && isUserParticipant && (
                  <button
                    onClick={handleLeaveGroupOrder}
                    disabled={leavingGroup}
                    className={`flex items-center gap-2 px-4 py-2 ${
                      leavingGroup
                        ? "bg-transparent border border-red-500/50 text-red-500/50 cursor-not-allowed"
                        : "bg-transparent border border-red-500 text-red-500 hover:bg-red-500/10"
                    } rounded-full transition-colors`}
                  >
                    {leavingGroup ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-red-500/20 border-t-red-500 rounded-full"></div>
                        <span>Leaving...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Leave Group</span>
                      </>
                    )}
                  </button>
                )}

                {/* Delete Group Order Button (for creators only) */}
                {isCreator && (
                  <button
                    onClick={handleDeleteGroupOrder}
                    disabled={deletingGroup}
                    className={`flex items-center gap-2 px-4 py-2 ${
                      deletingGroup
                        ? "bg-transparent border border-red-500/50 text-red-500/50 cursor-not-allowed"
                        : "bg-transparent border border-red-500 text-red-500 hover:bg-red-500/10"
                    } rounded-full transition-colors`}
                  >
                    {deletingGroup ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-red-500/20 border-t-red-500 rounded-full"></div>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete Group</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                <button
                  onClick={handleBrowseMenu}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-full transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Items</span>
                </button>
              </div>
            </div>

            {/* Status Banner */}
            {groupOrder.status !== "active" && (
              <div className="bg-red-500/20 border border-red-500/30 text-white rounded-lg p-4 mb-6">
                <p className="text-center">
                  This group order has {groupOrder.status === "closed" ? "expired" : "been completed"}. No new items can
                  be added.
                </p>
              </div>
            )}

            {/* Payment Method Selection (only for creator) */}
            {isCreator && groupOrder.status === "active" && (
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-3">Payment Method</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdatePaymentMethod("single")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                      groupOrder.paymentMethod === "single"
                        ? "bg-yellow-500 text-black"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Single Payment</span>
                  </button>
                  <button
                    onClick={() => handleUpdatePaymentMethod("split")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                      groupOrder.paymentMethod === "split"
                        ? "bg-yellow-500 text-black"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <SplitSquareVertical className="h-4 w-4" />
                    <span>Split Equally</span>
                  </button>
                  <button
                    onClick={() => handleUpdatePaymentMethod("individual")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                      groupOrder.paymentMethod === "individual"
                        ? "bg-yellow-500 text-black"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <UserCircle className="h-4 w-4" />
                    <span>Pay for Your Items</span>
                  </button>
                </div>
                <p className="text-white/60 text-sm mt-2">
                  {groupOrder.paymentMethod === "single"
                    ? "You will pay for the entire order"
                    : groupOrder.paymentMethod === "split"
                      ? "The total will be split equally among all participants"
                      : "Each person pays for their own items"}
                </p>
              </div>
            )}

            {/* Payment Method Info (for non-creators) */}
            {!isCreator && (
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-2">Payment Method</h3>
                <div className="flex items-center gap-2">
                  {groupOrder.paymentMethod === "single" ? (
                    <>
                      <CreditCard className="h-5 w-5 text-yellow-500" />
                      <span className="text-white">Single Payment (The organizer will pay for the entire order)</span>
                    </>
                  ) : groupOrder.paymentMethod === "split" ? (
                    <>
                      <SplitSquareVertical className="h-5 w-5 text-yellow-500" />
                      <span className="text-white">
                        Split Equally (The total will be divided among all participants)
                      </span>
                    </>
                  ) : (
                    <>
                      <UserCircle className="h-5 w-5 text-yellow-500" />
                      <span className="text-white">Individual Payment (You pay for your own items)</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Items Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Order Items</h2>

              {Object.keys(itemsByUser).length === 0 ? (
                <div className="bg-white/5 rounded-lg p-8 text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-white/30 mb-3" />
                  <p className="text-white/70">No items in this group order yet</p>
                  <button
                    onClick={handleBrowseMenu}
                    className="mt-4 px-6 py-2 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-colors"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(itemsByUser).map(([userIdKey, items]) => {
                    const participant = groupOrder.participants.find((p) => p.userId === userIdKey)
                    const isCurrentUser = userIdKey === userId

                    return (
                      <div key={userIdKey} className="bg-white/5 rounded-lg overflow-hidden">
                        <div className="bg-white/10 px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <UserCircle className="h-5 w-5 text-yellow-500 mr-2" />
                            <span className="text-white font-medium">
                              {participant?.userName || "Unknown User"}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                              {participant?.userId === groupOrder.creatorId && (
                                <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full">
                                  Organizer
                                </span>
                              )}
                            </span>
                            {/* Payment Status Badge */}
                            {participant && (
                              <span
                                className={`ml-3 text-xs px-2 py-0.5 px-2 rounded-full ${getPaymentStatusClass(participant.paymentStatus)}`}
                              >
                                {getPaymentStatusText(participant.paymentStatus)}
                              </span>
                            )}
                          </div>
                          <span className="text-white/70 text-sm">
                            {items.length} {items.length === 1 ? "item" : "items"}
                          </span>
                        </div>

                        <div className="divide-y divide-white/10">
                          {items.map((item) => (
                            <div key={item._id} className="p-4 flex items-center">
                              <div className="h-16 w-16 flex-shrink-0">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  className="h-full w-full object-cover rounded-md"
                                />
                              </div>
                              <div className="ml-4 flex-1">
                                <h4 className="text-white font-medium">{item.name}</h4>
                                <p className="text-white/70 text-sm">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-yellow-500 font-semibold">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                <p className="text-white/70 text-sm">${item.price.toFixed(2)} each</p>
                              </div>

                              {/* Quantity controls - only for user's own items or creator */}
                              {(item.userId === userId || isCreator) && groupOrder.status === "active" && (
                                <div className="flex items-center ml-4">
                                  <button
                                    onClick={() => handleUpdateQuantity(item._id, -1)}
                                    disabled={updatingQuantity === item._id || item.quantity <= 1}
                                    className={`p-1 ${
                                      updatingQuantity === item._id || item.quantity <= 1
                                        ? "text-white/30 cursor-not-allowed"
                                        : "text-white hover:bg-white/10"
                                    } rounded-full transition-colors`}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="mx-2 text-white">{item.quantity}</span>
                                  <button
                                    onClick={() => handleUpdateQuantity(item._id, 1)}
                                    disabled={updatingQuantity === item._id}
                                    className={`p-1 ${
                                      updatingQuantity === item._id
                                        ? "text-white/30 cursor-not-allowed"
                                        : "text-white hover:bg-white/10"
                                    } rounded-full transition-colors`}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>

                                  <button
                                    onClick={() => handleRemoveItem(item._id)}
                                    className="ml-2 p-1 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-full transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Participants Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Participants</h2>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {groupOrder.participants.map((participant) => (
                    <div key={participant.userId} className="flex items-center p-3 bg-white/5 rounded-md">
                      <UserCircle className="h-6 w-6 text-yellow-500 mr-2" />
                      <div>
                        <p className="text-white font-medium">
                          {participant.userName}
                          {participant.userId === groupOrder.creatorId && (
                            <span className="ml-1 text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full">
                              Organizer
                            </span>
                          )}
                          {participant.userId === userId && (
                            <span className="ml-1 text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </p>
                        <div className="flex items-center mt-1">
                          {getPaymentStatusIcon(participant.paymentStatus)}
                          <span className={`ml-1 text-xs ${getPaymentStatusClass(participant.paymentStatus)}`}>
                            {getPaymentStatusText(participant.paymentStatus)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {groupOrder.status === "active" && (
                    <button
                      onClick={() => setIsShareModalOpen(true)}
                      className="flex items-center justify-center p-3 bg-white/5 rounded-md border border-dashed border-white/20 hover:bg-white/10 transition-colors"
                    >
                      <UserPlus className="h-5 w-5 text-white/70 mr-2" />
                      <span className="text-white/70">Invite More</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Checkout Section */}
            {groupOrder.status === "active" && groupOrder.items.length > 0 && (
              <div className="mt-8 bg-white/5 rounded-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-white">Total</h3>
                    <div className="flex items-center mt-1">
                      <DollarSign className="h-5 w-5 text-yellow-500" />
                      <span className="text-2xl font-bold text-yellow-500">{calculateTotal()}</span>
                      {groupOrder.paymentMethod !== "single" && (
                        <span className="text-white/70 ml-2">
                          {groupOrder.paymentMethod === "split" ? "(your share)" : "(your items)"}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={
                      checkoutLoading ||
                      (groupOrder.paymentMethod === "single" && !isCreator) ||
                      currentUserPaymentStatus === "paid"
                    }
                    className={`mt-4 md:mt-0 w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-md ${
                      checkoutLoading ||
                      (groupOrder.paymentMethod === "single" && !isCreator) ||
                      currentUserPaymentStatus === "paid"
                        ? "bg-yellow-500/50 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-400"
                    } text-black font-medium transition-colors`}
                  >
                    {checkoutLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-black/20 border-t-black rounded-full"></div>
                        <span>Processing...</span>
                      </>
                    ) : currentUserPaymentStatus === "paid" ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span>Already Paid</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        <span>
                          {groupOrder.paymentMethod === "single"
                            ? isCreator
                              ? "Pay for Group"
                              : "Organizer Will Pay"
                            : groupOrder.paymentMethod === "split"
                              ? "Pay Your Share"
                              : "Pay for Your Items"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
                {groupOrder.paymentMethod === "single" && !isCreator && (
                  <p className="text-white/70 text-sm mt-2 text-center md:text-right">
                    The group organizer will pay for this order
                  </p>
                )}
                {currentUserPaymentStatus === "paid" && (
                  <p className="text-green-500 text-sm mt-2 text-center md:text-right">
                    You have already paid for this order
                  </p>
                )}
              </div>
            )}
          </BlurContainer>
        </div>
      </div>

      {/* Share Modal */}
      <ShareGroupOrderModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        code={groupOrder.code}
        groupName={groupOrder.name}
      />
    </div>
  )
}

export default GroupOrderPage
