const request = require('supertest');
const express = require('express');
const checkoutController = require('../controlleurs/paymentController');

jest.mock('stripe'); // Mock Stripe
const Stripe = require('stripe');

const mockCreateSession = jest.fn();
Stripe.mockImplementation(() => ({
  checkout: {
    sessions: {
      create: mockCreateSession
    }
  }
}));

const app = express();
app.use(express.json());

// Routes
app.post('/checkout', checkoutController.checkout);
app.get('/checkout/success', checkoutController.checkoutSuccess);
app.get('/checkout/cancel', checkoutController.checkoutCancel);

describe('Stripe Checkout Controller', () => {
  beforeEach(() => {
    mockCreateSession.mockReset();
  });

  test('should create a stripe checkout session', async () => {
    const fakeSessionId = 'cs_test_123';
    mockCreateSession.mockResolvedValue({ id: fakeSessionId });

    const response = await request(app).post('/checkout').send({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'T-shirt' },
            unit_amount: 2000,
          },
          quantity: 1,
        }
      ]
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(fakeSessionId);
    expect(mockCreateSession).toHaveBeenCalled();
  });

  test('should handle checkout success', async () => {
    const response = await request(app).get('/checkout/success');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('success');
  });

  test('should handle checkout cancel', async () => {
    const response = await request(app).get('/checkout/cancel');
    expect(response.statusCode).toBe(204);
    expect(response.body.message).toBe('cancel');
  });

  test('should handle Stripe error gracefully', async () => {
    mockCreateSession.mockRejectedValue(new Error('Stripe error'));

    const response = await request(app).post('/checkout').send({
      line_items: [],
    });

    expect(response.statusCode).toBe(500);
  });
});
