

import { useEffect, useRef } from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import axios from "axios"

const Success = () => {
  const navigate = useNavigate()
  const hasRun = useRef(false) // 🛡️ Flag to avoid duplicate runs

  const id_user = typeof window !== "undefined" ? localStorage.getItem("userId") : null
  const userId = id_user

  useEffect(() => {
    if (hasRun.current) return // 🛑 Block second run
    hasRun.current = true

    const stored = localStorage.getItem("invoiceData")

    if (stored) {
      const { selectedMeals, total, noteCommande, groupOrderCode } = JSON.parse(stored)

      console.log("Selected meals:", selectedMeals)

      const order = {
        userId: id_user,
        items: selectedMeals,
        total,
        noteCommande,
        groupOrderCode, // Include group order code if present
      }

      const doc = new jsPDF()
      const now = new Date()
      const formattedDate = now.toLocaleDateString()
      const formattedTime = now.toLocaleTimeString()

      doc.setFontSize(18)
      doc.text("Invoice", 14, 22)

      doc.setFontSize(11)
      doc.text(`Date: ${formattedDate}   Time: ${formattedTime}`, 14, 27)

      // Add accounting reference number
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`
      doc.text(`Invoice Number: ${invoiceNumber}`, 14, 32)

      // Add customer information
      doc.text(`Customer ID: ${id_user}`, 14, 37)

      // Add group order information if applicable
      if (groupOrderCode) {
        doc.text(`Group Order: ${groupOrderCode}`, 14, 42)
      }

      autoTable(doc, {
        startY: groupOrderCode ? 50 : 45,
        head: [["Meal", "Quantity", "Price (CAD)", "Subtotal"]],
        body: selectedMeals.map((item) => [item.name, item.quantity, `$${item.price.toFixed(2)}`, `$${item.subtotal}`]),
      })

      // Calculate subtotal, tax, and total
      const subtotal = Number.parseFloat(total)
      const taxRate = 0.05 // 5% tax rate (adjust as needed)
      const taxAmount = subtotal * taxRate
      const finalTotal = subtotal + taxAmount

      // Add totals section with tax information
      let y = doc.lastAutoTable.finalY + 10
      doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, y, { align: "right" })
      y += 5
      doc.text(`Tax (5%): $${taxAmount.toFixed(2)}`, 140, y, { align: "right" })
      y += 5
      doc.text(`Total: $${finalTotal.toFixed(2)}`, 140, y, { align: "right" })

      // Add order notes if present
      if (noteCommande && noteCommande.trim()) {
        y += 10
        doc.text("Order Notes:", 14, y)
        y += 5
        doc.text(noteCommande, 14, y)
      }

      // Add accounting information
      y += 15
      doc.text("For Accounting Purposes:", 14, y)
      y += 5
      doc.text(`Transaction ID: TXN-${Date.now().toString().slice(-8)}`, 14, y)
      y += 5
      doc.text(`Payment Method: Credit Card`, 14, y)
      y += 5
      doc.text(`Payment Status: Paid`, 14, y)

      // Add footer
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.text(
          `This document is automatically generated and is valid without signature. Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" },
        )
      }

      // 🧾 Save the invoice
      doc.save("invoice.pdf")

      // ✅ Show success alert and navigate after confirmation
      Swal.fire({
        icon: "success",
        title: "Payment successful!",
        text: "Your invoice is downloading...",
        confirmButtonColor: "#eab308",
      }).then(() => {
        // If this was a group order checkout, redirect back to the group order page
        if (groupOrderCode) {
          navigate(`/group-order/${groupOrderCode}`)
        } else {
          navigate("/") // ⬅️ Redirect to homepage for regular orders
        }
      })

      // If the user exists, proceed with the order processing
      if (id_user) {
        // For group orders, we don't clear the cart
        if (!groupOrderCode) {
          axios
            .delete(`http://localhost:3000/api/orders/${id_user}`)
            .then(() => console.log("Orders cleared."))
            .catch((err) => console.error("Error clearing orders:", err))
        }

        const createPlacedOrder = async () => {
          try {
            // Get the invoice data from localStorage
            const invoiceData = JSON.parse(localStorage.getItem("invoiceData") || "{}")

            // Check if this is a group order
            const isGroupOrder = !!invoiceData.groupOrderCode

            // Create the order with group order information if applicable
            const orderData = {
              userId: userId,
              items: invoiceData.selectedMeals,
              total: Number.parseFloat(invoiceData.total),
              noteCommande: invoiceData.noteCommande || "",
              // Include group order information
              isGroupOrder: isGroupOrder,
              groupOrderCode: invoiceData.groupOrderCode,
              groupOrderName: invoiceData.groupOrderName,
              groupOrderPaymentMethod: invoiceData.paymentType,
              userPaymentAmount: Number.parseFloat(invoiceData.total),
              groupOrderTotalAmount: invoiceData.groupTotal
                ? Number.parseFloat(invoiceData.groupTotal)
                : Number.parseFloat(invoiceData.total),
            }

            // Call the API to create the placed order
            const response = await axios.post("http://localhost:3000/api/placedOrders/create", orderData)

            console.log("Order created successfully:", response.data)

            // Rest of your code...
          } catch (error) {
            console.error("Error creating order:", error)
            // Handle error...
          }
        }

        // Call the function
        createPlacedOrder()

        // axios
        //   .post("http://localhost:3000/api/placedOrders/create", order)
        //   .then(() => {
        //     console.log("Order saved")

        // Now, send the notification to the chef after PDF download
        selectedMeals.forEach((item) => {
          const notification = {
            itemName: item.name,
            itemQuantity: item.quantity,
            chefid: "66144efc1d9c8c7d9d05dc94",
            restoid: "66144efc1d9c8c7d9d05dc99",
          }

          // Send notification to chef via an API
          axios
            .post("http://localhost:3000/api/notifications/send", notification)
            .then((response) => {
              console.log("Notification sent to chef:", response.data)
            })
            .catch((error) => {
              console.error("Error sending notification to chef:", error)
            })
        })

        // If this was a group order checkout, update the group order status
        if (groupOrderCode) {
          axios
            .post("http://localhost:3000/api/group-orders/update-payment-status", {
              code: groupOrderCode,
              userId: id_user,
              paymentStatus: "paid", // Changed from "status: completed" to "paymentStatus: paid"
            })
            .then((response) => {
              console.log("Group order payment status updated:", response.data)
            })
            .catch((error) => {
              console.error("Error updating group order payment status:", error)
            })
        }
     
      }
    }
  }, [navigate])

  return (
    <div className="relative min-h-screen flex flex-col">
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center -z-10">
          <div className="absolute inset-0 bg-black/40" />
        </div>
      </section>
    </div>
  )
}

export default Success
