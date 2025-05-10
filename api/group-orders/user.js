const GroupOrder = require("../../models/group-order")

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { userId } = req.params

    if (!userId) {
      return res.status(400).json({ message: "Missing userId parameter" })
    }

    // Find all group orders where the user is a participant
    const groupOrders = await GroupOrder.find({
      "participants.userId": userId,
    }).sort({ createdAt: -1 })

    // Check if any active orders have expired
    for (const order of groupOrders) {
      if (order.status === "active" && new Date() > new Date(order.expiresAt)) {
        order.status = "closed"
        await order.save()
      }
    }

    res.status(200).json({
      success: true,
      groupOrders,
    })
  } catch (error) {
    console.error("Error fetching user's group orders:", error)
    res.status(500).json({ message: "Error fetching user's group orders", error: error.message })
  }
}
