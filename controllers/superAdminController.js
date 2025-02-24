// controllers/superAdminController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.updateProfileAndPassword = async (req, res) => {
  try {
    const { email, newPassword,name } = req.body;
    const updates = {};

    // Mise à jour de l'email si fourni
    if (email) {
      updates.email = email;
    }

    // Mise à jour de le nom si fourni
    if (name) {
      updates.nema = name;
    }

    // Mise à jour du mot de passe si fourni
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updates.password = hashedPassword;
    }

    // Vérifier s'il y a au moins une donnée à mettre à jour
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'Aucune donnée à mettre à jour' });
    }

    // Mise à jour de l'utilisateur connecté
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ message: 'Profil mis à jour', user: updatedUser });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la mise à jour du profil ou du mot de passe',
      error: error.message,
    });
  }
};

// Ajouter un nouvel admin (mais pas un superadmin)
exports.addAdmin = async (req, res) => {
  try {
    const { email, password, name } = req.body; // On récupère aussi le nom
    // Forcer le rôle à 'admin'
    const role = 'admin';

    // Vérification si l'email existe déjà
    const existant = await User.findOne({ email });
    if (existant) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création d'un nouvel admin incluant le name
    const newAdmin = new User({
      email,
      password: hashedPassword,
      name,              
      role,
      validated: true,   // Par défaut validé, adapter selon votre logique
      confirmed: true
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin ajouté avec succès', admin: newAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l’ajout de l’admin', error: error.message });
  }
};


// Modifier un admin
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    // Empêcher la modification d'un superadmin par ce contrôleur
    const admin = await User.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin non trouvé' });
    }
    if (admin.role === 'superadmin') {
      return res.status(403).json({ message: 'Impossible de modifier un superadmin' });
    }
    // On peut mettre à jour email, validated, etc.
    const { email, validated, confirmed } = req.body;
    const updatedAdmin = await User.findByIdAndUpdate(
      id,
      { email, validated, confirmed },
      { new: true }
    );
    res.json({ message: 'Admin mis à jour', admin: updatedAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification de l’admin', error: error.message });
  }
};

// Supprimer un admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await User.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin non trouvé' });
    }
    if (admin.role === 'superadmin') {
      return res.status(403).json({ message: 'Impossible de supprimer un superadmin' });
    }
    await User.findByIdAndDelete(id);
    res.json({ message: 'Admin supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l’admin', error: error.message });
  }
};

// Consulter tous les admins (sauf les superadmins)
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' });
    res.json({ admins });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des admins', error: error.message });
  }
};

// Bloquer un admin (exemple: mettre validated à false)
exports.blockAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await User.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin non trouvé' });
    }
    if (admin.role === 'superadmin') {
      return res.status(403).json({ message: 'Impossible de bloquer un superadmin' });
    }
    // Mettre validated à false pour bloquer
    admin.validated = false;
    await admin.save();
    res.json({ message: 'Admin bloqué', admin });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du blocage de l’admin', error: error.message });
  }
};

// Débloquer un admin (exemple: mettre validated à true)
exports.unblockAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await User.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin non trouvé' });
    }
    if (admin.role === 'superadmin') {
      return res.status(403).json({ message: 'Impossible de débloquer un superadmin' });
    }
    // Débloquer l'admin en mettant validated à true
    admin.validated = true;
    await admin.save();
    res.json({ message: 'Admin débloqué', admin });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du déblocage de l’admin', error: error.message });
  }
};

