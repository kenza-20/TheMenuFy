const express = require('express');
const { signupUser, approveRestaurant } = require('../controlleurs/userController');
const requireAuth = require('../middleware/requireAuth'); // ✅ Corrected import
const User = require('../models/userModel'); // ✅ Import User model

const router = express.Router();

router.post('/signup', signupUser);

// ✅ If `approveRestaurant` handles approval logic, just use it
router.patch('/approve/:userId', requireAuth, approveRestaurant);
router.delete('/', async (req, res) => {
    try {
        const { email } = req.body; // Extract email from request body

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOneAndDelete({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
});
module.exports = router;
