const GroupOrder = require("../../models/group-order")

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { code } = req.query

    if (!code) {
      return res.status(400).json({ message: "Missing code parameter" })
    }

    // Find the group order
    const groupOrder = await GroupOrder.findOne({ code })

    if (!groupOrder) {
      return res.status(404).json({ message: "Group order not found" })
    }

    // Check if expired but still active
    if (groupOrder.status === "active" && new Date() > new Date(groupOrder.expiresAt)) {
      groupOrder.status = "closed"
      await groupOrder.save()
    }

    res.status(200).json({
      success: true,
      groupOrder,
    })
  } catch (error) {
    console.error("Error fetching group order:", error)
    res.status(500).json({ message: "Error fetching group order", error: error.message })
  }
}
