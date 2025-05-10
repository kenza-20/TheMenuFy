const GroupOrder = require("../../models/group-order")

module.exports = async (req, res) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { code, paymentMethod, userId } = req.body

    if (!code || !paymentMethod || !userId) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Find the group order
    const groupOrder = await GroupOrder.findOne({ code, status: "active" })

    if (!groupOrder) {
      return res.status(404).json({ message: "Group order not found or inactive" })
    }

    // Check if user is the creator
    if (groupOrder.creatorId !== userId) {
      return res.status(403).json({ message: "Only the group order creator can update payment method" })
    }

    // Update payment method
    groupOrder.paymentMethod = paymentMethod
    await groupOrder.save()

    res.status(200).json({
      success: true,
      groupOrder,
    })
  } catch (error) {
    console.error("Error updating payment method:", error)
    res.status(500).json({ message: "Error updating payment method", error: error.message })
  }
}
