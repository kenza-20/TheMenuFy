const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Generate Token
const createToken = (_id, role) => {
    if (!process.env.SECRET) {
        throw new Error("JWT Secret is missing! Make sure to define SECRET in your .env file.");
    }
    return jwt.sign({ _id, role }, process.env.SECRET, { expiresIn: '100d' });
};

// Send Email Function
const sendTokenEmail = async (email, token) => {
    try {
        // Configure the email sender
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail
                pass: process.env.EMAIL_PASS  // Your App Password
            }
        });

        // Email content
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Admin Token",
            text: `Hello,\n\nYour admin token for authentication is: ${token}\n\nUse this token for secure login.\n\nBest regards,\nThemenufy Team`
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully to", email);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

// Signup Function
const signupUser = async (req, res) => {
    const { email, password, confirmPassword, role } = req.body;

    try {
        const user = await User.signup(email, password, confirmPassword, role);

        // Generate JWT token
        const token = createToken(user._id, user.role);

        // If user is an admin, send token to restaurant via email
        if (role === 'admin') {
            await sendTokenEmail(email, token);
        }

        res.status(200).json({ email, role, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { signupUser };
