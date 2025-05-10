// controllers/groupOrderController.js
const GroupOrder = require("../models/group-order");
const User = require("../models/userModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Generate a random 6-character code
const generateUniqueCode = async () => {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed similar looking characters
  let code;
  let isUnique = false;
  
  while (!isUnique) {
    code = "";
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Check if code already exists
    const existingOrder = await GroupOrder.findOne({ code });
    if (!existingOrder) {
      isUnique = true;
    }
  }
  
  return code;
};

// Create a new group order
exports.createGroupOrder = async (req, res) => {
  try {
    const { userId, name, expiresIn } = req.body;
    
    if (!userId || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Find the user to get their name
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Generate expiration date (default: 24 hours)
    const hours = expiresIn || 24;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + hours);
    
    // Generate a unique code
    const code = await generateUniqueCode();
    
    const groupOrder = new GroupOrder({
      code,
      name,
      creatorId: userId,
      creatorName: `${user.name} ${user.surname}`,
      expiresAt,
      participants: [
        {
          userId,
          userName: `${user.name} ${user.surname}`,
          joinedAt: new Date()
        }
      ]
    });
    
    await groupOrder.save();
    
    res.status(201).json({
      success: true,
      groupOrder
    });
  } catch (error) {
    console.error("Error creating group order:", error);
    res.status(500).json({ message: "Error creating group order", error: error.message });
  }
};

// Join an existing group order
exports.joinGroupOrder = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { code, userId, userName } = req.body

    if (!code || !userId || !userName) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Find the group order - explicitly check for active status
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
};

// Add item to group order
exports.addItemToGroupOrder = async (req, res) => {
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

    // Check if user is a participant - strict check
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
};

// Remove item from group order
exports.removeItemFromGroupOrder = async (req, res) => {
  try {
    const { code, userId, itemId } = req.body;
    
    if (!code || !userId || !itemId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Find the group order
    const groupOrder = await GroupOrder.findOne({ code });
    
    if (!groupOrder) {
      return res.status(404).json({ message: "Group order not found" });
    }
    
    // Find the item
    const itemIndex = groupOrder.items.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in group order" });
    }
    
    const item = groupOrder.items[itemIndex];
    
    // Check if user is allowed to remove this item
    // Only the item creator or group order creator can remove items
    if (item.userId !== userId && groupOrder.creatorId !== userId) {
      return res.status(403).json({ message: "You are not authorized to remove this item" });
    }
    
    // Remove the item
    groupOrder.items.splice(itemIndex, 1);
    await groupOrder.save();
    
    res.status(200).json({
      success: true,
      groupOrder
    });
  } catch (error) {
    console.error("Error removing item from group order:", error);
    res.status(500).json({ message: "Error removing item from group order", error: error.message });
  }
};

// Get group order by code
exports.getGroupOrder = async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ message: "Missing code parameter" });
    }
    
    // Find the group order
    const groupOrder = await GroupOrder.findOne({ code });
    
    if (!groupOrder) {
      return res.status(404).json({ message: "Group order not found" });
    }
    
    // Check if expired but still active
    if (groupOrder.status === "active" && new Date() > new Date(groupOrder.expiresAt)) {
      groupOrder.status = "closed";
      await groupOrder.save();
    }
    
    res.status(200).json({
      success: true,
      groupOrder
    });
  } catch (error) {
    console.error("Error fetching group order:", error);
    res.status(500).json({ message: "Error fetching group order", error: error.message });
  }
};

// Get all active group orders for a user
exports.getUserGroupOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: "Missing userId parameter" });
    }
    
    // Find all group orders where user is a participant
    const groupOrders = await GroupOrder.find({
      "participants.userId": userId
    }).sort({ createdAt: -1 });
    
    // Check for expired orders and update their status
    for (const order of groupOrders) {
      if (order.status === "active" && new Date() > new Date(order.expiresAt)) {
        order.status = "closed";
        await order.save();
      }
    }
    
    res.status(200).json({
      success: true,
      groupOrders
    });
  } catch (error) {
    console.error("Error fetching user group orders:", error);
    res.status(500).json({ message: "Error fetching user group orders", error: error.message });
  }
};

