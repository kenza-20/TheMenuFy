const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validator = require("validator");
const bcrypt = require('bcrypt');
const sendEmail = require('../emailService');
require('dotenv').config();

// Generate Token
const createToken = (_id, role) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT Secret is missing! Define JWT_SECRET in your .env file.");
    }
    return jwt.sign({ _id, role }, process.env.JWT_SECRET, { expiresIn: '100d' });
};

const signupUser = async (req, res) => {
    const { name, surname, email, password, role } = req.body;

    try {
        if (!name || !surname || !email || !password || !role) {
            throw new Error('All fields must be filled');
        }
        if (!validator.isEmail(email)) {
            throw new Error('Email not valid');
        }
        if (!validator.isStrongPassword(password)) {
            throw new Error('Password must be at least 8 characters long, with uppercase, lowercase, number, and symbol');
        }

        const exists = await User.findOne({ email });
        if (exists) {
            throw new Error('Email already in use');
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const approved = role !== 'restaurant';
        const confirmed = false;

        const user = await User.create({ name, surname, email, password: hash, role, approved, confirmed });

        const token = createToken(user._id, user.role);

        if (role === 'restaurant' && !approved) {
            await sendEmail(email, "Approval Pending", 
                `<h3>Hello ${name},</h3>
                <p>Your account is pending admin approval. You'll receive an email once approved.</p>
                <p>Best regards,<br><strong>Themenufy Team</strong></p>`
            );

            return res.status(201).json({ 
                message: "Signup successful. Waiting for admin approval.", 
                token,
                userId: user._id,  
                role: user.role 
            });
        }

        res.status(200).json({ name, surname, email, role, token, userId: user._id, confirmed: user.confirmed });

        const confirmationUrl = `http://localhost:3000/auth/confirm/${user._id}`;
        await sendEmail(email, "Confirm Your Email", 
            `<h3>Welcome, ${name}!</h3>
            <p>Click the button below to confirm your email:</p>
            <a href="${confirmationUrl}" target="_blank">Confirm</a>
            <p>Best regards,<br><strong>Themenufy Team</strong></p>`     
        );

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { signupUser };
