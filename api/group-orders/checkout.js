const GroupOrder = require("../../models/group-order")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { code, userId, paymentType } = req.body

    if (!code || !userId) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Find the group order
    const groupOrder = await GroupOrder.findOne({ code, status: "active" })

    if (!groupOrder) {
      return res.status(404).json({ message: "Group order not found or inactive" })
    }

    // Check if expired
    if (new Date() > new Date(groupOrder.expiresAt)) {
      groupOrder.status = "closed"
      await groupOrder.save()
      return res.status(400).json({ message: "This group order has expired" })
    }

    // Check if user is a participant
    const isParticipant = groupOrder.participants.some((p) => p.userId === userId)
    const isCreator = groupOrder.creatorId === userId

    if (!isParticipant) {
      return res.status(403).json({ message: "You are not a participant in this group order" })
    }

    // For single payment, only creator can checkout
    if (groupOrder.paymentMethod === "single" && !isCreator) {
      return res.status(403).json({ message: "Only the group order creator can checkout with single payment" })
    }

    // For individual payment, determine which items to checkout
    let itemsToCheckout = []
    let totalAmount = 0

    if (groupOrder.paymentMethod === "individual" || paymentType === "individual") {
      // Only checkout items added by this user
      itemsToCheckout = groupOrder.items.filter((item) => item.userId === userId)
    } else if (groupOrder.paymentMethod === "split" || paymentType === "split") {
      // Split payment - all items, but divide cost by number of participants
      itemsToCheckout = groupOrder.items
      const participantCount = groupOrder.participants.length
      totalAmount = itemsToCheckout.reduce((sum, item) => sum + item.price * item.quantity, 0) / participantCount
    } else {
      // Single payment - all items
      itemsToCheckout = groupOrder.items
      totalAmount = itemsToCheckout.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }

    if (itemsToCheckout.length === 0) {
      return res.status(400).json({ message: "No items to checkout" })
    }

    // Create line items for Stripe
    const line_items = itemsToCheckout.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: item.description || "",
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?group=${code}`,
      cancel_url: `${process.env.FRONTEND_URL}/group-order/${code}`,
      metadata: {
        groupOrderCode: code,
        userId,
        paymentType: paymentType || groupOrder.paymentMethod,
      },
    })

    res.status(200).json({
      success: true,
      sessionId: session.id,
    })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    res.status(500).json({ message: "Error creating checkout session", error: error.message })
  }
}
