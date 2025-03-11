require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const superAdminRoute = require('./routes/superAdminRoutes');
const userRoutes = require('./routes/user');
const emailRoutes = require('./routes/email'); 
const usersRoutes = require('./routes/adminRoute');

const cors = require("cors");

require('dotenv').config();

app.use(cors()); // Active CORS pour toutes les origines
app.use(express.json());
app.use('/api/user', userRoutes); 
app.use('/api/email', emailRoutes); 
app.use("/superAdmin",superAdminRoute)
app.use('/api/users', usersRoutes);  // /api/users pour gérer les utilisateurs



mongoose.connect('mongodb+srv://kenza:kenza2020@cluster0.65hm7.mongodb.net/themenufy?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log(' Connecté à MongoDB'))
    .catch(err => console.error(' Erreur de connexion', err));

// Lancement du serveur
app.listen(port, () => {
    console.log(` Serveur démarré sur http://localhost:${port}`);
});
