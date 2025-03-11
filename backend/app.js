require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');


const app = express();
const port = 3000;

// Import Routes
const superAdminRoute = require('./routes/superAdminRoutes');
const userRoutes = require('./routes/user');
const emailRoutes = require('./routes/email'); 

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json());

// Routes
app.use('/api/user', userRoutes); 
app.use('/api/email', emailRoutes); 
app.use("/superAdmin", superAdminRoute);

// Database Connection
mongoose.connect('mongodb+srv://kenza:kenza2020@cluster0.65hm7.mongodb.net/themenufy?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ Database Connection Error:', err));

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
