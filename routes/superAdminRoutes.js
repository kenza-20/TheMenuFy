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



/**
 * @swagger
 * tags:
 *   name: SuperAdmin
 *   description: Gestion des superadmins et des administrateurs
 * 
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *         isBlocked:
 *           type: boolean
 * 
 * paths:
 *   /superadmin/profile/{id}:
 *     put:
 *       summary: Mettre à jour le profil et le mot de passe d'un superadmin
 *       tags: [SuperAdmin]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 password:
 *                   type: string
 *       responses:
 *         200:
 *           description: Profil mis à jour avec succès
 *         404:
 *           description: Superadmin non trouvé
 * 
 *   /superadmin/getByEmail/{email}:
 *     get:
 *       summary: Récupérer un administrateur par son email
 *       tags: [SuperAdmin]
 *       parameters:
 *         - in: path
 *           name: email
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Administrateur trouvé
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Admin'
 *         404:
 *           description: Administrateur non trouvé
 * 
 *   /superadmin/admins:
 *     post:
 *       summary: Ajouter un administrateur
 *       tags: [SuperAdmin]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       responses:
 *         201:
 *           description: Administrateur ajouté avec succès
 *         400:
 *           description: Mauvaise requête (données invalides)
 * 
 *   /superadmin/admins/{id}:
 *     put:
 *       summary: Mettre à jour un administrateur
 *       tags: [SuperAdmin]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       responses:
 *         200:
 *           description: Administrateur mis à jour avec succès
 *         404:
 *           description: Administrateur non trouvé
 * 
 *   /superadmin/admins/{id}:
 *     delete:
 *       summary: Supprimer un administrateur
 *       tags: [SuperAdmin]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Administrateur supprimé avec succès
 *         404:
 *           description: Administrateur non trouvé
 * 
 *   /superadmin/admins:
 *     get:
 *       summary: Récupérer la liste de tous les administrateurs
 *       tags: [SuperAdmin]
 *       responses:
 *         200:
 *           description: Liste de tous les administrateurs
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Admin'
 * 
 *   /superadmin/admins/{id}/block:
 *     patch:
 *       summary: Bloquer un administrateur
 *       tags: [SuperAdmin]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Administrateur bloqué avec succès
 *         404:
 *           description: Administrateur non trouvé
 * 
 *   /superadmin/admins/{id}/unblock:
 *     patch:
 *       summary: Débloquer un administrateur
 *       tags: [SuperAdmin]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Administrateur débloqué avec succès
 *         404:
 *           description: Administrateur non trouvé
 * 
 *   /superadmin/admin/{id}:
 *     get:
 *       summary: Récupérer un administrateur par son ID
 *       tags: [SuperAdmin]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Détails de l'administrateur
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Admin'
 *         404:
 *           description: Administrateur non trouvé
 */
