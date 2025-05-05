
const Order = require('../models/orderModel');

// CREATE
exports.addOrder = async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      quantity: 1,
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ (All orders for a user)
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ id_user: req.params.id_user })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


// DELETE
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findOneAndDelete({id_user: req.params.id_user, price_id: req.params.price_id})
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// DELETE ALL
exports.deleteAllOrders = async (req, res) => {
  try {
    await Order.deleteMany({id_user: req.params.id_user})
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.incrementQuantity = async (req, res) => {
  const { id_user , price_id } = req.params; // Order ID from URL

  try {
    const order = await Order.findOne({id_user, price_id});

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.quantity += 1;
    await order.save();

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.decrementQuantity = async (req, res) => {
  const { id_user , price_id } = req.params; // Order ID from URL

  try {
    const order = await Order.findOne({id_user, price_id});

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.quantity -= 1;
    await order.save();

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


