const GroupOrder = require("../../models/group-order")

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { code, userId, userName, item } = req.body

    if (!code || !userId || !userName || !item) {
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

    if (!isParticipant) {
      return res.status(403).json({ message: "You are not a participant in this group order" })
    }

    // Add item to the group order
    groupOrder.items.push({
      userId,
      userName,
      itemId: item.price_id || item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      image: item.image,
      description: item.description,
      addedAt: new Date(),
    })

    await groupOrder.save()

    res.status(200).json({
      success: true,
      groupOrder,
    })
  } catch (error) {
    console.error("Error adding item to group order:", error)
    res.status(500).json({ message: "Error adding item to group order", error: error.message })
  }
}
