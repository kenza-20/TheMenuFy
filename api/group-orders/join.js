const GroupOrder = require("../../models/group-order")

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { code, userId, userName } = req.body

    if (!code || !userId || !userName) {
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

    // Check if user is already a participant
    const isParticipant = groupOrder.participants.some((p) => p.userId === userId)

    if (!isParticipant) {
      // Add user to participants
      groupOrder.participants.push({
        userId,
        userName,
        joinedAt: new Date(),
      })
      await groupOrder.save()
    }

    res.status(200).json({
      success: true,
      groupOrder,
    })
  } catch (error) {
    console.error("Error joining group order:", error)
    res.status(500).json({ message: "Error joining group order", error: error.message })
  }
}
