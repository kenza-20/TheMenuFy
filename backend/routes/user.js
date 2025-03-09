const express = require('express');
const axios = require('axios');
const { validateUser } = require('../middleware/validateUser');
const userModel = require('../models/userModel');
const userController = require('../controlleurs/userController');
const nodemailer = require('nodemailer'); // For sending emails
const router = express.Router();
require('dotenv').config();

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// Setup Nodemailer for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Your Gmail email
        pass: process.env.EMAIL_PASS   // Your Gmail password
    }
});

router.post('/signup', validateUser, async (req, res) => {
    const { name, surname, email, password, role, recaptchaToken } = req.body;

    if (!recaptchaToken) {
        return res.status(400).json({ error: 'reCAPTCHA token is required' });
    }

    try {
        // Verify reCAPTCHA
        const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
            { params: { secret: RECAPTCHA_SECRET_KEY, response: recaptchaToken } }
        );

        if (!response.data.success) {
            return res.status(400).json({ error: 'reCAPTCHA verification failed' });
        }

        // Create user (but not confirmed)
        const newUser = new userModel({
            name,
            surname,
            email,
            password,
            role,
            confirmed: false // Default to false
        });

        await newUser.save();

        // Send confirmation email
        const confirmationLink = `http://localhost:3000/api/user/confirm/${newUser._id}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Confirmation',
            html: `<p>Click the link below to confirm your email:</p>
                   <a href="${confirmationLink}">${confirmationLink}</a>`
        });

        res.status(200).json({ message: 'Account created! Please confirm your email.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Email confirmation route
router.get('/confirm/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(400).json({ error: 'Invalid confirmation link' });
        }

        if (user.confirmed) {
            return res.status(200).json({ message: 'Your account is already confirmed' });
        }

        user.confirmed = true;
        await user.save();

        res.status(200).send('<h2>Your email has been confirmed! You can now log in.</h2>');
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

module.exports = router;
