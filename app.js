const express = require('express');
const app = express();
const port = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Lancement du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://kenza:kenza2020@cluster0.65hm7.mongodb.net/themenufy?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error('Erreur de connexion', err)
);
