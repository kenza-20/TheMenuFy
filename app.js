require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const authRoute = require('./routes/authRoute');
const superAdminRoute = require('./routes/superAdminRoutes');

const cookieParser = require('cookie-parser');

require('dotenv').config();


app.use(express.json());
app.use("/auth",authRoute)
app.use("/superAdmin",superAdminRoute)


const userRoutes = require('./routes/user');
const emailRoutes = require('./routes/email');  // Import the email routes

app.use('/api/user', userRoutes); 
app.use('/api/email', emailRoutes);  // Add email route


mongoose.connect('mongodb+srv://kenza:kenza2020@cluster0.65hm7.mongodb.net/themenufy?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log(' Connecté à MongoDB'))
    .catch(err => console.error(' Erreur de connexion', err));

// Lancement du serveur
app.listen(port, () => {
    console.log(` Serveur démarré sur http://localhost:${port}`);
});
