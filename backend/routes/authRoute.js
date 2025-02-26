const { Router } = require("express");
const authController = require("../controllers/authController");
const { signupUser } = require("../controllers/signupController");
const validate = require("../middl/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // ✅ Import jsonwebtoken
const User = require("../models/User"); // ✅ Import User model

const router = Router();

// Signup Route
router.post("/signup", signupUser);

// Login Route ✅ FIXED
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).json({ message: "Invalid credentials" });
        }

        // ✅ Generate JWT Token (Fixing error)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "your_secret_key", {
            expiresIn: "1h",
        });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Logout Route
router.post("/logout", authController.logout);

// Email Confirmation Route
router.get("/confirm/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ error: "Invalid confirmation link" });
        }

        if (user.confirmed) {
            return res.status(200).json({ message: "Your account is already confirmed" });
        }

        user.confirmed = true;
        await user.save();
        res.status(200).send(`<h2>Your email has been confirmed! You can now log in.</h2>`);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Delete User by Email Route ✅
router.delete("/delete/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOneAndDelete({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
