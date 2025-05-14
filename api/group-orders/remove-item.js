const GroupOrder = require("../../models/group-order")

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { code, userId, itemId } = req.body

    if (!code || !userId || !itemId) {
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

    // Find the item
    const itemIndex = groupOrder.items.findIndex((item) => item._id.toString() === itemId)

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in this group order" })
    }

    const item = groupOrder.items[itemIndex]

    // Check if user is allowed to remove this item
    if (item.userId !== userId && groupOrder.creatorId !== userId) {
      return res.status(403).json({ message: "You can only remove your own items" })
    }

    // Remove the item
    groupOrder.items.splice(itemIndex, 1)
    await groupOrder.save()

    res.status(200).json({
      success: true,
      groupOrder,
    })
  } catch (error) {
    console.error("Error removing item from group order:", error)
    res.status(500).json({ message: "Error removing item from group order", error: error.message })
  }
}
