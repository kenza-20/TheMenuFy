import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  ShoppingBag,
  Calendar,
  DollarSign,
  Search,
  X,
  Download,
  FileText,
  ChevronDown,
  RefreshCw,
  ShoppingCart,
} from "lucide-react"
import axios from "axios"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import BlurContainer from "../components/blurContainer"
import Swal from "sweetalert2"
import { loadStripe } from "@stripe/stripe-js"
import AccountingExport from "../components/accounting-export"

const stripePromise = loadStripe(
  "pk_test_51RBkqsCMQL0uvhhSJtakmUvGDI24HNEfXmxVe9He1Cx9ACn7giTWVri20IwYyDYzEzo71OY6zlLjmg9Ob8ah7b2f00LmqRXMPe",
)

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number
    }
  }
}

interface OrderItem {
  name: string
  quantity: number
  price: number
  subtotal: number
  image: string
  price_id?: string
  description?: string
}

interface Order {
  id: string
  date: string
  time: string
  rawDate: Date
  items: OrderItem[]
  total: number
  noteCommande?: string
}

const OrderHistory = () => {
  const [lastOrder, setLastOrder] = useState<Order | null>(null)
  
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState("")
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false)
  const [downloadingInvoices, setDownloadingInvoices] = useState(false)
  const [reordering, setReordering] = useState<string | null>(null)
  const [orderNote, setOrderNote] = useState<string | null>(null)
  const [checkoutMode, setCheckoutMode] = useState<"direct" | "cart">("cart")

  const navigate = useNavigate()
  const id_user = typeof window !== "undefined" ? localStorage.getItem("userId") : null

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        // Replace with your actual API endpoint for order history
        const response = await axios.get(`http://localhost:3000/api/placedorders/history/${id_user}`)
        console.log(response.data, "AA")
        // Transform the data to match our interface
        const formattedOrders = response.data.map((order: any) => {
          const orderDate = new Date(order.createdAt)
          return {
            id: order._id,
            date: orderDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            time: orderDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            rawDate: orderDate,
            items: order.items.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.price * item.quantity,
              image: item.image,
              price_id: item.price_id,
              description: item.description,
            })),
            total: order.total,
            noteCommande: order.noteCommande,
          }
        })

        setOrders(formattedOrders)
        setFilteredOrders(formattedOrders)
      } catch (error) {
        console.error("Failed to fetch order history:", error)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load your order history. Please try again later.",
        })
      } finally {
        setLoading(false)
      }
    }

    if (id_user) {
      fetchOrders()
      fetchLastOrder() // <--- ajoute cette ligne ici
    } else {
      navigate("/login")
    }
  }, [id_user, navigate])


  const fetchLastOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/user/last-order/${id_user}`)
      const order = res.data
      const orderDate = new Date(order.createdAt)
  
      setLastOrder({
        id: order._id,
        date: orderDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: orderDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        rawDate: orderDate,
        items: order.items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
          image: item.image,
        })),
        total: order.total
      })
    } catch (err) {
      console.error("⚠️ Erreur fetch last order:", err)
    }
  }
  



  useEffect(() => {
    if (dateFilter) {
      const filtered = orders.filter((order) => {
        const orderDate = order.date.toLowerCase()
        return orderDate.includes(dateFilter.toLowerCase())
      })
      setFilteredOrders(filtered)
    } else {
      setFilteredOrders(orders)
    }
  }, [dateFilter, orders])

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(orderId)
    }
  }

  const clearDateFilter = () => {
    setDateFilter("")
  }

  const generateInvoice = (order: Order) => {
    const doc = new jsPDF()
    const now = new Date()
    const formattedDate = now.toLocaleDateString()
    const formattedTime = now.toLocaleTimeString()

    doc.setFontSize(18)
    doc.text("Invoice", 14, 22)

    doc.setFontSize(11)
    doc.text(`Date: ${formattedDate}   Time: ${formattedTime}`, 14, 27)
    doc.text(`Order ID: ${order.id}`, 14, 32)
    doc.text(`Order Date: ${order.date} at ${order.time}`, 14, 37)

    autoTable(doc, {
      startY: 45,
      head: [["Meal", "Quantity", "Price (CAD)", "Subtotal"]],
      body: order.items.map((item) => [
        item.name,
        item.quantity,
        `$${item.price.toFixed(2)}`,
        `$${item.subtotal.toFixed(2)}`,
      ]),
    })

    doc.text(`Total: $${order.total.toFixed(2)}`, 14, doc.lastAutoTable!.finalY + 10)

    // Add order note to the invoice if it exists
    if (order.noteCommande && order.noteCommande.trim()) {
      doc.text(`Order Notes: ${order.noteCommande}`, 14, doc.lastAutoTable!.finalY + 20)
    }

    // Save the invoice
    doc.save(`invoice-${order.id.slice(-6)}.pdf`)
  }

  const downloadAllInvoices = async (ordersToDownload: Order[]) => {
    if (ordersToDownload.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Orders",
        text: "There are no orders to download invoices for.",
      })
      return
    }

    setDownloadingInvoices(true)

    try {
      // For multiple invoices, create a single PDF with multiple pages
      if (ordersToDownload.length > 3) {
        // For many orders, show a confirmation dialog first
        const result = await Swal.fire({
          title: "Download Multiple Invoices?",
          text: `You are about to download ${ordersToDownload.length} invoices. This might take a moment.`,
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#eab308",
          cancelButtonColor: "#6b7280",
          confirmButtonText: "Yes, download all",
        })

        if (!result.isConfirmed) {
          setDownloadingInvoices(false)
          return
        }
      }

      // Create a single PDF with all invoices
      const doc = new jsPDF()
      const now = new Date()
      const formattedDate = now.toLocaleDateString()

      // Add a cover page
      doc.setFontSize(24)
      doc.text("Order Invoices", 105, 40, { align: "center" })

      doc.setFontSize(14)
      doc.text(`Generated on: ${formattedDate}`, 105, 55, { align: "center" })
      doc.text(`Total Invoices: ${ordersToDownload.length}`, 105, 65, { align: "center" })

      // Add each order as a new page
      ordersToDownload.forEach((order, index) => {
        // Add a new page for each order (except the first one after cover page)
        if (index > 0) {
          doc.addPage()
        } else {
          doc.addPage()
        }

        doc.setFontSize(18)
        doc.text(`Invoice #${order.id.slice(-6)}`, 14, 22)

        doc.setFontSize(11)
        doc.text(`Order Date: ${order.date} at ${order.time}`, 14, 32)

        autoTable(doc, {
          startY: 40,
          head: [["Meal", "Quantity", "Price (CAD)", "Subtotal"]],
          body: order.items.map((item) => [
            item.name,
            item.quantity,
            `$${item.price.toFixed(2)}`,
            `$${item.subtotal.toFixed(2)}`,
          ]),
        })

        doc.text(`Total: $${order.total.toFixed(2)}`, 14, doc.lastAutoTable!.finalY + 10)

        // Add order note to the invoice if it exists
        if (order.noteCommande && order.noteCommande.trim()) {
          doc.text(`Order Notes: ${order.noteCommande}`, 14, doc.lastAutoTable!.finalY + 20)
        }
      })

      // Save the combined PDF
      const filename = dateFilter ? `invoices-${dateFilter.replace(/\s+/g, "-")}.pdf` : "all-invoices.pdf"

      doc.save(filename)

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `${ordersToDownload.length} invoice(s) have been downloaded!`,
      })
    } catch (error) {
      console.error("Error generating invoices:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was a problem generating the invoices. Please try again.",
      })
    } finally {
      setDownloadingInvoices(false)
      setDownloadMenuOpen(false)
    }
  }

  // Function to handle direct checkout
  const handleDirectCheckout = async (order: Order) => {
    try {
      setReordering(order.id)

      // Prepare the items for checkout
      const selectedMeals = order.items.map((item) => ({
        price_id: item.price_id,
        description: item.description || "",
        image: item.image,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: (item.price * item.quantity).toFixed(2),
      }))

      const total = selectedMeals.reduce((acc, item) => acc + Number.parseFloat(item.subtotal), 0).toFixed(2)
      const currentNote = orderNote !== null ? orderNote : order.noteCommande || ""

      // Store invoice data in localStorage for the success page
      localStorage.setItem(
        "invoiceData",
        JSON.stringify({
          selectedMeals,
          total,
          noteCommande: currentNote,
        }),
      )

      // Prepare line items for Stripe
      const line_items = selectedMeals.map((meal) => ({
        price: meal.price_id,
        quantity: meal.quantity,
      }))

      // Call the checkout API
      const response = await fetch("http://localhost:3000/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ line_items }),
      })

      const { id } = await response.json()

      if (!id) throw new Error("sessionId not returned from server")

      // Redirect to Stripe checkout
      const stripe = await stripePromise
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: id })
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred during the checkout process. Please try again.",
      })
    } finally {
      setReordering(null)
    }
  }

  // Function to handle adding to cart
  const handleAddToCart = async (order: Order) => {
    console.log(order.items, "ITEMS")

    try {
      setReordering(order.id)

      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Reorder Items",
        text: "Do you want to add these items to your cart?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#22c55e", // Green
        cancelButtonColor: "#6b7280", // Gray
        confirmButtonText: "Yes, add to cart",
      })

      if (!result.isConfirmed) {
        setReordering(null)
        return
      }

      // Store the order note in localStorage so the cart can access it
      const currentNote = orderNote !== null ? orderNote : order.noteCommande || ""
      localStorage.setItem("cartOrderNote", currentNote)

      // Then add each item from the past order to the cart
      for (const item of order.items) {
        console.log(item, "ITEM")

        await axios.post(`http://localhost:3000/api/orders/add`, {
          orderedAt: Date.now(),
          id_user: id_user,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          price_id: item.price_id,
          description: item.description,
          image: item.image,
        })
      }

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Order Reloaded!",
        text: "Your previous order has been added to your cart.",
        confirmButtonColor: "#eab308",
      }).then(() => {
        // Navigate to cart page
        navigate("/Cart")
      })
    } catch (error) {
      console.error("Failed to reorder:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was a problem reordering these items. Please try again.",
      })
    } finally {
      setReordering(null)
    }
  }

  // Function to handle reordering based on selected mode
  const handleReorder = async (order: Order) => {
    // Update the order with the edited note
    const updatedOrder = {
      ...order,
      noteCommande: orderNote !== null ? orderNote : order.noteCommande,
    }

    if (checkoutMode === "direct") {
      await handleDirectCheckout(updatedOrder)
    } else {
      await handleAddToCart(updatedOrder)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  }

  const detailsVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.3 },
    },
  }

  const menuVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  }

  useEffect(() => {
    // Reset orderNote when expanding/collapsing orders
    setOrderNote(null)
  }, [expandedOrder])

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
            <div className="flex flex-col items-center text-center">

                <h2 className="text-3xl md:text-5xl font-bold text-white">Order History</h2>
                <p className="mt-4 text-lg text-white">View your past orders and download invoices</p>
                <motion.div
                  className="mt-5 mb-8 border-b-4 border-yellow-500 w-48 rounded-full shadow-lg md:mx-0 mx-auto"
                  initial={{ width: 0 }}
                  animate={{ width: "12rem" }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  ></motion.div>
                  </div>
            <div className="flex flex-col space-y-10">


            {lastOrder && (
  <div className="bg-yellow-500/10 text-white p-5 rounded-xl shadow mb-6">
    <h3 className="text-lg font-bold mb-2">🕓 Your Last Order</h3>
    <div className="flex flex-wrap justify-between items-center">
      <div>
        <p className="text-sm">Placed on: <span className="font-medium">{lastOrder.date} at {lastOrder.time}</span></p>
        <p className="text-sm">Items: <span className="font-medium">{lastOrder.items.length}</span></p>
      </div>
      <div>
        <p className="text-sm font-semibold text-yellow-400">Total: ${lastOrder.total.toFixed(2)}</p>
      </div>
    </div>
  </div>
)}




              {/* Header Section with Search and Download Options */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <motion.div
                  className="text-center md:text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                </motion.div>

                <motion.div
                  style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  className="flex justify-center align-center md:flex-row gap-4 w-full md:w-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {/* Date Filter */}
                  <div className="relative" style={{ marginTop: "19px" }}>
                    <Search className="absolute left-3 top-1/3 transform -translate-y-1/2 h-4 w-4 text-yellow-500" />
                    <input
                      type="text"
                      placeholder="Filter by date..."
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="pl-10 pr-10 py-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-full text-white w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                    />
                    {dateFilter && (
                      <button onClick={clearDateFilter} className="absolute right-3 top-1/3 transform -translate-y-1/2">
                        <X className="h-4 w-4 text-white/70 hover:text-white" />
                      </button>
                    )}
                    <p className="text-white/60 text-xs mt-1 text-center md:text-left">
                      Try searching "June", "2023", etc.
                    </p>
                  </div>

                  {/* Checkout Mode Toggle */}
                  <div className="flex items-center bg-black/20 backdrop-blur-md rounded-full p-1">
                    <button
                      onClick={() => setCheckoutMode("cart")}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-colors ${
                        checkoutMode === "cart" ? "bg-yellow-500 text-black" : "text-white/70 hover:text-white"
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => setCheckoutMode("direct")}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-colors ${
                        checkoutMode === "direct" ? "bg-yellow-500 text-black" : "text-white/70 hover:text-white"
                      }`}
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Direct Checkout</span>
                    </button>
                  </div>

                  {/* Download Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
                      disabled={downloadingInvoices}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full ${
                        downloadingInvoices
                          ? "bg-yellow-500/50 cursor-not-allowed"
                          : "bg-yellow-500 hover:bg-yellow-400"
                      } text-black transition-colors w-full md:w-auto`}
                    >
                      {downloadingInvoices ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-black/20 border-t-black rounded-full"></div>
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          <span>Download Invoices</span>
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <AnimatePresence>
                      {downloadMenuOpen && !downloadingInvoices && (
                        <motion.div
                          className="absolute right-0 mt-2 w-64 bg-white/10 backdrop-blur-lg border border-white/10 rounded-lg shadow-xl z-10"
                          variants={menuVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <div className="py-1">
                            <button
                              onClick={() => downloadAllInvoices(orders)}
                              className="flex items-center w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              <span>Download All Invoices</span>
                            </button>
                            <button
                              onClick={() => downloadAllInvoices(filteredOrders)}
                              className="flex items-center w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors"
                              disabled={!dateFilter}
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>
                                {dateFilter
                                  ? `Download Filtered Invoices (${filteredOrders.length})`
                                  : "Filter by date first"}
                              </span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Accounting Export Button */}
                  <AccountingExport orders={orders} filteredOrders={filteredOrders} />
                </motion.div>
              </div>

              {/* Orders List */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
              ) : filteredOrders.length === 0 ? (
                <motion.div
                  className="text-center py-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {dateFilter ? (
                    <>
                      <Calendar className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Orders Found</h3>
                      <p className="text-white/80">No orders match your search criteria.</p>
                      <button
                        onClick={clearDateFilter}
                        className="mt-6 px-6 py-2 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-colors"
                      >
                        Clear Filter
                      </button>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Orders Yet</h3>
                      <p className="text-white/80">You haven't placed any orders yet.</p>
                      <button
                        onClick={() => navigate("/resto/2/menu")}
                        className="mt-6 px-6 py-2 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-colors"
                      >
                        Browse Menu
                      </button>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                  {filteredOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      variants={itemVariants}
                      className="bg-black/10 rounded-xl backdrop-blur-sm overflow-hidden"
                    >
                      {/* Order Header */}
                      <div
                        className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        <div className="flex flex-wrap justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className="bg-yellow-500/20 p-2 rounded-full">
                              <ShoppingBag className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">Order #{order.id.slice(-6)}</h3>
                              <div className="flex items-center text-white/70 text-sm">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>
                                  {order.date} at {order.time}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="flex items-center text-yellow-500 font-semibold">
                                <DollarSign className="h-4 w-4" />
                                <span>{order.total.toFixed(2)}</span>
                              </div>
                              <span className="text-white/70 text-sm">{order.items.length} items</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                generateInvoice(order)
                              }}
                              className="p-2 bg-yellow-500/20 rounded-full hover:bg-yellow-500/30 transition-colors"
                              title="Download Invoice"
                            >
                              <Download className="h-5 w-5 text-yellow-500" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                // Update the order with the edited note before reordering
                                const updatedOrder = {
                                  ...order,
                                  noteCommande: orderNote !== null ? orderNote : order.noteCommande,
                                }
                                handleReorder(updatedOrder)
                              }}
                              disabled={reordering === order.id}
                              className={`p-2 ${
                                reordering === order.id
                                  ? "bg-green-500/20 cursor-not-allowed"
                                  : "bg-green-500/20 hover:bg-green-500/30"
                              } rounded-full transition-colors`}
                              title={checkoutMode === "direct" ? "Direct Checkout" : "Add to Cart"}
                            >
                              {reordering === order.id ? (
                                <div className="animate-spin h-5 w-5 border-2 border-green-500/20 border-t-green-500 rounded-full"></div>
                              ) : checkoutMode === "direct" ? (
                                <RefreshCw className="h-5 w-5 text-green-500" />
                              ) : (
                                <ShoppingCart className="h-5 w-5 text-green-500" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      <AnimatePresence>
                        {expandedOrder === order.id && (
                          <motion.div
                            variants={detailsVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="border-t border-white/10 overflow-hidden"
                          >
                            <div className="p-4">
                              <h4 className="text-white font-medium mb-3">Order Items</h4>
                              <div className="space-y-4">
                                {order.items.map((item, itemIndex) => (
                                  <div key={itemIndex} className="flex items-center space-x-4">
                                    <img
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.name}
                                      className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                      <h5 className="text-white font-medium">{item.name}</h5>
                                      <p className="text-white/70 text-sm">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-white font-medium">${item.subtotal.toFixed(2)}</p>
                                      <p className="text-white/70 text-sm">${item.price.toFixed(2)} each</p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Display order note with edit functionality */}
                              <div className="mt-4 pt-4 border-t border-white/10">
                                <h5 className="text-white font-medium mb-2">Order Notes:</h5>
                                {expandedOrder === order.id && checkoutMode === "direct" ? (
                                  <textarea
                                    value={orderNote !== null ? orderNote : order.noteCommande || ""}
                                    onChange={(e) => setOrderNote(e.target.value)}
                                    className="w-full h-13 p-3 bg-white/5 text-white/80 rounded-md border border-white/20 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    placeholder="Add special instructions, allergies, etc..."
                                    rows={3}
                                  />
                                ) : (
                                  <p className="text-white/80 bg-white/5 p-3 rounded-md">
                                    {order.noteCommande || "No notes added"}
                                  </p>
                                )}
                              </div>

                              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
                                <span className="text-white font-medium">Total</span>
                                <span className="text-yellow-500 font-bold">${order.total.toFixed(2)}</span>
                              </div>
                              <div className="mt-4 flex justify-between">
                                <button
                                  onClick={() => {
                                    // Update the order with the edited note before reordering
                                    const updatedOrder = {
                                      ...order,
                                      noteCommande: orderNote !== null ? orderNote : order.noteCommande,
                                    }
                                    handleReorder(updatedOrder)
                                  }}
                                  disabled={reordering === order.id}
                                  className={`flex items-center space-x-2 px-4 py-2 ${
                                    reordering === order.id
                                      ? "bg-green-500/50 cursor-not-allowed"
                                      : "bg-green-500 hover:bg-green-400"
                                  } text-white rounded-full transition-colors`}
                                >
                                  {reordering === order.id ? (
                                    <>
                                      <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full mr-2"></div>
                                      <span>Processing...</span>
                                    </>
                                  ) : checkoutMode === "direct" ? (
                                    <>
                                      <RefreshCw className="h-4 w-4" />
                                      <span>Direct Checkout</span>
                                    </>
                                  ) : (
                                    <>
                                      <ShoppingCart className="h-4 w-4" />
                                      <span>Add to Cart</span>
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => generateInvoice(order)}
                                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-colors"
                                >
                                  <FileText className="h-4 w-4" />
                                  <span>Download Invoice</span>
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </BlurContainer>
        </div>
      </div>
    </div>
  )
}

export default OrderHistory
