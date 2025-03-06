const User = require('../models/User'); // Modèle User
const bcrypt = require('bcrypt'); // Pour la vérification du mot de passe
const jwt = require('jsonwebtoken'); // Pour générer le token

const blacklist = new Set(); // Liste des tokens invalidés

// Connexion utilisateur
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Récupérer l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Vérifier si l'utilisateur est validé et confirmé
    if (user.role === 'resto' || user.validated === false) {
      return res.status(403).json({ message: "Connexion refusée. Il faut attendre la validation du compte." });
    }

    if (user.confirmed === false) {
      return res.status(403).json({ message: "Connexion refusée. Vous devez confirmer votre compte." });
    }

    // Comparer le mot de passe envoyé avec celui stocké dans la DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // Vérifier si un token existe dans la base de données
    if (!user.token) {
      return res.status(500).json({ message: "Aucun token trouvé. Veuillez réinitialiser votre compte." });
    }

    // Vérifier si le token est sur la blacklist (déjà déconnecté)
    if (blacklist.has(user.token)) {
      return res.status(403).json({ message: "Session expirée, veuillez vous reconnecter." });
    }

    // Retourner le token existant
    res.json({
      message: 'Connexion réussie.',
      token: user.token, // Utilisation du token existant
      id: user._id,
      email: user.email,
      role: user.role
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Déconnexion utilisateur
module.exports.logout = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Récupérer le token

  if (!token) {
    return res.status(400).json({ message: "Token manquant." });
  }

  // Ajouter à la blacklist
  blacklist.add(token);
  res.json({ message: "Déconnexion réussie." });
};
