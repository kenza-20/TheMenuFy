const express = require('express');
const app = express();
const port = 3000;
const authRoute = require('./routes/authRoute');
const cookieParser = require('cookie-parser');

require('dotenv').config();

// Middleware pour parser le JSON
app.use(express.json());
app.use("/auth",authRoute)

// Lancement du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://kenza:kenza2020@cluster0.65hm7.mongodb.net/themenufy?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error('Erreur de connexion', err)
);

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
