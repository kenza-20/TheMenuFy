const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const sendEmail = require('../emailService');

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
        const user = await User.signup(name, surname, email, password, confirmPassword, role);

        // If the user is a restaurant, they need admin approval
        if (role === 'restaurant') {
            await sendEmail(email, "Approval Pending", 
                `Hello ${name},\n\nYour account is pending approval from an admin. You'll receive an email once approved.\n\nBest regards,\nThemenufy Team`
            );
            return res.status(201).json({ 
                message: "Signup successful. Waiting for admin approval.", 
                userId: user._id,  // ✅ Ensure userId is included 
                role: user.role 
            });
        }

        // Generate JWT token
        const token = createToken(user._id, user.role);
        res.status(200).json({ 
            name, 
            surname, 
            email, 
            role, 
            token, 
            userId: user._id // ✅ Include user ID in response
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Admin Approves a Restaurant
const approveRestaurant = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.role !== 'restaurant') {
            return res.status(400).json({ error: "Only restaurant users require approval" });
        }

        user.approved = true;
        await user.save();

        // Send email notification to the restaurant
        await sendEmail(user.email, "Account Approved", 
            `Hello ${user.name},\n\nYour restaurant account has been approved! You can now log in.\n\nBest regards,\nThemenufy Team`
        );

        res.status(200).json({ message: "Restaurant approved successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { signupUser, approveRestaurant };
