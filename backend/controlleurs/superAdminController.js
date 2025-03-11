// controllers/superAdminController.js
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.updateProfileAndPassword = async (req, res) => {
  const { id } = req.params;

  if (!id || !req.body.name || !req.body.email) {
      return res.status(400).json({ message: "ID, name et email sont requis" });
  }

  try {
      const updatedAdmin = await User.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedAdmin) {
          return res.status(404).json({ message: "Admin non trouvé" });
      }
      res.json(updatedAdmin);
  } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
  }
};


exports.findByEmail = async (email) => {
  try {
    console.log("Recherche de l'utilisateur avec l'email :", email);
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    return user;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error.message);
    throw new Error("Erreur lors de la récupération de l'utilisateur");
  }
};



// Ajouter un nouvel admin (mais pas un superadmin)
exports.addAdmin = async (req, res) => {
  try {
    const { email, password, name,surname } = req.body; // On récupère aussi le nom
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
      surname,              
      role,
      approved: true,  
      confirmed: true,
      isBlocked: false,
      resetCode: "",  // Défini comme vide
      resetCodeExpiration: "" // Défini comme vide
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
    const { email, name, surname } = req.body;
    const updatedAdmin = await User.findByIdAndUpdate(
      id,
      { email, name, surname },
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
    admin.isBlocked = true;
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
    admin.isBlocked = false;
    await admin.save();
    res.json({ message: 'Admin débloqué', admin });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du déblocage de l’admin', error: error.message });
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await User.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin non trouvé' });
    }
    res.json({ admin });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l’admin', error: error.message });
  }
};
