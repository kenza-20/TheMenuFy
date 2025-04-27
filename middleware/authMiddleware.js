const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // maintenant req.user contient les infos du user
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
};

module.exports = authenticate;
