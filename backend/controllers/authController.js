const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  login_post: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }

      if (user.role === 'restaurant' || user.approved === false) {
        return res.status(403).json({ message: "Connexion refusée. Attendez la validation de votre compte." });
      }

      if (user.confirmed === false) {
        return res.status(403).json({ message: "Connexion refusée. Vous devez confirmer votre compte." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Mot de passe incorrect.' });
      }

      // Generate a token if not already existing
      let token = user.token;
      if (!token) {
        token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        user.token = token;
        await user.save();
      }

      res.json({
        message: 'Connexion réussie.',
        token,
        id: user._id,
        email: user.email,
        role: user.role
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  logout: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(400).json({ message: "Token manquant." });
      }

      const user = await User.findOneAndUpdate({ token }, { token: null });

      if (!user) {
        return res.status(400).json({ message: "Token invalide ou déjà déconnecté." });
      }

      res.json({ message: "Déconnexion réussie." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur." });
    }
  }
};
