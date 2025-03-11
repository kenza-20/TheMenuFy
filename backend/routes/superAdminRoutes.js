const express = require('express');
const router = express.Router();
const {getAdminById,findByEmail,updateProfileAndPassword,addAdmin,updateAdmin,deleteAdmin,getAllAdmins,blockAdmin,unblockAdmin} = require('../controlleurs/superAdminController');

// Middleware pour vérifier que l'utilisateur est authentifié et un superadmin
const { isSuperAdmin } = require('../middleware/roleMiddleware');

// Routes pour le superadmin
router.put('/profile/:id',  updateProfileAndPassword);
router.get("/getByEmail/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const user = await findByEmail(email);
  
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


// Routes pour la gestion des admins
router.post('/admins', addAdmin);
router.put('/admins/:id',  updateAdmin);
router.delete('/admins/:id', deleteAdmin);
router.get('/admins', getAllAdmins);
router.patch('/admins/:id/block', blockAdmin);
router.patch('/admins/:id/unblock',unblockAdmin);
router.get('/admin/:id',getAdminById);

module.exports = router;
