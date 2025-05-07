// controllers/placedOrderController.js
const PlacedOrder = require('../models/PlacedOrder');
const User = require('../models/userModel');

exports.createOrder = async (req, res) => {
  try {
    const { userId, items, total, noteCommande } = req.body;

    const newOrder = new PlacedOrder({
      userId,
      items,
      total,
      noteCommande
    });

    await newOrder.save();

     // 🔁 Incrémenter le compteur de commandes
     const user = await User.findById(userId);
     if (user) {
       
       // 🎖 Déterminer le niveau de fidélité
       if (user.orderCount+1 >= 20) {
         user.loyaltyLevel = 'Gold';
          } else if (user.orderCount+1 >= 10) {
            user.loyaltyLevel = 'Silver';
          } else {
            user.loyaltyLevel = 'Bronze';
          }
          
          user.orderCount = (user.orderCount || 0) + 1;
 
       await user.save();
     }


    res.status(201).json({ message: "Order saved successfully", order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving order" });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await PlacedOrder.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order history" });
  }
};


exports.getMostPurchasedDish = async (req, res) => {
  try {
    // The user ID comes from the req.user set by the authenticate middleware
    const userId = req.user.id;

    const result = await PlacedOrder.aggregate([
      { $match: { userId } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalQuantity: { $sum: "$items.quantity" },
          image: { $first: "$items.image" },
          description: { $first: "$items.description" },
          price: { $first: "$items.price" },
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 1 }
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "No purchases found for this user." });
    }

    res.status(200).json({ mostPurchasedDish: result[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch most purchased dish." });
  }
};
