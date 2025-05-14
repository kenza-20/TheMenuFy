const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const PlacedOrder = require('../models/PlacedOrder');
const User = require('../models/userModel');
const orderController = require('../controlleurs/placedOrderController');

const app = express();
app.use(express.json());
app.post('/api/orders', orderController.createOrder);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await PlacedOrder.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Order Controller - createOrder', () => {
  it('should create a new order and update user loyalty level', async () => {
    const user = await User.create({
      name: 'John',
      surname: 'Doe',
      email: 'john@example.com',
      password: 'Strong@123',
      role: 'client',
      tel: '1234567890',
      orderCount: 9 // This should push loyalty to Silver
    });

    const orderPayload = {
      userId: user._id.toString(),
      items: [{ name: 'Item 1', quantity: 2, price: 10 }],
      total: 20,
      noteCommande: 'Test note',
      isGroupOrder: true,
      groupOrderCode: 'GR123',
      groupOrderName: 'Birthday Group',
      groupOrderPaymentMethod: 'Credit Card',
      userPaymentAmount: 20,
      groupOrderTotalAmount: 100,
    };

    const res = await request(app).post('/api/orders').send(orderPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Order saved successfully');
    expect(res.body.order.total).toBe(20);
    expect(res.body.order.isGroupOrder).toBe(true);

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.orderCount).toBe(10);
    expect(updatedUser.loyaltyLevel).toBe('Silver');
  });

  it('should return 500 if order creation fails', async () => {
    const res = await request(app).post('/api/orders').send({
      // missing required fields
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Error saving order');
  });
});
