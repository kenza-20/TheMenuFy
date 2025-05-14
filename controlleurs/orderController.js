const Order = require('../models/orderModel');
const QRCode = require('qrcode');

// CREATE: Add a new order
exports.addOrder = async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      quantity: req.body.quantity || 1,  // Default to 1 if no quantity is provided
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ: Get all orders for a specific user
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ id_user: req.params.id_user });
    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found' });
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ: Get all orders for a specific table (added functionality to filter by tableId)
exports.getOrdersByTable = async (req, res) => {
  try {
    const orders = await Order.find({ tableId: req.params.tableId });
    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this table' });
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: Delete a specific order by userId and priceId
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ 
      id_user: req.params.id_user, 
      price_id: req.params.price_id 
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE ALL: Delete all orders for a specific user
exports.deleteAllOrders = async (req, res) => {
  try {
    await Order.deleteMany({ id_user: req.params.id_user });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Increment the quantity of an order
exports.incrementQuantity = async (req, res) => {
  const { id_user, price_id } = req.params;

  try {
    const order = await Order.findOne({ id_user, price_id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.quantity += 1;  // Increment quantity by 1
    await order.save();
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Decrement the quantity of an order
exports.decrementQuantity = async (req, res) => {
  const { id_user, price_id } = req.params;

  try {
    const order = await Order.findOne({ id_user, price_id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.quantity > 1) {  // Ensure the quantity does not go below 1
      order.quantity -= 1;
      await order.save();
      res.status(200).json(order);
    } else {
      return res.status(400).json({ error: "Quantity can't be less than 1" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE: Change the status of an order (e.g., "pending" to "preparing", "served", or "paid")
exports.updateOrderStatus = async (req, res) => {
  const { id_user, price_id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findOne({ id_user, price_id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Ensure the status is valid
    if (!['pending', 'preparing', 'served', 'paid'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    order.status = status;  // Update the status
    await order.save();
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.generateQRCodeForTable = async (req, res) => {
  const { tableId } = req.params; // The tableId is passed in the URL

  try {
    // Construct the URL to be encoded into the QR code
    const qrData = `http://localhost:5173/api/orders/qr/${tableId}`; // This URL can be customized

    // Generate the QR code
    QRCode.toDataURL(qrData, (err, qrCodeImage) => {
      if (err) {
        return res.status(500).json({ error: 'Error generating QR code' });
      }

      // Send the QR code as a response (base64 image)
      res.status(200).json({ qrCodeImage });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// GET orders by QR Code (i.e., tableId)
exports.getOrdersByQRCode = async (req, res) => {
  const { tableId } = req.params; // Extract tableId from URL

  try {
    // Fetch orders linked to the provided tableId
    const orders = await Order.find({ tableId: tableId });

    // Check if orders exist for the given tableId
    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this table' });
    }

    // Respond with the found orders
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};