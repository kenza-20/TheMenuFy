const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const sendEmail = require('../emailService');
require('dotenv').config();

// Generate Token
const createToken = (_id, role) => {
    if (!process.env.SECRET) {
        throw new Error("JWT Secret is missing! Make sure to define SECRET in your .env file.");
    }
    return jwt.sign({ _id, role }, process.env.SECRET, { expiresIn: '100d' });
};

// Signup Function
const signupUser = async (req, res) => {
    const { name, surname, email, password, confirmPassword, role } = req.body;

    try {
        const approved = role !== 'restaurant'; // Auto-approve unless restaurant
        const user = await User.signup(name, surname, email, password, confirmPassword, role, approved);

        // ✅ Generate token immediately, even if pending approval
        const token = createToken(user._id, user.role);

        if (role === 'restaurant' && !approved) {
            await sendEmail(email, "Approval Pending", 
                `<h3>Hello ${name},</h3>
                <p>Your account is pending admin approval. You'll receive an email once approved.</p>
                <p>Best regards,<br><strong>Themenufy Team</strong></p>`
            );

            return res.status(201).json({ 
                message: "Signup successful. Waiting for admin approval.", 
                token,  // ✅ Token is given even if pending
                userId: user._id,  
                role: user.role 
            });
        }

        // ✅ Welcome Email for Regular Users
        const loginUrl = `https://yourwebsite.com/login`; // Adjust to your login page URL
        await sendEmail(email, "Welcome to Themenufy!", 
            `<h3>Welcome, ${name}!</h3>
            <p>We're excited to have you on board.</p>
            <p>Click the button below to log in:</p>
            <table cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                    <td align="center" bgcolor="#007BFF" style="border-radius: 5px; padding: 10px;">
                        <a href="${loginUrl}" target="_blank" 
                           style="display: inline-block; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; background-color: #007BFF; padding: 10px 20px; border-radius: 5px;">
                           Login
                        </a>
                    </td>
                </tr>
            </table>
            <p>Best regards,<br><strong>Themenufy Team</strong></p>`     
        );

        res.status(200).json({ name, surname, email, role, token, userId: user._id });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Admin Approves a Restaurant
const approveRestaurant = async (req, res) => {
    const { userId } = req.params;
    console.log("Received userId:", userId); // ✅ Debug log

    try {
        if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
            return res.status(403).json({ error: 'Access denied. Only admins can approve users.' });
        }

        const user = await User.findById(userId);
        console.log("User found in DB:", user); // ✅ Debug log

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.approved = true;
        await user.save();

        await sendEmail(user.email, "Welcome to Themenufy!", 
            `<h3>Welcome, ${user.name}!</h3>
            <p>Your restaurant has been approved!</p>
            <p>Click below to log in:</p>
            <a href="https://yourwebsite.com/login">Login</a>`);

        res.status(200).json({ message: 'User approved successfully' });
    } catch (error) {
        console.error("Error approving user:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete User Function
const deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = { signupUser, approveRestaurant, deleteUser };
