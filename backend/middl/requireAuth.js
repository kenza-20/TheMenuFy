const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path if needed

const requireAuth = async (req, res, next) => {
    try {
        // Get token from request headers
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        // Extract and verify token
        const token = authorization.split(' ')[1]; // Expected format: "Bearer <token>"
        const decoded = jwt.verify(token, process.env.SECRET);

        // Find user by ID
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Attach user to request and move to the next middleware
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Request is not authorized' });
    }
};

module.exports = requireAuth;
