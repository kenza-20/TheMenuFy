require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const port = 3000;


const superAdminRoute = require('./routes/superAdminRoutes');
const userRoutes = require('./routes/user');
const emailRoutes = require('./routes/email'); 
const usersRoutes = require('./routes/adminRoute');
const paymentRoutes = require('./routes/paymentRoutes');
const dishRoutes = require('./routes/dish');
const recipeRoutes = require('./routes/RecipeRoutes');
const mealRoutes = require('./routes/MealRoutes');
const favoritesRoutes = require('./routes/favorites');
const orderRoutes = require('./routes/orderRoutes');
const tipRoutes = require('./routes/tipRoutes');

// Middleware
app.use(cors({
    origin: '*',  // URL de ton frontend
    //credentials: true, // Allow cookies and authentication headers
    //methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: 'Content-Type,Authorization',
})); // Enable CORS for frontend requests
app.use(express.json());


app.use('/api/user', userRoutes); 
app.use('/api/email', emailRoutes); 
app.use("/superAdmin",superAdminRoute)
app.use('/api/users', usersRoutes);  // /api/users pour gérer les utilisateurs
app.use('/api/payment', paymentRoutes);  // /api/users pour gérer les utilisateurs
app.use('/api/dish', dishRoutes); 
app.use('/api/recipe', recipeRoutes); 
app.use('/api/meals', mealRoutes); 
app.use('/api/favorites', favoritesRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', tipRoutes);

// Lancement du serveur
app.listen(port, () => {
    console.log(` Serveur démarré sur http://localhost:${port}`);
});



// Connect to MongoDB using .env variable
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB via .env'))
.catch(err => console.error('❌ Erreur de connexion à MongoDB:', err));



