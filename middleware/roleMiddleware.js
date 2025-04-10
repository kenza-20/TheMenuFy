// middlewares/roleMiddleware.js
const isSuperAdmin = (req, res, next) => {
    // Vérifier que l'utilisateur connecté existe et a le rôle "superadmin"
    if (!req.user || req.user.role !== 'superAdmin') {
      return res.status(403).json({ message: 'Accès refusé, superadmin requis' });
    }
    next();
  };
  
  module.exports = { isSuperAdmin };
  