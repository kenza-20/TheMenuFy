// controllers/placedOrderController.js
const PlacedOrder = require('../models/PlacedOrder');

exports.createOrder = async (req, res) => {
  try {
    const { userId, items, total } = req.body;

    const newOrder = new PlacedOrder({
      userId,
      items,
      total,
    });

    await newOrder.save();
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
