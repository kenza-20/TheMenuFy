const GroupOrder = require("../../models/group-order")

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { code, userId, status } = req.body

    if (!code || !userId || !status) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Find the group order
    const groupOrder = await GroupOrder.findOne({ code })

    if (!groupOrder) {
      return res.status(404).json({ message: "Group order not found" })
    }

    // Check if user is a participant
    const isParticipant = groupOrder.participants.some((p) => p.userId === userId)

    if (!isParticipant) {
      return res.status(403).json({ message: "You are not a participant in this group order" })
    }

    // Update status
    groupOrder.status = status
    await groupOrder.save()

    res.status(200).json({
      success: true,
      groupOrder,
    })
  } catch (error) {
    console.error("Error updating group order payment status:", error)
    res.status(500).json({ message: "Error updating group order payment status", error: error.message })
  }
}
