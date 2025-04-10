const express = require('express');
const sendEmail = require('../emailService');

const router = express.Router();

// Email sending route
router.post('/send', async (req, res) => {
    const { to, subject, message } = req.body;  // Get data from request body

    if (!to || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    try {
        await sendEmail(to, subject, message);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send email' });
    }
});

module.exports = router;
