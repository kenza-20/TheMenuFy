const request = require('supertest');
const express = require('express');
const orderController = require('../controlleurs/orderController');
const Order = require('../models/orderModel');
const QRCode = require('qrcode');

jest.mock('../models/orderModel');
jest.mock('qrcode');

const app = express();
app.use(express.json());

// Routes
app.post('/orders', orderController.addOrder);
app.get('/orders/user/:id_user', orderController.getOrdersByUser);
app.get('/orders/table/:tableId', orderController.getOrdersByTable);
app.delete('/orders/:id_user/:price_id', orderController.deleteOrder);
app.delete('/orders/user/:id_user', orderController.deleteAllOrders);
app.put('/orders/increment/:id_user/:price_id', orderController.incrementQuantity);
app.put('/orders/decrement/:id_user/:price_id', orderController.decrementQuantity);
app.put('/orders/status/:id_user/:price_id', orderController.updateOrderStatus);
app.get('/orders/qr/:tableId', orderController.getOrdersByQRCode);
app.get('/orders/qrcode/generate/:tableId', orderController.generateQRCodeForTable);

describe('Order Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('addOrder - should create a new order', async () => {
    const orderData = { id_user: '123', price_id: 'abc', quantity: 2 };
    const savedOrder = { ...orderData, save: jest.fn().mockResolvedValue(orderData) };
    Order.mockImplementation(() => savedOrder);

    const res = await request(app).post('/orders').send(orderData);

    expect(res.statusCode).toBe(201);
    expect(res.body.id_user).toBe('123');
  });

  test('getOrdersByUser - should return orders for a user', async () => {
    Order.find.mockResolvedValue([{ id_user: '123' }]);

    const res = await request(app).get('/orders/user/123');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test('getOrdersByTable - no orders', async () => {
    Order.find.mockResolvedValue([]);

    const res = await request(app).get('/orders/table/456');

    expect(res.statusCode).toBe(404);
  });

  test('deleteOrder - should delete one order', async () => {
    Order.findOneAndDelete.mockResolvedValue({ id_user: '123', price_id: 'abc' });

    const res = await request(app).delete('/orders/123/abc');

    expect(res.statusCode).toBe(204);
  });

  test('deleteAllOrders - should delete all orders for a user', async () => {
    Order.deleteMany.mockResolvedValue({ deletedCount: 3 });

    const res = await request(app).delete('/orders/user/123');

    expect(res.statusCode).toBe(204);
  });

  test('incrementQuantity - should increment quantity', async () => {
    const mockOrder = { quantity: 1, save: jest.fn(), id_user: '123', price_id: 'abc' };
    Order.findOne.mockResolvedValue(mockOrder);

    const res = await request(app).put('/orders/increment/123/abc');

    expect(res.statusCode).toBe(200);
    expect(mockOrder.quantity).toBe(2);
  });

  test('decrementQuantity - should return error if quantity is 1', async () => {
    const mockOrder = { quantity: 1, save: jest.fn() };
    Order.findOne.mockResolvedValue(mockOrder);

    const res = await request(app).put('/orders/decrement/123/abc');

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Quantity can't be less than 1");
  });

  test('updateOrderStatus - should update status', async () => {
    const mockOrder = { status: 'pending', save: jest.fn() };
    Order.findOne.mockResolvedValue(mockOrder);

    const res = await request(app)
      .put('/orders/status/123/abc')
      .send({ status: 'preparing' });

    expect(res.statusCode).toBe(200);
    expect(mockOrder.status).toBe('preparing');
  });

  test('generateQRCodeForTable - should return base64 QR code', async () => {
    QRCode.toDataURL.mockImplementation((data, cb) => cb(null, 'data:image/png;base64,test'));

    const res = await request(app).get('/orders/qrcode/generate/42');

    expect(res.statusCode).toBe(200);
    expect(res.body.qrCodeImage).toBe('data:image/png;base64,test');
  });

  test('getOrdersByQRCode - should return orders by tableId', async () => {
    Order.find.mockResolvedValue([{ tableId: '42' }]);

    const res = await request(app).get('/orders/qr/42');

    expect(res.statusCode).toBe(200);
    expect(res.body[0].tableId).toBe('42');
  });
});
