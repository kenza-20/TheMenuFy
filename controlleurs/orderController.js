
const Order = require('../models/orderModel');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
exports.generateOrderQRCode = async (req, res) => {
  try {
    const orders = await Order.find({ id_user: req.params.id_user });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found for this user" });
    }

    // Prepare order summary (you can customize this)
    const summary = orders.map(order => 
      `${order.name} x${order.quantity}`
    ).join('\n');

    // Generate QR Code
    const qrCodeDataURL = await QRCode.toDataURL(summary);

    res.status(200).json({ qrCode: qrCodeDataURL });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// CREATE
exports.addOrder = async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      quantity: req.body.quantity || 1
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
// ✅ KEEP THIS VERSION ONLY

exports.generateOrderQRCode = async (req, res) => {
  try {
    const { id_user } = req.params;
    console.log('User ID:', id_user);

    const orders = await Order.find({ id_user });
    console.log('Orders fetched:', orders);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found for this user" });
    }

    // Get the first order with a valid tableNumber
    const tableNumberOrder = orders.find(order => order.tableNumber !== undefined && order.tableNumber !== null);
    if (!tableNumberOrder) {
      return res.status(400).json({ error: 'No order contains a valid table number' });
    }

    const tableNumber = tableNumberOrder.tableNumber;

    // Filter valid orders with both name and quantity
    const validOrders = orders.filter(order => order.name && order.quantity);

    const summary = validOrders
      .map(order => `${order.name} x${order.quantity}`)
      .join('\n');

    console.log('Table Number:', tableNumber);
    console.log('Order Summary:', summary);

    if (!summary.trim()) {
      return res.status(400).json({ error: 'Order summary is empty' });
    }

    const qrData = `Table Number: ${tableNumber}\n${summary}`;
    const qrCode = await QRCode.toDataURL(qrData);

    res.json({
      tableNumber,
      orderSummary: summary,
      qrCode
    });

  } catch (err) {
    console.error("Error generating QR code:", err);
    res.status(500).json({ error: err.message });
  }
};

