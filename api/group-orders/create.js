const GroupOrder = require("../../models/group-order")

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { userId, userName, name, expiresIn } = req.body

    if (!userId || !userName || !name) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Generate expiration date (default: 24 hours)
    const hours = expiresIn || 24
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + hours)

    // Generate a unique code
    let code
    let isUnique = false
    while (!isUnique) {
      code = GroupOrder.generateCode()
      const existingOrder = await GroupOrder.findOne({ code })
      if (!existingOrder) {
        isUnique = true
      }
    }

    const groupOrder = new GroupOrder({
      code,
      name,
      creatorId: userId,
      creatorName: userName,
      expiresAt,
      participants: [
        {
          userId,
          userName,
          joinedAt: new Date(),
        },
      ],
    })

    await groupOrder.save()

    res.status(201).json({
      success: true,
      groupOrder,
    })
  } catch (error) {
    console.error("Error creating group order:", error)
    res.status(500).json({ message: "Error creating group order", error: error.message })
  }
}
