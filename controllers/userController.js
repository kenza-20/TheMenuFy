const User = require('../models/User'); 
const bcrypt = require('bcrypt');      
const jwt = require('jsonwebtoken');      

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Récupérer l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    
    // Vérifier si l'utilisateur est validé et confirmé
    if (user.role === 'restaurant' || user.approved === false) {
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

      // Générer un token JWT
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Réponse avec le token
      res.json({
        message: 'Connexion réussie.',
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};




const blacklist = new Set();
module.exports.logout = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Récupérer le token

  if (!token) {
    return res.status(400).json({ message: "Token manquant." });
  }

  blacklist.add(token); // Ajouter à la blacklist
  res.json({ message: "Déconnexion réussie." });
};

