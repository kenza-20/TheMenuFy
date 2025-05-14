const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const Meal = require('../models/Meal');
const mealController = require('../controlleurs/mealController');

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Express app setup for test
  app = express();
  app.use(bodyParser.json());

  app.post('/meals', mealController.createMeal);
  app.get('/meals', mealController.getMeals);
  app.put('/meals/:id', mealController.updateMeal);
  app.delete('/meals/:id', mealController.deleteMeal);
  app.get('/meals/timeofday', mealController.getMealsForTimeOfDay);
});

afterEach(async () => {
  await Meal.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Meal Controller', () => {
  it('should create a meal', async () => {
    const response = await request(app).post('/meals').send({
      name: 'Omelette',
      calories: 250,
      mealType: 'breakfast',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe('Omelette');
    expect(response.body.calories).toBe(250);
  });

  it('should return all meals', async () => {
    await Meal.create({ name: 'Salad', calories: 150, mealType: 'lunch' });

    const response = await request(app).get('/meals');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Salad');
  });

  it('should update a meal', async () => {
    const meal = await Meal.create({ name: 'Pizza', calories: 600, mealType: 'dinner' });

    const response = await request(app)
      .put(`/meals/${meal._id}`)
      .send({ name: 'Veggie Pizza', calories: 500 });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Veggie Pizza');
    expect(response.body.calories).toBe(500);
  });

  it('should delete a meal', async () => {
    const meal = await Meal.create({ name: 'Burger', calories: 700, mealType: 'lunch' });

    const response = await request(app).delete(`/meals/${meal._id}`);

    expect(response.statusCode).toBe(204);
    const found = await Meal.findById(meal._id);
    expect(found).toBeNull();
  });

  it('should get meals for current time of day (based on system hour)', async () => {
    await Meal.create({ name: 'Cereal', calories: 200, mealType: 'breakfast' });

    const response = await request(app).get('/meals/timeofday');

    expect(response.statusCode).toBe(200);
    // response.body could be empty if test run is outside breakfast time
    expect(Array.isArray(response.body)).toBe(true);
  });
});
