const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

jest.mock('../emailService');
const sendEmail = require('../emailService');

// Controller et modèle
const userController = require('../controlleurs/userController');
const User = require('../models/userModel');

// Création d'une app Express pour les tests
const app = express();
app.use(express.json());
app.post('/api/signup', userController.signupUser);
app.post('/api/login', userController.login_post);
app.post('/api/logout', userController.logout);

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "verifyDB" });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await User.deleteMany();
    jest.clearAllMocks();
});

describe('User Controller Tests', () => {
    it('should register a new user and send verification email', async () => {
        const res = await request(app).post('/api/signup').send({
            name: 'Test',
            surname: 'User',
            email: 'test@example.com',
            password: 'Strong@123',
            role: 'client',
            tel: '1234567890'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe('test@example.com');
        expect(sendEmail).toHaveBeenCalledTimes(1);
    });

    it('should fail signup with weak password', async () => {
        const res = await request(app).post('/api/signup').send({
            name: 'Test',
            surname: 'User',
            email: 'test@example.com',
            password: 'weak',
            role: 'client',
            tel: '1234567890'
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/Password must be at least/);
    });

    it('should log in an existing user', async () => {
        const password = await bcrypt.hash('Strong@123', 10);
        await User.create({
            name: 'Test',
            surname: 'User',
            email: 'login@example.com',
            password,
            role: 'client',
            tel: '1234567890',
            confirmed: true,
            approved: true
        });

        const res = await request(app).post('/api/login').send({
            email: 'login@example.com',
            password: 'Strong@123'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    it('should block unconfirmed users from logging in', async () => {
        const password = await bcrypt.hash('Strong@123', 10);
        await User.create({
            name: 'Test',
            surname: 'User',
            email: 'unconfirmed@example.com',
            password,
            role: 'client',
            tel: '1234567890',
            confirmed: false,
            approved: true
        });

        const res = await request(app).post('/api/login').send({
            email: 'unconfirmed@example.com',
            password: 'Strong@123'
        });

        expect(res.statusCode).toBe(403);
        expect(res.body.message).toMatch(/confirmer votre compte/);
    });

    it('should logout a user by blacklisting token', async () => {
        const token = jwt.sign({ id: 'fakeId', role: 'client' }, process.env.JWT_SECRET || 'testsecret');
        const res = await request(app)
            .post('/api/logout')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/Déconnexion réussie/);
    });
});
