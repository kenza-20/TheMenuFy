const Order = require('../models/orderModel');

const getUserOrders = async (req, res) => {
  try {
    console.log("req.user:", req.user); // log important
    const orders = await Order.find({ id_user: req.user.id }).populate('id_dish');
    console.log("Orders:", orders); // vérifie la structure ici
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch user order history" });
  }
};


module.exports = { getUserOrders };
