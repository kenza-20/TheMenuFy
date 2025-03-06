
const express = require('express');
const app = express();
const port = 3000;
const authRoute = require('./routes/authRoute');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Importer les routes
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/users');

// Middleware pour gérer le JSON
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);  // /api/auth/login pour la connexion
app.use('/api/users', userRoutes);  // /api/users pour gérer les utilisateurs

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://localhost:27017/yourDatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.log(err));

// Lancer le serveur
app.listen(3000, () => {
  console.log('Serveur en écoute sur http://localhost:3000');
});

require('dotenv').config();

// Middleware pour parser le JSON
app.use(express.json());
app.use("/auth",authRoute)

// Lancement du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

app.use(cors());

// Connect to the MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/PIWEB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB');})
  .catch((err) => {
    console.log(err);
  });

app.use(cookieParser());

app.get('/set-cookies', (req, res) => {  
  res.cookie('newUser', false);
  res.send('you got the cookies!');
});

app.get('/read-cookies', (req, res) => {
  const cookies = req.cookies;
  console.log(cookies.newUser);
  res.json(cookies);

});