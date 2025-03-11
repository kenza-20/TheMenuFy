const express = require('express');
const router = express.Router();
const {updateProfileAndPassword,addAdmin,updateAdmin,deleteAdmin,getAllAdmins,blockAdmin,unblockAdmin} = require('../controlleurs/superAdminController');

// Middleware pour vérifier que l'utilisateur est authentifié et un superadmin
const { isSuperAdmin } = require('../middleware/roleMiddleware');

// Routes pour le superadmin
router.put('/profile',  updateProfileAndPassword);

// Routes pour la gestion des admins
router.post('/admins', isSuperAdmin, addAdmin);
router.put('/admins/:id', isSuperAdmin, updateAdmin);
router.delete('/admins/:id', isSuperAdmin, deleteAdmin);
router.get('/admins',isSuperAdmin, getAllAdmins);
router.patch('/admins/:id/block',  isSuperAdmin, blockAdmin);
router.patch('/admins/:id/unblock', isSuperAdmin, unblockAdmin);

module.exports = router;