// Update payment method
exports.updatePaymentMethod = async (req, res) => {
  try {
    const { code, paymentMethod, userId } = req.body;
    
    if (!code || !paymentMethod || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Find the group order
    const groupOrder = await GroupOrder.findOne({ code, status: "active" });
    
    if (!groupOrder) {
      return res.status(404).json({ message: "Group order not found or inactive" });
    }
    
    // Check if user is the creator
    if (groupOrder.creatorId !== userId) {
      return res.status(403).json({ message: "Only the group order creator can update payment method" });
    }
    
    // Update payment method
    groupOrder.paymentMethod = paymentMethod;
    await groupOrder.save();
    
    res.status(200).json({
      success: true,
      groupOrder
    });
  } catch (error) {
    console.error("Error updating payment method:", error);
    res.status(500).json({ message: "Error updating payment method", error: error.message });
  }
};

// Process checkout for group order
exports.checkout = async (req, res) => {
  try {
    const { line_items, groupOrderCode, paymentType } = req.body
    const userId = req.headers["user-id"] || req.cookies.userId

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}${
        groupOrderCode ? `&groupOrderCode=${groupOrderCode}&paymentType=${paymentType}` : ""
      }`,
      cancel_url: `${process.env.FRONTEND_URL}${groupOrderCode ? `/group-order/${groupOrderCode}` : "/cart"}`,
      metadata: {
        userId: req.body.userId,
        // Include group order information if present
        isGroupOrder: req.body.groupOrderCode ? "true" : "false",
        groupOrderCode: req.body.groupOrderCode || "",
        groupOrderName: req.body.groupOrderName || "",
        paymentType: req.body.paymentType || "",
        groupTotal: req.body.groupTotal ? req.body.groupTotal.toString() : "",
      },
    })

    res.status(200).json({ id: session.id })
  } catch (error) {
    console.error("Checkout error:", error)
    res.status(500).json({ error: error.message })
  }
};

// Complete a group order after successful payment
exports.completeGroupOrder = async (req, res) => {
  try {
    const { code } = req.params;
    
    if (!code) {
      return res.status(400).json({ message: "Missing code parameter" });
    }
    
    // Find the group order
    const groupOrder = await GroupOrder.findOne({ code });
    
    if (!groupOrder) {
      return res.status(404).json({ message: "Group order not found" });
    }
    
    // Update status to completed
    groupOrder.status = "completed";
    await groupOrder.save();
    
    // Update user order counts for loyalty program
    for (const participant of groupOrder.participants) {
      const user = await User.findById(participant.userId);
      if (user) {
          
          // Update loyalty level based on order count
          if (user.orderCount+1 >= 20) {
              user.loyaltyLevel = 'Gold';
            } else if (user.orderCount+1 >= 10) {
                user.loyaltyLevel = 'Silver';
            } else {
                user.loyaltyLevel = 'Bronze';
            }
            user.orderCount += 1;
            
        await user.save();
      }
    }
    
    res.status(200).json({
      success: true,
      message: "Group order completed successfully"
    });
  } catch (error) {
    console.error("Error completing group order:", error);
    res.status(500).json({ message: "Error completing group order", error: error.message });
  }
};

exports.updateItemQuantity = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { code, userId, itemId, quantity } = req.body

    if (!code || !userId || !itemId || quantity === undefined) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Find the group order
    const groupOrder = await GroupOrder.findOne({ code })

    if (!groupOrder) {
      return res.status(404).json({ message: "Group order not found" })
    }

    // Check if user is a participant
    const isParticipant = groupOrder.participants.some((p) => p.userId === userId)
    const isCreator = groupOrder.creatorId === userId

    if (!isParticipant && !isCreator) {
      return res.status(403).json({ message: "You are not a participant in this group order" })
    }

    // Find the item
    const itemIndex = groupOrder.items.findIndex((item) => item._id.toString() === itemId)

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in group order" })
    }

    // Check if user is allowed to update this item
    const item = groupOrder.items[itemIndex]
    if (item.userId !== userId && !isCreator) {
      return res.status(403).json({ message: "You can only update your own items" })
    }

    // Update the quantity
    groupOrder.items[itemIndex].quantity = quantity

    await groupOrder.save()

    res.status(200).json({
      success: true,
      groupOrder,
    })
  } catch (error) {
    console.error("Error updating item quantity:", error)
    res.status(500).json({ message: "Error updating item quantity", error: error.message })
  }
}

exports.updatePaymentStatus = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { code, userId, paymentStatus } = req.body

    if (!code || !userId || !paymentStatus) {
      return res.status(400).json({
        message: "Missing required fields",
        received: { code, userId, paymentStatus },
        required: ["code", "userId", "paymentStatus"],
      })
    }

    // Find the group order
    const groupOrder = await GroupOrder.findOne({ code })

    if (!groupOrder) {
      return res.status(404).json({ message: "Group order not found" })
    }

    // Find the participant index
    const participantIndex = groupOrder.participants.findIndex((p) => p.userId === userId)

    if (participantIndex === -1) {
      return res.status(404).json({ message: "Participant not found in group order" })
    }

    // Update participant payment status
    groupOrder.participants[participantIndex].paymentStatus = paymentStatus

    // Check if the payment method is "single" and the user is the creator
    if (groupOrder.paymentMethod === "single" && userId === groupOrder.creatorId && paymentStatus === "paid") {
      // If the organizer pays in single payment mode, mark the entire order as paid
      groupOrder.paymentStatus = "paid"

      // Mark all participants as paid
      groupOrder.participants.forEach((participant) => {
        participant.paymentStatus = "paid"
      })
    } else {
      // For other payment methods, check if all participants have paid
      const allPaid = groupOrder.participants.every((p) => p.paymentStatus === "paid")
      const anyPaid = groupOrder.participants.some((p) => p.paymentStatus === "paid")

      // Update overall payment status
      if (allPaid) {
        groupOrder.paymentStatus = "paid"
      } else if (anyPaid) {
        groupOrder.paymentStatus = "partial"
      } else {
        groupOrder.paymentStatus = "pending"
      }
    }

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


exports.leave = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { code, userId } = req.body

    if (!code || !userId) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Find the group order
    const groupOrder = await GroupOrder.findOne({ code })

    if (!groupOrder) {
      return res.status(404).json({ message: "Group order not found" })
    }

    // Check if user is the creator (creators can't leave their own group order)
    if (groupOrder.creatorId === userId) {
      return res.status(400).json({ message: "Group order creators cannot leave their own group order" })
    }

    // Check if user is a participant
    const participantIndex = groupOrder.participants.findIndex((p) => p.userId === userId)
    if (participantIndex === -1) {
      return res.status(400).json({ message: "User is not a participant in this group order" })
    }

    // Remove user from participants
    groupOrder.participants.splice(participantIndex, 1)

    // Remove user's items from the group order
    groupOrder.items = groupOrder.items.filter((item) => item.userId !== userId)

    await groupOrder.save()

    // Clear the currentGroupOrder from localStorage on the client side
    // This will be handled in the frontend

    res.status(200).json({
      success: true,
      message: "Successfully left the group order",
      groupOrder,
    })
  } catch (error) {
    console.error("Error leaving group order:", error)
    res.status(500).json({ message: "Error leaving group order", error: error.message })
  }
}


exports.delete = async (req, res) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { code, userId } = req.body

    if (!code || !userId) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Find the group order
    const groupOrder = await GroupOrder.findOne({ code })

    if (!groupOrder) {
      return res.status(404).json({ message: "Group order not found" })
    }

    // Check if user is the creator
    if (groupOrder.creatorId !== userId) {
      return res.status(403).json({ message: "Only the group order creator can delete the group order" })
    }

    const participantIndex = groupOrder.participants.findIndex((p) => p.userId === userId)
    if (participantIndex === -1) {
      return res.status(400).json({ message: "User is not a participant in this group order" })
    }

    // Remove user from participants
    groupOrder.participants.splice(participantIndex, 1)

    // Delete the group order
    await GroupOrder.deleteOne({ code })

    res.status(200).json({
      success: true,
      message: "Group order deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting group order:", error)
    res.status(500).json({ message: "Error deleting group order", error: error.message })
  }
}