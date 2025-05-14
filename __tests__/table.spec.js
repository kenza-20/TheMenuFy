const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const tableController = require('../controlleurs/tableController');
const Table = require('../models/TableModel');

const app = express();
app.use(express.json());

// Routes
app.post('/tables', tableController.addTable);
app.get('/tables', tableController.getTables);
app.get('/tables/:tableId', tableController.getTableById);
app.put('/tables/:tableId', tableController.updateTableStatus);
app.delete('/tables/:tableId', tableController.deleteTable);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Table.deleteMany(); // Clean DB after each test
});

describe('Table Controller', () => {
  test('should add a table', async () => {
    const res = await request(app)
      .post('/tables')
      .send({ tableId: 'T1', capacity: 4 });

    expect(res.statusCode).toBe(201);
    expect(res.body.tableId).toBe('T1');
    expect(res.body.capacity).toBe(4);
    expect(res.body.isOccupied).toBe(false);
  });

  test('should fetch all tables', async () => {
    await Table.create({ tableId: 'T2', capacity: 2 });
    const res = await request(app).get('/tables');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test('should fetch table by tableId', async () => {
    await Table.create({ tableId: 'T3', capacity: 6 });
    const res = await request(app).get('/tables/T3');
    expect(res.statusCode).toBe(200);
    expect(res.body.capacity).toBe(6);
  });

  test('should return 404 if table not found by ID', async () => {
    const res = await request(app).get('/tables/UNKNOWN');
    expect(res.statusCode).toBe(404);
  });

  test('should update table status', async () => {
    await Table.create({ tableId: 'T4', capacity: 2, isOccupied: false });
    const res = await request(app)
      .put('/tables/T4')
      .send({ isOccupied: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.isOccupied).toBe(true);
  });

  test('should delete a table', async () => {
    await Table.create({ tableId: 'T5', capacity: 2 });
    const res = await request(app).delete('/tables/T5');
    expect(res.statusCode).toBe(204);
  });

  test('should return 404 on deleting non-existing table', async () => {
    const res = await request(app).delete('/tables/DOESNOTEXIST');
    expect(res.statusCode).toBe(404);
  });
});
