require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const port = 3000;

const chatRoute = require("./routes/chat");
const notificationRoutes = require('./routes/notificationRoute');
const voiceCommandsRoutes = require('./routes/voiceCommands');

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
const placedOrdersRoutes = require('./routes/placedOrdersRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const groupOrderRoutes = require('./routes/groupOrderRoutes');
const AnalyzerAndImageGeneratory = require('./routes/foodAnalyzer');
const culturalStory = require('./routes/culturalStory');

// Middleware
app.use(cors({
    origin: '*',  // URL de ton frontend
    //credentials: true, // Allow cookies and authentication headers
    //methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: 'Content-Type,Authorization',
})); // Enable CORS for frontend requests
app.use(express.json());

app.use('/api/notifications', notificationRoutes);
app.use('/api/user', userRoutes); 
app.use('/api/email', emailRoutes); 
app.use("/superAdmin",superAdminRoute)
app.use('/api/users', usersRoutes);  // /api/users pour gérer les utilisateurs
app.use('/api/payment', paymentRoutes);  // /api/users pour gérer les utilisateurs
app.use('/api/dish', dishRoutes); 
app.use('/api/recipes', recipeRoutes); 
app.use('/api/meals', mealRoutes); 
app.use('/api/favorites', favoritesRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', tipRoutes);
app.use('/api/placedOrders', placedOrdersRoutes);
app.use("/api/chat", chatRoute);
app.use('/api/weather', weatherRoutes);
app.use('/api/voice', voiceCommandsRoutes);
app.use('/api/group-orders', groupOrderRoutes);
app.use('/api/analyzer', AnalyzerAndImageGeneratory);
app.use('/api/cultural-story', culturalStory);

app.post('/webhook', (req, res) => {
  console.log("Requête reçue de Dialogflow :", req.body);
  res.json({ fulfillmentText: "Commande bien reçue !" });
});


    // Lancement du serveur
    app.listen(port, () => {
        console.log(` Serveur démarré sur http://localhost:${port}`);
    });
    
    
    // Connect to the MongoDB database
    mongoose.connect('mongodb://127.0.0.1:27017/PIWEB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("✅ Connected to MongoDB ");
      console.log("📂 Database Name:", mongoose.connection.name); // ← déplace ici !
    })
    .catch((err) => console.log("❌ MongoDB connection error:", err));
    

    
    
