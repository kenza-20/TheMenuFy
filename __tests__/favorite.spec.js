const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/userModel');
const Recipe = require('../models/Recipe');
const favoritesController = require('../controlleurs/favoritesController');

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Express app setup for testing
  app = express();
  app.use(bodyParser.json());

  // Route definitions for tests
  app.post('/favorites/add', favoritesController.addToFavorites);
  app.post('/favorites/remove', favoritesController.removeFromFavorites);
  app.get('/favorites/:userId', favoritesController.getUserFavorites);
  app.get('/favorites/check/:userId/:dishId', favoritesController.checkFavorite);
});

afterEach(async () => {
  await User.deleteMany();
  await Recipe.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Favorites Controller', () => {
  let userId;
  let dishId;

  beforeEach(async () => {
    // Creating a user and a recipe to test
    const user = await User.create({ username: 'testuser', email: 'testuser@example.com' });
    userId = user._id;

    const recipe = await Recipe.create({ name: 'Pizza', ingredients: ['cheese', 'tomato'] });
    dishId = recipe._id;
  });

  it('should add a dish to favorites', async () => {
    const response = await request(app)
      .post('/favorites/add')
      .send({ userId, dishId });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Dish added to favorites');
    expect(response.body.favorites).toContain(dishId.toString());
  });

  it('should return error if userId or dishId is missing', async () => {
    const response = await request(app)
      .post('/favorites/add')
      .send({ userId });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('User ID and Dish ID are required');
  });

  it('should not add a dish to favorites if it already exists', async () => {
    await request(app).post('/favorites/add').send({ userId, dishId });

    const response = await request(app)
      .post('/favorites/add')
      .send({ userId, dishId });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Dish already in favorites');
  });

  it('should remove a dish from favorites', async () => {
    await request(app).post('/favorites/add').send({ userId, dishId });

    const response = await request(app)
      .post('/favorites/remove')
      .send({ userId, dishId });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Dish removed from favorites');
    expect(response.body.favorites).not.toContain(dishId.toString());
  });

  it('should return error if dish is not in favorites when trying to remove it', async () => {
    const response = await request(app)
      .post('/favorites/remove')
      .send({ userId, dishId });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Dish not in favorites');
  });

  it('should get user favorites', async () => {
    await request(app).post('/favorites/add').send({ userId, dishId });

    const response = await request(app).get(`/favorites/${userId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.favorites.length).toBe(1);
    expect(response.body.favorites[0]._id.toString()).toBe(dishId.toString());
  });

  it('should return error if userId is invalid when getting favorites', async () => {
    const invalidUserId = 'invalidUserId';
    const response = await request(app).get(`/favorites/${invalidUserId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  it('should check if dish is in favorites', async () => {
    await request(app).post('/favorites/add').send({ userId, dishId });

    const response = await request(app).get(`/favorites/check/${userId}/${dishId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.isFavorite).toBe(true);
  });

  it('should return false if dish is not in favorites', async () => {
    const response = await request(app).get(`/favorites/check/${userId}/${dishId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.isFavorite).toBe(false);
  });
});
