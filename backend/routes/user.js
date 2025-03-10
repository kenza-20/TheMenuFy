const express = require('express');
const axios = require('axios');
const { validateUser } = require('../middleware/validateUser');
const { verifyToken } = require('../middleware/validateUser');
const multer = require('multer');

const userModel = require('../models/userModel');
const userController = require('../controlleurs/userController');
const nodemailer = require('nodemailer'); // For sending emails
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Find user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check if the user is confirmed
        if (!user.confirmed) {
            return res.status(400).json({ error: 'Please confirm your email before logging in' });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate a token (you can use JWT for this)
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8760h' });

        // Send response with the token
        res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


router.get('/profile', verifyToken, async (req, res) => {
    try {
        // Get user information from the database using the userId from the JWT
        const user = await userModel.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the user profile data
        res.status(200).json({
            name: user.name,
            surname: user.surname,
            email: user.email,
            role: user.role,
            confirmed: user.confirmed,
        });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Save files to 'uploads' folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname); // Make filenames unique
    },
  });
  
  const upload = multer({ storage });
  
  // Route to handle updating profile with image upload
  router.put('/update-profile', verifyToken, upload.single('image'), async (req, res) => {
    console.log("Received PUT /update-profile request");
    console.log("User ID:", req.user?.userId);
    console.log("Body Data:", req.body);
    console.log("File Uploaded:", req.file);

    const userId = req.user.userId; 
    const updatedData = req.body;
    const image = req.file ? req.file.path : null;

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId, { ...updatedData, profileImage: image }, { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
});

module.exports = router;
